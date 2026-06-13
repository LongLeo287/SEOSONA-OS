import { Octokit } from "octokit"
import {
  GitHubRelease,
  ProcessedRelease,
  ParsedChangelog,
  ChangelogSection,
} from "@/types/changelog"
import { canvasChangelog } from "@/config/canvas-changelog"

const GITHUB_OWNER = "21st-dev"
const GITHUB_REPO = "21st"

export class ChangelogService {
  private octokit: Octokit

  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
      mediaType: {
        format: "base64",
      },
    })
  }

  async getReleases(perPage = 20): Promise<GitHubRelease[]> {
    try {
      const { data } = await this.octokit.rest.repos.listReleases({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        per_page: perPage,
      })

      return data.filter((release: any) => !release.draft) as GitHubRelease[]
    } catch (error) {
      console.error("Failed to fetch GitHub releases:", error)
      return []
    }
  }

  async getRelease(tagName: string): Promise<GitHubRelease | null> {
    try {
      const { data } = await this.octokit.rest.repos.getReleaseByTag({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        tag: tagName,
      })

      return data.draft ? null : (data as GitHubRelease)
    } catch (error) {
      console.error(`Failed to fetch release ${tagName}:`, error)
      return null
    }
  }

  processRelease(release: GitHubRelease): ProcessedRelease {
    const downloadCount = release.assets.reduce(
      (sum, asset) => sum + asset.download_count,
      0,
    )

    return {
      id: release.id,
      version: release.tag_name,
      title: release.name || release.tag_name,
      content: release.body || "",
      publishedAt: new Date(release.published_at),
      htmlUrl: release.html_url,
      isPrerelease: release.prerelease,
      author: {
        username: release.author.login,
        avatarUrl: release.author.avatar_url,
        profileUrl: release.author.html_url,
      },
      downloadCount,
      slug: this.createSlug(release.tag_name),
      isCanvasUpdate: false,
      source: "github",
    }
  }

  parseChangelog(content: string): ParsedChangelog {
    const lines = content.split("\n")
    const sections: ChangelogSection[] = []
    let currentSection: ChangelogSection | null = null
    let summary = ""
    let isInSummary = true
    let currentSectionContent = ""

    for (const line of lines) {
      // Check for section headers (## or ###)
      const sectionMatch = line.match(/^#{2,3}\s+(.+)/)
      if (sectionMatch) {
        isInSummary = false

        // Save previous section with its full content
        if (currentSection) {
          currentSection.content = currentSectionContent.trim()
          sections.push(currentSection)
        }

        const title = sectionMatch[1]
        currentSection = { title, items: [], content: "" }
        currentSectionContent = ""
        continue
      }

      // If we're in a section, collect all content
      if (currentSection) {
        currentSectionContent += line + "\n"

        // Also parse list items for backwards compatibility
        const listMatch = line.match(/^[-*+]\s+(.+)/)
        if (listMatch) {
          currentSection.items.push(listMatch[1])
        }
        continue
      }

      // Add to summary if we're still in the beginning
      if (isInSummary && line.trim() && !line.startsWith("#")) {
        summary += line + "\n"
      }
    }

    // Save the last section
    if (currentSection) {
      currentSection.content = currentSectionContent.trim()
      sections.push(currentSection)
    }

    return {
      summary: summary.trim() || undefined,
      sections,
      rawContent: content,
    }
  }

  /**
   * Get Canvas changelog updates
   */
  getCanvasUpdates(): ProcessedRelease[] {
    return canvasChangelog
  }

  /**
   * Get combined releases from GitHub and Canvas updates
   * @param perPage Number of GitHub releases to fetch
   * @param includeCanvas Whether to include Canvas updates
   */
  async getCombinedReleases(
    perPage = 20,
    includeCanvas = false,
  ): Promise<ProcessedRelease[]> {
    const githubReleases = await this.getReleases(perPage)
    const processedGithubReleases = githubReleases.map((release) =>
      this.processRelease(release),
    )

    if (!includeCanvas) {
      return processedGithubReleases
    }

    const canvasUpdates = this.getCanvasUpdates()
    const allReleases = [...processedGithubReleases, ...canvasUpdates]

    // Sort by publication date (newest first)
    const sorted = allReleases.sort(
      (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime(),
    )
    return sorted
  }

  /**
   * Get a specific release by version
   * @param version Version string (e.g., "v1.0.0" or "canvas-2025.1.2")
   */
  async getReleaseByVersion(version: string): Promise<ProcessedRelease | null> {
    // Check if it's a Canvas update first
    const canvasUpdate = canvasChangelog.find(
      (update) => update.version === version,
    )
    if (canvasUpdate) {
      return canvasUpdate
    }

    // Otherwise search in GitHub releases
    try {
      const githubReleases = await this.getReleases(100) // Get more releases to search
      const githubRelease = githubReleases.find(
        (release) => release.tag_name === version,
      )

      if (githubRelease) {
        return this.processRelease(githubRelease)
      }
    } catch (error) {
      console.error("Failed to fetch GitHub releases:", error)
    }

    return null
  }

  /**
   * Get desktop app releases (those starting with 'v' prefix)
   * @param perPage Number of releases per page
   * @param page Page number (1-indexed)
   */
  async getDesktopReleases(
    perPage = 10,
    page = 1,
  ): Promise<{ releases: ProcessedRelease[]; hasMore: boolean }> {
    try {
      // Fetch enough releases to cover the requested page
      // GitHub API pagination is 1-indexed
      const { data } = await this.octokit.rest.repos.listReleases({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        per_page: 100, // Fetch more to filter and paginate
        page: 1,
      })

      // Filter for desktop releases (tags starting with 'v' like v0.0.1, v0.1.0, etc.)
      const allDesktopReleases = data.filter(
        (release: any) =>
          !release.draft && /^v\d+\.\d+\.\d+/.test(release.tag_name),
      )

      // Paginate
      const startIndex = (page - 1) * perPage
      const endIndex = startIndex + perPage
      const paginatedReleases = allDesktopReleases.slice(startIndex, endIndex)
      const hasMore = allDesktopReleases.length > endIndex

      return {
        releases: paginatedReleases.map((release) =>
          this.processRelease(release as GitHubRelease),
        ),
        hasMore,
      }
    } catch (error) {
      console.error("Failed to fetch desktop releases:", error)
      return { releases: [], hasMore: false }
    }
  }

  private createSlug(tagName: string): string {
    return tagName.toLowerCase().replace(/[^a-z0-9]/g, "-")
  }
}

export const changelogService = new ChangelogService()
