import {
  query as claudeQuery,
  type Options,
  type SDKUserMessage,
  type PreToolUseHookInput,
  type PostToolUseHookInput,
  type SpawnOptions,
  type SpawnedProcess,
} from "@anthropic-ai/claude-agent-sdk"
import type { AgentConfig, AgentRequestOptions } from "@21st-sdk/agent"
import { processStream, publish } from "./stream.js"
import { initTrace, flushTrace, createTracingHooks, spanManager } from "./tracing.js"
import { existsSync, readFileSync, writeFileSync } from "fs"
import { execFileSync, spawn } from "child_process"
import { EventEmitter } from "events"
import { PassThrough, type Readable, type Writable } from "stream"
import { getPrivateEnvNames } from "./env.js"
import { buildClaudeMcpServers } from "./mcp.js"
import { ACPBridge } from "./acp-bridge.js"

const AGENT_BUNDLE_PATH = process.env.AGENT_BUNDLE_PATH || "/home/user/runtime/agent-bundle.js"
const AGENT_JSON_PATH = process.env.AGENT_JSON_PATH || "/home/user/runtime/agent-config.json"
const MOAT_WORKDIR = "/workspace"
const DIRECT_CLAUDE_WORKDIR = "/home/user/workspace"
const DIRECT_CLAUDE_HOME = DIRECT_CLAUDE_WORKDIR
const DOCKER_CLI = "docker"
const WORKSPACE_HOST_DIR = "/home/user/workspace"
const WORKSPACE_OWNER = "5000:5000"
const PERSISTENT_MOAT_STATE_PATH = "/home/user/runtime/moat-persistent-run.json"
const CLAUDE_CONFIG_PATH = `${DIRECT_CLAUDE_HOME}/.claude.json`
const CLAUDE_OAUTH_PATH = `${DIRECT_CLAUDE_HOME}/.claude-oauth-token`
const CLAUDE_PROXY_CONFIG_PATH = `${DIRECT_CLAUDE_HOME}/.claude-proxy-config`
const MOAT_PASSTHROUGH_ENV_MAP = {
  CLAUDE_CODE_OAUTH_TOKEN: "AGENTS_CLAUDE_CODE_OAUTH_TOKEN",
  ANTHROPIC_API_KEY: "AGENTS_ANTHROPIC_API_KEY",
  CLAUDE_API_KEY: "AGENTS_CLAUDE_API_KEY",
  ANTHROPIC_BASE_URL: "AGENTS_ANTHROPIC_BASE_URL",
  HTTPS_PROXY: "HTTPS_PROXY",
  HTTP_PROXY: "HTTP_PROXY",
  https_proxy: "https_proxy",
  http_proxy: "http_proxy",
  NO_PROXY: "NO_PROXY",
  no_proxy: "no_proxy",
  NODE_USE_ENV_PROXY: "NODE_USE_ENV_PROXY",
} as const

function isMoatEnabled() {
  return process.env.AGENTS_USE_MOAT !== "false"
}

export async function loadAgentConfig(): Promise<AgentConfig> {
  // Code-deployed agents: load JS bundle
  if (existsSync(AGENT_BUNDLE_PATH)) {
    const mod = await import(AGENT_BUNDLE_PATH)
    const config = mod.default
    if (!config || config._type !== "agent") {
      throw new Error(`Invalid agent config at ${AGENT_BUNDLE_PATH}`)
    }
    return config
  }

  // No-code agents: load JSON config (dashboard-deployed)
  if (existsSync(AGENT_JSON_PATH)) {
    const raw = JSON.parse(readFileSync(AGENT_JSON_PATH, "utf-8"))
    return {
      _type: "agent",
      runtime: raw.runtime ?? "claude-code",
      model: raw.model ?? "claude-sonnet-4-6",
      systemPrompt: raw.systemPrompt,
      permissionMode: raw.permissionMode ?? "bypassPermissions",
      maxTurns: raw.maxTurns ?? 50,
      maxBudgetUsd: raw.maxBudgetUsd,
      maxSandboxBudgetUsd: raw.maxSandboxBudgetUsd,
      mcpServers: [],
      tools: {},
    }
  }

  throw new Error("No agent bundle or JSON config found")
}

// --- Hooks mapping ---

