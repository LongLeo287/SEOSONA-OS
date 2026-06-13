import { Router, type NextFunction, type Request, type Response } from "express"
import { and, desc, eq, inArray, isNull, ne, sql } from "drizzle-orm"
import { z } from "zod"
import {
  defaultMcpCredentialInjectRule,
  getMcpServerHostPattern,
  normalizeMcpServerUrl,
  normalizeVaultCredentialInjectRule,
  redactCredentialPayload,
  type McpCredentialPayload,
  type VaultCredentialInjectRule,
} from "@repo/sandbox-provider"
import { db } from "./db.js"
import { decrypt, encrypt } from "./crypto.js"
import {
  anApiKeys,
  anMcpCredentials,
  anMcpVaults,
  apiKeys,
} from "./schema.js"

const MAX_ACTIVE_CREDENTIALS_PER_VAULT = 20

type JsonRecord = Record<string, unknown>
type McpMetadata = Record<string, string>

class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly error: string,
    message: string,
    readonly headers?: Record<string, string>,
  ) {
    super(message)
  }
}

const mcpMetadataSchema = z
  .record(z.string(), z.string())
  .default({})
  .superRefine((metadata, ctx) => {
    const entries = Object.entries(metadata)
    if (entries.length > 16) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "metadata can contain at most 16 key-value pairs",
      })
    }
    for (const [key, value] of entries) {
      if (key.length > 64) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `metadata key "${key}" must be 64 characters or fewer`,
        })
      }
      if (value.length > 512) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `metadata value for "${key}" must be 512 characters or fewer`,
        })
      }
    }
  })

const mcpCredentialInjectSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("header"),
    header: z.string().min(1).max(200),
    prefix: z.string().max(200).optional(),
  }),
  z.object({
    kind: z.literal("query"),
    param: z.string().min(1).max(200),
  }),
  z.object({
    kind: z.literal("basic"),
    username: z.string().max(200).optional(),
  }),
])

const credentialAuthSchema = z.discriminatedUnion("type", [
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
])

const createVaultSchema = z.object({
  name: z.string().max(200),
  description: z.string().max(500).optional().nullable(),
  metadata: mcpMetadataSchema.optional(),
})

const updateVaultSchema = z.object({
  name: z.string().max(200).optional(),
  description: z.string().max(500).optional().nullable(),
  metadata: mcpMetadataSchema.optional(),
})

const credentialSchema = z.object({
  name: z.string().max(200).optional().nullable(),
  serverUrl: z.string().url(),
  auth: credentialAuthSchema,
  inject: mcpCredentialInjectSchema.optional(),
  metadata: mcpMetadataSchema.optional(),
})

const MCP_SERVER_SUGGESTIONS = [
  { name: "Canva", url: "https://mcp.canva.com/mcp" },
  { name: "Figma", url: "https://mcp.figma.com/mcp" },
  { name: "Notion", url: "https://mcp.notion.com/mcp" },
  { name: "Atlassian Rovo", url: "https://mcp.atlassian.com/v1/mcp" },
  { name: "Slack", url: "https://mcp.slack.com/mcp" },
  { name: "HubSpot", url: "https://mcp.hubspot.com/anthropic" },
  { name: "Linear", url: "https://mcp.linear.app/mcp" },
  { name: "Monday.com", url: "https://mcp.monday.com/mcp" },
  { name: "Microsoft 365", url: "https://microsoft365.mcp.claude.com/mcp" },
]

function asyncHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    handler(req, res, next).catch(next)
  }
}

function requireApiKeyRequest(req: Request) {
  if ((req as any).tokenClaims || (req as any).proxyJwtClaims) {
    throw new ApiError(
      403,
      "api_key_required",
      "Vault management requires a server API key",
    )
  }

  const apiKey = (req as any).apiKey as
    | { id: string; user_id: string; requests_count?: number; requests_limit?: number }
    | undefined
  const source = (req as any).apiKeySource as "an" | "legacy" | undefined
  const teamId = (req as any).teamId as string | undefined
  if (!apiKey || !source || !teamId) {
    throw new ApiError(
      403,
      "api_key_required",
      "Vault management requires a server API key",
    )
  }

  return { apiKey, source, teamId, userId: apiKey.user_id }
}

