import { NextRequest } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireRole, jsonError, jsonOk } from "@/lib/api-helpers"

const printerSchema = z.object({
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

export async function GET() {
  const { session, error } = await requireRole("PARTNER", "ADMIN")
  if (error) return error
  const partner = await prisma.partner.findUnique({ where: { userId: session.user.id } })
  if (!partner) return jsonError("Профиль партнёра не найден", 404)
  const printers = await prisma.printerProfile.findMany({
    where: { partnerId: partner.id },
    orderBy: { createdAt: "desc" },
  })
  return jsonOk(printers)
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireRole("PARTNER", "ADMIN")
  if (error) return error
  const parsed = printerSchema.safeParse(await req.json())
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Неверные данные")
  const partner = await prisma.partner.findUnique({ where: { userId: session.user.id } })
  if (!partner) return jsonError("Профиль партнёра не найден", 404)
  const created = await prisma.printerProfile.create({
    data: { partnerId: partner.id, ...parsed.data },
  })
  return jsonOk(created)
}
