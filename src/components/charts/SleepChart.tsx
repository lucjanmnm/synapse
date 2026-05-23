"use client"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

interface Props {
  data: { date: string; value: number }[]
}

export function SleepChart({ data }: Props) {
  return (
    <div className="bg-muted rounded-xl p-4">
      <p className="text-sm font-medium mb-1">Sen</p>
      <p className="text-xs text-muted-foreground mb-4">godziny snu</p>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={data}>
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#888" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#888" }} tickLine={false} axisLine={false} domain={[0, 12]} width={25} />
            <Tooltip
              contentStyle={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: "8px", fontSize: "12px" }}
              formatter={(value: number | string | readonly (string | number)[] | undefined) => {
                const raw = Array.isArray(value) ? value[0] : value
                const hours = raw === undefined ? 0 : Number(raw)
                return [`${hours}h`, "Sen"]
              }}
            />
            <Line type="monotone" dataKey="value" stroke="#60a5fa" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-xs text-muted-foreground h-40 flex items-center">Brak danych.</p>
      )}
    </div>
  )
}