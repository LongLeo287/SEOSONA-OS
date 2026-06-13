export { createSandbox, type SandboxProvider } from "./sandbox-provider"
export type { SandboxProviderSettings, SandboxProviderOptions } from "./types"

/**
 * Legacy Claude-SDK → AI SDK transformer. Used when the sandbox publishes
 * Claude Agent SDK-shaped messages (`system`, `assistant`, `stream_event`,
 * `result`). Selected at the relay when the stream's `streamId` has no
 * `acp:` prefix — i.e., it came from a legacy sandbox template.
 */
export { createStreamTransformer } from "./sandbox-stream-transformer"

/**
 * ACP (Agent Client Protocol) → AI SDK transformer. Used when the sandbox
 * publishes raw ACP JSON-RPC messages (JSON-RPC over stdio from
 * `claude-agent-acp` or a compatible process). Selected at the relay when
 * the stream's `streamId` starts with `acp:`, which is how ACP-capable
 * sandbox templates announce themselves. Supports an optional `onSpan`
 * callback that receives tracing spans generated from ACP tool events.
 */
export {
  createAcpStreamTransformer,
  type SpanJSON as AcpSpanJSON,
  type SpanMessage as AcpSpanMessage,
  type AcpTransformerOptions,
} from "./acp-stream-transformer"
export {
  buildLegacyMcpConfigFromServers,
  defaultMcpCredentialInjectRule,
  extractHttpMcpServersFromLegacyConfig,
  getMcpServerHostPattern,
  normalizeAgentMcpServers,
  normalizeMcpServerUrl,
  normalizeVaultCredentialInjectRule,
  redactCredentialPayload,
  type HttpAgentMcpServer,
  type McpCredentialAuthType,
  type McpCredentialPayload,
  type VaultCredentialInjectRule,
} from "./mcp"
