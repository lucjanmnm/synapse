import { createClient } from "@/utils/supabase/server"
import { CalendarView } from "./CalendarView"
import { AddEventModal } from "./AddEventModal"
import Link from "next/link"

export async function CalendarWrapper() {
  const supabase = await createClient()

  const since = new Date()
  since.setMonth(since.getMonth() - 2)

  const { data: logs } = await supabase
    .from("logs")
    .select("logged_at, category, raw_input")
    .gte("logged_at", since.toISOString())
    .order("logged_at", { ascending: true })

  const { data: events } = await supabase
    .from("events")
    .select("*, event_categories(id, name, color)")
    .order("date", { ascending: true })

  const { data: categories } = await supabase
    .from("event_categories")
    .select("*")
    .order("created_at", { ascending: true })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <AddEventModal />
        <Link
          href="/settings"
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Zarządzaj kategoriami →
        </Link>
      </div>
      <CalendarView
        logs={logs ?? []}
        events={events ?? []}
        categories={categories ?? []}
      />
    </div>
  )
}