import { createClient } from "@/utils/supabase/server"
import { CalendarView } from "./CalendarView"
import { AddEventModal } from "./AddEventModal"

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
    .select("*")
    .order("date", { ascending: true })

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AddEventModal />
      </div>
      <CalendarView logs={logs ?? []} events={events ?? []} />
    </div>
  )
}