async function consumeApiKeyLimit(req: Request) {
  const { apiKey, source, userId } = requireApiKeyRequest(req)
  const limit = apiKey.requests_limit ?? 1000
  const count = apiKey.requests_count ?? 0
  if (count >= limit) {
    throw new ApiError(429, "rate_limit_exceeded", "API key request limit exceeded", {
      "X-RateLimit-Limit": String(limit),
      "X-RateLimit-Remaining": "0",
    })
  }

  const table = source === "an" ? anApiKeys : apiKeys
  await db
    .update(table)
    .set({
      requests_count: sql`${table.requests_count} + 1`,
      last_used_at: new Date(),
    })
    .where(eq(table.id, apiKey.id))

  return { remaining: Math.max(0, limit - count - 1), userId }
}

function parseBody<T>(schema: z.ZodType<T>, body: unknown): T {
  const parsed = schema.safeParse(body ?? {})
  if (!parsed.success) {
    throw new ApiError(
      400,
      "validation_error",
      parsed.error.issues.map((issue) => issue.message).join(", "),
    )
  }
  return parsed.data
}

function getParam(req: Request, name: string): string {
  const value = req.params[name]
  if (typeof value !== "string" || !value) {
    throw new ApiError(400, "validation_error", `Missing ${name}`)
  }
  return value
}

function normalizeName(value: string | undefined, field = "name") {
  const name = value?.trim() ?? ""
  if (!name) {
    throw new ApiError(400, "validation_error", `${field} is required`)
  }
  return name
}

function normalizeMetadata(metadata?: McpMetadata | null): McpMetadata {
  const parsed = mcpMetadataSchema.safeParse(metadata ?? {})
  if (!parsed.success) {
    throw new ApiError(
      400,
      "validation_error",
      parsed.error.issues.map((issue) => issue.message).join(", "),
    )
  }
  return parsed.data
}

function serializeMetadata(value: unknown): McpMetadata {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {}
  }

  const metadata: McpMetadata = {}
  for (const [key, entry] of Object.entries(value)) {
    if (typeof entry === "string") {
      metadata[key] = entry
    }
  }
  return metadata
}

function normalizeSerializedInjectRule(rule: unknown): VaultCredentialInjectRule {
  try {
    return normalizeVaultCredentialInjectRule(rule)
  } catch {
    return defaultMcpCredentialInjectRule()
  }
}

function serializeCredential(record: typeof anMcpCredentials.$inferSelect) {
  let authSummary: Record<string, unknown> = { type: record.auth_type }

  if (record.encrypted_auth) {
    try {
      authSummary = redactCredentialPayload(
        JSON.parse(decrypt(record.encrypted_auth)) as McpCredentialPayload,
      )
    } catch {
      authSummary = { type: record.auth_type, unreadable: true }
    }
  } else {
    authSummary = { type: record.auth_type, archived: true }
  }

  return {
    id: record.id,
    name: record.name,
    serverUrl: record.server_url,
    serverUrlNormalized: record.server_url_normalized,
    hostPattern: record.host_pattern ?? null,
    inject: normalizeSerializedInjectRule(record.inject),
    authType: record.auth_type,
    auth: authSummary,
    metadata: serializeMetadata(record.metadata),
    status: record.status,
    lastError: record.last_error,
    lastResolvedAt: record.last_resolved_at?.toISOString() ?? null,
    createdAt: record.created_at.toISOString(),
    updatedAt: record.updated_at.toISOString(),
    archivedAt: record.archived_at?.toISOString() ?? null,
  }
}

