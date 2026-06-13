import {
  archiveMcpCredential,
  archiveMcpVault,
  createMcpVault,
  createOrUpdateMcpCredential,
  getMcpVaultDetail,
  hardDeleteMcpCredential,
  hardDeleteMcpVault,
  listMcpVaults,
  mcpCredentialInjectSchema,
  mcpMetadataSchema,
  setDefaultMcpVault,
  updateMcpVault,
} from "@/lib/server/mcp-vaults"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { checkTeamAccess } from "../teams/utils"

const credentialInputSchema = z.object({
  teamId: z.string().uuid(),
  vaultId: z.string().uuid(),
  name: z.string().max(200).optional().nullable(),
  serverUrl: z.string().url(),
  auth: z.discriminatedUnion("type", [
    z.object({
      type: z.literal("bearer"),
      token: z.string().min(1),
    }),
    z.object({
      type: z.literal("oauth"),
      accessToken: z.string().optional(),
      refreshToken: z.string().optional(),
      clientId: z.string().optional(),
      clientSecret: z.string().optional(),
      tokenEndpoint: z.string().url().optional(),
      tokenEndpointAuth: z
        .enum(["none", "client_secret_basic", "client_secret_post"])
        .optional(),
      tokenType: z.string().optional(),
      expiresAt: z.string().optional(),
      scope: z.string().optional(),
      resource: z.string().optional(),
    }),
  ]),
  inject: mcpCredentialInjectSchema.optional(),
  metadata: mcpMetadataSchema.optional(),
})

function mapMcpError(error: unknown): never {
  const message = error instanceof Error ? error.message : String(error)

  if (message.includes("already exists")) {
    throw new TRPCError({ code: "CONFLICT", message })
  }

  if (message.includes("not found")) {
    throw new TRPCError({ code: "NOT_FOUND", message })
  }

  if (message.includes("20 active credentials")) {
    throw new TRPCError({ code: "UNPROCESSABLE_CONTENT", message })
  }

  throw new TRPCError({ code: "BAD_REQUEST", message })
}

export const mcpVaultsRouter = createTRPCRouter({
  list: protectedProcedure
    .input(z.object({ teamId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)
      return listMcpVaults(input.teamId)
    }),

  get: protectedProcedure
    .input(z.object({ teamId: z.string().uuid(), vaultId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)
      const detail = await getMcpVaultDetail(input.teamId, input.vaultId)
      if (!detail) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Vault not found" })
      }
      return detail
    }),

  create: protectedProcedure
    .input(
      z.object({
        teamId: z.string().uuid(),
        name: z.string().min(1).max(200),
        description: z.string().max(500).optional().nullable(),
        metadata: mcpMetadataSchema.optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)
      return createMcpVault(input)
    }),

  update: protectedProcedure
    .input(
      z.object({
        teamId: z.string().uuid(),
        vaultId: z.string().uuid(),
        name: z.string().min(1).max(200).optional(),
        description: z.string().max(500).optional().nullable(),
        metadata: mcpMetadataSchema.optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)
      const result = await updateMcpVault(input)
      if (!result) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Vault not found" })
      }
      return result
    }),

  archive: protectedProcedure
    .input(z.object({ teamId: z.string().uuid(), vaultId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)
      const result = await archiveMcpVault(input)
      if (!result) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Vault not found" })
      }
      return result
    }),

  hardDelete: protectedProcedure
    .input(z.object({ teamId: z.string().uuid(), vaultId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)
      try {
        const result = await hardDeleteMcpVault(input)
        if (!result) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Vault not found",
          })
        }
        return result
      } catch (error) {
        if (error instanceof TRPCError) throw error
        throw new TRPCError({
          code: "CONFLICT",
          message: error instanceof Error ? error.message : String(error),
        })
      }
    }),

  setDefault: protectedProcedure
    .input(z.object({ teamId: z.string().uuid(), vaultId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)
      const result = await setDefaultMcpVault(input)
      if (!result) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Vault not found" })
      }
      return result
    }),

  createCredential: protectedProcedure
    .input(credentialInputSchema)
    .mutation(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)
      try {
        return createOrUpdateMcpCredential(input)
      } catch (error) {
        mapMcpError(error)
      }
    }),

  updateCredential: protectedProcedure
    .input(credentialInputSchema.extend({ credentialId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)
      try {
        return createOrUpdateMcpCredential(input)
      } catch (error) {
        mapMcpError(error)
      }
    }),

  archiveCredential: protectedProcedure
    .input(
      z.object({
        teamId: z.string().uuid(),
        vaultId: z.string().uuid(),
        credentialId: z.string().uuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)
      const result = await archiveMcpCredential(input)
      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Credential not found",
        })
      }
      return result
    }),

  hardDeleteCredential: protectedProcedure
    .input(
      z.object({
        teamId: z.string().uuid(),
        vaultId: z.string().uuid(),
        credentialId: z.string().uuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await checkTeamAccess(input.teamId, ctx.auth.userId!)
      try {
        const result = await hardDeleteMcpCredential(input)
        if (!result) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Credential not found",
          })
        }
        return result
      } catch (error) {
        if (error instanceof TRPCError) throw error
        throw new TRPCError({
          code: "CONFLICT",
          message: error instanceof Error ? error.message : String(error),
        })
      }
    }),
})
