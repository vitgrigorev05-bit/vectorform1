import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { z } from "zod"
import { prisma } from "@/lib/prisma"

const schema = z.object({
  email: z.string().email("Неверный email"),
  password: z.string().min(8, "Минимум 8 символов"),
  name: z.string().min(2, "Минимум 2 символа").optional(),
  role: z.enum(["CUSTOMER", "AUTHOR", "PARTNER"]).default("CUSTOMER"),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? "Неверные данные" },
        { status: 400 },
      )
    }
    const { email, password, name, role } = parsed.data
    const normalized = email.toLowerCase()

    const exists = await prisma.user.findUnique({ where: { email: normalized } })
    if (exists) {
      return NextResponse.json(
        { ok: false, error: "Пользователь с таким email уже зарегистрирован" },
        { status: 409 },
      )
    }

    const passwordHash = await hash(password, 12)
    const user = await prisma.user.create({
      data: { email: normalized, name, passwordHash, role },
      select: { id: true, email: true, name: true, role: true },
    })

    if (role === "AUTHOR") {
      await prisma.author.create({ data: { userId: user.id } })
    }
    // Партнёр создаёт профиль отдельным шагом мастера регистрации (адрес, тарифы и т.д.)

    return NextResponse.json({ ok: true, user })
  } catch (e) {
    console.error("register error", e)
    return NextResponse.json({ ok: false, error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}
