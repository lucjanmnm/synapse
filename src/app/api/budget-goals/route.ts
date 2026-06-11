import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("budget_goals")
    .select("*")
    .order("created_at", { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const body = await req.json()

  const { data, error } = await supabase
    .from("budget_goals")
    .insert(body)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient()
  const { id, ...body } = await req.json()

  const { data, error } = await supabase
    .from("budget_goals")
    .update(body)
    .eq("id", id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient()
  const { id } = await req.json()

  const { error } = await supabase
    .from("budget_goals")
    .delete()
    .eq("id", id)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}