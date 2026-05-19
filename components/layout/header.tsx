import Link from "next/link"
import { Upload, User } from "lucide-react"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-sf-line bg-sf-bg/80 backdrop-blur supports-[backdrop-filter]:bg-sf-bg/70">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center bg-sf-bg2 border border-sf-line">
              <span className="font-display text-sf-red text-lg leading-none">Сф</span>
            </span>
            <span className="font-display text-xl uppercase tracking-wider">
              Стиль<span className="text-sf-red">Формы</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 font-display uppercase tracking-wider text-sm">
            <NavLink href="/marketplace">Маркетплейс</NavLink>
            <NavLink href="/print/upload">Заказ печати</NavLink>
            <NavLink href="/partner/onboarding">Партнёрам</NavLink>
            <NavLink href="/about">О платформе</NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/print/upload" className="hidden sm:inline-flex items-center gap-2 px-4 py-2 border border-sf-line text-sf-ink font-display uppercase text-xs tracking-wider hover:border-sf-red hover:text-sf-red transition-colors">
            <Upload className="h-4 w-4" />
            Загрузить
          </Link>
          <Link href="/auth/login" className="inline-flex items-center gap-2 px-4 py-2 bg-sf-red text-white font-display uppercase text-xs tracking-wider hover:bg-sf-redDark transition-colors">
            <User className="h-4 w-4" />
            Войти
          </Link>
        </div>
      </div>
    </header>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sf-ink/80 hover:text-sf-red transition-colors">
      {children}
    </Link>
  )
}
