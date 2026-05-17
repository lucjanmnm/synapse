import { createClient } from "@/utils/supabase/server"

export async function QuickStats() {
  const supabase = await createClient()

  const since = new Date()
  since.setDate(since.getDate() - 7)

  const { data: logs } = await supabase
    .from("logs")
    .select("*")
    .gte("logged_at", since.toISOString())

  const avg = (arr: number[]) =>
    arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : null

  const weights  = logs?.filter(l => l.category === "weight").map(l => l.value_num).filter(Boolean)
  const sleeps   = logs?.filter(l => l.category === "sleep").map(l => l.value_num).filter(Boolean)
  const stresses = logs?.filter(l => l.category === "stress").map(l => l.stress_score).filter(Boolean)
  const moods    = logs?.filter(l => l.category === "mood").map(l => l.mood_score).filter(Boolean)

  const lastWeight = logs?.filter(l => l.category === "weight").at(-1)?.value_num

  const stats = [
    { label: "Waga",         value: lastWeight ? `${lastWeight} kg` : "—", sub: "ostatni wpis"    },
    { label: "Sen (śr. 7d)", value: sleeps?.length   ? `${avg(sleeps)}h`    : "—", sub: "ostatni tydzień" },
    { label: "Stres (śr. 7d)",value: stresses?.length ? `${avg(stresses)}/10` : "—", sub: "im niżej tym lepiej" },
    { label: "Nastrój (śr. 7d)",value: moods?.length  ? `${avg(moods)}/10`   : "—", sub: "śr. 7 dni"      },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map(s => (
        <div key={s.label} className="bg-muted rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">{s.label}</p>
          <p className="text-2xl font-medium">{s.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
        </div>
      ))}
    </div>
  )
}