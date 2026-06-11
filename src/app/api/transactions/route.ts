import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(req.url)
  const month = searchParams.get("month") // format: 2024-05

  let query = supabase
    .from("transactions")
    .select("*, budget_categories(id, name, type, color)")
    .order("date", { ascending: false })

  if (month) {
    const start = `${month}-01`
    const end = new Date(parseInt(month.split("-")[0]), parseInt(month.split("-")[1]), 0)
      .toISOString().split("T")[0]
    query = query.gte("date", start).lte("date", end)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const body = await req.json()

  const { data, error } = await supabase
    .from("transactions")
    .insert(body)
    .select("*, budget_categories(id, name, type, color)")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient()
  const { id } = await req.json()

  if (!id) return NextResponse.json({ error: "Brak id" }, { status: 400 })

  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}