/**
 * ACP Bridge — a thin pipe that spawns an ACP binary
 * and forwards its stdout NDJSON lines to the relay's /publish/:streamId endpoint.
 *
 * Responsibilities (intentionally minimal):
 *   1. Spawn the ACP binary (claude-agent-acp by default)
 *   2. Send initialize + session/new via JSON-RPC over stdin
 *   3. Forward every stdout line to the relay, wrapped in batches
 *   4. Handle process lifecycle (detect exit, mark dead)
 *
 * Explicitly NOT responsible for:
 *   - Converting ACP → Claude SDK format (dropped; relay transformer handles this)
 *   - Emitting tracing spans (deferred to a future relay-side addition)
 *   - Firing agent-config lifecycle hooks (unsupported on ACP path — documented limitation)
 */

import { spawn, execFileSync, type ChildProcess } from "child_process"
import { EventEmitter } from "events"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs"
import { publish } from "./stream.js"
import { buildClaudeMcpServers } from "./mcp.js"
import type { AgentConfig, AgentRequestOptions } from "@21st-sdk/agent"

// ─── Constants ─────────────────────────────────────────────────────

const PERSISTENT_MOAT_STATE_PATH = "/home/user/runtime/moat-persistent-run.json"
const WORKSPACE_HOST_DIR = "/home/user/workspace"
const WORKSPACE_OWNER = "5000:5000"
const MOAT_WORKDIR = "/workspace"
const DIRECT_WORKDIR = "/home/user/workspace"
const DIRECT_HOME = process.env.AGENT_ID
  ? `${DIRECT_WORKDIR}/.agents/${process.env.AGENT_ID}`
  : DIRECT_WORKDIR
const DOCKER_CLI = "docker"
const FLUSH_INTERVAL_MS = 50

const MOAT_PASSTHROUGH_ENV_MAP = {
  // Claude / Anthropic path
  CLAUDE_CODE_OAUTH_TOKEN: "AGENTS_CLAUDE_CODE_OAUTH_TOKEN",
  ANTHROPIC_API_KEY: "AGENTS_ANTHROPIC_API_KEY",
  CLAUDE_API_KEY: "AGENTS_CLAUDE_API_KEY",
  ANTHROPIC_BASE_URL: "AGENTS_ANTHROPIC_BASE_URL",
  // Codex / OpenAI path — mirrors the Anthropic pair exactly. The proxy only
  // supports the standard OpenAI API path (api.openai.com via /openai/v1), so
  // we only need OpenAI's canonical env vars. CODEX_API_KEY (for codex-acp's
  // own subscription backend) is intentionally NOT passed through.
  OPENAI_API_KEY: "AGENTS_OPENAI_API_KEY",
  OPENAI_BASE_URL: "AGENTS_OPENAI_BASE_URL",
  HTTPS_PROXY: "HTTPS_PROXY",
  HTTP_PROXY: "HTTP_PROXY",
  https_proxy: "https_proxy",
  http_proxy: "http_proxy",
  NO_PROXY: "NO_PROXY",
  no_proxy: "no_proxy",
  NODE_USE_ENV_PROXY: "NODE_USE_ENV_PROXY",
} as const

// Auth methods we support during the ACP `authenticate` handshake. Must
// match what the proxy is set up to handle. We only proxy the standard
// OpenAI API, so only `openai-api-key` is supported. If a future agent
// advertises something else, we throw — better than silently routing
// traffic to an endpoint we don't proxy.
const SUPPORTED_AUTH_METHODS = new Set(["openai-api-key"])

type PersistentMoatState = { runId: string; containerId: string }

function isMoatEnabled() {
  return process.env.AGENTS_USE_MOAT !== "false"
}

type JsonRpcRequest = {
  jsonrpc: "2.0"
  id: number
  method: string
  params?: unknown
}

// ─── ACPBridge ─────────────────────────────────────────────────────

export class ACPBridge extends EventEmitter {
  private process: ChildProcess | null = null
  private requestId = 0
  private pendingRequests = new Map<number, {
    resolve: (result: any) => void
    reject: (error: Error) => void
  }>()
  private stdoutBuffer = ""
  private alive = false
  private sessionId: string | null = null
  private supportsSessionMode = false

  // Active stream state: while a prompt is in flight, we batch and publish
  // every stdout JSON line to this stream ID.
  private activeStreamId: string | null = null
  private batchSeq = 0
  private pendingMessages: any[] = []
  private flushTimer: ReturnType<typeof setInterval> | null = null

