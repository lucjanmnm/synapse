import { PromptCard } from "@/components/prompts/PromptCard"

const prompts = [
  { type: "operator",     label: "Operator",      description: "Planowanie dnia i tygodnia"      },
  { type: "gym",          label: "Gym",            description: "Trening i zdrowie"               },
  { type: "business",     label: "Business",       description: "Projekty i monetyzacja"          },
  { type: "reset",        label: "Reset",          description: "Chaos, stres, stabilizacja"      },
  { type: "relationship", label: "Relationship",   description: "Relacja i komunikacja"           },
]

export default function PromptsPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-medium">AI Prompts</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gotowe prompty do Claude — wygenerowane na podstawie twoich danych z ostatnich 7 dni.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {prompts.map(p => (
          <PromptCard key={p.type} type={p.type} label={p.label} description={p.description} />
        ))}
      </div>
    </div>
  )
}