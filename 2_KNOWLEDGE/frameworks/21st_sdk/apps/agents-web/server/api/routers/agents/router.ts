import { type ClaudeCodeIntegration } from "@/lib/claude-code"
import { codesandboxSdk as codesandboxSdkV1 } from "@/lib/codesandbox-sdk-v1"
import {
  DEFAULT_HIBERNATION_TIMEOUT,
  TEMPLATES,
} from "@/lib/codesandbox-sdk-v11"
import { codesandboxSdkV2 } from "@/lib/codesandbox-sdk-v2"
import { getInstallationForRepo, type GitHubIntegration } from "@/lib/github"
import { prisma } from "@/lib/prisma"
import { type LinearIntegration } from "@/lib/linear"
import { getInstallationAccessToken } from "@/lib/server/github/github-app-auth"
import { saveRepositoryFileTree } from "@/lib/server/github/github-file-tree.service"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { Sandbox } from "@e2b/code-interpreter"
import { TRPCError } from "@trpc/server"
import { VMTier } from "codesandbox-sdk-v1"
import { z } from "zod"
import { checkTeamAccess } from "../teams/utils"
// sandboxConnectionManager replaced with direct e2b Sandbox.connect() for agents
import { fulfillModel } from "@/lib/server/ai-latest"
import {
  getPrBranch,
  pushToPrBranch,
  refreshToken,
} from "@/lib/server/git/branch-utils"
import { truncateText } from "@/lib/utils"
import { generateObject } from "ai-latest"
import { hasAgentsAccess } from "@/lib/agents-access"
import { createAgentSandbox } from "@/lib/agents/create-agent-sandbox"

// Helper to sync a forked sandbox to a specific branch
// Preserves local config files (like .byteconfig) via stash
async function syncBranch(
  session: { commands: { run: (cmd: string) => Promise<unknown> } },
  branch: string,
  accessToken: string,
  repository: string,
) {
  const remoteUrl = `https://x-access-token:${accessToken}@github.com/${repository}.git`

  // Update remote URL with fresh token
  await session.commands.run(
    `cd ./repo && git remote set-url origin "${remoteUrl}"`,
  )

  // Stash any local changes (config files like .byteconfig, etc.)
  await session.commands.run(
    `cd ./repo && git stash --include-untracked || true`,
  )

  // Fetch all branches from remote
  await session.commands.run(`cd ./repo && git fetch origin --prune`)

  // Checkout the branch (create tracking branch if needed)
  try {
    await session.commands.run(`cd ./repo && git checkout "${branch}"`)
  } catch {
    await session.commands.run(
      `cd ./repo && git checkout -b "${branch}" "origin/${branch}"`,
    )
  }

  // Reset to remote state (ensures we're in sync)
  await session.commands.run(`cd ./repo && git reset --hard "origin/${branch}"`)

  // Restore local changes on top
  await session.commands.run(`cd ./repo && git stash pop || true`)
}

