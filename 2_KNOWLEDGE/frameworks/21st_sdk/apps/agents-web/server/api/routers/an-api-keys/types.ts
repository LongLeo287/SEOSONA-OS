import { z } from "zod"

export const createAnApiKeySchema = z.object({
  teamId: z.string().uuid(),
  name: z.string().min(1).max(100).default("Default"),
})

export const listAnApiKeysSchema = z.object({
  teamId: z.string().uuid(),
})

export const revokeAnApiKeySchema = z.object({
  id: z.string().uuid(),
})

export const rotateAnApiKeySchema = z.object({
  id: z.string().uuid(),
})
