import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { planDir } from "@/lib/posts"

const IMAGENS_DIR =
  process.env.IMAGENS_DIR ||
  "C:\\Users\\clodo\\OneDrive\\Área de Trabalho\\ProjetoClaudeCode\\EngClodoaldoPinho\\imagens"

function getDriveImages(nome: string): string[] | null {
  // Extrai data do nome: "2026-05-09_0800_Perguntas" → "2026-05-09"
  const date = nome.substring(0, 10)
  const jsonPath = path.join(planDir(), `post_${date}.json`)
  if (!fs.existsSync(jsonPath)) return null
  try {
    const lista = JSON.parse(fs.readFileSync(jsonPath, "utf-8"))
    const posts = Array.isArray(lista) ? lista : [lista]
    const post  = posts.find((p: { nome?: string }) => p.nome === nome)
    return post?.drive_imagens ?? null
  } catch {
    return null
  }
}

// Converte URL do Drive em rota proxy local para evitar CORS/redirect
function toProxyUrl(driveUrl: string): string {
  const m = driveUrl.match(/[?&]id=([^&]+)/)
  return m ? `/api/drive-image/${m[1]}` : driveUrl
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ nome: string }> }
) {
  const { nome } = await params

  // Prioridade 1: URLs do Drive salvas no JSON (funciona no Vercel)
  const driveUrls = getDriveImages(nome)
  if (driveUrls && driveUrls.length > 0) {
    const files = driveUrls.map((url, i) => ({
      name: `slide_${String(i + 1).padStart(2, "0")}.png`,
      url:  toProxyUrl(url),
    }))
    return NextResponse.json({ nome, files, source: "drive" })
  }

  // Prioridade 2: arquivos locais (só funciona localmente)
  const dir = path.join(IMAGENS_DIR, nome)
  if (!fs.existsSync(dir)) {
    return NextResponse.json({ error: "Imagens não disponíveis" }, { status: 404 })
  }

  const files = fs.readdirSync(dir)
    .filter(f => f.endsWith(".png"))
    .sort()
    .map(f => ({ name: f, url: `/api/images/${encodeURIComponent(nome)}/${encodeURIComponent(f)}` }))

  return NextResponse.json({ nome, files, source: "local" })
}
