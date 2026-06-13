import express from "express"
import cors from "cors"
import http from "http"
import { v4 as uuid } from "uuid"
import { hostname } from "os"
import { existsSync, readFileSync } from "fs"
import { spawn } from "child_process"
import { config as loadEnvFile, parse as parseDotenv } from "dotenv"
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js"
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js"
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js"
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js"
import {
  isInitializeRequest,
  isJSONRPCResultResponse,
  type JSONRPCMessage,
} from "@modelcontextprotocol/sdk/types.js"
import {
  loadRuntimeMcpBackends,
  type RuntimeMcpBackend,
} from "./mcp.js"
import {
  buildVaultProxyEnv,
  loadAgentConfig,
  executeAgentViaACP,
} from "./runtime.js"
import { publishRuntimeError } from "./stream.js"

loadEnvFile()

const app = express()
app.use(cors())
app.use(express.json({ limit: "50mb" }))

const mcpApp = express()

function getSandboxId(): string {
  if (process.env.SANDBOX_ID) {
    return process.env.SANDBOX_ID
  }
  const filePath = "/run/e2b/.E2B_SANDBOX_ID"
  if (existsSync(filePath)) {
    try {
      const id = readFileSync(filePath, "utf-8").trim()
      if (id) return id
    } catch {}
  }
  if (process.env.E2B_SANDBOX_ID) {
    return process.env.E2B_SANDBOX_ID
  }
  return hostname()
}

// Load agent config lazily (bundle injected after sandbox creation)
let agentConfig: Awaited<ReturnType<typeof loadAgentConfig>> | null = null

async function getAgentConfig() {
  if (!agentConfig) {
    agentConfig = await loadAgentConfig()
  }
  return agentConfig
}

function errorToString(error: unknown): string {
  if (error instanceof Error) {
    return error.message || error.stack || String(error)
  }

  if (typeof error === "string") {
    return error
  }

  try {
    return JSON.stringify(error)
  } catch {
    return String(error)
  }
}

function formatRuntimeError(phase: string, error: unknown): string {
  return `[${phase}] ${errorToString(error)}`
}

const PRIVATE_TOOLS_ENV_PATH = "/home/user/.env"

function readPrivateToolsEnv(): Record<string, string> {
  try {
    if (!existsSync(PRIVATE_TOOLS_ENV_PATH)) return {}
    return parseDotenv(readFileSync(PRIVATE_TOOLS_ENV_PATH, "utf-8"))
  } catch {
    return {}
  }
}

function hydrateToolProcessEnv(env: Record<string, string>) {
  for (const [key, value] of Object.entries(env)) {
    process.env[key] = value
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value)
}

function toDefinedEnv(env: NodeJS.ProcessEnv): Record<string, string> {
  const definedEnv: Record<string, string> = {}

  for (const [key, value] of Object.entries(env)) {
    if (value !== undefined) {
      definedEnv[key] = value
    }
  }

  return definedEnv
}

function isTrustedMcpClient(remoteAddress: string | undefined) {
  if (!remoteAddress) return false
  return (
    remoteAddress === "127.0.0.1"
    || remoteAddress === "::1"
    || remoteAddress === "::ffff:127.0.0.1"
    || remoteAddress.startsWith("10.")
    || remoteAddress.startsWith("::ffff:10.")
    || remoteAddress.startsWith("172.")
    || remoteAddress.startsWith("::ffff:172.")
    || remoteAddress.startsWith("192.168.")
    || remoteAddress.startsWith("::ffff:192.168.")
  )
}

function createUserToolsMcpServer(
  config: Awaited<ReturnType<typeof loadAgentConfig>>,
  env: Record<string, string>,
) {
  const server = new McpServer(
    { name: "user-tools", version: "1.0.0" },
    { capabilities: { tools: {} } },
  )

  const toolContext = { env }

  for (const [name, tool] of Object.entries(config.tools || {})) {
    const shape = tool.inputSchema.shape
    server.tool(name, tool.description || name, shape, async (args: Record<string, unknown>) => {
      try {
        return await tool.execute(args, toolContext)
      } catch (error) {
        throw new Error(`[tool:${name}] ${errorToString(error)}`)
      }
    })
  }

  return server
}

