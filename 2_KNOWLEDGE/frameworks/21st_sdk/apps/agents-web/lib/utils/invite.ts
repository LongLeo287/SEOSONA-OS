/**
 * Builds the invite URL for a given token.
 * @param token - The invite token
 * @param origin - Optional origin URL (defaults to NEXT_PUBLIC_APP_URL)
 * @param forGitHub - If true, adds github=true param to indicate this is a GitHub integration invite
 * @param source - Optional product surface that created the invite
 */
export function buildInviteUrl(
  token: string,
  origin?: string,
  forGitHub?: boolean,
  source?: "canvas" | "agents",
): string {
  const baseUrl = origin || process.env.NEXT_PUBLIC_APP_URL || ""
  const params = new URLSearchParams({ code: token })
  const resolvedSource = source || "agents"

  if (forGitHub) {
    params.set("github", "true")
  }

  params.set("source", resolvedSource)

  return `${baseUrl}/invite?${params.toString()}`
}
