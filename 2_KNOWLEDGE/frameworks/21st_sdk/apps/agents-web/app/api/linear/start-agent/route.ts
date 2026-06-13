import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createAgentSandbox } from "@/lib/agents/create-agent-sandbox"
import { getInstallationForRepo, type GitHubIntegration } from "@/lib/github"
import { type LinearIntegration } from "@/lib/linear"
import { type ClaudeCodeIntegration } from "@/lib/claude-code"
import {
  fetchLinearIssueContext,
  formatLinearContextForAgent,
  formatLinearAutomationPrompt,
} from "@/lib/server/linear/linear-context"
import { addLinearComment } from "@/lib/webhooks/platforms/linear/responder"

import { getInternalBaseUrl, getChatUrl, POWERED_BY_FOOTER } from "@/lib/webhooks/utils/urls"
import { updateAutomationExecution } from "@/lib/webhooks/handlers/automation-matcher"

const INTERNAL_BASE_URL = getInternalBaseUrl()

interface StartAgentRequest {
  teamId: string
  issueId: string
  repository: string
  prompt?: string
  isAutomation?: boolean
  addToInbox?: boolean
  respondToTrigger?: boolean
  automationExecutionId?: string
  triggeredBy?: {
    id: string
    name: string
  }
}

export const maxDuration = 300 // 5 minutes

export async function POST(request: NextRequest) {
  let automationExecutionId: string | undefined
  try {
    // Verify internal token
    const internalToken = request.headers.get("x-internal-token")
    if (
      !process.env.INTERNAL_API_SECRET ||
      internalToken !== process.env.INTERNAL_API_SECRET
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body: StartAgentRequest = await request.json()
    const { teamId, issueId, repository, prompt, isAutomation, addToInbox, respondToTrigger, triggeredBy } = body
    automationExecutionId = body.automationExecutionId

    if (!teamId || !issueId || !repository) {
      throw new Error("Missing required fields: teamId, issueId, repository")
    }

    console.log(
      `[Linear Start Agent] Starting for issue ${issueId} with repo ${repository}`
    )

    // Get team with integrations
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: {
        id: true,
        user_id: true,
        linear_integration: true,
        github_integration: true,
        claude_code_integration: true,
      },
    })

    if (!team) {
      throw new Error("Team not found")
    }

    const linearIntegration = team.linear_integration as LinearIntegration | null
    const githubIntegration = team.github_integration as GitHubIntegration | null
    const claudeCodeIntegration =
      team.claude_code_integration as ClaudeCodeIntegration | null

    if (!linearIntegration?.accessToken) {
      throw new Error("Linear not connected")
    }

    // Get installation ID for the repository
    const installationId = getInstallationForRepo(githubIntegration, repository)
    if (!installationId) {
      throw new Error("No GitHub installation for this repository")
    }

    // Fetch issue context from Linear (with automatic token refresh)
    const issueContext = await fetchLinearIssueContext(teamId, issueId)

    // Create sandbox with repo cloned (skip Linear token - we handle notifications)
    const { sandboxId, sandboxUrl, usesClaudeCodeOAuth } =
      await createAgentSandbox({
        userId: team.user_id,
        repository,
        installationId,
        claudeCodeIntegration,
        linearIntegration,
        skipLinearToken: true, // Don't let agent post to Linear - we handle it
      })

    // Create AgentChat first (we need the ID for the comment link)
    const chat = await prisma.agentChat.create({
      data: {
        user_id: team.user_id,
        team_id: team.id,
        sandbox_id: sandboxId,
        credit_source: usesClaudeCodeOAuth ? "claude_code" : "personal",
        name: `[${issueContext.identifier}] ${issueContext.title}`,
        meta: {
          source: "linear",
          linear_issue_id: issueId,
          linear_issue_url: issueContext.url,
          linear_issue_identifier: issueContext.identifier,
          repository,
        },
      },
    })

    // Post initial comment to Linear (will be updated when agent completes)
    const viewUrl = getChatUrl(chat.id, addToInbox)
    const commentResult = respondToTrigger !== false
      ? await addLinearComment(
          team.id,
          issueId,
          `**Working on this issue...**\n\n` +
            `**Repository:** \`${repository}\`\n\n` +
            `---\n` +
            `[View live progress](${viewUrl})\n\n` +
            POWERED_BY_FOOTER
        )
      : undefined
    const linearCommentId = commentResult?.commentId

    // Update chat meta with comment ID for completion handler
    await prisma.agentChat.update({
      where: { id: chat.id },
      data: {
        meta: {
          source: "linear",
          linear_issue_id: issueId,
          linear_issue_url: issueContext.url,
          linear_issue_identifier: issueContext.identifier,
          ...(linearCommentId && { linear_comment_id: linearCommentId }),
          add_to_inbox: addToInbox,
          automation_respond_to_trigger: respondToTrigger !== false,
          repository,
        },
      },
    })

    // Create IntegrationTask
    await prisma.integrationTask.create({
      data: {
        chat_id: chat.id,
        team_id: team.id,
        platform: "linear",
        external_id: issueId,
        external_url: issueContext.url,
        external_title: `[${issueContext.identifier}] ${issueContext.title}`,
        status: "in_progress",
        metadata: {
          repository,
          triggeredBy,
          linearCommentId,
        },
      },
    })

    // Build the full prompt
    // Automations: pure (instruction + context, no opinions)
    // @1code mentions: opinionated (guide agent on what to do)
    const fullPrompt = isAutomation
      ? formatLinearAutomationPrompt(issueContext, prompt || "")
      : formatLinearContextForAgent(issueContext, prompt)

    // Create AgentSubChat
    const subChatId = crypto.randomUUID()
    await prisma.agentSubChat.create({
      data: {
        id: subChatId,
        chat_id: chat.id,
        name: "Linear Task",
        mode: "agent",
        messages: [
          {
            id: crypto.randomUUID(),
            role: "user",
            parts: [{ type: "text", text: fullPrompt }],
          },
        ],
      },
    })

    // Trigger agent (fire and forget)
    fetch(`${INTERNAL_BASE_URL}/api/1code/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "sandbox-url": sandboxUrl,
        "parent-chat-id": chat.id,
        "sub-chat-name": "Linear Task",
        "sub-chat-mode": "agent",
        "x-internal-token": process.env.INTERNAL_API_SECRET || "",
        "x-user-id": team.user_id,
      },
      body: JSON.stringify({
        messages: [
          {
            id: crypto.randomUUID(),
            role: "user",
            parts: [{ type: "text", text: fullPrompt }],
          },
        ],
        id: subChatId,
      }),
    }).catch((err) => {
      console.error("[Linear Start Agent] Failed to trigger agent:", err)
    })

    // Update automation execution to "success" now that setup is complete
    if (automationExecutionId) {
      await updateAutomationExecution(automationExecutionId, "success", chat.id)
    }

    console.log(`[Linear Start Agent] Agent started, chat: ${chat.id}`)

    return NextResponse.json({
      ok: true,
      chatId: chat.id,
      sandboxId,
    })
  } catch (error) {
    console.error("[Linear Start Agent] Error:", error)

    // Update automation execution to "failed" if we have an execution ID
    if (automationExecutionId) {
      await updateAutomationExecution(
        automationExecutionId,
        "failed",
        undefined,
        error instanceof Error ? error.message : "Unknown error"
      ).catch((e) => console.error("[Linear Start Agent] Failed to update execution:", e))
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
