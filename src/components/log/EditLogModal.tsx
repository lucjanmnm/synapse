"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Pencil, X } from "lucide-react"
import { parseQuickAdd } from "@/components/quick-add/QuickAddParser"

interface Props {
  id: string
  rawInput: string
}

export function EditLogModal({ id, rawInput }: Props) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState(rawInput)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    setLoading(true)

    const parsed = parseQuickAdd(input)

    await fetch("/api/logs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...parsed }),
    })

    setLoading(false)
    setOpen(false)
    router.refresh()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-muted-foreground hover:text-foreground transition-colors p-1"
      >
        <Pencil className="w-3.5 h-3.5" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}
        >
          <div className="w-full md:max-w-lg bg-background border border-border rounded-t-2xl md:rounded-2xl p-5 m-0 md:m-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Edytuj wpis</p>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-2">
              <input
                autoFocus
                value={input}
                onChange={e => setInput(e.target.value)}
                className="w-full bg-muted rounded-lg px-4 py-2.5 text-sm outline-none"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="w-full bg-foreground text-background rounded-lg py-2.5 text-sm font-medium disabled:opacity-40"
              >
                {loading ? "..." : "Zapisz"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}