import { NextRequest, NextResponse } from "next/server"
import { verifyDesktopToken } from "@/lib/desktop-auth"
import { codesandboxSdkV2 } from "@/lib/codesandbox-sdk-v2"
import { codesandboxSdk } from "@/lib/codesandbox-sdk-v1"
import { VMTier } from "codesandbox-sdk-v1"
import { DEFAULT_HIBERNATION_TIMEOUT } from "@/lib/codesandbox-sdk-v11"
import type { AuthStartResponse } from "@/lib/claude-code"

// The auth service sandbox template ID (same as web app)
const CLAUDE_CODE_AUTH_SANDBOX = "pt_JQUYmArdWgDeMgWcpr5Xth"

async function postWithSandboxReadiness(
  url: string,
  init: RequestInit = {},
  { timeoutMs = 30_000, intervalMs = 1500 } = {},
): Promise<Response> {
  const start = Date.now()
  let lastStatus = "no response"

  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, init)
      if (res.status !== 502 && res.status !== 503 && res.status !== 504) {
        return res
      }
      lastStatus = `${res.status} ${res.statusText}`
    } catch (error) {
      lastStatus = error instanceof Error ? error.message : String(error)
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs))
  }

  throw new Error(`Sandbox not ready after ${timeoutMs}ms (last: ${lastStatus})`)
}

/**
 * POST /api/auth/claude-code/start
 *
 * Starts Claude Code OAuth flow for desktop users.
 * Creates a sandbox from template and initiates auth session.
 *
 * Headers: x-desktop-token (required)
 * Returns: { sandboxId, sandboxUrl, sessionId }
 */
export async function POST(request: NextRequest) {
  try {
    // Verify desktop token
    const token = request.headers.get("x-desktop-token")
    if (!token) {
      return NextResponse.json(
        { error: "Desktop token required" },
        { status: 401 }
      )
    }

    const userId = await verifyDesktopToken(token)
    if (!userId) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      )
    }

    console.log("[ClaudeCode/Desktop] startAuth called for user:", userId)

    // 1. Create the auth service sandbox from template
    console.log("[ClaudeCode/Desktop] Creating auth sandbox from template:", CLAUDE_CODE_AUTH_SANDBOX)
    const sandbox = await codesandboxSdkV2.sandboxes.create({
      id: CLAUDE_CODE_AUTH_SANDBOX,
      privacy: "public-hosts",
      hibernationTimeoutSeconds: DEFAULT_HIBERNATION_TIMEOUT,
      vmTier: VMTier.Nano,
    })
    console.log("[ClaudeCode/Desktop] Sandbox created:", sandbox.id)

    // 2. Connect to sandbox and get URL
    console.log("[ClaudeCode/Desktop] Connecting to sandbox...")
    const sandboxInstance = await codesandboxSdk.sandboxes.resume(sandbox.id)
    const session = await sandboxInstance.connect()
    const sandboxUrl = session.hosts.getUrl(3000)
    console.log("[ClaudeCode/Desktop] Sandbox connected, URL:", sandboxUrl)

    // 3. Start auth session on the sandbox
    // CSB `connect()` waits for VM but not for the dev server on port 3000.
    console.log("[ClaudeCode/Desktop] Starting auth session...")
    let startRes: Response
    try {
      startRes = await postWithSandboxReadiness(`${sandboxUrl}/api/auth/start`, {
        method: "POST",
      })
    } catch (error) {
      console.error("[ClaudeCode/Desktop] Auth start failed (readiness):", error)
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Sandbox not ready" },
        { status: 504 }
      )
    }

    if (!startRes.ok) {
      console.error("[ClaudeCode/Desktop] Auth start failed:", startRes.status, startRes.statusText)
      return NextResponse.json(
        { error: `Failed to start auth: ${startRes.statusText}` },
        { status: 500 }
      )
    }

    const { sessionId } = (await startRes.json()) as AuthStartResponse
    console.log("[ClaudeCode/Desktop] Auth session started, sessionId:", sessionId)

    return NextResponse.json({
      sandboxId: sandbox.id,
      sandboxUrl,
      sessionId,
    })
  } catch (error) {
    console.error("[ClaudeCode/Desktop] Failed to start auth:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to start authentication" },
      { status: 500 }
    )
  }
}
