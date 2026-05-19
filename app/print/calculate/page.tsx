"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { OrderStepBar } from "@/components/sf/step-bar"
import { ScreenMeta, DataRow, SfChip } from "@/components/sf/screen-meta"
import { ArrowRight, Sparkles } from "lucide-react"

// Экран 06 макета: «Цена и параметры» — материал, заполнение, точность,
// постобработка → блок «Стоимость, ₽» с диапазоном по партнёрам.

const MATERIALS = [
  { id: "PLA", label: "PLA", tag: "Эко" },
  { id: "PETG", label: "PETG", tag: "Прочный" },
  { id: "RESIN", label: "Resin", tag: "Детализация" },
  { id: "TPU", label: "TPU", tag: "Гибкий" },
] as const

const QUALITIES = [
  { id: "DRAFT", label: "0.28 мм", tag: "Быстро" },
  { id: "STANDARD", label: "0.20 мм", tag: "Стандарт" },
  { id: "HIGH", label: "0.12 мм", tag: "Точно" },
  { id: "ULTRA", label: "0.08 мм", tag: "Ультра" },
] as const

export default function CalculatePage() {
  return (
    <Suspense fallback={<div className="container py-10 text-sf-dim">Загрузка…</div>}>
      <Inner />
    </Suspense>
  )
}

