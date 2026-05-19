"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react"

export default function ContactPage() {
  const { toast } = useToast()
  const [form, setForm] = useState({ name: "", email: "", message: "" })

  function submit(e: React.FormEvent) {
    e.preventDefault()
    toast({ title: "Сообщение отправлено", description: "Ответим в течение 2 часов" })
    setForm({ name: "", email: "", message: "" })
  }

  return (
    <div className="container py-16 max-w-5xl">
      <p className="sf-eyebrow mb-6">Контакты</p>
      <h1 className="font-display text-5xl md:text-7xl uppercase leading-[0.95]">
        Связаться с <span className="text-sf-red">нами</span>.
      </h1>
      <p className="text-sf-dim mt-6 max-w-2xl">Команда платформы — на связи 24/7 для партнёров и в будни 10:00–20:00 для клиентов.</p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-10 mt-14">
        <form onSubmit={submit} className="sf-card p-8 space-y-4">
          <h2 className="font-display text-2xl uppercase tracking-wider mb-2">Напишите нам</h2>
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-sf-dim mb-2 block">Имя</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full h-12 bg-sf-bg border border-sf-line px-3 focus:border-sf-red outline-none" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-sf-dim mb-2 block">Email</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full h-12 bg-sf-bg border border-sf-line px-3 focus:border-sf-red outline-none" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] font-mono text-sf-dim mb-2 block">Сообщение</label>
            <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={5} className="w-full bg-sf-bg border border-sf-line p-3 focus:border-sf-red outline-none" />
          </div>
          <button type="submit" className="sf-btn-primary w-full justify-between">
            <span>Отправить</span> <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="space-y-3">
          <ContactCard icon={Mail} title="Email" value="support@styleforms.ru" />
          <ContactCard icon={Phone} title="Телефон" value="+7 800 555-35-35" />
          <ContactCard icon={MessageCircle} title="Telegram" value="@styleforms_bot" />
          <ContactCard icon={MapPin} title="Адрес" value="Москва, ул. Большая Никитская, 12" />
        </div>
      </div>
    </div>
  )
}

function ContactCard({ icon: Icon, title, value }: { icon: any; title: string; value: string }) {
  return (
    <div className="sf-card p-5 flex items-start gap-4">
      <div className="h-10 w-10 flex items-center justify-center bg-sf-bg border border-sf-line">
        <Icon className="h-4 w-4 text-sf-red" />
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-sf-dim">{title}</div>
        <div className="font-display uppercase tracking-wider text-sm mt-1">{value}</div>
      </div>
    </div>
  )
}
