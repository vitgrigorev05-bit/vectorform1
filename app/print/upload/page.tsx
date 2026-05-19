"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { OrderStepBar } from "@/components/sf/step-bar"
import { ScreenMeta, DataRow, SfChip } from "@/components/sf/screen-meta"
import { useToast } from "@/hooks/use-toast"
import { ArrowRight, Upload as UploadIcon, ShoppingBag, Sparkles, RefreshCw } from "lucide-react"

// Экран 04 макета: загрузка STL, drag-and-drop, мгновенный анализ геометрии,
// 4 превью (TOP/FRONT/SIDE/ISO) и сводка справа.

export default function UploadPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)
  const [fileId, setFileId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function upload(f: File) {
    setLoading(true)
    setFile(f)
    try {
      const form = new FormData()
      form.append("file", f)
      const res = await fetch("/api/upload", { method: "POST", body: form })
      const body = await res.json()
      if (!res.ok) {
        toast({ title: "Ошибка загрузки", description: body?.error ?? "—", variant: "destructive" })
        setFile(null)
        return
      }
      setAnalysis(body.data.analysis)
      setFileId(body.data.fileId)
      toast({ title: "Файл загружен", description: `Объём ${body.data.analysis.volumeCm3.toFixed(1)} см³` })
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setFile(null)
    setAnalysis(null)
    setFileId(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <>
      <OrderStepBar current={1} />
      <div className="container py-12">
        <ScreenMeta left="Превью" right="Шаг 1 / 6" />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,360px] gap-8">
          <div>
            <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.95]">
              Загрузи <span className="text-sf-red">3D-модель</span>
            </h1>
            <p className="text-sf-dim mt-4 max-w-2xl leading-relaxed">
              Поддержка STL, OBJ, 3MF, STEP. Максимум 60 МБ.
              Файл анализируется на ошибки геометрии за 4 секунды.
            </p>

            {!file && (
              <label
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) upload(f) }}
                className="mt-8 block sf-card border-dashed border-2 border-sf-line hover:border-sf-red transition-colors cursor-pointer p-16 text-center"
              >
                <input ref={inputRef} type="file" accept=".stl" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) upload(f) }} />
                <UploadIcon className="h-12 w-12 mx-auto text-sf-red" />
                <div className="mt-6 font-display text-2xl uppercase">Перетащи файл или нажми</div>
                <p className="text-sf-dim text-sm mt-3">CONCEPT_V3.STL — пример. Можно сразу с рабочего стола.</p>
              </label>
            )}

            {file && (
              <div className="mt-8 sf-card p-6">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <SfChip variant="red">{(file.name.split(".").pop() ?? "STL").toUpperCase()}</SfChip>
                      <span className="font-display text-lg">{file.name}</span>
                    </div>
                    {analysis && (
                      <div className="text-xs font-mono uppercase tracking-[0.2em] text-sf-dim mt-2">
                        {(file.size / 1024 / 1024).toFixed(1)} МБ · {analysis.triangleCount?.toLocaleString("ru-RU")} полигонов · Геометрия {analysis.isValid ? "OK" : "битая"}
                      </div>
                    )}
                  </div>
                  <button onClick={reset} className="sf-btn-ghost text-xs">
                    <RefreshCw className="h-3 w-3" /> Заменить
                  </button>
                </div>

                {loading && <div className="mt-6 text-sf-dim">Анализ…</div>}

                {analysis && (
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-px bg-sf-line border border-sf-line">
                    {[
                      ["Объём", `${analysis.volumeCm3.toFixed(0)} см³`],
                      ["Габариты", `${Math.round(analysis.bbox.x)}×${Math.round(analysis.bbox.y)}×${Math.round(analysis.bbox.z)}`],
                      ["Полигоны", analysis.triangleCount?.toLocaleString("ru-RU") ?? "—"],
                      ["Дефекты", analysis.isValid ? "Нет" : "Есть"],
                    ].map(([l, v]) => (
                      <div key={l} className="bg-sf-bg p-4">
                        <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-sf-dim">{l}</div>
                        <div className="font-display text-xl mt-1">{v}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4 view chips like in mockup */}
            <div className="mt-6 flex gap-2">
              {["TOP", "FRONT", "SIDE", "ISO"].map(v => (
                <span key={v} className="sf-chip">{v}</span>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3">
              <Link href="/marketplace" className="sf-btn-ghost justify-between">
                <ShoppingBag className="h-4 w-4" />
                <span>Выбрать из маркетплейса</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button className="sf-btn-ghost justify-between opacity-60 cursor-not-allowed" disabled>
                <Sparkles className="h-4 w-4" />
                <span>Сгенерировать AI</span>
                <span className="text-[10px] text-sf-dim">скоро</span>
              </button>
            </div>
          </div>

          {/* Right panel: file analysis summary */}
          <aside className="sf-card p-6 h-fit lg:sticky lg:top-24">
            <p className="sf-eyebrow mb-4">Анализ файла</p>
            <h3 className="font-display text-lg uppercase">
              {analysis ? "Готов к расчёту" : "Жду файл"}
            </h3>
            <p className="text-sf-dim text-sm mt-2">
              {analysis
                ? "Можно переходить к подбору материала и партнёра."
                : "После загрузки покажу объём, полигоны и дефекты геометрии."}
            </p>

            <div className="mt-6 space-y-0">
              <DataRow label="Файл" value={file?.name ?? "—"} />
              <DataRow label="Размер" value={file ? `${(file.size / 1024 / 1024).toFixed(1)} МБ` : "—"} />
              <DataRow label="Объём" value={analysis ? `${analysis.volumeCm3.toFixed(0)} см³` : "—"} />
              <DataRow label="Дефекты" value={analysis?.isValid === false ? "Есть" : "Нет"} accent={analysis?.isValid === false} />
            </div>

            <button
              disabled={!fileId}
              onClick={() => router.push(`/print/material-quiz?fileId=${fileId}`)}
              className="mt-6 w-full sf-btn-primary justify-between disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Дальше — квиз</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </aside>
        </div>
      </div>
    </>
  )
}
