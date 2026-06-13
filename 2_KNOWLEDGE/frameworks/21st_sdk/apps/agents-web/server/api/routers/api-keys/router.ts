import { z } from "zod"
import { getApiKeyPrefix, hashApiKey } from "@repo/api-key-security"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { TRPCError } from "@trpc/server"
import { supabaseWithAdminAccess } from "@/lib/supabase"
import { prisma } from "@/lib/prisma"
import {
  GetApiKeyInputSchema,
  CreateApiKeyInputSchema,
  normalizeApiKeyResponse,
  type ApiKeyResponse,
} from "./types"
import { createApiKeyWithRetry } from "./create-api-key-with-retry"

async function persistLegacyApiKeyHash<TData extends { id: string; key: string }>(
  data: TData,
) {
  const key_hash = hashApiKey(data.key)
  const key_prefix = getApiKeyPrefix(data.key)

  await prisma.apiKey.update({
    where: { id: data.id },
    data: { key_hash, key_prefix },
  })

  return { ...data, key_hash, key_prefix }
}

async function createLegacyApiKeyWithHash(args: {
  userId: string
  plan: "free" | "pro" | "enterprise"
  requestsLimit: number
}) {
  const data = await createApiKeyWithRetry({
    rpc: (rpcArgs) => supabaseWithAdminAccess.rpc("create_api_key", rpcArgs),
    userId: args.userId,
    plan: args.plan,
    requestsLimit: args.requestsLimit,
  })

  return persistLegacyApiKeyHash(data)
}

export const apiKeysRouter = createTRPCRouter({
  // Get existing API key or create a new one for user
  getOrCreate: protectedProcedure
    .input(GetApiKeyInputSchema)
    .output(z.custom<ApiKeyResponse>())
    .query(async ({ ctx, input }) => {
      try {
        const teamId = input?.teamId

        // First try to get existing API key
        const { data: existingApiKey } = await supabaseWithAdminAccess
          .from("api_keys")
          .select("*")
          .eq("user_id", ctx.auth.userId)
          .order("created_at", { ascending: true })
          .limit(1)
          .maybeSingle()

        if (existingApiKey) {
          const apiKeyData = existingApiKey as any
          // Auto-link team if key has no team_id and teamId is provided
          if (!apiKeyData.team_id && teamId) {
            await prisma.apiKey.update({
              where: { id: apiKeyData.id },
              data: { team_id: teamId },
            })
            apiKeyData.team_id = teamId
          }
          return normalizeApiKeyResponse({ ...apiKeyData, key: null })
        }

        // If no API key exists, create a new one (with retry for webhook race condition)
        const newApiKey = await createLegacyApiKeyWithHash({
          userId: ctx.auth.userId,
          plan: "free",
          requestsLimit: 100,
        })

        // Auto-link team if teamId provided
        const newApiKeyData = newApiKey as any
        if (teamId) {
          await prisma.apiKey.update({
            where: { id: newApiKeyData.id },
            data: { team_id: teamId },
          })
          newApiKeyData.team_id = teamId
        }

        return normalizeApiKeyResponse(newApiKeyData)
      } catch (err) {
        console.error("Unexpected error in getOrCreate API key:", err)
        if (err instanceof TRPCError) {
          throw err
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred",
        })
      }
    }),

  // Get existing API key (without creating)
  get: protectedProcedure
    .input(GetApiKeyInputSchema)
    .output(z.custom<ApiKeyResponse>().nullable())
    .query(async ({ ctx }) => {
      const { data: apiKey } = await supabaseWithAdminAccess
        .from("api_keys")
        .select("*")
        .eq("user_id", ctx.auth.userId)
        .single()

      if (!apiKey) {
        return null
      }

      return normalizeApiKeyResponse({ ...apiKey, key: null })
    }),

  // Create new API key (force create)
  create: protectedProcedure
    .input(CreateApiKeyInputSchema)
    .output(z.custom<ApiKeyResponse>())
    .mutation(async ({ input, ctx }) => {
      try {
        // Retry on FK error in case Clerk webhook hasn't synced the user yet
        const data = await createLegacyApiKeyWithHash({
          userId: ctx.auth.userId,
          plan: input.plan,
          requestsLimit: input.requests_limit,
        })

        // If team_id provided, update the key with it (RPC doesn't support team_id)
        if (input.team_id) {
          await prisma.apiKey.update({
            where: { id: data.id },
            data: { team_id: input.team_id },
          })
        }

        return normalizeApiKeyResponse({
          ...data,
          team_id: input.team_id || null,
          project_url:
            input.project_url || data.project_url || "https://21st.dev/magic",
        })
      } catch (err) {
        console.error("Unexpected error creating API key:", err)
        if (err instanceof TRPCError) {
          throw err
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred",
        })
      }
    }),

  // Link API key to a team
  linkTeam: protectedProcedure
    .input(z.object({ teamId: z.string().uuid() }))
    .output(z.custom<ApiKeyResponse>())
    .mutation(async ({ input, ctx }) => {
      // Verify user owns the team
      const team = await prisma.team.findUnique({
        where: { id: input.teamId },
        select: { user_id: true },
      })

      if (!team || team.user_id !== ctx.auth.userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not own this team",
        })
      }

      // Find user's API key
      const apiKey = await prisma.apiKey.findFirst({
        where: { user_id: ctx.auth.userId },
      })

      if (!apiKey) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No API key found",
        })
      }

      const updated = await prisma.apiKey.update({
        where: { id: apiKey.id },
        data: { team_id: input.teamId },
      })

      return normalizeApiKeyResponse({ ...updated, key: null })
    }),
})
