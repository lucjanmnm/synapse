import { CalendarWrapper } from "@/components/calendar/CalendarWrapper"

export default function CalendarPage() {
  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-xl font-medium">Kalendarz</h1>
        <p className="text-sm text-muted-foreground mt-1">Historia twoich wpisów.</p>
      </div>
      <CalendarWrapper />
    </div>
  )
}