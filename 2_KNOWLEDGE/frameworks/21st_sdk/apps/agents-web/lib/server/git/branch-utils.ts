/**
 * Utilities for working with git branches in the new "one branch per commit" architecture
 * Each commit creates its own branch with format: messageId_timestamp
 *
 * IMPORTANT: All sandboxes are GitHub sandboxes with the repo cloned into ./repo
 * All git commands must be prefixed with "cd repo &&" to work inside the actual repo
 */

import { prisma } from "@/lib/prisma"
import { getInstallationAccessToken } from "../github/github-app-auth"

// Using any for session type as CodeSandbox SDK types are not fully exported
type SandboxSession = any

// All git commands run inside ./repo where the actual code lives
export const GIT_PREFIX = "cd repo 2>/dev/null || true; "

/**
 * Find a branch by messageId prefix
 * Returns the first matching branch name or null
 */
export async function findBranchByMessageId(
  session: SandboxSession,
  messageId: string,
): Promise<string | null> {
  try {
    console.log(
      `🔍 [branch-utils] Searching for branch with messageId: ${messageId}`,
    )

    // Use git branch with grep to find branches starting with messageId_
    const result = await session.commands.run(
      `${GIT_PREFIX}git branch --format="%(refname:short)" | grep "^${messageId}_" | head -1`,
    )

    const branchName = result.trim()

    if (branchName) {
      console.log(`✅ [branch-utils] Found branch: ${branchName}`)
      return branchName
    } else {
      console.log(
        `⚠️ [branch-utils] No branch found for messageId: ${messageId}`,
      )
      return null
    }
  } catch (error) {
    console.error(
      `❌ [branch-utils] Error finding branch for messageId ${messageId}:`,
      error,
    )
    return null
  }
}

/**
 * Find all branches matching a messageId prefix
 * Returns array of branch names sorted by timestamp (newest first)
 */
export async function findAllBranchesByMessageId(
  session: SandboxSession,
  messageId: string,
): Promise<string[]> {
  try {
    const result = await session.commands.run(
      `${GIT_PREFIX}git branch --format="%(refname:short)" | grep "^${messageId}_" | sort -r`,
    )

    const branches = result
      .split("\n")
      .map((b: string) => b.trim())
      .filter(Boolean)

    console.log(
      `📋 [branch-utils] Found ${branches.length} branches for messageId ${messageId}`,
    )
    return branches
  } catch (error) {
    console.error(`❌ [branch-utils] Error finding branches:`, error)
    return []
  }
}

/**
 * Checkout to a specific branch
 * Returns true on success, false on failure
 */
export async function checkoutToBranch(
  session: SandboxSession,
  branchName: string,
): Promise<boolean> {
  try {
    console.log(`🔄 [branch-utils] Checking out to branch: ${branchName}`)

    // Use shell command for more reliable checkout (inside ./repo)
    await session.commands.run(`${GIT_PREFIX}git checkout ${branchName}`)

    // Verify we're on the correct branch
    const currentBranch = await getCurrentBranch(session)

    if (currentBranch === branchName) {
      console.log(
        `✅ [branch-utils] Successfully checked out to: ${branchName}`,
      )
      return true
    } else {
      console.warn(
        `⚠️ [branch-utils] Checkout succeeded but branch mismatch. Expected: ${branchName}, Got: ${currentBranch}`,
      )
      return false
    }
  } catch (error) {
    console.error(
      `❌ [branch-utils] Failed to checkout to ${branchName}:`,
      error,
    )

    // Try force checkout as fallback
    try {
      console.log(`🔧 [branch-utils] Attempting force checkout...`)
      await session.commands.run(`${GIT_PREFIX}git checkout -f ${branchName}`)
      return true
    } catch (forceError) {
      console.error(`❌ [branch-utils] Force checkout also failed:`, forceError)
      return false
    }
  }
}

/**
 * Get the current branch name
 */
export async function getCurrentBranch(
  session: SandboxSession,
): Promise<string | null> {
  try {
    const result = await session.commands.run(
      `${GIT_PREFIX}git branch --show-current`,
    )
    return result.trim() || null
  } catch (error) {
    console.error(`❌ [branch-utils] Error getting current branch:`, error)
    return null
  }
}

/**
 * Restore to a specific message version by finding and checking out its branch
 * This is the main function to use when restoring versions
 */
