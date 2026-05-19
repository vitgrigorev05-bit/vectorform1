"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { OrderStepBar } from "@/components/sf/step-bar"
import { ScreenMeta, SfChip } from "@/components/sf/screen-meta"
import { ArrowRight, MapPin, Star } from "lucide-react"

// Экран 07 макета: выбор партнёра. Сортировка по цене / сроку / рейтингу,
// карточки с инициалами фабрики, технология, срок, цена.

type Partner = {
  id: string
  companyName: string
  city: string
  rating: number
  printers: { id: string; tech: string }[]
  filaments: { id: string; spoolPrice: any; spoolWeight: number }[]
  // расчётная цена для отображения (подставляется заглушкой)
  price?: number
  days?: number
  tag?: "Premium" | "Быстро" | "Лучшая цена"
}

const MOCK_TAGS: Record<number, Partner["tag"]> = {
  0: "Лучшая цена",
  1: "Premium",
  2: "Быстро",
}

export default function PickPartnerPage() {
  return (
    <Suspense fallback={<div className="container py-10 text-sf-dim">Загрузка…</div>}>
      <Inner />
    </Suspense>
  )
}

function Inner() {
  const sp = useSearchParams()
  const router = useRouter()
  const material = sp.get("material") || "PETG"
  const [partners, setPartners] = useState<Partner[]>([])
  const [sort, setSort] = useState<"price" | "days" | "rating">("price")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/partners?material=${material}`)
      .then(r => r.json())
      .then(b => {
        const list = (b.data as Partner[]).map((p, i) => ({
          ...p,
          price: 8900 + i * 1100,
          days: 4 + (i % 4) + 2,
          tag: MOCK_TAGS[i],
        }))
        setPartners(list)
        setLoading(false)
      })
  }, [material])

  const sorted = [...partners].sort((a, b) => {
    if (sort === "price") return (a.price ?? 0) - (b.price ?? 0)
    if (sort === "days") return (a.days ?? 0) - (b.days ?? 0)
    return (b.rating ?? 0) - (a.rating ?? 0)
  })

  return (
    <>
      <OrderStepBar current={4} />
      <div className="container py-12">
        <ScreenMeta left="Превью" right="Шаг 4 / 6" />

        <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
          <div>
            <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.95]">
              Выбери <span className="text-sf-red">производство</span>
            </h1>
            <p className="text-sf-dim mt-4 max-w-2xl leading-relaxed">
              {sorted.length} партнёров готовы взять заказ. Цены и сроки актуальны на сейчас.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {[["price", "По цене"], ["days", "По сроку"], ["rating", "По рейтингу"]].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setSort(id as any)}
                className={`px-4 py-2 border font-display uppercase text-xs tracking-wider transition-colors ${
                  sort === id ? "border-sf-red text-sf-red" : "border-sf-line text-sf-dim hover:border-sf-red/40"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-sf-dim">Ищу партнёров…</div>
        ) : sorted.length === 0 ? (
          <div className="sf-card p-10 text-center text-sf-dim">
            Партнёры с материалом {material} пока не найдены. Попробуйте другой материал или зайдите позже.
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map(p => (
              <div key={p.id} className="sf-card p-6 hover:border-sf-red/60 transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,auto,auto,auto] gap-6 items-center">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 flex items-center justify-center bg-sf-bg border border-sf-line font-display text-sf-red">
                      {p.companyName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-display text-xl uppercase">{p.companyName}</h3>
                        {p.tag && <SfChip variant="red">{p.tag}</SfChip>}
                      </div>
                      <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.2em] text-sf-dim mt-1">
                        <MapPin className="h-3 w-3" /> {p.city}
                        <span className="text-sf-line">·</span>
                        <Star className="h-3 w-3 text-sf-red fill-sf-red" /> {p.rating}
                      </div>
                    </div>
                  </div>

                  <Cell label="Технологии" value={p.printers.map(pr => pr.tech).join(", ") || "FDM"} />
                  <Cell label="Срок" value={`${p.days} дн.`} />
                  <Cell label="Цена" value={`${p.price?.toLocaleString("ru-RU")} ₽`} accent />

                  <Link
                    href={`/print/checkout?${new URLSearchParams({ ...Object.fromEntries(sp.entries()), partnerId: p.id })}`}
                    className="sf-btn-primary"
                  >
                    Выбрать <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

function Cell({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-sf-dim">{label}</div>
      <div className={`font-display text-lg mt-1 ${accent ? "text-sf-red" : ""}`}>{value}</div>
    </div>
  )
}
