import { NextRequest, NextResponse } from "next/server"
import { MATERIAL_QUESTIONS, recommendMaterial, MATERIAL_LABELS } from "@/lib/material-recommender"

// GET — отдаёт UI список вопросов и опций
export async function GET() {
  return NextResponse.json({ ok: true, data: { questions: MATERIAL_QUESTIONS, labels: MATERIAL_LABELS } })
}

// POST { answers: { purpose: "decor", properties: ["strong","looks"], ... } }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = recommendMaterial(body?.answers ?? {})
    return NextResponse.json({ ok: true, data: result })
  } catch (e) {
    return NextResponse.json({ ok: false, error: "Неверные данные опросника" }, { status: 400 })
  }
}
