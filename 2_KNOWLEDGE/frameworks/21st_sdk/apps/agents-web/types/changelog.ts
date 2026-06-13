export interface GitHubRelease {
  id: number
  tag_name: string
  name: string | null
  body: string | null | undefined
  published_at: string
  html_url: string
  prerelease: boolean
  draft: boolean
  author: {
    login: string
    avatar_url: string
    html_url: string
  }
  assets: Array<{
    name: string
    download_count: number
    browser_download_url: string
  }>
}

export interface ProcessedRelease {
  id: number | string
  version: string
  title: string
  content: string
  publishedAt: Date
  htmlUrl: string
  isPrerelease: boolean
  author: {
    username: string
    avatarUrl: string
    profileUrl: string
  }
  downloadCount: number
  slug: string
  /** Indicates if this is a Canvas-specific update */
  isCanvasUpdate?: boolean
  /** Source of the release - github or local */
  source?: "github" | "canvas"
}

export interface ChangelogSection {
  title: string
  items: string[]
  content?: string
}

export interface ParsedChangelog {
  summary?: string
  sections: ChangelogSection[]
  breaking?: string[]
  rawContent?: string
}