function serializeVault(
  record: typeof anMcpVaults.$inferSelect,
  credentials: Array<typeof anMcpCredentials.$inferSelect> = [],
) {
  return {
    id: record.id,
    teamId: record.team_id,
    name: record.name,
    description: record.description,
    metadata: serializeMetadata(record.metadata),
    isDefault: record.is_default,
    status: record.status,
    createdAt: record.created_at.toISOString(),
    updatedAt: record.updated_at.toISOString(),
    archivedAt: record.archived_at?.toISOString() ?? null,
    credentials: credentials.map(serializeCredential),
  }
}

function normalizeCredentialPayload(
  payload: McpCredentialPayload,
): McpCredentialPayload {
  if (payload.type === "bearer") {
    const token = payload.token.trim()
    if (!token) throw new Error("Bearer token is required")
    return { type: "bearer", token }
  }

  const normalized: McpCredentialPayload = {
    type: "oauth",
    ...(payload.accessToken?.trim() ? { accessToken: payload.accessToken.trim() } : {}),
    ...(payload.refreshToken?.trim() ? { refreshToken: payload.refreshToken.trim() } : {}),
    ...(payload.clientId?.trim() ? { clientId: payload.clientId.trim() } : {}),
    ...(payload.clientSecret?.trim() ? { clientSecret: payload.clientSecret.trim() } : {}),
    ...(payload.tokenEndpoint?.trim() ? { tokenEndpoint: payload.tokenEndpoint.trim() } : {}),
    ...(payload.tokenEndpointAuth ? { tokenEndpointAuth: payload.tokenEndpointAuth } : {}),
    ...(payload.tokenType?.trim() ? { tokenType: payload.tokenType.trim() } : {}),
    ...(payload.expiresAt?.trim() ? { expiresAt: payload.expiresAt.trim() } : {}),
    ...(payload.scope?.trim() ? { scope: payload.scope.trim() } : {}),
    ...(payload.resource?.trim() ? { resource: payload.resource.trim() } : {}),
  }

  if (normalized.refreshToken || normalized.tokenEndpoint || normalized.tokenEndpointAuth) {
    if (!normalized.refreshToken || !normalized.tokenEndpoint || !normalized.clientId) {
      throw new Error("OAuth refresh requires refreshToken, tokenEndpoint, and clientId")
    }
    const authMode = normalized.tokenEndpointAuth ?? "none"
    if (
      authMode !== "none" &&
      authMode !== "client_secret_basic" &&
      authMode !== "client_secret_post"
    ) {
      throw new Error("Unsupported OAuth token endpoint auth mode")
    }
    if (authMode !== "none" && !normalized.clientSecret) {
      throw new Error("OAuth refresh auth mode requires clientSecret")
    }
    normalized.tokenEndpointAuth = authMode
  }

  if (
    !normalized.accessToken &&
    !normalized.refreshToken &&
    !normalized.clientId &&
    !normalized.clientSecret
  ) {
    throw new Error("OAuth credential needs at least one value")
  }

  return normalized
}

function buildCredentialAuthMeta(payload: McpCredentialPayload): JsonRecord {
  if (payload.type === "bearer") {
    return { type: payload.type, hasToken: true }
  }

  return {
    type: payload.type,
    tokenType: payload.tokenType ?? null,
    expiresAt: payload.expiresAt ?? null,
    scope: payload.scope ?? null,
    resource: payload.resource ?? null,
    hasAccessToken: Boolean(payload.accessToken),
    hasRefreshToken: Boolean(payload.refreshToken),
    hasClientId: Boolean(payload.clientId),
    hasClientSecret: Boolean(payload.clientSecret),
    hasTokenEndpoint: Boolean(payload.tokenEndpoint),
    tokenEndpointAuth: payload.tokenEndpointAuth ?? null,
  }
}

