import { prisma } from "@/lib/prisma"
import { decrypt, encrypt } from "@/lib/server/crypto"
import { Prisma } from "@/prisma/client"
import {
  defaultMcpCredentialInjectRule,
  getMcpServerHostPattern,
  normalizeAgentMcpServers,
  normalizeMcpServerUrl,
  normalizeVaultCredentialInjectRule,
  redactCredentialPayload,
  type HttpAgentMcpServer,
  type McpCredentialPayload,
  type VaultCredentialInjectRule,
} from "@repo/sandbox-provider"
import { z } from "zod"

type JsonRecord = Record<string, unknown>
export type McpMetadata = Record<string, string>

const MAX_ACTIVE_CREDENTIALS_PER_VAULT = 20

export const mcpCredentialInjectSchema = z.discriminatedUnion("kind", [
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

export const mcpMetadataSchema = z
  .record(z.string())
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

function normalizeMetadata(metadata?: McpMetadata | null): McpMetadata {
  const parsed = mcpMetadataSchema.safeParse(metadata ?? {})
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((issue) => issue.message).join(", "))
  }

  warnOnSecretMetadataKeys(parsed.data)
  return parsed.data
}

function warnOnSecretMetadataKeys(metadata: McpMetadata) {
  const suspiciousKeys = Object.keys(metadata).filter((key) =>
    /token|secret|password|key/i.test(key),
  )
  if (suspiciousKeys.length === 0) return

  console.warn("[MCP_VAULT_METADATA] Suspicious metadata keys", {
    keys: suspiciousKeys,
  })
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

function normalizeRequiredName(value: string, field = "name") {
  const normalized = value.trim()
  if (!normalized) {
    throw new Error(`${field} is required`)
  }
  return normalized
}

export const MCP_SERVER_SUGGESTIONS: Array<{
  name: string
  url: string
}> = [
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

function parseDeploymentMcpServers(metadata: unknown): HttpAgentMcpServer[] {
  if (!metadata || typeof metadata !== "object") {
    return []
  }

  const rawServers = (metadata as { mcpServers?: unknown }).mcpServers
  if (!Array.isArray(rawServers)) {
    return []
  }

  try {
    return normalizeAgentMcpServers(
      rawServers
        .filter(
          (entry): entry is { name?: string; url?: string } =>
            !!entry && typeof entry === "object",
        )
        .map((entry) => ({
          name: typeof entry.name === "string" ? entry.name : "",
          url: typeof entry.url === "string" ? entry.url : "",
        })),
    )
  } catch {
    return []
  }
}

function serializeCredential(record: {
  id: string
  name: string | null
  server_url: string
  server_url_normalized: string
  host_pattern?: string | null
  inject?: unknown
  auth_type: string
  encrypted_auth: string | null
  metadata: unknown
  status: string
  last_error: string | null
  last_resolved_at: Date | null
  created_at: Date
  updated_at: Date
  archived_at: Date | null
}) {
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

function serializeVault(record: {
  id: string
  team_id: string
  name: string
  description: string | null
  metadata: unknown
  is_default: boolean
  status: string
  created_at: Date
  updated_at: Date
  archived_at: Date | null
  credentials?: Array<{
    id: string
    name: string | null
    server_url: string
    server_url_normalized: string
    host_pattern?: string | null
    inject?: unknown
    auth_type: string
    encrypted_auth: string | null
    metadata: unknown
    status: string
    last_error: string | null
    last_resolved_at: Date | null
    created_at: Date
    updated_at: Date
    archived_at: Date | null
  }>
}) {
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
    credentials: record.credentials?.map(serializeCredential) ?? [],
  }
}

function normalizeSerializedInjectRule(rule: unknown): VaultCredentialInjectRule {
  try {
    return normalizeVaultCredentialInjectRule(rule)
  } catch {
    return defaultMcpCredentialInjectRule()
  }
}

export async function listMcpVaults(teamId: string) {
  const vaults = await prisma.anMcpVault.findMany({
    where: { team_id: teamId },
    include: {
      credentials: {
        orderBy: [{ updated_at: "desc" }],
      },
    },
    orderBy: [{ is_default: "desc" }, { updated_at: "desc" }],
  })

  return {
    vaults: vaults.map(serializeVault),
    suggestions: MCP_SERVER_SUGGESTIONS,
  }
}

export async function getMcpVaultDetail(teamId: string, vaultId: string) {
  const vault = await prisma.anMcpVault.findFirst({
    where: { id: vaultId, team_id: teamId },
    include: {
      credentials: {
        orderBy: [{ updated_at: "desc" }],
      },
    },
  })

  if (!vault) {
    return null
  }

  const credentialsByUrl = new Map(
    vault.credentials
      .filter(
        (credential) =>
          credential.status === "active" && !credential.archived_at,
      )
      .map((credential) => [
        credential.server_url_normalized,
        credential,
      ]),
  )

  const agents = await prisma.anAgentConfig.findMany({
    where: { team_id: teamId, active_deployment_id: { not: null } },
    orderBy: [{ updated_at: "desc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      runtime: true,
      activeDeployment: {
        select: {
          id: true,
          version: true,
          metadata: true,
        },
      },
    },
  })

  const agentCoverage = agents
    .map((agent) => {
      const servers = parseDeploymentMcpServers(
        agent.activeDeployment?.metadata,
      )
      if (servers.length === 0) {
        return null
      }

      return {
        id: agent.id,
        name: agent.name,
        slug: agent.slug,
        runtime: agent.runtime,
        activeDeploymentId: agent.activeDeployment?.id ?? null,
        activeVersion: agent.activeDeployment?.version ?? null,
        servers: servers.map((server) => {
          const credential = credentialsByUrl.get(server.url)
          return {
            name: server.name,
            url: server.url,
            status: credential ? "ready" : "missing_credential",
            credentialId: credential?.id ?? null,
            credentialName: credential?.name ?? null,
          }
        }),
      }
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null)

  return {
    vault: serializeVault(vault),
    agents: agentCoverage,
    suggestions: MCP_SERVER_SUGGESTIONS,
  }
}

export async function createMcpVault(params: {
  teamId: string
  name: string
  description?: string | null
  metadata?: McpMetadata | null
}) {
  const metadata = normalizeMetadata(params.metadata)
  const name = normalizeRequiredName(params.name)
  const vault = await prisma.anMcpVault.create({
    data: {
      team_id: params.teamId,
      name,
      description: params.description?.trim() || null,
      metadata: metadata as Prisma.InputJsonValue,
    },
    include: {
      credentials: {
        where: { archived_at: null },
        orderBy: [{ updated_at: "desc" }],
      },
    },
  })

  return serializeVault(vault)
}

export async function updateMcpVault(params: {
  teamId: string
  vaultId: string
  name?: string
  description?: string | null
  metadata?: McpMetadata | null
}) {
  const existing = await prisma.anMcpVault.findFirst({
    where: { id: params.vaultId, team_id: params.teamId, archived_at: null },
    select: { id: true },
  })

  if (!existing) {
    return null
  }

  const data: Prisma.AnMcpVaultUpdateInput = {
    updated_at: new Date(),
  }
  if (params.name !== undefined) {
    data.name = normalizeRequiredName(params.name)
  }
  if (params.description !== undefined) {
    data.description = params.description?.trim() || null
  }
  if (params.metadata !== undefined) {
    data.metadata = normalizeMetadata(params.metadata) as Prisma.InputJsonValue
  }

  const vault = await prisma.anMcpVault.update({
    where: { id: existing.id },
    data,
    include: {
      credentials: {
        where: { archived_at: null },
        orderBy: [{ updated_at: "desc" }],
      },
    },
  })

  return serializeVault(vault)
}

export async function setDefaultMcpVault(params: {
  teamId: string
  vaultId: string
}) {
  const now = new Date()

  const vault = await prisma.anMcpVault.findFirst({
    where: { id: params.vaultId, team_id: params.teamId, archived_at: null },
    select: { id: true },
  })

  if (!vault) {
    return null
  }

  await prisma.$transaction(async (tx) => {
    await tx.anMcpVault.updateMany({
      where: {
        team_id: params.teamId,
        archived_at: null,
        is_default: true,
        id: { not: vault.id },
      },
      data: { is_default: false, updated_at: now },
    })

    await tx.anMcpVault.update({
      where: { id: vault.id },
      data: { is_default: true, updated_at: now },
    })
  })

  return { success: true }
}

export async function archiveMcpVault(params: {
  teamId: string
  vaultId: string
}) {
  const now = new Date()
  const vault = await prisma.anMcpVault.findFirst({
    where: { id: params.vaultId, team_id: params.teamId, archived_at: null },
    select: { id: true },
  })

  if (!vault) {
    return null
  }

  await prisma.$transaction([
    prisma.anMcpVault.update({
      where: { id: vault.id },
      data: {
        status: "archived",
        is_default: false,
        archived_at: now,
        updated_at: now,
      },
    }),
    prisma.anMcpCredential.updateMany({
      where: { vault_id: vault.id, archived_at: null },
      data: {
        status: "archived",
        archived_at: now,
        updated_at: now,
        encrypted_auth: null,
      },
    }),
  ])

  return { success: true }
}

export async function hardDeleteMcpVault(params: {
  teamId: string
  vaultId: string
}) {
  const vault = await prisma.anMcpVault.findFirst({
    where: { id: params.vaultId, team_id: params.teamId },
    select: {
      id: true,
      status: true,
      archived_at: true,
      _count: {
        select: {
          credentials: {
            where: { archived_at: null, status: "active" },
          },
        },
      },
    },
  })

  if (!vault) return null

  if (!vault.archived_at && vault.status !== "archived" && vault._count.credentials > 0) {
    throw new Error("Vault must be archived or have zero active credentials before hard delete")
  }

  await prisma.anMcpVault.delete({ where: { id: vault.id } })
  return { success: true }
}

function normalizeCredentialPayload(
  payload: McpCredentialPayload,
): McpCredentialPayload {
  if (payload.type === "bearer") {
    const token = payload.token.trim()
    if (!token) {
      throw new Error("Bearer token is required")
    }
    return {
      type: "bearer",
      token,
    }
  }

  const normalized: McpCredentialPayload = {
    type: "oauth",
    ...(payload.accessToken?.trim()
      ? { accessToken: payload.accessToken.trim() }
      : {}),
    ...(payload.refreshToken?.trim()
      ? { refreshToken: payload.refreshToken.trim() }
      : {}),
    ...(payload.clientId?.trim() ? { clientId: payload.clientId.trim() } : {}),
    ...(payload.clientSecret?.trim()
      ? { clientSecret: payload.clientSecret.trim() }
      : {}),
    ...(payload.tokenEndpoint?.trim()
      ? { tokenEndpoint: payload.tokenEndpoint.trim() }
      : {}),
    ...(payload.tokenEndpointAuth
      ? { tokenEndpointAuth: payload.tokenEndpointAuth }
      : {}),
    ...(payload.tokenType?.trim()
      ? { tokenType: payload.tokenType.trim() }
      : {}),
    ...(payload.expiresAt?.trim()
      ? { expiresAt: payload.expiresAt.trim() }
      : {}),
    ...(payload.scope?.trim() ? { scope: payload.scope.trim() } : {}),
    ...(payload.resource?.trim() ? { resource: payload.resource.trim() } : {}),
  }

  if (
    normalized.refreshToken ||
    normalized.tokenEndpoint ||
    normalized.tokenEndpointAuth
  ) {
    if (!normalized.refreshToken || !normalized.tokenEndpoint || !normalized.clientId) {
      throw new Error(
        "OAuth refresh requires refreshToken, tokenEndpoint, and clientId",
      )
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
    return {
      type: payload.type,
      hasToken: true,
    }
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

export async function createOrUpdateMcpCredential(params: {
  teamId: string
  vaultId: string
  credentialId?: string
  name?: string | null
  serverUrl: string
  auth: McpCredentialPayload
  inject?: VaultCredentialInjectRule | null
  metadata?: McpMetadata | null
}) {
  const vault = await prisma.anMcpVault.findFirst({
    where: { id: params.vaultId, team_id: params.teamId, archived_at: null },
    select: { id: true },
  })

  if (!vault) {
    throw new Error("Vault not found")
  }

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

  const activeByUrl = await prisma.anMcpCredential.findFirst({
    where: {
      vault_id: vault.id,
      server_url_normalized: normalizedServerUrl,
      archived_at: null,
      status: "active",
    },
  })

  if (params.credentialId) {
    const existingById = await prisma.anMcpCredential.findFirst({
      where: {
        id: params.credentialId,
        vault_id: vault.id,
        archived_at: null,
        status: "active",
      },
    })

    if (!existingById) {
      throw new Error("Credential not found or archived")
    }

    if (activeByUrl && activeByUrl.id !== existingById.id) {
      throw new Error(
        "A credential for this MCP server already exists in the vault",
      )
    }

    if (
      normalizeMcpServerUrl(existingById.server_url) !== normalizedServerUrl
    ) {
      throw new Error(
        "MCP server URL is immutable; archive this credential and create a new one",
      )
    }

    const updated = await prisma.anMcpCredential.update({
      where: { id: existingById.id },
      data: {
        name: params.name?.trim() || null,
        server_url: params.serverUrl.trim(),
        server_url_normalized: normalizedServerUrl,
        host_pattern: hostPattern,
        inject: inject as Prisma.InputJsonValue,
        auth_type: normalizedAuth.type,
        encrypted_auth: encryptedAuth,
        auth_meta: authMeta as Prisma.InputJsonValue,
        metadata: metadata as Prisma.InputJsonValue,
        status: "active",
        last_error: null,
        archived_at: null,
        updated_at: now,
      },
    })

    return serializeCredential(updated)
  }

  if (activeByUrl) {
    throw new Error(
      "A credential for this MCP server already exists in the vault",
    )
  }

  const activeCredentialCount = await prisma.anMcpCredential.count({
    where: { vault_id: vault.id, archived_at: null, status: "active" },
  })
  if (activeCredentialCount >= MAX_ACTIVE_CREDENTIALS_PER_VAULT) {
    throw new Error(
      `Vault already has ${MAX_ACTIVE_CREDENTIALS_PER_VAULT} active credentials`,
    )
  }

  const created = await prisma.anMcpCredential.create({
    data: {
      vault_id: vault.id,
      name: params.name?.trim() || null,
      server_url: params.serverUrl.trim(),
      server_url_normalized: normalizedServerUrl,
      host_pattern: hostPattern,
      inject: inject as Prisma.InputJsonValue,
      auth_type: normalizedAuth.type,
      encrypted_auth: encryptedAuth,
      auth_meta: authMeta as Prisma.InputJsonValue,
      metadata: metadata as Prisma.InputJsonValue,
      status: "active",
    },
  })

  return serializeCredential(created)
}

export async function archiveMcpCredential(params: {
  teamId: string
  vaultId: string
  credentialId: string
}) {
  const now = new Date()
  const credential = await prisma.anMcpCredential.findFirst({
    where: {
      id: params.credentialId,
      vault_id: params.vaultId,
      vault: {
        team_id: params.teamId,
      },
    },
    select: { id: true },
  })

  if (!credential) {
    return null
  }

  await prisma.anMcpCredential.update({
    where: { id: credential.id },
    data: {
      status: "archived",
      archived_at: now,
      encrypted_auth: null,
      updated_at: now,
    },
  })

  return { success: true }
}

export async function hardDeleteMcpCredential(params: {
  teamId: string
  vaultId: string
  credentialId: string
}) {
  const credential = await prisma.anMcpCredential.findFirst({
    where: {
      id: params.credentialId,
      vault_id: params.vaultId,
      vault: {
        team_id: params.teamId,
      },
    },
    select: { id: true, status: true, archived_at: true },
  })

  if (!credential) return null

  if (!credential.archived_at && credential.status !== "archived") {
    throw new Error("Credential must be archived before hard delete")
  }

  await prisma.anMcpCredential.delete({ where: { id: credential.id } })
  return { success: true }
}
