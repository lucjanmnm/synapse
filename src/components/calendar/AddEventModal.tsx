"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, X } from "lucide-react"

interface Category {
  id: string
  name: string
  color: string
}

const DAYS = ["Pn", "Wt", "Śr", "Cz", "Pt", "Sb", "Nd"]

interface Props {
  initialDate?: string
  initialTime?: string
  onClose?: () => void
}

export function AddEventModal({ initialDate, initialTime, onClose }: Props) {
  const [open, setOpen] = useState(!!initialDate)
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState({
    title: "",
    date: initialDate ?? new Date().toISOString().split("T")[0],
    time_start: initialTime ?? "",
    time_end: "",
    description: "",
    category_id: "",
    recurring: false,
    recurring_days: [] as number[],
  })
  const router = useRouter()

  useEffect(() => {
    fetch("/api/event-categories")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setCategories(data) })
  }, [])

  // Sync jeśli initialDate/initialTime się zmienią
  useEffect(() => {
    if (initialDate) {
      setOpen(true)
      setForm(f => ({
        ...f,
        date: initialDate,
        time_start: initialTime ?? f.time_start,
      }))
    }
  }, [initialDate, initialTime])

  function close() {
    setOpen(false)
    onClose?.()
  }

  function update(key: string, value: any) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function toggleDay(day: number) {
    setForm(f => ({
      ...f,
      recurring_days: f.recurring_days.includes(day)
        ? f.recurring_days.filter(d => d !== day)
        : [...f.recurring_days, day],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.date) return
    setLoading(true)

    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        category_id: form.category_id || null,
        recurring_days: form.recurring ? form.recurring_days : null,
      }),
    })

    setForm({
      title: "",
      date: initialDate ?? new Date().toISOString().split("T")[0],
      time_start: initialTime ?? "",
      time_end: "",
      description: "",
      category_id: "",
      recurring: false,
      recurring_days: [],
    })
    setLoading(false)
    close()
    router.refresh()
  }

  return (
    <>
      {/* Przycisk — tylko gdy nie jest używany jako controlled modal */}
      {!initialDate && (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-foreground text-background rounded-lg px-4 py-2 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Dodaj event
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) close() }}
        >
          <div className="w-full md:max-w-md bg-background border border-border rounded-t-2xl md:rounded-2xl p-5 m-0 md:m-4 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Nowy event</p>
              <button onClick={close} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Tytuł *</label>
                <input
                  autoFocus
                  value={form.title}
                  onChange={e => update("title", e.target.value)}
                  placeholder="np. Szkoła"
                  className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Kategoria</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => update("category_id", cat.id === form.category_id ? "" : cat.id)}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                        form.category_id === cat.id ? "border-foreground" : "border-border"
                      }`}
                    >
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} />
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Data *</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => update("date", e.target.value)}
                  className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Od</label>
                  <input
                    type="time"
                    value={form.time_start}
                    onChange={e => update("time_start", e.target.value)}
                    className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Do</label>
                  <input
                    type="time"
                    value={form.time_end}
                    onChange={e => update("time_end", e.target.value)}
                    className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Opis</label>
                <textarea
                  value={form.description}
                  onChange={e => update("description", e.target.value)}
                  placeholder="Opcjonalny opis..."
                  rows={2}
                  className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.recurring}
                    onChange={e => update("recurring", e.target.checked)}
                    className="rounded"
                  />
                  Powtarzający się event
                </label>

                {form.recurring && (
                  <div className="flex gap-2">
                    {DAYS.map((day, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => toggleDay(i)}
                        className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                          form.recurring_days.includes(i)
                            ? "bg-foreground text-background"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !form.title}
                className="w-full bg-foreground text-background rounded-lg py-2.5 text-sm font-medium disabled:opacity-40"
              >
                {loading ? "Dodaję..." : "Dodaj event"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}