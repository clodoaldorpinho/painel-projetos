import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const IMAGENS_DIR =
  process.env.IMAGENS_DIR ||
  "C:\\Users\\clodo\\OneDrive\\Área de Trabalho\\ProjetoClaudeCode\\EngClodoaldoPinho\\imagens"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ nome: string }> }
) {
  const { nome } = await params
  const dir = path.join(IMAGENS_DIR, nome)

  if (!fs.existsSync(dir)) {
    return NextResponse.json({ error: "Pasta não encontrada" }, { status: 404 })
  }

  const files = fs.readdirSync(dir)
    .filter(f => f.endsWith(".png"))
    .sort()
    .map(f => ({ name: f, url: `/api/images/${encodeURIComponent(nome)}/${encodeURIComponent(f)}` }))

  return NextResponse.json({ nome, files })
}
