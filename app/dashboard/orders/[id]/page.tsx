"use client"

import Link from "next/link"
import { useState } from "react"
import { ScreenMeta, DataRow, SfChip } from "@/components/sf/screen-meta"
import { ArrowLeft, Check, Send, Truck, Wrench, Eye } from "lucide-react"

// Экраны 09 + 11 макета: трекинг заказа + детальная карточка с таймлайном,
// чатом с партнёром и спецификацией.

const TIMELINE = [
  { idx: 1, title: "Оплата получена", date: "Сегодня · 14:08", text: "Платёж зачислен, деньги в эскроу", done: true },
  { idx: 2, title: "Назначен партнёр", date: "Сегодня · 14:09", text: "ФабЛаб Москва, Москва", done: true },
  { idx: 3, title: "Подготовка слайса", date: "Сегодня · 14:24", text: "G-code сгенерирован, 18 ч печати", done: true },
  { idx: 4, title: "Печать", date: "В процессе · 38%", text: "Слой 142 из 374", live: true },
  { idx: 5, title: "Постобработка", date: "Запланировано", text: "Шлифовка, грунтовка" },
  { idx: 6, title: "Контроль качества", date: "—", text: "Проверка геометрии и допусков" },
  { idx: 7, title: "Передан в доставку", date: "—", text: "Курьер заберёт со склада" },
  { idx: 8, title: "Доставлен", date: "Ожидается ~22 окт", text: "Москва, Большая Никитская, 12" },
]

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const [message, setMessage] = useState("")

  return (
    <div className="container py-10">
      <ScreenMeta left={`11 · ЛК Покупателя · Карточка`} right="11 / 14" />

      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <Link href="/dashboard/orders" className="text-xs font-mono uppercase tracking-[0.25em] text-sf-dim hover:text-sf-red inline-flex items-center gap-2 mb-3">
            <ArrowLeft className="h-3 w-3" /> К заказам
          </Link>
          <h1 className="font-display text-4xl md:text-5xl uppercase">
            Ваза «<span className="text-sf-red">Турбулент</span>»
          </h1>
          <div className="flex items-center gap-3 mt-3 text-xs font-mono uppercase tracking-[0.25em] text-sf-dim">
            <span>СФ-{params.id.slice(-6)}</span>
            <span className="text-sf-line">·</span>
            <span>Создан 18 окт</span>
            <span className="text-sf-line">·</span>
            <span>1 шт.</span>
            <span className="text-sf-line">·</span>
            <span>ФабЛаб Москва</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SfChip variant="live">В производстве · 38%</SfChip>
          <button className="sf-btn-ghost text-xs">Чек</button>
          <button className="sf-btn-ghost text-xs">Договор</button>
          <button className="sf-btn-primary text-xs">Повторить</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr,1fr] gap-8">
        {/* Левая колонка: спецификация + таймлайн */}
        <div className="space-y-6">
          <section className="sf-card p-6">
            <p className="sf-eyebrow mb-4">Спецификация</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-sf-line border border-sf-line">
              {[
                ["Материал", "PETG"],
                ["Заполнение", "35%"],
                ["Точность", "0.1 мм"],
                ["Габариты", "120×80×60 мм"],
                ["Объём", "84 см³"],
                ["Постобработка", "Шлифовка + грунт"],
              ].map(([l, v]) => (
                <div key={l} className="bg-sf-bg p-4">
                  <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-sf-dim">{l}</div>
                  <div className="font-display text-base mt-1">{v}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="sf-card p-6">
            <div className="flex items-center justify-between mb-6">
              <p className="sf-eyebrow">Таймлайн заказа</p>
              <SfChip variant="live">До доставки 5 дн.</SfChip>
            </div>

            <ol className="relative pl-8">
              <div className="absolute top-2 bottom-2 left-3 w-px bg-sf-line" />
              {TIMELINE.map(t => (
                <li key={t.idx} className="relative pb-6 last:pb-0">
                  <div className={`absolute left-[-21px] top-0.5 h-6 w-6 rounded-full flex items-center justify-center border ${
                    t.done ? "bg-sf-red border-sf-red" : t.live ? "border-sf-red animate-pulse" : "border-sf-line bg-sf-bg"
                  }`}>
                    {t.done && <Check className="h-3 w-3 text-white" />}
                    {t.live && <span className="h-2 w-2 rounded-full bg-sf-red" />}
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className={`font-display uppercase tracking-wider ${t.done || t.live ? "text-sf-ink" : "text-sf-dim"}`}>{t.title}</h3>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-sf-dim shrink-0">{t.date}</span>
                  </div>
                  <p className="text-sm text-sf-dim mt-1">{t.text}</p>
                  {t.live && (
                    <div className="mt-3 sf-card p-4">
                      <div className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em] text-sf-dim">
                        <span>Прогресс печати</span>
                        <span className="text-sf-red">38%</span>
                      </div>
                      <div className="mt-2 h-1.5 bg-sf-bg overflow-hidden">
                        <div className="h-full bg-sf-red transition-all" style={{ width: "38%" }} />
                      </div>
                      <div className="mt-2 text-xs text-sf-dim">Слой 142 / 374</div>
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* Правая колонка: партнёр, оплата, чат */}
        <div className="space-y-6">
          <section className="sf-card p-6">
            <div className="flex items-center justify-between">
              <p className="sf-eyebrow">Партнёр</p>
              <span className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.2em] text-green-400">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" /> Online
              </span>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <div className="h-14 w-14 flex items-center justify-center bg-sf-bg border border-sf-line font-display text-sf-red">ФМ</div>
              <div>
                <div className="font-display text-lg uppercase">ФабЛаб Москва</div>
                <div className="text-xs font-mono uppercase tracking-[0.2em] text-sf-dim mt-1">Москва · ★ 4.9</div>
              </div>
            </div>
          </section>

          <section className="sf-card p-6">
            <p className="sf-eyebrow mb-4">Оплата</p>
            <div className="font-display text-4xl">4 720 ₽</div>
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-sf-red mt-1">
              ● Оплачен · Эскроу
            </div>
            <div className="mt-5 space-y-0">
              <DataRow label="Производство" value="3 440 ₽" />
              <DataRow label="Доставка" value="480 ₽" />
              <DataRow label="Сервисный сбор" value="800 ₽" />
            </div>
          </section>

          <section className="sf-card p-0 overflow-hidden">
            <div className="p-5 border-b border-sf-line">
              <p className="sf-eyebrow">Чат с партнёром</p>
            </div>
            <div className="p-5 space-y-3 max-h-72 overflow-y-auto">
              <ChatBubble from="partner">Здравствуйте! Файл получен, всё ок. Начинаем печать в 14:30.</ChatBubble>
              <ChatBubble from="me">Отлично! А можно вторую копию заказать со скидкой?</ChatBubble>
              <ChatBubble from="partner">Да, −20% на второй экземпляр. Доплата 3 200 ₽. Сделать?</ChatBubble>
            </div>
            <div className="p-3 border-t border-sf-line flex gap-2">
              <input value={message} onChange={e => setMessage(e.target.value)} placeholder="Сообщение партнёру…" className="flex-1 h-11 bg-sf-bg border border-sf-line px-3 focus:border-sf-red outline-none text-sm" />
              <button className="h-11 w-11 bg-sf-red flex items-center justify-center hover:bg-sf-redDark">
                <Send className="h-4 w-4 text-white" />
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function ChatBubble({ from, children }: { from: "me" | "partner"; children: React.ReactNode }) {
  const me = from === "me"
  return (
    <div className={`flex ${me ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[80%] p-3 text-sm ${me ? "bg-sf-red text-white" : "bg-sf-bg border border-sf-line"}`}>
        {children}
      </div>
    </div>
  )
}
