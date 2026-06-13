import { existsSync, readFileSync } from "fs"
import { parse as parseDotenv } from "dotenv"

const MCP_SOURCE_PATH = process.env.MCP_SOURCE_PATH || "/home/user/runtime/mcp-source.json"
const PRIVATE_ENV_PATH = "/home/user/.env"

export type RuntimeMcpBackend =
  | {
      transport: "http"
      url: string
      headers?: Record<string, string>
    }
  | {
      transport: "sse"
      url: string
      headers?: Record<string, string>
    }
  | {
      transport: "stdio"
      command: string
      args?: string[]
      env?: Record<string, string>
      cwd?: string
    }

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value)
}

function readMcpSource(): unknown {
  if (!existsSync(MCP_SOURCE_PATH)) {
    return {}
  }

  try {
    return JSON.parse(readFileSync(MCP_SOURCE_PATH, "utf8"))
  } catch (error) {
    throw new Error(`Failed to parse MCP config at ${MCP_SOURCE_PATH}: ${(error as Error).message}`)
  }
}

function getRuntimeMcpEnv(baseEnv: NodeJS.ProcessEnv = process.env): NodeJS.ProcessEnv {
  if (!existsSync(PRIVATE_ENV_PATH)) {
    return baseEnv
  }

  try {
    return {
      ...baseEnv,
      ...parseDotenv(readFileSync(PRIVATE_ENV_PATH, "utf-8")),
    }
  } catch (error) {
    console.error(`Failed to read ${PRIVATE_ENV_PATH}:`, error)
    return baseEnv
  }
}

function expandEnvVars(value: string, env: NodeJS.ProcessEnv): string {
  return value.replace(/\$\{([^}]+)\}/g, (_match, expr: string) => {
    const defaultSep = expr.indexOf(":-")
    if (defaultSep !== -1) {
      const varName = expr.slice(0, defaultSep)
      const defaultValue = expr.slice(defaultSep + 2)
      return env[varName] || defaultValue
    }

    return env[expr] || ""
  })
}

function normalizeStringMap(
  value: unknown,
  env: NodeJS.ProcessEnv,
  fieldName: string,
): Record<string, string> | undefined {
  if (value === undefined) return undefined
  if (!isRecord(value)) {
    throw new Error(`${fieldName} must be an object`)
  }

  const normalized: Record<string, string> = {}
  for (const [key, entry] of Object.entries(value)) {
    if (typeof entry !== "string") {
      throw new Error(`${fieldName}.${key} must be a string`)
    }
    normalized[key] = expandEnvVars(entry, env)
  }

  return normalized
}

function normalizeStringArray(
  value: unknown,
  env: NodeJS.ProcessEnv,
  fieldName: string,
): string[] | undefined {
  if (value === undefined) return undefined
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== "string")) {
    throw new Error(`${fieldName} must be an array of strings`)
  }

  return value.map((entry) => expandEnvVars(entry, env))
}

function getServerEntries(parsed: unknown): Record<string, unknown> {
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

function normalizeServer(
  name: string,
  value: unknown,
  env: NodeJS.ProcessEnv,
): RuntimeMcpBackend {
  if (!isRecord(value)) {
    throw new Error(`MCP server "${name}" must be an object`)
  }

  const type = value.type
  if (type !== undefined && typeof type !== "string") {
    throw new Error(`MCP server "${name}" has an invalid type`)
  }

  if (typeof value.command === "string") {
    if (type && type !== "stdio") {
      throw new Error(`MCP server "${name}" must use type "stdio" when command is set`)
    }

    return {
      transport: "stdio",
      command: expandEnvVars(value.command, env),
      args: normalizeStringArray(value.args, env, `${name}.args`),
      env: normalizeStringMap(value.env, env, `${name}.env`),
      ...(typeof value.cwd === "string" ? { cwd: expandEnvVars(value.cwd, env) } : {}),
    }
  }

  if (typeof value.url === "string") {
    if (type === "sse") {
      return {
        transport: "sse",
        url: expandEnvVars(value.url, env),
        headers: normalizeStringMap(value.headers, env, `${name}.headers`),
      }
    }

    if (type && type !== "http") {
      throw new Error(`MCP server "${name}" uses unsupported type "${type}"`)
    }

    return {
      transport: "http",
      url: expandEnvVars(value.url, env),
      headers: normalizeStringMap(value.headers, env, `${name}.headers`),
    }
  }

  if (type === "stdio") {
    throw new Error(`MCP server "${name}" is missing command`)
  }

  if (type) {
    throw new Error(`MCP server "${name}" uses unsupported type "${type}"`)
  }

  throw new Error(`MCP server "${name}" must define either command or url`)
}

export function loadRuntimeMcpBackends(
  env: NodeJS.ProcessEnv = getRuntimeMcpEnv(),
): Record<string, RuntimeMcpBackend> {
  const parsed = readMcpSource()
  const entries = getServerEntries(parsed)
  const normalized: Record<string, RuntimeMcpBackend> = {}

  for (const [name, value] of Object.entries(entries)) {
    normalized[name] = normalizeServer(name, value, env)
  }

  return normalized
}

export function buildClaudeMcpServers(params?: {
  host?: string
  port?: number | string
  env?: NodeJS.ProcessEnv
}) {
  const host = params?.host ?? "host.docker.internal"
  const port = String(params?.port ?? process.env.MCP_PORT ?? 3004)
  const servers: Record<string, { type: "http"; url: string }> = {
    "user-tools": {
      type: "http",
      url: `http://${host}:${port}/mcp-proxy`,
    },
  }

  for (const name of Object.keys(loadRuntimeMcpBackends(params?.env))) {
    servers[name] = {
      type: "http",
      url: `http://${host}:${port}/mcp-runtime/${encodeURIComponent(name)}`,
    }
  }

  return servers
}
