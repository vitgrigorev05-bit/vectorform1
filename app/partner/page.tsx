import Link from "next/link"
import { DashboardShell, StatTile } from "@/components/sf/dashboard-shell"
import { ScreenMeta, SfChip, DataRow } from "@/components/sf/screen-meta"
import { TrendingUp, ArrowRight } from "lucide-react"

// Экраны 12 + 14 макета: ЛК Производителя — входящие заявки + статистика.

const INCOMING = [
  { num: "СФ-241101", title: "Лампа «Купол M» ×2", tech: "SLA, RESIN", customer: "ВП", budget: "6 400 ₽", days: "8 дней", quantity: 2 },
  { num: "СФ-241102", title: "Кронштейн A-frame ×12", tech: "FDM, PETG", customer: "О«", budget: "7 200 ₽", days: "10 дней", quantity: 12 },
  { num: "СФ-241103", title: "Ваза «Турбулент»", tech: "FDM, PLA", customer: "AV", budget: "2 100 ₽", days: "12 дней", quantity: 1 },
  { num: "СФ-241104", title: "Наушники CONCEPT-3", tech: "SLA + POST", customer: "SZ", budget: "8 200 ₽", days: "5 дней", quantity: 2 },
]

const REVENUE_MONTHS = [
  { m: "Май", v: 1030 },
  { m: "Июн", v: 2060 },
  { m: "Июл", v: 3090 },
  { m: "Авг", v: 3500 },
  { m: "Сен", v: 3900 },
  { m: "Окт", v: 4120 },
]

const MATERIALS_SHARE = [
  { name: "PETG", pct: 38 },
  { name: "PLA", pct: 28 },
  { name: "Resin", pct: 18 },
  { name: "ABS", pct: 10 },
  { name: "TPU", pct: 6 },
]

const SIDEBAR = [
  { label: "Входящие", href: "/partner", count: 4 },
  { label: "В работе", href: "/partner", count: 7 },
  { label: "Статистика", href: "/partner" },
  { label: "Анкета производства", href: "/partner/onboarding" },
  { label: "Реквизиты", href: "/partner" },
  { label: "Выплаты", href: "/partner" },
  { label: "Логистика", href: "/partner" },
  { label: "Документы", href: "/partner" },
]

