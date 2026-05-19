import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireSession, jsonError, jsonOk } from "@/lib/api-helpers"

// Полный мастер регистрации партнёра в одном запросе:
// компания + тарифы + (опционально) первый принтер и филамент.
// Все эти значения станут источником для калькулятора стоимости.
const schema = z.object({
  company: z.object({
    companyName: z.string().min(2),
    description: z.string().optional(),
    address: z.string().min(3),
    city: z.string().min(2),
    region: z.string().optional(),
    country: z.string().default("RU"),
    postalCode: z.string().min(3),
    phone: z.string().optional(),
  }),
  pricing: z.object({
    electricityRate: z.number().positive(),
    laborRate: z.number().nonnegative(),
    consumablesPerHour: z.number().nonnegative().default(5),
    marginPct: z.number().min(0).max(500),
    minOrderPrice: z.number().nonnegative().default(300),
    setupMinutes: z.number().int().min(0).default(15),
    postProcessMinutes: z.number().int().min(0).default(10),
    wastePct: z.number().min(0).max(50).default(7),
    defaultShipping: z.number().nonnegative().default(350),
  }),
  printer: z
    .object({
      name: z.string().min(2),
      tech: z.enum(["FDM", "SLA", "SLS", "MJF"]).default("FDM"),
      buildX: z.number().positive(),
      buildY: z.number().positive(),
      buildZ: z.number().positive(),
      powerWatts: z.number().int().positive().default(120),
      purchasePrice: z.number().positive(),
      lifetimeHours: z.number().int().positive().default(5000),
      volumetricSpeed: z.number().positive().default(12),
      supportedMaterials: z
        .array(z.enum(["PLA", "PLA_PLUS", "PETG", "ABS", "ASA", "TPU", "NYLON", "RESIN", "OTHER"]))
        .min(1),
    })
    .optional(),
  filament: z
    .object({
      type: z.enum(["PLA", "PLA_PLUS", "PETG", "ABS", "ASA", "TPU", "NYLON", "RESIN", "OTHER"]),
      brand: z.string().optional(),
      colorName: z.string().min(1),
      colorHex: z.string().optional(),
      spoolPrice: z.number().positive(),
      spoolWeight: z.number().int().positive().default(1000),
      density: z.number().positive().default(1.24),
      stockGrams: z.number().int().nonnegative().default(1000),
    })
    .optional(),
})

export async function POST(req: NextRequest) {
  const { session, error } = await requireSession()
  if (error) return error

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Неверные данные")
  }

  const exists = await prisma.partner.findUnique({ where: { userId: session!.user.id } })
  if (exists) return jsonError("Профиль партнёра уже существует", 409)

  try {
    const result = await prisma.$transaction(async tx => {
      const partner = await tx.partner.create({
        data: {
          userId: session!.user.id,
          ...parsed.data.company,
        },
      })
      await tx.partnerPricing.create({
        data: { partnerId: partner.id, ...parsed.data.pricing },
      })
      if (parsed.data.printer) {
        await tx.printerProfile.create({
          data: { partnerId: partner.id, ...parsed.data.printer },
        })
      }
      if (parsed.data.filament) {
        await tx.filament.create({
          data: { partnerId: partner.id, ...parsed.data.filament },
        })
      }
      await tx.user.update({
        where: { id: session!.user.id },
        data: { role: "PARTNER" },
      })
      return partner
    })

    return jsonOk({ partnerId: result.id })
  } catch (e) {
    console.error("partner register error", e)
    return NextResponse.json({ ok: false, error: "Ошибка при создании профиля" }, { status: 500 })
  }
}