type LocalHttpMcpBackend = {
  kind: "local-http"
  command: string
  args?: string[]
  cwd?: string
  env?: Record<string, string>
  port: number
  path?: string
  healthPath?: string
}

let localHttpMcpProcess: ReturnType<typeof spawn> | null = null
let localHttpMcpStartup: Promise<void> | null = null
let localHttpMcpEnvKey: string | null = null

function getLocalHttpMcpBackend(
  config: Awaited<ReturnType<typeof loadAgentConfig>>,
): LocalHttpMcpBackend | null {
  const backend = (config as any).mcpBackend
  if (
    backend
    && backend.kind === "local-http"
    && typeof backend.command === "string"
    && typeof backend.port === "number"
  ) {
    return backend
  }
  return null
}

function buildEnvKey(env: Record<string, string>): string {
  return JSON.stringify(Object.entries(env).sort(([a], [b]) => a.localeCompare(b)))
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function readRequestBody(req: express.Request): Promise<Buffer> {
  const chunks: Buffer[] = []

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }

  return Buffer.concat(chunks)
}

function parseRequestBody(body: Buffer) {
  if (body.length === 0) {
    return undefined
  }

  return JSON.parse(body.toString("utf-8"))
}

type RuntimeMcpClientConnection = {
  transport: RuntimeMcpTransport
}

type RuntimeMcpTransport =
  | SSEClientTransport
  | StdioClientTransport
  | StreamableHTTPClientTransport

type RuntimeMcpBridge = {
  cleanup: () => Promise<void>
  downstream: StreamableHTTPServerTransport
  touch: () => void
}

const RUNTIME_MCP_SESSION_TTL_MS = 10 * 60_000
const RUNTIME_MCP_DEFAULT_CWD = "/home/user/workspace"
const runtimeMcpBridges = new Map<string, RuntimeMcpBridge>()

async function createRuntimeMcpClient(
  backend: RuntimeMcpBackend,
): Promise<RuntimeMcpClientConnection> {
  if (backend.transport === "http" || backend.transport === "sse") {
    Object.assign(process.env, buildVaultProxyEnv())
  }

  const transport = backend.transport === "http"
    ? new StreamableHTTPClientTransport(
      new URL(backend.url),
      backend.headers
        ? { requestInit: { headers: backend.headers } }
        : undefined,
    )
    : backend.transport === "sse"
      ? new SSEClientTransport(
        new URL(backend.url),
        backend.headers
          ? {
              eventSourceInit: {
                fetch: (url, init) => {
                  const headers = new Headers(init?.headers)
                  for (const [key, value] of Object.entries(backend.headers ?? {})) {
                    headers.set(key, value)
                  }

                  return fetch(url, {
                    ...init,
                    headers,
                  })
                },
              },
              requestInit: { headers: backend.headers },
            }
          : undefined,
      )
      : new StdioClientTransport({
        command: backend.command,
        args: backend.args,
        cwd: backend.cwd ?? RUNTIME_MCP_DEFAULT_CWD,
        env: {
          ...toDefinedEnv(process.env),
          npm_config_cache: process.env.npm_config_cache || "/tmp/agents-npm-cache",
          ...(backend.env ?? {}),
        },
      })

  await transport.start()

  return { transport }
}

async function closeRuntimeMcpClient(connection: RuntimeMcpClientConnection) {
  await connection.transport.close()
}

function getRuntimeMcpBridgeKey(serverName: string, sessionId: string) {
  return `${serverName}:${sessionId}`
}

function getMcpSessionId(req: express.Request): string | undefined {
  const header = req.headers["mcp-session-id"]
  if (Array.isArray(header)) {
    return header[0]
  }
  return header
}

