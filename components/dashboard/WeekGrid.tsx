"use client"

import { Post } from "@/lib/types"
import { PostCard } from "./PostCard"

const DIAS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"]

function formatDate(iso: string) {
  const [, , d] = iso.split("-")
  return `${parseInt(d)}`
}

function getDayLabel(iso: string) {
  const d = new Date(iso + "T12:00:00")
  return DIAS[d.getDay() === 0 ? 6 : d.getDay() - 1]
}

interface WeekGridProps {
  posts: Post[]
  inicio: string
  fim: string
}

export function WeekGrid({ posts, inicio, fim }: WeekGridProps) {
  const days: string[] = []
  const cur = new Date(inicio + "T12:00:00")
  const end = new Date(fim + "T12:00:00")
  while (cur <= end) {
    days.push(cur.toISOString().split("T")[0])
    cur.setDate(cur.getDate() + 1)
  }

  const postsByDay = days.reduce<Record<string, Post[]>>((acc, d) => {
    acc[d] = posts.filter(p => p.data === d).sort((a, b) => a.horario.localeCompare(b.horario))
    return acc
  }, {})

  return (
    <div className="grid grid-cols-7 gap-3">
      {days.map(day => {
        const dayPosts = postsByDay[day] ?? []
        const label    = getDayLabel(day)
        const num      = formatDate(day)

        return (
          <div key={day} className="flex flex-col gap-2 min-w-0">
            <div className="flex flex-col items-center pb-2 border-b border-zinc-800">
              <span className="text-xs text-zinc-500 uppercase tracking-wide">{label}</span>
              <span className="text-lg font-semibold text-zinc-300">{num}</span>
            </div>

            {dayPosts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-zinc-800 p-4 text-center">
                <span className="text-xs text-zinc-700">sem posts</span>
              </div>
            ) : (
              dayPosts.map(p => <PostCard key={p.id} post={p} />)
            )}
          </div>
        )
      })}
    </div>
  )
}
