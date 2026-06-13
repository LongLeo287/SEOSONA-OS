import { NextRequest, NextResponse } from "next/server"
import { getRestAuth } from "@/lib/rest-auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await getRestAuth(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: chatId } = await params

    // Get optional subChatId filter from query params
    const { searchParams } = new URL(request.url)
    const subChatId = searchParams.get("subChatId")

    console.log(`[CHAT-EXPORT] Request: chatId=${chatId}, subChatId=${subChatId || "all"}`)

    // Get chat with sub-chats (filtered by subChatId if provided)
    const chat = await prisma.agentChat.findUnique({
      where: { id: chatId, deleted_at: null },
      include: {
        subChats: {
          where: {
            deleted_at: null,
            ...(subChatId && { id: subChatId }),
          },
          orderBy: { created_at: "asc" },
          select: {
            id: true,
            name: true,
            mode: true,
            messages: true,
            created_at: true,
            updated_at: true,
          },
        },
      },
    })

    if (!chat) {
      console.log(`[CHAT-EXPORT] Chat not found: ${chatId}`)
      return NextResponse.json({ error: "Chat not found" }, { status: 404 })
    }

    // Verify user has access to this chat (owner, team owner, or team member)
    if (chat.user_id !== userId) {
      const team = await prisma.team.findUnique({
        where: { id: chat.team_id },
        select: { user_id: true },
      })
      const isTeamOwner = team?.user_id === userId
      const isTeamMember = await prisma.teamMember.findFirst({
        where: { team_id: chat.team_id, user_id: userId },
      })

      if (!isTeamOwner && !isTeamMember) {
        console.log(`[CHAT-EXPORT] Forbidden: chat.user_id=${chat.user_id}, userId=${userId}, team_id=${chat.team_id}`)
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    }

    console.log(`[CHAT-EXPORT] Exporting chat ${chatId} (subChatId filter: ${subChatId || "all"}):`, {
      name: chat.name,
      subChatsCount: chat.subChats.length,
      subChats: chat.subChats.map((sc) => ({
        id: sc.id,
        name: sc.name,
        mode: sc.mode,
        messagesType: typeof sc.messages,
        messagesIsArray: Array.isArray(sc.messages),
        messagesLength: Array.isArray(sc.messages) ? sc.messages.length : 'N/A',
        messagesPreview: JSON.stringify(sc.messages)?.slice(0, 200),
      })),
    })
    console.log(`[CHAT-EXPORT] Found ${chat.subChats.length} subchat(s) to export`)

    return NextResponse.json({
      id: chat.id,
      name: chat.name,
      sandboxId: chat.sandbox_id,
      meta: chat.meta,
      createdAt: chat.created_at,
      updatedAt: chat.updated_at,
      subChats: chat.subChats.map((sc) => ({
        id: sc.id,
        name: sc.name,
        mode: sc.mode,
        messages: sc.messages,
        createdAt: sc.created_at,
        updatedAt: sc.updated_at,
      })),
    })
  } catch (error) {
    console.error("[CHAT-EXPORT] Error:", error)
    return NextResponse.json(
      {
        error: "Failed to export chat",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