function isInitializeResultMessage(message: JSONRPCMessage): message is JSONRPCMessage & {
  result: { protocolVersion: string }
} {
  return (
    isJSONRPCResultResponse(message)
    && isRecord(message.result)
    && typeof message.result.protocolVersion === "string"
  )
}

async function createRuntimeMcpBridge(
  serverName: string,
  backend: RuntimeMcpBackend,
): Promise<RuntimeMcpBridge> {
  const connection = await createRuntimeMcpClient(backend)
  let bridgeKey: string | null = null
  let cleanedUp = false
  let cleanupTimer: NodeJS.Timeout | null = null

  const downstream = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => uuid(),
    onsessioninitialized: (sessionId) => {
      bridgeKey = getRuntimeMcpBridgeKey(serverName, sessionId)
      runtimeMcpBridges.set(bridgeKey, bridge)
    },
    onsessionclosed: () => {
      void bridge.cleanup()
    },
  })

  const scheduleCleanup = () => {
    if (cleanupTimer) {
      clearTimeout(cleanupTimer)
    }

    cleanupTimer = setTimeout(() => {
      void bridge.cleanup()
    }, RUNTIME_MCP_SESSION_TTL_MS)
  }

  const bridge: RuntimeMcpBridge = {
    downstream,
    touch: scheduleCleanup,
    cleanup: async () => {
      if (cleanedUp) return
      cleanedUp = true

      if (cleanupTimer) {
        clearTimeout(cleanupTimer)
        cleanupTimer = null
      }

      if (bridgeKey) {
        runtimeMcpBridges.delete(bridgeKey)
      }

      await Promise.allSettled([
        downstream.close(),
        closeRuntimeMcpClient(connection),
      ])
    },
  }

  downstream.onmessage = (message) => {
    scheduleCleanup()
    void connection.transport.send(message).catch((error) => {
      console.error(`Failed to forward MCP request for ${serverName}:`, error)
      void bridge.cleanup()
    })
  }

  downstream.onerror = (error) => {
    console.error(`Downstream MCP transport error for ${serverName}:`, error)
  }

  connection.transport.onmessage = (message) => {
    scheduleCleanup()
    if (isInitializeResultMessage(message)) {
      if (
        "setProtocolVersion" in connection.transport
        && typeof connection.transport.setProtocolVersion === "function"
      ) {
        connection.transport.setProtocolVersion(message.result.protocolVersion)
      }
    }
    void downstream.send(message).catch((error) => {
      console.error(`Failed to forward MCP response for ${serverName}:`, error)
      void bridge.cleanup()
    })
  }

  connection.transport.onerror = (error) => {
    console.error(`Upstream MCP transport error for ${serverName}:`, error)
  }

  connection.transport.onclose = () => {
    void bridge.cleanup()
  }

  await downstream.start()
  scheduleCleanup()

  return bridge
}

async function handleConfiguredMcpRequest(
  req: express.Request,
  res: express.Response,
  serverName: string,
  backend: RuntimeMcpBackend,
) {
  const requestBody = parseRequestBody(await readRequestBody(req))
  const sessionId = getMcpSessionId(req)

  let bridge = sessionId
    ? runtimeMcpBridges.get(getRuntimeMcpBridgeKey(serverName, sessionId))
    : undefined

  if (!bridge) {
    if (sessionId) {
      res.status(404).json({ error: `Unknown MCP session: ${sessionId}` })
      return
    }

    if (!isInitializeRequest(requestBody)) {
      res.status(400).json({ error: "MCP session is not initialized" })
      return
    }

    bridge = await createRuntimeMcpBridge(serverName, backend)
  }

  bridge.touch()

  try {
    await bridge.downstream.handleRequest(req, res, requestBody)
  } finally {
    if (!bridge.downstream.sessionId) {
      await bridge.cleanup()
    }
  }
}

async function isLocalHttpMcpHealthy(backend: LocalHttpMcpBackend): Promise<boolean> {
  try {
    const response = await fetch(
      `http://127.0.0.1:${backend.port}${backend.healthPath ?? "/healthz"}`,
    )
    return response.ok
  } catch {
    return false
  }
}