async function getCredentialsByVaultIds(vaultIds: string[]) {
  if (vaultIds.length === 0) return new Map<string, Array<typeof anMcpCredentials.$inferSelect>>()
  const credentials = await db
    .select()
    .from(anMcpCredentials)
    .where(inArray(anMcpCredentials.vault_id, vaultIds))
    .orderBy(desc(anMcpCredentials.updated_at))

  const byVault = new Map<string, Array<typeof anMcpCredentials.$inferSelect>>()
  for (const credential of credentials) {
    const list = byVault.get(credential.vault_id) ?? []
    list.push(credential)
    byVault.set(credential.vault_id, list)
  }
  return byVault
}

async function listMcpVaults(teamId: string) {
  const vaults = await db
    .select()
    .from(anMcpVaults)
    .where(eq(anMcpVaults.team_id, teamId))
    .orderBy(desc(anMcpVaults.is_default), desc(anMcpVaults.updated_at))
  const credentialsByVault = await getCredentialsByVaultIds(vaults.map((vault) => vault.id))

  return {
    vaults: vaults.map((vault) => serializeVault(vault, credentialsByVault.get(vault.id))),
    suggestions: MCP_SERVER_SUGGESTIONS,
  }
}

async function getMcpVaultDetail(teamId: string, vaultId: string) {
  const [vault] = await db
    .select()
    .from(anMcpVaults)
    .where(and(eq(anMcpVaults.id, vaultId), eq(anMcpVaults.team_id, teamId)))
    .limit(1)
  if (!vault) return null
  const credentialsByVault = await getCredentialsByVaultIds([vault.id])
  return {
    vault: serializeVault(vault, credentialsByVault.get(vault.id)),
    agents: [],
    suggestions: MCP_SERVER_SUGGESTIONS,
  }
}

async function createMcpVault(params: {
  teamId: string
  name: string
  description?: string | null
  metadata?: McpMetadata | null
}) {
  const metadata = normalizeMetadata(params.metadata)
  const [vault] = await db
    .insert(anMcpVaults)
    .values({
      team_id: params.teamId,
      name: normalizeName(params.name),
      description: params.description?.trim() || null,
      metadata,
    })
    .returning()
  return serializeVault(vault!)
}

async function updateMcpVault(params: {
  teamId: string
  vaultId: string
  name?: string
  description?: string | null
  metadata?: McpMetadata | null
}) {
  const [existing] = await db
    .select({ id: anMcpVaults.id })
    .from(anMcpVaults)
    .where(and(
      eq(anMcpVaults.id, params.vaultId),
      eq(anMcpVaults.team_id, params.teamId),
      isNull(anMcpVaults.archived_at),
    ))
    .limit(1)
  if (!existing) return null

  const data: Partial<typeof anMcpVaults.$inferInsert> = {
    updated_at: new Date(),
  }
  if (params.name !== undefined) data.name = normalizeName(params.name)
  if (params.description !== undefined) {
    data.description = params.description?.trim() || null
  }
  if (params.metadata !== undefined) data.metadata = normalizeMetadata(params.metadata)

  const [vault] = await db
    .update(anMcpVaults)
    .set(data)
    .where(eq(anMcpVaults.id, existing.id))
    .returning()
  const credentialsByVault = await getCredentialsByVaultIds([existing.id])
  return serializeVault(vault!, credentialsByVault.get(existing.id))
}

async function setDefaultMcpVault(teamId: string, vaultId: string) {
  const [vault] = await db
    .select({ id: anMcpVaults.id })
    .from(anMcpVaults)
    .where(and(
      eq(anMcpVaults.id, vaultId),
      eq(anMcpVaults.team_id, teamId),
      isNull(anMcpVaults.archived_at),
    ))
    .limit(1)
  if (!vault) return null

  const now = new Date()
  await db.transaction(async (tx) => {
    await tx
      .update(anMcpVaults)
      .set({ is_default: false, updated_at: now })
      .where(and(
        eq(anMcpVaults.team_id, teamId),
        eq(anMcpVaults.is_default, true),
        isNull(anMcpVaults.archived_at),
        ne(anMcpVaults.id, vault.id),
      ))
    await tx
      .update(anMcpVaults)
      .set({ is_default: true, updated_at: now })
      .where(eq(anMcpVaults.id, vault.id))
  })

  return { success: true }
}

