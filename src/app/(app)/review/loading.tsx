export default function Loading() {
  return (
    <div className="max-w-3xl space-y-4">
      <div className="h-8 w-32 bg-muted rounded-lg animate-pulse" />
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-7 w-20 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-12 bg-muted rounded-xl animate-pulse" />
      ))}
    </div>
  )
}