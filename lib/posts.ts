import fs from "fs"
import path from "path"
import { Post, PostStatus } from "./types"

const PLANOS_DIR = path.join(
  process.env.PLANOS_DIR ||
  "C:\\Users\\clodo\\OneDrive\\Área de Trabalho\\ProjetoClaudeCode\\EngClodoaldoPinho\\planos"
)

const IMAGENS_DIR = path.join(
  process.env.IMAGENS_DIR ||
  "C:\\Users\\clodo\\OneDrive\\Área de Trabalho\\ProjetoClaudeCode\\EngClodoaldoPinho\\imagens"
)

function detectStatus(post: Record<string, unknown>): PostStatus {
  if (post.post_id) return "publicado"

  const nome = post.nome as string
  if (!nome) return "pendente"

  const imgDir = path.join(IMAGENS_DIR, nome)
  if (!fs.existsSync(imgDir)) return "pendente"

  const template = post.template as number
  if (template === 4) {
    return fs.existsSync(path.join(imgDir, "post.png")) ? "gerado" : "pendente"
  }

  const slides = fs.readdirSync(imgDir).filter(f => f.startsWith("slide_") && f.endsWith(".png"))
  return slides.length > 0 ? "gerado" : "pendente"
}

export function getPostsByDateRange(inicio: string, fim: string): Post[] {
  const posts: Post[] = []

  const start = new Date(inicio)
  const end   = new Date(fim)
  const cur   = new Date(start)

  while (cur <= end) {
    const dateStr  = cur.toISOString().split("T")[0]
    const jsonPath = path.join(PLANOS_DIR, `post_${dateStr}.json`)

    if (fs.existsSync(jsonPath)) {
      try {
        const raw = JSON.parse(fs.readFileSync(jsonPath, "utf-8")) as Record<string, unknown>[]
        const dayPosts = Array.isArray(raw) ? raw : [raw]
        for (const p of dayPosts) {
          posts.push({ ...(p as unknown as Post), status: detectStatus(p) })
        }
      } catch {
        // arquivo inválido — ignora
      }
    }

    cur.setDate(cur.getDate() + 1)
  }

  return posts
}

export function getWeekRange(offset = 0): { inicio: string; fim: string } {
  const today = new Date()
  const day   = today.getDay()
  const diff  = day === 0 ? -6 : 1 - day
  const mon   = new Date(today)
  mon.setDate(today.getDate() + diff + offset * 7)

  const sun = new Date(mon)
  sun.setDate(mon.getDate() + 6)

  return {
    inicio: mon.toISOString().split("T")[0],
    fim:    sun.toISOString().split("T")[0],
  }
}
