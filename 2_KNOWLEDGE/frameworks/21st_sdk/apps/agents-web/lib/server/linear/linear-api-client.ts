/**
 * Centralized Linear API client with automatic token refresh
 * Use this for ALL Linear API calls to ensure tokens are refreshed on 401
 */

import { prisma } from "@/lib/prisma"
import { decryptLinearToken, encryptLinearToken } from "@/lib/server/crypto"
import { LINEAR_OAUTH, type LinearIntegration } from "@/lib/linear"

interface LinearApiResponse<T> {
  data?: T
  errors?: Array<{ message: string }>
}

/**
 * Refresh Linear access token using refresh token
 */
async function refreshLinearToken(
  teamId: string,
  integration: LinearIntegration
): Promise<string> {
  console.log(`[Linear API] Refreshing token for team ${teamId}`)
  console.log(`[Linear API] Integration connectedAt: ${integration.connectedAt}`)
  console.log(`[Linear API] Integration workspaceId: ${integration.workspaceId}`)
  console.log(`[Linear API] Encrypted refreshToken (first 20 chars): ${integration.refreshToken?.substring(0, 20)}...`)

  const refreshToken = decryptLinearToken(integration.refreshToken)
  console.log(`[Linear API] Decrypted refreshToken (first 10 chars): ${refreshToken?.substring(0, 10)}...`)

  const response = await fetch(LINEAR_OAUTH.tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: process.env.LINEAR_CLIENT_ID || "",
      client_secret: process.env.LINEAR_CLIENT_SECRET || "",
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error(`[Linear API] Token refresh failed:`, error)
    console.error(`[Linear API] Response status: ${response.status} ${response.statusText}`)
    throw new Error(`Failed to refresh Linear token: ${response.statusText}`)
  }

  const tokens = await response.json()
  console.log(`[Linear API] Token refreshed successfully`)
  console.log(`[Linear API] New accessToken (first 10 chars): ${tokens.access_token?.substring(0, 10)}...`)

  // Update stored tokens
  const encryptedAccessToken = encryptLinearToken(tokens.access_token)
  const encryptedRefreshToken = encryptLinearToken(tokens.refresh_token)

  const updatedIntegration: LinearIntegration = {
    ...integration,
    accessToken: encryptedAccessToken,
    refreshToken: encryptedRefreshToken,
  }

  // Update this team
  await prisma.team.update({
    where: { id: teamId },
    data: { linear_integration: updatedIntegration as any },
  })

  console.log(`[Linear API] Updated team ${teamId} with new tokens`)

  // IMPORTANT: Also update ALL other teams with the same workspaceId + linearUserId
  // This is because Linear tokens are per-user, so refreshing invalidates ALL old tokens
  // for that user across all teams they're connected to
  if (integration.workspaceId && integration.linearUserId) {
    const otherTeams = await prisma.team.findMany({
      where: {
        id: { not: teamId },
        linear_integration: {
          path: ["workspaceId"],
          equals: integration.workspaceId,
        },
      },
      select: { id: true, linear_integration: true },
    })

    // Filter to teams with the same linearUserId
    const teamsToUpdate = otherTeams.filter((t) => {
      const otherIntegration = t.linear_integration as unknown as LinearIntegration | null
      return otherIntegration?.linearUserId === integration.linearUserId
    })

    if (teamsToUpdate.length > 0) {
      console.log(`[Linear API] Updating ${teamsToUpdate.length} other team(s) with same Linear user`)

      for (const otherTeam of teamsToUpdate) {
        const otherIntegration = otherTeam.linear_integration as unknown as LinearIntegration
        await prisma.team.update({
          where: { id: otherTeam.id },
          data: {
            linear_integration: {
              ...otherIntegration,
              accessToken: encryptedAccessToken,
              refreshToken: encryptedRefreshToken,
            } as any,
          },
        })
        console.log(`[Linear API] Updated team ${otherTeam.id} with shared tokens`)
      }
    }
  }

  return tokens.access_token
}

/**
 * Get Linear access token for a team, optionally forcing refresh
 */
