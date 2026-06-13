import { getInstallationAccessToken } from "@/lib/server/github/github-app-auth"
import { POWERED_BY_FOOTER } from "@/lib/webhooks/utils/urls"

/**
 * Add a comment to a GitHub issue or PR
 * Returns the comment ID for later editing
 */
export async function addGitHubComment(
  installationId: string | number,
  owner: string,
  repo: string,
  issueNumber: number,
  body: string
): Promise<number> {
  const token = await getInstallationAccessToken(installationId)

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/comments`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        "User-Agent": "21st-dev-app",
      },
      body: JSON.stringify({ body }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    console.error(`❌ [GitHub] Failed to add comment: ${response.status}`, error)
    throw new Error(`Failed to add comment: ${response.status}`)
  }

  const data = await response.json()
  console.log(`✅ [GitHub] Added comment #${data.id} to ${owner}/${repo}#${issueNumber}`)

  return data.id
}

/**
 * Edit an existing GitHub comment
 */
export async function editGitHubComment(
  installationId: string | number,
  owner: string,
  repo: string,
  commentId: number,
  body: string
): Promise<void> {
  const token = await getInstallationAccessToken(installationId)

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues/comments/${commentId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        "User-Agent": "21st-dev-app",
      },
      body: JSON.stringify({ body }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    console.error(`❌ [GitHub] Failed to edit comment: ${response.status}`, error)
    throw new Error(`Failed to edit comment: ${response.status}`)
  }

  console.log(`✅ [GitHub] Edited comment #${commentId}`)
}

/**
 * Add a reaction to a comment (e.g., 👀 to acknowledge)
 */
export async function addCommentReaction(
  installationId: string | number,
  owner: string,
  repo: string,
  commentId: number,
  reaction: "eyes" | "rocket" | "+1" | "-1" | "heart" | "confused" = "eyes"
): Promise<void> {
  const token = await getInstallationAccessToken(installationId)

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues/comments/${commentId}/reactions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        "User-Agent": "21st-dev-app",
      },
      body: JSON.stringify({ content: reaction }),
    }
  )

  if (!response.ok) {
    console.error(`⚠️ [GitHub] Failed to add reaction: ${response.status}`)
  }
}

/**
 * Notify GitHub that an agent task is complete
 * If initialCommentId is provided, edits that comment instead of creating a new one
 */
export async function notifyGitHubCompletion(
  installationId: string | number,
  repo: string,
  issueNumber: number,
  summary: string,
  chatUrl?: string,
  initialCommentId?: number
): Promise<void> {
  const [owner, repoName] = repo.split("/")

  let body = `**Task completed.**\n\n${summary}`

  body += `\n\n---\n`
  if (chatUrl) {
    body += `[View full conversation](${chatUrl})\n\n`
  }
  body += POWERED_BY_FOOTER

  if (initialCommentId) {
    // Edit the original "I'm on it" comment
    try {
      await editGitHubComment(installationId, owner, repoName, initialCommentId, body)
      console.log(`✅ [GitHub] Updated initial comment with completion`)
      return
    } catch (error) {
      console.error(`⚠️ [GitHub] Failed to edit initial comment, falling back to new comment:`, error)
      // Fall through to create new comment
    }
  }

  // Create new comment (fallback or no initial comment ID)
  await addGitHubComment(installationId, owner, repoName, issueNumber, body)
}
