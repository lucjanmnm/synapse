function formatDate(date: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date))
}

interface Review {
  id: string
  week_start: string
  energy_avg?: number
  stress_avg?: number
  productivity?: number
  relationship?: number
  physical?: number
  wins?: string
  mistakes?: string
  chaos_sources?: string
  next_priorities?: string[]
}

export function WeeklyReviewHistory({ reviews }: { reviews: Review[] }) {
  if (!reviews.length) return (
    <p className="text-sm text-muted-foreground">Brak poprzednich reviewów.</p>
  )

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium">Historia</p>
      {reviews.map(r => (
        <div key={r.id} className="bg-muted rounded-xl p-5 space-y-4">
          <p className="text-sm font-medium">Tydzień od {formatDate(r.week_start)}</p>

          {/* Scores */}
          <div className="grid grid-cols-5 gap-2">
            {[
              { label: "Energia",      value: r.energy_avg    },
              { label: "Stres",        value: r.stress_avg    },
              { label: "Produktyw.",   value: r.productivity  },
              { label: "Relacja",      value: r.relationship  },
              { label: "Zdrowie",      value: r.physical      },
            ].map(s => (
              <div key={s.label} className="bg-background rounded-lg p-2 text-center">
                <p className="text-[10px] text-muted-foreground mb-1">{s.label}</p>
                <p className="text-sm font-medium">{s.value ?? "-"}</p>
              </div>
            ))}
          </div>

          {/* Teksty */}
          {r.wins && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Wygrane</p>
              <p className="text-sm">{r.wins}</p>
            </div>
          )}
          {r.mistakes && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Błędy</p>
              <p className="text-sm">{r.mistakes}</p>
            </div>
          )}
          {r.chaos_sources && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Źródła chaosu</p>
              <p className="text-sm">{r.chaos_sources}</p>
            </div>
          )}

          {/* Priorytety */}
          {r.next_priorities && r.next_priorities.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Priorytety</p>
              <div className="space-y-1">
                {r.next_priorities.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-foreground shrink-0" />
                    {p}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}