function buildHooks(config: AgentConfig) {
  const hooks: Options["hooks"] = {}

  // User-defined hooks first
  if (config.onToolCall) {
    hooks.PreToolUse = [{
      hooks: [async (raw) => {
        const input = raw as PreToolUseHookInput
        const result = await config.onToolCall!({
          toolName: input.tool_name,
          input: input.tool_input as Record<string, unknown>,
        })
        if (result === false) {
          return {
            hookSpecificOutput: {
              hookEventName: "PreToolUse" as const,
              permissionDecision: "deny" as const,
              permissionDecisionReason: "Blocked by onToolCall hook",
            },
          }
        }
        return {}
      }],
    }]
  }

  if (config.onToolResult) {
    hooks.PostToolUse = [{
      hooks: [async (raw) => {
        const input = raw as PostToolUseHookInput
        await config.onToolResult!({
          toolName: input.tool_name,
          input: input.tool_input as Record<string, unknown>,
          output: input.tool_response,
        })
        return {}
      }],
    }]
  }

  // Append tracing hooks after user hooks
  const tracingHooks = createTracingHooks()
  for (const [event, matchers] of Object.entries(tracingHooks)) {
    const key = event as keyof typeof hooks
    if (hooks[key]) {
      hooks[key] = [...hooks[key]!, ...matchers]
    } else {
      (hooks as any)[key] = matchers
    }
  }

  return hooks
}

// --- Environment ---

const VAULT_PROXY_CONFIG_PATH = "/home/user/.vault-proxy-config"
const DEFAULT_NO_PROXY = "localhost,127.0.0.1,169.254.169.254,::1"

function readEnvFile(path: string): Record<string, string> {
  const result: Record<string, string> = {}
  if (!existsSync(path)) return result

  const content = readFileSync(path, "utf-8")
  for (const line of content.split("\n")) {
    const [key, ...valueParts] = line.split("=")
    if (key?.trim() && valueParts.length) {
      result[key.trim()] = valueParts.join("=").trim()
    }
  }
  return result
}

export function buildVaultProxyEnv(
  path: string = VAULT_PROXY_CONFIG_PATH,
): Record<string, string> {
  const config = readEnvFile(path)
  if (!config.VAULT_PROXY_URL || !config.VAULT_PROXY_JWT) return {}

  const proxyUrl = new URL(config.VAULT_PROXY_URL)
  proxyUrl.username = "sandbox"
  proxyUrl.password = config.VAULT_PROXY_JWT
  const proxy = proxyUrl.toString()

  return {
    HTTPS_PROXY: proxy,
    HTTP_PROXY: proxy,
    https_proxy: proxy,
    http_proxy: proxy,
    NO_PROXY: DEFAULT_NO_PROXY,
    no_proxy: DEFAULT_NO_PROXY,
    NODE_USE_ENV_PROXY: "1",
  }
}

function applyVaultProxyEnv(env: NodeJS.ProcessEnv) {
  Object.assign(env, buildVaultProxyEnv())
}