  /** Spawn the ACP binary and run the initialize handshake. */
  async spawn(env: Record<string, string | undefined>, binary = "claude-agent-acp"): Promise<void> {
    if (this.alive) return
    this.supportsSessionMode = binary === "claude-agent-acp"

    const child = isMoatEnabled()
      ? this.spawnMoatProcess(env, binary)
      : this.spawnDirectProcess(env, binary)

    this.process = child
    this.alive = true

    child.stdout!.on("data", (chunk: Buffer) => this.handleStdoutChunk(chunk))

    child.on("error", (error) => {
      this.alive = false
      this.emit("error", error)
      this.rejectAllPending(error)
      this.publishErrorAndDone(error.message)
    })

    child.on("exit", (code, signal) => {
      this.alive = false
      this.emit("exit", code, signal)
      const msg = `ACP process exited with code ${code}, signal ${signal}`
      this.rejectAllPending(new Error(msg))
      if (this.activeStreamId) {
        this.publishErrorAndDone(msg)
      }
    })

    // Initialize handshake — every ACP agent starts here.
    const initResult = await this.sendRequest("initialize", {
      protocolVersion: 1,
      clientCapabilities: {},
    })
    console.log("[ACP] Process spawned and initialized")

    // If the agent advertises non-empty authMethods, it requires the client
    // to explicitly select one before session/new will work. claude-agent-acp
    // returns an empty authMethods array (auto-detects auth from env vars).
    // codex-acp returns [chatgpt, codex-api-key, openai-api-key] and rejects
    // session/new with -32000 "Authentication required" otherwise.
    //
    // We only support "openai-api-key" — the standard OpenAI API path — because
    // that's the only thing claude-proxy /openai/v1 is set up to forward.
    // codex-api-key would target codex-acp's own subscription backend (different
    // endpoints, different billing). chatgpt is interactive OAuth (no browser
    // in a sandbox).
    //
    // The OPENAI_API_KEY env var (containing the proxy JWT) is set by
    // sandbox-factory's injectProxyConfig and passed through MOAT_PASSTHROUGH_ENV_MAP.
    const authMethods = (initResult?.authMethods ?? []) as Array<{ id: string }>
    if (authMethods.length > 0) {
      const chosen = authMethods.find((m) => SUPPORTED_AUTH_METHODS.has(m.id))
      if (chosen) {
        await this.sendRequest("authenticate", { methodId: chosen.id })
        console.log(`[ACP] Authenticated with method: ${chosen.id}`)
      } else {
        const available = authMethods.map((m) => m.id).join(", ")
        const supported = [...SUPPORTED_AUTH_METHODS].join(", ")
        throw new Error(
          `[ACP] Agent advertised authMethods [${available}] but none are supported. ` +
            `Supported: [${supported}]. Aborting before session/new.`,
        )
      }
    }
  }

  /** Create a new ACP session. Returns the sessionId assigned by the agent. */
  async createSession(config: AgentConfig, opts?: {
    resume?: string
    requestOptions?: AgentRequestOptions
  }): Promise<string> {
    const effectiveSystemPrompt = opts?.requestOptions?.systemPrompt ?? config.systemPrompt
    const effectiveModel = opts?.requestOptions?.model ?? config.model
    const effectivePermissionMode =
      opts?.requestOptions?.permissionMode ?? config.permissionMode ?? "bypassPermissions"
    const mcpServers = this.buildAcpMcpServers()

    const _meta: Record<string, any> = {}
    if (effectiveSystemPrompt) _meta.systemPrompt = effectiveSystemPrompt
    _meta.claudeCode = {
      options: {
        model: effectiveModel,
        maxTurns: opts?.requestOptions?.maxTurns ?? config.maxTurns,
        ...(config.maxBudgetUsd && {
          maxBudgetUsd: opts?.requestOptions?.maxBudgetUsd ?? config.maxBudgetUsd,
        }),
        ...(opts?.requestOptions?.disallowedTools && {
          disallowedTools: opts.requestOptions.disallowedTools,
        }),
        settingSources: ["user", "project"],
        ...(opts?.resume && { resume: opts.resume }),
      },
    }

    const result = await this.sendRequest("session/new", {
      cwd: this.getWorkdir(),
      mcpServers,
      _meta,
    })

    this.sessionId = result.sessionId
    await this.setSessionModeIfSupported(this.sessionId!, effectivePermissionMode)
    console.log(`[ACP] Session created: ${this.sessionId}`)
    return this.sessionId!
  }

