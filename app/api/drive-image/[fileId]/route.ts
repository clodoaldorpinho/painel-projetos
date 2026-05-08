import { NextRequest, NextResponse } from "next/server"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const { fileId } = await params

  // confirm=1 bypasses the virus-scan confirmation page Google shows for larger files
  const url = `https://drive.google.com/uc?export=download&id=${encodeURIComponent(fileId)}&confirm=1`

  try {
    const res = await fetch(url, { redirect: "follow" })

    if (!res.ok) {
      return NextResponse.json({ error: "Drive fetch failed" }, { status: 502 })
    }

    const ct = res.headers.get("content-type") ?? ""
    if (!ct.startsWith("image/")) {
      // Drive returned an HTML page (e.g. login redirect or quota exceeded)
      return NextResponse.json({ error: "Not an image" }, { status: 502 })
    }

    const buf = await res.arrayBuffer()
    return new NextResponse(buf, {
      headers: {
        "Content-Type": ct,
        "Cache-Control": "public, max-age=86400",
      },
    })
  } catch {
    return NextResponse.json({ error: "Proxy error" }, { status: 502 })
  }
}
