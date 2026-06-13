/**
 * Linear integration types and utilities
 */

export interface LinearIntegration {
  // OAuth tokens (encrypted)
  accessToken: string
  refreshToken: string

  // Linear workspace info
  workspaceId: string
  workspaceName: string
  workspaceUrlKey?: string // URL slug for workspace (e.g., "21stdev")

  // User who authorized (used to detect issue assignments)
  linearUserId: string
  linearUserName: string
  linearUserEmail: string

  // Metadata
  status: "active" | "disconnected"
  connectedAt: string
  connectedByUserId: string

  // Default repository for this team (e.g., "owner/repo-name")
  defaultRepository?: string
}

export interface LinearTokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  scope: string
}

export interface LinearUser {
  id: string
  name: string
  email: string
}

export interface LinearOrganization {
  id: string
  name: string
  urlKey: string
}

/**
 * Check if team has Linear connected
 */
export function isLinearConnected(
  integration: LinearIntegration | null | undefined
): boolean {
  return integration?.status === "active" && Boolean(integration?.accessToken)
}

/**
 * Get Linear credentials for API calls
 * Returns null if not connected
 */
export function getLinearCredentials(
  integration: LinearIntegration | null | undefined,
  decryptFn: (encrypted: string) => string
): { accessToken: string; refreshToken: string } | null {
  if (!isLinearConnected(integration) || !integration?.accessToken) {
    return null
  }

  try {
    const accessToken = decryptFn(integration.accessToken)
    const refreshToken = decryptFn(integration.refreshToken)
    return { accessToken, refreshToken }
  } catch {
    return null
  }
}

/**
 * Linear OAuth URLs
 */
export const LINEAR_OAUTH = {
  authorizeUrl: "https://linear.app/oauth/authorize",
  tokenUrl: "https://api.linear.app/oauth/token",
  revokeUrl: "https://api.linear.app/oauth/revoke",
  apiUrl: "https://api.linear.app/graphql",
} as const

/**
 * Build Linear OAuth authorization URL
 */
export function buildLinearAuthUrl(params: {
  clientId: string
  redirectUri: string
  state: string
  scope?: string
  actor?: "app" | "user"
}): string {
  const url = new URL(LINEAR_OAUTH.authorizeUrl)
  url.searchParams.set("client_id", params.clientId)
  url.searchParams.set("redirect_uri", params.redirectUri)
  url.searchParams.set("response_type", "code")
  url.searchParams.set("scope", params.scope || "read,write,issues:create")
  url.searchParams.set("state", params.state)
  if (params.actor) {
    url.searchParams.set("actor", params.actor)
  }
  return url.toString()
}
