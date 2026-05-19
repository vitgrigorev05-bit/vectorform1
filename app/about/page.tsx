import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container py-16 max-w-5xl">
      <p className="sf-eyebrow mb-6">О платформе</p>
      <h1 className="font-display text-5xl md:text-7xl uppercase leading-[0.95]">
        Один файл — <span className="text-sf-red">240 заводов</span> в одном клике.
      </h1>
      <p className="text-sf-dim text-lg mt-8 max-w-3xl leading-relaxed">
        СтильФормы — платформа распределённого 3D-производства. Соединяем дизайнеров,
        авторов моделей и сеть из 240+ производителей по всей России.
        Расчёт стоимости — за 8 секунд, оплата в эскроу, контроль качества — на нашей стороне.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-sf-line border border-sf-line mt-14">
        {[
          ["240+", "Партнёров-фабрик"],
          ["12 800", "Заказов в год"],
          ["320", "Авторов моделей"],
          ["98.4%", "Качество приёмки"],
        ].map(([v, l]) => (
          <div key={l} className="bg-sf-bg p-8">
            <div className="font-display text-4xl">{v}</div>
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-sf-dim mt-3">{l}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        {[
          { t: "Прозрачное ценообразование", d: "Каждый партнёр задаёт свои реальные тарифы — электричество, амортизация, материал, труд. Мы только подсчитываем." },
          { t: "Эскроу из коробки", d: "Деньги клиента блокируются на счёте платформы. Партнёр получает оплату только после приёмки заказа." },
          { t: "Распределённое производство", d: "240+ фабрик в 30 городах. Заказ автоматически уходит к ближайшему партнёру с нужным оборудованием." },
          { t: "Маркетплейс моделей", d: "8 412 моделей от 320 авторов. Авторские роялти 70% от каждой продажи и печати." },
        ].map(b => (
          <div key={b.t} className="sf-card p-6">
            <h3 className="font-display text-xl uppercase">{b.t}</h3>
            <p className="text-sf-dim mt-3 text-sm leading-relaxed">{b.d}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 flex flex-col md:flex-row gap-3">
        <Link href="/print/upload" className="sf-btn-primary"><span>Загрузить модель</span> <ArrowRight className="h-4 w-4" /></Link>
        <Link href="/partner/onboarding" className="sf-btn-ghost"><span>Я — производитель</span> <ArrowRight className="h-4 w-4" /></Link>
      </div>
    </div>
  )
}
