import { z } from "zod"
import { TRPCError } from "@trpc/server"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { codesandboxSdkV2 } from "@/lib/codesandbox-sdk-v2"
import { codesandboxSdk } from "@/lib/codesandbox-sdk-v1"
import { VMTier } from "codesandbox-sdk-v1"
import { DEFAULT_HIBERNATION_TIMEOUT } from "@/lib/codesandbox-sdk-v11"
import { encryptClaudeCodeCredentials } from "@/lib/server/crypto"
import { checkTeamAccess } from "@/server/api/routers/teams/utils"
import { prisma } from "@/lib/prisma"
import type {
  ClaudeCodeIntegration,
  AuthStartResponse,
  AuthStatusResponse,
} from "@/lib/claude-code"

// The auth service sandbox template ID (same as canvas-github)
const CLAUDE_CODE_AUTH_SANDBOX = "pt_JQUYmArdWgDeMgWcpr5Xth"

async function postWithSandboxReadiness(
  url: string,
  init: RequestInit = {},
  { timeoutMs = 30_000, intervalMs = 1500 } = {},
): Promise<Response> {
  const start = Date.now()
  let lastStatus = "no response"

  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, init)
      if (res.status !== 502 && res.status !== 503 && res.status !== 504) {
        return res
      }
      lastStatus = `${res.status} ${res.statusText}`
    } catch (error) {
      lastStatus = error instanceof Error ? error.message : String(error)
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs))
  }

  throw new Error(`Sandbox not ready after ${timeoutMs}ms (last: ${lastStatus})`)
}

