import { NextRequest, NextResponse } from "next/server"
import { Sandbox } from "@e2b/code-interpreter"
import { auth } from "@clerk/nextjs/server"
import { verifyDesktopToken } from "@/lib/desktop-auth"

export const maxDuration = 30

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sandboxId: string }> },
) {
  try {
    // Check Clerk auth first, then fall back to desktop token
    let userId = (await auth()).userId
    if (!userId) {
      const desktopToken = request.headers.get("x-desktop-token")
      if (desktopToken) {
        userId = await verifyDesktopToken(desktopToken)
      }
    }
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { sandboxId } = await params
    const { searchParams } = new URL(request.url)
    const path = searchParams.get("path")

    if (!path) {
      return NextResponse.json(
        { error: "Missing path parameter" },
        { status: 400 },
      )
    }

    // Connect to e2b sandbox (auto-resumes if paused)
    const sbx = await Sandbox.connect(sandboxId, {
      timeoutMs: 1_800_000, // 30 min
    })

    // Normalize path - ensure it starts with /home/user/repo
    let normalizedPath = path
    if (!normalizedPath.startsWith("/")) {
      normalizedPath = `/home/user/repo/${normalizedPath}`
    } else if (!normalizedPath.startsWith("/home/user/repo")) {
      normalizedPath = `/home/user/repo${normalizedPath}`
    }

    // Read file
    const content = await sbx.files.read(normalizedPath)

    return NextResponse.json({ content })
  } catch (error) {
    console.error("[E2B-FILES] Error:", error)
    return NextResponse.json(
      {
        error: "Failed to read file",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
