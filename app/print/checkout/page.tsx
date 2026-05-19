"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { OrderStepBar } from "@/components/sf/step-bar"
import { ScreenMeta, DataRow, SfChip } from "@/components/sf/screen-meta"
import { useToast } from "@/hooks/use-toast"
import { ArrowRight, CreditCard, Truck, MapPin, Lock } from "lucide-react"

// Экран 08 макета: «Подтвердить и оплатить» — спецификация заказа,
// доставка (курьер/постамат/самовывоз), способ оплаты (карта/СБП/сплит),
// промокод. Деньги в эскроу.

const DELIVERY_OPTIONS = [
  { id: "courier", title: "Курьером", sub: "1-2 дня" },
  { id: "pickpoint", title: "Постамат", sub: "2-4 дня" },
  { id: "self", title: "Самовывоз", sub: "сразу" },
]

const PAYMENT_OPTIONS = [
  { id: "card", title: "Карта", sub: "•••• •••• •••• 4287" },
  { id: "sbp", title: "СБП", sub: "по QR" },
  { id: "split", title: "Сплит 4×", sub: "08/27" },
]

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="container py-10 text-sf-dim">Загрузка…</div>}>
      <Inner />
    </Suspense>
  )
}

function Inner() {
  const router = useRouter()
  const { toast } = useToast()
  const sp = useSearchParams()
  const [delivery, setDelivery] = useState("courier")
  const [payment, setPayment] = useState("card")
  const [promo, setPromo] = useState("")
  const [address, setAddress] = useState("Москва, ул. Большая Никитская, 12, кв. 48")
  const [loading, setLoading] = useState(false)

  // суммы — будут заменены реальным расчётом из URL
  const partnerPrice = 12400
  const postProcess = 600
  const qc = 200
  const shipping = 480
  const total = partnerPrice + postProcess + qc + shipping

  async function pay() {
    setLoading(true)
    try {
      const partnerId = sp.get("partnerId")
      if (!partnerId) {
        toast({ title: "Не выбран партнёр", variant: "destructive" })
        return
      }
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uploadedFileId: sp.get("fileId") || undefined,
          partnerId,
          material: sp.get("material") || "PETG",
          quality: sp.get("quality") || "STANDARD",
          infillPct: Number(sp.get("infillPct") || 35),
          quantity: Number(sp.get("quantity") || 1),
          shippingAddress: {
            fullName: "Иван Иванов",
            addressLine1: address,
            city: "Москва",
            postalCode: "125009",
            country: "RU",
          },
        }),
      })
      const body = await res.json()
      if (!res.ok) {
        toast({ title: "Не удалось создать заказ", description: body?.error, variant: "destructive" })
        return
      }
      toast({ title: "Заказ создан", description: `№ ${body.data.orderNumber}` })
      router.push(`/dashboard/orders/${body.data.orderId}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <OrderStepBar current={5} />
      <div className="container py-12">
        <ScreenMeta left="Превью" right="Шаг 5 / 6" />

        <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.95]">
          Подтвердить и <span className="text-sf-red">оплатить</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,420px] gap-8 mt-10">
          <div className="space-y-6">
            {/* Заказ */}
            <section className="sf-card p-6">
              <p className="sf-eyebrow mb-4">Заказ</p>
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 bg-sf-bg border border-sf-line flex items-center justify-center font-display text-sf-red text-xl">V3</div>
                <div className="flex-1">
                  <div className="font-display text-lg uppercase">concept_v3.stl</div>
                  <div className="text-xs font-mono uppercase tracking-[0.2em] text-sf-dim mt-1">
                    {sp.get("material") || "PETG"} · {sp.get("infillPct") || 35}% · 0.1 мм · {sp.get("quantity") || 1} шт.
                  </div>
                  <div className="text-xs font-mono uppercase tracking-[0.2em] text-sf-dim mt-1">
                    Габариты 120×80×60 мм · Срок 5 дней
                  </div>
                </div>
              </div>
            </section>

            {/* Партнёр */}
            <section className="sf-card p-6">
              <p className="sf-eyebrow mb-4">Производство</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 flex items-center justify-center bg-sf-bg border border-sf-line font-display text-sf-red">ФМ</div>
                  <div>
                    <div className="font-display text-lg uppercase">ФабЛаб Москва</div>
                    <div className="text-xs font-mono uppercase tracking-[0.2em] text-sf-dim mt-1">Москва · ★ 4.9</div>
                  </div>
                </div>
                <button className="sf-btn-ghost text-xs">Заменить</button>
              </div>
            </section>

            {/* Доставка */}
            <section className="sf-card p-6">
              <p className="sf-eyebrow mb-4">Доставка</p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {DELIVERY_OPTIONS.map(d => (
                  <button
                    key={d.id}
                    onClick={() => setDelivery(d.id)}
                    className={`p-4 border text-left transition-colors ${delivery === d.id ? "border-sf-red bg-sf-bg2" : "border-sf-line hover:border-sf-red/40"}`}
                  >
                    <div className="font-display uppercase tracking-wider text-sm">{d.title}</div>
                    <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-sf-dim mt-1">{d.sub}</div>
                  </button>
                ))}
              </div>
              <label className="block">
                <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-sf-dim flex items-center gap-1 mb-2"><MapPin className="h-3 w-3" /> Адрес</span>
                <input value={address} onChange={e => setAddress(e.target.value)} className="w-full h-12 bg-sf-bg border border-sf-line px-3 focus:border-sf-red outline-none" />
              </label>
            </section>

            {/* Оплата */}
            <section className="sf-card p-6">
              <p className="sf-eyebrow mb-4">Способ оплаты</p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {PAYMENT_OPTIONS.map(o => (
                  <button
                    key={o.id}
                    onClick={() => setPayment(o.id)}
                    className={`p-4 border text-left transition-colors ${payment === o.id ? "border-sf-red bg-sf-bg2" : "border-sf-line hover:border-sf-red/40"}`}
                  >
                    <div className="font-display uppercase tracking-wider text-sm flex items-center gap-2">
                      {o.id === "card" && <CreditCard className="h-3 w-3" />}
                      {o.title}
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-sf-dim mt-1">{o.sub}</div>
                  </button>
                ))}
              </div>
              <div className="text-xs text-sf-dim flex items-center gap-2 mt-4">
                <Lock className="h-3 w-3 text-sf-red" />
                Деньги в эскроу. Партнёр получит оплату только после твоей приёмки.
              </div>
            </section>
          </div>

          {/* Итого */}
          <aside className="sf-card p-6 h-fit lg:sticky lg:top-24">
            <p className="sf-eyebrow mb-3">Итого</p>
            <div className="font-display text-5xl">{total.toLocaleString("ru-RU")} ₽</div>

            <div className="mt-6 space-y-0">
              <DataRow label={`Производство (${sp.get("material") || "PETG"}, ${sp.get("infillPct") || 35}%)`} value={`${partnerPrice.toLocaleString("ru-RU")} ₽`} />
              <DataRow label="Постобработка" value={`${postProcess} ₽`} />
              <DataRow label="Контроль качества" value={`${qc} ₽`} />
              <DataRow label="Доставка по РФ" value={`${shipping} ₽`} />
            </div>

            <div className="mt-5">
              <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-sf-dim block mb-2">Промокод</label>
              <div className="flex gap-2">
                <input value={promo} onChange={e => setPromo(e.target.value)} placeholder="INVEST26" className="flex-1 h-11 bg-sf-bg border border-sf-line px-3 focus:border-sf-red outline-none uppercase tracking-wider text-sm" />
                <button className="sf-btn-ghost text-xs">Применить</button>
              </div>
              <p className="text-[10px] uppercase tracking-[0.2em] font-mono text-sf-red mt-2">
                Подсказка — INVEST26 даст −10%
              </p>
            </div>

            <button onClick={pay} disabled={loading} className="mt-6 w-full sf-btn-primary justify-between disabled:opacity-40">
              <span>{loading ? "Создаю заказ…" : "Оплатить и в эскроу"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </aside>
        </div>
      </div>
    </>
  )
}