export const agentsRouter = createTRPCRouter({
  // Check if user has agents access (via OneCode subscription)
  hasAgentsAccess: protectedProcedure.query(async ({ ctx }) => {
    return hasAgentsAccess(ctx.auth.userId!)
  }),

  // Get user's agents subscription from users_to_plans_agents table
  getAgentsSubscription: protectedProcedure.query(async ({ ctx }) => {
    // Check if user is admin - admins always have access
    const user = await prisma.user.findUnique({
      where: { id: ctx.auth.userId! },
      select: { is_admin: true },
    })

    if (user?.is_admin) {
      return {
        type: "admin" as const,
        status: "active",
        plan: null,
        meta: null,
      }
    }

    const userPlan = await prisma.usersToPlanAgents.findUnique({
      where: { user_id: ctx.auth.userId! },
      include: { plan: true },
    })

    if (!userPlan || userPlan.status !== "active") {
      return {
        type: "free" as const,
        status: null,
        plan: null,
        meta: null,
      }
    }

    return {
      type: userPlan.plan?.type || "free",
      status: userPlan.status,
      plan: userPlan.plan,
      meta: userPlan.meta,
    }
  }),

  // Get all chats for a team
  getAgentChats: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)

      const chats = await prisma.agentChat.findMany({
        where: {
          team_id: input.teamId,
          deleted_at: null,
          archived_at: null,
        },
        orderBy: { updated_at: "desc" },
        select: {
          id: true,
          name: true,
          sandbox_id: true,
          meta: true,
          created_at: true,
          updated_at: true,
          // TODO: precompute stats at write time instead of loading all messages
          // subChats: {
          //   where: { deleted_at: null },
          //   select: { messages: true },
          // },
        },
      })

      // Exclude inbox-only chats (linked to add_to_inbox automations)
      const inboxExecutions = await prisma.automationExecution.findMany({
        where: {
          chat_id: { not: null },
          automation: {
            team_id: input.teamId,
            add_to_inbox: true,
          },
        },
        select: { chat_id: true },
      })
      const inboxChatIds = new Set(inboxExecutions.map(e => e.chat_id))
      const filteredChats = chats.filter(chat => !inboxChatIds.has(chat.id))

      // TODO: precompute stats at write time instead of loading all messages
      // Stats computation was removed because it loaded ALL messages from ALL
      // subchats just to count file changes — causing 50s+ page loads.
      return filteredChats.map((chat) => ({
        ...chat,
        stats: null as { fileCount: number; additions: number; deletions: number } | null,
      }))
    }),

  // Get archived chats for a team
  getArchivedChats: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)

      const chats = await prisma.agentChat.findMany({
        where: {
          team_id: input.teamId,
          deleted_at: null,
          archived_at: { not: null },
        },
        orderBy: { archived_at: "desc" },
        select: {
          id: true,
          name: true,
          sandbox_id: true,
          meta: true,
          created_at: true,
          updated_at: true,
          archived_at: true,
        },
      })

      return chats
    }),

  // Get single chat with all sub-chats
  getAgentChat: protectedProcedure
    .input(z.object({ chatId: z.string() }))
    .query(async ({ input, ctx }) => {
      const chat = await prisma.agentChat.findUnique({
        where: { id: input.chatId, deleted_at: null },
        include: {
          subChats: {
            where: { deleted_at: null },
            orderBy: { created_at: "asc" },
            select: {
              id: true,
              name: true,
              mode: true, // Include mode ("plan" or "agent")
              messages: true,
              stream_id: true, // Include stream_id for resume support
              created_at: true,
              updated_at: true,
            },
          },
        },
      })

      if (!chat) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Chat not found" })
      }

      // Verify access
      await checkTeamAccess(chat.team_id, ctx.auth.userId!)

      return chat
    }),

  // Rename a sub-chat
  renameSubChat: protectedProcedure
    .input(
      z.object({
        subChatId: z.string().uuid(),
        name: z.string().min(1).max(100),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { subChatId, name } = input

      // Find sub-chat and verify access
      const subChat = await prisma.agentSubChat.findUnique({
        where: { id: subChatId },
        include: { chat: true },
      })

      if (!subChat) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Sub-chat not found",
        })
      }

      await checkTeamAccess(subChat.chat.team_id, ctx.auth.userId!)

      // Update sub-chat name
      await prisma.agentSubChat.update({
        where: { id: subChatId },
        data: { name },
      })

      return { success: true }
    }),

  // Update sub-chat mode
  updateSubChatMode: protectedProcedure
    .input(
      z.object({
        subChatId: z.string().uuid(),
        mode: z.enum(["plan", "agent"]),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { subChatId, mode } = input

      // Find sub-chat and verify access
      const subChat = await prisma.agentSubChat.findUnique({
        where: { id: subChatId },
        include: { chat: true },
      })

      if (!subChat) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Sub-chat not found",
        })
      }

      await checkTeamAccess(subChat.chat.team_id, ctx.auth.userId!)

      // Update sub-chat mode
      await prisma.agentSubChat.update({
        where: { id: subChatId },
        data: { mode },
      })

      return { success: true }
    }),

  // Rename a chat (parent)
  renameChat: protectedProcedure
    .input(
      z.object({
        chatId: z.string().uuid(),
        name: z.string().min(1).max(100),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { chatId, name } = input

      // Find chat and verify access
      const chat = await prisma.agentChat.findUnique({
        where: { id: chatId, deleted_at: null },
      })

      if (!chat) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Chat not found" })
      }

      await checkTeamAccess(chat.team_id, ctx.auth.userId!)

      await prisma.agentChat.update({
        where: { id: chatId },
        data: { name, updated_at: new Date() },
      })

      return { success: true }
    }),

  // Archive a chat
  archiveChat: protectedProcedure
    .input(z.object({ chatId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const chat = await prisma.agentChat.findUnique({
        where: { id: input.chatId, deleted_at: null },
      })

      if (!chat) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Chat not found" })
      }

      await checkTeamAccess(chat.team_id, ctx.auth.userId!)

      await prisma.agentChat.update({
        where: { id: input.chatId },
        data: {
          archived_at: new Date(),
        },
      })

      return { success: true }
    }),

  // Archive multiple chats at once
  archiveChatsBatch: protectedProcedure
    .input(z.object({ chatIds: z.array(z.string().uuid()) }))
    .mutation(async ({ input, ctx }) => {
      if (input.chatIds.length === 0) {
        return { success: true, archivedCount: 0 }
      }

      // Get all chats and verify team access
      const chats = await prisma.agentChat.findMany({
        where: {
          id: { in: input.chatIds },
          deleted_at: null,
        },
        select: { id: true, team_id: true },
      })

      // Verify access to all team_ids
      const teamIds = [...new Set(chats.map((c) => c.team_id))]
      for (const teamId of teamIds) {
        await checkTeamAccess(teamId, ctx.auth.userId!)
      }

      // Batch archive
      await prisma.agentChat.updateMany({
        where: { id: { in: input.chatIds } },
        data: { archived_at: new Date() },
      })

      return { success: true, archivedCount: chats.length }
    }),

  // Restore a chat from archive
  restoreChat: protectedProcedure
    .input(z.object({ chatId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const chat = await prisma.agentChat.findUnique({
        where: { id: input.chatId },
      })

      if (!chat) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Chat not found" })
      }

      await checkTeamAccess(chat.team_id, ctx.auth.userId!)

      await prisma.agentChat.update({
        where: { id: input.chatId },
        data: {
          archived_at: null,
        },
      })

      return { success: true }
    }),

  createAgentChat: protectedProcedure
    .input(
      z
        .object({
          request: z.string().min(1),
          teamId: z.string(),
          // For ready repos - use existing sandbox
          repositorySandboxId: z.string().optional(),
          // For non-ready repos - create on-the-fly
          repository: z.string().optional(), // e.g., "owner/repo"
          installationId: z.string().optional(),
          // For public repos - clone without auth
          isPublicImport: z.boolean().optional(),
          // Branch to checkout (defaults to repo's default branch if not provided)
          branch: z.string().optional(),
          images: z
            .array(
              z.object({
                url: z.string(),
                mediaType: z.string(),
                filename: z.string().optional(),
              }),
            )
            .optional(),
        })
        .refine(
          (data) => data.repositorySandboxId || data.repository,
          "Either repositorySandboxId or repository is required",
        ),
    )
    .mutation(async ({ input, ctx }) => {
      const {
        request,
        teamId,
        repositorySandboxId,
        repository,
        installationId,
        isPublicImport,
      } = input

      // 1. Verify team access
      const { team } = await checkTeamAccess(teamId, ctx.auth.userId!)

      // 2. Determine if we have a ready sandbox to fork or need to create on-the-fly
      let repoSandbox = null
      if (repositorySandboxId) {
        repoSandbox = await prisma.teamRepositorySandbox.findUnique({
          where: { id: repositorySandboxId },
        })

        if (!repoSandbox) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Repository sandbox not found",
          })
        }

        if (repoSandbox.team_id !== teamId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Repository sandbox does not belong to this team",
          })
        }
      }

      const isReadySandbox =
        repoSandbox?.setup_status === "ready" && repoSandbox?.sandbox_id
      const repoName = repoSandbox?.repository || repository

      if (!repoName) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Repository name is required",
        })
      }

      // 3. Get installation_id for later sandbox creation (not needed for public imports)
      let effectiveInstallationId: string | undefined =
        repoSandbox?.installation_id || installationId

      if (!effectiveInstallationId && !isPublicImport) {
        // Look up installation from team's github_integration
        const githubIntegration =
          team.github_integration as unknown as GitHubIntegration
        effectiveInstallationId =
          getInstallationForRepo(githubIntegration, repoName) ?? undefined
      }

      if (!effectiveInstallationId && !isPublicImport) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "No GitHub installation found for this repository. Please connect GitHub first.",
        })
      }

      // 4. Create sandbox using shared function
      const sandboxResult = await createAgentSandbox({
        userId: ctx.auth.userId!,
        repository: repoName,
        installationId: effectiveInstallationId,
        branch: input.branch,
        isPublicImport,
        claudeCodeIntegration: team.claude_code_integration as ClaudeCodeIntegration | null,
        linearIntegration: team.linear_integration as LinearIntegration | null,
        forkFromSandboxId: isReadySandbox ? (repoSandbox?.sandbox_id ?? undefined) : undefined,
      })

      const chatSandboxId = sandboxResult.sandboxId

      // 6. Create AgentChat record
      const agentChat = await prisma.agentChat.create({
        data: {
          name: request.slice(0, 50) + (request.length > 50 ? "..." : ""),
          user_id: ctx.auth.userId!,
          team_id: teamId,
          sandbox_id: chatSandboxId,
          credit_source: sandboxResult.usesClaudeCodeOAuth ? "claude_code" : "personal",
          meta: {
            repository: repoName,
            branch: input.branch || null,
            originalSandboxId: isReadySandbox ? repoSandbox?.sandbox_id : null,
            sandboxConfig: isReadySandbox ? repoSandbox?.sandbox_config : null,
            isQuickSetup: !isReadySandbox,
            isPublicImport: isPublicImport || false,
          },
        },
      })

      // 5. Create initial AgentSubChat with UI format messages (AI SDK standard)
      // Build message parts: images first, then text
      const messageParts: Array<
        | { type: "text"; text: string }
        | {
            type: "data-image"
            data: { url: string; mediaType: string; filename?: string }
          }
      > = []

      // Add image parts first
      if (input.images && input.images.length > 0) {
        for (const img of input.images) {
          messageParts.push({
            type: "data-image",
            data: {
              url: img.url,
              mediaType: img.mediaType,
              filename: img.filename,
            },
          })
        }
      }

      // Add text part
      messageParts.push({ type: "text", text: request })

      const subChat = await prisma.agentSubChat.create({
        data: {
          chat_id: agentChat.id,
          name: "Initial request",
          messages: [
            {
              id: crypto.randomUUID(),
              role: "user",
              parts: messageParts,
            },
          ],
        },
      })

      // 7. Return the created chat with sandbox ready
      return {
        chat: agentChat,
        subChat,
        sandboxId: chatSandboxId,
      }
    }),

  // Setup sandbox for a chat (legacy - now sandbox is created synchronously in createAgentChat)
  setupChatSandbox: protectedProcedure
    .input(z.object({ chatId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      // 1. Get the chat with team info
      const chat = await prisma.agentChat.findUnique({
        where: { id: input.chatId },
        include: { team: true },
      })

      if (!chat) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Chat not found" })
      }

      // 2. Verify team access
      await checkTeamAccess(chat.team_id, ctx.auth.userId!)

      const meta = chat.meta as {
        repository?: string
        branch?: string | null
        originalSandboxId?: string | null
        sandboxConfig?: any
        isQuickSetup?: boolean
        isPublicImport?: boolean
        sandboxSetupStatus?: string
        repositorySandboxId?: string | null
        installationId?: string
      } | null

      // 3. If already setup, return early
      if (meta?.sandboxSetupStatus === "ready" && chat.sandbox_id) {
        return { success: true, sandboxId: chat.sandbox_id }
      }

      // 4. If already in progress (another call is handling setup), return early
      if (meta?.sandboxSetupStatus === "in_progress") {
        return { success: true, sandboxId: chat.sandbox_id, inProgress: true }
      }

      // 5. If status is not "cloning" or "error", return early
      if (
        meta?.sandboxSetupStatus !== "cloning" &&
        meta?.sandboxSetupStatus !== "error"
      ) {
        return { success: true, sandboxId: chat.sandbox_id }
      }

      // 6. Atomic compare-and-set: Set status to "in_progress" to claim the lock
      // This prevents race conditions from parallel calls (multiple tabs, retries)
      // Use raw SQL for atomic compare-and-set since Prisma doesn't support JSON path conditions well
      const updateResult = await prisma.$executeRaw`
        UPDATE "agent_chats"
        SET meta = jsonb_set(meta, '{sandboxSetupStatus}', '"in_progress"')
        WHERE id = ${input.chatId}::uuid
          AND (meta->>'sandboxSetupStatus' = 'cloning' OR meta->>'sandboxSetupStatus' = 'error')
      `

      // If no rows updated, another process got the lock or status changed
      if (updateResult === 0) {
        return { success: true, sandboxId: chat.sandbox_id, inProgress: true }
      }

      const repoName = meta?.repository
      const branch = meta?.branch
      const originalSandboxId = meta?.originalSandboxId
      const installationId = meta?.installationId
      const isQuickSetup = meta?.isQuickSetup
      const isPublicImport = meta?.isPublicImport

      if (!repoName) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Repository name not found in chat metadata",
        })
      }

      if (!installationId && !isPublicImport) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Installation ID not found in chat metadata",
        })
      }

      try {
        let chatSandboxId: string

        if (originalSandboxId) {
          // Fork existing ready sandbox
          const forkedSandbox = await codesandboxSdkV2.sandboxes.fork(
            originalSandboxId,
            { vmTier: VMTier.Small },
          )
          chatSandboxId = forkedSandbox.id

          // Sync to selected branch if needed
          if (branch && installationId) {
            const sandboxV1 =
              await codesandboxSdkV1.sandboxes.resume(chatSandboxId)
            const session = await sandboxV1.connect()
            const accessToken = await getInstallationAccessToken(installationId)
            await syncBranch(session, branch, accessToken, repoName)
          }
        } else {
          // Create sandbox on-the-fly
          const sandbox = await codesandboxSdkV2.sandboxes.create({
            id: TEMPLATES["canvas-github"],
            privacy: "public-hosts",
            hibernationTimeoutSeconds: DEFAULT_HIBERNATION_TIMEOUT,
            vmTier: VMTier.Small,
          })
          chatSandboxId = sandbox.id

          // Connect to sandbox
          const sandboxV1 =
            await codesandboxSdkV1.sandboxes.resume(chatSandboxId)
          const session = await sandboxV1.connect()

          // Clone repo
          let cloneUrl: string
          if (isPublicImport) {
            cloneUrl = `https://github.com/${repoName}.git`
          } else {
            const accessToken = await getInstallationAccessToken(installationId!)
            cloneUrl = `https://x-access-token:${accessToken}@github.com/${repoName}.git`
          }
          const branchFlag = branch ? `--branch "${branch}"` : ""
          const cloneResult = await session.commands.run(
            `git clone --depth 50 ${branchFlag} ${cloneUrl} ./repo`,
          )

          if (String(cloneResult).includes("empty repository")) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "This repository is empty. Please push some code first.",
            })
          }

          // Save file tree for @ mentions (non-blocking)
          saveRepositoryFileTree(chat.team_id, repoName).catch(() => {})
        }

        // 5. Update chat with sandbox_id and status
        await prisma.agentChat.update({
          where: { id: input.chatId },
          data: {
            sandbox_id: chatSandboxId,
            meta: {
              ...meta,
              sandboxSetupStatus: "ready",
              sandboxSetupError: null,
            },
          },
        })

        return { success: true, sandboxId: chatSandboxId }
      } catch (error) {
        // Update status to error
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error"
        await prisma.agentChat.update({
          where: { id: input.chatId },
          data: {
            meta: {
              ...meta,
              sandboxSetupStatus: "error",
              sandboxSetupError: errorMessage,
            },
          },
        })

        if (error instanceof TRPCError) throw error
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to setup sandbox: ${errorMessage}`,
        })
      }
    }),

  // Create PR from agent chat changes
  createAgentPr: protectedProcedure
    .input(
      z.object({
        chatId: z.string().uuid(),
        repository: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Find the agent chat
      const chat = await prisma.agentChat.findFirst({
        where: {
          id: input.chatId,
          deleted_at: null,
        },
        include: {
          team: true,
        },
      })

      if (!chat) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Chat not found",
        })
      }

      // Verify team access
      await checkTeamAccess(chat.team_id, ctx.auth.userId!)

      const team = chat.team
      if (!team) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Chat is not linked to a team",
        })
      }

      const githubIntegration =
        team.github_integration as unknown as GitHubIntegration

      const sandboxId = chat.sandbox_id
      if (!sandboxId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No sandbox associated with this chat",
        })
      }

      // Get repository from input or chat meta
      const chatMeta = chat.meta as { repository?: string } | null
      let repository = input.repository || chatMeta?.repository

      if (!repository) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No repository configured for this chat",
        })
      }

      // Resolve correct installation_id for this repo's org
      const repoInstallationId = getInstallationForRepo(githubIntegration, repository)
      if (!repoInstallationId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No GitHub installation found for this repository. Please connect GitHub first.",
        })
      }

      // Connect to e2b sandbox
      const sbx = await Sandbox.connect(sandboxId, {
        timeoutMs: 1_800_000, // 30 min
      })

      // Helper to run commands in repo directory (e2b uses /home/user/repo)
      const runInRepo = async (command: string) => {
        const result = await sbx.commands.run(
          `cd /home/user/repo && ${command}`,
        )
        return (result.stdout || result.stderr || "").trim()
      }

      // Create a wrapper session for branch-utils functions (adapts paths for e2b)
      const e2bSession = {
        commands: {
          run: async (command: string) => {
            // Replace relative paths with absolute paths for e2b
            const e2bCommand = command
              .replace(/cd repo\b/g, "cd /home/user/repo")
              .replace(/cd \.\/repo\b/g, "cd /home/user/repo")
            const result = await sbx.commands.run(e2bCommand)
            return (result.stdout || result.stderr || "").trim()
          },
        },
      }

      // Refresh token for git operations
      await refreshToken({
        session: e2bSession,
        installationId: repoInstallationId,
        repository,
      })

      const prBranch = getPrBranch(input.chatId)
      let baseBranch = ""
      let prTitle = ""
      let prDescription = ""

      const MAX_DIFF_LENGTH = 80000
      const MAX_TITLE_LENGTH = 300
      const MAX_DESCRIPTION_LENGTH = 3000

      // Auto-commit pending changes
      await runInRepo(
        `git config user.email "ai@21st.dev" && git config user.name "21st AI" && git add -A && git commit --no-verify -m "${prBranch}"`,
      ).catch(() => {}) // Throws on "nothing to commit"

      try {
        // Determine the base ref for diff
        const baseRefResult = await runInRepo(
          `(git rev-parse --verify origin/HEAD 2>/dev/null && echo "origin/HEAD") || (git rev-parse --verify origin/main 2>/dev/null && echo "origin/main") || (git rev-parse --verify origin/master 2>/dev/null && echo "origin/master") || echo "NONE"`,
        )
        const baseRef =
          baseRefResult?.trim().split("\n").pop()?.trim() || "NONE"

        if (baseRef === "NONE") {
          throw new Error(
            "No valid base ref found (origin/HEAD, origin/main, or origin/master)",
          )
        }

        // Get diff for AI analysis
        const excludePaths = [
          "node_modules",
          ".next",
          "dist",
          "build",
          ".git",
          "coverage",
          ".turbo",
          "*.lock",
          "pnpm-lock.yaml",
          "package-lock.json",
          "yarn.lock",
        ]
        const excludeArgs = excludePaths
          .map((p) => `":(exclude)${p}"`)
          .join(" ")
        const diff = await runInRepo(
          `git --no-pager diff ${baseRef}...HEAD -- . ${excludeArgs}`,
        )

        // Generate PR metadata using AI
        if (diff?.trim()) {
          const { object: prMetadata } = await generateObject({
            ...fulfillModel("gemini-2.5-flash"),
            schema: z.object({
              branchName: z
                .string()
                .describe(
                  "Kebab-case branch name, max 50 chars, no special characters except hyphens",
                ),
              title: z
                .string()
                .describe("Concise PR title using conventional commit style"),
              description: z
                .string()
                .describe(
                  "Markdown-formatted PR description with a brief summary and bullet points",
                ),
            }),
            prompt: `Analyze this git diff and generate appropriate PR metadata.

Generate:
1. A concise, descriptive branch name in kebab-case (e.g., "add-user-auth")
2. A PR title using conventional commit style. Limit: ${MAX_TITLE_LENGTH} characters.
3. A PR description that is concise - include a brief summary and key changes as bullet points. Limit: ${MAX_DESCRIPTION_LENGTH} characters.

Git diff:
\`\`\`
${truncateText(diff, MAX_DIFF_LENGTH, "\n\n**(diff truncated)**")}
\`\`\`
`,
            temperature: 0.3,
          })

          prTitle = prMetadata.title
          prDescription = prMetadata.description
        }
      } catch (aiError) {
        console.warn("[createAgentPr] AI generation failed:", aiError)
      }

      try {
        baseBranch = (
          await runInRepo("git rev-parse --abbrev-ref HEAD")
        )?.trim()
        if (!baseBranch) {
          throw new Error("Cannot determine current branch")
        }

        // Push to PR branch
        await pushToPrBranch({
          session: e2bSession,
          chatId: input.chatId,
          forcePush: true,
        })

        // Build PR URL
        let prUrl = `https://github.com/${repository}/compare/${encodeURIComponent(prBranch)}?quick_pull=1`
        if (prTitle) {
          prUrl += `&title=${encodeURIComponent(truncateText(prTitle, MAX_TITLE_LENGTH, ""))}`
        }
        if (prDescription) {
          prUrl += `&body=${encodeURIComponent(truncateText(prDescription, MAX_DESCRIPTION_LENGTH, ""))}`
        }

        return {
          success: true,
          prUrl,
          branch: prBranch,
          baseBranch,
          title: prTitle || undefined,
          description: prDescription || undefined,
        }
      } catch (error) {
        console.error("[createAgentPr] Failed to create PR:", error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to prepare PR: ${error instanceof Error ? error.message : String(error)}`,
        })
      }
    }),
})