async function stopLocalHttpMcpProcess() {
  const child = localHttpMcpProcess
  localHttpMcpProcess = null
  localHttpMcpEnvKey = null
  localHttpMcpStartup = null

  if (!child || child.exitCode !== null || child.killed) {
    return
  }

  child.kill("SIGTERM")
  await new Promise<void>((resolve) => {
    child.once("close", () => resolve())
    setTimeout(() => {
      if (child.exitCode === null && !child.killed) {
        child.kill("SIGKILL")
      }
      resolve()
    }, 2_000)
  })
}

async function ensureLocalHttpMcpServer(
  backend: LocalHttpMcpBackend,
  env: Record<string, string>,
) {
  const envKey = buildEnvKey(env)

  if (
    localHttpMcpProcess
    && localHttpMcpProcess.exitCode === null
    && localHttpMcpEnvKey === envKey
    && await isLocalHttpMcpHealthy(backend)
  ) {
    return
  }

  if (localHttpMcpStartup) {
    await localHttpMcpStartup
    if (localHttpMcpEnvKey === envKey && await isLocalHttpMcpHealthy(backend)) {
      return
    }
  }

  await stopLocalHttpMcpProcess()

  localHttpMcpStartup = (async () => {
    const child = spawn(backend.command, backend.args ?? [], {
      cwd: backend.cwd,
      env: {
        ...process.env,
        ...env,
        ...(backend.env ?? {}),
      },
      stdio: ["ignore", "ignore", "pipe"],
    })

    localHttpMcpProcess = child
    localHttpMcpEnvKey = envKey

    child.stderr.on("data", (chunk) => {
      process.stderr.write(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    })

    child.on("close", () => {
      if (localHttpMcpProcess === child) {
        localHttpMcpProcess = null
        localHttpMcpEnvKey = null
      }
    })

    for (let attempt = 0; attempt < 100; attempt += 1) {
      if (child.exitCode !== null) {
        throw new Error(`Local MCP worker exited with code ${child.exitCode}`)
      }
      if (await isLocalHttpMcpHealthy(backend)) {
        return
      }
      await sleep(100)
    }

    throw new Error("Timed out waiting for local MCP worker to become ready")
  })()

  try {
    await localHttpMcpStartup
  } finally {
    localHttpMcpStartup = null
  }
}

async function handleLocalHttpMcpRequest(
  req: express.Request,
  res: express.Response,
  backend: LocalHttpMcpBackend,
  env: Record<string, string>,
) {
  await ensureLocalHttpMcpServer(backend, env)

  await new Promise<void>((resolve, reject) => {
    const proxyRequest = http.request({
      hostname: "127.0.0.1",
      port: backend.port,
      path: backend.path ?? "/mcp",
      method: req.method,
      headers: req.headers,
    }, (proxyResponse) => {
      res.status(proxyResponse.statusCode ?? 500)

      for (const [name, value] of Object.entries(proxyResponse.headers)) {
        if (value !== undefined) {
          res.setHeader(name, value)
        }
      }

      proxyResponse.pipe(res)
      proxyResponse.on("end", () => resolve())
      proxyResponse.on("error", reject)
    })

    proxyRequest.on("error", reject)
    req.on("aborted", () => proxyRequest.destroy())
    req.pipe(proxyRequest)
  })
}

async function handleUserToolsMcpRequest(req: express.Request, res: express.Response) {
  if (!isTrustedMcpClient(req.socket.remoteAddress)) {
    res.status(403).json({ error: "Local network only" })
    return
  }

  const config = await getAgentConfig()
  const toolsEnv = {
    ...readPrivateToolsEnv(),
    ...buildVaultProxyEnv(),
  }
  const mcpBackend = getLocalHttpMcpBackend(config)

  try {
    if (mcpBackend) {
      await handleLocalHttpMcpRequest(req, res, mcpBackend, toolsEnv)
      return
    }

    const requestBody = parseRequestBody(await readRequestBody(req))
    hydrateToolProcessEnv(toolsEnv)
    const server = createUserToolsMcpServer(config, toolsEnv)
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    })

    const cleanup = () => {
      void transport.close()
      void server.close()
    }
    res.on("close", cleanup)
    await server.connect(transport)
    await transport.handleRequest(req, res, requestBody)
  } catch (error) {
    const message = formatRuntimeError("tool_runtime", error)
    console.error("Failed to handle local MCP request:", error)
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message,
        },
        id: null,
      })
    }
  }
}

