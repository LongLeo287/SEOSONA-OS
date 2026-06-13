import { NextRequest, NextResponse } from "next/server"

export const maxDuration = 300 // 5 minutes
import { createHmac } from "crypto"
import { prisma } from "@/lib/prisma"
import { refreshFileTreeByRepository } from "@/lib/server/github/github-file-tree.service"
import { clearInstallationTokenCache } from "@/lib/server/github/github-app-auth"
import {
  addGitHubComment,
  addCommentReaction,
} from "@/lib/webhooks/platforms/github/responder"
import {
  checkUserRepoPermission,
  hasWriteAccess,
} from "@/lib/server/github/github-permissions"
import {
  fetchIssueContext,
  formatContextForAgent,
  buildAutomationContext,
  formatAutomationPrompt,
  type TriggerType as ContextTriggerType,
} from "@/lib/server/github/github-context"
import type { GitHubIntegration, GitHubInstallation } from "@/lib/github"
import { createAgentSandbox } from "@/lib/agents/create-agent-sandbox"
import type { ClaudeCodeIntegration } from "@/lib/claude-code"
import type { LinearIntegration } from "@/lib/linear"
import {
  findMatchingAutomations,
  logAutomationExecution,
  type GitHubEventData,
} from "@/lib/webhooks/handlers/automation-matcher"
import type { TriggerType } from "@/server/api/routers/automations/router"
import { getInternalBaseUrl, getExternalBaseUrl, getChatUrl, POWERED_BY_FOOTER } from "@/lib/webhooks/utils/urls"

const WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET

// Bot mention patterns - case insensitive
const BOT_MENTION_PATTERNS = [
  /@1code\b/i,
  /@1Code\b/i,
  /@1code-async\b/i,
]

// Check if a username is one of our bots
function isOurBot(username: string, userType?: string): boolean {
  if (userType === "Bot") return true
  const lower = username.toLowerCase()
  return lower.includes("1code")
}

// Simple in-memory rate limiting
const lastProcessed = new Map<string, number>()
const RATE_LIMIT_MS = 60_000 // 1 minute between refreshes per repo

interface GitHubPushPayload {
  ref?: string
  before?: string
  after?: string
  forced?: boolean
  compare?: string
  repository?: {
    full_name: string
    owner: { login: string }
    name: string
    default_branch: string
  }
  installation?: {
    id: number
  }
  sender?: {
    login: string
    id: number
  }
  pusher?: {
    name: string
  }
  commits?: Array<{
    id: string
    message: string
    timestamp: string
    url: string
    author: {
      name: string
      username?: string
    }
  }>
}

interface GitHubInstallationPayload {
  action:
    | "created"
    | "deleted"
    | "suspend"
    | "unsuspend"
    | "new_permissions_accepted"
  installation: {
    id: number
    account: {
      login: string
      type: string
      avatar_url?: string
    }
  }
  repositories?: Array<{ full_name: string }>
}

interface GitHubInstallationRepositoriesPayload {
  action: "added" | "removed"
  installation: {
    id: number
  }
  repositories_added?: Array<{ full_name: string }>
  repositories_removed?: Array<{ full_name: string }>
}

interface GitHubIssueCommentPayload {
  action: "created" | "edited" | "deleted"
  comment: {
    id: number
    body: string
    user: {
      login: string
      id: number
      type: string // "User" | "Bot"
    }
    html_url: string
  }
  issue: {
    number: number
    title: string
    body: string | null
    html_url: string
    pull_request?: { url: string } // Present if this is a PR
    user?: {
      login: string
      id: number
      type?: string
    }
  }
  repository: {
    full_name: string
    owner: { login: string }
    name: string
    default_branch: string
  }
  installation?: {
    id: number
  }
  sender: {
    login: string
    id: number
  }
}

interface GitHubPullRequestPayload {
  action: "opened" | "closed" | "reopened" | "edited" | "synchronize" | string
  number: number
  pull_request: {
    number: number
    title: string
    body: string | null
    html_url: string
    head: {
      ref: string // branch name
      sha: string
    }
    base: {
      ref: string
    }
    draft: boolean
    merged: boolean
    merged_by?: {
      login: string
      id: number
    }
    labels: Array<{ name: string }>
    user: {
      login: string
      id: number
      type?: string // "User" | "Bot"
    }
  }
  repository: {
    full_name: string
    owner: { login: string }
    name: string
    default_branch: string
  }
  installation?: {
    id: number
  }
  sender: {
    login: string
    id: number
  }
}

interface GitHubIssuesPayload {
  action: "opened" | "closed" | "reopened" | "edited" | string
  issue: {
    number: number
    title: string
    body: string | null
    html_url: string
    labels: Array<{ name: string }>
    user: {
      login: string
      id: number
      type?: string // "User" | "Bot"
    }
  }
  repository: {
    full_name: string
    owner: { login: string }
    name: string
    default_branch: string
  }
  installation?: {
    id: number
  }
  sender: {
    login: string
    id: number
  }
}

interface GitHubCreatePayload {
  ref: string // branch or tag name
  ref_type: "branch" | "tag"
  repository: {
    full_name: string
    owner: { login: string }
    name: string
    default_branch: string
  }
  installation?: {
    id: number
  }
  sender: {
    login: string
    id: number
  }
}

interface GitHubWorkflowRunPayload {
  action: "completed" | "requested" | string
  workflow_run: {
    id: number
    name: string
    conclusion: "success" | "failure" | "cancelled" | "skipped" | string | null
    html_url: string
    head_branch: string
    head_sha: string
  }
  repository: {
    full_name: string
    owner: { login: string }
    name: string
    default_branch: string
  }
  installation?: {
    id: number
  }
  sender: {
    login: string
    id: number
  }
}

function verifySignature(payload: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) {
    console.error("❌ [Webhook] GITHUB_WEBHOOK_SECRET not configured")
    return false
  }

  const hmac = createHmac("sha256", WEBHOOK_SECRET)
  hmac.update(payload)
  const expectedSignature = `sha256=${hmac.digest("hex")}`

  return expectedSignature === signature
}

/**
 * Handle installation deleted - remove from installations[] array
 * Also handles legacy installation_id/installation_ids fields
 */
