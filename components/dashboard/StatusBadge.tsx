"use client"

import { PostStatus, STATUS_CONFIG } from "@/lib/types"
import { cn } from "@/lib/utils"

export function StatusBadge({ status }: { status: PostStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border", cfg.cor)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
    </span>
  )
}
