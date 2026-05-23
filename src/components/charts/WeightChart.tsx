"use client"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

interface Props {
  data: { date: string; value: number }[]
}

export function WeightChart({ data }: Props) {
  return (
    <div className="bg-muted rounded-xl p-4">
      <p className="text-sm font-medium mb-1">Waga - 30 dni</p>
      <p className="text-xs text-muted-foreground mb-4">trend ciała</p>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data}>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#888" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#888" }}
            tickLine={false}
            axisLine={false}
            domain={["auto", "auto"]}
            width={40}
          />
          <Tooltip
            contentStyle={{
              background: "#1a1a1a",
              border: "1px solid #333",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(value: any) => typeof value === "number" ? [`${value} kg`, "Waga"] : null}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#4ade80"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}