import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { z } from "zod"

const LogSchema = z.object({
  category: z.enum([
  "weight", "sleep", "training", "stress",
  "mood", "note", "relationship", "idea", "review",
  "expense", "income"
  ]),
  value_num: z.number().optional(),
  value_text: z.string().optional(),
  mood_score: z.number().min(1).max(10).optional(),
  stress_score: z.number().min(1).max(10).optional(),
  energy_score: z.number().min(1).max(10).optional(),
  raw_input: z.string().min(1).max(500),
  tags: z.array(z.string()).optional(),
})

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const body = await req.json()
  const parsed = LogSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const { data, error } = await supabase
    .from("logs")
    .insert(parsed.data)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data, { status: 201 })
}

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(req.url)
  const category = searchParams.get("category")

  let query = supabase
    .from("logs")
    .select("*")
    .order("logged_at", { ascending: false })
    .limit(100)

  if (category) query = query.eq("category", category)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient()
  const { id } = await req.json()

  if (!id) return NextResponse.json({ error: "Brak id" }, { status: 400 })

  const { error } = await supabase
    .from("logs")
    .delete()
    .eq("id", id)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient()
  const { id, ...body } = await req.json()

  if (!id) return NextResponse.json({ error: "Brak id" }, { status: 400 })

  const parsed = LogSchema.partial().safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const { data, error } = await supabase
    .from("logs")
    .update(parsed.data)
    .eq("id", id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}