"use client"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-100 space-y-4">
      <p className="text-sm font-medium">Coś poszło nie tak.</p>
      <p className="text-xs text-muted-foreground max-w-sm text-center">
        {error.message ?? "Nieznany błąd. Spróbuj odświeżyć stronę."}
      </p>
      <button
        onClick={reset}
        className="bg-foreground text-background rounded-lg px-4 py-2 text-sm font-medium"
      >
        Spróbuj ponownie
      </button>
    </div>
  )
}