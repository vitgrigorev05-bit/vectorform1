import { NextRequest } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireRole, jsonError, jsonOk } from "@/lib/api-helpers"

const filamentSchema = z.object({
  type: z.enum(["PLA", "PLA_PLUS", "PETG", "ABS", "ASA", "TPU", "NYLON", "RESIN", "OTHER"]),
  brand: z.string().optional(),
  colorName: z.string().min(1),
  colorHex: z.string().optional(),
  spoolPrice: z.number().positive(),
  spoolWeight: z.number().int().positive().default(1000),
  density: z.number().positive().default(1.24),
  stockGrams: z.number().int().nonnegative().default(1000),
})

export async function GET() {
  const { session, error } = await requireRole("PARTNER", "ADMIN")
  if (error) return error
  const partner = await prisma.partner.findUnique({ where: { userId: session.user.id } })
  if (!partner) return jsonError("Профиль партнёра не найден", 404)
  const filaments = await prisma.filament.findMany({
    where: { partnerId: partner.id },
    orderBy: { createdAt: "desc" },
  })
  return jsonOk(filaments)
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireRole("PARTNER", "ADMIN")
  if (error) return error
  const parsed = filamentSchema.safeParse(await req.json())
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Неверные данные")
  const partner = await prisma.partner.findUnique({ where: { userId: session.user.id } })
  if (!partner) return jsonError("Профиль партнёра не найден", 404)
  const created = await prisma.filament.create({
    data: { partnerId: partner.id, ...parsed.data },
  })
  return jsonOk(created)
}
