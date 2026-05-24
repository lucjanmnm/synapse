export function formatSleep(hours: number): string {
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  return m > 0 ? `${h}:${String(m).padStart(2, "0")}` : `${h}:00`
}