export async function restoreToMessageVersion(
  session: SandboxSession,
  messageId: string,
): Promise<{ success: boolean; branchName?: string; error?: string }> {
  try {
    console.log(`🎯 [branch-utils] Restoring to message version: ${messageId}`)

    // Find the branch for this messageId
    const branchName = await findBranchByMessageId(session, messageId)

    if (!branchName) {
      const error = `No branch found for messageId: ${messageId}`
      console.error(`❌ [branch-utils] ${error}`)
      return { success: false, error }
    }

    // Checkout to the branch
    const checkoutSuccess = await checkoutToBranch(session, branchName)

    if (checkoutSuccess) {
      console.log(
        `🎉 [branch-utils] Successfully restored to version: ${messageId} (branch: ${branchName})`,
      )
      return { success: true, branchName }
    } else {
      const error = `Failed to checkout to branch: ${branchName}`
      console.error(`❌ [branch-utils] ${error}`)
      return { success: false, error }
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error"
    console.error(
      `❌ [branch-utils] Error restoring to message version:`,
      error,
    )
    return { success: false, error: errorMsg }
  }
}

/**
 * Get commit hash for a specific branch
 */
export async function getCommitHashForBranch(
  session: SandboxSession,
  branchName: string,
): Promise<string | null> {
  try {
    const result = await session.commands.run(
      `${GIT_PREFIX}git rev-parse ${branchName}`,
    )
    return result.trim() || null
  } catch (error) {
    console.error(
      `❌ [branch-utils] Error getting commit hash for branch ${branchName}:`,
      error,
    )
    return null
  }
}

/**
 * Check if a branch exists
 */
export async function branchExists(
  session: SandboxSession,
  branchName: string,
): Promise<boolean> {
  try {
    const result = await session.commands.run(
      `${GIT_PREFIX}git show-ref --verify --quiet refs/heads/${branchName} && echo "exists" || echo "not exists"`,
    )
    return result.trim() === "exists"
  } catch (error) {
    // Command returns non-zero exit code if branch doesn't exist
    return false
  }
}

export async function getBranchAndHead(session: SandboxSession) {
  let branch = ""
  let head = ""
  try {
    branch = (
      await session.commands.run(`${GIT_PREFIX}git branch --show-current`)
    ).trim()
    head = (
      await session.commands.run(`${GIT_PREFIX}git rev-parse HEAD`)
    ).trim()
  } catch (error) {
    console.error("❌ Failed to get current branch and head:", error)
  }

  return { branch, head }
}

export function getPrBranch(chatId: string): string {
  return `21st/pr-${chatId}`
}

export async function refreshToken(params: {
  session: SandboxSession
  installationId: string
  repository: string
}) {
  const { session, installationId, repository } = params
  try {
    await session.commands.run(`${GIT_PREFIX}git fetch origin --prune`)
  } catch (error) {
    console.warn(
      "[createPr] Fetch failed, refreshing GitHub App token and retrying",
      error,
    )
    const installationToken = await getInstallationAccessToken(installationId)
    const remoteUrl = `https://x-access-token:${installationToken}@github.com/${repository}.git`
    await session.commands.run(
      `${GIT_PREFIX}git remote set-url origin ${remoteUrl}`,
    )
  }
}

export async function pushToPrBranch(params: {
  session: SandboxSession
  chatId: string
  sandboxId?: string
  installationId?: string
  repository?: string
  forcePush?: boolean
}) {
  const { session, chatId, sandboxId, forcePush = false } = params
  let { installationId, repository } = params
  const prBranch = getPrBranch(chatId)

  // If sandboxId provided, fetch installationId and repository from TeamRepositorySandbox
  if (sandboxId) {
    const sandboxRecord = await prisma.teamRepositorySandbox.findFirst({
      where: { sandbox_id: sandboxId },
      select: { installation_id: true, repository: true },
    })
    if (sandboxRecord) {
      installationId =
        installationId || sandboxRecord.installation_id || undefined
      repository = repository || sandboxRecord.repository
    }
  }

  // Set remote URL with token for authentication (if provided)
  if (installationId && repository) {
    await refreshToken({ session, installationId, repository })
  }

  // Check if PR branch exists on origin (skip push if it doesn't exist, unless forcePush)
  if (!forcePush) {
    try {
      const branchExists = await session.commands.run(
        `${GIT_PREFIX}git ls-remote --heads origin ${prBranch} | grep -q ${prBranch} && echo "exists" || echo "not_exists"`,
      )
      if (branchExists.trim() === "not_exists") {
        console.log(
          `[pushToPrBranch] Skipping push - branch ${prBranch} doesn't exist on origin yet`,
        )
        return
      }
    } catch (error) {
      console.warn("[pushToPrBranch] Failed to check branch existence:", error)
      return
    }
  }

  await session.commands
    .run(
      `${GIT_PREFIX}git push --force-with-lease --no-verify origin HEAD:${prBranch}`,
    )
    .catch((error: any) => {
      console.error("Failed to push to PR branch:", error)
    })
}
