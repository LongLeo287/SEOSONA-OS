import { z } from "zod"
import { TRPCError } from "@trpc/server"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { checkTeamAccess } from "@/server/api/routers/teams/utils"
import { prisma } from "@/lib/prisma"
import { encryptLinearToken, decryptLinearToken } from "@/lib/server/crypto"
import {
  type LinearIntegration,
  type LinearTokenResponse,
  type LinearUser,
  type LinearOrganization,
  buildLinearAuthUrl,
  LINEAR_OAUTH,
} from "@/lib/linear"
import { linearQuery } from "@/lib/server/linear/linear-api-client"

function getLinearConfig() {
  const clientId = process.env.LINEAR_CLIENT_ID
  const clientSecret = process.env.LINEAR_CLIENT_SECRET

  // Use localhost in development, production URL otherwise
  const baseUrl = process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://21st.dev"
  const redirectUri = `${baseUrl}/integrations/callback/linear`

  if (!clientId || !clientSecret) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Linear OAuth not configured",
    })
  }

  return { clientId, clientSecret, redirectUri }
}

export const linearRouter = createTRPCRouter({
  // Get current integration status
  getIntegration: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ input, ctx }) => {
      const { team } = await checkTeamAccess(input.teamId, ctx.auth.userId!)
      let integration = team.linear_integration as LinearIntegration | null

      const isConnected =
        integration?.status === "active" && Boolean(integration?.accessToken)

      // Fetch missing urlKey for existing connections (with token refresh)
      if (isConnected && integration?.accessToken && !integration?.workspaceUrlKey) {
        try {
          const orgData = await linearQuery<{
            organization: { id: string; name: string; urlKey: string }
          }>(
            input.teamId,
            `query { organization { id name urlKey } }`
          )

          if (orgData?.organization?.urlKey) {
            // Update stored integration with urlKey
            integration = { ...integration, workspaceUrlKey: orgData.organization.urlKey }
            await prisma.team.update({
              where: { id: input.teamId },
              data: { linear_integration: integration as any },
            })
          }
        } catch (e) {
          console.error("[Linear] Failed to fetch urlKey:", e)
        }
      }

      // Build manage URL for Linear app settings
      let manageUrl: string | null = null
      if (isConnected) {
        const clientId = process.env.LINEAR_CLIENT_ID
        if (integration?.workspaceUrlKey && clientId) {
          manageUrl = `https://linear.app/${integration.workspaceUrlKey}/settings/applications/${clientId}`
        } else {
          // Fallback to general applications page
          manageUrl = "https://linear.app/settings/applications/"
        }
      }

      return {
        isConnected,
        workspaceName: integration?.workspaceName ?? null,
        workspaceUrlKey: integration?.workspaceUrlKey ?? null,
        linearUserName: integration?.linearUserName ?? null,
        linearUserEmail: integration?.linearUserEmail ?? null,
        connectedAt: integration?.connectedAt ?? null,
        defaultRepository: integration?.defaultRepository ?? null,
        manageUrl,
      }
    }),

  // Get OAuth authorization URL
  getAuthUrl: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)
      const { clientId, redirectUri } = getLinearConfig()

      // State contains teamId and userId for callback verification
      const state = Buffer.from(
        JSON.stringify({
          teamId: input.teamId,
          userId: ctx.auth.userId,
        })
      ).toString("base64")

      const authUrl = buildLinearAuthUrl({
        clientId,
        redirectUri,
        state,
        scope: "read,write,issues:create,comments:create,timeSchedule:write,app:assignable,app:mentionable,initiative:read,initiative:write,customer:read,customer:write",
        actor: "app",
      })

      return { authUrl }
    }),

  // Disconnect Linear integration
  disconnect: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { team } = await checkTeamAccess(input.teamId, ctx.auth.userId!)
      const integration = team.linear_integration as LinearIntegration | null

      if (integration?.accessToken) {
        const accessToken = decryptLinearToken(integration.accessToken)

        // Revoke token (webhook is app-level, no need to delete)
        try {
          await fetch(LINEAR_OAUTH.revokeUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              token: accessToken,
            }),
          })
        } catch (error) {
          console.error("[Linear] Failed to revoke token:", error)
        }
      }

      await prisma.team.update({
        where: { id: input.teamId },
        data: {
          linear_integration: {},
        },
      })

      return { success: true }
    }),

  // Refresh access token (called when token expires)
  refreshToken: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { team } = await checkTeamAccess(input.teamId, ctx.auth.userId!)
      const integration = team.linear_integration as LinearIntegration | null

      if (!integration?.refreshToken) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No Linear integration found",
        })
      }

      const { clientId, clientSecret } = getLinearConfig()
      const refreshToken = decryptLinearToken(integration.refreshToken)

      const response = await fetch(LINEAR_OAUTH.tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          client_id: clientId,
          client_secret: clientSecret,
        }),
      })

      if (!response.ok) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to refresh Linear token",
        })
      }

      const tokens = (await response.json()) as LinearTokenResponse

      const encryptedAccessToken = encryptLinearToken(tokens.access_token)
      const encryptedRefreshToken = encryptLinearToken(tokens.refresh_token)

      const updatedIntegration: LinearIntegration = {
        ...integration,
        accessToken: encryptedAccessToken,
        refreshToken: encryptedRefreshToken,
      }

      await prisma.team.update({
        where: { id: input.teamId },
        data: {
          linear_integration: updatedIntegration as any,
        },
      })

      // Also update other teams with the same Linear user (tokens are per-user)
      if (integration.workspaceId && integration.linearUserId) {
        const otherTeams = await prisma.team.findMany({
          where: {
            id: { not: input.teamId },
            linear_integration: {
              path: ["workspaceId"],
              equals: integration.workspaceId,
            },
          },
          select: { id: true, linear_integration: true },
        })

        for (const otherTeam of otherTeams) {
          const otherInt = otherTeam.linear_integration as unknown as LinearIntegration | null
          if (otherInt?.linearUserId === integration.linearUserId) {
            await prisma.team.update({
              where: { id: otherTeam.id },
              data: {
                linear_integration: {
                  ...otherInt,
                  accessToken: encryptedAccessToken,
                  refreshToken: encryptedRefreshToken,
                } as any,
              },
            })
          }
        }
      }

      return { success: true }
    }),

  // Start agent with selected repository (from select-repo page)
  startAgentWithRepo: protectedProcedure
    .input(
      z.object({
        issueId: z.string(),
        teamId: z.string().uuid(),
        repository: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)

      const baseUrl =
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000"
          : "https://21st.dev"

      // Call the internal start-agent API
      const response = await fetch(`${baseUrl}/api/linear/start-agent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-internal-token": process.env.INTERNAL_API_SECRET || "",
        },
        body: JSON.stringify({
          teamId: input.teamId,
          issueId: input.issueId,
          repository: input.repository,
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to start agent: ${error}`,
        })
      }

      const result = await response.json()
      return { chatId: result.chatId }
    }),

  // Set default repository for Linear integration
  setDefaultRepository: protectedProcedure
    .input(
      z.object({
        teamId: z.string().uuid(),
        repository: z.string().nullable(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { team } = await checkTeamAccess(input.teamId, ctx.auth.userId!)

      const integration = team.linear_integration as LinearIntegration | null

      if (!integration) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Linear not connected",
        })
      }

      await prisma.team.update({
        where: { id: input.teamId },
        data: {
          linear_integration: {
            ...integration,
            defaultRepository: input.repository,
          } as any,
        },
      })

      return { success: true }
    }),

  // Get Linear projects for automation filters
  getProjects: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)

      const data = await linearQuery<{
        projects: { nodes: Array<{ id: string; name: string; icon: string; color: string }> }
      }>(
        input.teamId,
        `query { projects(first: 100) { nodes { id name icon color } } }`
      )

      return { projects: data?.projects?.nodes || [] }
    }),

  // Get Linear teams for automation filters
  getTeams: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)

      const data = await linearQuery<{
        teams: { nodes: Array<{ id: string; name: string; key: string; icon: string; color: string }> }
      }>(
        input.teamId,
        `query { teams(first: 100) { nodes { id name key icon color } } }`
      )

      return { teams: data?.teams?.nodes || [] }
    }),

  // Get Linear labels for automation filters
  getLabels: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)

      const data = await linearQuery<{
        issueLabels: { nodes: Array<{ id: string; name: string; color: string }> }
      }>(
        input.teamId,
        `query { issueLabels(first: 100) { nodes { id name color } } }`
      )

      return { labels: data?.issueLabels?.nodes || [] }
    }),

  // Get Linear users for automation filters
  getUsers: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)

      const data = await linearQuery<{
        users: { nodes: Array<{ id: string; name: string; email: string; avatarUrl: string }> }
      }>(
        input.teamId,
        `query { users(first: 100) { nodes { id name email avatarUrl } } }`
      )

      return { users: data?.users?.nodes || [] }
    }),

  // Get Linear workflow states for automation filters
  getStates: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)

      const data = await linearQuery<{
        workflowStates: { nodes: Array<{ id: string; name: string; color: string; type: string }> }
      }>(
        input.teamId,
        `query { workflowStates(first: 100) { nodes { id name color type } } }`
      )

      return { states: data?.workflowStates?.nodes || [] }
    }),
})

/**
 * Exchange authorization code for tokens
 * Called from the OAuth callback route
 */
export async function exchangeLinearCode(code: string): Promise<LinearTokenResponse> {
  const { clientId, clientSecret, redirectUri } = getLinearConfig()

  const response = await fetch(LINEAR_OAUTH.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error("[Linear] Token exchange failed:", error)
    throw new Error(`Token exchange failed: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Get current user info from Linear API
 */
export async function getLinearUser(accessToken: string): Promise<LinearUser> {
  const response = await fetch(LINEAR_OAUTH.apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      query: `
        query {
          viewer {
            id
            name
            email
          }
        }
      `,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to fetch Linear user")
  }

  const data = await response.json()
  return data.data.viewer
}

/**
 * Get organization info from Linear API
 */
export async function getLinearOrganization(
  accessToken: string
): Promise<LinearOrganization> {
  const response = await fetch(LINEAR_OAUTH.apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      query: `
        query {
          organization {
            id
            name
            urlKey
            logoUrl
            createdAt
            userCount
          }
        }
      `,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to fetch Linear organization")
  }

  const data = await response.json()
  return data.data.organization
}
