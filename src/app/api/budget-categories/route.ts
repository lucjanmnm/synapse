import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("budget_categories")
    .select("*")
    .order("type", { ascending: true })
    .order("created_at", { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { name, type, color } = await req.json()

  const { data, error } = await supabase
    .from("budget_categories")
    .insert({ name, type, color })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient()
  const { id } = await req.json()

  const { error } = await supabase
    .from("budget_categories")
    .delete()
    .eq("id", id)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}