async function archiveMcpVault(teamId: string, vaultId: string) {
  const [vault] = await db
    .select({ id: anMcpVaults.id })
    .from(anMcpVaults)
    .where(and(
      eq(anMcpVaults.id, vaultId),
      eq(anMcpVaults.team_id, teamId),
      isNull(anMcpVaults.archived_at),
    ))
    .limit(1)
  if (!vault) return null

  const now = new Date()
  await db.transaction(async (tx) => {
    await tx
      .update(anMcpVaults)
      .set({
        status: "archived",
        is_default: false,
        archived_at: now,
        updated_at: now,
      })
      .where(eq(anMcpVaults.id, vault.id))
    await tx
      .update(anMcpCredentials)
      .set({
        status: "archived",
        archived_at: now,
        updated_at: now,
        encrypted_auth: null,
      })
      .where(and(eq(anMcpCredentials.vault_id, vault.id), isNull(anMcpCredentials.archived_at)))
  })

  return { success: true }
}

async function hardDeleteMcpVault(teamId: string, vaultId: string) {
  const [vault] = await db
    .select()
    .from(anMcpVaults)
    .where(and(eq(anMcpVaults.id, vaultId), eq(anMcpVaults.team_id, teamId)))
    .limit(1)
  if (!vault) return null

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(anMcpCredentials)
    .where(and(
      eq(anMcpCredentials.vault_id, vault.id),
      isNull(anMcpCredentials.archived_at),
      eq(anMcpCredentials.status, "active"),
    ))

  if (!vault.archived_at && vault.status !== "archived" && count > 0) {
    throw new ApiError(
      409,
      "conflict",
      "Vault must be archived or have zero active credentials before hard delete",
    )
  }

  await db.delete(anMcpVaults).where(eq(anMcpVaults.id, vault.id))
  return { success: true }
}