async function handleInstallationDeleted(installationId: number) {
  console.log(
    `🗑️ [Webhook] Installation ${installationId} deleted, updating integrations`,
  )

  const installationIdStr = String(installationId)

  // Clear token cache first
  clearInstallationTokenCache(installationId)

  // Find all teams that might have this installation_id
  // NOTE: string_contains may return false positives (e.g., "123" matches "12345")
  // This is intentional for broad search - exact matching happens in the loop below
  // where we verify hasInInstallations/hasInLegacy/hasAsPrimary before any updates
  const teams = await prisma.team.findMany({
    where: {
      github_integration: {
        string_contains: installationIdStr,
      },
    },
    select: { id: true, github_integration: true },
  })

  let teamsCleared = 0
  let teamsUpdated = 0

  for (const team of teams) {
    const integration = team.github_integration as GitHubIntegration | null
    if (!integration) continue

    // Check if team actually has this exact installation (avoid false positives from string_contains)
    const currentInstallations: GitHubInstallation[] =
      integration.installations || []
    const legacyIds: string[] = integration.installation_ids || []

    const hasInInstallations = currentInstallations.some(
      (inst) => inst.installation_id === installationIdStr,
    )
    const hasInLegacy = legacyIds.includes(installationIdStr)
    const hasAsPrimary = integration.installation_id === installationIdStr

    // Skip if team doesn't actually have this installation
    if (!hasInInstallations && !hasInLegacy && !hasAsPrimary) continue

    // Filter out the deleted installation
    const remainingInstallations = currentInstallations.filter(
      (inst) => inst.installation_id !== installationIdStr,
    )
    const remainingLegacyIds = legacyIds.filter(
      (id) => id !== installationIdStr,
    )

    // Check if no installations remain
    const noInstallationsLeft =
      remainingInstallations.length === 0 && remainingLegacyIds.length === 0

    if (noInstallationsLeft) {
      // Clear entire integration - use null to indicate no integration
      await prisma.team.update({
        where: { id: team.id },
        data: {
          github_integration: null as any,
          github_installation_id: null,
          github_sandbox_id: null as any,
          github_sandbox_preview_token: null as any,
          github_sandbox_env_vars: null as any,
          github_sandbox_config: null as any,
          updated_at: new Date(),
        },
      })
      teamsCleared++
      console.log(`🗑️ [Webhook] Cleared entire integration for team ${team.id}`)
    } else {
      // Update with remaining installations
      const updatedIntegration: Partial<GitHubIntegration> = {
        ...integration,
        installations: remainingInstallations,
        // Update legacy fields for backward compatibility
        installation_ids: remainingLegacyIds,
        installation_id:
          integration.installation_id === installationIdStr
            ? remainingLegacyIds[0] ||
              remainingInstallations[0]?.installation_id
            : integration.installation_id,
      }

      await prisma.team.update({
        where: { id: team.id },
        data: {
          github_integration: updatedIntegration as object,
          github_installation_id: remainingInstallations[0]?.installation_id || null,
          updated_at: new Date(),
        },
      })
      teamsUpdated++
      console.log(
        `✏️ [Webhook] Removed installation ${installationId} from team ${team.id}`,
      )
    }
  }

  console.log(
    `✅ [Webhook] Teams: ${teamsCleared} cleared, ${teamsUpdated} updated`,
  )

  // Remove from users' github_installations
  const users = await prisma.user.findMany({
    where: {
      github_installations: {
        string_contains: installationIdStr,
      },
    },
    select: { id: true, github_installations: true },
  })

  let usersUpdated = 0
  for (const user of users) {
    const userInstallations =
      (
        user.github_installations as {
          installations: GitHubInstallation[]
        } | null
      )?.installations || []
    const filteredInstallations = userInstallations.filter(
      (inst) => inst.installation_id !== installationIdStr,
    )

    if (filteredInstallations.length !== userInstallations.length) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          github_installations: {
            installations: filteredInstallations,
          } as object,
          updated_at: new Date(),
        },
      })
      usersUpdated++
    }
  }

  if (usersUpdated > 0) {
    console.log(`✅ [Webhook] Removed from ${usersUpdated} users`)
  }

  // Clear installation_id from sandbox records (legacy field)
  const sandboxResult = await prisma.teamRepositorySandbox.updateMany({
    where: { installation_id: installationIdStr },
    data: { installation_id: null, updated_at: new Date() },
  })

  if (sandboxResult.count > 0) {
    console.log(`✅ [Webhook] Cleared ${sandboxResult.count} sandbox records`)
  }

  return {
    teamsCleared,
    teamsUpdated,
    usersUpdated,
    sandboxesCleared: sandboxResult.count,
  }
}

/**
 * Handle installation created - update installations[] array for REINSTALLS
 *
 * This handles the case where a user uninstalls and reinstalls the GitHub App
 * on the same org. It finds teams that already have an installation for this
 * login and updates them with the new installation_id.
 *
 * NOTE: This does NOT handle first-time connections. First-time connections
 * go through the callback route (/api/github/app/callback) which has the
 * teamId context from the OAuth state parameter. The webhook has no way to
 * know which team should receive a brand new installation.
 */
