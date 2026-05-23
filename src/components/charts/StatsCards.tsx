interface Props {
  logs: any[]
}

export function StatsCards({ logs }: Props) {
  const avg = (arr: number[]) =>
    arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : "-"

  const sleeps   = logs.filter(l => l.category === "sleep").map(l => l.value_num).filter(Boolean)
  const stresses = logs.filter(l => l.category === "stress").map(l => l.stress_score).filter(Boolean)
  const moods    = logs.filter(l => l.category === "mood").map(l => l.mood_score).filter(Boolean)
  const weights  = logs.filter(l => l.category === "weight").map(l => l.value_num).filter(Boolean)
  const trainings = logs.filter(l => l.category === "training")

  const stats = [
    { label: "Śr. sen",       value: sleeps.length   ? `${avg(sleeps)}h`      : "-", sub: `${sleeps.length} wpisów`   },
    { label: "Śr. stres",     value: stresses.length ? `${avg(stresses)}/10`  : "-", sub: `${stresses.length} wpisów` },
    { label: "Śr. nastrój",   value: moods.length    ? `${avg(moods)}/10`     : "-", sub: `${moods.length} wpisów`    },
    { label: "Treningi",      value: `${trainings.length}x`,                          sub: "ostatnie 30 dni"           },
    { label: "Min. waga",     value: weights.length  ? `${Math.min(...weights)} kg` : "-", sub: "30 dni"              },
    { label: "Maks. waga",    value: weights.length  ? `${Math.max(...weights)} kg` : "-", sub: "30 dni"              },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {stats.map(s => (
        <div key={s.label} className="bg-muted rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
          <p className="text-2xl font-medium">{s.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
        </div>
      ))}
    </div>
  )
}