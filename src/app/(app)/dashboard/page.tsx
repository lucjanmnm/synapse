import { QuickStats } from "@/components/dashboard/QuickStats"
import { LatestLogs } from "@/components/dashboard/LatestLogs"
import { WeightChartWrapper } from "@/components/dashboard/WeightChartWrapper"
import { PromptWidget } from "@/components/dashboard/PromptWidget"
import { TrainingCard } from "@/components/dashboard/TrainingCard"
import { SleepCard } from "@/components/dashboard/SleepCard"
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents"
import { WeeklyPriorities } from "@/components/dashboard/WeeklyPriorities"
import { QuickAddModal } from "@/components/quick-add/QuickAddModal"

function getDate() {
  return new Intl.DateTimeFormat("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date())
}

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <QuickAddModal />

      <div>
        <h1 className="text-2xl font-medium capitalize">{getDate()}</h1>
        <p className="text-sm text-muted-foreground mt-1">Twoje dane, twój kontekst, twój drugi mózg.</p>
      </div>

      <QuickStats />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <WeightChartWrapper />
        </div>
        <PromptWidget />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TrainingCard />
        <SleepCard />
        <UpcomingEvents />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <WeeklyPriorities />
        <LatestLogs />
      </div>
    </div>
  )
}