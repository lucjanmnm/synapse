import { createClient } from "@/utils/supabase/server"
import { formatSleep } from "@/utils/helpers"

export async function QuickStats() {
  const supabase = await createClient()

  const since = new Date()
  since.setDate(since.getDate() - 7)

  const { data: logs } = await supabase
    .from("logs")
    .select("*")
    .gte("logged_at", since.toISOString())

  const avg = (arr: number[]): number | null =>
    arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null

  const weights  = logs?.filter(l => l.category === "weight").map(l => l.value_num).filter(Boolean)
  const sleeps   = logs?.filter(l => l.category === "sleep").map(l => l.value_num).filter(Boolean)
  const stresses = logs?.filter(l => l.category === "stress").map(l => l.stress_score).filter(Boolean)
  const moods    = logs?.filter(l => l.category === "mood").map(l => l.mood_score).filter(Boolean)

  const lastWeight = logs?.filter(l => l.category === "weight").at(-1)?.value_num

  const sleepAvg = sleeps ? avg(sleeps) : null
  const stressAvg = stresses ? avg(stresses) : null
  const moodAvg = moods ? avg(moods) : null

  const stats = [
    { label: "Waga",         value: lastWeight ? `${lastWeight} kg` : "-", sub: "ostatni wpis"    },
    { label: "Sen (śr. 7d)", value: sleepAvg !== null ? formatSleep(sleepAvg) : "-", sub: "ostatni tydzień" },
    { label: "Stres (śr. 7d)",value: stressAvg !== null ? `${stressAvg.toFixed(1)}/10` : "-", sub: "im niżej tym lepiej" },
    { label: "Nastrój (śr. 7d)",value: moodAvg !== null  ? `${moodAvg.toFixed(1)}/10`   : "-", sub: "śr. 7 dni"      },
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