/**
 * GitHub App Authentication Utilities
 *
 * Handles JWT generation and Installation Access Token management
 * for GitHub App authentication flow.
 *
 * Supports multiple GitHub Apps via `appType` parameter:
 * - "canvas" (default): uses GITHUB_APP_* env vars (1code-async)
 * - "an": uses AN_GITHUB_APP_* env vars (an-dev-app)
 */

import { createSign } from "crypto"

export type GitHubAppType = "canvas" | "an"

// Token cache to avoid unnecessary API calls
interface CachedToken {
  token: string
  expiresAt: number
}

const tokenCache = new Map<string, CachedToken>()

// JWT expires in 10 minutes (GitHub's max is 10 minutes)
const JWT_EXPIRY_SECONDS = 600
// Installation token expires in 1 hour, we refresh 5 minutes early
const TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1000

/**
 * Get GitHub App configuration from environment variables
 */
function getAppConfig(appType: GitHubAppType = "canvas") {
  const prefix = appType === "an" ? "AN_GITHUB_APP" : "GITHUB_APP"
  const defaultSlug = appType === "an" ? "an-dev-app" : "1code-async"

  const appId = process.env[`${prefix}_ID`]
  const privateKey = process.env[`${prefix}_PRIVATE_KEY`]
  const clientId = process.env[`${prefix}_CLIENT_ID`]
  const clientSecret = process.env[`${prefix}_CLIENT_SECRET`]
  const appSlug = process.env[`${prefix}_SLUG`] || defaultSlug

  if (!appId || !privateKey) {
    throw new Error(
      `${prefix}_ID and ${prefix}_PRIVATE_KEY environment variables are required`,
    )
  }

  // Handle escaped newlines in the private key
  const formattedPrivateKey = privateKey.replace(/\\n/g, "\n")

  return {
    appId,
    privateKey: formattedPrivateKey,
    clientId,
    clientSecret,
    appSlug,
  }
}

/**
 * Base64 URL encode (no padding, URL-safe characters)
 */
function base64UrlEncode(data: string | Buffer): string {
  const base64 = Buffer.isBuffer(data)
    ? data.toString("base64")
    : Buffer.from(data).toString("base64")
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

/**
 * Generate a JWT for GitHub App authentication
 *
 * The JWT is signed with the App's private key and used to:
 * 1. Get Installation Access Tokens
 * 2. List App installations
 */
export function generateAppJWT(appType: GitHubAppType = "canvas"): string {
  const { appId, privateKey } = getAppConfig(appType)

  const now = Math.floor(Date.now() / 1000)

  // JWT Header
  const header = {
    alg: "RS256",
    typ: "JWT",
  }

  // JWT Payload
  const payload = {
    iat: now - 60, // Issued 60 seconds ago to account for clock drift
    exp: now + JWT_EXPIRY_SECONDS,
    iss: appId,
  }

  // Encode header and payload
  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(payload))

  // Create signature
  const signatureInput = `${encodedHeader}.${encodedPayload}`
  const sign = createSign("RSA-SHA256")
  sign.update(signatureInput)
  const signature = sign.sign(privateKey)
  const encodedSignature = base64UrlEncode(signature)

  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`
}

/**
 * Get an Installation Access Token for a specific installation
 *
 * This token is used to make API calls on behalf of the installation
 * (access repositories, etc.)
 *
 * @param installationId - The GitHub App installation ID
 * @returns Installation Access Token
 */
export async function getInstallationAccessToken(
  installationId: string | number,
  appType: GitHubAppType = "canvas",
): Promise<string> {
  const cacheKey = `${appType}_installation_${installationId}`

  // Check cache first
  const cached = tokenCache.get(cacheKey)
  if (cached && cached.expiresAt > Date.now() + TOKEN_REFRESH_BUFFER_MS) {
    return cached.token
  }

  // Generate new JWT for authentication
  const jwt = generateAppJWT(appType)

  // Request Installation Access Token
  const response = await fetch(
    `https://api.github.com/app/installations/${installationId}/access_tokens`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "21st-dev-app",
      },
    },
  )

  if (!response.ok) {
    const errorText = await response.text()
    console.error(
      `❌ [GitHubAppAuth] Failed to get installation token: ${response.status}`,
      errorText,
    )
    throw new Error(
      `Failed to get installation access token: ${response.status} ${response.statusText}`,
    )
  }

  const data = await response.json()

  // Cache the token
  const expiresAt = new Date(data.expires_at).getTime()
  tokenCache.set(cacheKey, {
    token: data.token,
    expiresAt,
  })

  console.log(
    `✅ [GitHubAppAuth] Got installation token for ${installationId}, expires at ${data.expires_at}`,
  )

  return data.token
}