async function handleInstallationCreated(
  installationId: number,
  accountLogin: string,
  accountType: string,
  accountAvatarUrl?: string,
) {
  console.log(
    `🆕 [Webhook] Installation ${installationId} created for ${accountLogin}`,
  )

  const installationIdStr = String(installationId)

  // Find teams that might have this login in their GitHub integration
  // NOTE: string_contains may return false positives (e.g., "dev" matches "21st-dev")
  // Exact matching via hasThisLogin check happens in the loop before any updates
  const teams = await prisma.team.findMany({
    where: {
      github_integration: {
        string_contains: accountLogin,
      },
    },
    select: { id: true, github_integration: true },
  })

  let teamsUpdated = 0

  for (const team of teams) {
    const integration = team.github_integration as GitHubIntegration | null
    if (!integration) continue

    // Get current installations or create empty array
    const currentInstallations: GitHubInstallation[] =
      integration.installations || []

    // Check if this installation already exists
    const exists = currentInstallations.some(
      (inst) => inst.installation_id === installationIdStr,
    )
    if (exists) continue

    // Only update if team actually has this login (avoid false positives from string_contains)
    // This handles reinstalls where the old installation needs to be replaced
    const hasThisLogin = currentInstallations.some(
      (inst) => inst.login === accountLogin,
    )
    if (!hasThisLogin) continue

    // Replace old installation for this login with the new one
    const updatedInstallations = currentInstallations.filter(
      (inst) => inst.login !== accountLogin,
    )

    // Add the new installation
    const newInstallation: GitHubInstallation = {
      installation_id: installationIdStr,
      login: accountLogin,
      avatar_url: accountAvatarUrl || null,
      type: accountType === "Organization" ? "Organization" : "User",
    }
    updatedInstallations.push(newInstallation)

    // Update team with new installation
    const updatedIntegration: Partial<GitHubIntegration> = {
      ...integration,
      installations: updatedInstallations,
      // Also update legacy fields
      installation_id: installationIdStr,
      installation_ids: updatedInstallations.map(
        (inst) => inst.installation_id,
      ),
    }

    await prisma.team.update({
      where: { id: team.id },
      data: {
        github_integration: updatedIntegration as object,
        github_installation_id: installationIdStr,
        updated_at: new Date(),
      },
    })
    teamsUpdated++
  }

  if (teamsUpdated > 0) {
    console.log(
      `✅ [Webhook] Updated ${teamsUpdated} teams with new installation for ${accountLogin}`,
    )
  }

  return { teamsUpdated }
}

/**
 * Handle repositories removed from installation
 */
async function handleRepositoriesRemoved(
  installationId: number,
  removedRepos: string[],
) {
  console.log(
    `🗑️ [Webhook] Repositories removed from installation ${installationId}:`,
    removedRepos,
  )

  // Find teams with this installation_id and one of the removed repos
  for (const repoFullName of removedRepos) {
    const teams = await prisma.team.findMany({
      where: {
        AND: [
          {
            github_integration: {
              path: ["installation_id"],
              equals: String(installationId),
            },
          },
          {
            github_integration: {
              path: ["configuration", "repository"],
              equals: repoFullName,
            },
          },
        ],
      },
      select: { id: true, github_integration: true },
    })

    if (teams.length > 0) {
      console.log(
        `⚠️ [Webhook] Repository ${repoFullName} removed, clearing config for ${teams.length} teams`,
      )

      // Clear only the configuration (keep installation_id for reconnection)
      for (const team of teams) {
        const integration = team.github_integration as Record<string, any>
        await prisma.team.update({
          where: { id: team.id },
          data: {
            github_integration: {
              ...integration,
              configuration: undefined,
              fileTree: undefined,
            } as any,
            github_sandbox_id: null as any,
            github_sandbox_preview_token: null as any,
            github_sandbox_env_vars: null as any,
            github_sandbox_config: null as any,
            updated_at: new Date(),
          },
        })
      }
    }
  }
}

/**
 * Check if comment mentions our bot
 */
function hasBotMention(body: string): boolean {
  return BOT_MENTION_PATTERNS.some((pattern) => pattern.test(body))
}

/**
 * Extract the command/prompt after the @1code mention
 */
function extractPrompt(body: string): string {
  // Remove the mention and get the rest
  let prompt = body
  for (const pattern of BOT_MENTION_PATTERNS) {
    prompt = prompt.replace(pattern, "")
  }
  return prompt.trim()
}

interface TeamWithIntegrations {
  id: string
  name: string
  user_id: string
  claude_code_integration: ClaudeCodeIntegration | null
  linear_integration: LinearIntegration | null
}

/**
 * Find team by GitHub installation ID, prioritizing the sender's team.
 *
 * When multiple teams share the same installation ID (multiple users from
 * the same org connected the GitHub App), we match sender.login against
 * team.github_integration.github_user.login to find the correct team.
 */
async function findTeamByInstallation(
  installationId: number,
  senderLogin?: string
): Promise<TeamWithIntegrations | null> {
  const installationIdStr = String(installationId)

  // ⚠️⚠️⚠️ DELETE BEFORE PUSHING TO PROD ⚠️⚠️⚠️
  // DEV ONLY: Override team matching for local testing with prod DB
  const DEV_TEAM_OVERRIDE = process.env.NODE_ENV === "development"
    ? "fece3143-8b7b-4113-b2ce-2d3401b9f8b5" // Your dev team ID
    : null

  if (DEV_TEAM_OVERRIDE) {
    console.log(`🚨🚨🚨 [Webhook] DEV MODE: Overriding team to ${DEV_TEAM_OVERRIDE} 🚨🚨🚨`)
    const team = await prisma.team.findUnique({
      where: { id: DEV_TEAM_OVERRIDE },
      select: {
        id: true,
        name: true,
        user_id: true,
        claude_code_integration: true,
        linear_integration: true,
      },
    })
    if (team) {
      return {
        id: team.id,
        name: team.name,
        user_id: team.user_id,
        claude_code_integration: team.claude_code_integration as ClaudeCodeIntegration | null,
        linear_integration: team.linear_integration as LinearIntegration | null,
      }
    }
  }
  // ⚠️⚠️⚠️ END DELETE BEFORE PUSHING TO PROD ⚠️⚠️⚠️

  console.log(`🔍 [Webhook] Looking for team with installation ${installationIdStr}, sender: ${senderLogin || 'unknown'}`)

  const teams = await prisma.team.findMany({
    where: {
      github_installation_id: installationIdStr,
    },
    select: {
      id: true,
      name: true,
      user_id: true,
      github_integration: true,
      claude_code_integration: true,
      linear_integration: true,
    },
  })

  console.log(`🔍 [Webhook] Found ${teams.length} team(s) with installation ${installationIdStr}`)

  if (teams.length === 0) {
    return null
  }

  // Try to match sender's GitHub username to find the correct team
  if (senderLogin && teams.length > 1) {
    for (const team of teams) {
      const integration = team.github_integration as GitHubIntegration | null
      const connectedByLogin = integration?.github_user?.login

      if (connectedByLogin?.toLowerCase() === senderLogin.toLowerCase()) {
        console.log(`🔍 [Webhook] Matched sender ${senderLogin} to team ${team.id} (${team.name})`)
        return {
          id: team.id,
          name: team.name,
          user_id: team.user_id,
          claude_code_integration: team.claude_code_integration as ClaudeCodeIntegration | null,
          linear_integration: team.linear_integration as LinearIntegration | null,
        }
      }
    }
    console.log(`⚠️ [Webhook] No team matched sender ${senderLogin}, using first team`)
  }

  const team = teams[0]
  console.log(`🔍 [Webhook] Using team: ${team.id} (${team.name})`)

  return {
    id: team.id,
    name: team.name,
    user_id: team.user_id,
    claude_code_integration: team.claude_code_integration as ClaudeCodeIntegration | null,
    linear_integration: team.linear_integration as LinearIntegration | null,
  }
}