async function createOrUpdateMcpCredential(params: {
  teamId: string
  vaultId: string
  credentialId?: string
  name?: string | null
  serverUrl: string
  auth: McpCredentialPayload
  inject?: VaultCredentialInjectRule | null
  metadata?: McpMetadata | null
}) {
  const [vault] = await db
    .select({ id: anMcpVaults.id })
    .from(anMcpVaults)
    .where(and(
      eq(anMcpVaults.id, params.vaultId),
      eq(anMcpVaults.team_id, params.teamId),
      isNull(anMcpVaults.archived_at),
    ))
    .limit(1)
  if (!vault) throw new ApiError(404, "not_found", "Vault not found")

  const normalizedServerUrl = normalizeMcpServerUrl(params.serverUrl)
  const hostPattern = getMcpServerHostPattern(params.serverUrl)
  const normalizedAuth = normalizeCredentialPayload(params.auth)
  const inject = params.inject
    ? normalizeVaultCredentialInjectRule(params.inject)
    : defaultMcpCredentialInjectRule()
  const metadata = normalizeMetadata(params.metadata)
  const encryptedAuth = encrypt(JSON.stringify(normalizedAuth))
  const authMeta = buildCredentialAuthMeta(normalizedAuth)
  const now = new Date()

  const [activeByUrl] = await db
    .select()
    .from(anMcpCredentials)
    .where(and(
      eq(anMcpCredentials.vault_id, vault.id),
      eq(anMcpCredentials.server_url_normalized, normalizedServerUrl),
      isNull(anMcpCredentials.archived_at),
      eq(anMcpCredentials.status, "active"),
    ))
    .limit(1)

  if (params.credentialId) {
    const [existingById] = await db
      .select()
      .from(anMcpCredentials)
      .where(and(
        eq(anMcpCredentials.id, params.credentialId),
        eq(anMcpCredentials.vault_id, vault.id),
        isNull(anMcpCredentials.archived_at),
        eq(anMcpCredentials.status, "active"),
      ))
      .limit(1)

    if (!existingById) throw new ApiError(404, "not_found", "Credential not found")
    if (activeByUrl && activeByUrl.id !== existingById.id) {
      throw new ApiError(
        409,
        "conflict",
        "A credential for this MCP server already exists in the vault",
      )
    }
    if (normalizeMcpServerUrl(existingById.server_url) !== normalizedServerUrl) {
      throw new ApiError(
        400,
        "validation_error",
        "MCP server URL is immutable; archive this credential and create a new one",
      )
    }

    const [updated] = await db
      .update(anMcpCredentials)
      .set({
        name: params.name?.trim() || null,
        server_url: params.serverUrl.trim(),
        server_url_normalized: normalizedServerUrl,
        host_pattern: hostPattern,
        inject,
        auth_type: normalizedAuth.type,
        encrypted_auth: encryptedAuth,
        auth_meta: authMeta,
        metadata,
        status: "active",
        last_error: null,
        updated_at: now,
      })
      .where(eq(anMcpCredentials.id, existingById.id))
      .returning()
    return serializeCredential(updated!)
  }

  if (activeByUrl) {
    throw new ApiError(
      409,
      "conflict",
      "A credential for this MCP server already exists in the vault",
    )
  }

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(anMcpCredentials)
    .where(and(
      eq(anMcpCredentials.vault_id, vault.id),
      isNull(anMcpCredentials.archived_at),
      eq(anMcpCredentials.status, "active"),
    ))
  if (count >= MAX_ACTIVE_CREDENTIALS_PER_VAULT) {
    throw new ApiError(
      422,
      "credential_cap_exceeded",
      `Vault already has ${MAX_ACTIVE_CREDENTIALS_PER_VAULT} active credentials`,
    )
  }

  const [created] = await db
    .insert(anMcpCredentials)
    .values({
      vault_id: vault.id,
      name: params.name?.trim() || null,
      server_url: params.serverUrl.trim(),
      server_url_normalized: normalizedServerUrl,
      host_pattern: hostPattern,
      inject,
      auth_type: normalizedAuth.type,
      encrypted_auth: encryptedAuth,
      auth_meta: authMeta,
      metadata,
      status: "active",
    })
    .returning()
  return serializeCredential(created!)
}

async function archiveMcpCredential(teamId: string, vaultId: string, credentialId: string) {
  const [credential] = await db
    .select({ id: anMcpCredentials.id })
    .from(anMcpCredentials)
    .innerJoin(anMcpVaults, eq(anMcpCredentials.vault_id, anMcpVaults.id))
    .where(and(
      eq(anMcpCredentials.id, credentialId),
      eq(anMcpCredentials.vault_id, vaultId),
      eq(anMcpVaults.team_id, teamId),
      isNull(anMcpCredentials.archived_at),
    ))
    .limit(1)
  if (!credential) return null

  const now = new Date()
  await db
    .update(anMcpCredentials)
    .set({
      status: "archived",
      archived_at: now,
      encrypted_auth: null,
      updated_at: now,
    })
    .where(eq(anMcpCredentials.id, credential.id))
  return { success: true }
}

async function hardDeleteMcpCredential(teamId: string, vaultId: string, credentialId: string) {
  const [row] = await db
    .select({
      id: anMcpCredentials.id,
      status: anMcpCredentials.status,
      archived_at: anMcpCredentials.archived_at,
    })
    .from(anMcpCredentials)
    .innerJoin(anMcpVaults, eq(anMcpCredentials.vault_id, anMcpVaults.id))
    .where(and(
      eq(anMcpCredentials.id, credentialId),
      eq(anMcpCredentials.vault_id, vaultId),
      eq(anMcpVaults.team_id, teamId),
    ))
    .limit(1)
  if (!row) return null
  if (!row.archived_at && row.status !== "archived") {
    throw new ApiError(409, "conflict", "Credential must be archived before hard delete")
  }
  await db.delete(anMcpCredentials).where(eq(anMcpCredentials.id, row.id))
  return { success: true }
}

