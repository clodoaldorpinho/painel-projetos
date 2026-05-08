import fs from "fs"
import path from "path"
import { Post, PostStatus } from "./types"

// Local: usa variável de ambiente ou caminho padrão do Windows
// Vercel: usa data/ dentro do repositório como fallback
const LOCAL_PLANOS =
  "C:\\Users\\clodo\\OneDrive\\Área de Trabalho\\ProjetoClaudeCode\\EngClodoaldoPinho\\planos"

const LOCAL_IMAGENS =
  "C:\\Users\\clodo\\OneDrive\\Área de Trabalho\\ProjetoClaudeCode\\EngClodoaldoPinho\\imagens"

function planDir(): string {
  if (process.env.PLANOS_DIR) return process.env.PLANOS_DIR
  if (fs.existsSync(LOCAL_PLANOS)) return LOCAL_PLANOS
  return path.join(process.cwd(), "data", "eng", "planos")
}

function imgDir(): string {
  if (process.env.IMAGENS_DIR) return process.env.IMAGENS_DIR
  return LOCAL_IMAGENS
}

function detectStatus(post: Record<string, unknown>): PostStatus {
  if (post.post_id) return "publicado"

  // Campo explícito gravado pelo gerar_conteudos.py — funciona no Vercel
  if (post.imagens_geradas) return "gerado"

  // Fallback: verifica disco local (só funciona localmente)
  const nome = post.nome as string
  if (!nome) return "pendente"

  try {
    const dir = path.join(imgDir(), nome)
    if (!fs.existsSync(dir)) return "pendente"

    const template = post.template as number
    if (template === 4) {
      return fs.existsSync(path.join(dir, "post.png")) ? "gerado" : "pendente"
    }
    const slides = fs.readdirSync(dir).filter(f => f.startsWith("slide_") && f.endsWith(".png"))
    return slides.length > 0 ? "gerado" : "pendente"
  } catch {
    return "pendente"
  }
}

export function getPostsByDateRange(inicio: string, fim: string): Post[] {
  const posts: Post[] = []

  const start = new Date(inicio)
  const end   = new Date(fim)
  const cur   = new Date(start)

  while (cur <= end) {
    const dateStr  = cur.toISOString().split("T")[0]
    const jsonPath = path.join(planDir(), `post_${dateStr}.json`)

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
