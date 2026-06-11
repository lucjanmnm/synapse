"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { parseQuickAdd } from "./QuickAddParser"

export function QuickAddForm({ onSuccess, prefill }: { onSuccess?: () => void, prefill?: string }) {
  const [input, setInput] = useState(prefill ?? "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    setInput(prefill ?? "")
  }, [prefill])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    setLoading(true)
    setError(null)

    try {
      const parsed = parseQuickAdd(input)

      if (parsed.category === "expense" || parsed.category === "income") {
        const res = await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: parsed.category,
            amount: parsed.value_num,
            description: parsed.value_text || parsed.raw_input,
            date: new Date().toISOString().split("T")[0],
          }),
        })
        if (!res.ok) throw new Error("Błąd zapisu transakcji")
      } else {
        const res = await fetch("/api/logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed),
        })
        if (!res.ok) throw new Error("Błąd zapisu")
      }

      setInput("")
      router.refresh()
      onSuccess?.()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <input
          autoFocus
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder='np. "waga 72.1", "wydatek 45", "przychód 500"'
          className="flex-1 bg-muted rounded-lg px-4 py-2.5 text-sm outline-none"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-foreground text-background rounded-lg px-4 py-2.5 text-sm font-medium disabled:opacity-40"
        >
          {loading ? "..." : "Dodaj"}
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </form>
  )
}