function getCleanEnv(requestOptions?: AgentRequestOptions) {
  const cleanEnv = { ...process.env }
  delete cleanEnv.NODE_OPTIONS
  delete cleanEnv.VSCODE_INSPECTOR_OPTIONS

  cleanEnv.IS_SANDBOX = "1"

  for (const envName of getPrivateEnvNames()) {
    delete cleanEnv[envName]
  }

  // Priority 0: Environment variable
  if (cleanEnv.CLAUDE_CODE_OAUTH_TOKEN) {
    console.log("OAuth token loaded from environment variable")
    delete cleanEnv.ANTHROPIC_API_KEY
    delete cleanEnv.ANTHROPIC_BASE_URL
    applyVaultProxyEnv(cleanEnv)
    return cleanEnv
  }

  // Priority 1: OAuth token file
  if (existsSync(CLAUDE_OAUTH_PATH)) {
    try {
      const token = readFileSync(CLAUDE_OAUTH_PATH, "utf-8").trim()
      if (token) {
        cleanEnv.CLAUDE_CODE_OAUTH_TOKEN = token
        console.log("OAuth token loaded from", CLAUDE_OAUTH_PATH)
        delete cleanEnv.ANTHROPIC_API_KEY
        delete cleanEnv.ANTHROPIC_BASE_URL
        applyVaultProxyEnv(cleanEnv)
        return cleanEnv
      }
    } catch (e) {
      console.error("Failed to read OAuth token:", e)
    }
  }

  // Priority 2: Proxy config file
  if (existsSync(CLAUDE_PROXY_CONFIG_PATH)) {
    try {
      Object.assign(cleanEnv, readEnvFile(CLAUDE_PROXY_CONFIG_PATH))
      console.log("Proxy config loaded from", CLAUDE_PROXY_CONFIG_PATH)
    } catch (e) {
      console.error("Failed to read proxy config:", e)
    }
  }

  // Priority 2b: Codex proxy config file (OpenAI). Parallel to the claude-proxy
  // block above — read KEY=VALUE lines and copy into cleanEnv. Populates
  // OPENAI_BASE_URL + OPENAI_API_KEY + CODEX_API_KEY so codex-acp can auth via
  // any of the env vars it recognizes. All point at the same claude-proxy JWT.
  const codexProxyPath = "/home/user/workspace/.codex-proxy-config"
  if (existsSync(codexProxyPath)) {
    try {
      Object.assign(cleanEnv, readEnvFile(codexProxyPath))
      console.log("Codex proxy config loaded from", codexProxyPath)
    } catch (e) {
      console.error("Failed to read codex proxy config:", e)
    }
  }

  applyVaultProxyEnv(cleanEnv)

  return cleanEnv
}

// --- Prompt building ---

type TextBlock = { type: "text"; text: string }
type ImageBlock = {
  type: "image"
  source: { type: "base64"; media_type: string; data: string }
}
type ContentBlock = TextBlock | ImageBlock

function buildPrompt(
  message: string,
  images?: Array<{ base64: string; mediaType: string }>,
): string | AsyncIterable<SDKUserMessage> {
  if (!images || images.length === 0) {
    return message
  }

  const content: ContentBlock[] = []

  for (const img of images) {
    content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: img.mediaType,
        data: img.base64,
      },
    })
  }

  content.push({ type: "text", text: message })

  async function* messageGenerator(): AsyncGenerator<SDKUserMessage> {
    yield {
      type: "user",
      message: {
        role: "user",
        content,
      },
      parent_tool_use_id: null,
      session_id: "",
    } as SDKUserMessage
  }

  return messageGenerator()
}

// --- SDK options ---

function buildSdkOptions(config: AgentConfig, params: {
  sessionId?: string
  requestOptions?: AgentRequestOptions
}): Options {
  const hooks = buildHooks(config)
  const opts = params.requestOptions
  const useMoat = isMoatEnabled()
  const cleanEnv = getCleanEnv(opts)

  // Shallow merge: request options override bundle config per-field
  const effectiveModel = opts?.model ?? config.model
  const effectiveSystemPrompt = opts?.systemPrompt ?? config.systemPrompt
  const effectiveMaxTurns = opts?.maxTurns ?? config.maxTurns
  const effectiveMaxBudgetUsd = opts?.maxBudgetUsd ?? config.maxBudgetUsd

  let directMcpServers: ReturnType<typeof buildClaudeMcpServers> | undefined
  if (!useMoat) {
    directMcpServers = buildClaudeMcpServers({
      host: "127.0.0.1",
      env: cleanEnv,
    })
    writeDirectClaudeConfig(directMcpServers)
    cleanEnv.HOME = DIRECT_CLAUDE_HOME
  }

  return {
    executable: "node",
    cwd: useMoat ? MOAT_WORKDIR : DIRECT_CLAUDE_WORKDIR,
    ...(useMoat ? { pathToClaudeCodeExecutable: "claude" } : {}),
    model: effectiveModel,
    systemPrompt: effectiveSystemPrompt,
    // Load filesystem-backed settings so Skills can be discovered from
    // ~/.claude/skills and .claude/skills relative to cwd.
    settingSources: ["user", "project"],
    permissionMode: "bypassPermissions",
    maxTurns: effectiveMaxTurns,
    ...(effectiveMaxBudgetUsd && { maxBudgetUsd: effectiveMaxBudgetUsd }),
    ...(opts?.disallowedTools && opts.disallowedTools.length > 0 && { disallowedTools: opts.disallowedTools }),
    ...(directMcpServers ? { mcpServers: directMcpServers } : {}),
    hooks,
    ...(params.sessionId && { resume: params.sessionId, continue: true }),
    includePartialMessages: true,
    env: cleanEnv,
    ...(useMoat
      ? {
          spawnClaudeCodeProcess: (options: SpawnOptions): SpawnedProcess =>
            spawnMoatProcess(options),
        }
      : {}),
    allowDangerouslySkipPermissions: true,
    sandbox: { enabled: true, autoAllowBashIfSandboxed: true },
  }
}

