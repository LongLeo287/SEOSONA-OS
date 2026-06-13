import { prisma } from "@/lib/prisma"
import { githubApiRequest } from "./github-api.service"
import { getInstallationAccessToken } from "./github-app-auth"

export interface GitHubTreeItem {
  path: string
  type: "blob" | "tree"
  sha?: string
  size?: number
}

export interface GitHubTree {
  tree: GitHubTreeItem[]
  truncated?: boolean
}

/**
 * Reusable function to fetch GitHub repository tree for a team
 * Handles authentication and error handling consistently
 */
export async function fetchGitHubRepositoryTree(
  teamId: string,
  repository: string,
  userAgent = "21st-dev-tree",
  options?: {
    skipCommitCheck?: boolean
  },
): Promise<GitHubTree | null> {
  try {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: { github_integration: true },
    })

    const integration = team?.github_integration as any
    if (!integration?.installation_id) {
      console.warn(
        `[fetchGitHubRepositoryTree] No GitHub App installation for team ${teamId}`,
      )
      return null
    }

    const accessToken = await getInstallationAccessToken(integration.installation_id)
    const apiUrl = `https://api.github.com/repos/${repository}/git/trees/HEAD?recursive=1`

    const tree = await githubApiRequest(apiUrl, accessToken, userAgent)
    return tree
  } catch (error) {
    console.error(
      `[fetchGitHubRepositoryTree] Failed to fetch tree for ${repository}:`,
      error,
    )
    return null
  }
}

/**
 * Build a textual file structure listing from the user's connected GitHub repository
 * limited to the selected folders in team.github_integration.configuration.
 * Returns an empty string when integration or configuration is missing.
 */
export async function getGithubReferenceTreeString(
  teamId: string,
): Promise<string> {
  try {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: { github_integration: true },
    })

    const integration = team?.github_integration as any
    const repo: string | undefined = integration?.configuration?.repository
    const folders: string[] | undefined = integration?.configuration?.folders

    if (!repo || !folders || folders.length === 0) {
      return ""
    }

    // Use the reusable tree fetching function
    const tree = await fetchGitHubRepositoryTree(
      teamId,
      repo,
      "21st-dev-reference-tree",
    )
    if (!tree) {
      return "" // fail silent for prompt stability
    }

    const selectedPrefixes = new Set(
      folders.map((f) => f.trim().replace(/^\/+|\/+$/g, "")).filter(Boolean),
    )

    if (!tree.tree || selectedPrefixes.size === 0) return ""

    // Collect paths under selected folders, skip heavy/irrelevant ones
    const SKIP_DIRS = ["node_modules", ".git", "dist", "build", ".next"]

    const includePath = (p: string) => {
      // Must be under any selected folder
      let under = false
      for (const prefix of selectedPrefixes) {
        if (p === prefix || p.startsWith(prefix + "/")) {
          under = true
          break
        }
      }
      if (!under) return false

      // Skip ignored directories
      const parts = p.split("/")
      for (const part of parts) {
        if (SKIP_DIRS.includes(part)) return false
      }
      return true
    }

    const dirs = new Set<string>()
    const files: string[] = []

    for (const item of tree.tree) {
      if (!includePath(item.path)) continue

      if (item.type === "tree") {
        dirs.add(item.path)
      } else if (item.type === "blob") {
        files.push(item.path)
        // ensure parent directories are recorded
        const parts = item.path.split("/")
        for (let i = 1; i < parts.length; i++) {
          const dirPath = parts.slice(0, i).join("/")
          if (includePath(dirPath)) dirs.add(dirPath)
        }
      }
    }

    const sortedDirs = Array.from(dirs).sort()
    const sortedFiles = files.sort()

    // Build a simple indented tree limited by max lines/characters
    const MAX_LINES = 600
    const MAX_CHARS = 20_000
    const lines: string[] = []

    const appendLine = (s: string) => {
      if (lines.length < MAX_LINES) lines.push(s)
    }

    // Group by directory for readable output
    const filesByDir = new Map<string, string[]>()
    for (const f of sortedFiles) {
      const lastSlash = f.lastIndexOf("/")
      const dir = lastSlash === -1 ? "" : f.slice(0, lastSlash)
      const name = lastSlash === -1 ? f : f.slice(lastSlash + 1)
      const arr = filesByDir.get(dir) ?? []
      arr.push(name)
      filesByDir.set(dir, arr)
    }

    // Emit by folders the user selected, preserving hierarchy
    const topFolders = Array.from(selectedPrefixes).sort()
    for (const top of topFolders) {
      appendLine(`${top}/`)
      // Direct children (dirs)
      for (const d of sortedDirs) {
        if (d === top) continue
        if (d.startsWith(top + "/")) {
          const rel = d.slice(top.length + 1)
          if (!rel.includes("/")) appendLine(`  ${rel}/`)
        }
      }
      // Direct children (files)
      const topFiles = filesByDir.get(top) || []
      for (const fname of topFiles) appendLine(`  ${fname}`)

      // Nested entries (limited)
      for (const d of sortedDirs) {
        if (d.startsWith(top + "/")) {
          const rel = d.slice(top.length + 1)
          if (rel.includes("/")) {
            const depth = rel.split("/").length
            if (depth <= 6)
              appendLine(
                `${"  ".repeat(Math.min(depth, 8))}${rel.split("/").pop()}/`,
              )
          }
        }
      }

      // Nested files
      for (const [dir, names] of filesByDir) {
        if (dir && dir.startsWith(top + "/")) {
          const rel = dir.slice(top.length + 1)
          const depth = rel.split("/").length
          if (depth <= 6) {
            for (const name of names) {
              appendLine(
                `${"  ".repeat(Math.min(depth, 8))}${rel.split("/").pop()}/${name}`,
              )
            }
          }
        }
      }
    }

    let result = lines.join("\n")
    if (result.length > MAX_CHARS) {
      result = result.slice(0, MAX_CHARS) + "\n... [github reference truncated]"
    }
    return result
  } catch (e) {
    console.error("[GitHub Reference] Failed to build reference tree:", e)
    return ""
  }
}
