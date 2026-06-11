"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { X, Trash2 } from "lucide-react"

interface Category {
  id: string
  name: string
  color: string
}

interface Event {
  id: string
  title: string
  date: string
  time_start?: string
  time_end?: string
  description?: string
  recurring?: boolean
  recurring_days?: number[]
  event_categories?: Category
}

const DAYS = ["Pn", "Wt", "Śr", "Cz", "Pt", "Sb", "Nd"]

interface Props {
  event: Event
  onClose: () => void
}

export function EventModal({ event, onClose }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const color = event.event_categories?.color ?? "#888888"

  async function handleDelete() {
    if (!confirm("Usunąć event?")) return
    setLoading(true)

    await fetch("/api/events", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: event.id }),
    })

    setLoading(false)
    onClose()
    router.refresh()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full md:max-w-md bg-background border border-border rounded-t-2xl md:rounded-2xl p-5 m-0 md:m-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full shrink-0" style={{ background: color }} />
            <p className="text-sm font-medium">{event.title}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 text-sm">
          {event.event_categories && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-20">Kategoria</span>
              <span
                className="text-xs px-2 py-0.5 rounded-md"
                style={{ background: color + "33", color }}
              >
                {event.event_categories.name}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-20">Data</span>
            <span className="text-xs">{event.date}</span>
          </div>
          {event.time_start && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-20">Godzina</span>
              <span className="text-xs">
                {event.time_start.slice(0, 5)}
                {event.time_end ? ` — ${event.time_end.slice(0, 5)}` : ""}
              </span>
            </div>
          )}
          {event.recurring && event.recurring_days && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-20">Powtarza się</span>
              <span className="text-xs">
                {event.recurring_days.map(d => DAYS[d]).join(", ")}
              </span>
            </div>
          )}
          {event.description && (
            <div className="flex items-start gap-2">
              <span className="text-xs text-muted-foreground w-20">Opis</span>
              <span className="text-xs">{event.description}</span>
            </div>
          )}
        </div>

        <button
          onClick={handleDelete}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 text-sm text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-400/20 rounded-lg py-2.5 transition-colors disabled:opacity-40"
        >
          <Trash2 className="w-4 h-4" />
          {loading ? "Usuwam..." : "Usuń event"}
        </button>
      </div>
    </div>
  )
}