export default function PartnerDashboard() {
  return (
    <DashboardShell
      initials="ФМ"
      name="ФабЛаб Москва"
      role="Verified · 1 240 заказов"
      verified
      sidebar={SIDEBAR}
      active="Входящие"
    >
      <ScreenMeta left="12 · ЛК Производителя · Входящие" right="12 / 14" />

      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <p className="sf-eyebrow mb-3">11 / Входящие заказы</p>
          <h1 className="font-display text-4xl md:text-5xl uppercase">
            4 новых <span className="text-sf-red">заявки</span>
          </h1>
          <p className="text-sf-dim mt-3 max-w-xl">
            Принять или отклонить — 15 минут на ответ, иначе уйдёт следующему партнёру.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-sf-dim">
            <input type="checkbox" className="accent-sf-red" />
            Авто-приём
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatTile value="4" label="Новых" hint="за последние 24 часа" accent />
        <StatTile value="7" label="В работе" />
        <StatTile value="42" label="Завершено за месяц" />
        <StatTile value="412 800 ₽" label="Выручка месяца" hint="↑ +22%" />
      </div>

      {/* Входящие */}
      <div className="space-y-3 mb-12">
        {INCOMING.map(o => (
          <div key={o.num} className="sf-card p-6 hover:border-sf-red/60 transition-colors">
            <div className="grid grid-cols-1 lg:grid-cols-[auto,1fr,auto,auto,auto,auto] gap-5 items-center">
              <div className="h-16 w-16 bg-sf-bg border border-sf-line flex items-center justify-center font-mono text-[10px] uppercase tracking-[0.2em] text-sf-dim">
                MDL<br />.STL
              </div>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <SfChip variant="red">Новая</SfChip>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-sf-dim">
                    {o.num} · {o.tech} · {o.customer}
                  </span>
                </div>
                <h3 className="font-display text-lg uppercase mt-2">{o.title}</h3>
              </div>
              <Mini label="Тираж" value={`${o.quantity} шт.`} />
              <Mini label="Бюджет" value={o.budget} accent />
              <Mini label="Срок" value={o.days} />
              <div className="flex gap-2">
                <button className="sf-btn-ghost text-xs">Отклонить</button>
                <button className="sf-btn-primary text-xs">Принять</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Статистика — экран 14 */}
      <ScreenMeta left="14 · ЛК Производителя · Статистика" right="14 / 14" />

      <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
        <div>
          <p className="sf-eyebrow mb-3">13 / Статистика</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase">
            Выручка<span className="text-sf-red">.</span>
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {["7 дней", "Месяц", "Полгода", "Год"].map((t, i) => (
            <button key={t} className={`px-3 py-1.5 border font-display uppercase text-xs tracking-wider ${i === 2 ? "border-sf-red text-sf-red" : "border-sf-line text-sf-dim hover:border-sf-red/40"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatTile value="1 792 К ₽" label="Выручка (полгода)" hint="↑ +38%" accent />
        <StatTile value="164" label="Заказов" hint="↑ +12 к маю" />
        <StatTile value="10 920 ₽" label="Средний чек" hint="↑ +22%" />
        <StatTile value="4.9 / 5.0" label="Рейтинг" hint="↑ 1 240 отзывов" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr,1fr] gap-6">
        {/* Bar chart */}
        <section className="sf-card p-6">
          <div className="flex items-center justify-between mb-6">
            <p className="sf-eyebrow">Выручка по месяцам</p>
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-sf-dim">
              <TrendingUp className="inline h-3 w-3 text-sf-red mr-1" /> +38%
            </span>
          </div>
          <div className="h-64 flex items-end gap-3 pt-4">
            {REVENUE_MONTHS.map(({ m, v }) => {
              const pct = (v / 4500) * 100
              return (
                <div key={m} className="flex-1 flex flex-col items-center gap-2">
                  <div className="text-[10px] font-mono text-sf-dim">{v}К</div>
                  <div className="w-full bg-sf-bg border border-sf-line relative" style={{ height: "180px" }}>
                    <div className="absolute bottom-0 left-0 right-0 bg-sf-red" style={{ height: `${pct}%` }} />
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-sf-dim">{m}</div>
                </div>
              )
            })}
          </div>
        </section>

        {/* К выплате + материалы */}
        <div className="space-y-6">
          <section className="sf-card p-6">
            <p className="sf-eyebrow mb-4">К выплате</p>
            <div className="font-display text-5xl text-sf-red">412 800 ₽</div>
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-sf-dim mt-2">
              Доступно к выводу
            </div>
            <div className="mt-5 space-y-0">
              <DataRow label="Завершено 42 заказа" value="432 К ₽" />
              <DataRow label="Комиссия СтильФормы (4.5%)" value="–19.2 К ₽" />
            </div>
            <button className="mt-5 w-full sf-btn-primary">Запросить выплату</button>
          </section>

          <section className="sf-card p-6">
            <p className="sf-eyebrow mb-4">Топ материалов</p>
            <div className="space-y-3">
              {MATERIALS_SHARE.map(m => (
                <div key={m.name}>
                  <div className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em] mb-1">
                    <span className="text-sf-ink">{m.name}</span>
                    <span className="text-sf-red">{m.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-sf-bg border border-sf-line">
                    <div className="h-full bg-sf-red" style={{ width: `${m.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </DashboardShell>
  )
}

function Mini({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-sf-dim">{label}</div>
      <div className={`font-display text-base mt-1 ${accent ? "text-sf-red" : ""}`}>{value}</div>
    </div>
  )
}
