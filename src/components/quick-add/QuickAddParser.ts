export type LogCategory =
  | "weight" | "sleep" | "training" | "stress"
  | "mood" | "note" | "relationship" | "idea" | "review"

export interface ParsedLog {
  category: LogCategory
  value_num?: number
  value_text?: string
  mood_score?: number
  stress_score?: number
  energy_score?: number
  raw_input: string
}

export function parseQuickAdd(input: string): ParsedLog {
  const raw = input.trim()
  const lower = raw.toLowerCase()

  const weight = lower.match(/^waga\s+([\d.]+)/)
  if (weight) return { category: "weight", value_num: parseFloat(weight[1]), raw_input: raw }

  const sleep = lower.match(/^sen\s+([\d.]+)/)
  if (sleep) return { category: "sleep", value_num: parseFloat(sleep[1]), raw_input: raw }

  const stress = lower.match(/^stres\s+(\d+)/)
  if (stress) return { category: "stress", stress_score: parseInt(stress[1]), raw_input: raw }

  const mood = lower.match(/^mood\s+(\d+)/)
  if (mood) return { category: "mood", mood_score: parseInt(mood[1]), raw_input: raw }

  const energy = lower.match(/^energia\s+(\d+)/)
  if (energy) return { category: "note", energy_score: parseInt(energy[1]), raw_input: raw }

  if (lower.startsWith("trening"))
    return { category: "training", value_text: raw.slice(7).trim(), raw_input: raw }

  if (lower.startsWith("relacja") || lower.startsWith("kłótnia"))
    return { category: "relationship", value_text: raw, raw_input: raw }

  if (lower.startsWith("pomysł"))
    return { category: "idea", value_text: raw.replace(/^pomysł[:\s]*/i, ""), raw_input: raw }

  return { category: "note", value_text: raw, raw_input: raw }
}