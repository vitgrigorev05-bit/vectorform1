import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { randomUUID } from "crypto"
import { parseStl } from "@/lib/slicer"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const MAX_BYTES = 60 * 1024 * 1024 // 60 MB

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get("file") as File | null
    if (!file) return NextResponse.json({ ok: false, error: "Файл не найден" }, { status: 400 })
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ ok: false, error: "Файл больше 60 МБ" }, { status: 413 })
    }

    const ext = (file.name.split(".").pop() ?? "").toLowerCase()
    if (ext !== "stl") {
      return NextResponse.json(
        { ok: false, error: "Пока поддерживается только STL. 3MF/OBJ — в следующих релизах." },
        { status: 415 },
      )
    }

    const buffer = await file.arrayBuffer()

    let analysis
    try {
      analysis = parseStl(buffer)
    } catch (e) {
      return NextResponse.json(
        { ok: false, error: `Не удалось разобрать STL: ${(e as Error).message}` },
        { status: 400 },
      )
    }

    // Сохраняем файл локально. На проде заменить на S3/R2.
    const id = randomUUID()
    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    await mkdir(uploadsDir, { recursive: true })
    const safeName = `${id}.stl`
    const filePath = path.join(uploadsDir, safeName)
    await writeFile(filePath, Buffer.from(buffer))
    const fileUrl = `/uploads/${safeName}`

    const session = await getServerSession(authOptions)

    const record = await prisma.uploadedFile.create({
      data: {
        userId: session?.user?.id ?? null,
        fileName: file.name,
        fileUrl,
        fileType: "STL",
        fileSize: file.size,
        volumeCm3: analysis.volumeCm3,
        bboxX: analysis.bbox.x,
        bboxY: analysis.bbox.y,
        bboxZ: analysis.bbox.z,
        surfaceArea: analysis.surfaceArea,
        triangleCount: analysis.triangleCount,
        needsSupports: analysis.needsSupports,
        isValid: analysis.volumeCm3 > 0 && analysis.triangleCount > 4,
        issues:
          analysis.volumeCm3 === 0
            ? [{ type: "EMPTY", severity: "high", message: "Модель пуста или не замкнута" }]
            : undefined,
      },
    })

    return NextResponse.json({
      ok: true,
      data: {
        fileId: record.id,
        url: record.fileUrl,
        fileName: record.fileName,
        analysis: {
          volumeCm3: record.volumeCm3,
          bbox: { x: record.bboxX, y: record.bboxY, z: record.bboxZ },
          surfaceArea: record.surfaceArea,
          triangleCount: record.triangleCount,
          needsSupports: record.needsSupports,
          isValid: record.isValid,
        },
      },
    })
  } catch (e) {
    console.error("upload error", e)
    return NextResponse.json({ ok: false, error: "Ошибка при загрузке файла" }, { status: 500 })
  }
}
