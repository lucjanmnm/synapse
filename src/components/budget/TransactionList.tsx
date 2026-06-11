"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"

interface Transaction {
  id: string
  type: string
  amount: number
  description?: string
  date: string
  budget_categories?: { name: string; color: string }
}

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  async function remove(id: string) {
    if (!confirm("Usunąć transakcję?")) return
    setLoading(id)

    await fetch("/api/transactions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })

    setLoading(null)
    router.refresh()
  }

  return (
    <div className="bg-muted rounded-xl p-4 space-y-3">
      <p className="text-sm font-medium">Historia transakcji</p>

      <div className="space-y-2">
        {transactions.length > 0 ? (
          transactions.map(t => (
            <div key={t.id} className="flex items-center justify-between bg-background rounded-lg px-3 py-2">
              <div className="flex items-center gap-2 min-w-0">
                {t.budget_categories && (
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: t.budget_categories.color }}
                  />
                )}
                <div className="min-w-0">
                  <p className="text-xs truncate">
                    {t.description || (t.type === "expense" ? "Wydatek" : "Przychód")}
                  </p>
                  {t.budget_categories && (
                    <p className="text-[10px] text-muted-foreground">{t.budget_categories.name}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <span className={`text-sm font-medium ${t.type === "income" ? "text-green-500" : "text-red-400"}`}>
                  {t.type === "income" ? "+" : "-"}{t.amount.toFixed(2)} zł
                </span>
                <button
                  onClick={() => remove(t.id)}
                  disabled={loading === t.id}
                  className="text-muted-foreground hover:text-red-400 transition-colors disabled:opacity-40"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-muted-foreground">Brak transakcji w tym miesiącu.</p>
        )}
      </div>
    </div>
  )
}