import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { authenticateApiKey } from "../_lib/auth"
import { checkApiRateLimits } from "../_lib/rate-limit"
import { withApiErrorHandling } from "../_lib/errors"
import { type TaskResponse } from "../_lib/types"
import { hasAgentsAccess } from "@/lib/agents-access"
import { UsageService } from "@/server/api/routers/usage/services/usage.service"
import {
  getInstallationForRepo,
  type GitHubIntegration,
} from "@/lib/github"
import { createAgentSandbox } from "@/lib/agents/create-agent-sandbox"
import { type ClaudeCodeIntegration } from "@/lib/claude-code"
import { type LinearIntegration } from "@/lib/linear"
import {
  getInternalBaseUrl,
  getExternalBaseUrl,
} from "@/lib/webhooks/utils/urls"

export const maxDuration = 120

const CreateTaskSchema = z.object({
  repository: z
    .string()
    .min(1)
    .max(200)
    .regex(
      /^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/,
      "Must be in 'owner/repo' format with valid GitHub characters only",
    ),
  prompt: z.string().min(1).max(10_000),
  branch: z
    .string()
    .max(250)
    .regex(
      /^[a-zA-Z0-9._\-/]+$/,
      "Branch name contains invalid characters",
    )
    .optional(),
})

function formatTask(
  task: any,
  chat: any | null,
): TaskResponse {
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

// POST /api/v1/tasks — Create a new task
export const POST = withApiErrorHandling(async (req: Request) => {
  const auth = await authenticateApiKey(req)
  await checkApiRateLimits(auth.apiKeyId, auth.userId)

  // Parse and validate input
  let body: unknown
  try {
    body = await req.json()
  } catch {
    throw {
      status: 400,
      error: "invalid_json",
      message: "Request body must be valid JSON",
    }
  }
  const parsed = CreateTaskSchema.safeParse(body)
  if (!parsed.success) {
    throw {
      status: 400,
      error: "validation_error",
      message: parsed.error.issues.map((i) => i.message).join(", "),
    }
  }
  const { repository, prompt, branch } = parsed.data

  // Check agents access
  const access = await hasAgentsAccess(auth.userId)
  if (!access) {
    throw {
      status: 403,
      error: "no_agents_access",
      message: "Your plan does not include agents access",
    }
  }

  // Check usage/credits
  try {
    await UsageService.checkUsage(auth.userId)
  } catch (error) {
    if (error instanceof Error && error.message === "Usage limit exceeded") {
      throw {
        status: 403,
        error: "usage_limit_exceeded",
        message: "Usage limit exceeded",
      }
    }
    throw error
  }

  // Get team with integrations
  const team = await prisma.team.findUnique({
    where: { id: auth.teamId },
    select: {
      id: true,
      user_id: true,
      github_integration: true,
      claude_code_integration: true,
      linear_integration: true,
    },
  })

  if (!team) {
    throw {
      status: 404,
      error: "team_not_found",
      message: "Team not found",
    }
  }

  // Resolve installation ID
  const integration = team.github_integration as GitHubIntegration | null
  const installationId = getInstallationForRepo(integration, repository)
  if (!installationId) {
    throw {
      status: 400,
      error: "repo_not_found",
      message: `Repository '${repository}' is not accessible. Make sure the GitHub App is installed for this repository.`,
    }
  }

  // Create sandbox
  const claudeCodeIntegration =
    team.claude_code_integration as ClaudeCodeIntegration | null
  const linearIntegration =
    team.linear_integration as LinearIntegration | null

  const sandboxResult = await createAgentSandbox({
    userId: auth.userId,
    repository,
    installationId,
    branch,
    claudeCodeIntegration,
    linearIntegration,
  })

  const { sandboxId, sandboxUrl } = sandboxResult

  // Create AgentChat
  const subChatId = crypto.randomUUID()
  const chat = await prisma.agentChat.create({
    data: {
      name:
        prompt.length > 50 ? prompt.slice(0, 50) + "..." : prompt,
      user_id: auth.userId,
      team_id: auth.teamId,
      sandbox_id: sandboxId,
      credit_source: sandboxResult.usesClaudeCodeOAuth
        ? "claude_code"
        : "personal",
      meta: {
        source: "api",
        repository,
        branch: branch || null,
      },
    },
  })

  // Create AgentSubChat with initial message
  const initialMessage = {
    id: crypto.randomUUID(),
    role: "user" as const,
    parts: [{ type: "text" as const, text: prompt }],
  }

  await prisma.agentSubChat.create({
    data: {
      id: subChatId,
      chat_id: chat.id,
      name: "API Task",
      mode: "agent",
      messages: [initialMessage] as any,
    },
  })

  // Create IntegrationTask for tracking
  const task = await prisma.integrationTask.create({
    data: {
      chat_id: chat.id,
      team_id: auth.teamId,
      platform: "api",
      external_id: `api-${chat.id}`,
      external_title: prompt.length > 100 ? prompt.slice(0, 100) + "..." : prompt,
      status: "in_progress",
      metadata: {
        repository,
        branch: branch || null,
        prompt,
        api_key_id: auth.apiKeyId,
      },
    },
  })

  // Fire and forget agent execution
  const baseUrl = getInternalBaseUrl()
  fetch(`${baseUrl}/api/1code/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "sandbox-url": sandboxUrl,
      "parent-chat-id": chat.id,
      "sub-chat-name": "API Task",
      "sub-chat-mode": "agent",
      "x-internal-token": process.env.INTERNAL_API_SECRET || "",
      "x-user-id": auth.userId,
    },
    body: JSON.stringify({
      messages: [initialMessage],
      id: subChatId,
    }),
  }).catch((err) => {
    console.error("[API v1] Failed to trigger agent:", err)
  })

  return NextResponse.json(formatTask(task, chat), { status: 201 })
})

// GET /api/v1/tasks — List tasks
export const GET = withApiErrorHandling(async (req: Request) => {
  const auth = await authenticateApiKey(req)
  await checkApiRateLimits(auth.apiKeyId, auth.userId)

  const { searchParams } = new URL(req.url)
  const limit = Math.min(
    Math.max(parseInt(searchParams.get("limit") || "20"), 1),
    100,
  )
  const offset = Math.max(parseInt(searchParams.get("offset") || "0"), 0)
  const status = searchParams.get("status")
  const validStatuses = ["pending", "in_progress", "completed", "failed"]

  const where: any = {
    team_id: auth.teamId,
    platform: "api",
  }
  if (status && validStatuses.includes(status)) {
    where.status = status
  }

  const [tasks, total] = await Promise.all([
    prisma.integrationTask.findMany({
      where,
      orderBy: { created_at: "desc" },
      take: limit,
      skip: offset,
      include: { chat: true },
    }),
    prisma.integrationTask.count({ where }),
  ])

  return NextResponse.json({
    tasks: tasks.map((t) => formatTask(t, t.chat)),
    total,
    hasMore: offset + limit < total,
  })
})