/**
 * Get the GitHub App installation URL for a user to install the app
 *
 * @param state - State parameter to pass through the OAuth flow
 * @returns Installation URL
 */
export function getAppInstallationUrl(
  state: string,
  appType: GitHubAppType = "canvas",
): string {
  const { appSlug } = getAppConfig(appType)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const callbackPath =
    appType === "an"
      ? "/api/github/an-app/callback"
      : "/api/github/app/callback"
  const redirectUri = `${baseUrl}${callbackPath}`
  // Use the base install URL - GitHub will show org picker if user has access to orgs
  // redirect_uri ensures GitHub redirects to the correct environment (local vs prod)
  return `https://github.com/apps/${appSlug}/installations/new?state=${encodeURIComponent(state)}&redirect_uri=${encodeURIComponent(redirectUri)}`
}

/**
 * Get the GitHub App public page URL for adding more organizations
 * Users should go here when they want to install the app to additional orgs
 */
export function getAppPublicUrl(appType: GitHubAppType = "canvas"): string {
  const { appSlug } = getAppConfig(appType)
  return `https://github.com/apps/${appSlug}`
}

/**
 * Exchange an OAuth code for user access token
 * (Used when "Request user authorization (OAuth) during installation" is enabled)
 *
 * @param code - The OAuth authorization code
 * @returns User access token and user info
 */
export async function exchangeCodeForUserToken(
  code: string,
  appType: GitHubAppType = "canvas",
): Promise<{
  access_token: string
  token_type: string
  scope: string
}> {
  const { clientId, clientSecret } = getAppConfig(appType)

  if (!clientId || !clientSecret) {
    throw new Error(
      "GITHUB_APP_CLIENT_ID and GITHUB_APP_CLIENT_SECRET are required for OAuth",
    )
  }

  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  })

  const data = await response.json()

  if (data.error) {
    console.error(`❌ [GitHubAppAuth] OAuth error:`, data)
    throw new Error(`OAuth error: ${data.error_description || data.error}`)
  }

  return data
}

/**
 * Get user info using an access token
 */
export async function getGitHubUser(accessToken: string): Promise<{
  id: number
  login: string
  name: string
  email: string
  avatar_url: string
}> {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "21st-dev-app",
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to get user info: ${response.status}`)
  }

  return response.json()
}

/**
 * Get repositories accessible to an installation
 *
 * @param installationId - The GitHub App installation ID
 * @param page - Page number for pagination
 * @param perPage - Items per page
 * @returns List of repositories
 */
export async function getInstallationRepositories(
  installationId: string | number,
  page: number = 1,
  perPage: number = 100,
  appType: GitHubAppType = "canvas",
): Promise<{
  total_count: number
  repositories: any[]
}> {
  const token = await getInstallationAccessToken(installationId, appType)

  const response = await fetch(
    `https://api.github.com/installation/repositories?page=${page}&per_page=${perPage}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        // Use mercy-preview to include topics in response
        Accept: "application/vnd.github.mercy-preview+json",
        "User-Agent": "21st-dev-app",
      },
    },
  )

  if (!response.ok) {
    throw new Error(`Failed to get repositories: ${response.status}`)
  }

  return response.json()
}

/**
 * Get installation details (account info) from GitHub API
 * Uses App JWT to query installation info
 *
 * @param installationId - The GitHub App installation ID
 * @returns Installation account info (login, avatar, type)
 */
