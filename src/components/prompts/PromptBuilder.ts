type PromptType = "operator" | "gym" | "business" | "reset" | "relationship"

export function buildPrompt(type: PromptType, logs: any[], context?: string): string {
  const dataContext = buildContext(logs)
  const userContext = context ? `\nKim jestem:\n${context}\n` : ""

  const templates: Record<PromptType, string> = {
    operator: `Jesteś moim strategicznym doradcą.${userContext}\nMoje dane z ostatnich 7 dni:\n${dataContext}\n\nNa podstawie tych danych pomóż mi zaplanować realistyczny tydzień. Zaproponuj 3 główne priorytety i konkretny plan działania.`,

    gym: `Jesteś moim trenerem.${userContext}\nMoje dane:\n${dataContext}\n\nOceń mój stan fizyczny i zasugeruj plan treningowy na ten tydzień. Wskaż co wymaga uwagi.`,

    business: `Jesteś moim doradcą biznesowym.${userContext}\nMoje dane:\n${dataContext}\n\nNa podstawie poziomu energii i czasu: jakie działania biznesowe powinienem priorytetyzować w tym tygodniu?`,

    reset: `Mój system jest przeciążony.${userContext}\nMoje dane:\n${dataContext}\n\nPomóż mi: 1) zrozumieć źródło przeciążenia, 2) ustalić absolutne minimum na najbliższe dni, 3) odzyskać stabilność.`,

    relationship: `Oto mój kontekst osobisty.${userContext}\nMoje dane:\n${dataContext}\n\nPomóż mi przemyśleć balans między relacją a pozostałymi priorytetami. Co wymaga uwagi?`,
  }

  return templates[type] ?? ""
}

function buildContext(logs: any[]): string {
  if (!logs.length) return "Brak danych z ostatnich 7 dni."

  const avg = (arr: number[]) =>
    arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : null

  const w  = logs.filter(l => l.category === "weight")
  const s  = logs.filter(l => l.category === "sleep").map(l => l.value_num).filter(Boolean)
  const st = logs.filter(l => l.category === "stress").map(l => l.stress_score).filter(Boolean)
  const m  = logs.filter(l => l.category === "mood").map(l => l.mood_score).filter(Boolean)
  const t  = logs.filter(l => l.category === "training")
  const n  = logs.filter(l => l.category === "note")

  return [
    w.length  ? `Waga: ${w.at(-1)?.value_num} kg` : null,
    s.length  ? `Sen średnio: ${avg(s)}h` : null,
    st.length ? `Stres średnio: ${avg(st)}/10` : null,
    m.length  ? `Nastrój średnio: ${avg(m)}/10` : null,
    t.length  ? `Treningi: ${t.length}x w tygodniu` : null,
    n.length  ? `Notatki: ${n.slice(0, 3).map(x => x.value_text).join("; ")}` : null,
  ].filter(Boolean).join("\n")
}