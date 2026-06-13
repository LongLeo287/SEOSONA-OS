import { prisma } from "@/lib/prisma"
import { githubApiRequest } from "./github-api.service"
import { getInstallationAccessToken } from "./github-app-auth"
import { getInstallationForRepo, type GitHubIntegration } from "@/lib/github"

const ALLOWED_EXTENSIONS = [".js", ".ts", ".json", ".md", ".tsx", ".jsx"]

interface FileTreeItem {
  path: string
  type: "blob" | "tree"
  sha: string
  size: number
}

interface GitHubTreeResponse {
  tree: Array<{
    path: string
    type: "blob" | "tree"
    sha?: string
    size?: number
  }>
  truncated?: boolean
}

// In-memory cache for branch-specific file trees
// Key: "teamId:repository:branch"
const branchFileTreeCache = new Map<
  string,
  { files: FileTreeItem[]; timestamp: number }
>()
const BRANCH_CACHE_TTL = 5 * 60 * 1000 // 5 minutes

// Periodically clean up expired cache entries (every 10 minutes)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now()
    let cleaned = 0
    for (const [key, value] of branchFileTreeCache.entries()) {
      if (now - value.timestamp > BRANCH_CACHE_TTL) {
        branchFileTreeCache.delete(key)
        cleaned++
      }
    }
    if (cleaned > 0) {
      console.log(`[FileTree] Auto-cleaned ${cleaned} expired cache entries`)
    }
  }, 10 * 60 * 1000)
}

/**
 * Get file tree for a specific branch from GitHub API
 * Uses in-memory cache to avoid repeated API calls
 */
export async function getFileTreeForBranch(
  teamId: string,
  repository: string,
  branch: string,
): Promise<FileTreeItem[]> {
  const cacheKey = `${teamId}:${repository}:${branch}`
  const cached = branchFileTreeCache.get(cacheKey)
  const now = Date.now()

  if (cached && now - cached.timestamp < BRANCH_CACHE_TTL) {
    console.log(
      `⚡ [FileTree] Cache hit for ${repository}@${branch} (${cached.files.length} files)`,
    )
    return cached.files
  }

  console.log(`🌳 [FileTree] Fetching file tree for ${repository}@${branch}`)

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: { github_integration: true },
  })

  const integration = team?.github_integration as GitHubIntegration | null

  // Use getInstallationForRepo to find the correct installation for this repository
  const installationId = getInstallationForRepo(integration, repository)

  if (!installationId) {
    throw new Error(
      `No GitHub installation found for repository ${repository}. Please connect GitHub first.`,
    )
  }

  const accessToken = await getInstallationAccessToken(installationId)

  // Fetch tree from GitHub for specific branch (ONE API call, recursive)
  const apiUrl = `https://api.github.com/repos/${repository}/git/trees/${encodeURIComponent(branch)}?recursive=1`
  const tree = await githubApiRequest<GitHubTreeResponse>(
    apiUrl,
    accessToken,
    "21st-dev-filetree",
  )

  // Filter to relevant files and directories
  const fileTree: FileTreeItem[] = tree.tree
    .filter((item) => {
      if (item.type === "tree") return true
      if (item.type === "blob") {
        return ALLOWED_EXTENSIONS.some((ext) => item.path.endsWith(ext))
      }
      return false
    })
    .map((item) => ({
      path: item.path,
      type: item.type,
      sha: item.sha || "",
      size: item.size || 0,
    }))

  // Cache the result
  branchFileTreeCache.set(cacheKey, { files: fileTree, timestamp: now })

  console.log(
    `✅ [FileTree] Fetched ${fileTree.length} items for ${repository}@${branch}`,
  )

  return fileTree
}

/**
 * Clear branch cache for a specific repository (useful when files change)
 */
export function clearBranchFileTreeCache(repository: string): void {
  let cleared = 0
  for (const key of branchFileTreeCache.keys()) {
    if (key.includes(`:${repository}:`)) {
      branchFileTreeCache.delete(key)
      cleared++
    }
  }
  if (cleared > 0) {
    console.log(`[FileTree] Cleared ${cleared} cache entries for ${repository}`)
  }
}

/**
 * Save repository file tree to TeamRepositorySandbox.file_tree
 * This is used for @ mentions file search
 */
export async function saveRepositoryFileTree(
  teamId: string,
  repository: string,
): Promise<{ success: boolean; itemCount: number }> {
  console.log(`🌳 [FileTree] Saving file tree for ${repository}`)

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: { github_integration: true },
  })

  const integration = team?.github_integration as GitHubIntegration | null

  // Use getInstallationForRepo to find the correct installation for this repository
  const installationId = getInstallationForRepo(integration, repository)

  if (!installationId) {
    throw new Error(`No GitHub installation found for repository ${repository}`)
  }

  const accessToken = await getInstallationAccessToken(installationId)

  // Fetch tree from GitHub (ONE API call, recursive)
  const apiUrl = `https://api.github.com/repos/${repository}/git/trees/HEAD?recursive=1`
  const tree = await githubApiRequest<GitHubTreeResponse>(
    apiUrl,
    accessToken,
    "21st-dev-filetree",
  )

  // Filter to relevant files and directories
  const fileTree: FileTreeItem[] = tree.tree
    .filter((item) => {
      if (item.type === "tree") return true
      if (item.type === "blob") {
        return ALLOWED_EXTENSIONS.some((ext) => item.path.endsWith(ext))
      }
      return false
    })
    .map((item) => ({
      path: item.path,
      type: item.type,
      sha: item.sha || "",
      size: item.size || 0,
    }))

  // Save to TeamRepositorySandbox.file_tree (per-repository storage)
  await prisma.teamRepositorySandbox.upsert({
    where: {
      team_id_repository: {
        team_id: teamId,
        repository,
      },
    },
    create: {
      team_id: teamId,
      repository,
      file_tree: fileTree as any,
    },
    update: {
      file_tree: fileTree as any,
      updated_at: new Date(),
    },
  })

  console.log(`✅ [FileTree] Saved ${fileTree.length} items for ${repository}`)

  return { success: true, itemCount: fileTree.length }
}

/**
 * Refresh file tree by repository name (used by webhook)
 * Finds all TeamRepositorySandbox records for this repository and refreshes their file trees
 */
export async function refreshFileTreeByRepository(
  repository: string,
): Promise<{ success: boolean; teamIds: string[] }> {
  console.log(`🔄 [FileTree] Refreshing file tree for ${repository}`)

  // Find all TeamRepositorySandbox records for this repository
  const sandboxRecords = await prisma.teamRepositorySandbox.findMany({
    where: { repository },
    select: { team_id: true },
  })

  if (sandboxRecords.length === 0) {
    console.log(
      `⚠️ [FileTree] No sandbox records found for repository: ${repository}`,
    )
    return { success: false, teamIds: [] }
  }

  // Refresh file tree for all teams that have this repository
  const teamIds: string[] = []
  for (const record of sandboxRecords) {
    try {
      await saveRepositoryFileTree(record.team_id, repository)
      teamIds.push(record.team_id)
    } catch (error) {
      console.error(
        `Failed to refresh file tree for team ${record.team_id}:`,
        error,
      )
    }
  }

  console.log(`✅ [FileTree] Refreshed file tree for ${teamIds.length} team(s)`)
  return { success: teamIds.length > 0, teamIds }
}
