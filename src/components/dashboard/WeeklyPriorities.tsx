"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"

interface Priority {
  id: string
  title: string
  completed: boolean
}

export function WeeklyPriorities() {
  const [priorities, setPriorities] = useState<Priority[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch("/api/priorities")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setPriorities(data)
      })
      .catch(() => setPriorities([]))
  }, [])

  async function add(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    setLoading(true)

    const res = await fetch("/api/priorities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: input }),
    })
    const data = await res.json()
    setPriorities(p => [...p, data])
    setInput("")
    setLoading(false)
  }

  async function toggle(id: string, completed: boolean) {
    await fetch("/api/priorities", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, completed: !completed }),
    })
    setPriorities(p => p.map(x => x.id === id ? { ...x, completed: !x.completed } : x))
  }

  async function remove(id: string) {
    await fetch("/api/priorities", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    setPriorities(p => p.filter(x => x.id !== id))
  }

  return (
    <div className="bg-muted rounded-xl p-4 space-y-3">
      <div>
        <p className="text-sm font-medium">Priorytety tygodnia</p>
        <p className="text-xs text-muted-foreground">o czym pamiętasz</p>
      </div>

      <div className="space-y-2">
        {priorities.map(p => (
          <div key={p.id} className="flex items-center gap-2">
            <button
              onClick={() => toggle(p.id, p.completed)}
              className={`w-4 h-4 rounded-full border shrink-0 transition-colors ${
                p.completed
                  ? "bg-foreground border-foreground"
                  : "border-muted-foreground"
              }`}
            />
            <span className={`text-sm flex-1 ${p.completed ? "line-through text-muted-foreground" : ""}`}>
              {p.title}
            </span>
            <button
              onClick={() => remove(p.id)}
              className="text-muted-foreground hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      <form onSubmit={add} className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Dodaj priorytet..."
          className="flex-1 bg-background rounded-lg px-3 py-2 text-xs outline-none"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-foreground text-background rounded-lg px-3 py-2 text-xs font-medium disabled:opacity-40"
        >
          +
        </button>
      </form>
    </div>
  )
}