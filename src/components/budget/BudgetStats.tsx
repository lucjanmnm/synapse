interface Transaction {
  id: string
  type: string
  amount: number
  description?: string
  date: string
  budget_categories?: { name: string; color: string }
}

interface Props {
  transactions: Transaction[]
}

export function BudgetStats({ transactions }: Props) {
  const income = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)

  const expense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = income - expense

  const stats = [
    { label: "Przychody",  value: income,   color: "#22C55E" },
    { label: "Wydatki",    value: expense,  color: "#F87171" },
    { label: "Bilans",     value: balance,  color: balance >= 0 ? "#22C55E" : "#F87171" },
  ]

  // Wydatki per kategoria
  const byCategory: Record<string, { name: string; color: string; amount: number }> = {}
  transactions
    .filter(t => t.type === "expense" && t.budget_categories)
    .forEach(t => {
      const cat = t.budget_categories!
      if (!byCategory[cat.name]) byCategory[cat.name] = { name: cat.name, color: cat.color, amount: 0 }
      byCategory[cat.name].amount += t.amount
    })

  const categories = Object.values(byCategory).sort((a, b) => b.amount - a.amount)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {stats.map(s => (
          <div key={s.label} className="bg-muted rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
            <p className="text-2xl font-medium" style={{ color: s.color }}>
              {s.value.toFixed(2)} zł
            </p>
          </div>
        ))}
      </div>

      {categories.length > 0 && (
        <div className="bg-muted rounded-xl p-4 space-y-3">
          <p className="text-sm font-medium">Wydatki per kategoria</p>
          {categories.map(cat => (
            <div key={cat.name} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{cat.name}</span>
                <span>{cat.amount.toFixed(2)} zł</span>
              </div>
              <div className="h-1.5 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min((cat.amount / expense) * 100, 100)}%`,
                    background: cat.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}