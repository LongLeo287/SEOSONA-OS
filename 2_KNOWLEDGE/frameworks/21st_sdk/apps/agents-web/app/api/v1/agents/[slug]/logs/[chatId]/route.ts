import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { authenticateApiKey } from "../../../../_lib/auth"
import { findApiAccessibleAgent, sandboxLogsWhere } from "../../../../_lib/enterprise-agents"
import { withApiErrorHandling } from "../../../../_lib/errors"

const ChatLogsQuerySchema = z.object({
  threadId: z.string().uuid().optional(),
})

function extractParams(req: Request): { slug: string; chatId: string } {
  const url = new URL(req.url)
  const match = url.pathname.match(/\/v1\/agents\/([^/]+)\/logs\/([^/]+)$/)
  if (!match?.[1] || !match?.[2]) {
    throw { status: 400, error: "bad_request", message: "Missing agent slug or chat id" }
  }

  return {
    slug: decodeURIComponent(match[1]),
    chatId: decodeURIComponent(match[2]),
  }
}

export const GET = withApiErrorHandling(async (req: Request) => {
  const auth = await authenticateApiKey(req)
  const { slug, chatId } = extractParams(req)
  const rawQuery = Object.fromEntries(new URL(req.url).searchParams.entries())
  const parsed = ChatLogsQuerySchema.safeParse(rawQuery)
  if (!parsed.success) {
    throw {
      status: 400,
      error: "validation_error",
      message: parsed.error.issues.map((issue) => issue.message).join(", "),
    }
  }

  const resolvedAgent = await findApiAccessibleAgent(auth.teamId, slug)
  if (!resolvedAgent?.agent) {
    throw { status: 404, error: "not_found", message: `Agent "${slug}" not found` }
  }
  const sandboxWhere = sandboxLogsWhere(
    resolvedAgent.agent.id,
    auth.teamId,
    resolvedAgent.isShared,
  )

  if (!parsed.data.threadId) {
    const sandbox = await prisma.anSandbox.findFirst({
      where: {
        ...sandboxWhere,
        client_sandbox_id: chatId,
      },
      select: {
        id: true,
        client_sandbox_id: true,
        sandbox_id: true,
        status: true,
        error: true,
        created_at: true,
        updated_at: true,
        agent: { select: { id: true, name: true, slug: true } },
        threads: {
          select: {
            id: true,
            status: true,
            stream_id: true,
            claude_session_id: true,
            input_tokens: true,
            output_tokens: true,
            total_tokens: true,
            total_cost_usd: true,
            duration_ms: true,
            created_at: true,
            completed_at: true,
            error: true,
          },
          orderBy: { created_at: "asc" },
        },
      },
    })

    if (!sandbox) {
      throw { status: 404, error: "not_found", message: `Chat "${chatId}" not found` }
    }

    return NextResponse.json({ sandbox })
  }

  const sandbox = await prisma.anSandbox.findFirst({
    where: {
      ...sandboxWhere,
      client_sandbox_id: chatId,
    },
    select: {
      id: true,
      client_sandbox_id: true,
      sandbox_id: true,
      status: true,
      error: true,
      created_at: true,
      updated_at: true,
      agent: { select: { id: true, name: true, slug: true } },
    },
  })

  if (!sandbox) {
    throw { status: 404, error: "not_found", message: `Chat "${chatId}" not found` }
  }

  const thread = await prisma.anThread.findFirst({
    where: {
      id: parsed.data.threadId,
      sandbox_id: sandbox.id,
    },
    select: {
      id: true,
      status: true,
      stream_id: true,
      claude_session_id: true,
      input_tokens: true,
      output_tokens: true,
      total_tokens: true,
      total_cost_usd: true,
      duration_ms: true,
      created_at: true,
      completed_at: true,
      error: true,
      messages: true,
    },
  })

  if (!thread) {
    throw {
      status: 404,
      error: "not_found",
      message: `Thread "${parsed.data.threadId}" not found in chat "${chatId}"`,
    }
  }

  return NextResponse.json({ sandbox, thread })
})
