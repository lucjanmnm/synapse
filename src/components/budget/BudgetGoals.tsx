"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2, Plus } from "lucide-react"

interface Goal {
  id: string
  title: string
  target: number
  saved: number
  color: string
}

export function BudgetGoals({ goals }: { goals: Goal[] }) {
  const [adding, setAdding] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title: "", target: "", color: "#60A5FA" })
  const router = useRouter()

  const COLORS = ["#60A5FA", "#4ADE80", "#F97316", "#8B5CF6", "#F87171", "#FBBF24"]

  async function add(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.target) return
    setLoading(true)

    await fetch("/api/budget-goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        target: parseFloat(form.target),
        color: form.color,
      }),
    })

    setForm({ title: "", target: "", color: "#60A5FA" })
    setLoading(false)
    setAdding(false)
    router.refresh()
  }

  async function remove(id: string) {
    await fetch("/api/budget-goals", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    router.refresh()
  }

  async function updateSaved(id: string, saved: number, amount: number) {
    await fetch("/api/budget-goals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, saved: Math.max(0, saved + amount) }),
    })
    router.refresh()
  }

  return (
    <div className="bg-muted rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Cele oszczędnościowe</p>
        <button
          onClick={() => setAdding(v => !v)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {adding && (
        <form onSubmit={add} className="space-y-2 bg-background rounded-lg p-3">
          <input
            autoFocus
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Nazwa celu (np. Laptop)"
            className="w-full bg-muted rounded-lg px-3 py-2 text-sm outline-none"
          />
          <input
            type="number"
            value={form.target}
            onChange={e => setForm(f => ({ ...f, target: e.target.value }))}
            placeholder="Kwota docelowa (zł)"
            className="w-full bg-muted rounded-lg px-3 py-2 text-sm outline-none"
          />
          <div className="flex gap-2">
            {COLORS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setForm(f => ({ ...f, color: c }))}
                className={`w-6 h-6 rounded-full transition-transform ${form.color === c ? "scale-125 ring-2 ring-foreground ring-offset-1 ring-offset-background" : ""}`}
                style={{ background: c }}
              />
            ))}
          </div>
          <button
            type="submit"
            disabled={loading || !form.title || !form.target}
            className="w-full bg-foreground text-background rounded-lg py-2 text-sm font-medium disabled:opacity-40"
          >
            {loading ? "..." : "Dodaj cel"}
          </button>
        </form>
      )}

      <div className="space-y-3">
        {goals.length > 0 ? (
          goals.map(goal => {
            const percent = Math.min((goal.saved / goal.target) * 100, 100)
            return (
              <div key={goal.id} className="bg-background rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{goal.title}</p>
                  <button
                    onClick={() => remove(goal.id)}
                    className="text-muted-foreground hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{goal.saved.toFixed(2)} zł</span>
                    <span>{goal.target.toFixed(2)} zł</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${percent}%`, background: goal.color }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-right">{percent.toFixed(0)}%</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => updateSaved(goal.id, goal.saved, -50)}
                    className="flex-1 text-xs bg-muted rounded-lg py-1.5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    -50 zł
                  </button>
                  <button
                    onClick={() => updateSaved(goal.id, goal.saved, 50)}
                    className="flex-1 text-xs bg-muted rounded-lg py-1.5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    +50 zł
                  </button>
                  <button
                    onClick={() => updateSaved(goal.id, goal.saved, 100)}
                    className="flex-1 text-xs bg-muted rounded-lg py-1.5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    +100 zł
                  </button>
                </div>
              </div>
            )
          })
        ) : (
          <p className="text-xs text-muted-foreground">Brak celów. Dodaj pierwszy cel!</p>
        )}
      </div>
    </div>
  )
}