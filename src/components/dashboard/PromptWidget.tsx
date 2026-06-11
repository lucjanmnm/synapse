"use client"
import { useState } from "react"
import { Sparkles, Copy, Check } from "lucide-react"
import Link from "next/link"

const types = [
  { type: "operator",     label: "Operator"     },
  { type: "gym",          label: "Gym"          },
  { type: "business",     label: "Business"     },
  { type: "reset",        label: "Reset"        },
]

export function PromptWidget() {
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [active, setActive] = useState("operator")

  async function generate(type: string) {
    setActive(type)
    setLoading(true)
    setPrompt("")
    try {
      const res = await fetch("/api/prompts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      })
      if (!res.ok) throw new Error("Błąd generowania")
      const data = await res.json()
      setPrompt(data.prompt)
    } catch {
      setPrompt("Błąd - spróbuj ponownie.")
    } finally {
      setLoading(false)
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-muted rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">AI Prompt Generator</p>
          <p className="text-xs text-muted-foreground">kontekstowe prompty do Claude</p>
        </div>
        <Link href="/prompts" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          więcej →
        </Link>
      </div>

      {prompt ? (
        <div className="space-y-2">
          <pre className="text-xs bg-background rounded-lg p-3 whitespace-pre-wrap leading-relaxed max-h-32 overflow-y-auto">
            {prompt}
          </pre>
          <button
            onClick={copy}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? "Skopiowano" : "Kopiuj"}
          </button>
        </div>
      ) : (
        <button
          onClick={() => generate(active)}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-background rounded-lg px-3 py-2.5 text-sm hover:bg-background/80 disabled:opacity-50 transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          {loading ? "Generuję..." : "Otwórz generator"}
        </button>
      )}

      <div className="grid grid-cols-2 gap-2">
        {types.map(t => (
          <button
            key={t.type}
            onClick={() => generate(t.type)}
            disabled={loading}
            className={`text-xs rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50 ${
              active === t.type
                ? "bg-foreground text-background"
                : "bg-background text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  )
}