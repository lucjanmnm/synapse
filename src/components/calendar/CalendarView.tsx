"use client"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { EventModal } from "./EventModal"
import { AddEventModal } from "./AddEventModal"

type View = "week" | "month" | "day"

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

function getWeekDays(date: Date) {
  const day = date.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(date)
  monday.setDate(date.getDate() + diff)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

const DAYS = ["Pn", "Wt", "Śr", "Cz", "Pt", "Sb", "Nd"]
const MONTHS = [
  "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
  "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
]

const HOUR_HEIGHT = 56 // px per godzina

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
  category_id?: string
  recurring?: boolean
  recurring_days?: number[]
  event_categories?: Category
}

interface Props {
  logs: { logged_at: string; category: string; raw_input: string }[]
  events: Event[]
  categories?: Category[]
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number)
  return h * 60 + (m || 0)
}

function dateKey(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function CalendarView({ logs, events, categories = [] }: Props) {
  const [view, setView] = useState<View>("month")
  const [current, setCurrent] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [addEventDate, setAddEventDate] = useState<string | null>(null)
  const [addEventTime, setAddEventTime] = useState<string | null>(null)

  const today = new Date()

  function prev() {
    const d = new Date(current)
    if (view === "month") d.setMonth(d.getMonth() - 1)
    else if (view === "week") d.setDate(d.getDate() - 7)
    else d.setDate(d.getDate() - 1)
    setCurrent(d)
  }

  function next() {
    const d = new Date(current)
    if (view === "month") d.setMonth(d.getMonth() + 1)
    else if (view === "week") d.setDate(d.getDate() + 7)
    else d.setDate(d.getDate() + 1)
    setCurrent(d)
  }

  function goToday() { setCurrent(new Date()) }

  function goToDay(date: Date) {
    setCurrent(date)
    setView("day")
  }

  const logsByDate: Record<string, typeof logs> = {}
  logs.forEach(log => {
    const date = log.logged_at.split("T")[0]
    if (!logsByDate[date]) logsByDate[date] = []
    logsByDate[date].push(log)
  })

  function isToday(date: Date) {
    return date.toDateString() === today.toDateString()
  }

  function getEventsForDay(key: string, dayOfWeek: number): Event[] {
    return events.filter(ev => {
      if (ev.date === key) return true
      if (ev.recurring && ev.recurring_days?.includes(dayOfWeek)) return true
      return false
    })
  }

  function EventChip({ ev, small = false }: { ev: Event; small?: boolean }) {
    const color = ev.event_categories?.color ?? "#888888"
    const time = ev.time_start ? ev.time_start.slice(0, 5) + " " : ""
    return (
      <button
        onClick={e => { e.stopPropagation(); setSelectedEvent(ev) }}
        className={`w-full text-left rounded px-1 truncate transition-opacity hover:opacity-80 ${small ? "text-[10px]" : "text-[11px] py-0.5"}`}
        style={{ background: color + "33", color }}
      >
        {time}{ev.title}
      </button>
    )
  }

  function MonthView() {
    const year = current.getFullYear()
    const month = current.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)

    const cells = [
      ...Array(firstDay).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
    ]

    return (
      <div>
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map(d => (
            <div key={d} className="text-center text-xs text-muted-foreground py-2">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((date, i) => {
            if (!date) return <div key={i} />
            const key = dateKey(date)
            const dayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1
            const dayLogs = logsByDate[key] ?? []
            const dayEvents = getEventsForDay(key, dayOfWeek)
            return (
              <div
                key={i}
                onClick={() => goToDay(date)}
                className={`min-h-16 p-1.5 rounded-lg border text-sm cursor-pointer ${
                  isToday(date) ? "border-foreground bg-muted" : "border-border hover:bg-muted/50"
                }`}
              >
                <p className={`text-xs mb-1 ${isToday(date) ? "font-medium" : "text-muted-foreground"}`}>
                  {date.getDate()}
                </p>
                <div className="space-y-0.5">
                  {dayEvents.map((ev, j) => (
                    <EventChip key={j} ev={ev} small />
                  ))}
                  {dayLogs.slice(0, 1).map((log, j) => (
                    <div key={j} className="text-[10px] text-muted-foreground truncate">{log.raw_input}</div>
                  ))}
                  {dayLogs.length > 1 && (
                    <div className="text-[10px] text-muted-foreground">+{dayLogs.length - 1}</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  function WeekView() {
    const days = getWeekDays(current)
    return (
      <div className="grid grid-cols-7 gap-2">
        {days.map((date, i) => {
          const key = dateKey(date)
          const dayOfWeek = i
          const dayLogs = logsByDate[key] ?? []
          const dayEvents = getEventsForDay(key, dayOfWeek)
          return (
            <div
              key={i}
              onClick={() => goToDay(date)}
              className={`rounded-lg border p-2 min-h-32 cursor-pointer ${
                isToday(date) ? "border-foreground bg-muted" : "border-border hover:bg-muted/50"
              }`}
            >
              <p className="text-xs text-muted-foreground mb-1">{DAYS[i]}</p>
              <p className={`text-sm mb-2 ${isToday(date) ? "font-medium" : ""}`}>
                {date.getDate()}
              </p>
              <div className="space-y-1">
                {dayEvents.map((ev, j) => (
                  <EventChip key={j} ev={ev} />
                ))}
                {dayLogs.map((log, j) => (
                  <div key={j} className="text-[11px] text-muted-foreground truncate">{log.raw_input}</div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  function DayView() {
    const key = dateKey(current)
    const dayOfWeek = current.getDay() === 0 ? 6 : current.getDay() - 1
    const dayEvents = getEventsForDay(key, dayOfWeek)
    const dayLogs = logsByDate[key] ?? []

    const timedEvents = dayEvents.filter(ev => ev.time_start)
    const allDayEvents = dayEvents.filter(ev => !ev.time_start)
    const hours = Array.from({ length: 24 }, (_, i) => i)
    const currentMinutes = today.getHours() * 60 + today.getMinutes()

    return (
      <div className="space-y-4">
        {allDayEvents.length > 0 && (
          <div className="bg-muted rounded-xl p-3 space-y-1">
            <p className="text-xs text-muted-foreground mb-2">Cały dzień</p>
            {allDayEvents.map((ev, i) => <EventChip key={i} ev={ev} />)}
          </div>
        )}

        <div className="border border-border rounded-xl overflow-hidden">
          {/* Oś czasu z absolutnym pozycjonowaniem */}
          <div className="relative">
            {/* Wiersze godzin */}
            {hours.map(hour => {
              const isCurrentHour = new Date().getHours() === hour && isToday(current)
              return (
                <div
                  key={hour}
                  onClick={() => {
                    setAddEventDate(key)
                    setAddEventTime(`${String(hour).padStart(2, "0")}:00`)
                  }}
                  className={`flex gap-3 border-b border-border/50 last:border-0 cursor-pointer ${
                    isCurrentHour ? "bg-muted/50" : "hover:bg-muted/20"
                  }`}
                  style={{ height: `${HOUR_HEIGHT}px` }}
                >
                  <div className="w-14 shrink-0 text-right px-2 pt-1.5">
                    <span className={`text-xs ${isCurrentHour ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                      {String(hour).padStart(2, "0")}:00
                    </span>
                  </div>
                  <div className="flex-1" />
                </div>
              )
            })}

            {/* Linia aktualnej godziny */}
            {isToday(current) && (
              <div
                className="absolute left-0 right-0 flex items-center gap-2 pointer-events-none z-20"
                style={{ top: `${(currentMinutes / 60) * HOUR_HEIGHT}px` }}
              >
                <div className="w-14 shrink-0" />
                <div className="w-2 h-2 rounded-full bg-red-500 shrink-0 -ml-1" />
                <div className="flex-1 h-px bg-red-500" />
              </div>
            )}

            {/* Eventy absolutnie pozycjonowane */}
            {timedEvents.map((ev, i) => {
              const color = ev.event_categories?.color ?? "#888888"
              const startMin = timeToMinutes(ev.time_start!)
              const endMin = ev.time_end ? timeToMinutes(ev.time_end) : startMin + 60
              const duration = Math.max(endMin - startMin, 30)
              const top = (startMin / 60) * HOUR_HEIGHT
              const height = Math.max((duration / 60) * HOUR_HEIGHT, 24)

              return (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); setSelectedEvent(ev) }}
                  className="absolute left-14 right-2 rounded-lg px-2 py-1 text-left hover:opacity-90 transition-opacity z-10 overflow-hidden"
                  style={{
                    top: `${top}px`,
                    height: `${height}px`,
                    background: color + "33",
                    borderLeft: `3px solid ${color}`,
                    color,
                  }}
                >
                  <p className="text-xs font-medium truncate">{ev.title}</p>
                  {height > 30 && (
                    <p className="text-[10px] opacity-70">
                      {ev.time_start?.slice(0, 5)}{ev.time_end ? ` — ${ev.time_end.slice(0, 5)}` : ""}
                    </p>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {dayLogs.length > 0 && (
          <div className="bg-muted rounded-xl p-3 space-y-2">
            <p className="text-xs text-muted-foreground">Logi z tego dnia</p>
            {dayLogs.map((log, i) => (
              <div key={i} className="text-xs text-muted-foreground">{log.raw_input}</div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {categories.map(cat => (
            <div key={cat.id} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} />
              {cat.name}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button onClick={prev} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h2 className="text-sm font-medium min-w-36 text-center">
            {view === "month"
              ? `${MONTHS[current.getMonth()]} ${current.getFullYear()}`
              : view === "week"
              ? `${getWeekDays(current)[0].getDate()} — ${getWeekDays(current)[6].getDate()} ${MONTHS[current.getMonth()]}`
              : `${DAYS[current.getDay() === 0 ? 6 : current.getDay() - 1]}, ${current.getDate()} ${MONTHS[current.getMonth()]}`
            }
          </h2>
          <button onClick={next} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={goToday}
            className="text-xs text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 rounded-lg px-3 py-1.5 transition-colors"
          >
            Dziś
          </button>
        </div>

        <div className="flex bg-muted rounded-lg p-1 gap-1">
          <button
            onClick={() => setView("day")}
            className={`px-3 py-1 rounded-md text-xs transition-colors ${view === "day" ? "bg-background text-foreground" : "text-muted-foreground"}`}
          >
            Dzień
          </button>
          <button
            onClick={() => setView("week")}
            className={`px-3 py-1 rounded-md text-xs transition-colors ${view === "week" ? "bg-background text-foreground" : "text-muted-foreground"}`}
          >
            Tydzień
          </button>
          <button
            onClick={() => setView("month")}
            className={`px-3 py-1 rounded-md text-xs transition-colors ${view === "month" ? "bg-background text-foreground" : "text-muted-foreground"}`}
          >
            Miesiąc
          </button>
        </div>
      </div>

      {view === "month" ? <MonthView /> : view === "week" ? <WeekView /> : <DayView />}

      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}

      {addEventDate && (
        <AddEventModal
          initialDate={addEventDate}
          initialTime={addEventTime ?? undefined}
          onClose={() => { setAddEventDate(null); setAddEventTime(null) }}
        />
      )}
    </div>
  )
}