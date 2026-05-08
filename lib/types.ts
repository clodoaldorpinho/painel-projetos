export type PostStatus = "publicado" | "gerado" | "pendente" | "erro"

export type Template = 1 | 2 | 3 | 4

export interface Post {
  id: string
  data: string
  horario: string
  linha: string
  template: Template
  nome: string
  legenda?: string
  status: PostStatus
  post_id?: string | null
  drive_folder_id?: string | null
  drive_imagens?: string[]
}

export interface DayPosts {
  data: string
  posts: Post[]
}

export interface Project {
  id: string
  nome: string
  instagram: string
  cor: string
}

export const PROJECTS: Project[] = [
  {
    id: "eng",
    nome: "Eng. Clodoaldo Pinho",
    instagram: "@eng.clodoaldopinho",
    cor: "#3b82f6",
  },
]

export const TEMPLATE_LABELS: Record<Template, string> = {
  1: "X.com",
  2: "Editorial",
  3: "Conteúdo",
  4: "Sketchnote",
}

export const LINHA_CORES: Record<string, string> = {
  "Mercado e Tendências":   "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "Verdades da Profissão":  "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "Checklists e Frameworks":"bg-green-500/20 text-green-300 border-green-500/30",
  "Carreira do Engenheiro": "bg-purple-500/20 text-purple-300 border-purple-500/30",
  "Excel para Engenheiros": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  "Provocações Diretas":    "bg-red-500/20 text-red-300 border-red-500/30",
  "Perguntas e Respostas":  "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  "Quebra de Objeções":     "bg-pink-500/20 text-pink-300 border-pink-500/30",
}

export const STATUS_CONFIG: Record<PostStatus, { label: string; cor: string; dot: string }> = {
  publicado: { label: "Publicado",  cor: "bg-green-500/20 text-green-400 border-green-500/30",  dot: "bg-green-400" },
  gerado:    { label: "Gerado",     cor: "bg-blue-500/20 text-blue-400 border-blue-500/30",     dot: "bg-blue-400" },
  pendente:  { label: "Pendente",   cor: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",     dot: "bg-zinc-500" },
  erro:      { label: "Erro",       cor: "bg-red-500/20 text-red-400 border-red-500/30",        dot: "bg-red-400" },
}
