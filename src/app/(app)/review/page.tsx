import { createClient } from "@/utils/supabase/server"
import { WeeklyReviewForm } from "@/components/review/WeeklyReviewForm"
import { WeeklyReviewHistory } from "@/components/review/WeeklyReviewHistory"

export default async function ReviewPage() {
  const supabase = await createClient()

  const { data: reviews } = await supabase
    .from("weekly_reviews")
    .select("*")
    .order("week_start", { ascending: false })

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-xl font-medium">Weekly Review</h1>
        <p className="text-sm text-muted-foreground mt-1">Podsumowanie tygodnia.</p>
      </div>

      <WeeklyReviewForm />
      <WeeklyReviewHistory reviews={reviews ?? []} />
    </div>
  )
}