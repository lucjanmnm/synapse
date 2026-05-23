"use client"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

type View = "week" | "month"

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

interface Props {
  logs: { logged_at: string; category: string; raw_input: string }[]
  events: { id: string; title: string; date: string; time?: string; description?: string }[]
}

export function CalendarView({ logs, events }: Props) {
  const [view, setView] = useState<View>("month")
  const [current, setCurrent] = useState(new Date())

  const today = new Date()

  function prev() {
    const d = new Date(current)
    if (view === "month") d.setMonth(d.getMonth() - 1)
    else d.setDate(d.getDate() - 7)
    setCurrent(d)
  }

  function next() {
    const d = new Date(current)
    if (view === "month") d.setMonth(d.getMonth() + 1)
    else d.setDate(d.getDate() + 7)
    setCurrent(d)
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

  function dateKey(date: Date) {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, "0")
    const d = String(date.getDate()).padStart(2, "0")
    return `${y}-${m}-${d}`
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
            const dayLogs = logsByDate[key] ?? []
            const dayEvents = events.filter(e => e.date === key)
            return (
              <div
                key={i}
                className={`min-h-16 p-1.5 rounded-lg border text-sm ${
                  isToday(date)
                    ? "border-foreground bg-muted"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <p className={`text-xs mb-1 ${isToday(date) ? "font-medium" : "text-muted-foreground"}`}>
                  {date.getDate()}
                </p>
                <div className="space-y-0.5">
                  {dayEvents.map((ev, j) => (
                    <div key={j} className="text-[10px] bg-foreground/10 text-foreground rounded px-1 truncate">
                      {ev.time ? ev.time.slice(0, 5) + " " : ""}{ev.title}
                    </div>
                  ))}
                  {dayLogs.slice(0, 2).map((log, j) => (
                    <div key={j} className="text-[10px] text-muted-foreground truncate">
                      {log.raw_input}
                    </div>
                  ))}
                  {dayLogs.length > 2 && (
                    <div className="text-[10px] text-muted-foreground">+{dayLogs.length - 2}</div>
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
          const dayLogs = logsByDate[key] ?? []
          const dayEvents = events.filter(e => e.date === key)
          return (
            <div key={i} className={`rounded-lg border p-2 min-h-32 ${
              isToday(date) ? "border-foreground bg-muted" : "border-border"
            }`}>
              <p className="text-xs text-muted-foreground mb-1">{DAYS[i]}</p>
              <p className={`text-sm mb-2 ${isToday(date) ? "font-medium" : ""}`}>
                {date.getDate()}
              </p>
              <div className="space-y-1">
                {dayEvents.map((ev, j) => (
                  <div key={j} className="text-[11px] bg-foreground/10 text-foreground rounded px-1 py-0.5 truncate">
                    {ev.time ? ev.time.slice(0, 5) + " " : ""}{ev.title}
                  </div>
                ))}
                {dayLogs.map((log, j) => (
                  <div key={j} className="text-[11px] text-muted-foreground truncate">
                    {log.raw_input}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={prev} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h2 className="text-sm font-medium min-w-36 text-center">
            {view === "month"
              ? `${MONTHS[current.getMonth()]} ${current.getFullYear()}`
              : `${getWeekDays(current)[0].getDate()} - ${getWeekDays(current)[6].getDate()} ${MONTHS[current.getMonth()]}`
            }
          </h2>
          <button onClick={next} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex bg-muted rounded-lg p-1 gap-1">
          <button
            onClick={() => setView("month")}
            className={`px-3 py-1 rounded-md text-xs transition-colors ${
              view === "month" ? "bg-background text-foreground" : "text-muted-foreground"
            }`}
          >
            Miesiąc
          </button>
          <button
            onClick={() => setView("week")}
            className={`px-3 py-1 rounded-md text-xs transition-colors ${
              view === "week" ? "bg-background text-foreground" : "text-muted-foreground"
            }`}
          >
            Tydzień
          </button>
        </div>
      </div>

      {view === "month" ? <MonthView /> : <WeekView />}
    </div>
  )
}