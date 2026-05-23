"use client"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

interface Props {
  data: { date: string; value: number }[]
}

export function MoodChart({ data }: Props) {
  return (
    <div className="bg-muted rounded-xl p-4">
      <p className="text-sm font-medium mb-1">Nastrój</p>
      <p className="text-xs text-muted-foreground mb-4">poziom 1–10</p>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={data}>
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#888" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#888" }} tickLine={false} axisLine={false} domain={[0, 10]} width={25} />
            <Tooltip
              contentStyle={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: "8px", fontSize: "12px" }}
              formatter={(value: number | string | readonly (number | string)[] | undefined) => {
                const num = Array.isArray(value)
                  ? typeof value[0] === "number"
                    ? value[0]
                    : value[0]
                      ? Number(value[0])
                      : undefined
                  : typeof value === "number"
                  ? value
                  : value
                    ? Number(value)
                    : undefined
                return [`${num ?? "-"}/10`, "Nastrój"]
              }}
            />
            <Line type="monotone" dataKey="value" stroke="#4ade80" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-xs text-muted-foreground h-40 flex items-center">Brak danych.</p>
      )}
    </div>
  )
}