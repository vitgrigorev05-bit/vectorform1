import Link from "next/link"
import { ArrowRight, Upload, ShoppingBag, Zap, Truck, Star } from "lucide-react"

// Главный экран «СтильФормы» — реализация макета:
// 01 Hero · 02 Возможности · 07 Партнёры · 03 «Как это работает» (4 шага) ·
// 08 Маркетплейс · 02 Статистика · CTA «Готов к запуску».

const PARTNERS = [
  "ФАБЛАБ МОСКВА", "PRINTSPACE SPB", "КУЗНИЦА УРАЛ", "ATOM·LAB",
  "PEREDOVAYA КАЗАНЬ", "PRINT.BURO", "TECHPARTS", "ZVUK INDUSTRIAL",
]

const STEPS = [
  { n: "01", title: "Загрузи STL", text: "Перетащи 3D-файл или выбери модель из маркетплейса. Поддержка STL, OBJ, 3MF, STEP." },
  { n: "02", title: "Ответь на 4 вопроса", text: "Стиль, материал, тираж, бюджет — визуальный квиз без жаргона." },
  { n: "03", title: "Получи цену", text: "Расчёт по 240 партнёрам за 8 секунд. Без скрытых платежей." },
  { n: "04", title: "Жди доставку", text: "Производство, контроль, доставка — всё внутри платформы." },
]

const FEATURES = [
  { tag: "Маркетплейс", title: "Маркетплейс моделей", text: "8 412 моделей от 320 авторов. Скачивай, печатай локально или закажи производство." },
  { tag: "Расчёт", title: "Быстрый расчёт", text: "240 заводов одним кликом, цена за 8 секунд по реальным тарифам партнёров." },
  { tag: "Производство", title: "Производство по всем стилям", text: "FDM, SLA, SLS, MJF. От штучных прототипов до серий 500+." },
  { tag: "Запуск", title: "Мгновенный запуск", text: "Деньги в эскроу — партнёр получит оплату только после твоей приёмки." },
]

const MARKETPLACE_PREVIEW = [
  { tag: "Обувь", author: "STUDIO NEFT", title: "Сетчатый кроссовок MESH-01", price: "4 800", rating: "4.9", fileTag: "M1.STL" },
  { tag: "Декор", author: "ANNA VOLKOVA", title: "Ваза «Турбулент»", price: "1 900", rating: "4.7", fileTag: "M2.STL" },
  { tag: "Инженерия", author: "PRINT.BURO", title: "Кронштейн A-frame", price: "650", rating: "4.8", fileTag: "M3.STL" },
  { tag: "Мебель", author: "FORM LAB", title: "Стул «Палладий»", price: "6 400", rating: "4.6", fileTag: "M4.STL" },
]

const STATS = [
  { value: "240+", label: "Партнёров-фабрик" },
  { value: "12 800", label: "Заказов в год" },
  { value: "4–12", label: "Дней до доставки" },
  { value: "98.4%", label: "Качество приёмки" },
]

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <Partners />
      <HowItWorks />
      <Marketplace />
      <Stats />
      <CTA />
    </>
  )
}

