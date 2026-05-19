// Опросник материала. Возвращает рекомендованные типы филамента
// на основе ответов пользователя.

import { MaterialType } from "@prisma/client"

export interface MaterialQuestion {
  id: string
  question: string
  multi: boolean
  maxChoices?: number
  options: Array<{
    id: string
    label: string
    materials: MaterialType[]
  }>
}

export const MATERIAL_QUESTIONS: MaterialQuestion[] = [
  {
    id: "purpose",
    question: "Для чего будет использоваться изделие?",
    multi: false,
    options: [
      { id: "decor", label: "Декор или сувенир для дома", materials: ["PLA", "PLA_PLUS"] },
      { id: "jewelry", label: "Украшение или бижутерия", materials: ["PLA", "RESIN"] },
      { id: "household", label: "Функциональная вещь для дома", materials: ["PETG"] },
      { id: "tech-part", label: "Запчасть или техническая деталь", materials: ["PETG", "ASA", "NYLON"] },
    ],
  },
  {
    id: "properties",
    question: "Какие свойства для вас наиболее важны?",
    multi: true,
    maxChoices: 2,
    options: [
      { id: "strong", label: "Высокая прочность", materials: ["PETG", "ASA", "NYLON"] },
      { id: "flex", label: "Гибкость или эластичность", materials: ["TPU"] },
      { id: "light", label: "Лёгкость (минимальный вес)", materials: ["PLA", "PETG"] },
      { id: "looks", label: "Красивый внешний вид", materials: ["RESIN", "PLA_PLUS", "PETG"] },
    ],
  },
  {
    id: "temperature",
    question: "В каких температурных условиях будет использоваться изделие?",
    multi: false,
    options: [
      { id: "room", label: "Комнатная температура (до +40°C)", materials: ["PLA", "PETG"] },
      { id: "hot", label: "Высокие температуры (+60..+100°C)", materials: ["ASA", "NYLON"] },
      { id: "cold", label: "Низкие температуры (от -20°C)", materials: ["ASA", "PETG", "NYLON"] },
      { id: "swings", label: "Перепады температур", materials: ["ASA"] },
    ],
  },
  {
    id: "postprocess",
    question: "Нужна ли постобработка или специальная печать?",
    multi: false,
    options: [
      { id: "multi-color", label: "Многоцветная печать", materials: ["PLA"] },
      { id: "sanding", label: "Шлифовка", materials: ["PLA_PLUS", "PETG"] },
      { id: "paint", label: "Покраска", materials: ["PLA", "PETG", "ASA"] },
      { id: "assembly", label: "Сборка деталей", materials: ["PETG"] },
    ],
  },
]

export interface Answers {
  // questionId -> selected optionId(s)
  [questionId: string]: string | string[]
}

export interface RecommendationResult {
  materials: Array<{ type: MaterialType; score: number; reasons: string[] }>
  top: MaterialType
}

export function recommendMaterial(answers: Answers): RecommendationResult {
  const scores = new Map<MaterialType, { score: number; reasons: string[] }>()

  for (const q of MATERIAL_QUESTIONS) {
    const answer = answers[q.id]
    if (!answer) continue
    const selectedIds = Array.isArray(answer) ? answer : [answer]
    for (const optId of selectedIds) {
      const opt = q.options.find(o => o.id === optId)
      if (!opt) continue
      for (const mat of opt.materials) {
        const cur = scores.get(mat) ?? { score: 0, reasons: [] }
        cur.score += 1
        cur.reasons.push(`${q.question.replace(/\?$/, "")} → ${opt.label}`)
        scores.set(mat, cur)
      }
    }
  }

  const ranked = Array.from(scores.entries())
    .map(([type, v]) => ({ type, ...v }))
    .sort((a, b) => b.score - a.score)

  return {
    materials: ranked,
    top: ranked[0]?.type ?? "PLA",
  }
}

export const MATERIAL_LABELS: Record<MaterialType, string> = {
  PLA: "PLA",
  PLA_PLUS: "PLA+",
  PETG: "PETG",
  ABS: "ABS",
  ASA: "ASA",
  TPU: "TPU",
  NYLON: "Нейлон (PA)",
  RESIN: "Смола (SLA)",
  OTHER: "Другое",
}

// Дефолтная плотность по типу (г/см³) — используется, если у партнёра нет филамента
export const DEFAULT_DENSITY: Record<MaterialType, number> = {
  PLA: 1.24,
  PLA_PLUS: 1.24,
  PETG: 1.27,
  ABS: 1.04,
  ASA: 1.07,
  TPU: 1.21,
  NYLON: 1.14,
  RESIN: 1.10,
  OTHER: 1.20,
}
