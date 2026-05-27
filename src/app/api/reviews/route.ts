import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

function getNextMonday(): string {
  const d = new Date()
  const day = d.getDay()
  const diff = day === 0 ? 1 : 8 - day
  d.setDate(d.getDate() + diff)
  return d.toISOString().split("T")[0]
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const body = await req.json()

  const { data, error } = await supabase
    .from("weekly_reviews")
    .upsert(body, { onConflict: "week_start" })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  // Przepisz priorytety do tabeli priorities na następny tydzień
  if (body.next_priorities && body.next_priorities.length > 0) {
    const nextMonday = getNextMonday()

    // Usuń stare priorytety na następny tydzień
    await supabase
      .from("priorities")
      .delete()
      .eq("week_start", nextMonday)

    // Dodaj nowe
    await supabase
      .from("priorities")
      .insert(
        body.next_priorities.map((title: string) => ({
          title,
          week_start: nextMonday,
          completed: false,
        }))
      )
  }

  return NextResponse.json(data, { status: 201 })
}