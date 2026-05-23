import { createClient } from "@/utils/supabase/server"
import { SleepChart } from "@/components/charts/SleepChart"
import { StressChart } from "@/components/charts/StressChart"
import { MoodChart } from "@/components/charts/MoodChart"
import { WeightChart } from "@/components/charts/WeightChart"
import { ConsistencyTracker } from "@/components/charts/ConsistencyTracker"
import { StatsCards } from "@/components/charts/StatsCards"

export default async function InsightsPage() {
  const supabase = await createClient()

  const since = new Date()
  since.setDate(since.getDate() - 30)

  const { data: logs } = await supabase
    .from("logs")
    .select("*")
    .gte("logged_at", since.toISOString())
    .order("logged_at", { ascending: true })

  const byCategory = (cat: string) => logs?.filter(l => l.category === cat) ?? []

  const weightData  = byCategory("weight").map(l => ({ date: l.logged_at.split("T")[0], value: l.value_num }))
  const sleepData   = byCategory("sleep").map(l => ({ date: l.logged_at.split("T")[0], value: l.value_num }))
  const stressData  = byCategory("stress").map(l => ({ date: l.logged_at.split("T")[0], value: l.stress_score }))
  const moodData    = byCategory("mood").map(l => ({ date: l.logged_at.split("T")[0], value: l.mood_score }))

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-xl font-medium">Insights</h1>
        <p className="text-sm text-muted-foreground mt-1">Analiza ostatnich 30 dni.</p>
      </div>

      <StatsCards logs={logs ?? []} />

      <ConsistencyTracker logs={logs ?? []} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <WeightChart data={weightData} />
        <SleepChart data={sleepData} />
        <StressChart data={stressData} />
        <MoodChart data={moodData} />
      </div>
    </div>
  )
}