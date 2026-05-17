import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { buildPrompt } from "@/components/prompts/PromptBuilder"

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { type } = await req.json()

  const since = new Date()
  since.setDate(since.getDate() - 7)

  const { data: logs } = await supabase
    .from("logs")
    .select("*")
    .gte("logged_at", since.toISOString())

  const prompt = buildPrompt(type, logs ?? [])
  return NextResponse.json({ prompt })
}