async function getAccessToken(
  teamId: string,
  forceRefresh = false
): Promise<{ token: string; integration: LinearIntegration }> {
  console.log(`[Linear API] getAccessToken called: teamId=${teamId}, forceRefresh=${forceRefresh}`)

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: { linear_integration: true },
  })

  const integration = team?.linear_integration as LinearIntegration | null

  console.log(`[Linear API] Fetched integration from DB:`)
  console.log(`[Linear API]   - status: ${integration?.status}`)
  console.log(`[Linear API]   - connectedAt: ${integration?.connectedAt}`)
  console.log(`[Linear API]   - workspaceId: ${integration?.workspaceId}`)
  console.log(`[Linear API]   - hasAccessToken: ${!!integration?.accessToken}`)
  console.log(`[Linear API]   - hasRefreshToken: ${!!integration?.refreshToken}`)
  console.log(`[Linear API]   - encryptedAccessToken (first 20): ${integration?.accessToken?.substring(0, 20)}...`)

  if (!integration?.accessToken) {
    throw new Error("Linear not connected for this team")
  }

  if (forceRefresh) {
    console.log(`[Linear API] Force refreshing token...`)
    const token = await refreshLinearToken(teamId, integration)
    return { token, integration }
  }

  const decryptedToken = decryptLinearToken(integration.accessToken)
  console.log(`[Linear API] Using existing token (first 10 chars): ${decryptedToken?.substring(0, 10)}...`)
  console.log(`[Linear API] Token length: ${decryptedToken?.length}`)

  return { token: decryptedToken, integration }
}

/**
 * Execute a Linear GraphQL query with automatic token refresh on 401
 *
 * @param teamId - The team ID to use for token lookup
 * @param query - GraphQL query string
 * @param variables - Optional query variables
 * @returns The data from the response, or null if failed
 *
 * @example
 * const data = await linearQuery<{ projects: { nodes: Project[] } }>(
 *   teamId,
 *   `query { projects(first: 100) { nodes { id name } } }`
 * )
 */
export async function linearQuery<T>(
  teamId: string,
  query: string,
  variables?: Record<string, unknown>
): Promise<T | null> {
  console.log(`[Linear API] linearQuery called for team ${teamId}`)
  console.log(`[Linear API] Query: ${query.substring(0, 100)}...`)

  for (const attempt of [1, 2]) {
    const forceRefresh = attempt === 2
    console.log(`[Linear API] Attempt ${attempt}, forceRefresh=${forceRefresh}`)

    try {
      const { token } = await getAccessToken(teamId, forceRefresh)
      console.log(`[Linear API] Got token, making API request...`)

      const response = await fetch(LINEAR_OAUTH.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query, variables }),
      })

      console.log(`[Linear API] Response status: ${response.status} ${response.statusText}`)

      if (response.ok) {
        const result: LinearApiResponse<T> = await response.json()

        if (result.errors?.length) {
          console.error(`[Linear API] GraphQL errors:`, result.errors)
          return null
        }

        console.log(`[Linear API] Query successful`)
        return result.data ?? null
      }

      // If 401 and first attempt, try refreshing token
      if (response.status === 401 && attempt === 1) {
        console.log(`[Linear API] Got 401, will refresh token and retry`)
        continue
      }

      console.error(`[Linear API] Request failed: ${response.statusText}`)
      return null
    } catch (error) {
      console.error(`[Linear API] Error on attempt ${attempt}:`, error)
      if (attempt === 2) return null
    }
  }

  return null
}

/**
 * Execute a Linear GraphQL mutation with automatic token refresh on 401
 * Throws on failure (unlike linearQuery which returns null)
 *
 * @param teamId - The team ID to use for token lookup
 * @param mutation - GraphQL mutation string
 * @param variables - Mutation variables
 * @returns The data from the response
 * @throws Error if the mutation fails
 *
 * @example
 * const data = await linearMutation<{ commentCreate: { success: boolean } }>(
 *   teamId,
 *   `mutation AddComment($input: CommentCreateInput!) {
 *     commentCreate(input: $input) { success comment { id } }
 *   }`,
 *   { input: { issueId, body } }
 * )
 */
export async function linearMutation<T>(
  teamId: string,
  mutation: string,
  variables: Record<string, unknown>
): Promise<T> {
  for (const attempt of [1, 2]) {
    const forceRefresh = attempt === 2

    const { token } = await getAccessToken(teamId, forceRefresh)

    const response = await fetch(LINEAR_OAUTH.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query: mutation, variables }),
    })

    if (response.ok) {
      const result: LinearApiResponse<T> = await response.json()

      if (result.errors?.length) {
        throw new Error(`Linear API error: ${result.errors[0]?.message}`)
      }

      if (!result.data) {
        throw new Error("Linear API returned no data")
      }

      return result.data
    }

    // If 401 and first attempt, try refreshing token
    if (response.status === 401 && attempt === 1) {
      console.log(`[Linear API] Got 401, will refresh token and retry`)
      continue
    }

    throw new Error(`Linear API request failed: ${response.statusText}`)
  }

  throw new Error("Linear API request failed after retry")
}

/**
 * Check if a team has a valid Linear connection
 * Returns the integration if valid, null otherwise
 */
export async function getLinearIntegration(
  teamId: string
): Promise<LinearIntegration | null> {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: { linear_integration: true },
  })

  const integration = team?.linear_integration as LinearIntegration | null

  if (!integration?.accessToken || integration.status !== "active") {
    return null
  }

  return integration
}
