"use client"
import { useState } from "react"
import { Sparkles, Copy, Check } from "lucide-react"

interface Props {
  type: string
  label: string
  description: string
}

export function PromptCard({ type, label, description }: Props) {
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  async function generate() {
    setLoading(true)
    const res = await fetch("/api/prompts/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    })
    const data = await res.json()
    setPrompt(data.prompt)
    setLoading(false)
  }

  async function copy() {
    await navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-muted rounded-xl p-4 space-y-3">
      <div>
        <p className="font-medium text-sm">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>

      {prompt ? (
        <div className="space-y-2">
          <pre className="text-xs bg-background rounded-lg p-3 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
            {prompt}
          </pre>
          <button
            onClick={copy}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? "Skopiowano" : "Kopiuj prompt"}
          </button>
        </div>
      ) : (
        <button
          onClick={generate}
          disabled={loading}
          className="flex items-center gap-2 text-sm bg-background rounded-lg px-3 py-2 hover:bg-background/80 disabled:opacity-50 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {loading ? "Generuję..." : "Generuj prompt"}
        </button>
      )}
    </div>
  )
}