export const claudeCodeRouter = createTRPCRouter({
  // Check if team has Claude Code connected
  getIntegration: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ input, ctx }) => {
      console.log("[ClaudeCode] getIntegration called for team:", input.teamId)
      const { team } = await checkTeamAccess(input.teamId, ctx.auth.userId!)
      const integration = team.claude_code_integration as ClaudeCodeIntegration | null

      const isConnected = integration?.status === "active" && Boolean(integration?.oauthToken)
      console.log("[ClaudeCode] getIntegration result:", {
        teamId: input.teamId,
        isConnected,
        hasToken: Boolean(integration?.oauthToken),
        status: integration?.status,
      })

      return {
        isConnected,
        connectedAt: integration?.connected_at ?? null,
        connectedByUserId: integration?.connected_by_user_id ?? null,
      }
    }),

  // Start auth flow - create sandbox from template, start auth session
  startAuth: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      console.log("[ClaudeCode] startAuth called for team:", input.teamId)
      await checkTeamAccess(input.teamId, ctx.auth.userId!)

      try {
        // 1. Create the auth service sandbox from template
        console.log("[ClaudeCode] Creating auth sandbox from template:", CLAUDE_CODE_AUTH_SANDBOX)
        const sandbox = await codesandboxSdkV2.sandboxes.create({
          id: CLAUDE_CODE_AUTH_SANDBOX,
          privacy: "public-hosts",
          hibernationTimeoutSeconds: DEFAULT_HIBERNATION_TIMEOUT,
          vmTier: VMTier.Nano,
        })
        console.log("[ClaudeCode] Sandbox created:", sandbox.id)

        // 2. Connect to sandbox and get URL
        console.log("[ClaudeCode] Connecting to sandbox...")
        const sandboxInstance = await codesandboxSdk.sandboxes.resume(sandbox.id)
        const session = await sandboxInstance.connect()
        const sandboxUrl = session.hosts.getUrl(3000)
        console.log("[ClaudeCode] Sandbox connected, URL:", sandboxUrl)

        // 3. Start auth session on the sandbox
        // CSB `connect()` waits for VM but not for the dev server on port 3000.
        console.log("[ClaudeCode] Starting auth session...")
        const startRes = await postWithSandboxReadiness(`${sandboxUrl}/api/auth/start`, {
          method: "POST",
        })

        if (!startRes.ok) {
          console.error("[ClaudeCode] Auth start failed:", startRes.status, startRes.statusText)
          throw new Error(`Failed to start auth: ${startRes.statusText}`)
        }

        const { sessionId } = (await startRes.json()) as AuthStartResponse
        console.log("[ClaudeCode] Auth session started, sessionId:", sessionId)

        return {
          sandboxId: sandbox.id,
          sandboxUrl,
          sessionId,
        }
      } catch (error) {
        console.error("[ClaudeCode] Failed to start auth:", error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to start authentication",
          cause: error,
        })
      }
    }),

  // Poll for OAuth URL
  pollAuthStatus: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
        sandboxUrl: z.string(),
        sessionId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)

      try {
        const res = await fetch(
          `${input.sandboxUrl}/api/auth/${input.sessionId}/status`
        )

        if (!res.ok) {
          console.error("[ClaudeCode] Poll status failed:", res.status, res.statusText)
          throw new Error(`Status check failed: ${res.statusText}`)
        }

        const data = (await res.json()) as AuthStatusResponse
        console.log("[ClaudeCode] Poll status result:", {
          sessionId: input.sessionId,
          state: data.state,
          hasOauthUrl: Boolean(data.oauthUrl),
        })

        return {
          state: data.state,
          oauthUrl: data.oauthUrl ?? null,
          error: data.error ?? null,
        }
      } catch (error) {
        console.error("[ClaudeCode] Failed to poll auth status:", error)
        return {
          state: "error" as const,
          oauthUrl: null,
          error: error instanceof Error ? error.message : "Failed to check status",
        }
      }
    }),

  // Submit auth code
  submitCode: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
        sandboxId: z.string(),
        sandboxUrl: z.string(),
        sessionId: z.string(),
        code: z.string().min(1, "Code is required"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      console.log("[ClaudeCode] submitCode called for team:", input.teamId, "sessionId:", input.sessionId)
      await checkTeamAccess(input.teamId, ctx.auth.userId!)

      try {
        // Submit code to sandbox
        console.log("[ClaudeCode] Submitting auth code to sandbox...")
        const codeRes = await fetch(
          `${input.sandboxUrl}/api/auth/${input.sessionId}/code`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: input.code }),
          }
        )

        if (!codeRes.ok) {
          console.error("[ClaudeCode] Code submission failed:", codeRes.status, codeRes.statusText)
          throw new Error(`Code submission failed: ${codeRes.statusText}`)
        }
        console.log("[ClaudeCode] Code submitted successfully")

        // Poll for OAuth token (max 10 seconds)
        console.log("[ClaudeCode] Polling for OAuth token...")
        let oauthToken: string | null = null

        for (let i = 0; i < 10; i++) {
          await new Promise((r) => setTimeout(r, 1000))

          const statusRes = await fetch(
            `${input.sandboxUrl}/api/auth/${input.sessionId}/status`
          )

          if (!statusRes.ok) {
            console.error("[ClaudeCode] Status check failed:", statusRes.status, statusRes.statusText)
            continue
          }

          const status = (await statusRes.json()) as AuthStatusResponse
          console.log("[ClaudeCode] Poll status:", {
            attempt: i + 1,
            state: status.state,
            hasToken: Boolean(status.oauthToken),
          })

          if (status.state === "success" && status.oauthToken) {
            oauthToken = status.oauthToken
            console.log("[ClaudeCode] OAuth token received!")
            break
          }

          if (status.state === "error") {
            console.error("[ClaudeCode] Auth error:", status.error)
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: status.error || "Authentication failed",
            })
          }
        }

        if (!oauthToken) {
          console.error("[ClaudeCode] Timeout waiting for OAuth token")
          throw new TRPCError({
            code: "TIMEOUT",
            message: "Timeout waiting for OAuth token - please try again",
          })
        }

        // Validate token format
        if (!oauthToken.startsWith("sk-ant-oat01-")) {
          console.error("[ClaudeCode] Invalid token format:", oauthToken.substring(0, 20))
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid OAuth token format received",
          })
        }

        // Encrypt and store
        console.log("[ClaudeCode] Encrypting and storing OAuth token...")
        const encryptedToken = encryptClaudeCodeCredentials(oauthToken)

        const integrationData: ClaudeCodeIntegration = {
          oauthToken: encryptedToken,
          sandbox_id: input.sandboxId,
          status: "active",
          connected_at: new Date().toISOString(),
          connected_by_user_id: ctx.auth.userId!,
        }

        await prisma.team.update({
          where: { id: input.teamId },
          data: {
            claude_code_integration: integrationData as any, // Prisma JSON field
          },
        })

        console.log("[ClaudeCode] Successfully connected Claude Code for team:", input.teamId)
        return { success: true }
      } catch (error) {
        console.error("[ClaudeCode] Failed to submit code:", error)

        if (error instanceof TRPCError) throw error

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to complete authentication",
          cause: error,
        })
      }
    }),

  // Disconnect integration
  disconnect: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      console.log("[ClaudeCode] disconnect called for team:", input.teamId)
      await checkTeamAccess(input.teamId, ctx.auth.userId!)

      try {
        await prisma.team.update({
          where: { id: input.teamId },
          data: {
            claude_code_integration: {} as any, // Clear integration
          },
        })

        console.log("[ClaudeCode] Successfully disconnected Claude Code for team:", input.teamId)
        return { success: true }
      } catch (error) {
        console.error("[ClaudeCode] Failed to disconnect:", error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to disconnect integration",
          cause: error,
        })
      }
    }),
})
