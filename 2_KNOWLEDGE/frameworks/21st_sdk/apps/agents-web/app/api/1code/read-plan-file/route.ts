import { NextRequest, NextResponse } from "next/server"
import { getRestAuth } from "@/lib/rest-auth"
import { prisma } from "@/lib/prisma"
import { Sandbox } from "@e2b/code-interpreter"

export const maxDuration = 30

export async function GET(request: NextRequest) {
  try {
    const { userId } = await getRestAuth(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const chatId = searchParams.get("chatId")
    const planPath = searchParams.get("planPath")

    if (!chatId || !planPath) {
      return NextResponse.json(
        { error: "Missing chatId or planPath parameter" },
        { status: 400 }
      )
    }

    // Get chat to verify ownership and get sandbox ID
    const chat = await prisma.agentChat.findUnique({
      where: { id: chatId },
      select: { sandbox_id: true, user_id: true },
    })

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    if (chat.user_id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    if (!chat.sandbox_id) {
      return NextResponse.json(
        { error: "Sandbox not available" },
        { status: 404 }
      )
    }

    // Connect to e2b sandbox (auto-resumes if paused)
    const sandbox = await Sandbox.connect(chat.sandbox_id, {
      timeoutMs: 1_800_000, // 30 min
    })

    try {
      // Normalize path - ensure it starts with /home/user/repo
      let normalizedPath = planPath
      if (!normalizedPath.startsWith("/")) {
        normalizedPath = `/home/user/repo/${normalizedPath}`
      } else if (!normalizedPath.startsWith("/home/user/repo")) {
        normalizedPath = `/home/user/repo${normalizedPath}`
      }

      // Read plan file from sandbox
      const fileContent = await sandbox.files.read(normalizedPath)

      return NextResponse.json({ content: fileContent })
    } catch (error) {
      console.error("Error reading plan file:", error)
      return NextResponse.json(
        { error: "Failed to read plan file" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Error in read-plan-file API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
