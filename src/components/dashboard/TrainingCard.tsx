import { createClient } from "@/utils/supabase/server"

export async function TrainingCard() {
  const supabase = await createClient()

  const since = new Date()
  since.setDate(since.getDate() - 7)

  const { data: logs } = await supabase
    .from("logs")
    .select("*")
    .eq("category", "training")
    .gte("logged_at", since.toISOString())
    .order("logged_at", { ascending: false })

  return (
    <div className="bg-muted rounded-xl p-4 space-y-3">
      <div>
        <p className="text-sm font-medium">Trening</p>
        <p className="text-xs text-muted-foreground">ostatnie 7 dni</p>
      </div>
      <div className="space-y-2">
        {logs && logs.length > 0 ? (
          <>
            <p className="text-2xl font-medium">{logs.length}x</p>
            <div className="space-y-1">
              {logs.slice(0, 3).map(log => (
                <div key={log.id} className="text-xs text-muted-foreground truncate">
                  {log.value_text || log.raw_input}
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-xs text-muted-foreground">Brak treningów w tym tygodniu.</p>
        )}
      </div>
    </div>
  )
}