import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authenticateApiKey } from "../../_lib/auth"
import { checkApiRateLimits } from "../../_lib/rate-limit"
import { withApiErrorHandling } from "../../_lib/errors"
import { type TaskResponse } from "../../_lib/types"
import { getExternalBaseUrl } from "@/lib/webhooks/utils/urls"

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

export const GET = withApiErrorHandling(async (req: Request) => {
  const auth = await authenticateApiKey(req)
  await checkApiRateLimits(auth.apiKeyId, auth.userId)

  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q") || ""
  const status = searchParams.get("status")
  const limit = Math.min(
    Math.max(parseInt(searchParams.get("limit") || "20"), 1),
    100,
  )

  const validStatuses = ["pending", "in_progress", "completed", "failed"]

  const where: any = {
    team_id: auth.teamId,
    platform: "api",
  }
  if (q) {
    where.external_title = { contains: q, mode: "insensitive" }
  }
  if (status && validStatuses.includes(status)) {
    where.status = status
  }

  const tasks = await prisma.integrationTask.findMany({
    where,
    orderBy: { created_at: "desc" },
    take: limit,
    include: { chat: true },
  })

  return NextResponse.json({
    tasks: tasks.map((t) => formatTask(t, t.chat)),
    total: tasks.length,
  })
})
