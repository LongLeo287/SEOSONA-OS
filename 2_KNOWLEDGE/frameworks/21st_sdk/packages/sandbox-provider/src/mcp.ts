export type HttpAgentMcpServer = {
  name: string
  url: string
}

export type McpCredentialAuthType = "bearer" | "oauth"

export type VaultCredentialInjectRule =
  | {
      kind: "header"
      header: string
      prefix?: string
    }
  | {
      kind: "query"
      param: string
    }
  | {
      kind: "basic"
      username?: string
    }

export type McpCredentialPayload =
  | {
      type: "bearer"
      token: string
    }
  | {
      type: "oauth"
      accessToken?: string
      refreshToken?: string
      clientId?: string
      clientSecret?: string
      tokenEndpoint?: string
      tokenEndpointAuth?:
        | "none"
        | "client_secret_basic"
        | "client_secret_post"
      tokenType?: string
      expiresAt?: string
      scope?: string
      resource?: string
    }

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value)
}

function normalizePathname(pathname: string): string {
  if (!pathname || pathname === "/") {
    return "/"
  }

  const trimmed = pathname.replace(/\/+$/, "")
  return trimmed.length > 0 ? trimmed : "/"
}

export function getMcpServerHostPattern(rawUrl: string): string {
  const normalized = normalizeMcpServerUrl(rawUrl)
  return new URL(normalized).hostname.toLowerCase()
}

export function defaultMcpCredentialInjectRule(): VaultCredentialInjectRule {
  return {
    kind: "header",
    header: "Authorization",
    prefix: "Bearer ",
  }
}

export function normalizeVaultCredentialInjectRule(
  rule: unknown,
): VaultCredentialInjectRule {
  if (!isRecord(rule)) {
    return defaultMcpCredentialInjectRule()
  }

  if (rule.kind === "header") {
    const header = typeof rule.header === "string" ? rule.header.trim() : ""
    if (!header) {
      throw new Error("Header injection requires a header name")
    }
    const prefix = typeof rule.prefix === "string" ? rule.prefix : undefined
    return {
      kind: "header",
      header,
      ...(prefix !== undefined ? { prefix } : {}),
    }
  }

  if (rule.kind === "query") {
    const param = typeof rule.param === "string" ? rule.param.trim() : ""
    if (!param) {
      throw new Error("Query injection requires a parameter name")
    }
    return { kind: "query", param }
  }

  if (rule.kind === "basic") {
    const username =
      typeof rule.username === "string" && rule.username.trim()
        ? rule.username.trim()
        : undefined
    return { kind: "basic", ...(username ? { username } : {}) }
  }

  throw new Error("Unsupported vault credential inject rule")
}

export function normalizeMcpServerUrl(rawUrl: string): string {
  let parsed: URL
  try {
    parsed = new URL(rawUrl)
  } catch {
    throw new Error(`Invalid MCP server URL: ${rawUrl}`)
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error(`MCP server URL must use http or https: ${rawUrl}`)
  }

  if (parsed.username || parsed.password) {
    throw new Error(`MCP server URL must not include credentials: ${rawUrl}`)
  }

  parsed.hash = ""
  parsed.protocol = parsed.protocol.toLowerCase()
  parsed.hostname = parsed.hostname.toLowerCase()
  parsed.pathname = normalizePathname(parsed.pathname)

  if (
    (parsed.protocol === "https:" && parsed.port === "443") ||
    (parsed.protocol === "http:" && parsed.port === "80")
  ) {
    parsed.port = ""
  }

  const sortedSearch = new URLSearchParams(parsed.search)
  sortedSearch.sort()
  parsed.search = sortedSearch.toString() ? `?${sortedSearch.toString()}` : ""

  return parsed.toString()
}

export function normalizeAgentMcpServers(
  servers: HttpAgentMcpServer[] | undefined | null,
): HttpAgentMcpServer[] {
  if (!servers || servers.length === 0) {
    return []
  }

  const normalized: HttpAgentMcpServer[] = []
  const names = new Set<string>()

  for (const entry of servers) {
    const name = entry.name.trim()
    if (!name) {
      throw new Error("MCP server name is required")
    }

    if (names.has(name)) {
      throw new Error(`Duplicate MCP server name: ${name}`)
    }

    names.add(name)
    normalized.push({
      name,
      url: normalizeMcpServerUrl(entry.url),
    })
  }

  return normalized
}

export function buildLegacyMcpConfigFromServers(
  servers: HttpAgentMcpServer[] | undefined | null,
): Record<string, unknown> {
  const normalized = normalizeAgentMcpServers(servers)
  const mcpServers: Record<string, { type: "http"; url: string }> = {}

  for (const server of normalized) {
    mcpServers[server.name] = {
      type: "http",
      url: server.url,
    }
  }

  return { mcpServers }
}

function getLegacyConfigEntries(parsed: unknown): Record<string, unknown> {
  if (!isRecord(parsed)) {
    throw new Error("MCP config must be a JSON object")
  }

  if (parsed.mcpServers !== undefined) {
    if (!isRecord(parsed.mcpServers)) {
      throw new Error("mcpServers must be an object")
    }
    return parsed.mcpServers
  }

  const entries: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(parsed)) {
    if (isRecord(value)) {
      entries[key] = value
    }
  }

  return entries
}

export function extractHttpMcpServersFromLegacyConfig(
  parsed: unknown,
): HttpAgentMcpServer[] {
  const entries = getLegacyConfigEntries(parsed)
  const servers: HttpAgentMcpServer[] = []

  for (const [name, value] of Object.entries(entries)) {
    if (!isRecord(value) || typeof value.url !== "string") {
      continue
    }

    const type = value.type
    if (type !== undefined && type !== "http") {
      continue
    }

    servers.push({
      name,
      url: normalizeMcpServerUrl(value.url),
    })
  }

  return normalizeAgentMcpServers(servers)
}

export function redactCredentialPayload(
  payload: McpCredentialPayload,
): Record<string, unknown> {
  if (payload.type === "bearer") {
    return {
      type: "bearer",
      hasToken: Boolean(payload.token),
    }
  }

  return {
    type: "oauth",
    hasAccessToken: Boolean(payload.accessToken),
    hasRefreshToken: Boolean(payload.refreshToken),
    hasClientId: Boolean(payload.clientId),
    hasClientSecret: Boolean(payload.clientSecret),
    hasTokenEndpoint: Boolean(payload.tokenEndpoint),
    tokenEndpointAuth: payload.tokenEndpointAuth ?? null,
    tokenType: payload.tokenType ?? null,
    expiresAt: payload.expiresAt ?? null,
    scope: payload.scope ?? null,
    resource: payload.resource ?? null,
  }
}
