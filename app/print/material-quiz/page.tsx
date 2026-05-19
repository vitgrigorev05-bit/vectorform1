"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { MaterialQuestion } from "@/lib/material-recommender"

type Recommendation = {
  materials: Array<{ type: string; score: number; reasons: string[] }>
  top: string
}

export default function MaterialQuizPage() {
  return (
    <Suspense fallback={<div className="container py-10">Загрузка...</div>}>
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/print/recommend-material")
      .then(r => r.json())
      .then(b => {
        setQuestions(b.data.questions)
        setLabels(b.data.labels)
        setLoading(false)
      })
  }, [])

  async function submit() {
    const res = await fetch("/api/print/recommend-material", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    })
    const body = await res.json()
    setResult(body.data)
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

  if (loading) return <div className="container py-10">Загрузка...</div>

  return (
    <div className="container mx-auto max-w-3xl py-10 px-4">
      <h1 className="text-3xl font-bold mb-2">Подбор материала</h1>
      <p className="text-muted-foreground mb-6">
        Ответьте на 4 вопроса — мы порекомендуем подходящие пластики и подставим их в калькулятор.
      </p>

      <div className="space-y-6">
        {questions.map(q => (
          <Card key={q.id}>
            <CardHeader>
              <CardTitle className="text-lg">{q.question}</CardTitle>
              {q.multi && (
                <CardDescription>
                  Можно выбрать до {q.maxChoices ?? q.options.length}.
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-2">
              {q.options.map(opt => {
                const selected = q.multi
                  ? ((answers[q.id] as string[]) || []).includes(opt.id)
                  : answers[q.id] === opt.id
                return (
                  <label
                    key={opt.id}
                    className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer hover:bg-muted ${selected ? "border-primary bg-primary/5" : ""}`}
                    onClick={() => q.multi ? toggleMulti(q.id, opt.id, q.maxChoices) : setSingle(q.id, opt.id)}
                  >
                    <Checkbox checked={selected} className="mt-0.5" onCheckedChange={() => {}} />
                    <div>
                      <div className="font-medium">{opt.label}</div>
                      <div className="text-xs text-muted-foreground">→ {opt.materials.map(m => labels[m] ?? m).join(", ")}</div>
                    </div>
                  </label>
                )
              })}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        <Button onClick={submit} disabled={Object.keys(answers).length === 0}>Подобрать материал</Button>
        {fileId && (
          <Button variant="outline" onClick={() => router.push(`/print/calculate?fileId=${fileId}`)}>Пропустить</Button>
        )}
      </div>

      {result && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Рекомендация</CardTitle>
            <CardDescription>На основе ваших ответов лучше всего подойдут эти материалы:</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.materials.slice(0, 4).map(m => (
              <div key={m.type} className="flex items-start justify-between p-3 rounded-md border">
                <div>
                  <div className="font-semibold">{labels[m.type] ?? m.type}</div>
                  <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                    {m.reasons.slice(0, 3).map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
                <div className="text-sm text-muted-foreground">балл {m.score}</div>
              </div>
            ))}
            <Button className="w-full mt-2" onClick={() => {
              const qs = new URLSearchParams()
              if (fileId) qs.set("fileId", fileId)
              qs.set("material", result.top)
              router.push(`/print/calculate?${qs.toString()}`)
            }}>
              Продолжить с {labels[result.top] ?? result.top}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
