"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { OrderStepBar } from "@/components/sf/step-bar"
import { ScreenMeta, SfChip } from "@/components/sf/screen-meta"
import { ArrowRight } from "lucide-react"
import type { MaterialQuestion } from "@/lib/material-recommender"

// Экран 05 макета: 4 вопроса (Стиль, Материал, Тираж, Когда нужно)
// в виде «карточек-вариантов» с маленькими SVG-превью.

type Recommendation = {
  materials: Array<{ type: string; score: number; reasons: string[] }>
  top: string
}

export default function MaterialQuizPage() {
  return (
    <Suspense fallback={<div className="container py-10 text-sf-dim">Загрузка…</div>}>
      <Inner />
    </Suspense>
  )
}

function Inner() {
  const router = useRouter()
  const sp = useSearchParams()
  const fileId = sp.get("fileId")
  const [questions, setQuestions] = useState<MaterialQuestion[]>([])
  const [labels, setLabels] = useState<Record<string, string>>({})
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [result, setResult] = useState<Recommendation | null>(null)

  useEffect(() => {
    fetch("/api/print/recommend-material")
      .then(r => r.json())
      .then(b => { setQuestions(b.data.questions); setLabels(b.data.labels) })
  }, [])

  async function submit() {
    const res = await fetch("/api/print/recommend-material", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    })
    setResult((await res.json()).data)
  }

  function setSingle(qid: string, value: string) {
    setAnswers(a => ({ ...a, [qid]: value }))
  }
  function toggleMulti(qid: string, value: string, maxChoices?: number) {
    setAnswers(a => {
      const cur = (a[qid] as string[]) || []
      if (cur.includes(value)) return { ...a, [qid]: cur.filter(x => x !== value) }
      if (maxChoices && cur.length >= maxChoices) return a
      return { ...a, [qid]: [...cur, value] }
    })
  }

  return (
    <>
      <OrderStepBar current={2} />
      <div className="container py-12">
        <ScreenMeta left="Превью" right="Шаг 2 / 6" />

        <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.95]">
          Расскажи <span className="text-sf-red">о задаче</span>
        </h1>
        <p className="text-sf-dim mt-4 max-w-2xl leading-relaxed">
          4 вопроса, никакого жаргона. Картинками — быстрее.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-8">
          {questions.map((q, qIdx) => {
            const num = String(qIdx + 1).padStart(2, "0")
            return (
              <section key={q.id}>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-display text-2xl uppercase tracking-wider">
                    <span className="text-sf-red">{num}</span>{" "}
                    {q.question.replace(/\?$/, "")}
                  </h2>
                  {q.multi && <SfChip>Выбери до {q.maxChoices ?? q.options.length}</SfChip>}
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {q.options.map(opt => {
                    const selected = q.multi
                      ? ((answers[q.id] as string[]) || []).includes(opt.id)
                      : answers[q.id] === opt.id
                    return (
                      <button
                        key={opt.id}
                        onClick={() => q.multi ? toggleMulti(q.id, opt.id, q.maxChoices) : setSingle(q.id, opt.id)}
                        className={`sf-card p-6 text-left transition-all ${
                          selected ? "border-sf-red bg-sf-bg2" : "hover:border-sf-red/60"
                        }`}
                      >
                        <div className="aspect-square mb-4 bg-sf-bg flex items-center justify-center border border-sf-line relative overflow-hidden">
                          <div className="absolute inset-0 sf-grid opacity-30" />
                          <span className="font-display text-3xl text-sf-red relative">
                            {opt.id.slice(0, 1).toUpperCase()}
                          </span>
                          <span className="absolute top-2 left-2 text-[10px] font-mono uppercase tracking-[0.2em] text-sf-dim">
                            Variant
                          </span>
                        </div>
                        <div className="font-display uppercase tracking-wider text-sm">{opt.label}</div>
                        <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-sf-dim mt-2">
                          → {opt.materials.map(m => labels[m] ?? m).join(", ")}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>

        <div className="mt-10 flex flex-col md:flex-row gap-3 items-stretch">
          <button onClick={submit} disabled={Object.keys(answers).length === 0} className="sf-btn-primary justify-between flex-1 disabled:opacity-40 disabled:cursor-not-allowed">
            <span>Подобрать материал</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          {fileId && (
            <Link href={`/print/calculate?fileId=${fileId}`} className="sf-btn-ghost">Пропустить</Link>
          )}
        </div>

        {result && (
          <div className="mt-10 sf-card p-8">
            <p className="sf-eyebrow mb-3">Рекомендация AI</p>
            <h3 className="font-display text-3xl uppercase">
              Подходит <span className="text-sf-red">{labels[result.top] ?? result.top}</span>
            </h3>
            <div className="mt-6 space-y-3">
              {result.materials.slice(0, 4).map((m, i) => (
                <div key={m.type} className="flex items-center justify-between p-4 border border-sf-line">
                  <div className="flex items-center gap-4">
                    <span className="font-display text-2xl text-sf-red w-8">0{i + 1}</span>
                    <div>
                      <div className="font-display uppercase tracking-wider">{labels[m.type] ?? m.type}</div>
                      <div className="text-xs text-sf-dim mt-1">{m.reasons.slice(0, 2).join(" · ")}</div>
                    </div>
                  </div>
                  <SfChip>{m.score} баллов</SfChip>
                </div>
              ))}
            </div>
            <Link
              href={`/print/calculate?${new URLSearchParams({ ...(fileId ? { fileId } : {}), material: result.top })}`}
              className="mt-6 sf-btn-primary w-full justify-between"
            >
              <span>Продолжить с {labels[result.top] ?? result.top}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
