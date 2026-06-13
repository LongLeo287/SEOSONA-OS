/**
 * GitHub Repository Permission Utilities
 *
 * Check user permissions on repositories via GitHub API.
 * Uses installation access tokens for authentication.
 */

import { getInstallationAccessToken } from "./github-app-auth"

export type GitHubPermission = "admin" | "write" | "read" | "none"

/**
 * Check a user's permission level on a repository.
 *
 * This uses GitHub's collaborators API which returns the HIGHEST permission
 * from all sources: direct access, team membership, org-level, enterprise.
 *
 * @param installationId - GitHub App installation ID
 * @param owner - Repository owner (org or user)
 * @param repo - Repository name
 * @param username - GitHub username to check
 * @returns Permission level: 'admin' | 'write' | 'read' | 'none'
 */
export async function checkUserRepoPermission(
  installationId: number,
  owner: string,
  repo: string,
  username: string
): Promise<GitHubPermission> {
  try {
    const token = await getInstallationAccessToken(installationId)

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/collaborators/${username}/permission`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          "User-Agent": "21st-dev-app",
        },
      }
    )

    if (response.status === 404) {
      // User is not a collaborator
      console.log(
        `🔒 [Permissions] User ${username} is not a collaborator on ${owner}/${repo}`
      )
      return "none"
    }

    if (!response.ok) {
      console.error(
        `❌ [Permissions] Failed to check permission: ${response.status} ${response.statusText}`
      )
      // Fail closed - deny access on error
      return "none"
    }

    const data = await response.json()
    const permission = data.permission as GitHubPermission

    console.log(
      `🔒 [Permissions] User ${username} has '${permission}' access on ${owner}/${repo}`
    )

    return permission
  } catch (error) {
    console.error(`❌ [Permissions] Error checking permission:`, error)
    // Fail closed - deny access on error
    return "none"
  }
}

/**
 * Check if a permission level grants write access
 */
export function hasWriteAccess(permission: GitHubPermission): boolean {
  return permission === "admin" || permission === "write"
}
