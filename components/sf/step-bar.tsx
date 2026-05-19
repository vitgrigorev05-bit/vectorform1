import Link from "next/link"

const STEPS = [
  { n: "01", title: "Загрузка", href: "/print/upload" },
  { n: "02", title: "Квиз", href: "/print/material-quiz" },
  { n: "03", title: "Цена", href: "/print/calculate" },
  { n: "04", title: "Партнёр", href: "/print/partner" },
  { n: "05", title: "Оплата", href: "/print/checkout" },
  { n: "06", title: "Трекинг", href: "/dashboard/orders" },
]

// Шапка-степпер 1/6...6/6 как в макете «04 ЗАКАЗ · ЗАГРУЗКА» и далее.
export function OrderStepBar({ current }: { current: 1 | 2 | 3 | 4 | 5 | 6 }) {
  return (
    <div className="border-b border-sf-line">
      <div className="container py-5">
        <div className="grid grid-cols-6 gap-px bg-sf-line border border-sf-line">
          {STEPS.map((s, i) => {
            const idx = i + 1
            const active = idx === current
            const done = idx < current
            return (
              <Link
                key={s.n}
                href={s.href}
                className={`bg-sf-bg p-4 flex flex-col gap-2 transition-colors ${
                  active ? "bg-sf-bg2" : done ? "hover:bg-sf-bg2" : "opacity-60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-display text-2xl leading-none ${active ? "text-sf-red" : done ? "text-sf-ink" : "text-sf-dim"}`}>
                    {s.n}
                  </span>
                  <span className="sf-chip">Шаг {idx}</span>
                </div>
                <span className={`font-display uppercase text-xs tracking-wider ${active ? "text-sf-ink" : "text-sf-dim"}`}>
                  {s.title}
                </span>
              </Link>
            )
          })}
        </div>
        <div className="mt-3 flex items-center justify-between text-xs font-mono uppercase tracking-[0.25em] text-sf-dim">
          <span className="sf-eyebrow">{`0${current + 3} · Заказ · ${STEPS[current - 1].title}`}</span>
          <span>Шаг {current} / 6</span>
        </div>
      </div>
    </div>
  )
}
