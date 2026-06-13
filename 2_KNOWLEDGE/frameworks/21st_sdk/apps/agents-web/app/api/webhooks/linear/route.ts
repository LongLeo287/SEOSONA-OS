import { NextRequest, NextResponse, after } from "next/server"
import crypto from "crypto"
import { prisma } from "@/lib/prisma"
import type { LinearIntegration } from "@/lib/linear"
import type { GitHubIntegration } from "@/lib/github"
import type {
  LinearWebhookPayload,
  LinearIssueData,
  LinearCommentData,
} from "@/lib/webhooks/types"
import { addLinearComment, addLinearReaction } from "@/lib/webhooks/platforms/linear/responder"
import { getInstallationRepositories } from "@/lib/server/github/github-app-auth"
import {
  findMatchingAutomations,
  logAutomationExecution,
  type LinearEventData,
} from "@/lib/webhooks/handlers/automation-matcher"
import type { TriggerType } from "@/server/api/routers/automations/router"

// App-level webhook secret (configured in Linear app settings)
const LINEAR_WEBHOOK_SECRET = process.env.LINEAR_WEBHOOK_SECRET
import { getInternalBaseUrl, getExternalBaseUrl } from "@/lib/webhooks/utils/urls"

const INTERNAL_BASE_URL = getInternalBaseUrl()

// Bot mention pattern sources (used to create fresh regex instances)
// Order matters: longer patterns first to avoid partial matches
const BOT_MENTION_PATTERN_SOURCES = ["@1code-async\\b", "@1code\\b"]

