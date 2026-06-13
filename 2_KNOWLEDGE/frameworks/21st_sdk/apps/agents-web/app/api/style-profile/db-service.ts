import { prisma } from "@/lib/prisma"
import { StyleProfile } from "./types"

export interface StyleProfileDB {
  id: string
  url: string
  url_slug: string
  site_name: string | null
  css: string | null // Complete CSS theme with :root, .dark, and @theme inline
  styles: any // Parsed for UI from css
  markdown_content: string
  structured_data: any | null
  generated_at: string
  updated_at: string
  status: "processing" | "completed" | "failed"
  error_message: string | null
  // New fields for improved architecture
  source_type: "preset" | "community" | "custom"
  created_by_team_id: string | null
  is_public: boolean
}

export interface TeamStyleProfileDB {
  id: string
  team_id: string
  style_profile_id: string
  relationship_type: "saved" | "custom"
  is_active: boolean
  created_at: string
  updated_at: string
}

export class StyleProfileDBService {
  /**
   * Normalize URL by removing protocol for consistent storage/lookup
   */
  private static normalizeUrl(url: string): string {
    return url.replace(/^https?:\/\//, "")
  }

  /**
   * Check if a style profile exists for the given URL
   */
  static async getByUrl(url: string): Promise<StyleProfileDB | null> {
    const normalizedUrl = this.normalizeUrl(url)

    const profile = await prisma.styleProfile.findFirst({
      where: {
        url: normalizedUrl,
        status: "completed",
      },
      orderBy: {
        generated_at: "desc",
      },
    })

    if (!profile) {
      return null
    }

    return this.convertPrismaToDb(profile)
  }

  /**
   * Get team's active style profile
   */
  static async getTeamStyleProfile(
    teamId: string,
  ): Promise<StyleProfileDB | null> {
    const teamStyleProfile = await prisma.teamStyleProfile.findFirst({
      where: {
        team_id: teamId,
        is_active: true,
      },
      include: {
        styleProfile: true,
      },
    })

    if (!teamStyleProfile?.styleProfile) {
      return null
    }

    return this.convertPrismaToDb(teamStyleProfile.styleProfile)
  }

  /**
   * Get all team's style profiles (saved + custom themes)
   */
  static async getAllTeamStyleProfiles(
    teamId: string,
  ): Promise<StyleProfileDB[]> {
    const teamStyleProfiles = await prisma.teamStyleProfile.findMany({
      where: {
        team_id: teamId,
        relationship_type: {
          in: ["saved", "custom"],
        },
      },
      include: {
        styleProfile: true,
      },
      orderBy: {
        updated_at: "desc",
      },
    })

    return teamStyleProfiles
      .filter((tsp) => tsp.styleProfile)
      .map((tsp) => this.convertPrismaToDb(tsp.styleProfile!))
  }

  /**
   * Get team's custom themes only
   */
  static async getTeamCustomThemes(teamId: string): Promise<StyleProfileDB[]> {
    const teamStyleProfiles = await prisma.teamStyleProfile.findMany({
      where: {
        team_id: teamId,
        relationship_type: "custom",
      },
      include: {
        styleProfile: true,
      },
      orderBy: {
        updated_at: "desc",
      },
    })

    return teamStyleProfiles
      .filter((tsp) => tsp.styleProfile)
      .map((tsp) => this.convertPrismaToDb(tsp.styleProfile!))
  }

  /**
   * Get team's saved themes (includes both saved community themes and active preset themes)
   */
  static async getTeamSavedThemes(teamId: string): Promise<StyleProfileDB[]> {
    const teamStyleProfiles = await prisma.teamStyleProfile.findMany({
      where: {
        team_id: teamId,
        relationship_type: "saved",
      },
      include: {
        styleProfile: true,
      },
      orderBy: {
        updated_at: "desc",
      },
    })

    return teamStyleProfiles
      .filter((tsp) => tsp.styleProfile)
      .map((tsp) => this.convertPrismaToDb(tsp.styleProfile!))
  }

  /**
   * Set team's style profile by URL (reuses existing profile if found)
   */
  static async setTeamStyleProfileByUrl(
    teamId: string,
    url: string,
  ): Promise<string | null> {
    const normalizedUrl = this.normalizeUrl(url)

    // Find existing style profile by URL
    const existingProfile = await prisma.styleProfile.findFirst({
      where: {
        url: normalizedUrl,
        status: "completed",
      },
      orderBy: {
        generated_at: "desc",
      },
    })

    if (!existingProfile) {
      return null
    }

    // Remove existing style profile for this team and add new one
    const existingTeamProfile = await prisma.teamStyleProfile.findFirst({
      where: { team_id: teamId },
    })

    if (existingTeamProfile) {
      await prisma.teamStyleProfile.update({
        where: { id: existingTeamProfile.id },
        data: {
          style_profile_id: existingProfile.id,
          updated_at: new Date(),
        },
      })
    } else {
      await prisma.teamStyleProfile.create({
        data: {
          team_id: teamId,
          style_profile_id: existingProfile.id,
        },
      })
    }

    return existingProfile.id
  }

  /**
   * Set team's style profile by profile ID (DEPRECATED - use specific methods below)
   */
  static async setTeamStyleProfile(
    teamId: string,
    styleProfileId: string,
  ): Promise<void> {
    // For backwards compatibility, this sets as active theme
    await this.setActiveTheme(teamId, styleProfileId)
  }

  /**
   * Set active theme for a team (only one active at a time)
   */
  static async setActiveTheme(
    teamId: string,
    styleProfileId: string,
  ): Promise<void> {
    // Deactivate current active theme
    await prisma.teamStyleProfile.updateMany({
      where: {
        team_id: teamId,
        is_active: true,
      },
      data: {
        is_active: false,
        updated_at: new Date(),
      },
    })

    // Check if team already has this theme saved
    const existingLink = await prisma.teamStyleProfile.findFirst({
      where: {
        team_id: teamId,
        style_profile_id: styleProfileId,
      },
    })

    if (existingLink) {
      // Update existing link to active
      await prisma.teamStyleProfile.update({
        where: { id: existingLink.id },
        data: {
          is_active: true,
          updated_at: new Date(),
        },
      })
    } else {
      // Create new active link
      await prisma.teamStyleProfile.create({
        data: {
          team_id: teamId,
          style_profile_id: styleProfileId,
          relationship_type: "custom",
          is_active: true,
        },
      })
    }
  }

  /**
   * Save any theme to team (saves without making active)
   */
  static async saveThemeToTeam(
    teamId: string,
    styleProfileId: string,
  ): Promise<void> {
    // Check if already exists
    const existingLink = await prisma.teamStyleProfile.findFirst({
      where: {
        team_id: teamId,
        style_profile_id: styleProfileId,
      },
    })

    if (!existingLink) {
      await prisma.teamStyleProfile.create({
        data: {
          team_id: teamId,
          style_profile_id: styleProfileId,
          relationship_type: "saved",
          is_active: false,
        },
      })
    }
  }

  /**
   * Add community theme to team (saves without making active)
   */
  static async addCommunityThemeToTeam(
    teamId: string,
    styleProfileId: string,
  ): Promise<void> {
    // Use the universal save method
    await this.saveThemeToTeam(teamId, styleProfileId)
  }

  /**
   * Link custom theme to team
   */
  static async setTeamCustomTheme(
    teamId: string,
    styleProfileId: string,
  ): Promise<void> {
    await prisma.teamStyleProfile.create({
      data: {
        team_id: teamId,
        style_profile_id: styleProfileId,
        relationship_type: "custom",
        is_active: false,
      },
    })
  }

  /**
   * Remove team's style profile
   */
  static async removeTeamStyleProfile(teamId: string): Promise<void> {
    await prisma.teamStyleProfile.deleteMany({
      where: {
        team_id: teamId,
      },
    })
  }

  /**
   * Remove specific theme from team (removes the relationship, not the theme itself)
   */
  static async removeThemeFromTeam(
    teamId: string,
    styleProfileId: string,
  ): Promise<void> {
    await prisma.teamStyleProfile.deleteMany({
      where: {
        team_id: teamId,
        style_profile_id: styleProfileId,
      },
    })
  }

  static async disableThemeForTeam(
    teamId: string,
    styleProfileId: string,
  ): Promise<void> {
    await prisma.teamStyleProfile.update({
      where: {
        team_id_style_profile_id: {
          team_id: teamId,
          style_profile_id: styleProfileId,
        },
      },
      data: {
        is_active: false,
        updated_at: new Date(),
      },
    })
  }

  /**
   * Check if profile needs refresh (older than 1 hour)
   */
  static async needsRefresh(
    url: string,
    hoursOld: number = 1,
  ): Promise<boolean> {
    const profile = await this.getByUrl(url)
    if (!profile) return true

    const generatedAt = new Date(profile.generated_at)
    const hoursAgo = new Date(Date.now() - hoursOld * 60 * 60 * 1000)

    return generatedAt < hoursAgo
  }

  /**
   * Create a new style profile record with 'processing' status
   */
  static async createProcessing(url: string, urlSlug: string): Promise<string> {
    const profile = await prisma.styleProfile.create({
      data: {
        url,
        url_slug: urlSlug,
        status: "processing",
        markdown_content: "", // Required field, will be updated later
      },
    })

    return profile.id
  }

  /**
   * Update profile with completed data
   */
  static async updateCompleted(
    id: string,
    data: {
      site_name: string
      css?: string
      markdown_content: string
      structured_data?: any
    },
  ): Promise<void> {
    await prisma.styleProfile.update({
      where: { id },
      data: {
        ...data,
        status: "completed",
        updated_at: new Date(),
      },
    })
  }

  /**
   * Update markdown content for an existing profile
   */
  static async updateMarkdownContent(
    id: string,
    markdownContent: string,
  ): Promise<void> {
    await prisma.styleProfile.update({
      where: { id },
      data: {
        markdown_content: markdownContent,
        updated_at: new Date(),
      },
    })
  }

  /**
   * Mark profile as failed
   */
  static async markFailed(id: string, errorMessage: string): Promise<void> {
    await prisma.styleProfile.update({
      where: { id },
      data: {
        status: "failed",
        error_message: errorMessage,
        updated_at: new Date(),
      },
    })
  }

  /**
   * Update structured data for an existing profile
   */
  static async updateStructuredData(
    id: string,
    structuredData: any,
  ): Promise<void> {
    await prisma.styleProfile.update({
      where: { id },
      data: {
        structured_data: structuredData,
        updated_at: new Date(),
      },
    })
  }

  /**
   * Update structured data by URL
   */
  static async updateStructuredDataByUrl(
    url: string,
    structuredData: any,
  ): Promise<void> {
    const normalizedUrl = this.normalizeUrl(url)

    await prisma.styleProfile.updateMany({
      where: { url: normalizedUrl },
      data: {
        structured_data: structuredData,
        updated_at: new Date(),
      },
    })
  }

  /**
   * Get stale profiles that need refresh
   */
  static async getStaleProfiles(
    hoursOld: number = 1,
  ): Promise<StyleProfileDB[]> {
    const cutoffDate = new Date(Date.now() - hoursOld * 60 * 60 * 1000)

    const profiles = await prisma.styleProfile.findMany({
      where: {
        status: "completed",
        generated_at: {
          lt: cutoffDate,
        },
      },
      orderBy: {
        generated_at: "asc",
      },
    })

    return profiles.map((profile) => this.convertPrismaToDb(profile))
  }

  /**
   * Convert DB record to StyleProfile format
   */
  static convertToStyleProfile(dbRecord: StyleProfileDB): StyleProfile {
    return {
      id: dbRecord.id,
      siteName: dbRecord.site_name || "",
      url: dbRecord.url,
      generatedAt: new Date(dbRecord.generated_at).toISOString().split("T")[0],
      css: dbRecord.css || undefined,
      styles: dbRecord.styles, // Include parsed styles for UI compatibility
    } as StyleProfile & { id: string }
  }

  /**
   * Delete old profiles (cleanup)
   */
  static async deleteOlderThan(days: number): Promise<number> {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    const result = await prisma.styleProfile.deleteMany({
      where: {
        generated_at: {
          lt: cutoffDate,
        },
      },
    })

    return result.count
  }

  /**
   * Find existing custom theme by original website URL
   */
  static async findCustomThemeByWebsiteUrl(
    websiteUrl: string,
    teamId: string,
  ): Promise<StyleProfileDB | null> {
    const normalizedUrl = this.normalizeUrl(websiteUrl)

    // Look for existing custom themes that were created from this website URL
    // Custom themes have URLs like "custom://teamId/name-timestamp" but we need to track original URL
    const profile = await prisma.styleProfile.findFirst({
      where: {
        // Look for profiles that have structured_data with originalUrl
        structured_data: {
          path: ["originalUrl"],
          equals: normalizedUrl,
        },
        status: "completed",
      },
      include: {
        teamStyleProfiles: {
          where: {
            team_id: teamId,
          },
        },
      },
      orderBy: {
        generated_at: "desc",
      },
    })

    if (!profile) {
      return null
    }

    return this.convertPrismaToDb(profile)
  }

  /**
   * Create a custom theme profile for a team
   */
  static async createCustomProfile(data: {
    name: string
    teamId: string
    css: string // CSS format
    originalUrl?: string // Add optional original URL for tracking
  }): Promise<string> {
    // Create a unique URL with timestamp to avoid conflicts
    const timestamp = Date.now()
    const uniqueUrl = `custom://${data.teamId}/${data.name}-${timestamp}`

    // Create the style profile
    const profile = await prisma.styleProfile.create({
      data: {
        url: uniqueUrl,
        url_slug: `custom-${data.teamId}-${data.name}-${timestamp}`,
        site_name: data.name,
        css: data.css,
        markdown_content: `# ${data.name}\n\nCustom theme created by user.`,
        structured_data: data.originalUrl
          ? {
              originalUrl: this.normalizeUrl(data.originalUrl),
              createdAt: new Date().toISOString(),
            }
          : undefined,
        status: "completed",
        // New fields for improved architecture
        source_type: data.originalUrl ? "community" : "custom",
        created_by_team_id: data.originalUrl ? null : data.teamId, // Community themes not tied to specific team
        is_public: data.originalUrl ? true : false,
      },
    })

    // Link it to the team as a custom relationship
    await this.setTeamCustomTheme(data.teamId, profile.id)

    return profile.id
  }

  /**
   * Delete a custom profile for a team
   */
  static async deleteCustomProfile(
    profileId: string,
    teamId: string,
  ): Promise<void> {
    // First, remove the team style profile link
    await prisma.teamStyleProfile.deleteMany({
      where: {
        team_id: teamId,
        style_profile_id: profileId,
      },
    })

    // Then delete the style profile itself (only if it's a custom profile created by this team)
    await prisma.styleProfile.deleteMany({
      where: {
        id: profileId,
        source_type: "custom",
        created_by_team_id: teamId,
      },
    })
  }

  /**
   * Parse CSS theme to create legacy styles format for UI compatibility
   */
  private static parseCssToStyles(css: string): any {
    try {
      // Extract :root variables for light theme
      const rootMatch = css.match(/:root\s*{([^}]*)}/s)
      const darkMatch = css.match(/\.dark\s*{([^}]*)}/s)

      const parseVars = (varsText: string) => {
        const vars: Record<string, string> = {}
        const varMatches = varsText.matchAll(/--([^:]+):\s*([^;]+);/g)
        for (const match of varMatches) {
          const key = match[1].trim()
          const value = match[2].trim()
          vars[key] = value
        }
        return vars
      }

      const light = rootMatch ? parseVars(rootMatch[1]) : {}
      const dark = darkMatch ? parseVars(darkMatch[1]) : {}

      return { light, dark }
    } catch (e) {
      console.error("Failed to parse CSS to styles:", e)
      return {}
    }
  }

  /**
   * Convert Prisma model to our DB interface
   */
  private static convertPrismaToDb(profile: any): StyleProfileDB {
    // Create styles object for UI compatibility
    let styles = {}

    if (profile.structured_data) {
      // Check if structured_data has light/dark directly
      if (profile.structured_data.light && profile.structured_data.dark) {
        styles = {
          light: profile.structured_data.light,
          dark: profile.structured_data.dark,
        }
      } else if (profile.css) {
        // Fallback to parsing CSS
        styles = this.parseCssToStyles(profile.css)
      }
    } else if (profile.css) {
      // For other themes, parse CSS
      styles = this.parseCssToStyles(profile.css)
    }

    return {
      id: profile.id,
      url: profile.url,
      url_slug: profile.url_slug,
      site_name: profile.site_name,
      css: profile.css,
      styles: styles, // Parsed styles for UI compatibility
      markdown_content: profile.markdown_content,
      structured_data: profile.structured_data,
      generated_at:
        profile.generated_at?.toISOString() || new Date().toISOString(),
      updated_at: profile.updated_at?.toISOString() || new Date().toISOString(),
      status: profile.status as "processing" | "completed" | "failed",
      error_message: profile.error_message,
      // New fields for improved architecture
      source_type: profile.source_type || "community",
      created_by_team_id: profile.created_by_team_id,
      is_public: profile.is_public ?? true,
    }
  }

  /**
   * Get preset themes (built-in themes from database)
   */
  static async getPresetThemes(): Promise<StyleProfileDB[]> {
    const profiles = await prisma.styleProfile.findMany({
      where: {
        source_type: "preset",
        is_public: true,
        status: "completed",
        css: {
          not: null,
        },
      },
      orderBy: {
        site_name: "asc",
      },
    })

    return profiles.map((profile) => this.convertPrismaToDb(profile))
  }

  /**
   * Get community themes (themes created from websites, available to all users)
   */
  static async getCommunityThemes(
    limit: number = 20,
  ): Promise<StyleProfileDB[]> {
    const profiles = await prisma.styleProfile.findMany({
      where: {
        source_type: "community",
        is_public: true,
        status: "completed",
        css: {
          not: null,
        },
      },
      orderBy: {
        generated_at: "desc",
      },
      take: limit,
    })

    // Filter out empty CSS and ensure valid themes
    const validProfiles = profiles.filter((profile) => {
      if (!profile.css || profile.css.trim() === "") return false
      // Ensure CSS contains actual theme variables
      return profile.css.includes("--") || profile.css.includes("background")
    })

    return validProfiles.map((profile) => this.convertPrismaToDb(profile))
  }
}
