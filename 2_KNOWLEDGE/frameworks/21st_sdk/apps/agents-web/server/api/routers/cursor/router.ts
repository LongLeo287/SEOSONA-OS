import { z } from "zod"
import { TRPCError } from "@trpc/server"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import {
  getTeamCursorIntegration,
  saveCursorRepositories,
  type CursorIntegrationRecord,
} from "@/lib/server/cursor-integration"
import {
  CursorBGAgentsAPI,
  type CursorRepository,
  type CursorRepositoriesResponse,
} from "@/lib/server/cursor-bg-agents-api"
import { encryptCursorApiKey } from "@/lib/server/crypto"
import { prisma } from "@/lib/prisma"

export const cursorRouter = createTRPCRouter({
  // Get team's cursor configuration
  getConfiguration: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(
      async ({
        input,
        ctx,
      }): Promise<{
        isConfigured: boolean
        hasApiKey: boolean
        selectedRepository: string | null
        configuredAt: string | null
        repositories: CursorRepository[] | null
      }> => {
        try {
          const integration = await getTeamCursorIntegration(
            input.teamId,
            ctx.auth.userId,
          )

          const hasApiKey = Boolean(integration.apiKey)
          const isConfigured =
            hasApiKey && Boolean(integration.selectedRepository)

          return {
            isConfigured,
            hasApiKey,
            selectedRepository: integration.selectedRepository,
            configuredAt: integration.rawIntegration?.configured_at || null,
            repositories: integration.repositories,
          }
        } catch (error) {
          if (error instanceof Error && error.message.includes("not found")) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Team not found or access denied",
            })
          }
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to get cursor configuration",
            cause: error,
          })
        }
      },
    ),

  // List repositories from Cursor API
  listRepositories: protectedProcedure
    .input(
      z.object({
        teamId: z.string().optional(),
        apiKey: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx }): Promise<CursorRepositoriesResponse> => {
      let apiKey = input.apiKey
      let cachedRepositories: CursorRepository[] | null = null

      // If teamId provided, try to get from team integration (including cached repositories)
      if (input.teamId) {
        try {
          const integration = await getTeamCursorIntegration(
            input.teamId,
            ctx.auth.userId,
          )
          apiKey = apiKey || integration.apiKey || undefined
          cachedRepositories = integration.repositories
        } catch (error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Failed to load team cursor integration",
            cause: error,
          })
        }
      }

      // If we have cached repositories, return them
      if (cachedRepositories && cachedRepositories.length > 0) {
        return {
          repositories: cachedRepositories,
        }
      }

      // No cached repositories, need to fetch from API
      if (!apiKey) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Either apiKey or teamId with valid integration must be provided",
        })
      }

      try {
        const cursorAPI = new CursorBGAgentsAPI(apiKey)
        const data = await cursorAPI.listRepositories()

        // Save repositories to database if teamId is provided
        if (input.teamId && data.repositories) {
          try {
            await saveCursorRepositories(
              input.teamId,
              ctx.auth.userId,
              data.repositories,
            )
          } catch (saveError) {
            console.error("Failed to save repositories to database", saveError)
            // Don't fail the entire request if saving fails
          }
        }

        return data
      } catch (error) {
        console.error("Failed to fetch Cursor repositories", error)
        const message =
          error instanceof Error
            ? error.message
            : "Failed to fetch repositories"

        // Handle specific error cases
        if (message.includes("401") || message.includes("Unauthorized")) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid Cursor API key",
          })
        }

        if (message.includes("429") || message.includes("rate limit")) {
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: "Rate limit exceeded. Please wait before trying again.",
          })
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
          cause: error,
        })
      }
    }),

  // Validate and save API key
  validateAndSaveApiKey: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
        apiKey: z.string().min(1, "API key is required"),
      }),
    )
    .mutation(
      async ({
        input,
        ctx,
      }): Promise<{
        success: boolean
        apiKeyName: string
        userEmail?: string
      }> => {
        const { teamId, apiKey } = input

        // First validate the API key using the dedicated validation endpoint
        try {
          const cursorAPI = new CursorBGAgentsAPI(apiKey)
          const validationData = await cursorAPI.validateApiKey()

          // API key is valid, now save it to the team
          const team = await prisma.team.findFirst({
            where: {
              id: teamId,
              user_id: ctx.auth.userId,
            },
            select: {
              cursor_integration: true,
            },
          })

          if (!team) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Team not found or access denied",
            })
          }

          const currentIntegration = (team.cursor_integration as CursorIntegrationRecord) || {}
          const updatedIntegration = {
            ...currentIntegration,
            api_key: encryptCursorApiKey(apiKey),
            api_key_name: validationData.apiKeyName,
            api_key_created_at: validationData.createdAt,
            user_email: validationData.userEmail,
            configured_at: new Date().toISOString(),
          }

          await prisma.team.update({
            where: { id: teamId },
            data: {
              cursor_integration: updatedIntegration as any, // Prisma JSON field requires any for complex types
            },
          })

          return {
            success: true,
            apiKeyName: validationData.apiKeyName,
            userEmail: validationData.userEmail,
          }
        } catch (error) {
          console.error("Failed to validate Cursor API key", error)
          const message =
            error instanceof Error
              ? error.message
              : "Failed to validate API key"

          // Handle specific error cases
          if (message.includes("401") || message.includes("Unauthorized")) {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "Invalid Cursor API key",
            })
          }

          if (message.includes("429") || message.includes("rate limit")) {
            throw new TRPCError({
              code: "TOO_MANY_REQUESTS",
              message: "Rate limit exceeded. Please wait before trying again.",
            })
          }

          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message,
            cause: error,
          })
        }
      },
    ),

  // Save selected repository
  saveSelectedRepository: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
        repository: z.string().min(1, "Repository is required"),
      }),
    )
    .mutation(async ({ input, ctx }): Promise<{ success: boolean }> => {
      const { teamId, repository } = input

      try {
        const team = await prisma.team.findFirst({
          where: {
            id: teamId,
            user_id: ctx.auth.userId,
          },
          select: {
            cursor_integration: true,
          },
        })

        if (!team) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Team not found or access denied",
          })
        }

        const currentIntegration = (team.cursor_integration as CursorIntegrationRecord) || {}
        const updatedIntegration = {
          ...currentIntegration,
          selected_repository: repository,
          repository_selected_at: new Date().toISOString(),
        }

        await prisma.team.update({
          where: { id: teamId },
          data: {
            cursor_integration: updatedIntegration as any, // Prisma JSON field requires any for complex types
          },
        })

        return { success: true }
      } catch (error) {
        console.error("Failed to save selected repository", error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to save repository selection",
          cause: error,
        })
      }
    }),

  // Disconnect cursor integration
  disconnect: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .mutation(async ({ input, ctx }): Promise<{ success: boolean }> => {
      try {
        const team = await prisma.team.findFirst({
          where: {
            id: input.teamId,
            user_id: ctx.auth.userId,
          },
        })

        if (!team) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Team not found or access denied",
          })
        }

        await prisma.team.update({
          where: { id: input.teamId },
          data: {
            cursor_integration: {},
          },
        })

        return { success: true }
      } catch (error) {
        console.error("Failed to disconnect cursor integration", error)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to disconnect cursor integration",
          cause: error,
        })
      }
    }),

  // Start a background agent
  startAgent: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
        prompt: z.union([
          z.string(),
          z.object({
            text: z.string(),
            images: z
              .array(
                z.object({
                  data: z.string(),
                  dimension: z.object({
                    width: z.number(),
                    height: z.number(),
                  }),
                }),
              )
              .optional(),
          }),
        ]),
        model: z.string().optional(),
        source: z
          .object({
            ref: z.string().optional(),
          })
          .optional(),
        target: z
          .object({
            autoCreatePr: z.boolean().optional(),
            branchName: z.string().optional(),
          })
          .optional(),
        webhook: z
          .object({
            url: z.string().optional(),
            secret: z.string().optional(),
          })
          .optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { teamId, prompt, model, source, target, webhook } = input

      // Get team's Cursor integration
      let apiKey: string | null = null
      let selectedRepository: string | null = null

      try {
        const integration = await getTeamCursorIntegration(
          teamId,
          ctx.auth.userId,
        )
        apiKey = integration.apiKey
        selectedRepository = integration.selectedRepository

        if (!apiKey || !selectedRepository) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cursor integration incomplete",
            cause: { needsConfiguration: true },
          })
        }
      } catch (error) {
        if (error instanceof TRPCError) throw error
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to load Cursor integration",
          cause: error,
        })
      }

      // Extract prompt data
      const promptData =
        typeof prompt === "string"
          ? { text: prompt }
          : { text: prompt.text, images: prompt.images }

      if (!promptData.text.trim()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Prompt text is required",
        })
      }

      try {
        const cursorAPI = new CursorBGAgentsAPI(apiKey)

        const agentRequest = {
          prompt: promptData,
          source: {
            repository: selectedRepository,
            ref: source?.ref || "main",
          },
          model,
          target,
          webhook,
        }

        const data = await cursorAPI.startAgent(agentRequest)
        return data
      } catch (error) {
        console.error("Failed to create Cursor background agent", error)
        const message =
          error instanceof Error ? error.message : "Failed to create agent"
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message,
          cause: error,
        })
      }
    }),
})
