/**
 * Discord integration types and utilities
 */

export interface DiscordIntegration {
  // Guild (server) info
  guildId: string
  guildName: string
  guildIcon?: string

  // Who connected it
  connectedByUserId: string
  connectedAt: string

  // Status
  status: "active" | "disconnected"
}

export interface DiscordGuild {
  id: string
  name: string
  icon: string | null
}

/**
 * Check if team has Discord connected
 */
export function isDiscordConnected(
  integration: DiscordIntegration | null | undefined
): boolean {
  return integration?.status === "active" && Boolean(integration?.guildId)
}

/**
 * Discord OAuth2 URLs
 */
export const DISCORD_OAUTH = {
  authorizeUrl: "https://discord.com/api/oauth2/authorize",
  tokenUrl: "https://discord.com/api/oauth2/token",
  apiUrl: "https://discord.com/api/v10",
} as const

/**
 * Build Discord bot invite URL with OAuth2
 * Uses bot + applications.commands scopes
 */
export function buildDiscordAuthUrl(params: {
  clientId: string
  redirectUri: string
  state: string
}): string {
  const url = new URL(DISCORD_OAUTH.authorizeUrl)
  url.searchParams.set("client_id", params.clientId)
  url.searchParams.set("redirect_uri", params.redirectUri)
  url.searchParams.set("response_type", "code")
  // bot scope for presence, applications.commands for slash commands, guilds for getting guild info
  url.searchParams.set("scope", "bot applications.commands guilds")
  // Minimal bot permissions: Send Messages (2048) + Use Slash Commands (2147483648)
  url.searchParams.set("permissions", "2147485696")
  url.searchParams.set("state", params.state)
  return url.toString()
}
