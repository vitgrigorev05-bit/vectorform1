import { NextRequest } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireRole, jsonError, jsonOk } from "@/lib/api-helpers"

const updateSchema = z.object({
  electricityRate: z.number().positive().optional(),
  laborRate: z.number().nonnegative().optional(),
  consumablesPerHour: z.number().nonnegative().optional(),
  marginPct: z.number().min(0).max(500).optional(),
  minOrderPrice: z.number().nonnegative().optional(),
  setupMinutes: z.number().int().min(0).optional(),
  postProcessMinutes: z.number().int().min(0).optional(),
  wastePct: z.number().min(0).max(50).optional(),
  defaultShipping: z.number().nonnegative().optional(),
})

export async function GET() {
  const { session, error } = await requireRole("PARTNER", "ADMIN")
  if (error) return error
  const partner = await prisma.partner.findUnique({
    where: { userId: session.user.id },
    include: { pricing: true },
  })
  if (!partner) return jsonError("Профиль партнёра не найден", 404)
  return jsonOk(partner.pricing)
}

export async function PATCH(req: NextRequest) {
  const { session, error } = await requireRole("PARTNER", "ADMIN")
  if (error) return error
  const parsed = updateSchema.safeParse(await req.json())
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Неверные данные")

  const partner = await prisma.partner.findUnique({ where: { userId: session.user.id } })
  if (!partner) return jsonError("Профиль партнёра не найден", 404)

  const updated = await prisma.partnerPricing.update({
    where: { partnerId: partner.id },
    data: parsed.data,
  })
  return jsonOk(updated)
}
