"use client"

import Link from "next/link"
import { Post, TEMPLATE_LABELS, LINHA_CORES } from "@/lib/types"
import { StatusBadge } from "./StatusBadge"
import { cn } from "@/lib/utils"

function ConteudoLink({ post, localImages }: { post: Post; localImages: boolean }) {
  if (post.drive_folder_id) {
    return (
      <a
        href={`https://drive.google.com/drive/folders/${post.drive_folder_id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-blue-400 hover:text-blue-300 hover:underline transition-colors flex items-center gap-1"
      >
        Ver no Drive ↗
      </a>
    )
  }
  if (localImages && (post.status === "gerado" || post.status === "publicado")) {
    return (
      <Link
        href={`/posts/${encodeURIComponent(post.nome)}`}
        className="text-xs text-zinc-400 hover:text-zinc-200 hover:underline transition-colors"
      >
        Ver conteúdo
      </Link>
    )
  }
  return null
}

export function PostCard({ post, localImages }: { post: Post; localImages: boolean }) {
  const linhaCor = LINHA_CORES[post.linha] ?? "bg-zinc-500/20 text-zinc-300 border-zinc-500/30"

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 flex flex-col gap-3 hover:border-zinc-700 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-zinc-500 font-mono">{post.horario}</span>
          <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border", linhaCor)}>
            {post.linha}
          </span>
        </div>
        <StatusBadge status={post.status} />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-600 font-mono truncate max-w-[160px]">{post.nome}</span>
        <span className="text-xs text-zinc-700 border border-zinc-800 rounded px-1.5 py-0.5">
          T{post.template} · {TEMPLATE_LABELS[post.template]}
        </span>
      </div>

      <ConteudoLink post={post} localImages={localImages} />
    </div>
  )
}
