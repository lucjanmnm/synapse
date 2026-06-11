import { createClient } from "@/utils/supabase/server"
import { BudgetStats } from "@/components/budget/BudgetStats"
import { TransactionList } from "@/components/budget/TransactionList"
import { BudgetGoals } from "@/components/budget/BudgetGoals"
import { AddTransactionModal } from "@/components/budget/AddTransactionModal"

export default async function BudgetPage() {
  const supabase = await createClient()

  const now = new Date()
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  const start = `${month}-01`
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0]

  const [{ data: transactions }, { data: categories }, { data: goals }] = await Promise.all([
    supabase
      .from("transactions")
      .select("*, budget_categories(id, name, type, color)")
      .gte("date", start)
      .lte("date", end)
      .order("date", { ascending: false }),
    supabase
      .from("budget_categories")
      .select("*")
      .order("type", { ascending: true }),
    supabase
      .from("budget_goals")
      .select("*")
      .order("created_at", { ascending: true }),
  ])

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium">Budżet</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {new Intl.DateTimeFormat("pl-PL", { month: "long", year: "numeric" }).format(now)}
          </p>
        </div>
        <AddTransactionModal categories={categories ?? []} />
      </div>

      <BudgetStats transactions={transactions ?? []} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BudgetGoals goals={goals ?? []} />
        <TransactionList transactions={transactions ?? []} />
      </div>
    </div>
  )
}