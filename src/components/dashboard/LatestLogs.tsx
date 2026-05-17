import { createClient } from "@/utils/supabase/server"

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

export async function LatestLogs() {
  const supabase = await createClient()

  const { data: logs } = await supabase
    .from("logs")
    .select("*")
    .order("logged_at", { ascending: false })
    .limit(8)

  return (
    <div className="bg-muted rounded-xl p-4">
      <p className="text-sm font-medium mb-3">Ostatnie wpisy</p>
      <div className="space-y-2">
        {logs?.map(log => (
          <div key={log.id} className="flex items-center justify-between text-sm">
            <span className="text-foreground">{log.raw_input}</span>
            <span className="text-xs text-muted-foreground shrink-0 ml-4">
              {formatDate(log.logged_at)}
            </span>
          </div>
        )) ?? <p className="text-sm text-muted-foreground">Brak wpisów.</p>}
      </div>
    </div>
  )
}