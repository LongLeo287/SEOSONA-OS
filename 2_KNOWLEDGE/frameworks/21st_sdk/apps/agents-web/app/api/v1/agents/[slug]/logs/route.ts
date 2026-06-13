import { NextResponse } from "next/server"
import { z } from "zod"
import { Prisma } from "@/prisma/client"
import { prisma } from "@/lib/prisma"
import { authenticateApiKey } from "../../../_lib/auth"
import { findApiAccessibleAgent, sandboxLogsWhere } from "../../../_lib/enterprise-agents"
import { withApiErrorHandling } from "../../../_lib/errors"

const LogsQuerySchema = z.object({
  status: z.enum(["active", "error"]).optional(),
  search: z.string().max(200).optional(),
  createdAfter: z.string().datetime().optional(),
  createdBefore: z.string().datetime().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().uuid().optional(),
})

function extractSlug(req: Request): string {
  const url = new URL(req.url)
  const match = url.pathname.match(/\/v1\/agents\/([^/]+)\/logs/)
  if (!match?.[1]) {
    throw { status: 400, error: "bad_request", message: "Missing agent slug" }
  }
  return decodeURIComponent(match[1])
}

export const GET = withApiErrorHandling(async (req: Request) => {
  const auth = await authenticateApiKey(req)
  const slug = extractSlug(req)

  const rawQuery = Object.fromEntries(new URL(req.url).searchParams.entries())
  const parsed = LogsQuerySchema.safeParse(rawQuery)
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

  const where: Prisma.AnSandboxWhereInput = sandboxLogsWhere(
    resolvedAgent.agent.id,
    auth.teamId,
    resolvedAgent.isShared,
  )

  if (parsed.data.status) {
    where.status = parsed.data.status
  }

  if (parsed.data.search) {
    where.OR = [
      { client_sandbox_id: { contains: parsed.data.search, mode: "insensitive" } },
      { sandbox_id: { contains: parsed.data.search, mode: "insensitive" } },
    ]
  }

  if (parsed.data.createdAfter || parsed.data.createdBefore) {
    where.created_at = {
      ...(parsed.data.createdAfter ? { gte: new Date(parsed.data.createdAfter) } : {}),
      ...(parsed.data.createdBefore ? { lte: new Date(parsed.data.createdBefore) } : {}),
    }
  }

  const sandboxes = await prisma.anSandbox.findMany({
    where,
    orderBy: { created_at: "desc" },
    take: parsed.data.limit + 1,
    ...(parsed.data.cursor ? { cursor: { id: parsed.data.cursor }, skip: 1 } : {}),
    include: {
      agent: {
        select: { id: true, name: true, slug: true },
      },
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
        orderBy: { created_at: "desc" },
      },
    },
  })

  const hasMore = sandboxes.length > parsed.data.limit
  if (hasMore) {
    sandboxes.pop()
  }

  return NextResponse.json({
    sandboxes,
    nextCursor: hasMore ? sandboxes[sandboxes.length - 1]?.id : undefined,
  })
})
