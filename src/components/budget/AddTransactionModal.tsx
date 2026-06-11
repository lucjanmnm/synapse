"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, X } from "lucide-react"

interface Category {
  id: string
  name: string
  type: string
  color: string
}

export function AddTransactionModal({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState<"expense" | "income">("expense")
  const [form, setForm] = useState({
    amount: "",
    description: "",
    category_id: "",
    date: new Date().toISOString().split("T")[0],
  })
  const router = useRouter()

  const filtered = categories.filter(c => c.type === type)

  function update(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.amount) return
    setLoading(true)

    await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        amount: parseFloat(form.amount),
        description: form.description || null,
        category_id: form.category_id || null,
        date: form.date,
      }),
    })

    setForm({ amount: "", description: "", category_id: "", date: new Date().toISOString().split("T")[0] })
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
        Dodaj
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}
        >
          <div className="w-full md:max-w-md bg-background border border-border rounded-t-2xl md:rounded-2xl p-5 m-0 md:m-4 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Nowa transakcja</p>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Typ */}
              <div className="flex bg-muted rounded-lg p-1 gap-1">
                <button
                  type="button"
                  onClick={() => { setType("expense"); update("category_id", "") }}
                  className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    type === "expense" ? "bg-red-500/20 text-red-400" : "text-muted-foreground"
                  }`}
                >
                  Wydatek
                </button>
                <button
                  type="button"
                  onClick={() => { setType("income"); update("category_id", "") }}
                  className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    type === "income" ? "bg-green-500/20 text-green-400" : "text-muted-foreground"
                  }`}
                >
                  Przychód
                </button>
              </div>

              {/* Kwota */}
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Kwota (zł) *</label>
                <input
                  autoFocus
                  type="number"
                  step="0.01"
                  value={form.amount}
                  onChange={e => update("amount", e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none"
                  required
                />
              </div>

              {/* Opis */}
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Opis</label>
                <input
                  value={form.description}
                  onChange={e => update("description", e.target.value)}
                  placeholder="np. Biedronka"
                  className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none"
                />
              </div>

              {/* Kategoria */}
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Kategoria</label>
                <div className="flex flex-wrap gap-2">
                  {filtered.map(cat => (
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

              {/* Data */}
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Data</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => update("date", e.target.value)}
                  className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !form.amount}
                className="w-full bg-foreground text-background rounded-lg py-2.5 text-sm font-medium disabled:opacity-40"
              >
                {loading ? "Dodaję..." : "Dodaj transakcję"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}