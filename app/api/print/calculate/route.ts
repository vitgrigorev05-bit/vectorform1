import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { calculatePrice } from "@/lib/pricing"
import { estimatePrint } from "@/lib/slicer"
import { DEFAULT_DENSITY } from "@/lib/material-recommender"

const schema = z.object({
  uploadedFileId: z.string().optional(),
  // или ручной ввод объёма (для моделей из маркетплейса)
  volumeCm3: z.number().positive().optional(),
  needsSupports: z.boolean().default(false),

  material: z.enum(["PLA", "PLA_PLUS", "PETG", "ABS", "ASA", "TPU", "NYLON", "RESIN", "OTHER"]),
  quality: z.enum(["DRAFT", "STANDARD", "HIGH", "ULTRA"]).default("STANDARD"),
  infillPct: z.number().int().min(0).max(100).default(20),
  quantity: z.number().int().positive().default(1),

  // Выбор партнёра и филамента. Если не задано — берём первого подходящего.
  partnerId: z.string().optional(),
  filamentId: z.string().optional(),
  printerId: z.string().optional(),

  shippingCost: z.number().nonnegative().optional(),
})

const DEFAULT_PLATFORM_FEE_PCT = 10

export async function POST(req: NextRequest) {
  try {
    const parsed = schema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? "Неверные данные" },
        { status: 400 },
      )
    }
    const input = parsed.data

    let volumeCm3 = input.volumeCm3
    let needsSupports = input.needsSupports
    if (input.uploadedFileId) {
      const f = await prisma.uploadedFile.findUnique({ where: { id: input.uploadedFileId } })
      if (!f) return NextResponse.json({ ok: false, error: "Файл не найден" }, { status: 404 })
      volumeCm3 = f.volumeCm3
      needsSupports = needsSupports || f.needsSupports
    }
    if (!volumeCm3 || volumeCm3 <= 0) {
      return NextResponse.json({ ok: false, error: "Не указан объём модели" }, { status: 400 })
    }

    // Выбираем партнёра: явный, либо первый активный с подходящим филаментом.
    const partner = await pickPartner({
      partnerId: input.partnerId,
      filamentId: input.filamentId,
      printerId: input.printerId,
      material: input.material,
    })
    if (!partner) {
      return NextResponse.json(
        { ok: false, error: "Нет доступных партнёров для выбранного материала" },
        { status: 404 },
      )
    }

    const filament =
      partner.filaments.find(f => f.id === input.filamentId) ??
      partner.filaments.find(f => f.type === input.material && f.isActive) ??
      null
    const printer =
      partner.printers.find(p => p.id === input.printerId) ??
      partner.printers.find(p => p.isActive && p.supportedMaterials.includes(input.material)) ??
      partner.printers[0]
    const pricing = partner.pricing

    if (!printer || !pricing) {
      return NextResponse.json(
        { ok: false, error: "У партнёра не настроены принтер или тарифы" },
        { status: 422 },
      )
    }

    const density = filament?.density ?? DEFAULT_DENSITY[input.material]
    const pricePerGram = filament
      ? Number(filament.spoolPrice) / Math.max(1, filament.spoolWeight)
      : defaultPricePerGram(input.material)

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
      electricityRate: Number(pricing.electricityRate),
      laborRate: Number(pricing.laborRate),
      consumablesPerHour: Number(pricing.consumablesPerHour),
      marginPct: Number(pricing.marginPct),
      wastePct: Number(pricing.wastePct),
      setupMinutes: pricing.setupMinutes,
      postProcessMinutes: pricing.postProcessMinutes,
      minOrderPrice: Number(pricing.minOrderPrice),
      defaultShipping: Number(pricing.defaultShipping),
      platformFeePct: DEFAULT_PLATFORM_FEE_PCT,
      shippingCost: input.shippingCost,
    })

    return NextResponse.json({
      ok: true,
      data: {
        partner: {
          id: partner.id,
          companyName: partner.companyName,
          city: partner.city,
          rating: partner.rating,
        },
        printer: { id: printer.id, name: printer.name, tech: printer.tech },
        filament: filament
          ? {
              id: filament.id,
              type: filament.type,
              brand: filament.brand,
              color: filament.colorName,
              pricePerGram: Number((Number(filament.spoolPrice) / filament.spoolWeight).toFixed(2)),
            }
          : null,
        estimate,
        breakdown,
      },
    })
  } catch (e) {
    console.error("calc error", e)
    return NextResponse.json({ ok: false, error: "Ошибка при расчёте" }, { status: 500 })
  }
}

async function pickPartner(opts: {
  partnerId?: string
  filamentId?: string
  printerId?: string
  material: string
}) {
  if (opts.partnerId) {
    return prisma.partner.findFirst({
      where: { id: opts.partnerId, isActive: true },
      include: { pricing: true, printers: true, filaments: true },
    })
  }
  if (opts.filamentId) {
    const f = await prisma.filament.findUnique({
      where: { id: opts.filamentId },
      include: { partner: { include: { pricing: true, printers: true, filaments: true } } },
    })
    return f?.partner ?? null
  }
  // первый подходящий партнёр с активным филаментом нужного типа и принтером, его поддерживающим
  return prisma.partner.findFirst({
    where: {
      isActive: true,
      pricing: { isNot: null },
      filaments: { some: { type: opts.material as any, isActive: true, stockGrams: { gt: 0 } } },
      printers: { some: { isActive: true, supportedMaterials: { has: opts.material as any } } },
    },
    orderBy: [{ rating: "desc" }, { createdAt: "asc" }],
    include: { pricing: true, printers: true, filaments: true },
  })
}

// Фоллбек, если ни у одного партнёра нет филамента — публичные средние цены ₽/г
function defaultPricePerGram(material: string): number {
  const m: Record<string, number> = {
    PLA: 1.5,
    PLA_PLUS: 1.7,
    PETG: 1.75,
    ABS: 1.5,
    ASA: 2.2,
    TPU: 2.75,
    NYLON: 4,
    RESIN: 3.5,
    OTHER: 2,
  }
  return m[material] ?? 2
}
