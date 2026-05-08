"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"

interface ImageFile {
  name: string
  url: string
}

export default function PostViewer() {
  const { nome } = useParams<{ nome: string }>()
  const router   = useRouter()
  const [files, setFiles]     = useState<ImageFile[]>([])
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/images/${encodeURIComponent(nome)}`)
      .then(r => r.json())
      .then(d => { setFiles(d.files ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [nome])

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500">
        Carregando imagens...
      </div>
    )
  }

  if (files.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4 text-zinc-500">
        <p>Nenhuma imagem encontrada para <span className="text-zinc-300 font-mono">{nome}</span></p>
        <button onClick={() => router.back()} className="text-sm text-zinc-600 hover:text-zinc-400">
          ← Voltar
        </button>
      </div>
    )
  }

  const img = files[current]

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
        <button
          onClick={() => router.back()}
          className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          ← Painel
        </button>
        <span className="text-xs text-zinc-500 font-mono">{nome}</span>
        <span className="text-sm text-zinc-400">
          {current + 1} / {files.length}
        </span>
      </div>

      {/* Image */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="relative max-w-sm w-full shadow-2xl rounded-xl overflow-hidden border border-zinc-800">
          <Image
            src={img.url}
            alt={img.name}
            width={1080}
            height={1350}
            className="w-full h-auto"
            unoptimized
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 px-6 py-4 border-t border-zinc-800">
        <button
          onClick={() => setCurrent(c => Math.max(0, c - 1))}
          disabled={current === 0}
          className="px-4 py-2 rounded-lg border border-zinc-700 text-sm text-zinc-300 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ← Anterior
        </button>

        <div className="flex gap-1.5">
          {files.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === current ? "bg-blue-400" : "bg-zinc-700 hover:bg-zinc-500"
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrent(c => Math.min(files.length - 1, c + 1))}
          disabled={current === files.length - 1}
          className="px-4 py-2 rounded-lg border border-zinc-700 text-sm text-zinc-300 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Próximo →
        </button>
      </div>
    </div>
  )
}
