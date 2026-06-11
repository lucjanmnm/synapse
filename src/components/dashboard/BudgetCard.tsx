import { createClient } from "@/utils/supabase/server"
import Link from "next/link"

export async function BudgetCard() {
  const supabase = await createClient()

  const now = new Date()
  const start = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0]

  const { data: transactions } = await supabase
    .from("transactions")
    .select("type, amount")
    .gte("date", start)
    .lte("date", end)

  const income = transactions?.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0) ?? 0
  const expense = transactions?.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0) ?? 0
  const balance = income - expense

  return (
    <div className="bg-muted rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Budżet</p>
          <p className="text-xs text-muted-foreground">ten miesiąc</p>
        </div>
        <Link href="/budget" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          szczegóły →
        </Link>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Przychody</span>
          <span className="text-green-500">+{income.toFixed(2)} zł</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Wydatki</span>
          <span className="text-red-400">-{expense.toFixed(2)} zł</span>
        </div>
        <div className="h-px bg-border" />
        <div className="flex justify-between text-sm font-medium">
          <span>Bilans</span>
          <span style={{ color: balance >= 0 ? "#22C55E" : "#F87171" }}>
            {balance >= 0 ? "+" : ""}{balance.toFixed(2)} zł
          </span>
        </div>
      </div>
    </div>
  )
}