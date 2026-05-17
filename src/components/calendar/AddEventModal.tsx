"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, X } from "lucide-react"

export function AddEventModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    time: "",
    description: "",
  })
  const router = useRouter()

  function update(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.date) return
    setLoading(true)

    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    setForm({ title: "", date: new Date().toISOString().split("T")[0], time: "", description: "" })
    setLoading(false)
    setOpen(false)
    router.refresh()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-foreground text-background rounded-lg px-4 py-2 text-sm font-medium"
      >
        <Plus className="w-4 h-4" />
        Dodaj event
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}
        >
          <div className="w-full md:max-w-md bg-background border border-border rounded-t-2xl md:rounded-2xl p-5 m-0 md:m-4 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Nowy event</p>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Tytuł *</label>
                <input
                  value={form.title}
                  onChange={e => update("title", e.target.value)}
                  placeholder="np. Wizyta u lekarza"
                  className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Godzina</label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={e => update("time", e.target.value)}
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