/**
 * Find ALL teams by GitHub installation ID.
 * Used for automations where we need to check all teams, not just one.
 */
async function findAllTeamsByInstallation(
  installationId: number
): Promise<TeamWithIntegrations[]> {
  const installationIdStr = String(installationId)

  console.log(`🔍 [Webhook] Finding ALL teams with installation ${installationIdStr}`)

  const teams = await prisma.team.findMany({
    where: {
      github_installation_id: installationIdStr,
    },
    select: {
      id: true,
      name: true,
      user_id: true,
      claude_code_integration: true,
      linear_integration: true,
    },
  })

  console.log(`🔍 [Webhook] Found ${teams.length} team(s) with installation ${installationIdStr}`)

  return teams.map((team) => ({
    id: team.id,
    name: team.name,
    user_id: team.user_id,
    claude_code_integration: team.claude_code_integration as ClaudeCodeIntegration | null,
    linear_integration: team.linear_integration as LinearIntegration | null,
  }))
}

/**
 * Handle @1code mention in issue/PR comment
 */
async function handleBotMention(payload: GitHubIssueCommentPayload) {
  const { comment, issue, repository, installation, sender } = payload
  const installationId = installation?.id

  if (!installationId) {
    console.error("❌ [Webhook] No installation ID in payload")
    return { success: false, error: "No installation ID" }
  }

  // Find team for this installation, prioritizing the sender's team
  const team = await findTeamByInstallation(installationId, sender.login)
  if (!team) {
    console.log(
      `⚠️ [Webhook] No team found for installation ${installationId}`
    )
    return { success: false, error: "Team not found" }
  }

  const isPR = !!issue.pull_request
  const prompt = extractPrompt(comment.body)
  const issueType = isPR ? "PR" : "Issue"

  console.log(
    `🤖 [Webhook] @1code mentioned in ${issueType} #${issue.number} by ${sender.login}`
  )
  console.log(`📝 [Webhook] Prompt: ${prompt.substring(0, 100)}...`)

  // Check if sender has write access to the repository
  const permission = await checkUserRepoPermission(
    installationId,
    repository.owner.login,
    repository.name,
    sender.login
  )

  if (!hasWriteAccess(permission)) {
    console.log(
      `🚫 [Webhook] User ${sender.login} has '${permission}' access, denying @1code trigger`
    )

    await addCommentReaction(
      installationId,
      repository.owner.login,
      repository.name,
      comment.id,
      "-1"
    )

    await addGitHubComment(
      installationId,
      repository.owner.login,
      repository.name,
      issue.number,
      `@${sender.login} Sorry, only collaborators with **write access** can trigger @1code.`
    )

    return { success: false, error: "Insufficient permissions" }
  }

  // React to acknowledge we saw it
  await addCommentReaction(
    installationId,
    repository.owner.login,
    repository.name,
    comment.id,
    "eyes"
  )

  const baseUrl = getInternalBaseUrl()
  const externalBaseUrl = getExternalBaseUrl()

  try {
    // 1. Fetch full issue/PR context (title, body, all comments)
    console.log(`📖 [Webhook] Fetching full context for ${issueType} #${issue.number}...`)
    const issueContext = await fetchIssueContext(
      installationId,
      repository.owner.login,
      repository.name,
      issue.number,
      isPR
    )
    const fullPrompt = formatContextForAgent(issueContext, prompt, sender.login)
    console.log(`📖 [Webhook] Context fetched: ${issueContext.comments.length} comments`)

    // 2. Create sandbox using shared function (handles cloning + all credential injection)
    const { sandboxId, sandboxUrl, usesClaudeCodeOAuth } = await createAgentSandbox({
      userId: team.user_id,
      repository: repository.full_name,
      installationId,
      claudeCodeIntegration: team.claude_code_integration,
      linearIntegration: team.linear_integration,
    })

    // 3. Create AgentChat with sandbox_id
    const chat = await prisma.agentChat.create({
      data: {
        user_id: team.user_id,
        team_id: team.id,
        sandbox_id: sandboxId,
        credit_source: usesClaudeCodeOAuth ? "claude_code" : "personal",
        name: `${issueType} #${issue.number}: ${issue.title}`,
        meta: {
          source: "github",
          github_installation_id: String(installationId),
          github_issue_number: issue.number,
          github_issue_url: issue.html_url,
          github_comment_url: comment.html_url,
          github_repo: repository.full_name,
          repository: repository.full_name,
          github_sender: sender.login,
          is_pull_request: isPR,
        },
      },
    })

    // 4. Create AgentSubChat with initial message (includes full context)
    const subChatId = crypto.randomUUID()
    const initialMessage = {
      id: crypto.randomUUID(),
      role: "user" as const,
      parts: [{ type: "text" as const, text: fullPrompt }],
    }

    await prisma.agentSubChat.create({
      data: {
        id: subChatId,
        chat_id: chat.id,
        name: "GitHub Task",
        mode: "agent",
        messages: [initialMessage],
      },
    })

    // 5. Create IntegrationTask to track
    await prisma.integrationTask.create({
      data: {
        chat_id: chat.id,
        team_id: team.id,
        platform: "github",
        external_id: `${repository.full_name}#${issue.number}`,
        external_url: issue.html_url,
        external_title: issue.title,
        metadata: {
          comment_id: comment.id,
          comment_url: comment.html_url,
          is_pull_request: isPR,
          repository: repository.full_name,
          sender: sender.login,
          prompt,
        },
        status: "in_progress",
      },
    })

    // 6. Comment back with link and capture comment ID for later editing
    const initialCommentId = await addGitHubComment(
      installationId,
      repository.owner.login,
      repository.name,
      issue.number,
      `👋 Hey @${sender.login}! I'm on it.\n\n` +
        `**Task:** ${prompt.substring(0, 200)}${prompt.length > 200 ? "..." : ""}\n\n` +
        `I'll update this comment when complete.\n\n` +
        `---\n` +
        `[View live progress](${getChatUrl(chat.id)})\n\n` +
        POWERED_BY_FOOTER
    )

    // 7. Update AgentChat.meta with the initial comment ID for later editing
    await prisma.agentChat.update({
      where: { id: chat.id },
      data: {
        meta: {
          source: "github",
          github_installation_id: String(installationId),
          github_issue_number: issue.number,
          github_issue_url: issue.html_url,
          github_comment_url: comment.html_url,
          github_repo: repository.full_name,
          repository: repository.full_name,
          github_sender: sender.login,
          is_pull_request: isPR,
          github_initial_comment_id: initialCommentId,
        },
      },
    })

    // 8. Trigger agent via internal fetch (fire and forget)
    console.log(`🚀 [Webhook] Triggering agent at ${sandboxUrl}...`)

    // Don't await - let it run in background
    fetch(`${baseUrl}/api/1code/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "sandbox-url": sandboxUrl,
        "parent-chat-id": chat.id,
        "sub-chat-name": "GitHub Task",
        "sub-chat-mode": "agent",
        // Internal auth headers for server-to-server call
        "x-internal-token": process.env.INTERNAL_API_SECRET || "",
        "x-user-id": team.user_id,
      },
      body: JSON.stringify({
        messages: [initialMessage],
        id: subChatId,
      }),
    }).catch((err) => {
      console.error(`❌ [Webhook] Failed to trigger agent:`, err)
    })

    console.log(`✅ [Webhook] Agent triggered for chat ${chat.id}`)
    return { success: true, chatId: chat.id, teamId: team.id }
  } catch (error) {
    console.error(`❌ [Webhook] Error setting up agent:`, error)

    // Comment error to GitHub
    await addGitHubComment(
      installationId,
      repository.owner.login,
      repository.name,
      issue.number,
      `❌ Sorry @${sender.login}, I encountered an error while setting up:\n\n` +
        `\`\`\`\n${error instanceof Error ? error.message : "Unknown error"}\n\`\`\`\n\n` +
        `Please try again or check if the repository is accessible.`
    )

    // Note: Sandbox cleanup is handled by createAgentSandbox on error
    return { success: false, error: String(error) }
  }
}

