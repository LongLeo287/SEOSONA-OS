import { z } from "zod"

// Shared API Key response schema
export const ApiKeyResponseSchema = z.object({
  id: z.string(),
  key: z.string().nullable(),
  key_prefix: z.string().nullable(),
  user_id: z.string(),
  team_id: z.string().nullable(),
  plan: z.enum(["free", "pro", "enterprise"]),
  requests_limit: z.number(),
  requests_count: z.number(),
  created_at: z.string(),
  expires_at: z.string().nullable(),
  last_used_at: z.string().nullable(),
  is_active: z.boolean(),
  project_url: z.string(),
})

export type ApiKeyResponse = z.infer<typeof ApiKeyResponseSchema>

// Input schemas for future extensibility
export const GetApiKeyInputSchema = z
  .object({
    includeUsage: z.boolean().optional().default(false),
    teamId: z.string().uuid().optional(),
  })
  .optional()

export const CreateApiKeyInputSchema = z.object({
  plan: z.enum(["free", "pro", "enterprise"]).default("free"),
  requests_limit: z.number().min(1).max(10000).default(100),
  project_url: z.string().url().optional(),
  team_id: z.string().uuid().optional(),
})

// Helper function to normalize database response to our schema
export function normalizeApiKeyResponse(rawApiKey: any): ApiKeyResponse {
  return {
    id: rawApiKey.id,
    key: rawApiKey.key ?? null,
    key_prefix: rawApiKey.key_prefix ?? null,
    user_id: rawApiKey.user_id,
    team_id: rawApiKey.team_id || null,
    plan: rawApiKey.plan || "free",
    requests_limit: rawApiKey.requests_limit || 100,
    requests_count: rawApiKey.requests_count || 0,
    created_at: rawApiKey.created_at || new Date().toISOString(),
    expires_at: rawApiKey.expires_at,
    last_used_at: rawApiKey.last_used_at,
    is_active: rawApiKey.is_active ?? true,
    project_url: rawApiKey.project_url || "https://21st.dev/magic",
  }
}
