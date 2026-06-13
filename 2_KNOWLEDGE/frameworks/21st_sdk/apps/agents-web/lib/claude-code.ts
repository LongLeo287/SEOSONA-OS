/**
 * Claude Code integration types and utilities
 */

export interface ClaudeCodeIntegration {
  // Long-lived OAuth token (encrypted) - valid for 1 year
  oauthToken: string | null

  // Sandbox used for auth (kept for later access)
  sandbox_id: string | null

  // Metadata
  status: "active" | "disconnected"
  connected_at: string
  connected_by_user_id: string
}

/**
 * Auth service sandbox responses
 */
export interface AuthStartResponse {
  sessionId: string
  streamId?: string
}

export interface AuthStatusResponse {
  state: "starting" | "waiting_code" | "processing" | "success" | "error"
  oauthUrl?: string
  oauthToken?: string
  error?: string
}

/**
 * Check if team has Claude Code connected
 */
export function isClaudeCodeConnected(
  integration: ClaudeCodeIntegration | null | undefined
): boolean {
  return integration?.status === "active" && Boolean(integration?.oauthToken)
}

/**
 * Get OAuth token ready for injection into sandbox
 * Returns null if not connected or token unavailable
 */
export function getClaudeCodeCredentialsForInjection(
  integration: ClaudeCodeIntegration | null | undefined,
  decryptFn: (encrypted: string) => string
): { oauthToken: string } | null {
  if (!isClaudeCodeConnected(integration) || !integration?.oauthToken) {
    return null
  }

  try {
    const oauthToken = decryptFn(integration.oauthToken)
    return { oauthToken }
  } catch {
    return null
  }
}
