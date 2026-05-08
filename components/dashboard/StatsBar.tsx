"use client"

import { Post, PostStatus, STATUS_CONFIG } from "@/lib/types"

const ORDER: PostStatus[] = ["publicado", "gerado", "pendente", "erro"]

export function StatsBar({ posts }: { posts: Post[] }) {
  const counts = posts.reduce<Record<PostStatus, number>>(
    (acc, p) => { acc[p.status]++; return acc },
    { publicado: 0, gerado: 0, pendente: 0, erro: 0 }
  )

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {ORDER.map(status => {
        const cfg = STATUS_CONFIG[status]
        const n   = counts[status]
        if (n === 0 && status !== "pendente") return null
        return (
          <div key={status} className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
            <span className="text-sm text-zinc-400">
              <span className="font-semibold text-zinc-200">{n}</span> {cfg.label.toLowerCase()}
            </span>
          </div>
        )
      })}
      <div className="ml-auto flex items-center gap-2">
        <span className="text-sm text-zinc-500">
          <span className="font-semibold text-zinc-300">{posts.length}</span> posts no período
        </span>
      </div>
    </div>
  )
}
