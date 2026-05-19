import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { jsonOk } from "@/lib/api-helpers"

// Публичный список активных партнёров с их филаментами и принтерами —
// используется на странице расчёта, чтобы клиент мог выбрать конкретного партнёра.
export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const material = url.searchParams.get("material") || undefined
  const city = url.searchParams.get("city") || undefined

  const partners = await prisma.partner.findMany({
    where: {
      isActive: true,
      ...(city ? { city: { equals: city, mode: "insensitive" } } : {}),
      ...(material
        ? {
            filaments: { some: { type: material as any, isActive: true, stockGrams: { gt: 0 } } },
            printers: { some: { isActive: true, supportedMaterials: { has: material as any } } },
          }
        : {}),
    },
    select: {
      id: true,
      companyName: true,
      city: true,
      region: true,
      rating: true,
      filaments: {
        where: { isActive: true, ...(material ? { type: material as any } : {}) },
        select: {
          id: true,
          type: true,
          brand: true,
          colorName: true,
          colorHex: true,
          spoolPrice: true,
          spoolWeight: true,
        },
      },
      printers: {
        where: { isActive: true, ...(material ? { supportedMaterials: { has: material as any } } : {}) },
        select: {
          id: true,
          name: true,
          tech: true,
          buildX: true,
          buildY: true,
          buildZ: true,
        },
      },
    },
    orderBy: [{ rating: "desc" }],
    take: 100,
  })

  return jsonOk(partners)
}
