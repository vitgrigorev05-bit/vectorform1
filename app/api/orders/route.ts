import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireSession, jsonError, jsonOk } from "@/lib/api-helpers"
import { estimatePrint } from "@/lib/slicer"
import { calculatePrice } from "@/lib/pricing"
import { DEFAULT_DENSITY } from "@/lib/material-recommender"
import { generateOrderNumber } from "@/lib/utils"

const orderSchema = z.object({
  uploadedFileId: z.string().optional(),
  modelId: z.string().optional(),
  partnerId: z.string(),
  filamentId: z.string().optional(),
  printerId: z.string().optional(),
  material: z.enum(["PLA", "PLA_PLUS", "PETG", "ABS", "ASA", "TPU", "NYLON", "RESIN", "OTHER"]),
  quality: z.enum(["DRAFT", "STANDARD", "HIGH", "ULTRA"]).default("STANDARD"),
  infillPct: z.number().int().min(0).max(100).default(20),
  quantity: z.number().int().positive().default(1),
  color: z.string().optional(),
  shippingAddress: z.object({
    fullName: z.string().min(2),
    addressLine1: z.string().min(3),
    addressLine2: z.string().optional(),
    city: z.string().min(2),
    region: z.string().optional(),
    postalCode: z.string().min(3),
    country: z.string().default("RU"),
    phone: z.string().optional(),
  }),
  customerNotes: z.string().optional(),
})

const DEFAULT_PLATFORM_FEE_PCT = 10

export async function POST(req: NextRequest) {
  const { session, error } = await requireSession()
  if (error) return error

  const parsed = orderSchema.safeParse(await req.json())
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Неверные данные")
  const input = parsed.data

  // Источник объёма
  let volumeCm3 = 0
  let needsSupports = false
  if (input.uploadedFileId) {
    const f = await prisma.uploadedFile.findUnique({ where: { id: input.uploadedFileId } })
    if (!f) return jsonError("Загруженный файл не найден", 404)
    volumeCm3 = f.volumeCm3
    needsSupports = f.needsSupports
  } else if (input.modelId) {
    const m = await prisma.model3D.findUnique({ where: { id: input.modelId } })
    if (!m) return jsonError("Модель не найдена", 404)
    volumeCm3 = m.volume
  } else {
    return jsonError("Нужен uploadedFileId или modelId")
  }

  const partner = await prisma.partner.findUnique({
    where: { id: input.partnerId },
    include: { pricing: true, printers: true, filaments: true },
  })
  if (!partner || !partner.pricing) return jsonError("Партнёр недоступен", 404)

  const filament =
    partner.filaments.find(f => f.id === input.filamentId) ??
    partner.filaments.find(f => f.type === input.material && f.isActive)
  const printer =
    partner.printers.find(p => p.id === input.printerId) ??
    partner.printers.find(p => p.isActive && p.supportedMaterials.includes(input.material))
  if (!printer) return jsonError("У партнёра нет принтера для выбранного материала", 422)

  const density = filament?.density ?? DEFAULT_DENSITY[input.material]
  const pricePerGram = filament
    ? Number(filament.spoolPrice) / Math.max(1, filament.spoolWeight)
    : 2.0

  const estimate = estimatePrint({
    volumeCm3,
    density,
    infillPct: input.infillPct,
    quality: input.quality,
    volumetricSpeedMmPerSec: printer.volumetricSpeed,
    needsSupports,
    quantity: input.quantity,
  })

  const breakdown = calculatePrice({
    weightGrams: estimate.weightGrams,
    printHours: estimate.printHours,
    pricePerGram,
    powerWatts: printer.powerWatts,
    purchasePrice: Number(printer.purchasePrice),
    lifetimeHours: printer.lifetimeHours,
    electricityRate: Number(partner.pricing.electricityRate),
    laborRate: Number(partner.pricing.laborRate),
    consumablesPerHour: Number(partner.pricing.consumablesPerHour),
    marginPct: Number(partner.pricing.marginPct),
    wastePct: Number(partner.pricing.wastePct),
    setupMinutes: partner.pricing.setupMinutes,
    postProcessMinutes: partner.pricing.postProcessMinutes,
    minOrderPrice: Number(partner.pricing.minOrderPrice),
    defaultShipping: Number(partner.pricing.defaultShipping),
    platformFeePct: DEFAULT_PLATFORM_FEE_PCT,
  })

  const order = await prisma.$transaction(async tx => {
    const created = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerId: session.user.id,
        modelId: input.modelId ?? null,
        uploadedFileId: input.uploadedFileId ?? null,
        status: "PENDING_PAYMENT",
        material: input.material,
        filamentId: filament?.id ?? null,
        color: input.color ?? filament?.colorName ?? null,
        quality: input.quality,
        infillPct: input.infillPct,
        quantity: input.quantity,
        scale: 1.0,
        totalAmount: breakdown.subtotal,
        shippingAmount: breakdown.shippingCost,
        finalAmount: breakdown.total,
        shippingAddress: input.shippingAddress,
        customerNotes: input.customerNotes,
        estimatedPrintHours: estimate.printHours,
        printedByPartnerId: partner.id,
        assignedAt: new Date(),
      },
    })
    await tx.printCalculation.create({
      data: {
        orderId: created.id,
        volumeCm3,
        weightGrams: estimate.weightGrams,
        printHours: estimate.printHours,
        materialDensity: density,
        pricePerGram,
        powerWatts: printer.powerWatts,
        electricityRate: Number(partner.pricing!.electricityRate),
        amortizationPerHour: breakdown.amortizationPerHour,
        laborRate: Number(partner.pricing!.laborRate),
        consumablesPerHour: Number(partner.pricing!.consumablesPerHour),
        marginPct: Number(partner.pricing!.marginPct),
        platformFeePct: DEFAULT_PLATFORM_FEE_PCT,
        wastePct: Number(partner.pricing!.wastePct),
        materialCost: breakdown.materialCost,
        electricityCost: breakdown.electricityCost,
        amortizationCost: breakdown.amortizationCost,
        laborCost: breakdown.laborCost,
        consumablesCost: breakdown.consumablesCost,
        wasteCost: breakdown.wasteCost,
        costBase: breakdown.costBase,
        partnerMargin: breakdown.partnerMargin,
        platformFee: breakdown.platformFee,
        shippingCost: breakdown.shippingCost,
        subtotal: breakdown.subtotal,
        total: breakdown.total,
      },
    })
    await tx.orderAssignment.create({
      data: {
        orderId: created.id,
        partnerId: partner.id,
        proposedPrice: breakdown.partnerPrice,
        status: "PENDING",
      },
    })
    return created
  })

  return jsonOk({ orderId: order.id, orderNumber: order.orderNumber, finalAmount: order.finalAmount })
}

export async function GET() {
  const { session, error } = await requireSession()
  if (error) return error
  const orders = await prisma.order.findMany({
    where: { customerId: session.user.id },
    include: { calculation: true, printedBy: { select: { companyName: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  })
  return jsonOk(orders)
}
