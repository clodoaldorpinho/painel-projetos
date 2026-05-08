import { NextRequest, NextResponse } from "next/server"
import { getPostsByDateRange, getWeekRange } from "@/lib/posts"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const inicio = searchParams.get("inicio")
  const fim    = searchParams.get("fim")
  const offset = parseInt(searchParams.get("offset") ?? "0", 10)

  const range = inicio && fim ? { inicio, fim } : getWeekRange(offset)

  try {
    const posts = getPostsByDateRange(range.inicio, range.fim)
    return NextResponse.json({ posts, range })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
