"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { MATERIAL_LABELS } from "@/lib/material-recommender"

type MaterialKey = keyof typeof MATERIAL_LABELS

const MATERIAL_OPTIONS: MaterialKey[] = ["PLA", "PLA_PLUS", "PETG", "ABS", "ASA", "TPU", "NYLON", "RESIN"]

// Мастер регистрации производственного партнёра. Все значения здесь напрямую
// подставляются в калькулятор стоимости печати — см. lib/pricing.ts.
export default function PartnerOnboardingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [company, setCompany] = useState({
    companyName: "",
    description: "",
    address: "",
    city: "",
    region: "",
    country: "RU",
    postalCode: "",
    phone: "",
  })

  const [pricing, setPricing] = useState({
    electricityRate: 6,
    laborRate: 500,
    consumablesPerHour: 5,
    marginPct: 30,
    minOrderPrice: 300,
    setupMinutes: 15,
    postProcessMinutes: 10,
    wastePct: 7,
    defaultShipping: 350,
  })

  const [printer, setPrinter] = useState({
    name: "",
    tech: "FDM" as const,
    buildX: 220,
    buildY: 220,
    buildZ: 250,
    powerWatts: 120,
    purchasePrice: 35000,
    lifetimeHours: 5000,
    volumetricSpeed: 12,
    supportedMaterials: ["PLA", "PETG"] as MaterialKey[],
  })

  const [filament, setFilament] = useState({
    type: "PLA" as MaterialKey,
    brand: "",
    colorName: "Чёрный",
    colorHex: "#111111",
    spoolPrice: 1500,
    spoolWeight: 1000,
    density: 1.24,
    stockGrams: 1000,
  })

  async function submit() {
    setLoading(true)
    try {
      const res = await fetch("/api/partner/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, pricing, printer, filament }),
      })
      const body = await res.json()
      if (!res.ok) {
        toast({ title: "Ошибка", description: body?.error ?? "Не удалось сохранить", variant: "destructive" })
        return
      }
      toast({ title: "Профиль партнёра создан", description: "Заказы уже могут к вам приходить" })
      router.push("/partner")
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  function toggleMaterial(m: MaterialKey) {
    setPrinter(p => ({
      ...p,
      supportedMaterials: p.supportedMaterials.includes(m)
        ? p.supportedMaterials.filter(x => x !== m)
        : [...p.supportedMaterials, m],
    }))
  }

  return (
    <div className="container mx-auto max-w-3xl py-10 px-4">
      <h1 className="text-3xl font-bold mb-2">Регистрация партнёра</h1>
      <p className="text-muted-foreground mb-8">
        Шаг {step} из 4. Все указанные здесь параметры влияют на конечную цену для клиента.
      </p>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>1. Компания</CardTitle>
            <CardDescription>Основная информация о вашей мастерской</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Название компании *">
                <Input value={company.companyName} onChange={e => setCompany({ ...company, companyName: e.target.value })} />
              </Field>
              <Field label="Телефон">
                <Input value={company.phone} onChange={e => setCompany({ ...company, phone: e.target.value })} />
              </Field>
              <Field label="Адрес *">
                <Input value={company.address} onChange={e => setCompany({ ...company, address: e.target.value })} />
              </Field>
              <Field label="Город *">
                <Input value={company.city} onChange={e => setCompany({ ...company, city: e.target.value })} />
              </Field>
              <Field label="Регион">
                <Input value={company.region} onChange={e => setCompany({ ...company, region: e.target.value })} />
              </Field>
              <Field label="Индекс *">
                <Input value={company.postalCode} onChange={e => setCompany({ ...company, postalCode: e.target.value })} />
              </Field>
            </div>
            <Field label="Описание">
              <Textarea rows={3} value={company.description} onChange={e => setCompany({ ...company, description: e.target.value })} />
            </Field>
            <div className="flex justify-end">
              <Button onClick={() => setStep(2)} disabled={!company.companyName || !company.address || !company.city || !company.postalCode}>Далее</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>2. Тарифы и себестоимость</CardTitle>
            <CardDescription>
              Эти значения напрямую попадают в калькулятор: материал + электричество + амортизация + труд + наценка.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NumberField label="Тариф электричества, ₽/кВт·ч" value={pricing.electricityRate} onChange={v => setPricing({ ...pricing, electricityRate: v })} hint="Москва 7-9 ₽, регионы 4-6 ₽" />
              <NumberField label="Ваша ставка труда, ₽/час" value={pricing.laborRate} onChange={v => setPricing({ ...pricing, laborRate: v })} hint="оплата за подготовку, постобработку, упаковку" />
              <NumberField label="Расходники, ₽/час печати" value={pricing.consumablesPerHour} onChange={v => setPricing({ ...pricing, consumablesPerHour: v })} hint="сопло, ремни, подшипники (5-15 ₽/ч)" />
              <NumberField label="Наценка партнёра, %" value={pricing.marginPct} onChange={v => setPricing({ ...pricing, marginPct: v })} hint="ваша прибыль поверх себестоимости" />
              <NumberField label="Время на старт, мин" value={pricing.setupMinutes} onChange={v => setPricing({ ...pricing, setupMinutes: v })} hint="прогрев, калибровка, нарезка" />
              <NumberField label="Постобработка, мин" value={pricing.postProcessMinutes} onChange={v => setPricing({ ...pricing, postProcessMinutes: v })} hint="снятие поддержек, шлифовка, упаковка" />
              <NumberField label="Бюджет на брак, %" value={pricing.wastePct} onChange={v => setPricing({ ...pricing, wastePct: v })} hint="5-10% от стоимости материала" />
              <NumberField label="Минимальный заказ, ₽" value={pricing.minOrderPrice} onChange={v => setPricing({ ...pricing, minOrderPrice: v })} />
              <NumberField label="Доставка по умолчанию, ₽" value={pricing.defaultShipping} onChange={v => setPricing({ ...pricing, defaultShipping: v })} />
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>Назад</Button>
              <Button onClick={() => setStep(3)}>Далее</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>3. Первый принтер</CardTitle>
            <CardDescription>
              Мощность и ресурс используются для расчёта электричества и амортизации.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Название модели *">
                <Input value={printer.name} onChange={e => setPrinter({ ...printer, name: e.target.value })} placeholder="Bambu Lab P1S" />
              </Field>
              <NumberField label="Мощность во время печати, Вт" value={printer.powerWatts} onChange={v => setPrinter({ ...printer, powerWatts: Math.round(v) })} hint="FDM обычно 100-150 Вт" />
              <NumberField label="Build X, мм" value={printer.buildX} onChange={v => setPrinter({ ...printer, buildX: v })} />
              <NumberField label="Build Y, мм" value={printer.buildY} onChange={v => setPrinter({ ...printer, buildY: v })} />
              <NumberField label="Build Z, мм" value={printer.buildZ} onChange={v => setPrinter({ ...printer, buildZ: v })} />
              <NumberField label="Объёмная скорость, мм³/с" value={printer.volumetricSpeed} onChange={v => setPrinter({ ...printer, volumetricSpeed: v })} hint="используется для оценки времени печати; 10-20 на FDM" />
              <NumberField label="Цена принтера, ₽" value={printer.purchasePrice} onChange={v => setPrinter({ ...printer, purchasePrice: v })} />
              <NumberField label="Ресурс, часов" value={printer.lifetimeHours} onChange={v => setPrinter({ ...printer, lifetimeHours: Math.round(v) })} hint="≈5000 ч для бытового FDM" />
            </div>
            <div>
              <Label>Поддерживаемые материалы *</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {MATERIAL_OPTIONS.map(m => (
                  <label key={m} className="flex items-center gap-2 border rounded-md p-2 cursor-pointer hover:bg-muted">
                    <Checkbox checked={printer.supportedMaterials.includes(m)} onCheckedChange={() => toggleMaterial(m)} />
                    <span className="text-sm">{MATERIAL_LABELS[m]}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>Назад</Button>
              <Button onClick={() => setStep(4)} disabled={!printer.name || printer.supportedMaterials.length === 0}>Далее</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>4. Первый филамент</CardTitle>
            <CardDescription>
              Цена за катушку и её вес определяют ₽/грамм — это материальная часть калькулятора.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Тип материала *">
                <select className="border rounded-md h-10 px-3 w-full" value={filament.type} onChange={e => setFilament({ ...filament, type: e.target.value as MaterialKey })}>
                  {MATERIAL_OPTIONS.map(m => (
                    <option key={m} value={m}>{MATERIAL_LABELS[m]}</option>
                  ))}
                </select>
              </Field>
              <Field label="Производитель">
                <Input value={filament.brand} onChange={e => setFilament({ ...filament, brand: e.target.value })} placeholder="Bestfilament" />
              </Field>
              <Field label="Название цвета *">
                <Input value={filament.colorName} onChange={e => setFilament({ ...filament, colorName: e.target.value })} />
              </Field>
              <Field label="HEX цвета">
                <Input value={filament.colorHex} onChange={e => setFilament({ ...filament, colorHex: e.target.value })} placeholder="#111111" />
              </Field>
              <NumberField label="Цена катушки, ₽" value={filament.spoolPrice} onChange={v => setFilament({ ...filament, spoolPrice: v })} />
              <NumberField label="Вес катушки, г" value={filament.spoolWeight} onChange={v => setFilament({ ...filament, spoolWeight: Math.round(v) })} />
              <NumberField label="Плотность, г/см³" value={filament.density} onChange={v => setFilament({ ...filament, density: v })} hint="PLA 1.24, PETG 1.27, ABS 1.04" />
              <NumberField label="Остаток на складе, г" value={filament.stockGrams} onChange={v => setFilament({ ...filament, stockGrams: Math.round(v) })} />
            </div>
            <div className="rounded-md bg-muted p-4 text-sm">
              Цена за грамм рассчитается автоматически: <b>{(filament.spoolPrice / Math.max(1, filament.spoolWeight)).toFixed(2)} ₽/г</b>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(3)}>Назад</Button>
              <Button onClick={submit} disabled={loading}>{loading ? "Сохраняем..." : "Завершить регистрацию"}</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function NumberField({ label, value, onChange, hint }: { label: string; value: number; onChange: (v: number) => void; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input type="number" step="any" value={value} onChange={e => onChange(parseFloat(e.target.value) || 0)} />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}
