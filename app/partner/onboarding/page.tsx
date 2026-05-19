"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { ScreenMeta, SfChip } from "@/components/sf/screen-meta"
import { ArrowLeft, ArrowRight, Plus } from "lucide-react"
import { MATERIAL_LABELS } from "@/lib/material-recommender"

// Экран 13 макета: «Анкета производства» — 5 шагов, прогресс «3 из 5 шагов · 72%».
// Все значения из этой анкеты подставляются в калькулятор стоимости.

type MaterialKey = keyof typeof MATERIAL_LABELS
const MATERIAL_OPTIONS: MaterialKey[] = ["PLA", "PLA_PLUS", "PETG", "ABS", "ASA", "TPU", "NYLON", "RESIN"]
const TECHS = ["FDM", "SLA", "SLS", "MJF", "DMLS", "Polyjet"] as const

const STEPS = ["Реквизиты", "Оборудование", "Материалы и цены", "Логистика", "Документы"]

export default function PartnerOnboardingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [company, setCompany] = useState({
    companyName: "", description: "", address: "", city: "", region: "",
    country: "RU", postalCode: "", phone: "",
  })
  const [printer, setPrinter] = useState({
    name: "", tech: "FDM" as const,
    buildX: 220, buildY: 220, buildZ: 250,
    powerWatts: 120, purchasePrice: 35000, lifetimeHours: 5000, volumetricSpeed: 12,
    supportedMaterials: ["PLA", "PETG"] as MaterialKey[],
  })
  const [filaments, setFilaments] = useState<Array<{
    type: MaterialKey; brand: string; colorName: string; colorHex: string;
    spoolPrice: number; spoolWeight: number; density: number; stockGrams: number;
  }>>([{ type: "PLA", brand: "", colorName: "Чёрный", colorHex: "#111111", spoolPrice: 1500, spoolWeight: 1000, density: 1.24, stockGrams: 1000 }])
  const [pricing, setPricing] = useState({
    electricityRate: 6, laborRate: 500, consumablesPerHour: 5, marginPct: 30,
    minOrderPrice: 500, setupMinutes: 15, postProcessMinutes: 10, wastePct: 7, defaultShipping: 350,
  })

  const progress = Math.round((step / STEPS.length) * 100)

  async function submit() {
    setLoading(true)
    try {
      const res = await fetch("/api/partner/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, pricing, printer, filament: filaments[0] }),
      })
      const body = await res.json()
      if (!res.ok) {
        toast({ title: "Ошибка", description: body?.error ?? "—", variant: "destructive" }); return
      }
      toast({ title: "Профиль создан", description: "Заказы могут к вам приходить" })
      router.push("/partner")
      router.refresh()
    } finally { setLoading(false) }
  }

  return (
    <div className="container py-12">
      <ScreenMeta left="13 · ЛК Производителя · Анкета" right="13 / 14" />

      <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
        <div>
          <p className="sf-eyebrow mb-3">12 / Анкета производства</p>
          <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.95]">
            Расскажи <span className="text-sf-red">о цехе</span>
          </h1>
          <p className="text-sf-dim mt-4 max-w-2xl leading-relaxed">
            Чем точнее — тем релевантнее заявки. 60% производителей принимают
            первый заказ в день регистрации.
          </p>
        </div>
        <SfChip>{step} из {STEPS.length} шагов · {progress}%</SfChip>
      </div>

      {/* Прогресс-плашки */}
      <div className="grid grid-cols-5 gap-px bg-sf-line border border-sf-line mb-10">
        {STEPS.map((s, i) => {
          const idx = i + 1
          const active = idx === step
          const done = idx < step
          return (
            <button
              key={s}
              onClick={() => setStep(idx as any)}
              className={`bg-sf-bg p-4 text-left transition-colors ${active ? "bg-sf-bg2" : done ? "hover:bg-sf-bg2" : "opacity-60"}`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-display text-2xl leading-none ${active ? "text-sf-red" : done ? "text-sf-ink" : "text-sf-dim"}`}>
                  {String(idx).padStart(2, "0")}
                </span>
                <span className="sf-chip">Шаг {idx}</span>
              </div>
              <div className={`mt-3 font-display uppercase text-xs tracking-wider ${active ? "text-sf-ink" : "text-sf-dim"}`}>
                {s}
              </div>
            </button>
          )
        })}
      </div>

      {step === 1 && (
        <Step title="Реквизиты компании">
          <Grid>
            <Field label="Название компании *"><Input value={company.companyName} onChange={v => setCompany({ ...company, companyName: v })} /></Field>
            <Field label="Телефон"><Input value={company.phone} onChange={v => setCompany({ ...company, phone: v })} /></Field>
            <Field label="Адрес *"><Input value={company.address} onChange={v => setCompany({ ...company, address: v })} /></Field>
            <Field label="Город *"><Input value={company.city} onChange={v => setCompany({ ...company, city: v })} /></Field>
            <Field label="Регион"><Input value={company.region} onChange={v => setCompany({ ...company, region: v })} /></Field>
            <Field label="Индекс *"><Input value={company.postalCode} onChange={v => setCompany({ ...company, postalCode: v })} /></Field>
          </Grid>
          <Field label="Описание"><textarea value={company.description} onChange={e => setCompany({ ...company, description: e.target.value })} rows={3} className="w-full bg-sf-bg border border-sf-line p-3 focus:border-sf-red outline-none" /></Field>
          <Nav onNext={() => setStep(2)} canNext={!!(company.companyName && company.address && company.city && company.postalCode)} />
        </Step>
      )}

      {step === 2 && (
        <Step title="Оборудование">
          <p className="sf-eyebrow mb-4">Технологии печати</p>
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 mb-8">
            {TECHS.map(t => (
              <button key={t} onClick={() => setPrinter({ ...printer, tech: t as any })} className={`p-3 border font-display uppercase text-sm tracking-wider ${printer.tech === t ? "border-sf-red text-sf-red" : "border-sf-line text-sf-dim hover:border-sf-red/40"}`}>
                {t}
              </button>
            ))}
          </div>
          <Grid>
            <Field label="Название модели *"><Input value={printer.name} onChange={v => setPrinter({ ...printer, name: v })} placeholder="Bambu Lab P1S" /></Field>
            <NumField label="Мощность при печати, Вт" value={printer.powerWatts} onChange={v => setPrinter({ ...printer, powerWatts: Math.round(v) })} hint="FDM 100-150 Вт" />
            <NumField label="Build X, мм" value={printer.buildX} onChange={v => setPrinter({ ...printer, buildX: v })} />
            <NumField label="Build Y, мм" value={printer.buildY} onChange={v => setPrinter({ ...printer, buildY: v })} />
            <NumField label="Build Z, мм" value={printer.buildZ} onChange={v => setPrinter({ ...printer, buildZ: v })} />
            <NumField label="Объёмная скорость, мм³/с" value={printer.volumetricSpeed} onChange={v => setPrinter({ ...printer, volumetricSpeed: v })} hint="FDM 10-20" />
            <NumField label="Цена принтера, ₽" value={printer.purchasePrice} onChange={v => setPrinter({ ...printer, purchasePrice: v })} />
            <NumField label="Ресурс, часов" value={printer.lifetimeHours} onChange={v => setPrinter({ ...printer, lifetimeHours: Math.round(v) })} />
          </Grid>
          <p className="sf-eyebrow mb-3 mt-6">Поддерживаемые материалы</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {MATERIAL_OPTIONS.map(m => {
              const checked = printer.supportedMaterials.includes(m)
              return (
                <button key={m} onClick={() => setPrinter(p => ({ ...p, supportedMaterials: checked ? p.supportedMaterials.filter(x => x !== m) : [...p.supportedMaterials, m] }))} className={`p-3 border font-display uppercase text-sm tracking-wider ${checked ? "border-sf-red text-sf-red" : "border-sf-line text-sf-dim hover:border-sf-red/40"}`}>
                  {MATERIAL_LABELS[m]}
                </button>
              )
            })}
          </div>
          <Nav onPrev={() => setStep(1)} onNext={() => setStep(3)} canNext={!!printer.name && printer.supportedMaterials.length > 0} />
        </Step>
      )}

      {step === 3 && (
        <Step title="Материалы и цены">
          <p className="text-sf-dim text-sm mb-6">Доступные материалы (цена за грамм)</p>
          <div className="space-y-3 mb-6">
            {filaments.map((f, idx) => (
              <div key={idx} className="sf-card p-5">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 items-end">
                  <Field label="Тип">
                    <select value={f.type} onChange={e => setFilaments(s => s.map((x, i) => i === idx ? { ...x, type: e.target.value as MaterialKey } : x))} className="w-full h-11 bg-sf-bg border border-sf-line px-3 focus:border-sf-red outline-none">
                      {MATERIAL_OPTIONS.map(m => <option key={m} value={m}>{MATERIAL_LABELS[m]}</option>)}
                    </select>
                  </Field>
                  <Field label="Цвет"><Input value={f.colorName} onChange={v => setFilaments(s => s.map((x, i) => i === idx ? { ...x, colorName: v } : x))} /></Field>
                  <Field label="Цена катушки, ₽"><Input type="number" value={String(f.spoolPrice)} onChange={v => setFilaments(s => s.map((x, i) => i === idx ? { ...x, spoolPrice: Number(v) } : x))} /></Field>
                  <Field label="Вес катушки, г"><Input type="number" value={String(f.spoolWeight)} onChange={v => setFilaments(s => s.map((x, i) => i === idx ? { ...x, spoolWeight: Number(v) } : x))} /></Field>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-sf-dim">Цена</div>
                    <div className="font-display text-2xl text-sf-red">{(f.spoolPrice / Math.max(1, f.spoolWeight)).toFixed(2)} ₽/г</div>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => setFilaments(s => [...s, { type: "PETG", brand: "", colorName: "Чёрный", colorHex: "#111111", spoolPrice: 1990, spoolWeight: 1000, density: 1.27, stockGrams: 1000 }])} className="sf-btn-ghost w-full">
              <Plus className="h-4 w-4" /> Добавить материал
            </button>
          </div>
          <Grid>
            <NumField label="Минимальная сумма заказа, ₽" value={pricing.minOrderPrice} onChange={v => setPricing({ ...pricing, minOrderPrice: v })} />
            <NumField label="Срок изготовления (типовой), дней" value={pricing.setupMinutes / 60} onChange={v => setPricing({ ...pricing, setupMinutes: Math.round(v * 60) })} />
          </Grid>
          <Nav onPrev={() => setStep(2)} onNext={() => setStep(4)} />
        </Step>
      )}

      {step === 4 && (
        <Step title="Логистика и тарифы">
          <Grid>
            <NumField label="Тариф электричества, ₽/кВт·ч" value={pricing.electricityRate} onChange={v => setPricing({ ...pricing, electricityRate: v })} hint="Москва 7-9, регионы 4-6" />
            <NumField label="Ставка труда, ₽/час" value={pricing.laborRate} onChange={v => setPricing({ ...pricing, laborRate: v })} />
            <NumField label="Расходники, ₽/час печати" value={pricing.consumablesPerHour} onChange={v => setPricing({ ...pricing, consumablesPerHour: v })} hint="сопло, ремни (5-15)" />
            <NumField label="Наценка партнёра, %" value={pricing.marginPct} onChange={v => setPricing({ ...pricing, marginPct: v })} />
            <NumField label="Время на старт, мин" value={pricing.setupMinutes} onChange={v => setPricing({ ...pricing, setupMinutes: Math.round(v) })} />
            <NumField label="Постобработка, мин" value={pricing.postProcessMinutes} onChange={v => setPricing({ ...pricing, postProcessMinutes: Math.round(v) })} />
            <NumField label="Бюджет на брак, %" value={pricing.wastePct} onChange={v => setPricing({ ...pricing, wastePct: v })} hint="5-10% от материала" />
            <NumField label="Доставка по умолчанию, ₽" value={pricing.defaultShipping} onChange={v => setPricing({ ...pricing, defaultShipping: v })} />
          </Grid>
          <Nav onPrev={() => setStep(3)} onNext={() => setStep(5)} />
        </Step>
      )}

      {step === 5 && (
        <Step title="Документы и подтверждение">
          <div className="sf-card p-6 mb-6">
            <p className="sf-eyebrow mb-4">Сводка</p>
            <ul className="text-sm text-sf-ink/90 space-y-2">
              <li><b className="text-sf-dim font-mono uppercase text-xs tracking-[0.2em] mr-3">Компания:</b> {company.companyName} · {company.city}</li>
              <li><b className="text-sf-dim font-mono uppercase text-xs tracking-[0.2em] mr-3">Принтер:</b> {printer.name} · {printer.tech} · {printer.buildX}×{printer.buildY}×{printer.buildZ} мм</li>
              <li><b className="text-sf-dim font-mono uppercase text-xs tracking-[0.2em] mr-3">Материалов:</b> {filaments.length}</li>
              <li><b className="text-sf-dim font-mono uppercase text-xs tracking-[0.2em] mr-3">Наценка:</b> {pricing.marginPct}% · мин. заказ {pricing.minOrderPrice} ₽</li>
            </ul>
          </div>
          <p className="text-xs text-sf-dim mb-6">Документы (ИНН, паспорт, выписка из ЕГРЮЛ) можно добавить позже из ЛК.</p>
          <Nav onPrev={() => setStep(4)} onNext={submit} nextLabel={loading ? "Сохраняем…" : "Завершить регистрацию"} canNext={!loading} />
        </Step>
      )}
    </div>
  )
}

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="sf-card p-8">
      <h2 className="font-display text-2xl uppercase tracking-wider mb-6">{title}</h2>
      {children}
    </section>
  )
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-sf-dim">{label}</label>
      {children}
    </div>
  )
}

function Input({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return <input type={type} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} className="w-full h-11 bg-sf-bg border border-sf-line px-3 focus:border-sf-red outline-none" />
}

function NumField({ label, value, onChange, hint }: { label: string; value: number; onChange: (v: number) => void; hint?: string }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-sf-dim">{label}</label>
      <input type="number" step="any" value={value} onChange={e => onChange(parseFloat(e.target.value) || 0)} className="w-full h-11 bg-sf-bg border border-sf-line px-3 focus:border-sf-red outline-none" />
      {hint && <p className="text-[10px] text-sf-dim">{hint}</p>}
    </div>
  )
}

function Nav({ onPrev, onNext, canNext = true, nextLabel = "Дальше" }: { onPrev?: () => void; onNext?: () => void; canNext?: boolean; nextLabel?: string }) {
  return (
    <div className="flex justify-between mt-6">
      {onPrev ? (
        <button onClick={onPrev} className="sf-btn-ghost">
          <ArrowLeft className="h-4 w-4" /> Назад
        </button>
      ) : <span />}
      <button onClick={onNext} disabled={!canNext} className="sf-btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
        {nextLabel} <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  )
}
