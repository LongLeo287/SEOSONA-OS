import crypto from "crypto"
import {
  CURRENT_AGENT_API_KEY_PREFIX,
  getApiKeyPrefix,
  hashApiKey,
} from "@repo/api-key-security"
import { prisma } from "@/lib/prisma"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { TRPCError } from "@trpc/server"
import { checkTeamAccess } from "../teams/utils"
import {
  createAnApiKeySchema,
  listAnApiKeysSchema,
  revokeAnApiKeySchema,
  rotateAnApiKeySchema,
} from "./types"

function generateKey(): string {
  return CURRENT_AGENT_API_KEY_PREFIX + crypto.randomBytes(32).toString("hex")
}

function buildApiKeyCreateData(key: string) {
  return {
    key,
    key_hash: hashApiKey(key),
    key_prefix: getApiKeyPrefix(key),
  }
}

export const anApiKeysRouter = createTRPCRouter({
  list: protectedProcedure
    .input(listAnApiKeysSchema)
    .query(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)
      return prisma.anApiKey.findMany({
        where: { team_id: input.teamId },
        select: {
          id: true,
          key_prefix: true,
          team_id: true,
          user_id: true,
          name: true,
          is_active: true,
          created_at: true,
          last_used_at: true,
          expires_at: true,
          requests_limit: true,
          requests_count: true,
        },
        orderBy: { created_at: "desc" },
      })
    }),

  create: protectedProcedure
    .input(createAnApiKeySchema)
    .mutation(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)
      const key = generateKey()
      return prisma.anApiKey.create({
        data: {
          ...buildApiKeyCreateData(key),
          team_id: input.teamId,
          user_id: ctx.auth.userId!,
          name: input.name,
        },
      })
    }),

  revoke: protectedProcedure
    .input(revokeAnApiKeySchema)
    .mutation(async ({ input, ctx }) => {
      const apiKey = await prisma.anApiKey.findUnique({ where: { id: input.id } })
      if (!apiKey) {
        throw new TRPCError({ code: "NOT_FOUND", message: "API key not found" })
      }
      await checkTeamAccess(apiKey.team_id, ctx.auth.userId!)
      return prisma.anApiKey.update({
        where: { id: input.id },
        data: { is_active: false },
      })
    }),

  rotate: protectedProcedure
    .input(rotateAnApiKeySchema)
    .mutation(async ({ input, ctx }) => {
      const apiKey = await prisma.anApiKey.findUnique({ where: { id: input.id } })
      if (!apiKey) {
        throw new TRPCError({ code: "NOT_FOUND", message: "API key not found" })
      }
      await checkTeamAccess(apiKey.team_id, ctx.auth.userId!)

      const key = generateKey()
      const [, newKey] = await prisma.$transaction([
        prisma.anApiKey.update({
          where: { id: input.id },
          data: { is_active: false },
        }),
        prisma.anApiKey.create({
          data: {
            ...buildApiKeyCreateData(key),
            team_id: apiKey.team_id,
            user_id: ctx.auth.userId!,
            name: apiKey.name,
          },
        }),
      ])

      return newKey
    }),
})
