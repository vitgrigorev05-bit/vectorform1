"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { ArrowRight, Building, Eye, EyeOff, Lock, Mail, Palette, User } from "lucide-react"

const ROLES = [
  { id: "customer", title: "Клиент", icon: User, sub: "Заказываю печать или скачиваю модели" },
  { id: "author", title: "Автор", icon: Palette, sub: "Продаю свои 3D-модели" },
  { id: "partner", title: "Партнёр", icon: Building, sub: "Принимаю заказы на печать" },
]

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", role: "customer", accept: false })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) { toast({ title: "Заполни обязательные поля", variant: "destructive" }); return }
    if (form.password !== form.confirm) { toast({ title: "Пароли не совпадают", variant: "destructive" }); return }
    if (!form.accept) { toast({ title: "Прими условия", variant: "destructive" }); return }
    setLoading(true)
    try {
      const role = form.role === "author" ? "AUTHOR" : form.role === "partner" ? "PARTNER" : "CUSTOMER"
      const res = await fetch("/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password, role }),
      })
      const body = await res.json()
      if (!res.ok) { toast({ title: "Ошибка", description: body?.error, variant: "destructive" }); return }
      await signIn("credentials", { email: form.email, password: form.password, redirect: false })
      toast({ title: "Добро пожаловать в СтильФормы" })
      if (role === "PARTNER") router.push("/partner/onboarding")
      else if (role === "AUTHOR") router.push("/author")
      else router.push("/dashboard")
      router.refresh()
    } finally { setLoading(false) }
  }

  return (
    <div className="container py-16 max-w-2xl">
      <Link href="/" className="inline-flex items-center gap-3 mb-10">
        <span className="flex h-10 w-10 items-center justify-center bg-sf-bg2 border border-sf-line">
          <span className="font-display text-sf-red text-lg leading-none">Сф</span>
        </span>
        <span className="font-display text-2xl uppercase tracking-wider">
          Стиль<span className="text-sf-red">Формы</span>
        </span>
      </Link>

      <h1 className="font-display text-4xl uppercase">
        Создать <span className="text-sf-red">аккаунт</span>
      </h1>
      <p className="text-sf-dim mt-3 text-sm">Выбери роль — это можно поменять позже.</p>

      <form onSubmit={submit} className="mt-8 space-y-6">
        <div>
          <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-sf-dim mb-3 block">Тип аккаунта</label>
          <div className="grid grid-cols-3 gap-2">
            {ROLES.map(r => {
              const Icon = r.icon
              const sel = form.role === r.id
              return (
                <button key={r.id} type="button" onClick={() => setForm({ ...form, role: r.id })} className={`sf-card p-4 text-left transition-colors ${sel ? "border-sf-red bg-sf-bg2" : "hover:border-sf-red/60"}`}>
                  <Icon className={`h-5 w-5 mb-3 ${sel ? "text-sf-red" : "text-sf-dim"}`} />
                  <div className="font-display uppercase tracking-wider text-sm">{r.title}</div>
                  <div className="text-[10px] text-sf-dim mt-1.5 leading-snug">{r.sub}</div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-sf-dim mb-2 block">Имя *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sf-dim" />
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full h-12 bg-sf-bg2 border border-sf-line pl-10 focus:border-sf-red outline-none" />
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-sf-dim mb-2 block">Email *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sf-dim" />
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full h-12 bg-sf-bg2 border border-sf-line pl-10 focus:border-sf-red outline-none" />
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-sf-dim mb-2 block">Пароль *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sf-dim" />
              <input type={showPw ? "text" : "password"} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full h-12 bg-sf-bg2 border border-sf-line pl-10 pr-10 focus:border-sf-red outline-none" />
              <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sf-dim hover:text-sf-ink">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-sf-dim mb-2 block">Подтверди *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sf-dim" />
              <input type={showPw ? "text" : "password"} value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} className="w-full h-12 bg-sf-bg2 border border-sf-line pl-10 focus:border-sf-red outline-none" />
            </div>
          </div>
        </div>

        <label className="flex items-start gap-3 text-sm text-sf-dim">
          <input type="checkbox" checked={form.accept} onChange={e => setForm({ ...form, accept: e.target.checked })} className="accent-sf-red mt-1" />
          <span>Принимаю <Link href="#" className="text-sf-red underline">условия использования</Link> и <Link href="#" className="text-sf-red underline">политику обработки данных</Link>.</span>
        </label>

        <button type="submit" disabled={loading} className="w-full sf-btn-primary justify-between disabled:opacity-50">
          <span>{loading ? "Создаю…" : "Создать аккаунт"}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <p className="text-center text-sm text-sf-dim mt-8">
        Уже есть аккаунт? <Link href="/auth/login" className="text-sf-red hover:underline">Войти</Link>
      </p>
    </div>
  )
}
