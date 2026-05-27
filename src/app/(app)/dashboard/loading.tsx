export default function Loading() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div className="h-8 w-48 bg-muted rounded-lg animate-pulse" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-muted rounded-xl p-4 h-24 animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-muted rounded-xl h-48 animate-pulse" />
        <div className="bg-muted rounded-xl h-48 animate-pulse" />
      </div>
    </div>
  )
}