function Hero() {
  return (
    <section className="relative sf-grid border-b border-sf-line">
      <div className="container relative py-20 md:py-32">
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.25em] text-sf-dim mb-16">
          <span className="sf-eyebrow">01 · Главная · Hero</span>
          <span>01 / 14</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8">
            <p className="sf-eyebrow mb-8">Начни печатать свой мир</p>
            <h1 className="font-display text-[clamp(3rem,9vw,8rem)] leading-[0.85] uppercase">
              Стиль
              <span className="text-sf-red">формы</span>
              <span className="block text-sf-ink">и ты печатаешь</span>
              <span className="block text-sf-dim">свой мир.</span>
            </h1>
            <p className="mt-10 max-w-xl text-sf-dim text-lg leading-relaxed">
              3D-печать. Дизайн. Производство. Один файл — 240 заводов в одном клике.
              Расчёт занимает 8 секунд, первое производство — без предоплаты.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3">
            <Link href="/print/upload" className="sf-btn-primary justify-between">
              <span>Загрузить 3D-модель</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/marketplace" className="sf-btn-ghost justify-between">
              <span>Я не хочу делать сам — маркетплейс</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Stat compact value="240+" label="Партнёров" />
              <Stat compact value="8 412" label="Моделей" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Features() {
  return (
    <section className="sf-section border-b border-sf-line">
      <div className="container">
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.25em] text-sf-dim mb-12">
          <span className="sf-eyebrow">02 · Возможности</span>
          <span>02 / 14</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-sf-line border border-sf-line">
          {FEATURES.map((f, i) => (
            <div key={i} className="bg-sf-bg p-8 hover:bg-sf-bg2 transition-colors group">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-sf-red">/ 0{i + 1}</span>
              <h3 className="font-display text-2xl uppercase mt-4 leading-tight">{f.title}</h3>
              <p className="text-sf-dim text-sm mt-4 leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Partners() {
  return (
    <section className="border-b border-sf-line py-10 overflow-hidden">
      <div className="container">
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.25em] text-sf-dim mb-6">
          <span className="sf-eyebrow">07 · Партнёры</span>
          <span>240+ фабрик в сети</span>
        </div>
        <div className="flex gap-10 overflow-x-auto scroll-hide pb-2">
          {[...PARTNERS, ...PARTNERS].map((p, i) => (
            <div key={i} className="flex items-center gap-3 shrink-0">
              <span className="text-sf-red text-sm">◆</span>
              <span className="font-display uppercase tracking-wider text-sf-dim hover:text-sf-ink transition-colors whitespace-nowrap">
                {p}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section className="sf-section border-b border-sf-line">
      <div className="container">
        <div className="flex items-center justify-between mb-14">
          <div>
            <p className="sf-eyebrow mb-4">Как это работает</p>
            <h2 className="font-display text-4xl md:text-6xl uppercase max-w-3xl leading-[0.95]">
              Один файл — <span className="text-sf-red">240 заводов</span> в одном клике.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-sf-line border border-sf-line">
          {STEPS.map(s => (
            <div key={s.n} className="bg-sf-bg p-8 relative">
              <div className="flex items-center justify-between mb-8">
                <span className="font-display text-5xl text-sf-red leading-none">{s.n}</span>
                <span className="sf-chip">Шаг {s.n}</span>
              </div>
              <h3 className="font-display text-xl uppercase">{s.title}</h3>
              <p className="text-sf-dim text-sm mt-3 leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Marketplace() {
  return (
    <section className="sf-section border-b border-sf-line">
      <div className="container">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="sf-eyebrow mb-4">08 / Свежее в маркетплейсе</p>
            <h2 className="font-display text-4xl md:text-6xl uppercase leading-none">
              Что печатают <span className="text-sf-red">сейчас</span>
            </h2>
          </div>
          <Link href="/marketplace" className="hidden md:inline-flex items-center gap-2 font-display uppercase tracking-wider text-sm text-sf-ink hover:text-sf-red">
            Все модели <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MARKETPLACE_PREVIEW.map(m => (
            <Link key={m.fileTag} href="/marketplace" className="sf-card-hover overflow-hidden group">
              <div className="aspect-[4/5] bg-gradient-to-br from-sf-bg2 to-sf-bg3 relative border-b border-sf-line">
                <div className="absolute inset-0 sf-grid opacity-40" />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="sf-chip-red bg-sf-bg/80">{m.fileTag}</span>
                </div>
                <div className="absolute bottom-3 right-3 flex items-center gap-1 text-xs font-mono text-sf-ink/90">
                  <Star className="h-3 w-3 text-sf-red fill-sf-red" /> {m.rating}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] font-mono text-sf-dim">
                  <span>{m.tag}</span>
                  <span>{m.author}</span>
                </div>
                <h3 className="font-display text-lg uppercase mt-3 leading-tight group-hover:text-sf-red transition-colors">
                  {m.title}
                </h3>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-sf-dim">от</span>
                  <span className="font-display text-xl">{m.price} ₽</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function Stats() {
  return (
    <section className="sf-section border-b border-sf-line">
      <div className="container">
        <p className="sf-eyebrow mb-10">Платформа в цифрах</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-sf-line border border-sf-line">
          {STATS.map(s => (
            <div key={s.label} className="bg-sf-bg p-8">
              <Stat value={s.value} label={s.label} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Stat({ value, label, compact }: { value: string; label: string; compact?: boolean }) {
  return (
    <div className={compact ? "border border-sf-line bg-sf-bg2/40 p-4" : ""}>
      <div className={`font-display uppercase leading-none ${compact ? "text-2xl" : "text-4xl md:text-5xl"}`}>
        {value}
      </div>
      <div className={`mt-2 font-mono uppercase tracking-[0.2em] text-sf-dim ${compact ? "text-[10px]" : "text-xs"}`}>
        {label}
      </div>
    </div>
  )
}

function CTA() {
  return (
    <section className="sf-section">
      <div className="container">
        <div className="border border-sf-line bg-sf-bg2/40 backdrop-blur p-10 md:p-16 relative overflow-hidden">
          <div className="absolute inset-0 sf-grid opacity-30" />
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="sf-eyebrow mb-6">Готов к запуску</p>
              <h2 className="font-display text-4xl md:text-6xl uppercase leading-[0.95]">
                Не жди заводов.<br />
                <span className="text-sf-red">Запусти завод сам.</span>
              </h2>
              <p className="text-sf-dim mt-6 max-w-md leading-relaxed">
                Расчёт занимает 8 секунд. Первое производство — без предоплаты.
                Деньги в эскроу, партнёр получит их только после твоей приёмки.
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:items-end">
              <Link href="/print/upload" className="sf-btn-primary w-full lg:w-auto">
                <Upload className="h-4 w-4" /> Загрузить 3D-модель
              </Link>
              <Link href="/marketplace" className="sf-btn-ghost w-full lg:w-auto">
                <ShoppingBag className="h-4 w-4" /> Выбрать готовое
              </Link>
              <Link href="/partner/onboarding" className="text-sm font-mono uppercase tracking-[0.2em] text-sf-dim hover:text-sf-red mt-2">
                Я — производитель <ArrowRight className="inline h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
