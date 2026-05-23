interface Props {
  logs: any[]
}

export function ConsistencyTracker({ logs }: Props) {
  // Ostatnie 30 dni
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (29 - i))
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${y}-${m}-${day}`
  })

  const logsByDate = new Set(logs.map(l => l.logged_at.split("T")[0]))

  const categories = ["weight", "sleep", "stress", "mood", "training"]
  const catLabels: Record<string, string> = {
    weight: "Waga", sleep: "Sen", stress: "Stres", mood: "Nastrój", training: "Trening"
  }

  return (
    <div className="bg-muted rounded-xl p-4 space-y-4">
      <div>
        <p className="text-sm font-medium">Consistency</p>
        <p className="text-xs text-muted-foreground">aktywność przez ostatnie 30 dni</p>
      </div>

      {/* Overall */}
      <div>
        <p className="text-xs text-muted-foreground mb-2">Wszystkie wpisy</p>
        <div className="flex gap-1 flex-wrap">
          {days.map(day => (
            <div
              key={day}
              className={`w-6 h-6 rounded-sm ${
                logsByDate.has(day) ? "bg-foreground" : "bg-background"
              }`}
              title={day}
            />
          ))}
        </div>
      </div>

      {/* Per category */}
      <div className="space-y-2">
        {categories.map(cat => {
          const catDates = new Set(
            logs.filter(l => l.category === cat).map(l => l.logged_at.split("T")[0])
          )
          const count = days.filter(d => catDates.has(d)).length

          return (
            <div key={cat} className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-16 shrink-0">{catLabels[cat]}</span>
              <div className="flex gap-1 flex-1">
                {days.map(day => (
                  <div
                    key={day}
                    className={`flex-1 h-4 rounded-sm ${
                      catDates.has(day) ? "bg-foreground/80" : "bg-background"
                    }`}
                    title={day}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground w-8 text-right">{count}d</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}