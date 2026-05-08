import { Dashboard } from "@/components/dashboard/Dashboard"

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-[1400px] mx-auto px-6 py-8 flex flex-col gap-8">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
              Painel de Projetos
            </h1>
            <p className="text-sm text-zinc-500">
              Acompanhamento de posts agendados, gerados e publicados
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-xs text-blue-300 font-medium">Eng. Clodoaldo Pinho</span>
          </div>
        </div>
        <Dashboard />
      </div>
    </main>
  )
}