function Inner() {
  const sp = useSearchParams()
  const router = useRouter()
  const fileId = sp.get("fileId") || undefined
  const initialMaterial = (sp.get("material") || "PETG") as any

  const [material, setMaterial] = useState<string>(initialMaterial)
  const [quality, setQuality] = useState<string>("STANDARD")
  const [infill, setInfill] = useState(35)
  const [post, setPost] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)

  async function recalc() {
    setLoading(true)
    try {
      const res = await fetch("/api/print/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uploadedFileId: fileId,
          volumeCm3: fileId ? undefined : 84,
          material,
          quality,
          infillPct: infill,
          quantity,
        }),
      })
      const body = await res.json()
      if (res.ok) setData(body.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { recalc() /* eslint-disable-next-line */ }, [material, quality, infill, post, quantity])

  const total = data?.breakdown?.total ?? 0
  const partnerPrice = data?.breakdown?.partnerPrice ?? 0
  const rangeLow = Math.round(total * 0.85)
  const rangeHigh = Math.round(total * 1.15)

  return (
    <>
      <OrderStepBar current={3} />
      <div className="container py-12">
        <ScreenMeta left="Превью" right="Шаг 3 / 6" />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,420px] gap-8">
          <div>
            <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.95]">
              Цена и <span className="text-sf-red">параметры</span>
            </h1>

            <div className="mt-8 sf-card p-6">
              <p className="sf-eyebrow mb-4">Рекомендуемые параметры</p>
              <div className="flex items-start gap-3 mb-6">
                <Sparkles className="h-5 w-5 text-sf-red mt-1" />
                <p className="text-sf-dim text-sm leading-relaxed flex-1">
                  На основе твоего файла и ответов квиза AI подобрал оптимальные настройки. Можешь скорректировать.
                </p>
              </div>

              <Group title="Материал">
                <div className="grid grid-cols-4 gap-2">
                  {MATERIALS.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setMaterial(m.id)}
                      className={`sf-card p-4 text-left transition-all ${material === m.id ? "border-sf-red bg-sf-bg2" : "hover:border-sf-red/60"}`}
                    >
                      <div className="font-display text-xl">{m.label}</div>
                      <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-sf-dim mt-1">{m.tag}</div>
                    </button>
                  ))}
                </div>
              </Group>

              <Group title={`Плотность заполнения · ${infill}%`}>
                <input type="range" min={10} max={100} step={5} value={infill} onChange={e => setInfill(Number(e.target.value))} className="w-full accent-sf-red" />
                <div className="flex justify-between text-xs font-mono uppercase tracking-[0.2em] text-sf-dim mt-2">
                  <span>Лёгкий</span>
                  <span>Сбалансировано</span>
                  <span>Прочный</span>
                </div>
              </Group>

              <Group title="Точность">
                <div className="grid grid-cols-4 gap-2">
                  {QUALITIES.map(q => (
                    <button
                      key={q.id}
                      onClick={() => setQuality(q.id)}
                      className={`sf-card p-4 text-left transition-all ${quality === q.id ? "border-sf-red bg-sf-bg2" : "hover:border-sf-red/60"}`}
                    >
                      <div className="font-display text-lg">{q.label}</div>
                      <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-sf-dim mt-1">{q.tag}</div>
                    </button>
                  ))}
                </div>
              </Group>

              <Group title="Постобработка">
                <label className="flex items-center justify-between sf-card p-4 cursor-pointer">
                  <span className="font-display uppercase tracking-wider text-sm">Шлифовка + грунтовка</span>
                  <input type="checkbox" checked={post} onChange={e => setPost(e.target.checked)} className="accent-sf-red h-5 w-5" />
                </label>
              </Group>

              <Group title="Тираж">
                <div className="flex items-center gap-3">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="h-12 w-12 border border-sf-line font-display text-xl hover:border-sf-red">−</button>
                  <input type="number" min={1} value={quantity} onChange={e => setQuantity(Math.max(1, Number(e.target.value) || 1))} className="h-12 flex-1 text-center bg-sf-bg2 border border-sf-line font-display text-xl" />
                  <button onClick={() => setQuantity(quantity + 1)} className="h-12 w-12 border border-sf-line font-display text-xl hover:border-sf-red">+</button>
                </div>
              </Group>

              {data && (
                <div className="mt-6 p-4 bg-sf-bg/60 border border-sf-line text-xs text-sf-dim leading-relaxed">
                  <b className="text-sf-ink">Совет AI:</b> для {material} с {infill}% заполнения деталь выдержит до 8 кг.
                  Подходит для функциональных прототипов.
                </div>
              )}
            </div>
          </div>

          {/* Right panel: цена и партнёры */}
          <aside className="sf-card p-6 h-fit lg:sticky lg:top-24">
            <p className="sf-eyebrow mb-3">Стоимость, ₽</p>
            {loading && !data ? (
              <div className="text-sf-dim">Считаю…</div>
            ) : data ? (
              <>
                <div className="font-display text-5xl">
                  {rangeLow.toLocaleString("ru-RU")} – {rangeHigh.toLocaleString("ru-RU")}
                </div>
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-sf-dim mt-2">
                  Диапазон по 18 партнёрам
                </p>

                <div className="mt-6 space-y-0">
                  <DataRow label="Материал" value={material} />
                  <DataRow label="Заполнение" value={`${infill}%`} />
                  <DataRow label="Вес" value={`${data.estimate.weightGrams} г`} />
                  <DataRow label="Время печати" value={`${data.estimate.printHours} ч`} />
                  <DataRow label="Срок" value="5 – 8 дней" />
                  <DataRow label="Постобработка" value={post ? "Да" : "Нет"} />
                </div>

                <div className="mt-4 p-3 bg-sf-bg/60 border border-sf-red/40 text-xs text-sf-red font-mono uppercase tracking-[0.2em]">
                  Экономия −22% при тираже от 10 шт.
                </div>

                <Link
                  href={`/print/partner?${new URLSearchParams({ ...(fileId ? { fileId } : {}), material, quality, infillPct: String(infill), quantity: String(quantity) })}`}
                  className="mt-6 w-full sf-btn-primary justify-between"
                >
                  <span>Выбрать партнёра</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            ) : (
              <div className="text-sf-dim">Нет данных. Загрузи файл.</div>
            )}
          </aside>
        </div>
      </div>
    </>
  )
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <h3 className="font-display uppercase text-xs tracking-[0.25em] text-sf-dim mb-3">{title}</h3>
      {children}
    </div>
  )
}
