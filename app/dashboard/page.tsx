import Link from "next/link"
import { DashboardShell, StatTile } from "@/components/sf/dashboard-shell"
import { ScreenMeta, SfChip } from "@/components/sf/screen-meta"
import { ArrowRight, Plus } from "lucide-react"

// Экран 10 макета: ЛК Покупателя · Заказы. Sidebar + статистика + таблица.

const ORDERS = [
  { num: "СФ-241018", title: "Ваза «Турбулент»", partner: "ФабЛаб Москва", status: "В производстве", date: "18 окт", sum: "4 720 ₽" },
  { num: "СФ-241015", title: "Кронштейн A-frame ×8", partner: "Кузница Урал", status: "Доставка", date: "15 окт", sum: "7 280 ₽" },
  { num: "СФ-241009", title: "Сетчатый кроссовок MESH-01", partner: "ATOM·LAB", status: "Завершён", date: "9 окт", sum: "12 400 ₽" },
  { num: "СФ-241002", title: "Фигурка «Аркадий» ×3", partner: "PRINTSPACE", status: "Завершён", date: "2 окт", sum: "5 440 ₽" },
  { num: "СФ-240928", title: "Шестерня M16-T20 ×24", partner: "PEREDOVAYA", status: "Завершён", date: "28 сент", sum: "9 180 ₽" },
  { num: "СФ-240920", title: "Стул «Палладий»", partner: "—", status: "Отклонён", date: "20 сент", sum: "—" },
]

const SIDEBAR = [
  { label: "Текущий заказ", href: "/dashboard" },
  { label: "Мои заказы", href: "/dashboard", count: 6 },
  { label: "Избранное", href: "/dashboard" },
  { label: "Платежи", href: "/dashboard" },
  { label: "Профиль", href: "/dashboard" },
  { label: "Настройки", href: "/dashboard" },
]

export default function DashboardPage() {
  return (
    <DashboardShell
      initials="ВП"
      name="Виктор П."
      role="Buyer · 24 заказа"
      sidebar={SIDEBAR}
      active="Мои заказы"
    >
      <ScreenMeta left="10 · ЛК Покупателя · Заказы" right="10 / 14" />

      <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <p className="sf-eyebrow mb-3">09 / Мои заказы</p>
          <h1 className="font-display text-4xl md:text-5xl uppercase">
            Заказы<span className="text-sf-red">.</span>
          </h1>
        </div>
        <Link href="/print/upload" className="sf-btn-primary">
          <Plus className="h-4 w-4" /> Новый заказ
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatTile value="24" label="Всего заказов" hint="+3 в этом месяце" accent />
        <StatTile value="2" label="В работе" hint="До доставки 5 дней" />
        <StatTile value="182 400 ₽" label="Потрачено" hint="За год" />
        <StatTile value="7 600 ₽" label="Средний чек" hint="+12% к прошлому году" />
      </div>

      <div className="sf-card p-0 overflow-hidden">
        <div className="p-5 border-b border-sf-line flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            {["Все", "В работе", "Доставка", "Завершены"].map((t, i) => (
              <button key={t} className={`px-3 py-1.5 border font-display uppercase text-xs tracking-wider ${i === 0 ? "border-sf-red text-sf-red" : "border-sf-line text-sf-dim hover:border-sf-red/40"}`}>
                {t}
              </button>
            ))}
          </div>
          <input placeholder="Поиск…" className="h-9 px-3 bg-sf-bg border border-sf-line text-sm focus:border-sf-red outline-none" />
        </div>

        <table className="w-full">
          <thead>
            <tr className="text-[10px] uppercase tracking-[0.2em] font-mono text-sf-dim">
              <th className="text-left p-4 font-normal">Заказ</th>
              <th className="text-left p-4 font-normal hidden md:table-cell">Партнёр</th>
              <th className="text-left p-4 font-normal">Статус</th>
              <th className="text-left p-4 font-normal hidden lg:table-cell">Дата</th>
              <th className="text-right p-4 font-normal">Сумма</th>
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {ORDERS.map((o, i) => (
              <tr key={o.num} className="border-t border-sf-line hover:bg-sf-bg2/50">
                <td className="p-4">
                  <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-sf-dim">{o.num}</div>
                  <Link href={`/dashboard/orders/${o.num}`} className="font-display uppercase tracking-wider text-sm hover:text-sf-red">
                    {o.title}
                  </Link>
                </td>
                <td className="p-4 text-sm text-sf-ink/80 hidden md:table-cell">{o.partner}</td>
                <td className="p-4">
                  <SfChip variant={o.status === "В производстве" ? "live" : "default"}>{o.status}</SfChip>
                </td>
                <td className="p-4 text-sm text-sf-dim hidden lg:table-cell">{o.date}</td>
                <td className="p-4 text-right font-display">{o.sum}</td>
                <td className="p-4">
                  <Link href={`/dashboard/orders/${o.num}`} className="text-sf-red hover:text-sf-redDark">
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  )
}
