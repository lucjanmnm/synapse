"use client"
import { useState, useEffect } from "react"
import { QuickAddForm } from "./QuickAddForm"

export function QuickAddModal() {
  const [open, setOpen] = useState(false)
  const [prefill, setPrefill] = useState("")
  const [shortcuts, setShortcuts] = useState<string[]>([])

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(data => setShortcuts(data.shortcuts ?? []))
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen(true)
      }
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  function openWithPrefill(text: string) {
    setPrefill(text)
    setOpen(true)
  }

  return (
    <>
      <div className="space-y-2">
        <button
          onClick={() => { setPrefill(""); setOpen(true) }}
          className="w-full flex items-center justify-between bg-muted hover:bg-muted/80 rounded-xl px-4 py-3 text-sm text-muted-foreground transition-colors"
        >
          <span>Quick add - np. "waga 72.1", "sen 6h"...</span>
          <kbd className="text-xs border border-border rounded px-1.5 py-0.5 hidden md:block">⌘K</kbd>
        </button>

        {shortcuts.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {shortcuts.map(s => (
              <button
                key={s}
                onClick={() => openWithPrefill(s)}
                className="text-xs bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground rounded-lg px-3 py-1.5 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}
        >
          <div className="w-full md:max-w-lg bg-background border border-border rounded-t-2xl md:rounded-2xl p-5 m-0 md:m-4 space-y-3">
            <p className="text-sm font-medium">Quick Add</p>
            <QuickAddForm
              prefill={prefill}
              onSuccess={() => setOpen(false)}
            />
            <p className="text-xs text-muted-foreground">
              "waga 72.1" · "sen 7h" · "stres 8" · "trening nogi 40min"
            </p>
          </div>
        </div>
      )}
    </>
  )
}