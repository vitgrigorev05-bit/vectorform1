import Link from "next/link"

// Левый sidebar для ЛК + хедер с инициалами и статистикой — экраны 09–14 макета.
export interface SidebarItem {
  label: string
  href: string
  count?: number
}

export function DashboardShell({
  initials,
  name,
  role,
  verified,
  sidebar,
  active,
  children,
}: {
  initials: string
  name: string
  role: string
  verified?: boolean
  sidebar: SidebarItem[]
  active: string
  children: React.ReactNode
}) {
  return (
    <div className="container py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[260px,1fr] gap-8">
        <aside className="space-y-6">
          <div className="sf-card p-5">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 flex items-center justify-center bg-sf-bg2 border border-sf-line font-display text-sf-red text-lg">
                {initials}
              </div>
              <div>
                <div className="font-display uppercase text-sm tracking-wider">{name}</div>
                <div className="text-xs font-mono uppercase tracking-[0.2em] text-sf-dim mt-0.5">
                  {role}
                </div>
              </div>
            </div>
            {verified && (
              <div className="mt-4 flex items-center gap-2 text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                <span className="font-mono uppercase tracking-[0.2em] text-sf-dim">Верифицирован</span>
              </div>
            )}
          </div>

          <nav className="sf-card p-2">
            {sidebar.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 font-display uppercase text-xs tracking-wider transition-colors ${
                  item.label === active
                    ? "bg-sf-red text-white"
                    : "text-sf-ink/80 hover:bg-sf-bg2 hover:text-sf-red"
                }`}
              >
                <span>{item.label}</span>
                {item.count !== undefined && (
                  <span className={`font-mono ${item.label === active ? "text-white" : "text-sf-dim"}`}>
                    {item.count}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </aside>

        <div>{children}</div>
      </div>
    </div>
  )
}

export function StatTile({ value, label, hint, accent }: { value: React.ReactNode; label: string; hint?: string; accent?: boolean }) {
  return (
    <div className="sf-card p-6">
      <div className={`font-display uppercase leading-none text-4xl ${accent ? "text-sf-red" : "text-sf-ink"}`}>{value}</div>
      <div className="mt-3 text-xs font-mono uppercase tracking-[0.2em] text-sf-dim">{label}</div>
      {hint && <div className="mt-1 text-xs text-sf-dim">{hint}</div>}
    </div>
  )
}
