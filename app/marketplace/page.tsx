"use client"

import Link from "next/link"
import { useState } from "react"
import { ScreenMeta, PageTitle, SfChip } from "@/components/sf/screen-meta"
import { ArrowRight, Search, Star, Upload } from "lucide-react"

// Экран 03 макета: каталог моделей с фильтрами «КАТЕГОРИЯ / ТЕХНОЛОГИЯ /
// ЦЕНА / ГОТОВНОСТЬ» и карточками моделей.

const CATEGORIES = ["Все", "Декор", "Мебель", "Обувь", "Аксессуары", "Инженерия", "Сувениры"]
const TECHS = ["Все", "FDM", "SLA", "SLS", "MJF"]
const SORTS = ["Популярные", "Новые", "Цена ↑", "Цена ↓", "Рейтинг"]
const READINESS = ["Готов к печати", "С исходниками", "Поддержка автора"]

type Model = {
  tag: string
  fileTag: string
  category: string
  author: string
  rating: number
  reviews: number
  title: string
  price: number
  badge?: "ТРЕНД" | "ХИТ" | "НОВИНКА"
}

const MODELS: Model[] = [
  { tag: "ОБУВЬ",      fileTag: "M1.STL", category: "Обувь",       author: "STUDIO NEFT",   rating: 4.9, reviews: 1240, title: "Сетчатый кроссовок MESH-01", price: 4800, badge: "ТРЕНД" },
  { tag: "ДЕКОР",      fileTag: "M2.STL", category: "Декор",       author: "ANNA VOLKOVA",  rating: 4.7, reviews: 870,  title: "Ваза «Турбулент»", price: 1900 },
  { tag: "ИНЖЕНЕРИЯ",  fileTag: "M3.STL", category: "Инженерия",   author: "PRINT.BURO",    rating: 4.8, reviews: 3200, title: "Кронштейн A-frame", price: 650, badge: "ХИТ" },
  { tag: "МЕБЕЛЬ",     fileTag: "M4.STL", category: "Мебель",      author: "FORM LAB",      rating: 4.6, reviews: 410,  title: "Стул «Палладий»", price: 6400 },
  { tag: "ДЕКОР",      fileTag: "M5.STL", category: "Декор",       author: "YURI PETROV",   rating: 4.9, reviews: 980,  title: "Лампа «Купол M»", price: 3100 },
  { tag: "СУВЕНИРЫ",   fileTag: "M6.STL", category: "Сувениры",    author: "KUB STUDIO",    rating: 4.8, reviews: 2100, title: "Фигурка «Аркадий»", price: 1450, badge: "НОВИНКА" },
  { tag: "АКСЕССУАРЫ", fileTag: "M7.STL", category: "Аксессуары",  author: "ZVUK INDUSTRIAL", rating: 4.7, reviews: 320, title: "Наушники CONCEPT-3", price: 5400 },
  { tag: "ИНЖЕНЕРИЯ",  fileTag: "M8.STL", category: "Инженерия",   author: "TECHPARTS.RU",  rating: 4.5, reviews: 5400, title: "Шестерня M16-T20", price: 290 },
]