  /**
   * Send a prompt and forward all stdout activity to the given stream until
   * the prompt response arrives (or the process exits).
   */
  async sendPrompt(sessionId: string, message: string, streamId: string): Promise<void> {
    if (!this.alive || !this.process) {
      throw new Error("ACP bridge is not alive")
    }
    this.activeStreamId = streamId
    this.batchSeq = 0
    this.pendingMessages = []
    this.startFlushTimer()

    try {
      await this.sendRequest("session/prompt", {
        sessionId,
        prompt: [{ type: "text", text: message }],
      })
      // Publish a final `done` envelope so the relay closes the stream.
      this.pendingMessages.push({ type: "done" })
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error)
      this.pendingMessages.push({ type: "error", error: msg })
      throw error
    } finally {
      this.flushBatch()
      this.stopFlushTimer()
      this.activeStreamId = null
    }
  }

  getSessionId(): string | null {
    return this.sessionId
  }

  isAlive(): boolean {
    return this.alive
  }

  destroy(): void {
    this.stopFlushTimer()
    if (this.process) {
      this.process.kill("SIGTERM")
      setTimeout(() => {
        if (this.process && !this.process.killed) {
          this.process.kill("SIGKILL")
        }
      }, 2000)
    }
    this.alive = false
    this.sessionId = null
    this.activeStreamId = null
    this.supportsSessionMode = false
  }

  // ─── Stdout handling ────────────────────────────────────────────

  private handleStdoutChunk(chunk: Buffer): void {
    this.stdoutBuffer += chunk.toString()
    const lines = this.stdoutBuffer.split("\n")
    this.stdoutBuffer = lines.pop() || ""

    for (const rawLine of lines) {
      const line = rawLine.trim()
      if (!line) continue

      let msg: any
      try {
        msg = JSON.parse(line)
      } catch {
        // Non-JSON output (shell noise, diagnostics) — ignore
        continue
      }

      // JSON-RPC response: resolve pending request
      if (msg.id !== undefined && (msg.result !== undefined || msg.error !== undefined)) {
        const pending = this.pendingRequests.get(msg.id)
        if (pending) {
          this.pendingRequests.delete(msg.id)
          if (msg.error) {
            pending.reject(new Error(`ACP error [${msg.error.code}]: ${msg.error.message}`))
          } else {
            pending.resolve(msg.result)
          }
        }
      }

      // If we have an active stream, forward every parseable message to it
      if (this.activeStreamId) {
        this.pendingMessages.push(msg)
      }
    }
  }

  // ─── JSON-RPC request dispatch ─────────────────────────────────

  private sendRequest(method: string, params?: unknown): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.process || !this.alive) {
        reject(new Error("ACP process not running"))
        return
      }
      const id = ++this.requestId
      const request: JsonRpcRequest = {
        jsonrpc: "2.0",
        id,
        method,
        ...(params !== undefined && { params }),
      }
      this.pendingRequests.set(id, { resolve, reject })
      this.process.stdin!.write(JSON.stringify(request) + "\n")
    })
  }

  private async setSessionModeIfSupported(sessionId: string, modeId: string): Promise<void> {
    if (!this.supportsSessionMode) return

    await this.sendRequest("session/set_mode", {
      sessionId,
      modeId,
    })
  }

  private rejectAllPending(error: Error): void {
    for (const [, pending] of this.pendingRequests) pending.reject(error)
    this.pendingRequests.clear()
  }

  // ─── Publish batching ──────────────────────────────────────────

  private startFlushTimer(): void {
    if (this.flushTimer) return
    this.flushTimer = setInterval(() => this.flushBatch(), FLUSH_INTERVAL_MS)
  }

  private stopFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
      this.flushTimer = null
    }
  }

  private flushBatch(): void {
    if (!this.activeStreamId || this.pendingMessages.length === 0) return
    const messages = this.pendingMessages
    this.pendingMessages = []
    const batch = { type: "batch", seq: this.batchSeq++, messages }
    publish(this.activeStreamId, batch).catch((err) => {
      console.error("[ACP] Failed to publish batch:", err)
    })
  }

  private publishErrorAndDone(error: string): void {
    if (!this.activeStreamId) return
    this.pendingMessages.push({ type: "error", error })
    this.pendingMessages.push({ type: "done" })
    this.flushBatch()
  }

  // ─── Process setup helpers ─────────────────────────────────────

  private spawnMoatProcess(
    env: Record<string, string | undefined>,
    binary: string,
  ): ChildProcess {
    const state = this.loadMoatState()

    try {
      execFileSync("chown", ["-R", WORKSPACE_OWNER, WORKSPACE_HOST_DIR], {
        cwd: "/home/user/runtime",
        stdio: "ignore",
      })
    } catch {
      throw new Error(`Failed to set ${WORKSPACE_HOST_DIR} ownership`)
    }

    const mcpServersJson = JSON.stringify(buildClaudeMcpServers())
    const envFlags = this.buildExecEnvFlags(env, mcpServersJson)
    const entryScript = this.buildMoatEntryScript()

    return spawn(
      DOCKER_CLI,
      [
        "exec", "-i",
        "-u", "moatuser",
        "-w", MOAT_WORKDIR,
        ...envFlags,
        state.containerId,
        "sh", "-c", entryScript,
        binary,
      ],
      {
        cwd: "/home/user/runtime",
        env: { ...process.env, HOME: "/home/user" },
        stdio: ["pipe", "pipe", "inherit"],
      },
    )
  }

  private spawnDirectProcess(
    env: Record<string, string | undefined>,
    binary: string,
  ): ChildProcess {
    const mcpServers = buildClaudeMcpServers({ host: "127.0.0.1" })
    this.writeClaudeConfig(DIRECT_HOME, DIRECT_WORKDIR, mcpServers)

    return spawn(binary, [], {
      cwd: DIRECT_WORKDIR,
      env: {
        ...process.env,
        ...env,
        HOME: DIRECT_HOME,
        IS_SANDBOX: env.IS_SANDBOX ?? process.env.IS_SANDBOX ?? "1",
      },
      stdio: ["pipe", "pipe", "inherit"],
    })
  }

  private writeClaudeConfig(
    home: string,
    projectDir: string,
    mcpServers: ReturnType<typeof buildClaudeMcpServers>,
  ) {
    mkdirSync(home, { recursive: true })

    const path = `${home}/.claude.json`
    let config: Record<string, unknown> = {}
    if (existsSync(path)) {
      try {
        const parsed = JSON.parse(readFileSync(path, "utf8"))
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
      projects[projectDir] && typeof projects[projectDir] === "object" && !Array.isArray(projects[projectDir])
        ? { ...(projects[projectDir] as Record<string, unknown>) }
        : {}

    project.hasTrustDialogAccepted = true
    projects[projectDir] = project
    config.projects = projects

    writeFileSync(path, JSON.stringify(config, null, 2) + "\n")
  }

  private loadMoatState(): PersistentMoatState {
    if (!existsSync(PERSISTENT_MOAT_STATE_PATH)) {
      throw new Error(`Persistent Moat state is missing at ${PERSISTENT_MOAT_STATE_PATH}`)
    }
    return JSON.parse(readFileSync(PERSISTENT_MOAT_STATE_PATH, "utf8"))
  }

  private buildExecEnvFlags(
    env: Record<string, string | undefined>,
    mcpServersJson: string,
  ): string[] {
    const flags: string[] = []
    for (const [envName, moatEnvName] of Object.entries(MOAT_PASSTHROUGH_ENV_MAP)) {
      const value = env[envName]
      if (!value) continue
      flags.push("-e", `${moatEnvName}=${value}`)
    }
    flags.push("-e", "HOME=/home/moatuser")
    flags.push("-e", `IS_SANDBOX=${env.IS_SANDBOX ?? process.env.IS_SANDBOX ?? "1"}`)
    flags.push("-e", `AGENTS_MCP_SERVERS_JSON=${mcpServersJson}`)
    return flags
  }

  private buildMoatEntryScript(): string {
    return [
      'if [ -n "${AGENTS_CLAUDE_CODE_OAUTH_TOKEN:-}" ]; then',
      '  export CLAUDE_CODE_OAUTH_TOKEN="$AGENTS_CLAUDE_CODE_OAUTH_TOKEN"',
      "  unset ANTHROPIC_API_KEY ANTHROPIC_BASE_URL CLAUDE_API_KEY",
      "fi",
      'if [ -n "${AGENTS_ANTHROPIC_API_KEY:-}" ]; then export ANTHROPIC_API_KEY="$AGENTS_ANTHROPIC_API_KEY"; fi',
      'if [ -n "${AGENTS_CLAUDE_API_KEY:-}" ]; then export CLAUDE_API_KEY="$AGENTS_CLAUDE_API_KEY"; fi',
      'if [ -n "${AGENTS_ANTHROPIC_BASE_URL:-}" ]; then export ANTHROPIC_BASE_URL="$AGENTS_ANTHROPIC_BASE_URL"; fi',
      // OpenAI env vars — re-export with canonical names so codex-acp's
      // openai-api-key auth method finds them. Mirror of the Anthropic pair.
      'if [ -n "${AGENTS_OPENAI_API_KEY:-}" ]; then export OPENAI_API_KEY="$AGENTS_OPENAI_API_KEY"; fi',
      'if [ -n "${AGENTS_OPENAI_BASE_URL:-}" ]; then export OPENAI_BASE_URL="$AGENTS_OPENAI_BASE_URL"; fi',
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

  private getWorkdir() {
    return isMoatEnabled() ? MOAT_WORKDIR : DIRECT_WORKDIR
  }

  private buildAcpMcpServers(): Array<{
    name: string
    type: "http"
    url: string
    headers: Array<{ name: string; value: string }>
  }> {
    const claudeMcpServers = buildClaudeMcpServers(
      isMoatEnabled() ? undefined : { host: "127.0.0.1" },
    )
    return Object.entries(claudeMcpServers).map(([name, server]) => ({
      name,
      type: "http",
      url: server.url,
      headers: [],
    }))
  }
}