function writeDirectClaudeConfig(mcpServers: ReturnType<typeof buildClaudeMcpServers>) {
  let config: Record<string, unknown> = {}

  if (existsSync(CLAUDE_CONFIG_PATH)) {
    try {
      const parsed = JSON.parse(readFileSync(CLAUDE_CONFIG_PATH, "utf8"))
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        config = parsed as Record<string, unknown>
      }
    } catch {}
  }

  config.mcpServers = mcpServers

  const projects =
    config.projects && typeof config.projects === "object" && !Array.isArray(config.projects)
      ? { ...(config.projects as Record<string, unknown>) }
      : {}

  const project =
    projects[DIRECT_CLAUDE_WORKDIR] &&
    typeof projects[DIRECT_CLAUDE_WORKDIR] === "object" &&
    !Array.isArray(projects[DIRECT_CLAUDE_WORKDIR])
      ? { ...(projects[DIRECT_CLAUDE_WORKDIR] as Record<string, unknown>) }
      : {}

  project.hasTrustDialogAccepted = true
  projects[DIRECT_CLAUDE_WORKDIR] = project
  config.projects = projects

  writeFileSync(CLAUDE_CONFIG_PATH, JSON.stringify(config, null, 2) + "\n")
}

function getExecEnvFlags(childEnv: SpawnOptions["env"], mcpServersJson?: string) {
  const flags: string[] = []
  const env = childEnv ?? {}

  for (const [envName, moatEnvName] of Object.entries(MOAT_PASSTHROUGH_ENV_MAP)) {
    const envValue = env[envName]
    if (!envValue) continue
    flags.push("-e", `${moatEnvName}=${envValue}`)
  }

  flags.push("-e", "HOME=/home/moatuser")
  if (mcpServersJson) {
    flags.push("-e", `AGENTS_MCP_SERVERS_JSON=${mcpServersJson}`)
  }

  return flags
}

function createMoatProcessEnv() {
  return {
    ...process.env,
    HOME: "/home/user",
  } as NodeJS.ProcessEnv
}

type PersistentMoatState = {
  runId: string
  containerId: string
}

function buildMoatEntryScript() {
  return [
    'if [ -n "${AGENTS_CLAUDE_CODE_OAUTH_TOKEN:-}" ]; then',
    '  export CLAUDE_CODE_OAUTH_TOKEN="$AGENTS_CLAUDE_CODE_OAUTH_TOKEN"',
    "  unset ANTHROPIC_API_KEY ANTHROPIC_BASE_URL CLAUDE_API_KEY",
    "fi",
    'if [ -n "${AGENTS_ANTHROPIC_API_KEY:-}" ]; then export ANTHROPIC_API_KEY="$AGENTS_ANTHROPIC_API_KEY"; fi',
    'if [ -n "${AGENTS_CLAUDE_API_KEY:-}" ]; then export CLAUDE_API_KEY="$AGENTS_CLAUDE_API_KEY"; fi',
    'if [ -n "${AGENTS_ANTHROPIC_BASE_URL:-}" ]; then export ANTHROPIC_BASE_URL="$AGENTS_ANTHROPIC_BASE_URL"; fi',
    'rewrite_proxy_var() {',
    '  value=$(printenv "$1" 2>/dev/null || true)',
    '  if [ -n "$value" ]; then',
    '    export "$1=$(printf %s "$value" | sed "s#127\\.0\\.0\\.1#host.docker.internal#g")"',
    "  fi",
    "}",
    "rewrite_proxy_var HTTP_PROXY",
    "rewrite_proxy_var HTTPS_PROXY",
    "rewrite_proxy_var http_proxy",
    "rewrite_proxy_var https_proxy",
    'if [ -n "${NO_PROXY:-}" ]; then export NO_PROXY="${NO_PROXY},host.docker.internal"; else export NO_PROXY="host.docker.internal"; fi',
    'if [ -n "${no_proxy:-}" ]; then export no_proxy="${no_proxy},host.docker.internal"; else export no_proxy="host.docker.internal"; fi',
    'if [ -n "${AGENTS_MCP_SERVERS_JSON:-}" ]; then',
    "  node - <<'EOF'",
    'const fs = require("node:fs")',
    'const path = "/home/moatuser/.claude.json"',
    "let config = {}",
    "try { config = JSON.parse(fs.readFileSync(path, 'utf8')) } catch {}",
    "if (!config || typeof config !== 'object' || Array.isArray(config)) config = {}",
    "config.mcpServers = JSON.parse(process.env.AGENTS_MCP_SERVERS_JSON)",
    "if (!config.projects || typeof config.projects !== 'object' || Array.isArray(config.projects)) config.projects = {}",
    "const project = config.projects['/workspace']",
    "if (!project || typeof project !== 'object' || Array.isArray(project)) {",
    "  config.projects['/workspace'] = { hasTrustDialogAccepted: true }",
    "} else {",
    "  config.projects['/workspace'].hasTrustDialogAccepted = true",
    "}",
    "fs.writeFileSync(path, JSON.stringify(config, null, 2) + '\\n')",
    "EOF",
    "fi",
    'exec "$0" "$@"',
  ].join("\n")
}

