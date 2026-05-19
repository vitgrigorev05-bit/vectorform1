"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const FAQ = [
  {
    cat: "Заказы",
    items: [
      { q: "Сколько занимает расчёт стоимости?", a: "8 секунд. Мы опрашиваем всех партнёров с нужным оборудованием и подбираем диапазон цен." },
      { q: "Что входит в стоимость?", a: "Материал + электричество + амортизация + расходники + труд + наценка партнёра + комиссия платформы + доставка." },
      { q: "Можно ли изменить заказ после оплаты?", a: "До перехода в статус «Печать» — да, через чат с партнёром. Дальше — только отмена с пересчётом." },
    ],
  },
  {
    cat: "Оплата и эскроу",
    items: [
      { q: "Когда партнёр получает деньги?", a: "После того, как вы примете заказ. До этого момента деньги в эскроу на счёте платформы." },
      { q: "Что если заказ не приняли?", a: "Вы открываете спор, мы разбираемся за 48 часов. Полный возврат — стандартное решение, если претензии обоснованы." },
      { q: "Можно ли оплатить рассрочкой?", a: "Да, доступна рассрочка «Сплит 4×» — 4 платежа без процентов." },
    ],
  },
  {
    cat: "Партнёрам",
    items: [
      { q: "Какая комиссия?", a: "4.5% от суммы заказа. Платите только с реально выполненных работ." },
      { q: "Как часто выплаты?", a: "По запросу, как только баланс превысит 1 000 ₽. Зачисление — за 1-3 рабочих дня." },
      { q: "Можно ли отказаться от заказа?", a: "Да, в течение 15 минут после поступления. Дальше — штрафы за срыв." },
    ],
  },
]

export default function FAQPage() {
  const [open, setOpen] = useState<string | null>("Заказы:0")

  return (
    <div className="container py-16 max-w-4xl">
      <p className="sf-eyebrow mb-6">Помощь</p>
      <h1 className="font-display text-5xl md:text-7xl uppercase leading-[0.95]">
        Часто <span className="text-sf-red">спрашивают</span>.
      </h1>
      <p className="text-sf-dim mt-6 max-w-2xl">Не нашли ответ? Напишите на support@styleforms.ru — отвечаем за 2 часа.</p>

      <div className="mt-14 space-y-12">
        {FAQ.map(group => (
          <section key={group.cat}>
            <h2 className="font-display text-2xl uppercase tracking-wider text-sf-red mb-5">{group.cat}</h2>
            <div className="space-y-2">
              {group.items.map((it, idx) => {
                const key = `${group.cat}:${idx}`
                const isOpen = open === key
                return (
                  <div key={key} className="sf-card overflow-hidden">
                    <button onClick={() => setOpen(isOpen ? null : key)} className="w-full p-5 flex items-center justify-between text-left hover:bg-sf-bg2">
                      <span className="font-display uppercase tracking-wider text-sm">{it.q}</span>
                      <ChevronDown className={`h-4 w-4 text-sf-dim transition-transform ${isOpen ? "rotate-180 text-sf-red" : ""}`} />
                    </button>
                    {isOpen && <div className="px-5 pb-5 text-sf-dim text-sm leading-relaxed">{it.a}</div>}
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