function verifySignature(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac("sha256", secret)
  hmac.update(rawBody)
  const expectedSignature = hmac.digest("hex")
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

/**
 * Check if body contains @1code mention
 */
function hasBotMention(body: string): boolean {
  // Create fresh regex to avoid global regex state issues
  return BOT_MENTION_PATTERN_SOURCES.some((source) =>
    new RegExp(source, "i").test(body)
  )
}

/**
 * Extract prompt by removing @1code mentions
 */
function extractPrompt(body: string): string {
  let prompt = body
  // Use global flag for replace to remove all occurrences
  for (const source of BOT_MENTION_PATTERN_SOURCES) {
    prompt = prompt.replace(new RegExp(source, "gi"), "")
  }
  return prompt.trim()
}

/**
 * Check if userId belongs to our bot
 */
function isOurBot(
  userId: string,
  integration: LinearIntegration | null
): boolean {
  return integration?.linearUserId === userId
}

/**
 * Map Linear webhook to automation trigger type
 */
function mapLinearEventToTrigger(
  payload: LinearWebhookPayload
): TriggerType | null {
  const { type, action } = payload

  if (type === "Issue") {
    if (action === "create") return "linear_issue_created"
    if (action === "update") {
      // Check what was updated
      const updatedFrom = payload.updatedFrom as Record<string, unknown> | undefined
      if (updatedFrom) {
        if ("stateId" in updatedFrom) return "linear_issue_state_changed"
        if ("assigneeId" in updatedFrom) return "linear_issue_assigned"
        if ("labelIds" in updatedFrom) return "linear_label_added"
      }
      return "linear_issue_updated"
    }
  }

  if (type === "Comment" && action === "create") {
    return "linear_comment_created"
  }

  return null
}

/**
 * Build LinearEventData from webhook payload
 */
function buildLinearEventData(
  payload: LinearWebhookPayload,
  integration: LinearIntegration | null
): LinearEventData {
  const issueData = payload.data as LinearIssueData
  const commentData = payload.type === "Comment" ? (payload.data as LinearCommentData) : null

  return {
    platform: "linear",
    linearProjectId: issueData.project?.id,
    linearProjectName: issueData.project?.name,
    linearTeamId: issueData.team?.id,
    linearTeamName: issueData.team?.name,
    linearCreatorId: issueData.creator?.id || commentData?.user?.id,
    linearCreatorName: issueData.creator?.name || commentData?.user?.name,
    linearAssigneeId: issueData.assignee?.id,
    linearAssigneeName: issueData.assignee?.name,
    linearLabelIds: issueData.labels?.map((l: { id: string }) => l.id) || [],
    linearLabelNames: issueData.labels?.map((l: { name: string }) => l.name) || [],
    linearStateId: issueData.state?.id,
    linearStateName: issueData.state?.name,
    linearPriority: issueData.priority,
    isBot: isOurBot(issueData.creator?.id || commentData?.user?.id || "", integration),
  }
}

/**
 * Process automations for Linear event
 */
async function processLinearAutomations(
  teamId: string,
  triggerType: TriggerType,
  eventData: LinearEventData,
  issueData: LinearIssueData,
  team: {
    id: string
    user_id: string
    linear_integration: LinearIntegration
    github_integration: GitHubIntegration | null
  }
): Promise<void> {
  console.log(`[Linear Webhook DEBUG] processLinearAutomations called: teamId=${teamId}, triggerType=${triggerType}`)

  const matchedAutomations = await findMatchingAutomations(teamId, triggerType, eventData)

  console.log(`[Linear Webhook DEBUG] findMatchingAutomations returned ${matchedAutomations.length} matches`)
  matchedAutomations.forEach((m, i) => {
    console.log(`[Linear Webhook DEBUG] Match ${i}: automation="${m.automation.name}", trigger=${JSON.stringify(m.trigger)}`)
  })

  if (matchedAutomations.length === 0) {
    console.log(`[Linear Webhook] No automations matched for ${triggerType}`)
    return
  }

  console.log(`[Linear Webhook] Found ${matchedAutomations.length} matching automations`)

  for (const { automation } of matchedAutomations) {
    console.log(`[Linear Webhook DEBUG] Processing automation: ${automation.name}`)
    const targetRepo = automation.target_repository
    console.log(`[Linear Webhook DEBUG] Target repo: ${targetRepo || "NOT SET"}`)

    try {
      // If no target repo configured for this automation, skip
      if (!targetRepo) {
        console.log(`[Linear Webhook DEBUG] No target repo, skipping automation`)
        await logAutomationExecution(
          automation.id,
          issueData.id,
          issueData.url || null,
          "skipped",
          undefined,
          "No target repository configured for this automation"
        )
        continue
      }

      // Log execution as "pending" immediately so we have a record even if after() gets killed
      const executionId = await logAutomationExecution(
        automation.id,
        issueData.id,
        issueData.url || null,
        "pending"
      )

      // Fire-and-forget: start-agent is a separate serverless invocation that will
      // update the execution status to "success"/"failed" on completion
      console.log(`[Linear Webhook DEBUG] Firing /api/linear/start-agent with repo=${targetRepo}`)
      fetch(`${INTERNAL_BASE_URL}/api/linear/start-agent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-internal-token": process.env.INTERNAL_API_SECRET || "",
        },
        body: JSON.stringify({
          teamId,
          issueId: issueData.id,
          repository: targetRepo,
          prompt: automation.agent_prompt || undefined,
          isAutomation: true,
          addToInbox: automation.add_to_inbox,
          respondToTrigger: automation.respond_to_trigger,
          automationExecutionId: executionId,
          triggeredBy: {
            id: "automation",
            name: `Automation: ${automation.name}`,
          },
        }),
      }).catch((error) => {
        console.error(`[Linear Webhook] Failed to fire start-agent for automation ${automation.name}:`, error)
      })

      console.log(`[Linear Webhook] Fired agent for automation ${automation.name} (execution: ${executionId})`)
    } catch (error) {
      console.error(`[Linear Webhook] Failed to execute automation ${automation.name}:`, error)
      await logAutomationExecution(
        automation.id,
        issueData.id,
        issueData.url || null,
        "failed",
        undefined,
        error instanceof Error ? error.message : "Unknown error"
      )
    }
  }
}

/**
 * Fetch available repos from GitHub integration
 */
async function getAvailableRepos(
  githubIntegration: GitHubIntegration | null
): Promise<string[]> {
  if (!githubIntegration?.installations?.length) {
    return []
  }

  const allRepos: string[] = []

  for (const installation of githubIntegration.installations) {
    try {
      const result = await getInstallationRepositories(
        installation.installation_id,
        1,
        100
      )
      for (const repo of result.repositories) {
        allRepos.push(repo.full_name)
      }
    } catch (error) {
      console.error(
        `[Linear Webhook] Failed to fetch repos for installation ${installation.installation_id}:`,
        error
      )
    }
  }

  return allRepos
}


/**
 * Check if comment body is a repo selection reply (matches one of available repos)
 */
function parseRepoSelection(body: string, availableRepos: string[]): string | null {
  // Clean up: remove backticks, trim whitespace
  const cleaned = body.trim().replace(/`/g, "").trim()

  // Check exact match
  if (availableRepos.includes(cleaned)) {
    return cleaned
  }

  // Check case-insensitive match
  const lowerCleaned = cleaned.toLowerCase()
  for (const repo of availableRepos) {
    if (repo.toLowerCase() === lowerCleaned) {
      return repo
    }
  }

  // Check if it's just the repo name without org (e.g., "21st" instead of "21st-dev/21st")
  for (const repo of availableRepos) {
    const repoName = repo.split("/")[1]
    if (repoName && lowerCleaned === repoName.toLowerCase()) {
      return repo
    }
  }

  return null
}

/**
 * Handle @1code mention in comment
 */
async function handleLinearMention(
  commentData: LinearCommentData,
  team: {
    id: string
    user_id: string
    linear_integration: LinearIntegration
    github_integration: GitHubIntegration | null
  },
  integration: LinearIntegration
): Promise<NextResponse> {
  const prompt = extractPrompt(commentData.body)
  const issueId = commentData.issue.id

  // Check if we have a default repo configured
  const defaultRepo = integration.defaultRepository

  // If no default repo, prompt for selection via comment
  if (!defaultRepo) {
    const repos = await getAvailableRepos(team.github_integration)

    if (repos.length === 0) {
      await addLinearComment(
        team.id,
        issueId,
        `I'd love to help, but no GitHub repositories are connected.\n\n` +
          `Please connect GitHub first: ${getExternalBaseUrl()}/app`
      )
      return NextResponse.json({ ok: true, error: "no_github_repos" })
    }

    // Post repo selection comment as a reply to the user's mention
    const repoList = repos.map((r) => `\`${r}\``).join("\n")
    const result = await addLinearComment(
      team.id,
      issueId,
      `Which repository should I work with?\n\n` +
        `**Reply to this comment with one of these:**\n${repoList}`,
      commentData.id // Reply to user's @1code comment
    )

    // Store pending state with bot's comment ID
    await prisma.integrationTask.create({
      data: {
        team_id: team.id,
        platform: "linear",
        external_id: issueId,
        external_url: commentData.issue.url || "",
        external_title: commentData.issue.title || "Linear Issue",
        status: "pending_repo",
        metadata: {
          prompt,
          availableRepos: repos,
          botCommentId: result?.commentId, // Track bot's comment for reply detection
          triggeredBy: {
            id: commentData.user.id,
            name: commentData.user.name,
          },
        },
      },
    })

    return NextResponse.json({ ok: true, awaiting_repo: true })
  }

  // We have a default repo - start the agent
  return await startAgentForIssue(team.id, issueId, defaultRepo, prompt, {
    id: commentData.user.id,
    name: commentData.user.name,
  })
}

/**
 * Start agent for a Linear issue
 */
async function startAgentForIssue(
  teamId: string,
  issueId: string,
  repository: string,
  prompt: string | undefined,
  triggeredBy: { id: string; name: string }
): Promise<NextResponse> {
  try {
    const response = await fetch(`${INTERNAL_BASE_URL}/api/linear/start-agent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-token": process.env.INTERNAL_API_SECRET || "",
      },
      body: JSON.stringify({
        teamId,
        issueId,
        repository,
        prompt,
        triggeredBy,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to start agent: ${response.statusText}`)
    }

    return NextResponse.json({ ok: true, agent_started: true })
  } catch (error) {
    console.error("[Linear Webhook] Failed to start agent:", error)
    return NextResponse.json({ ok: true, error: "Failed to start agent" })
  }
}

/**
 * Handle repo selection reply
 * Uses atomic update to prevent race conditions from duplicate webhooks
 */
async function handleRepoSelectionReply(
  commentData: LinearCommentData,
  team: { id: string; user_id: string },
  pendingTask: {
    id: string
    metadata: {
      prompt?: string
      availableRepos: string[]
      botCommentId?: string
      triggeredBy: { id: string; name: string }
    }
  }
): Promise<NextResponse> {
  console.log(`[Linear Webhook] handleRepoSelectionReply called for task ${pendingTask.id}`)

  const selectedRepo = parseRepoSelection(
    commentData.body,
    pendingTask.metadata.availableRepos
  )

  if (!selectedRepo) {
    console.log(`[Linear Webhook] Invalid repo selection, ignoring`)
    return NextResponse.json({ ok: true, ignored: "invalid_repo_selection" })
  }

  console.log(`[Linear Webhook] Repo selected: ${selectedRepo}`)

  // Atomically claim the task - only update if status is still "pending_repo"
  // This prevents race conditions from duplicate webhooks
  const updateResult = await prisma.integrationTask.updateMany({
    where: {
      id: pendingTask.id,
      status: "pending_repo", // Only claim if still pending
    },
    data: { status: "in_progress" },
  })

  if (updateResult.count === 0) {
    // Another webhook already claimed this task
    console.log(`[Linear Webhook] Task ${pendingTask.id} already claimed by another webhook, skipping`)
    return NextResponse.json({ ok: true, ignored: "already_claimed" })
  }

  console.log(`[Linear Webhook] Task ${pendingTask.id} claimed successfully, starting agent`)

  // React to user's comment with 👍
  await addLinearReaction(team.id, commentData.id, "👍")

  // Start the agent
  return await startAgentForIssue(
    team.id,
    commentData.issue.id,
    selectedRepo,
    pendingTask.metadata.prompt,
    pendingTask.metadata.triggeredBy
  )
}

/**
 * Handle issue assignment to bot
 */
async function handleIssueAssignment(
  issueData: LinearIssueData,
  team: {
    id: string
    user_id: string
    linear_integration: LinearIntegration
    github_integration: GitHubIntegration | null
  },
  integration: LinearIntegration
): Promise<NextResponse> {
  // Check if we already have a task for this issue
  const existingTask = await prisma.integrationTask.findFirst({
    where: {
      platform: "linear",
      external_id: issueData.id,
      team_id: team.id,
    },
  })

  if (existingTask) {
    console.log(
      `[Linear Webhook] Task already exists for issue ${issueData.identifier}`
    )
    return NextResponse.json({ ok: true, existing: true })
  }

  // Check for default repo
  const defaultRepo = integration.defaultRepository

  if (!defaultRepo) {
    const repos = await getAvailableRepos(team.github_integration)

    if (repos.length === 0) {
      await addLinearComment(
        team.id,
        issueData.id,
        `Thanks for assigning this to me!\n\n` +
          `I need a GitHub repository to work with, but none are connected.\n` +
          `Please connect GitHub first: ${getExternalBaseUrl()}/app`
      )
      return NextResponse.json({ ok: true, error: "no_github_repos" })
    }

    // Post repo selection comment
    const repoList = repos.map((r) => `\`${r}\``).join("\n")
    const result = await addLinearComment(
      team.id,
      issueData.id,
      `Thanks for assigning this to me!\n\n` +
        `**Which repository should I work with?**\n\n` +
        `Reply to this comment with one of these:\n${repoList}`
    )

    // Store pending state with bot's comment ID
    await prisma.integrationTask.create({
      data: {
        team_id: team.id,
        platform: "linear",
        external_id: issueData.id,
        external_url: issueData.url || "",
        external_title: `[${issueData.identifier}] ${issueData.title}`,
        status: "pending_repo",
        metadata: {
          availableRepos: repos,
          botCommentId: result?.commentId,
          triggeredBy: {
            id: issueData.creator.id,
            name: issueData.creator.name,
          },
        },
      },
    })

    return NextResponse.json({ ok: true, awaiting_repo: true })
  }

  // Start agent with default repo
  return await startAgentForIssue(team.id, issueData.id, defaultRepo, undefined, {
    id: issueData.creator.id,
    name: issueData.creator.name,
  })
}

export async function POST(request: NextRequest) {
  try {
    // Get raw body and signature
    const rawBody = await request.text()
    const signature = request.headers.get("linear-signature")

    // Verify signature with global secret
    if (!LINEAR_WEBHOOK_SECRET) {
      console.error("[Linear Webhook] LINEAR_WEBHOOK_SECRET not configured")
      return NextResponse.json(
        { error: "Webhook not configured" },
        { status: 500 }
      )
    }

    if (
      !signature ||
      !verifySignature(rawBody, signature, LINEAR_WEBHOOK_SECRET)
    ) {
      console.error("[Linear Webhook] Invalid signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    // Parse payload
    const payload: LinearWebhookPayload = JSON.parse(rawBody)

    // Verify timestamp to prevent replay attacks (60 second window)
    if (
      payload.webhookTimestamp &&
      Math.abs(Date.now() - payload.webhookTimestamp) > 60_000
    ) {
      console.error("[Linear Webhook] Stale webhook")
      return NextResponse.json({ error: "Stale webhook" }, { status: 401 })
    }

    // Find ALL teams by workspaceId (for automations we need to check all teams)
    const allTeams = await prisma.team.findMany({
      where: {
        linear_integration: {
          path: ["workspaceId"],
          equals: payload.organizationId,
        },
      },
      select: {
        id: true,
        linear_integration: true,
        user_id: true,
        github_integration: true,
        claude_code_integration: true,
        created_at: true,
      },
      orderBy: { created_at: "desc" },
    })

    console.log(`[Linear Webhook] Found ${allTeams.length} team(s) for organizationId: ${payload.organizationId}`)

    if (allTeams.length === 0) {
      console.error(
        "[Linear Webhook] No team found for organizationId:",
        payload.organizationId
      )
      return NextResponse.json({ error: "Team not found" }, { status: 404 })
    }

    // Use most recently connected team for @1code mentions
    // (allTeams sorted by created_at desc, so [0] = newest)
    const team = allTeams[0]
    const teamId = team.id
    const integration = team.linear_integration as LinearIntegration | null

    console.log(
      `[Linear Webhook] Received ${payload.action} ${payload.type} for team ${teamId}`
    )

    // Handle Comment webhooks
    if (payload.type === "Comment" && payload.action === "create") {
      const commentData = payload.data as LinearCommentData
      console.log(`[Linear Webhook DEBUG] Comment body: "${commentData.body?.substring(0, 200)}", user: ${commentData.user?.name || "unknown"}, issue: ${commentData.issue?.identifier || "unknown"}`)

      // Ignore comments with no user (e.g. automated incident comments)
      if (!commentData.user) {
        console.log(`[Linear Webhook] Comment has no user, ignoring`)
        return NextResponse.json({ ok: true, ignored: "no_user" })
      }
      // Ignore our own comments (prevent loops)
      if (isOurBot(commentData.user.id, integration)) {
        return NextResponse.json({ ok: true, ignored: "bot_comment" })
      }

      // Check for @1code mention
      if (hasBotMention(commentData.body)) {
        return await handleLinearMention(
          commentData,
          {
            ...team,
            linear_integration: integration!,
            github_integration: team.github_integration as GitHubIntegration | null,
          },
          integration!
        )
      }

      // Check if there's a pending repo selection for this issue
      const pendingTask = await prisma.integrationTask.findFirst({
        where: {
          platform: "linear",
          external_id: commentData.issue.id,
          team_id: teamId,
          status: "pending_repo",
        },
      })

      if (pendingTask?.metadata) {
        const metadata = pendingTask.metadata as {
          prompt?: string
          availableRepos: string[]
          botCommentId?: string
          triggeredBy: { id: string; name: string }
        }

        // Accept any comment on the issue that looks like a repo selection
        return await handleRepoSelectionReply(
          commentData,
          { id: teamId, user_id: team.user_id },
          {
            id: pendingTask.id,
            metadata,
          }
        )
      }

      // No @mention and no pending repo — process comment automations for ALL teams
      const commentTriggerType = mapLinearEventToTrigger(payload)
      if (commentTriggerType) {
        const issueData = commentData.issue as LinearIssueData

        after(async () => {
          await Promise.all(
            allTeams.map(async (t) => {
              const teamIntegration = t.linear_integration as LinearIntegration | null
              if (!teamIntegration) return

              console.log(`[Linear Webhook DEBUG] Checking comment automations for team ${t.id}`)
              const eventData = buildLinearEventData(payload, teamIntegration)

              await processLinearAutomations(
                t.id,
                commentTriggerType,
                eventData,
                issueData,
                {
                  id: t.id,
                  user_id: t.user_id,
                  linear_integration: teamIntegration,
                  github_integration: t.github_integration as GitHubIntegration | null,
                }
              )
            })
          )
        })
      }

      return NextResponse.json({ ok: true, ignored: "no_mention" })
    }

    // Handle Issue webhooks
    if (payload.type === "Issue") {
      const issueData = payload.data as LinearIssueData
      console.log(`[Linear Webhook DEBUG] Issue event: action=${payload.action}, id=${issueData.id}, title="${issueData.title}"`)
      console.log(`[Linear Webhook DEBUG] Issue team: id=${issueData.team?.id}, name=${issueData.team?.name}`)

      // Check if assigned to our bot
      if (
        payload.action === "update" &&
        integration?.linearUserId &&
        issueData.assignee?.id === integration.linearUserId
      ) {
        return await handleIssueAssignment(
          issueData,
          {
            ...team,
            linear_integration: integration,
            github_integration: team.github_integration as GitHubIntegration | null,
          },
          integration
        )
      }

      // Process automations for Issue events - check ALL teams
      const triggerType = mapLinearEventToTrigger(payload)
      console.log(`[Linear Webhook DEBUG] Mapped trigger type: ${triggerType}`)

      if (triggerType) {
        // Schedule for background processing to avoid Linear webhook timeout (5s)
        after(async () => {
          // Process automations for ALL teams concurrently
          await Promise.all(
            allTeams.map(async (t) => {
              const teamIntegration = t.linear_integration as LinearIntegration | null
              if (!teamIntegration) {
                console.log(`[Linear Webhook DEBUG] Team ${t.id} has no linear integration, skipping`)
                return
              }

              console.log(`[Linear Webhook DEBUG] Checking automations for team ${t.id}`)
              const eventData = buildLinearEventData(payload, teamIntegration)

              await processLinearAutomations(
                t.id,
                triggerType,
                eventData,
                issueData,
                {
                  id: t.id,
                  user_id: t.user_id,
                  linear_integration: teamIntegration,
                  github_integration: t.github_integration as GitHubIntegration | null,
                }
              )
            })
          )
        })
      } else {
        console.log(`[Linear Webhook DEBUG] Skipping automations: triggerType=${triggerType}`)
      }
    }

    return NextResponse.json({ ok: true, ignored: true })
  } catch (error) {
    console.error("[Linear Webhook] Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
