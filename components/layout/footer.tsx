import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-sf-line bg-sf-bg">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex h-10 w-10 items-center justify-center bg-sf-bg2 border border-sf-line">
                <span className="font-display text-sf-red text-lg leading-none">Сф</span>
              </span>
              <span className="font-display text-2xl uppercase tracking-wider">
                Стиль<span className="text-sf-red">Формы</span>
              </span>
            </div>
            <p className="text-sf-dim max-w-md leading-relaxed">
              Один файл — 240 заводов в одном клике. 3D-печать, дизайн и производство
              с приёмкой через эскроу. Маркетплейс моделей от 320 авторов.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 text-xs font-mono uppercase tracking-[0.25em] text-sf-dim">
              <span>240+ партнёров-фабрик</span>
              <span className="text-sf-line">·</span>
              <span>12 800 заказов в год</span>
              <span className="text-sf-line">·</span>
              <span>98.4% качество приёмки</span>
            </div>
          </div>

          <FooterCol title="Платформа" links={[
            ["Маркетплейс моделей", "/marketplace"],
            ["Заказ печати", "/print/upload"],
            ["Подбор материала", "/print/material-quiz"],
            ["Партнёрам", "/partner/onboarding"],
          ]} />

          <FooterCol title="Компания" links={[
            ["О платформе", "/about"],
            ["Помощь", "/faq"],
            ["Контакты", "/contact"],
            ["Регистрация", "/auth/register"],
          ]} />
        </div>

        <div className="sf-divider my-12" />

        <div className="flex flex-col md:flex-row justify-between gap-4 text-xs font-mono uppercase tracking-[0.25em] text-sf-dim">
          <span>© 2026 СтильФормы · Прототип</span>
          <span>Сделано в России · v0.1</span>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h3 className="font-display text-sm uppercase tracking-[0.2em] text-sf-ink mb-4">{title}</h3>
      <ul className="space-y-3">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link href={href} className="text-sf-dim hover:text-sf-red transition-colors text-sm">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