/**
 * Handle automation triggers for PR/issue/branch events.
 * Checks ALL teams with this installation and runs matching automations from each.
 */
async function handleAutomationTrigger(
  triggerType: TriggerType,
  installationId: number,
  repository: { full_name: string; owner: { login: string }; name: string; default_branch: string },
  sender: { login: string; id: number },
  eventData: GitHubEventData,
  context: {
    title: string
    body: string | null
    number?: number
    htmlUrl: string
    isPR?: boolean
    branch?: string
    commentBody?: string
    commentAuthor?: string
    commentUrl?: string
    commentCreatedAt?: string
  },
  webhookPayload: any,
) {
  // Find ALL teams with this installation (not just one)
  const teams = await findAllTeamsByInstallation(installationId)
  if (teams.length === 0) {
    console.log(`⚠️ [Automation] No teams found for installation ${installationId}`)
    return { success: false, error: "No teams found", triggered: 0 }
  }

  const baseUrl = getInternalBaseUrl()

  let totalTriggeredCount = 0

  // Check automations for EACH team
  for (const team of teams) {
    console.log(`🔍 [Automation] Checking automations for team "${team.name}" (${team.id})`)

    // Find matching automations for this team
    const matchingAutomations = await findMatchingAutomations(
      team.id,
      triggerType,
      eventData,
    )

    if (matchingAutomations.length === 0) {
      console.log(`⏭️ [Automation] No matching automations for ${triggerType} in team "${team.name}"`)
      continue
    }

    console.log(
      `🎯 [Automation] Found ${matchingAutomations.length} matching automation(s) for ${triggerType} in team "${team.name}"`,
    )

    for (const { automation, trigger } of matchingAutomations) {
    try {
      console.log(`🤖 [Automation] Triggering automation "${automation.name}" (trigger: ${trigger.trigger_type})`)

      // Build rich context for the agent
      const richContext = await buildAutomationContext(
        triggerType as ContextTriggerType,
        installationId,
        repository.owner.login,
        repository.name,
        {
          number: context.number,
          isPR: context.isPR,
          commentBody: context.commentBody,
          commentAuthor: context.commentAuthor,
          commentUrl: context.commentUrl,
          commentCreatedAt: context.commentCreatedAt,
        },
        webhookPayload
      )

      const automationPrompt = automation.agent_prompt || ""
      const fullPrompt = formatAutomationPrompt(automationPrompt, richContext, repository.full_name)

      // Create sandbox
      const { sandboxId, sandboxUrl, usesClaudeCodeOAuth } = await createAgentSandbox({
        userId: team.user_id,
        repository: repository.full_name,
        installationId,
        claudeCodeIntegration: team.claude_code_integration,
        linearIntegration: team.linear_integration,
        branch: context.branch,
      })

      // Create AgentChat
      const chatName = context.number
        ? `${context.isPR ? "PR" : "Issue"} #${context.number}: ${context.title}`
        : `${triggerType}: ${context.title}`

      const chat = await prisma.agentChat.create({
        data: {
          user_id: automation.created_by,
          team_id: team.id,
          sandbox_id: sandboxId,
          credit_source: usesClaudeCodeOAuth ? "claude_code" : "personal",
          name: chatName,
          meta: {
            source: "github",
            automation_id: automation.id,
            automation_name: automation.name,
            automation_respond_to_trigger: automation.respond_to_trigger,
            github_installation_id: String(installationId),
            github_repo: repository.full_name,
            repository: repository.full_name,
            github_sender: sender.login,
            trigger_type: triggerType,
            ...(context.number && {
              github_issue_number: context.number,
              github_issue_url: context.htmlUrl,
              is_pull_request: context.isPR,
            }),
          },
        },
      })

      // Create AgentSubChat with initial message
      const subChatId = crypto.randomUUID()
      const initialMessage = {
        id: crypto.randomUUID(),
        role: "user" as const,
        parts: [{ type: "text" as const, text: fullPrompt }],
      }

      await prisma.agentSubChat.create({
        data: {
          id: subChatId,
          chat_id: chat.id,
          name: "Automation Task",
          mode: "agent",
          messages: [initialMessage],
        },
      })

      // Create IntegrationTask
      const externalId = context.number
        ? `${repository.full_name}#${context.number}`
        : `${repository.full_name}:${triggerType}`

      await prisma.integrationTask.create({
        data: {
          chat_id: chat.id,
          team_id: team.id,
          platform: "github",
          external_id: externalId,
          external_url: context.htmlUrl,
          external_title: context.title,
          metadata: {
            automation_id: automation.id,
            automation_name: automation.name,
            trigger_type: triggerType,
            repository: repository.full_name,
            sender: sender.login,
          },
          status: "in_progress",
        },
      })

      // Comment on PR/Issue if applicable and respond_to_trigger is enabled
      if (context.number && automation.respond_to_trigger !== false) {
        const viewUrl = getChatUrl(chat.id, automation.add_to_inbox)
        const commentId = await addGitHubComment(
          installationId,
          repository.owner.login,
          repository.name,
          context.number,
          `🤖 **Automation triggered:** ${automation.name}\n\n` +
            `I'm starting to work on this automatically.\n\n` +
            `---\n` +
            `[View live progress](${viewUrl})\n\n` +
            POWERED_BY_FOOTER,
        )

        // Update meta with comment ID
        await prisma.agentChat.update({
          where: { id: chat.id },
          data: {
            meta: {
              source: "github",
              automation_id: automation.id,
              automation_name: automation.name,
              automation_add_to_inbox: automation.add_to_inbox,
              automation_respond_to_trigger: automation.respond_to_trigger,
              github_installation_id: String(installationId),
              github_issue_number: context.number,
              github_issue_url: context.htmlUrl,
              github_repo: repository.full_name,
              repository: repository.full_name,
              github_sender: sender.login,
              is_pull_request: context.isPR,
              trigger_type: triggerType,
              github_initial_comment_id: commentId,
            },
          },
        })
      }

      // Trigger agent (fire and forget)
      fetch(`${baseUrl}/api/1code/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "sandbox-url": sandboxUrl,
          "parent-chat-id": chat.id,
          "sub-chat-name": "Automation Task",
          "sub-chat-mode": "agent",
          "x-internal-token": process.env.INTERNAL_API_SECRET || "",
          "x-user-id": team.user_id,
        },
        body: JSON.stringify({
          messages: [initialMessage],
          id: subChatId,
        }),
      }).catch((err) => {
        console.error(`❌ [Automation] Failed to trigger agent:`, err)
      })

      // Log execution as pending (agent runs asynchronously)
      await logAutomationExecution(
        automation.id,
        externalId,
        context.htmlUrl,
        "pending",
        chat.id,
      )

      totalTriggeredCount++
      console.log(`✅ [Automation] Triggered "${automation.name}" -> chat ${chat.id}`)
    } catch (error) {
      console.error(`❌ [Automation] Error triggering "${automation.name}":`, error)
      await logAutomationExecution(
        automation.id,
        context.number
          ? `${repository.full_name}#${context.number}`
          : `${repository.full_name}:${triggerType}`,
        context.htmlUrl,
        "failed",
        undefined,
        error instanceof Error ? error.message : "Unknown error",
      )
    }
    }
  }

  if (totalTriggeredCount === 0) {
    console.log(`⏭️ [Automation] No matching automations for ${triggerType} across all teams`)
  } else {
    console.log(`✅ [Automation] Total triggered: ${totalTriggeredCount} automation(s) across ${teams.length} team(s)`)
  }

  return { success: true, triggered: totalTriggeredCount }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const payload = await req.text()
    const signature = req.headers.get("x-hub-signature-256")
    const event = req.headers.get("x-github-event")

    console.log(`🎯 [Webhook] GitHub webhook received: ${event}`)

    // Verify signature
    if (!signature || !verifySignature(payload, signature)) {
      console.error("❌ [Webhook] Invalid or missing signature")
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    let data: any
    try {
      data = JSON.parse(payload)
    } catch {
      console.error("❌ [Webhook] Invalid JSON payload")
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    }

    // Handle different event types
    switch (event) {
      case "installation": {
        const installationData = data as GitHubInstallationPayload
        console.log(
          `📱 [Webhook] Installation event: ${installationData.action} for ${installationData.installation.account.login}`,
        )

        if (installationData.action === "created") {
          const result = await handleInstallationCreated(
            installationData.installation.id,
            installationData.installation.account.login,
            installationData.installation.account.type,
            installationData.installation.account.avatar_url,
          )
          return NextResponse.json({
            message: "Installation created, teams updated",
            ...result,
          })
        }

        if (installationData.action === "deleted") {
          const result = await handleInstallationDeleted(
            installationData.installation.id,
          )
          return NextResponse.json({
            message: "Installation deleted, teams updated",
            ...result,
          })
        }

        if (installationData.action === "suspend") {
          // Clear token cache so next request will fail gracefully
          clearInstallationTokenCache(installationData.installation.id)
          return NextResponse.json({
            message: "Installation suspended, cache cleared",
          })
        }

        return NextResponse.json({
          message: `Installation ${installationData.action} processed`,
        })
      }

      case "installation_repositories": {
        const reposData = data as GitHubInstallationRepositoriesPayload
        console.log(
          `📦 [Webhook] Installation repositories event: ${reposData.action}`,
        )

        if (
          reposData.action === "removed" &&
          reposData.repositories_removed?.length
        ) {
          await handleRepositoriesRemoved(
            reposData.installation.id,
            reposData.repositories_removed.map((r) => r.full_name),
          )
          return NextResponse.json({
            message: "Repositories removed, configs cleared",
            removedRepos: reposData.repositories_removed.map(
              (r) => r.full_name,
            ),
          })
        }

        return NextResponse.json({
          message: `Repositories ${reposData.action} processed`,
        })
      }

      case "push": {
        const pushData = data as GitHubPushPayload
        const repository = pushData.repository?.full_name
        const branch = pushData.ref?.replace("refs/heads/", "")
        const defaultBranch = pushData.repository?.default_branch

        console.log(`📦 [Webhook] Push: ${repository}, Branch: ${branch}`)

        // Check for push automations first (any branch)
        const installationId = pushData.installation?.id
        let automationsTriggered = 0

        if (installationId && pushData.repository && pushData.sender && branch) {
          const pushAuthor = pushData.pusher?.name || pushData.sender.login
          const eventData: GitHubEventData = {
            platform: "github",
            repository: pushData.repository.full_name,
            branch,
            author: pushAuthor,
            isBot:
              pushAuthor.toLowerCase().includes("1code") ||
              pushAuthor.toLowerCase().includes("1code-async"),
          }

          const result = await handleAutomationTrigger(
            "push",
            installationId,
            {
              full_name: pushData.repository.full_name,
              owner: pushData.repository.owner,
              name: pushData.repository.name,
              default_branch: pushData.repository.default_branch,
            },
            pushData.sender,
            eventData,
            {
              title: `Push to ${branch}`,
              body: null,
              htmlUrl: `https://github.com/${pushData.repository.full_name}/tree/${branch}`,
              branch,
            },
            data,
          )
          automationsTriggered = result.triggered
        }

        // Only refresh file tree for pushes to default branch
        if (!repository || branch !== defaultBranch) {
          console.log(`⏭️ [Webhook] Skipping file tree refresh for non-default branch`)
          return NextResponse.json({
            message: "Push processed",
            automationsTriggered,
          })
        }

        // Rate limit check for file tree refresh
        const lastTime = lastProcessed.get(repository) || 0
        if (Date.now() - lastTime < RATE_LIMIT_MS) {
          console.log(`⏱️ [Webhook] Rate limited for ${repository}`)
          return NextResponse.json({
            message: "Push processed (file tree rate limited)",
            automationsTriggered,
          })
        }
        lastProcessed.set(repository, Date.now())

        // Refresh file tree
        const result = await refreshFileTreeByRepository(repository)

        if (result.success) {
          console.log(`✅ [Webhook] File tree refreshed for ${repository}`)
          return NextResponse.json({
            message: "File tree refreshed",
            repository,
            teamIds: result.teamIds,
            automationsTriggered,
          })
        } else {
          console.log(`⚠️ [Webhook] Repository not found: ${repository}`)
          return NextResponse.json({
            message: "Repository not found in any team",
            repository,
            automationsTriggered,
          })
        }
      }

      case "issue_comment": {
        const commentData = data as GitHubIssueCommentPayload
        console.log(
          `💬 [Webhook] Issue comment: ${commentData.action} on #${commentData.issue.number}`
        )
        console.log(`💬 [Webhook] Full comment body: "${commentData.comment.body}"`)
        console.log(`💬 [Webhook] Comment author: ${commentData.comment.user.login} (type: ${commentData.comment.user.type})`)

        // Only process new comments
        if (commentData.action !== "created") {
          console.log(`⏭️ [Webhook] Skipping: action is "${commentData.action}", not "created"`)
          return NextResponse.json({ message: "Ignoring non-created comment" })
        }

        // Ignore bot's own comments to prevent loops
        if (isOurBot(commentData.comment.user.login, commentData.comment.user.type)) {
          console.log(`⏭️ [Webhook] Skipping: comment is from our bot (${commentData.comment.user.login})`)
          return NextResponse.json({ message: "Ignoring bot comment" })
        }

        const installationId = commentData.installation?.id

        // Check for @1code mention first
        const mentionFound = hasBotMention(commentData.comment.body)
        console.log(`🔍 [Webhook] Bot mention check: ${mentionFound ? "FOUND" : "NOT FOUND"}`)

        if (mentionFound) {
          console.log(`✅ [Webhook] Bot mention found! Processing...`)

          // Handle the mention
          const result = await handleBotMention(commentData)

          if (result.success) {
            return NextResponse.json({
              message: "Bot mention handled",
              chatId: result.chatId,
            })
          } else {
            return NextResponse.json({
              message: "Failed to handle mention",
              error: result.error,
            })
          }
        }

        // No @1code mention - check for issue_comment_created automations
        if (!installationId) {
          return NextResponse.json({ message: "No installation ID" })
        }

        const isPR = !!commentData.issue.pull_request
        const commentAuthor = commentData.comment.user.login
        const isBotComment = isOurBot(commentAuthor, commentData.comment.user.type)

        const eventData: GitHubEventData = {
          platform: "github",
          repository: commentData.repository.full_name,
          commentedBy: commentData.comment.user.login,
          commentOn: isPR ? "pr" : "issue",
          author: commentData.issue.user?.login,
          isBot: isBotComment,
        }

        const result = await handleAutomationTrigger(
          "issue_comment_created",
          installationId,
          commentData.repository,
          commentData.sender,
          eventData,
          {
            title: `Comment on ${isPR ? "PR" : "Issue"} #${commentData.issue.number}: ${commentData.issue.title}`,
            body: commentData.comment.body,
            number: commentData.issue.number,
            htmlUrl: commentData.comment.html_url,
            isPR,
            commentBody: commentData.comment.body,
            commentAuthor: commentData.comment.user.login,
            commentUrl: commentData.comment.html_url,
            commentCreatedAt: new Date().toISOString(),
          },
          data,
        )

        return NextResponse.json({
          message: "Comment processed",
          automationsTriggered: result.triggered,
        })
      }

      case "pull_request": {
        const prData = data as GitHubPullRequestPayload
        console.log(
          `🔀 [Webhook] Pull request: ${prData.action} #${prData.number}`,
        )

        const installationId = prData.installation?.id
        if (!installationId) {
          return NextResponse.json({ message: "No installation ID" })
        }

        // Map action to trigger type
        let triggerType: TriggerType | null = null
        if (prData.action === "opened") {
          triggerType = "pr_opened"
        } else if (prData.action === "closed") {
          // Check if it was merged or just closed
          if (prData.pull_request.merged) {
            triggerType = "pr_merged"
          } else {
            triggerType = "pr_closed"
          }
        } else if (prData.action === "synchronize") {
          // Commits pushed to an existing PR
          triggerType = "pr_commits_pushed"
        }

        if (!triggerType) {
          return NextResponse.json({
            message: `PR action ${prData.action} not handled`,
          })
        }

        // Check if PR was created by 1code bot
        const prAuthor = prData.pull_request.user.login
        const isBot =
          prData.pull_request.user.type === "Bot" ||
          prAuthor.toLowerCase().includes("1code") ||
          prAuthor.toLowerCase().includes("1code-async")

        const eventData: GitHubEventData = {
          platform: "github",
          repository: prData.repository.full_name,
          branch: prData.pull_request.head.ref,
          author: prData.pull_request.user.login,
          mergedBy: prData.pull_request.merged_by?.login,
          pushedBy: prData.sender.login, // For synchronize, sender is who pushed
          labels: prData.pull_request.labels.map((l) => l.name),
          isDraft: prData.pull_request.draft,
          isBot,
        }

        const result = await handleAutomationTrigger(
          triggerType,
          installationId,
          prData.repository,
          prData.sender,
          eventData,
          {
            title: prData.pull_request.title,
            body: prData.pull_request.body,
            number: prData.pull_request.number,
            htmlUrl: prData.pull_request.html_url,
            isPR: true,
            branch: prData.pull_request.head.ref,
          },
          data,
        )

        return NextResponse.json({
          message: `PR ${prData.action} processed`,
          automationsTriggered: result.triggered,
        })
      }

      case "issues": {
        const issueData = data as GitHubIssuesPayload
        console.log(
          `📋 [Webhook] Issue: ${issueData.action} #${issueData.issue.number}`,
        )

        const installationId = issueData.installation?.id
        if (!installationId) {
          return NextResponse.json({ message: "No installation ID" })
        }

        // Map action to trigger type
        let triggerType: TriggerType | null = null
        if (issueData.action === "opened") {
          triggerType = "issue_opened"
        } else if (issueData.action === "closed") {
          triggerType = "issue_closed"
        }

        if (!triggerType) {
          return NextResponse.json({
            message: `Issue action ${issueData.action} not handled`,
          })
        }

        // Check if issue was created by 1code bot
        const issueAuthor = issueData.issue.user.login
        const isBot =
          issueData.issue.user.type === "Bot" ||
          issueAuthor.toLowerCase().includes("1code") ||
          issueAuthor.toLowerCase().includes("1code-async")

        const eventData: GitHubEventData = {
          platform: "github",
          repository: issueData.repository.full_name,
          author: issueData.issue.user.login,
          labels: issueData.issue.labels.map((l) => l.name),
          isBot,
        }

        const result = await handleAutomationTrigger(
          triggerType,
          installationId,
          issueData.repository,
          issueData.sender,
          eventData,
          {
            title: issueData.issue.title,
            body: issueData.issue.body,
            number: issueData.issue.number,
            htmlUrl: issueData.issue.html_url,
            isPR: false,
          },
          data,
        )

        return NextResponse.json({
          message: `Issue ${issueData.action} processed`,
          automationsTriggered: result.triggered,
        })
      }

      case "create": {
        const createData = data as GitHubCreatePayload
        console.log(
          `🌿 [Webhook] Create: ${createData.ref_type} "${createData.ref}"`,
        )

        const installationId = createData.installation?.id
        if (!installationId) {
          return NextResponse.json({ message: "No installation ID" })
        }

        // Handle both branch and tag creation
        if (createData.ref_type !== "branch" && createData.ref_type !== "tag") {
          return NextResponse.json({
            message: `Create ${createData.ref_type} not handled`,
          })
        }

        const createAuthor = createData.sender.login
        const eventData: GitHubEventData = {
          platform: "github",
          repository: createData.repository.full_name,
          branch: createData.ref_type === "branch" ? createData.ref : undefined,
          branchName: createData.ref_type === "branch" ? createData.ref : undefined,
          tagName: createData.ref_type === "tag" ? createData.ref : undefined,
          author: createAuthor,
          refType: createData.ref_type,
          isBot:
            createAuthor.toLowerCase().includes("1code") ||
            createAuthor.toLowerCase().includes("1code-async"),
        }

        const result = await handleAutomationTrigger(
          "branch_created",
          installationId,
          createData.repository,
          createData.sender,
          eventData,
          {
            title: `${createData.ref_type === "branch" ? "Branch" : "Tag"} created: ${createData.ref}`,
            body: null,
            htmlUrl: `https://github.com/${createData.repository.full_name}/tree/${createData.ref}`,
            branch: createData.ref_type === "branch" ? createData.ref : undefined,
          },
          data,
        )

        return NextResponse.json({
          message: `${createData.ref_type} created processed`,
          automationsTriggered: result.triggered,
        })
      }

      case "workflow_run": {
        const workflowData = data as GitHubWorkflowRunPayload
        console.log(
          `⚙️ [Webhook] Workflow run: ${workflowData.action} "${workflowData.workflow_run.name}" - ${workflowData.workflow_run.conclusion}`,
        )

        const installationId = workflowData.installation?.id
        if (!installationId) {
          return NextResponse.json({ message: "No installation ID" })
        }

        // Only handle completed workflows that failed
        if (
          workflowData.action !== "completed" ||
          workflowData.workflow_run.conclusion !== "failure"
        ) {
          return NextResponse.json({
            message: `Workflow ${workflowData.action}/${workflowData.workflow_run.conclusion} not handled`,
          })
        }

        const workflowAuthor = workflowData.sender.login
        const eventData: GitHubEventData = {
          platform: "github",
          repository: workflowData.repository.full_name,
          branch: workflowData.workflow_run.head_branch,
          workflow: workflowData.workflow_run.name,
          author: workflowAuthor,
          isBot:
            workflowAuthor.toLowerCase().includes("1code") ||
            workflowAuthor.toLowerCase().includes("1code-async"),
        }

        const result = await handleAutomationTrigger(
          "workflow_failed",
          installationId,
          workflowData.repository,
          workflowData.sender,
          eventData,
          {
            title: `Workflow failed: ${workflowData.workflow_run.name}`,
            body: `Workflow "${workflowData.workflow_run.name}" failed on branch ${workflowData.workflow_run.head_branch}`,
            htmlUrl: workflowData.workflow_run.html_url,
            branch: workflowData.workflow_run.head_branch,
          },
          data,
        )

        return NextResponse.json({
          message: "Workflow failed processed",
          automationsTriggered: result.triggered,
        })
      }

      default:
        console.log(`⏭️ [Webhook] Ignoring event: ${event}`)
        return NextResponse.json({ message: `Event ${event} ignored` })
    }
  } catch (error) {
    console.error("❌ [Webhook] Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
