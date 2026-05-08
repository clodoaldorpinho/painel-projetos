import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const IMAGENS_DIR =
  process.env.IMAGENS_DIR ||
  "C:\\Users\\clodo\\OneDrive\\Área de Trabalho\\ProjetoClaudeCode\\EngClodoaldoPinho\\imagens"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ nome: string; file: string }> }
) {
  const { nome, file } = await params
  const imgPath = path.join(IMAGENS_DIR, nome, file)

  if (!fs.existsSync(imgPath) || !imgPath.endsWith(".png")) {
    return new NextResponse("Not found", { status: 404 })
  }

  const buffer = fs.readFileSync(imgPath)
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
