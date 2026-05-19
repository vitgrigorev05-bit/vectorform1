"use client"

import Link from "next/link"
import { DashboardShell, StatTile } from "@/components/sf/dashboard-shell"
import { ScreenMeta, SfChip } from "@/components/sf/screen-meta"
import { Plus, ArrowRight, Star } from "lucide-react"

const MODELS = [
  { fileTag: "M1.STL", title: "Сетчатый кроссовок MESH-01", category: "ОБУВЬ", downloads: 1240, rating: 4.9, royalty: 14400 },
  { fileTag: "M2.STL", title: "Ваза «Турбулент»", category: "ДЕКОР", downloads: 870, rating: 4.7, royalty: 8700 },
  { fileTag: "M3.STL", title: "Кронштейн A-frame", category: "ИНЖЕНЕРИЯ", downloads: 3200, rating: 4.8, royalty: 19200 },
]

const SIDEBAR = [
  { label: "Мои модели", href: "/author", count: 3 },
  { label: "Статистика", href: "/author" },
  { label: "Роялти", href: "/author" },
  { label: "Загрузить", href: "/author" },
  { label: "Профиль", href: "/author" },
]

export default function AuthorDashboard() {
  return (
    <DashboardShell
      initials="ДС"
      name="ДизайнСтудия"
      role="Author · 3 модели"
      sidebar={SIDEBAR}
      active="Мои модели"
    >
      <ScreenMeta left="ЛК Автора · Модели" right="—" />

      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <p className="sf-eyebrow mb-3">Мои модели</p>
          <h1 className="font-display text-4xl md:text-5xl uppercase">
            Каталог <span className="text-sf-red">автора</span>
          </h1>
        </div>
        <button className="sf-btn-primary">
          <Plus className="h-4 w-4" /> Загрузить модель
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatTile value="5 310" label="Скачиваний всего" accent />
        <StatTile value="42 300 ₽" label="Роялти за месяц" hint="↑ +18%" />
        <StatTile value="187" label="Печатей на партнёрах" />
        <StatTile value="4.8 / 5.0" label="Средний рейтинг" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MODELS.map(m => (
          <Link key={m.fileTag} href="/marketplace" className="sf-card-hover overflow-hidden block">
            <div className="aspect-[4/5] bg-gradient-to-br from-sf-bg2 to-sf-bg3 relative border-b border-sf-line">
              <div className="absolute inset-0 sf-grid opacity-40" />
              <div className="absolute top-3 left-3"><SfChip variant="red">{m.fileTag}</SfChip></div>
              <div className="absolute bottom-3 right-3 flex items-center gap-1 text-xs font-mono text-sf-ink/90 bg-sf-bg/70 backdrop-blur px-2 py-1">
                <Star className="h-3 w-3 text-sf-red fill-sf-red" /> {m.rating}
              </div>
            </div>
            <div className="p-5">
              <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-sf-dim">{m.category}</div>
              <h3 className="font-display text-lg uppercase mt-2 leading-tight">{m.title}</h3>
              <div className="mt-4 flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em]">
                <span className="text-sf-dim">{m.downloads} скачиваний</span>
                <span className="text-sf-red">+{m.royalty.toLocaleString("ru-RU")} ₽</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </DashboardShell>
  )
}
