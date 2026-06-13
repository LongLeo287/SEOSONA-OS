import {
  buildLegacyMcpConfigFromServers,
  extractHttpMcpServersFromLegacyConfig,
  normalizeAgentMcpServers,
} from "@repo/sandbox-provider"

type DeployMetadata = {
  mcpServers?: Array<{ name: string; url: string }>
  vaultIds?: string[]
  [key: string]: unknown
}

function validationError(message: string) {
  return {
    status: 400,
    error: "validation_error",
    message,
  }
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer
}

function createMcpConfigFromServers(
  servers: Array<{ name: string; url: string }>,
): ArrayBuffer {
  return toArrayBuffer(
    new TextEncoder().encode(
      JSON.stringify(buildLegacyMcpConfigFromServers(servers), null, 2),
    ),
  )
}

export function resolveDeployMcpMetadata(params: {
  metadata?: DeployMetadata
  mcpConfig?: ArrayBuffer
}) {
  const { metadata, mcpConfig } = params
  const legacyMcpServers = mcpConfig
    ? extractHttpMcpServersFromLegacyConfig(
        JSON.parse(Buffer.from(mcpConfig).toString("utf8")),
      )
    : []
  const inlineMcpServers = normalizeAgentMcpServers(metadata?.mcpServers ?? [])
  if (mcpConfig && inlineMcpServers.length > 0) {
    throw validationError(
      "Agent defines MCP servers both inline and via sibling .mcp.json. Keep only one.",
    )
  }

  const runtimeMcpServers =
    inlineMcpServers.length > 0 ? inlineMcpServers : legacyMcpServers
  const effectiveMcpConfig =
    mcpConfig ??
    (inlineMcpServers.length > 0
      ? createMcpConfigFromServers(inlineMcpServers)
      : undefined)
  const baseDeploymentMetadata: Record<string, unknown> = {
    ...(metadata ?? {}),
    ...(runtimeMcpServers.length > 0 ? { mcpServers: runtimeMcpServers } : {}),
    ...(metadata?.vaultIds ? { vaultIds: metadata.vaultIds } : {}),
  }

  return {
    runtimeMcpServers,
    effectiveMcpConfig,
    baseDeploymentMetadata,
  }
}
