import { NextRequest, NextResponse } from "next/server"

// Simple auth logging endpoint for debugging production issues
// Logs are written to server console (visible in Vercel logs)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, data, timestamp } = body

    // Log to server console (visible in Vercel/hosting logs)
    console.log(
      `[1CODE_AUTH_LOG] ${timestamp || new Date().toISOString()} | ${action}`,
      JSON.stringify(data || {})
    )

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
}
