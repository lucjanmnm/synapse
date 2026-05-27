"use client"
import { useEffect } from "react"

export default function GlobalError({
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
    <html lang="pl" className="dark">
      <body className="bg-background text-foreground min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <p className="text-sm font-medium">Krytyczny błąd aplikacji.</p>
          <button
            onClick={reset}
            className="bg-foreground text-background rounded-lg px-4 py-2 text-sm font-medium"
          >
            Odśwież
          </button>
        </div>
      </body>
    </html>
  )
}