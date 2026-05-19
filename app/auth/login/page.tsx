"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react"

const DEMO = [
  { role: "Клиент", email: "customer@demo.com" },
  { role: "Автор", email: "author@demo.com" },
  { role: "Партнёр", email: "partner@demo.com" },
  { role: "Админ", email: "admin@demo.com" },
]

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) { toast({ title: "Заполни поля", variant: "destructive" }); return }
    setLoading(true)
    try {
      const res = await signIn("credentials", { email, password, redirect: false })
      if (res?.error) toast({ title: "Неверный email или пароль", variant: "destructive" })
      else { toast({ title: "Вход выполнен" }); router.push("/dashboard"); router.refresh() }
    } finally { setLoading(false) }
  }

  return (
    <div className="container py-16 max-w-md">
      <Link href="/" className="inline-flex items-center gap-3 mb-10">
        <span className="flex h-10 w-10 items-center justify-center bg-sf-bg2 border border-sf-line">
          <span className="font-display text-sf-red text-lg leading-none">Сф</span>
        </span>
        <span className="font-display text-2xl uppercase tracking-wider">
          Стиль<span className="text-sf-red">Формы</span>
        </span>
      </Link>

      <h1 className="font-display text-4xl uppercase">
        Вход <span className="text-sf-red">в аккаунт</span>
      </h1>
      <p className="text-sf-dim mt-3 text-sm">Введи email и пароль или используй демо-доступ ниже.</p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <div>
          <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-sf-dim mb-2 block">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sf-dim" />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" className="w-full h-12 bg-sf-bg2 border border-sf-line pl-10 pr-3 focus:border-sf-red outline-none" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-sf-dim">Пароль</label>
            <Link href="#" className="text-[10px] uppercase tracking-[0.2em] font-mono text-sf-red">Забыли?</Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sf-dim" />
            <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Введи пароль" className="w-full h-12 bg-sf-bg2 border border-sf-line pl-10 pr-10 focus:border-sf-red outline-none" />
            <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sf-dim hover:text-sf-ink">
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full sf-btn-primary justify-between disabled:opacity-50">
          <span>{loading ? "Вход…" : "Войти"}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <div className="sf-divider my-8" />

      <p className="sf-eyebrow mb-3">Демо-аккаунты</p>
      <div className="grid grid-cols-2 gap-2">
        {DEMO.map(d => (
          <button key={d.email} onClick={() => { setEmail(d.email); setPassword("demo123") }} className="sf-card p-3 text-left hover:border-sf-red/60 transition-colors">
            <div className="font-display uppercase text-sm tracking-wider">{d.role}</div>
            <div className="text-[10px] font-mono text-sf-dim mt-1">{d.email}</div>
          </button>
        ))}
      </div>

      <p className="text-center text-sm text-sf-dim mt-8">
        Нет аккаунта? <Link href="/auth/register" className="text-sf-red hover:underline">Регистрация</Link>
      </p>
    </div>
  )
}
