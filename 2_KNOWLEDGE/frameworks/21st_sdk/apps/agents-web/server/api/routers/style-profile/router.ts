import { z } from "zod"
import { TRPCError } from "@trpc/server"
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import { StyleProfileDBService } from "@/app/api/style-profile/db-service"

export const styleProfileRouter = createTRPCRouter({
  // Team-based style profile operations
  getTeamStyleProfile: publicProcedure
    .input(
      z.object({
        teamId: z.string().uuid("Invalid team ID"),
      }),
    )
    .query(async ({ input }) => {
      try {
        // Get all profiles for the team
        const allProfiles = await StyleProfileDBService.getAllTeamStyleProfiles(
          input.teamId,
        )

        if (!allProfiles || allProfiles.length === 0) {
          return {
            allProfiles: [],
            profile: null,
          }
        }

        // Get the most recent profile as the primary one
        const primaryProfile = allProfiles[0]

        return {
          id: primaryProfile.id,
          url: primaryProfile.url,
          siteName: primaryProfile.site_name,
          markdownContent: primaryProfile.markdown_content,
          structuredData: primaryProfile.structured_data,
          generatedAt: primaryProfile.generated_at,
          profile: StyleProfileDBService.convertToStyleProfile(primaryProfile),
          allProfiles: allProfiles.map((profile) => ({
            id: profile.id,
            url: profile.url,
            site_name: profile.site_name,
            styles: StyleProfileDBService.convertToStyleProfile(profile).styles,
          })),
        }
      } catch (error) {
        console.error("Failed to get team style profile:", error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get team style profile",
          cause: error,
        })
      }
    }),

  getActiveTeamStyleProfile: publicProcedure
    .input(
      z.object({
        teamId: z.string().uuid("Invalid team ID"),
      }),
    )
    .query(async ({ input }) => {
      try {
        // Get only the active profile for the team
        const activeProfile = await StyleProfileDBService.getTeamStyleProfile(
          input.teamId,
        )

        if (!activeProfile) {
          return null
        }

        return {
          id: activeProfile.id,
          url: activeProfile.url,
          siteName: activeProfile.site_name,
          markdownContent: activeProfile.markdown_content,
          structuredData: activeProfile.structured_data,
          generatedAt: activeProfile.generated_at,
          profile: StyleProfileDBService.convertToStyleProfile(activeProfile),
        }
      } catch (error) {
        console.error("Failed to get active team style profile:", error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get active team style profile",
          cause: error,
        })
      }
    }),

  createCustomTheme: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Theme name is required"),
        teamId: z.string().uuid("Invalid team ID"),
        css: z.string().min(1, "CSS theme is required"),
        originalUrl: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        if (!ctx.auth?.userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Authentication required",
          })
        }

        const profileId = await StyleProfileDBService.createCustomProfile({
          name: input.name,
          teamId: input.teamId,
          css: input.css,
          originalUrl: input.originalUrl,
        })

        return {
          success: true,
          message: `Custom theme "${input.name}" created successfully`,
          profileId,
        }
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error
        }
        console.error("Failed to create custom theme:", error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create custom theme",
          cause: error,
        })
      }
    }),

  getCommunityThemes: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
      }),
    )
    .query(async ({ input }) => {
      try {
        const communityThemes = await StyleProfileDBService.getCommunityThemes(
          input.limit,
        )

        return communityThemes.map((theme) => ({
          id: theme.id,
          siteName: theme.site_name,
          url: theme.url,
          css: theme.css,
          styles: theme.styles,
          generatedAt: theme.generated_at,
        }))
      } catch (error) {
        console.error("Failed to get community themes:", error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get community themes",
          cause: error,
        })
      }
    }),

  getPresetThemes: publicProcedure.query(async () => {
    try {
      const presetThemes = await StyleProfileDBService.getPresetThemes()

      return presetThemes.map((theme) => ({
        id: theme.id,
        key:
          theme.url?.replace("preset://", "") ||
          theme.url_slug?.replace("preset-", ""),
        siteName: theme.site_name,
        url: theme.url,
        css: theme.css,
        styles: theme.styles,
        generatedAt: theme.generated_at,
      }))
    } catch (error) {
      console.error("Failed to get preset themes:", error)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get preset themes",
        cause: error,
      })
    }
  }),

  deleteCustomTheme: publicProcedure
    .input(
      z.object({
        profileId: z.string().uuid("Invalid profile ID"),
        teamId: z.string().uuid("Invalid team ID"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        if (!ctx.auth?.userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Authentication required",
          })
        }

        await StyleProfileDBService.deleteCustomProfile(
          input.profileId,
          input.teamId,
        )

        return {
          success: true,
          message: "Theme deleted successfully",
        }
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error
        }
        console.error("Failed to delete custom theme:", error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete custom theme",
          cause: error,
        })
      }
    }),

  applyThemeToTeam: publicProcedure
    .input(
      z.object({
        teamId: z.string().uuid("Invalid team ID"),
        styleProfileId: z.string().uuid("Invalid style profile ID"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        if (!ctx.auth?.userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Authentication required",
          })
        }

        await StyleProfileDBService.setActiveTheme(
          input.teamId,
          input.styleProfileId,
        )

        return {
          success: true,
          message: "Theme applied to team successfully",
        }
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error
        }
        console.error("Failed to apply theme to team:", error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to apply theme to team",
          cause: error,
        })
      }
    }),

  saveThemeToTeam: publicProcedure
    .input(
      z.object({
        teamId: z.string().uuid("Invalid team ID"),
        styleProfileId: z.string().uuid("Invalid style profile ID"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        if (!ctx.auth?.userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Authentication required",
          })
        }

        await StyleProfileDBService.saveThemeToTeam(
          input.teamId,
          input.styleProfileId,
        )

        return {
          success: true,
          message: "Theme saved to team successfully",
        }
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error
        }
        console.error("Failed to save theme to team:", error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to save theme to team",
          cause: error,
        })
      }
    }),

  addCommunityThemeToTeam: publicProcedure
    .input(
      z.object({
        teamId: z.string().uuid("Invalid team ID"),
        styleProfileId: z.string().uuid("Invalid style profile ID"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        if (!ctx.auth?.userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Authentication required",
          })
        }

        await StyleProfileDBService.addCommunityThemeToTeam(
          input.teamId,
          input.styleProfileId,
        )

        return {
          success: true,
          message: "Community theme added to team successfully",
        }
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error
        }
        console.error("Failed to add community theme to team:", error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to add community theme to team",
          cause: error,
        })
      }
    }),

  disableThemeForTeam: publicProcedure
    .input(
      z.object({
        teamId: z.string().uuid("Invalid team ID"),
        styleProfileId: z.string().uuid("Invalid style profile ID"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        if (!ctx.auth?.userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Authentication required",
          })
        }

        await StyleProfileDBService.disableThemeForTeam(
          input.teamId,
          input.styleProfileId,
        )

        return {
          success: true,
          message: "Theme disabled for team successfully",
        }
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error
        }
        console.error("Failed to disable theme for team:", error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to disable theme for team",
          cause: error,
        })
      }
    }),

  removeThemeFromTeam: publicProcedure
    .input(
      z.object({
        teamId: z.string().uuid("Invalid team ID"),
        styleProfileId: z.string().uuid("Invalid style profile ID"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        if (!ctx.auth?.userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Authentication required",
          })
        }

        await StyleProfileDBService.removeThemeFromTeam(
          input.teamId,
          input.styleProfileId,
        )

        return {
          success: true,
          message: "Theme removed from team successfully",
        }
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error
        }
        console.error("Failed to remove theme from team:", error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to remove theme from team",
          cause: error,
        })
      }
    }),

  getTeamCustomThemes: publicProcedure
    .input(
      z.object({
        teamId: z.string().uuid("Invalid team ID"),
      }),
    )
    .query(async ({ input, ctx }) => {
      try {
        if (!ctx.auth?.userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Authentication required",
          })
        }

        const customThemes = await StyleProfileDBService.getTeamCustomThemes(
          input.teamId,
        )

        return customThemes
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error
        }
        console.error("Failed to get team custom themes:", error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get team custom themes",
          cause: error,
        })
      }
    }),

  getTeamSavedThemes: publicProcedure
    .input(
      z.object({
        teamId: z.string().uuid("Invalid team ID"),
      }),
    )
    .query(async ({ input, ctx }) => {
      try {
        if (!ctx.auth?.userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Authentication required",
          })
        }

        const savedThemes = await StyleProfileDBService.getTeamSavedThemes(
          input.teamId,
        )

        return savedThemes
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error
        }
        console.error("Failed to get team saved themes:", error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get team saved themes",
          cause: error,
        })
      }
    }),

  getAllTeamThemes: publicProcedure
    .input(
      z.object({
        teamId: z.string().uuid("Invalid team ID"),
      }),
    )
    .query(async ({ input, ctx }) => {
      try {
        if (!ctx.auth?.userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Authentication required",
          })
        }

        const allThemes = await StyleProfileDBService.getAllTeamStyleProfiles(
          input.teamId,
        )

        // Get active theme ID
        const activeTheme = await StyleProfileDBService.getTeamStyleProfile(
          input.teamId,
        )

        return allThemes.map((theme) => ({
          ...theme,
          isActive: activeTheme?.id === theme.id,
        }))
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error
        }
        console.error("Failed to get all team themes:", error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get all team themes",
          cause: error,
        })
      }
    }),
})
