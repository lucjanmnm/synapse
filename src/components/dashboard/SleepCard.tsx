import { createClient } from "@/utils/supabase/server"

export async function SleepCard() {
  const supabase = await createClient()

  const since = new Date()
  since.setDate(since.getDate() - 7)

  const { data: logs } = await supabase
    .from("logs")
    .select("*")
    .eq("category", "sleep")
    .gte("logged_at", since.toISOString())
    .order("logged_at", { ascending: false })

  const avg = logs && logs.length > 0
    ? (logs.reduce((a, b) => a + (b.value_num ?? 0), 0) / logs.length).toFixed(1)
    : null

  return (
    <div className="bg-muted rounded-xl p-4 space-y-3">
      <div>
        <p className="text-sm font-medium">Sen</p>
        <p className="text-xs text-muted-foreground">ostatnie 7 dni</p>
      </div>
      <div className="space-y-2">
        {avg ? (
          <>
            <p className="text-2xl font-medium">{avg}h</p>
            <div className="flex gap-1">
              {logs?.slice(0, 7).reverse().map((log, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-foreground/20"
                  style={{ height: `${Math.min((log.value_num / 10) * 40, 40)}px`, alignSelf: "flex-end" }}
                  title={`${log.value_num}h`}
                />
              ))}
            </div>
          </>
        ) : (
          <p className="text-xs text-muted-foreground">Brak danych o śnie.</p>
        )}
      </div>
    </div>
  )
}