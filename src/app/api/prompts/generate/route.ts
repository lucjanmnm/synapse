import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { buildPrompt } from "@/components/prompts/PromptBuilder"

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { type } = await req.json()

  const since = new Date()
  since.setDate(since.getDate() - 7)

  const [{ data: logs }, { data: settings }] = await Promise.all([
    supabase.from("logs").select("*").gte("logged_at", since.toISOString()),
    supabase.from("settings").select("context_bio").single(),
  ])

  const prompt = buildPrompt(type, logs ?? [], settings?.context_bio)
  return NextResponse.json({ prompt })
}