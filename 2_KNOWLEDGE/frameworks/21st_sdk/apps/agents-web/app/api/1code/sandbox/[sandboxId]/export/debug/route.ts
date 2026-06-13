import { NextRequest, NextResponse } from "next/server"
import { Sandbox } from "@e2b/code-interpreter"
import { getRestAuth } from "@/lib/rest-auth"

export const maxDuration = 60

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sandboxId: string }> },
) {
  try {
    const { userId } = await getRestAuth(request)
    console.log(`[SANDBOX-DEBUG] Request from userId: ${userId}`)
    if (!userId) {
      console.log(`[SANDBOX-DEBUG] Unauthorized - no userId`)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { sandboxId } = await params
    console.log(`[SANDBOX-DEBUG] Connecting to sandbox: ${sandboxId}`)

    // Connect to e2b sandbox (auto-resumes if paused)
    const sbx = await Sandbox.connect(sandboxId, {
      timeoutMs: 60_000,
    })
    console.log(`[SANDBOX-DEBUG] Connected to sandbox successfully`)

    // Get the sandbox's internal URL and fetch from the debug endpoint
    const exportUrl = sbx.getHost(3003)
    const internalUrl = `https://${exportUrl}/api/export/debug`
    console.log(`[SANDBOX-DEBUG] Fetching from internal URL: ${internalUrl}`)

    const response = await fetch(internalUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })

    console.log(`[SANDBOX-DEBUG] Internal response status: ${response.status}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[SANDBOX-DEBUG] Internal endpoint error: ${errorText}`)
      throw new Error(`Debug endpoint returned ${response.status}: ${errorText}`)
    }

    const debugData = await response.json()
    console.log(`[SANDBOX-DEBUG] Debug data received`)

    return NextResponse.json(debugData)
  } catch (error) {
    console.error("[SANDBOX-DEBUG] Error:", error)
    return NextResponse.json(
      {
        error: "Failed to get debug info",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
