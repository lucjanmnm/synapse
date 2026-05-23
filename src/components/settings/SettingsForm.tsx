"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface Settings {
  display_name: string
  context_bio: string
  timezone: string
  shortcuts: string[]
}

export function SettingsForm({ initial }: { initial: Settings }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState<Settings>(initial)

  function update(key: keyof Settings, value: any) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function updateShortcut(i: number, value: string) {
    const updated = [...form.shortcuts]
    updated[i] = value
    update("shortcuts", updated)
  }

  function addShortcut() {
    update("shortcuts", [...form.shortcuts, ""])
  }

  function removeShortcut(i: number) {
    update("shortcuts", form.shortcuts.filter((_, j) => j !== i))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Profil */}
      <div className="bg-muted rounded-xl p-5 space-y-4">
        <p className="text-sm font-medium">Profil</p>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Imię</label>
          <input
            value={form.display_name}
            onChange={e => update("display_name", e.target.value)}
            placeholder="Twoje imię"
            className="w-full bg-background rounded-lg px-4 py-2.5 text-sm outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Strefa czasowa</label>
          <select
            value={form.timezone}
            onChange={e => update("timezone", e.target.value)}
            className="w-full bg-background rounded-lg px-4 py-2.5 text-sm outline-none"
          >
            <option value="Europe/Warsaw">Europe/Warsaw</option>
            <option value="Europe/London">Europe/London</option>
            <option value="America/New_York">America/New_York</option>
            <option value="America/Los_Angeles">America/Los_Angeles</option>
          </select>
        </div>
      </div>

      {/* Kontekst dla AI */}
      <div className="bg-muted rounded-xl p-5 space-y-3">
        <div>
          <p className="text-sm font-medium">Kontekst dla AI</p>
          <p className="text-xs text-muted-foreground mt-1">
            Ten tekst będzie dołączany do promptów - opisz kim jesteś, co robisz, jakie masz cele.
          </p>
        </div>
        <textarea
          value={form.context_bio}
          onChange={e => update("context_bio", e.target.value)}
          rows={5}
          placeholder="np. Student 3 roku, buduję aplikacje AI, trenuję 4x w tygodniu, priorytet: zdrowie i rozwój..."
          className="w-full bg-background rounded-lg px-4 py-2.5 text-sm outline-none resize-none"
        />
      </div>

      {/* Skróty Quick Add */}
      <div className="bg-muted rounded-xl p-5 space-y-3">
        <div>
          <p className="text-sm font-medium">Skróty Quick Add</p>
          <p className="text-xs text-muted-foreground mt-1">
            Przyciski pod barem quick add.
          </p>
        </div>
        <div className="space-y-2">
          {form.shortcuts.map((s, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={s}
                onChange={e => updateShortcut(i, e.target.value)}
                placeholder={`Skrót ${i + 1}`}
                className="flex-1 bg-background rounded-lg px-4 py-2.5 text-sm outline-none"
              />
              <button
                type="button"
                onClick={() => removeShortcut(i)}
                className="text-xs text-muted-foreground hover:text-foreground px-3 py-2 bg-background rounded-lg"
              >
                Usuń
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addShortcut}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            + Dodaj skrót
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-foreground text-background rounded-lg py-2.5 text-sm font-medium disabled:opacity-40"
      >
        {saved ? "✓ Zapisano" : loading ? "Zapisuję..." : "Zapisz ustawienia"}
      </button>
    </form>
  )
}