function loadPersistentMoatState(): PersistentMoatState {
  return JSON.parse(readFileSync(PERSISTENT_MOAT_STATE_PATH, "utf8")) as PersistentMoatState
}

class FilteredSpawnedProcess extends EventEmitter implements SpawnedProcess {
  stdin: Writable
  stdout: Readable
  private readonly child: ReturnType<typeof spawn>
  private finalExitCode: number | null = null

  constructor(child: ReturnType<typeof spawn>) {
    super()
    if (!child.stdin || !child.stdout) {
      throw new Error("Spawned process must expose piped stdin and stdout")
    }
    this.child = child
    this.stdin = child.stdin

    const filteredStdout = new PassThrough()
    this.stdout = filteredStdout

    let buffered = ""
    child.stdout.on("data", (chunk) => {
      buffered += chunk.toString()
      const lines = buffered.split(/\r?\n/)
      buffered = lines.pop() || ""

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed) continue
        try {
          JSON.parse(trimmed)
          filteredStdout.write(trimmed + "\n")
        } catch {}
      }
    })

    child.stdout.on("end", () => {
      const trimmed = buffered.trim()
      if (trimmed) {
        try {
          JSON.parse(trimmed)
          filteredStdout.write(trimmed + "\n")
        } catch {}
      }
      filteredStdout.end()
    })

    child.on("error", (error) => {
      this.emit("error", error)
    })

    child.on("exit", (code, signal) => {
      this.finalExitCode = code
      this.emit("exit", code, signal)
    })
  }

  get killed() {
    return this.child.killed
  }

  get exitCode() {
    return this.finalExitCode
  }

  kill(signal: NodeJS.Signals) {
    return this.child.kill(signal)
  }
}

function spawnFailureProcess(message: string, options: SpawnOptions) {
  return spawn(
    "sh",
    ["-lc", `echo ${JSON.stringify(message)} >&2; exit 127`],
    {
      cwd: "/home/user/runtime",
      env: createMoatProcessEnv(),
      signal: options.signal,
      stdio: ["pipe", "pipe", "inherit"],
    },
  )
}

