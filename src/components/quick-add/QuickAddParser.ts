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

function stripPrefix(input: string, ...prefixes: string[]): string {
  const lower = input.toLowerCase()
  for (const prefix of prefixes) {
    if (lower.startsWith(prefix + ":")) return input.slice(prefix.length + 1).trim()
    if (lower.startsWith(prefix + " ")) return input.slice(prefix.length + 1).trim()
  }
  return input
}

function parseTimeToHours(h: string, m: string): number {
  return Math.round((parseInt(h) + parseInt(m) / 60) * 10) / 10
}

export function parseQuickAdd(input: string): ParsedLog {
  const raw = input.trim()
  const lower = raw.toLowerCase()

  // Waga: "waga 72.1" | "waga: 72.1"
  if (lower.startsWith("waga")) {
    const val = stripPrefix(raw, "waga")
    const num = parseFloat(val)
    if (!isNaN(num)) return { category: "weight", value_num: num, raw_input: raw }
  }

  // Sen: "sen 7:43" | "sen: 9:43" | "sen 7.5" | "sen: 7.5"
  if (lower.startsWith("sen")) {
    const val = stripPrefix(raw, "sen")
    const timeMatch = val.match(/^(\d+):(\d+)/)
    if (timeMatch) return { category: "sleep", value_num: parseTimeToHours(timeMatch[1], timeMatch[2]), raw_input: raw }
    const num = parseFloat(val)
    if (!isNaN(num)) return { category: "sleep", value_num: num, raw_input: raw }
  }

  // Stres: "stres 8" | "stres: 8"
  if (lower.startsWith("stres")) {
    const val = stripPrefix(raw, "stres")
    const num = parseInt(val)
    if (!isNaN(num)) return { category: "stress", stress_score: num, raw_input: raw }
  }

  // Mood: "mood 7" | "mood: 7" | "nastrój 7"
  if (lower.startsWith("mood") || lower.startsWith("nastrój")) {
    const val = stripPrefix(raw, "mood", "nastrój")
    const num = parseInt(val)
    if (!isNaN(num)) return { category: "mood", mood_score: num, raw_input: raw }
  }

  // Energia: "energia 6" | "energia: 6"
  if (lower.startsWith("energia")) {
    const val = stripPrefix(raw, "energia")
    const num = parseInt(val)
    if (!isNaN(num)) return { category: "note", energy_score: num, raw_input: raw }
  }

  // Trening: "trening nogi" | "trening: push"
  if (lower.startsWith("trening")) {
    const val = stripPrefix(raw, "trening")
    return { category: "training", value_text: val, raw_input: raw }
  }

  // Relacja
  if (lower.startsWith("relacja") || lower.startsWith("kłótnia") || lower.startsWith("rozmowa z")) {
    return { category: "relationship", value_text: raw, raw_input: raw }
  }

  // Pomysł: "pomysł: ..." | "idea: ..."
  if (lower.startsWith("pomysł") || lower.startsWith("idea")) {
    const val = stripPrefix(raw, "pomysł", "idea")
    return { category: "idea", value_text: val, raw_input: raw }
  }

  // Review
  if (lower.startsWith("review") || lower.startsWith("podsumowanie")) {
    return { category: "review", value_text: raw, raw_input: raw }
  }

  // Default: notatka
  return { category: "note", value_text: raw, raw_input: raw }
}