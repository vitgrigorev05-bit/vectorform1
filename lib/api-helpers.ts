import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import type { UserRole } from "@prisma/client"

export async function requireSession() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return { error: NextResponse.json({ ok: false, error: "Требуется вход" }, { status: 401 }) }
  }
  return { session }
}

export async function requireRole(...roles: UserRole[]) {
  const { session, error } = await requireSession()
  if (error) return { error }
  if (!roles.includes(session!.user.role)) {
    return { error: NextResponse.json({ ok: false, error: "Нет прав" }, { status: 403 }) }
  }
  return { session: session! }
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status })
}

export function jsonOk<T>(data: T) {
  return NextResponse.json({ ok: true, data })
}
