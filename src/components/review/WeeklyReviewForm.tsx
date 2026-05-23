"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

function getMonday() {
  const d = new Date()
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d.toISOString().split("T")[0]
}

interface Scores {
  energy: number
  stress: number
  productivity: number
  relationship: number
  physical: number
}

export function WeeklyReviewForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [scores, setScores] = useState<Scores>({
    energy: 5, stress: 5, productivity: 5, relationship: 5, physical: 5,
  })
  const [text, setText] = useState({
    wins: "", mistakes: "", chaos_sources: "",
  })
  const [priorities, setPriorities] = useState(["", "", ""])

  function setScore(key: keyof Scores, val: number) {
    setScores(s => ({ ...s, [key]: val }))
  }

  function setPriority(i: number, val: string) {
    setPriorities(p => p.map((v, j) => j === i ? val : v))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        week_start: getMonday(),
        energy_avg: scores.energy,
        stress_avg: scores.stress,
        productivity: scores.productivity,
        relationship: scores.relationship,
        physical: scores.physical,
        wins: text.wins,
        mistakes: text.mistakes,
        chaos_sources: text.chaos_sources,
        next_priorities: priorities.filter(Boolean),
      }),
    })

    setLoading(false)
    router.refresh()
  }

  const sliders: { key: keyof Scores; label: string; color: string }[] = [
    { key: "energy",       label: "Energia",      color: "#4ade80" },
    { key: "stress",       label: "Stres",        color: "#f87171" },
    { key: "productivity", label: "Produktywność", color: "#60a5fa" },
    { key: "relationship", label: "Relacja",       color: "#c084fc" },
    { key: "physical",     label: "Zdrowie fiz.",  color: "#fb923c" },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-muted rounded-xl p-5">
      <p className="text-sm font-medium">Nowy review - tydzień od {getMonday()}</p>

      {/* Suwaki */}
      <div className="space-y-4">
        {sliders.map(s => (
          <div key={s.key} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{s.label}</span>
              <span className="font-medium">{scores[s.key]}/10</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={scores[s.key]}
              onChange={e => setScore(s.key, parseInt(e.target.value))}
              className="w-full accent-foreground"
            />
          </div>
        ))}
      </div>

      {/* Pola tekstowe */}
      <div className="space-y-3">
        {[
          { key: "wins",          label: "Wygrane / co poszło dobrze" },
          { key: "mistakes",      label: "Błędy / co poszło źle"      },
          { key: "chaos_sources", label: "Źródła chaosu"              },
        ].map(f => (
          <div key={f.key} className="space-y-1">
            <label className="text-xs text-muted-foreground">{f.label}</label>
            <textarea
              value={text[f.key as keyof typeof text]}
              onChange={e => setText(t => ({ ...t, [f.key]: e.target.value }))}
              rows={2}
              className="w-full bg-background rounded-lg px-4 py-2.5 text-sm outline-none resize-none"
              placeholder="..."
            />
          </div>
        ))}
      </div>

      {/* Priorytety */}
      <div className="space-y-2">
        <label className="text-xs text-muted-foreground">Priorytety na następny tydzień</label>
        {priorities.map((p, i) => (
          <input
            key={i}
            value={p}
            onChange={e => setPriority(i, e.target.value)}
            placeholder={`Priorytet ${i + 1}`}
            className="w-full bg-background rounded-lg px-4 py-2.5 text-sm outline-none"
          />
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-foreground text-background rounded-lg py-2.5 text-sm font-medium disabled:opacity-40"
      >
        {loading ? "Zapisuję..." : "Zapisz review"}
      </button>
    </form>
  )
}