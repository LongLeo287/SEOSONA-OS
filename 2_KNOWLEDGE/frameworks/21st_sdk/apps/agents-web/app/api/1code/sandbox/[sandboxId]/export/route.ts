import { NextRequest, NextResponse } from "next/server"
import { Sandbox } from "@e2b/code-interpreter"
import { getRestAuth } from "@/lib/rest-auth"

export const maxDuration = 120

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sandboxId: string }> },
) {
  try {
    const { userId } = await getRestAuth(request)
    console.log(`[SANDBOX-EXPORT] Request from userId: ${userId}`)
    if (!userId) {
      console.log(`[SANDBOX-EXPORT] Unauthorized - no userId`)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { sandboxId } = await params

    // Get query params for logging
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")
    const fullExport = searchParams.get("full") === "true"

    console.log(`[SANDBOX-EXPORT] Request: sandboxId=${sandboxId}, sessionId=${sessionId || "all"}, full=${fullExport}`)
    console.log(`[SANDBOX-EXPORT] Connecting to sandbox: ${sandboxId}`)

    // Connect to e2b sandbox (auto-resumes if paused)
    const sbx = await Sandbox.connect(sandboxId, {
      timeoutMs: 1_800_000, // 30 min
    })
    console.log(`[SANDBOX-EXPORT] Connected to sandbox successfully`)

    // Get the sandbox's internal URL and fetch from the export endpoint
    // Forward query params (e.g., ?full=true for full repo export)
    const exportUrl = sbx.getHost(3003)
    const queryString = request.nextUrl.search // includes the "?" if params exist
    const internalUrl = `https://${exportUrl}/api/export${queryString}`
    console.log(`[SANDBOX-EXPORT] Fetching from internal URL: ${internalUrl}`)

    const response = await fetch(internalUrl, {
      method: "GET",
      headers: {
        Accept: "application/x-ndjson",
      },
    })

    console.log(`[SANDBOX-EXPORT] Internal response status: ${response.status}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[SANDBOX-EXPORT] Internal endpoint error: ${errorText}`)
      throw new Error(`Export endpoint returned ${response.status}: ${errorText}`)
    }

    console.log(`[SANDBOX-EXPORT] Streaming response back to client...`)
    // Stream the NDJSON response through
    return new Response(response.body, {
      headers: {
        "Content-Type": "application/x-ndjson",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("[SANDBOX-EXPORT] Error:", error)
    return NextResponse.json(
      {
        error: "Failed to export sandbox state",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
