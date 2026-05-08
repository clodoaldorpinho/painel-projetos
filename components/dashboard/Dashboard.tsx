"use client"

import { useEffect, useState, useCallback } from "react"
import { Post } from "@/lib/types"
import { WeekGrid } from "./WeekGrid"
import { StatsBar } from "./StatsBar"

export function Dashboard() {
  const [posts, setPosts]   = useState<Post[]>([])
  const [range, setRange]   = useState<{ inicio: string; fim: string } | null>(null)
  const [offset, setOffset] = useState(0)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async (off: number) => {
    setLoading(true)
    try {
      const res  = await fetch(`/api/posts?offset=${off}`)
      const data = await res.json()
      setPosts(data.posts ?? [])
      setRange(data.range)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load(offset) }, [offset, load])

  function fmtRange(r: { inicio: string; fim: string }) {
    const fmt = (iso: string) => {
      const [, m, d] = iso.split("-")
      return `${parseInt(d)}/${parseInt(m)}`
    }
    return `${fmt(r.inicio)} a ${fmt(r.fim)}`
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-zinc-100">
            {range ? fmtRange(range) : "Carregando..."}
          </h2>
          <p className="text-sm text-zinc-500">@eng.clodoaldopinho</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setOffset(o => o - 1)}
            className="px-3 py-1.5 text-sm rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            ← Semana anterior
          </button>
          <button
            onClick={() => setOffset(0)}
            disabled={offset === 0}
            className="px-3 py-1.5 text-sm rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Hoje
          </button>
          <button
            onClick={() => setOffset(o => o + 1)}
            className="px-3 py-1.5 text-sm rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            Próxima semana →
          </button>
          <button
            onClick={() => load(offset)}
            className="px-3 py-1.5 text-sm rounded-lg border border-zinc-700 text-zinc-400 hover:bg-zinc-800 transition-colors"
            title="Atualizar"
          >
            ↻
          </button>
        </div>
      </div>

      {/* Stats */}
      {!loading && range && <StatsBar posts={posts} />}

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64 text-zinc-600 text-sm">
          Carregando...
        </div>
      ) : range ? (
        <WeekGrid posts={posts} inicio={range.inicio} fim={range.fim} />
      ) : null}
    </div>
  )
}
