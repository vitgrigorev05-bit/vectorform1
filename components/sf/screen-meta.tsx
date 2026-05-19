// Шапка экрана: «01 · Главная · Hero · 01 / 14» — служебный layer макета.
export function ScreenMeta({ left, right }: { left: string; right: string }) {
  return (
    <div className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.25em] text-sf-dim mb-10">
      <span className="sf-eyebrow">{left}</span>
      <span>{right}</span>
    </div>
  )
}

// «Хлебная» страница: заголовок Oswald uppercase + подзаголовок.
export function PageTitle({ eyebrow, title, subtitle, children }: { eyebrow?: string; title: React.ReactNode; subtitle?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-6 flex-wrap">
      <div>
        {eyebrow && <p className="sf-eyebrow mb-4">{eyebrow}</p>}
        <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.95]">{title}</h1>
        {subtitle && <p className="text-sf-dim mt-4 max-w-2xl leading-relaxed">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

export function DataRow({ label, value, accent }: { label: string; value: React.ReactNode; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-sf-line last:border-0">
      <span className="text-xs font-mono uppercase tracking-[0.2em] text-sf-dim">{label}</span>
      <span className={accent ? "font-display text-sf-red" : "font-display text-sf-ink"}>{value}</span>
    </div>
  )
}

export function SfChip({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "red" | "live" }) {
  if (variant === "red") return <span className="sf-chip border-sf-red text-sf-red">{children}</span>
  if (variant === "live") return <span className="sf-chip border-sf-red text-sf-red flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-sf-red animate-pulse" />{children}</span>
  return <span className="sf-chip">{children}</span>
}

export function SfCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`sf-card p-6 ${className}`}>{children}</div>
}