async function handleRuntimeMcpProxyRequest(
  req: express.Request<{ serverName: string }>,
  res: express.Response,
) {
  if (!isTrustedMcpClient(req.socket.remoteAddress)) {
    res.status(403).json({ error: "Local network only" })
    return
  }

  const serverName = req.params.serverName
  const backends = loadRuntimeMcpBackends()
  const backend = backends[serverName]

  if (!backend) {
    res.status(404).json({ error: `Unknown MCP server: ${serverName}` })
    return
  }

  try {
    await handleConfiguredMcpRequest(req, res, serverName, backend)
  } catch (error) {
    const message = formatRuntimeError(`mcp_proxy:${serverName}`, error)
    console.error(`Failed to handle MCP proxy request for ${serverName}:`, error)
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message,
        },
        id: null,
      })
    }
  }
}

// POST /sessions — new session
app.post("/sessions", async (req, res) => {
  const { message, images, options, threadId } = req.body
  if (!message || typeof message !== "string") {
    res.status(400).send("Missing or invalid message")
    return
  }

  try {
    const config = await getAgentConfig()
    const sandboxId = getSandboxId()
    // The "acp:" prefix is how the relay knows to use the ACP→AI-SDK
    // transformer. Legacy sandboxes (no prefix) → SDK transformer. The prefix
    // is the only signal; no other plumbing required.
    const streamId = `acp:${sandboxId}-${uuid()}`

    res.json({ streamId })

    void executeAgentViaACP(config, { message, images, streamId, threadId, options }).catch(async (error) => {
      const formatted = formatRuntimeError("agent_execute", error)
      console.error(formatted, error)
      await publishRuntimeError(streamId, formatted)
    })
  } catch (error) {
    const formatted = formatRuntimeError("session_start", error)
    console.error(formatted, error)
    res.status(500).send(formatted)
  }
})

// POST /sessions/:sessionId/messages — continue session
app.post("/sessions/:sessionId/messages", async (req, res) => {
  const { sessionId } = req.params
  const { message, images, options, threadId } = req.body
  if (!message || typeof message !== "string") {
    res.status(400).send("Missing or invalid message")
    return
  }

  try {
    const config = await getAgentConfig()
    const sandboxId = getSandboxId()
    // See /sessions handler above — "acp:" prefix signals the ACP transformer.
    const streamId = `acp:${sandboxId}-${uuid()}`

    res.json({ streamId })

    void executeAgentViaACP(config, { message, images, sessionId, streamId, threadId, options }).catch(async (error) => {
      const formatted = formatRuntimeError("agent_execute", error)
      console.error(formatted, error)
      await publishRuntimeError(streamId, formatted)
    })
  } catch (error) {
    const formatted = formatRuntimeError("session_continue", error)
    console.error(formatted, error)
    res.status(500).send(formatted)
  }
})

mcpApp.all("/mcp-proxy", handleUserToolsMcpRequest)
mcpApp.all("/mcp-runtime/:serverName", handleRuntimeMcpProxyRequest)

const PORT = process.env.PORT || 3003
const MCP_PORT = process.env.MCP_PORT || 3004

app.listen(PORT, () => {
  console.log(`AN Runtime running on port ${PORT}, waiting for agent bundle`)
})

mcpApp.listen(MCP_PORT, () => {
  console.log(`AN MCP runtime listening on port ${MCP_PORT}`)
})
