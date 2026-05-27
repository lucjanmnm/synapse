import { createClient } from "@/utils/supabase/server"
import Link from "next/link"

function formatEventDate(date: string, time?: string) {
  const d = new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "short",
    weekday: "short",
  }).format(new Date(date))
  return time ? `${d} · ${time.slice(0, 5)}` : d
}

export async function UpcomingEvents() {
  const supabase = await createClient()
  const today = new Date().toISOString().split("T")[0]

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .gte("date", today)
    .order("date", { ascending: true })
    .limit(4)

  return (
    <div className="bg-muted rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Nadchodzące eventy</p>
          <p className="text-xs text-muted-foreground">z kalendarza</p>
        </div>
        <Link href="/calendar" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          wszystkie →
        </Link>
      </div>

      <div className="space-y-2">
        {events && events.length > 0 ? (
          events.map(ev => (
            <div key={ev.id} className="flex items-center justify-between text-sm">
              <span className="truncate">{ev.title}</span>
              <span className="text-xs text-muted-foreground shrink-0 ml-4">
                {formatEventDate(ev.date, ev.time)}
              </span>
            </div>
          ))
        ) : (
          <p className="text-xs text-muted-foreground">Brak nadchodzących eventów.</p>
        )}
      </div>
    </div>
  )
}