function spawnMoatProcess(options: SpawnOptions): SpawnedProcess {
  if (!existsSync(PERSISTENT_MOAT_STATE_PATH)) {
    return spawnFailureProcess(`Persistent Moat state is missing at ${PERSISTENT_MOAT_STATE_PATH}.`, options)
  }

  let state: PersistentMoatState
  try {
    state = loadPersistentMoatState()
  } catch {
    return spawnFailureProcess(`Failed to load persistent Moat state from ${PERSISTENT_MOAT_STATE_PATH}.`, options)
  }

  try {
    execFileSync("chown", ["-R", WORKSPACE_OWNER, WORKSPACE_HOST_DIR], {
      cwd: "/home/user/runtime",
      stdio: "ignore",
    })
  } catch {
    return spawnFailureProcess(`Failed to set ${WORKSPACE_HOST_DIR} ownership to ${WORKSPACE_OWNER}.`, options)
  }

  let mcpServersJson: string
  try {
    mcpServersJson = JSON.stringify(buildClaudeMcpServers())
  } catch (error) {
    return spawnFailureProcess(
      `Failed to build MCP config: ${error instanceof Error ? error.message : String(error)}`,
      options,
    )
  }

  const child = spawn(
    DOCKER_CLI,
    [
      "exec",
      "-i",
      "-u",
      "moatuser",
      "-w",
      MOAT_WORKDIR,
      ...getExecEnvFlags(options.env, mcpServersJson),
      state.containerId,
      "sh",
      "-c",
      buildMoatEntryScript(),
      options.command,
      ...options.args,
    ],
    {
      cwd: "/home/user/runtime",
      env: createMoatProcessEnv(),
      signal: options.signal,
      stdio: ["pipe", "pipe", "inherit"],
    },
  )

  return new FilteredSpawnedProcess(child)
}

// --- Entry point (SDK path) ---

export async function executeAgent(config: AgentConfig, params: {
  message: string
  images?: Array<{ base64: string; mediaType: string }>
  sessionId?: string
  streamId: string
  threadId?: string
  options?: AgentRequestOptions
}) {
  const traceId = params.threadId ?? params.streamId
  initTrace(params.streamId, traceId, publish)
  const agentName = (config as { name?: string }).name || "main"

  const rootKey = "root"
  const rootSpanId = spanManager.startSpan(rootKey, {
    name: "agent:" + agentName,
    kind: "agent",
    attributes: {
      "agent.name": agentName,
      ...(config.model ? { "agent.model": config.model } : {}),
      "stream.id": params.streamId,
      "tool.input": JSON.stringify({ message: params.message }).slice(0, 10_000),
    },
  })
  spanManager.setRootSpanId(rootSpanId)

  try {
    const sdkOptions = buildSdkOptions(config, { sessionId: params.sessionId, requestOptions: params.options })
    const prompt = buildPrompt(params.message, params.images)
    const queryStream = claudeQuery({ prompt, options: sdkOptions })

    await processStream(queryStream, params.streamId, config)

    spanManager.endSpan(rootKey, { status: "completed" })
  } catch (error: any) {
    spanManager.endSpan(rootKey, { status: "error", error: error?.message ?? String(error) })
    throw error
  } finally {
    flushTrace()
  }
}

// --- Entry point (ACP path) ---

// Singleton ACP bridge per sandbox — process stays alive across messages.
// The bridge is a thin pipe: it forwards raw ACP JSON-RPC from stdout directly
// to the relay's publish endpoint. All transformation happens in the relay.
let acpBridge: ACPBridge | null = null

export async function executeAgentViaACP(config: AgentConfig, params: {
  message: string
  images?: Array<{ base64: string; mediaType: string }>
  sessionId?: string
  streamId: string
  threadId?: string
  options?: AgentRequestOptions
}) {
  const definedHooks = (["onStart", "onFinish", "onToolCall", "onToolResult", "onStepFinish", "onError"] as const)
    .filter((h) => typeof (config as unknown as Record<string, unknown>)[h] === "function")
  if (definedHooks.length > 0) {
    console.warn(
      `[ACP] Lifecycle hooks are not supported on the ACP runtime path. Ignoring: ${definedHooks.join(", ")}`,
    )
  }

  if (!acpBridge || !acpBridge.isAlive()) {
    acpBridge = new ACPBridge()
    const env = getCleanEnv(params.options)
    const binary = config.runtime === "codex" ? "codex-acp" : "claude-agent-acp"
    await acpBridge.spawn(env as Record<string, string | undefined>, binary)
  }

  let sessionId: string
  if (params.sessionId && acpBridge.getSessionId() === params.sessionId) {
    sessionId = params.sessionId
  } else {
    sessionId = await acpBridge.createSession(config, {
      resume: params.sessionId,
      requestOptions: params.options,
    })
  }

  await acpBridge.sendPrompt(sessionId, params.message, params.streamId)
}