export async function getInstallationInfo(
  installationId: string | number,
  appType: GitHubAppType = "canvas",
): Promise<{
  installation_id: string
  login: string
  avatar_url: string | null
  type: "User" | "Organization"
}> {
  const jwt = generateAppJWT(appType)

  const response = await fetch(
    `https://api.github.com/app/installations/${installationId}`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "21st-dev-app",
      },
    },
  )

  if (!response.ok) {
    const errorText = await response.text()
    console.error(
      `❌ [GitHubAppAuth] Failed to get installation info: ${response.status}`,
      errorText,
    )
    throw new Error(
      `Failed to get installation info: ${response.status} ${response.statusText}`,
    )
  }

  const data = await response.json()

  return {
    installation_id: String(installationId),
    login: data.account?.login || "Unknown",
    avatar_url: data.account?.avatar_url || null,
    type: data.account?.type === "Organization" ? "Organization" : "User",
  }
}

/**
 * Get collaborators/members for an installation
 * For organizations: fetches org members
 * For user installations: fetches collaborators from all accessible repositories
 *
 * @param installationId - The GitHub App installation ID
 * @returns List of members/collaborators
 */
export async function getInstallationCollaborators(
  installationId: string | number,
  appType: GitHubAppType = "canvas",
): Promise<
  Array<{
    id: number
    login: string
    avatar_url: string
    type: string
  }>
> {
  const token = await getInstallationAccessToken(installationId, appType)

  // First, get the installation info to determine if it's an org or user
  const installationInfo = await getInstallationInfo(installationId, appType)

  if (installationInfo.type === "Organization") {
    // For orgs, get organization members
    const response = await fetch(
      `https://api.github.com/orgs/${installationInfo.login}/members?per_page=100`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "21st-dev-app",
        },
      },
    )

    if (!response.ok) {
      // If we can't get org members (permissions), fall back to empty
      console.warn(
        `[GitHubAppAuth] Could not fetch org members: ${response.status}`,
      )
      return []
    }

    return response.json()
  } else {
    // For user installations, fetch collaborators from all accessible repositories
    const collaboratorsMap = new Map<
      number,
      { id: number; login: string; avatar_url: string; type: string }
    >()

    // Always include the installation owner
    collaboratorsMap.set(0, {
      id: 0,
      login: installationInfo.login,
      avatar_url: installationInfo.avatar_url || "",
      type: "User",
    })

    try {
      // Get all repositories accessible to this installation
      const reposResponse = await fetch(
        `https://api.github.com/installation/repositories?per_page=100`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "21st-dev-app",
          },
        },
      )

      if (!reposResponse.ok) {
        console.warn(
          `[GitHubAppAuth] Could not fetch repositories: ${reposResponse.status}`,
        )
        return Array.from(collaboratorsMap.values())
      }

      const reposData = await reposResponse.json()
      const repositories = reposData.repositories || []

      // Fetch collaborators from each repository (limit to first 10 repos for performance)
      const reposToCheck = repositories.slice(0, 10)

      for (const repo of reposToCheck) {
        try {
          const collabResponse = await fetch(
            `https://api.github.com/repos/${repo.full_name}/collaborators?per_page=100`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/vnd.github.v3+json",
                "User-Agent": "21st-dev-app",
              },
            },
          )

          if (collabResponse.ok) {
            const collaborators = await collabResponse.json()
            for (const collab of collaborators) {
              if (!collaboratorsMap.has(collab.id)) {
                collaboratorsMap.set(collab.id, {
                  id: collab.id,
                  login: collab.login,
                  avatar_url: collab.avatar_url,
                  type: collab.type || "User",
                })
              }
            }
          }
        } catch (err) {
          // Skip repos we can't access collaborators for
          console.warn(
            `[GitHubAppAuth] Could not fetch collaborators for ${repo.full_name}`,
          )
        }
      }
    } catch (err) {
      console.warn(`[GitHubAppAuth] Error fetching repository collaborators:`, err)
    }

    return Array.from(collaboratorsMap.values())
  }
}

/**
 * Clear cached token for an installation (useful when installation is updated)
 */
export function clearInstallationTokenCache(
  installationId: string | number,
): void {
  tokenCache.delete(`installation_${installationId}`)
}

/**
 * Clear all cached tokens
 */
export function clearAllTokenCache(): void {
  tokenCache.clear()
}
