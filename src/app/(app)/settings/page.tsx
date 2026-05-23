import { createClient } from "@/utils/supabase/server"
import { SettingsForm } from "@/components/settings/SettingsForm"

export default async function SettingsPage() {
  const supabase = await createClient()

  const { data: settings } = await supabase
    .from("settings")
    .select("*")
    .single()

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-medium">Ustawienia</h1>
        <p className="text-sm text-muted-foreground mt-1">Profil, kontekst AI i skróty.</p>
      </div>
      <SettingsForm initial={{
        display_name: settings?.display_name ?? "",
        context_bio: settings?.context_bio ?? "",
        timezone: settings?.timezone ?? "Europe/Warsaw",
        shortcuts: settings?.shortcuts ?? ["waga 72.1", "sen 7h", "stres 7", "mood 8"],
      }} />
    </div>
  )
}