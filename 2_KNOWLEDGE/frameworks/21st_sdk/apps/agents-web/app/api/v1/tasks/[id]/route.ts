import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { authenticateApiKey } from "../../_lib/auth"
import { checkApiRateLimits } from "../../_lib/rate-limit"
import { apiError } from "../../_lib/errors"
import { type TaskResponse } from "../../_lib/types"
import { getExternalBaseUrl, getInternalBaseUrl } from "@/lib/webhooks/utils/urls"

function formatTask(task: any, chat: any | null): TaskResponse {
  const meta = (chat?.meta as Record<string, any>) ?? {}
  return {
    id: task.id,
    chatId: task.chat_id,
    teamId: task.team_id,
    status: task.status,
    title: task.external_title || meta.repository || "",
    repository: meta.repository || "",
    branch: meta.branch || null,
    prUrl: task.pr_url,
    viewUrl: task.chat_id
      ? `${getExternalBaseUrl()}/app?chat=${task.chat_id}`
      : null,
    createdAt: task.created_at?.toISOString?.() ?? task.created_at,
    updatedAt: task.updated_at?.toISOString?.() ?? task.updated_at,
  }
}

const SendMessageSchema = z.object({
  prompt: z.string().min(1).max(10_000),
})

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await authenticateApiKey(req)
    await checkApiRateLimits(auth.apiKeyId, auth.userId)

    const { id } = await params

    const task = await prisma.integrationTask.findUnique({
      where: { id },
      include: { chat: true },
    })

    if (!task || task.team_id !== auth.teamId) {
      return apiError(404, "task_not_found", "Task not found")
    }

    return NextResponse.json(formatTask(task, task.chat))
  } catch (err: any) {
    if (err?.status && err?.error) {
      return apiError(err.status, err.error, err.message, err.headers)
    }
    console.error("[API v1] Unexpected error:", err)
    return apiError(500, "internal_error", "An unexpected error occurred")
  }
}

// POST /api/v1/tasks/:id — Send a follow-up message to an existing task
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await authenticateApiKey(req)
    await checkApiRateLimits(auth.apiKeyId, auth.userId)

    const { id } = await params

    // Parse body
    let body: unknown
    try {
      body = await req.json()
    } catch {
      return apiError(400, "invalid_json", "Request body must be valid JSON")
    }
    const parsed = SendMessageSchema.safeParse(body)
    if (!parsed.success) {
      return apiError(
        400,
        "validation_error",
        parsed.error.issues.map((i) => i.message).join(", "),
      )
    }
    const { prompt } = parsed.data

    // Find task + chat
    const task = await prisma.integrationTask.findUnique({
      where: { id },
      include: {
        chat: {
          include: {
            subChats: {
              where: { deleted_at: null },
              orderBy: { created_at: "desc" },
              take: 1,
            },
          },
        },
      },
    })

    if (!task || task.team_id !== auth.teamId) {
      return apiError(404, "task_not_found", "Task not found")
    }

    if (!task.chat) {
      return apiError(400, "no_chat", "Task has no associated chat")
    }

    const sandboxId = task.chat.sandbox_id
    if (!sandboxId) {
      return apiError(400, "no_sandbox", "Task has no sandbox")
    }

    const subChat = task.chat.subChats[0]
    if (!subChat) {
      return apiError(400, "no_subchat", "Task has no sub-chat")
    }

    // Build messages: existing + new user message
    const existingMessages = (subChat.messages as any[]) || []
    const newMessage = {
      id: crypto.randomUUID(),
      role: "user" as const,
      parts: [{ type: "text" as const, text: prompt }],
    }
    const allMessages = [...existingMessages, newMessage]

    // Update task status back to in_progress
    await prisma.integrationTask.update({
      where: { id: task.id },
      data: { status: "in_progress" },
    })

    // Fire agent with all messages
    const sandboxUrl = `https://3003-${sandboxId}.e2b.app`
    const baseUrl = getInternalBaseUrl()

    fetch(`${baseUrl}/api/1code/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "sandbox-url": sandboxUrl,
        "parent-chat-id": task.chat.id,
        "sub-chat-name": subChat.name,
        "sub-chat-mode": subChat.mode,
        "x-internal-token": process.env.INTERNAL_API_SECRET || "",
        "x-user-id": auth.userId,
      },
      body: JSON.stringify({
        messages: allMessages,
        id: subChat.id,
      }),
    }).catch((err) => {
      console.error("[API v1] Failed to trigger agent continuation:", err)
    })

    return NextResponse.json(formatTask(
      { ...task, status: "in_progress" },
      task.chat,
    ))
  } catch (err: any) {
    if (err?.status && err?.error) {
      return apiError(err.status, err.error, err.message, err.headers)
    }
    console.error("[API v1] Unexpected error:", err)
    return apiError(500, "internal_error", "An unexpected error occurred")
  }
}