export default function MarketplacePage() {
  const [category, setCategory] = useState("Все")
  const [tech, setTech] = useState("Все")
  const [sort, setSort] = useState("Популярные")
  const [readiness, setReadiness] = useState<string[]>([])
  const [priceMax, setPriceMax] = useState(10000)

  const filtered = MODELS.filter(m =>
    (category === "Все" || m.category === category) &&
    m.price <= priceMax
  )

  return (
    <div className="container py-10">
      <ScreenMeta left="03 · Маркетплейс" right="03 / 14" />

      <PageTitle
        eyebrow="02 / Маркетплейс моделей"
        title={<>Каталог<span className="text-sf-red">.</span></>}
        subtitle={<>8 412 моделей от 320 авторов. Скачивай, печатай локально или закажи производство в один клик.</>}
      >
        <Link href="/print/upload" className="sf-btn-primary">
          <Upload className="h-4 w-4" /> Загрузить свою
        </Link>
      </PageTitle>

      <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-8 mt-12">
        {/* Sidebar filters */}
        <aside className="space-y-6">
          <FilterBlock title="Категория">
            <div className="space-y-1.5">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`w-full text-left px-3 py-2 font-display uppercase text-xs tracking-wider transition-colors ${
                    category === c ? "bg-sf-red text-white" : "text-sf-ink/80 hover:bg-sf-bg2"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </FilterBlock>

          <FilterBlock title="Технология">
            <div className="grid grid-cols-3 gap-1.5">
              {TECHS.slice(1).map(t => (
                <button
                  key={t}
                  onClick={() => setTech(t)}
                  className={`px-3 py-2 border font-display uppercase text-xs tracking-wider transition-colors ${
                    tech === t ? "border-sf-red text-sf-red" : "border-sf-line text-sf-dim hover:border-sf-red/40"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </FilterBlock>

          <FilterBlock title="Цена до">
            <div className="space-y-3">
              <input
                type="range" min={100} max={20000} step={100} value={priceMax}
                onChange={e => setPriceMax(Number(e.target.value))}
                className="w-full accent-sf-red"
              />
              <div className="flex justify-between text-xs font-mono text-sf-dim">
                <span>100 ₽</span>
                <span className="text-sf-red">{priceMax.toLocaleString("ru-RU")} ₽</span>
              </div>
            </div>
          </FilterBlock>

          <FilterBlock title="Готовность">
            <div className="space-y-2">
              {READINESS.map(r => (
                <label key={r} className="flex items-center gap-2 text-sm text-sf-ink/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={readiness.includes(r)}
                    onChange={() => setReadiness(s => s.includes(r) ? s.filter(x => x !== r) : [...s, r])}
                    className="accent-sf-red"
                  />
                  {r}
                </label>
              ))}
            </div>
          </FilterBlock>
        </aside>

        {/* Catalog */}
        <div>
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-3 text-sf-dim font-mono uppercase text-xs tracking-[0.2em]">
              <span>{filtered.length} моделей · {category}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sf-dim" />
                <input
                  type="text"
                  placeholder="Поиск моделей и авторов…"
                  className="pl-10 pr-4 h-10 w-72 bg-sf-bg2 border border-sf-line text-sm focus:border-sf-red outline-none"
                />
              </div>
              <select value={sort} onChange={e => setSort(e.target.value)} className="h-10 bg-sf-bg2 border border-sf-line px-3 font-display uppercase text-xs tracking-wider">
                {SORTS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(m => <ModelCard key={m.fileTag} m={m} />)}
          </div>

          <div className="mt-10 flex items-center justify-center gap-2 font-display uppercase text-sm tracking-wider">
            {[1, 2, 3, 4].map(p => (
              <button key={p} className={`h-10 w-10 border ${p === 1 ? "border-sf-red text-sf-red" : "border-sf-line text-sf-dim hover:border-sf-red/40"}`}>{p}</button>
            ))}
            <span className="text-sf-dim px-2">…</span>
            <button className="h-10 w-10 border border-sf-line text-sf-dim hover:border-sf-red/40">12</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function FilterBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="sf-card p-5">
      <h3 className="font-display uppercase text-xs tracking-[0.25em] text-sf-dim mb-4">{title}</h3>
      {children}
    </div>
  )
}

function ModelCard({ m }: { m: Model }) {
  return (
    <Link href={`/marketplace/${m.fileTag}`} className="sf-card-hover overflow-hidden group block">
      <div className="aspect-[4/5] bg-gradient-to-br from-sf-bg2 to-sf-bg3 relative border-b border-sf-line">
        <div className="absolute inset-0 sf-grid opacity-40" />
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          <SfChip variant="red">{m.fileTag}</SfChip>
          {m.badge && <SfChip variant="red">{m.badge}</SfChip>}
        </div>
        <div className="absolute bottom-3 right-3 flex items-center gap-1 text-xs font-mono text-sf-ink/90 bg-sf-bg/70 backdrop-blur px-2 py-1">
          <Star className="h-3 w-3 text-sf-red fill-sf-red" /> {m.rating} · {m.reviews}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] font-mono text-sf-dim">
          <span>{m.tag}</span>
          <span>{m.author}</span>
        </div>
        <h3 className="font-display text-lg uppercase mt-3 leading-tight group-hover:text-sf-red transition-colors min-h-[3rem]">
          {m.title}
        </h3>
        <div className="mt-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-sf-dim">от</span>
            <span className="font-display text-xl ml-2">{m.price.toLocaleString("ru-RU")} ₽</span>
          </div>
          <span className="inline-flex items-center gap-1 text-sf-red text-xs font-display uppercase tracking-wider">
            Заказать <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  )
}