export function initVaultsRouter(): Router {
  const router = Router()

  router.use(asyncHandler(async (req, _res, next) => {
    await consumeApiKeyLimit(req)
    next()
  }))

  router.get("/", asyncHandler(async (req, res) => {
    const { teamId } = requireApiKeyRequest(req)
    res.json(await listMcpVaults(teamId))
  }))

  router.post("/", asyncHandler(async (req, res) => {
    const { teamId } = requireApiKeyRequest(req)
    const body = parseBody(createVaultSchema, req.body)
    const vault = await createMcpVault({ teamId, ...body })
    res.status(201).json({ vault })
  }))

  router.get("/:vaultId", asyncHandler(async (req, res) => {
    const { teamId } = requireApiKeyRequest(req)
    const detail = await getMcpVaultDetail(teamId, getParam(req, "vaultId"))
    if (!detail) throw new ApiError(404, "not_found", "Vault not found")
    res.json(detail)
  }))

  router.patch("/:vaultId", asyncHandler(async (req, res) => {
    const { teamId } = requireApiKeyRequest(req)
    const body = parseBody(updateVaultSchema, req.body)
    const vault = await updateMcpVault({ teamId, vaultId: getParam(req, "vaultId"), ...body })
    if (!vault) throw new ApiError(404, "not_found", "Vault not found")
    res.json({ vault })
  }))

  router.delete("/:vaultId", asyncHandler(async (req, res) => {
    const { teamId } = requireApiKeyRequest(req)
    const vaultId = getParam(req, "vaultId")
    const result = req.query.force === "true"
      ? await hardDeleteMcpVault(teamId, vaultId)
      : await archiveMcpVault(teamId, vaultId)
    if (!result) throw new ApiError(404, "not_found", "Vault not found")
    res.json(result)
  }))

  router.post("/:vaultId/set-default", asyncHandler(async (req, res) => {
    const { teamId } = requireApiKeyRequest(req)
    const result = await setDefaultMcpVault(teamId, getParam(req, "vaultId"))
    if (!result) throw new ApiError(404, "not_found", "Vault not found")
    res.json(result)
  }))

  router.post("/:vaultId/credentials", asyncHandler(async (req, res) => {
    const { teamId } = requireApiKeyRequest(req)
    const body = parseBody(credentialSchema, req.body)
    const credential = await createOrUpdateMcpCredential({
      teamId,
      vaultId: getParam(req, "vaultId"),
      ...body,
    })
    res.status(201).json({ credential })
  }))

  router.patch("/:vaultId/credentials/:credentialId", asyncHandler(async (req, res) => {
    const { teamId } = requireApiKeyRequest(req)
    const body = parseBody(credentialSchema, req.body)
    const credential = await createOrUpdateMcpCredential({
      teamId,
      vaultId: getParam(req, "vaultId"),
      credentialId: getParam(req, "credentialId"),
      ...body,
    })
    res.json({ credential })
  }))

  router.delete("/:vaultId/credentials/:credentialId", asyncHandler(async (req, res) => {
    const { teamId } = requireApiKeyRequest(req)
    const vaultId = getParam(req, "vaultId")
    const credentialId = getParam(req, "credentialId")
    const result = req.query.force === "true"
      ? await hardDeleteMcpCredential(teamId, vaultId, credentialId)
      : await archiveMcpCredential(teamId, vaultId, credentialId)
    if (!result) throw new ApiError(404, "not_found", "Credential not found")
    res.json(result)
  }))

  router.use((error: unknown, _req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      next(error)
      return
    }
    if (error instanceof ApiError) {
      res
        .status(error.status)
        .set(error.headers ?? {})
        .json({ error: error.error, message: error.message, status: error.status })
      return
    }

    const message = error instanceof Error ? error.message : "Internal server error"
    console.error("[VAULT_API] Unexpected error:", error)
    res.status(500).json({ error: "internal_error", message, status: 500 })
  })

  return router
}
