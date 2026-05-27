import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function GET() {
  const supabase = await createClient()

  const monday = getMonday()

  const { data, error } = await supabase
    .from("priorities")
    .select("*")
    .eq("week_start", monday)
    .order("created_at", { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { title } = await req.json()

  const { data, error } = await supabase
    .from("priorities")
    .insert({ title, week_start: getMonday() })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient()
  const { id, completed } = await req.json()

  const { data, error } = await supabase
    .from("priorities")
    .update({ completed })
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
    .from("priorities")
    .delete()
    .eq("id", id)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}

function getMonday(): string {
  const d = new Date()
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d.toISOString().split("T")[0]
}