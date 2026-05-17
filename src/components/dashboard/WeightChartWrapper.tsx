import { createClient } from "@/utils/supabase/server"
import { WeightChart } from "@/components/charts/WeightChart"

export async function WeightChartWrapper() {
  const supabase = await createClient()

  const since = new Date()
  since.setDate(since.getDate() - 30)

  const { data: logs } = await supabase
    .from("logs")
    .select("*")
    .eq("category", "weight")
    .gte("logged_at", since.toISOString())
    .order("logged_at", { ascending: true })

  const data = logs?.map(l => ({
    date: new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "numeric" }).format(new Date(l.logged_at)),
    value: l.value_num,
  })) ?? []

  return <WeightChart data={data} />
}