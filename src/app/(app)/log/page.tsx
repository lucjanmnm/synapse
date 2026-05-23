import { createClient } from "@/utils/supabase/server"

const CATEGORIES = [
  { value: "all",          label: "Wszystkie" },
  { value: "weight",       label: "Waga"      },
  { value: "sleep",        label: "Sen"       },
  { value: "stress",       label: "Stres"     },
  { value: "mood",         label: "Nastrój"   },
  { value: "training",     label: "Trening"   },
  { value: "note",         label: "Notatki"   },
  { value: "relationship", label: "Relacja"   },
  { value: "idea",         label: "Pomysły"   },
]

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

function categoryLabel(cat: string) {
  return CATEGORIES.find(c => c.value === cat)?.label ?? cat
}

export default async function LogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const supabase = await createClient()
  const { category: cat } = await searchParams
  const category = cat ?? "all"

  let query = supabase
    .from("logs")
    .select("*")
    .order("logged_at", { ascending: false })
    .limit(100)

  if (category !== "all") query = query.eq("category", category)

  const { data: logs } = await query

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-medium">Logi</h1>
        <p className="text-sm text-muted-foreground mt-1">Historia wszystkich wpisów.</p>
      </div>

      {/* Filtry */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <a
            key={cat.value}
            href={cat.value === "all" ? "/log" : `/log?category=${cat.value}`}
            className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
              category === cat.value
                ? "bg-foreground text-background font-medium"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat.label}
          </a>
        ))}
      </div>

      {/* Lista logów */}
      <div className="space-y-2">
        {logs && logs.length > 0 ? (
          logs.map(log => (
            <div
              key={log.id}
              className="flex items-center justify-between bg-muted rounded-xl px-4 py-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs text-muted-foreground bg-background rounded-md px-2 py-1 shrink-0">
                  {categoryLabel(log.category)}
                </span>
                <span className="text-sm truncate">{log.raw_input}</span>
              </div>
              <span className="text-xs text-muted-foreground shrink-0 ml-4">
                {formatDate(log.logged_at)}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">Brak wpisów.</p>
        )}
      </div>
    </div>
  )
}