"use client"
import { useState, useEffect } from "react"
import { Trash2 } from "lucide-react"

interface Category {
  id: string
  name: string
  color: string
}

const PRESET_COLORS = [
  "#EF4444", "#F97316", "#EAB308", "#22C55E",
  "#3B82F6", "#8B5CF6", "#EC4899", "#6B7280",
]

export function CalendarCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState("")
  const [color, setColor] = useState("#3B82F6")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch("/api/event-categories")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setCategories(data) })
  }, [])

  async function add(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)

    const res = await fetch("/api/event-categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, color }),
    })
    const data = await res.json()
    setCategories(c => [...c, data])
    setName("")
    setLoading(false)
  }

  async function remove(id: string) {
    await fetch("/api/event-categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    setCategories(c => c.filter(x => x.id !== id))
  }

  return (
    <div className="bg-muted rounded-xl p-5 space-y-4">
      <div>
        <p className="text-sm font-medium">Kategorie kalendarza</p>
        <p className="text-xs text-muted-foreground mt-1">Zarządzaj kategoriami eventów.</p>
      </div>

      {/* Lista */}
      <div className="space-y-2">
        {categories.map(cat => (
          <div key={cat.id} className="flex items-center justify-between bg-background rounded-lg px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full shrink-0" style={{ background: cat.color }} />
              <span className="text-sm">{cat.name}</span>
            </div>
            <button
              onClick={() => remove(cat.id)}
              className="text-muted-foreground hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Dodaj nową */}
      <form onSubmit={add} className="space-y-3">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Nazwa kategorii"
          className="w-full bg-background rounded-lg px-4 py-2.5 text-sm outline-none"
        />
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Kolor</p>
          <div className="flex gap-2">
            {PRESET_COLORS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-6 h-6 rounded-full transition-transform ${color === c ? "scale-125 ring-2 ring-foreground ring-offset-1 ring-offset-background" : ""}`}
                style={{ background: c }}
              />
            ))}
            <input
              type="color"
              value={color}
              onChange={e => setColor(e.target.value)}
              className="w-6 h-6 rounded-full cursor-pointer bg-transparent border-0"
              title="Własny kolor"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="w-full bg-foreground text-background rounded-lg py-2 text-sm font-medium disabled:opacity-40"
        >
          {loading ? "Dodaję..." : "Dodaj kategorię"}
        </button>
      </form>
    </div>
  )
}