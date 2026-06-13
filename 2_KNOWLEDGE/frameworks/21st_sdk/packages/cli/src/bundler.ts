import esbuild from "esbuild"
import { validateSlug } from "./utils.js"

export type AgentEntryPoint = {
  slug: string
  entryPoint: string
  language: "js" | "go"
}

export async function findAgentEntryPoints(): Promise<AgentEntryPoint[]> {
  const { existsSync, readdirSync, statSync } = await import("fs")
  const { join, basename, extname } = await import("path")

  if (!existsSync("agents") || !statSync("agents").isDirectory()) {
    throw new Error(
      "No agents/ directory found. See https://21st.dev/agents/docs to get started.",
    )
  }

  const entries: AgentEntryPoint[] = []
  const items = readdirSync("agents")

  for (const item of items) {
    const fullPath = join("agents", item)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      const indexFiles = ["index.ts", "index.js", "index.go"].filter(
        (filename) => existsSync(join(fullPath, filename)),
      )

      if (indexFiles.length > 1) {
        throw new Error(
          `Agent "${item}" has multiple entrypoints (${indexFiles.join(", ")}). Keep exactly one.`,
        )
      }

      if (indexFiles.length === 1) {
        const indexFile = indexFiles[0]!
        const slugError = validateSlug(item)
        if (slugError) {
          throw new Error(
            `Invalid agent slug "${item}" from ${fullPath}: ${slugError}`,
          )
        }
        entries.push({
          slug: item,
          entryPoint: join(fullPath, indexFile),
          language: indexFile === "index.go" ? "go" : "js",
        })
      }
    } else if (stat.isFile()) {
      const ext = extname(item)
      if (ext === ".ts" || ext === ".js") {
        const slug = basename(item, ext)
        const slugError = validateSlug(slug)
        if (slugError) {
          throw new Error(
            `Invalid agent slug "${slug}" from ${fullPath}: ${slugError}`,
          )
        }
        entries.push({ slug, entryPoint: fullPath, language: "js" })
      }
    }
  }

  if (entries.length === 0) {
    throw new Error(
      "No agents found in agents/ directory. See https://21st.dev/agents/docs to get started.",
    )
  }

  return entries
}

export async function bundleAgent(entryPoint: string): Promise<Buffer> {
  const result = await esbuild.build({
    entryPoints: [entryPoint],
    bundle: true,
    platform: "node",
    target: "node22",
    format: "esm",
    write: false,
    external: ["@21st-sdk/agent"],
    minify: true,
    sourcemap: false,
  })

  if (result.errors.length > 0) {
    throw new Error(
      `Bundle failed:\n${result.errors.map((e) => e.text).join("\n")}`,
    )
  }

  return Buffer.from(result.outputFiles[0].contents)
}

async function createArchiveFromDirectory(sourceDir: string): Promise<Buffer> {
  const { readFileSync, readdirSync } = await import("fs")
  const { tmpdir } = await import("os")
  const { join } = await import("path")
  const { create: tarCreate } = await import("tar")
  const { mkdtempSync, rmSync } = await import("fs")

  const tempDir = mkdtempSync(join(tmpdir(), "agent-template-"))
  const archivePath = join(tempDir, "template.tar.gz")

  try {
    const entries = readdirSync(sourceDir)
    await tarCreate(
      {
        cwd: sourceDir,
        file: archivePath,
        gzip: true,
        portable: true,
      },
      entries,
    )

    return readFileSync(archivePath)
  } finally {
    rmSync(tempDir, { recursive: true, force: true })
  }
}

export async function createTemplateArchive(
  entryPoint: string,
): Promise<Buffer | null> {
  const { existsSync, statSync } = await import("fs")
  const { basename, dirname, join } = await import("path")

  if (!["index.ts", "index.js"].includes(basename(entryPoint))) {
    return null
  }

  const templateDir = join(dirname(entryPoint), "template")
  if (!existsSync(templateDir) || !statSync(templateDir).isDirectory()) {
    return null
  }

  return createArchiveFromDirectory(templateDir)
}

export async function readSiblingMcpConfig(
  entryPoint: string,
): Promise<Buffer | null> {
  const { existsSync, readFileSync } = await import("fs")
  const { dirname, join } = await import("path")

  const mcpConfigPath = join(dirname(entryPoint), ".mcp.json")
  if (!existsSync(mcpConfigPath)) {
    return null
  }

  const content = readFileSync(mcpConfigPath, "utf8")
  JSON.parse(content)

  return Buffer.from(content)
}

async function importBundle(
  bundle: Buffer,
): Promise<Record<string, unknown> | null> {
  const { writeFileSync, unlinkSync, mkdirSync } = await import("fs")
  const { join } = await import("path")

  // Write to .an-tmp/ in cwd so ESM can resolve @21st-sdk/agent from node_modules
  const tmpDir = join(process.cwd(), ".an-tmp")
  mkdirSync(tmpDir, { recursive: true })
  const tmpPath = join(tmpDir, `an-bundle-${Date.now()}.mjs`)
  try {
    writeFileSync(tmpPath, bundle)
    const mod = await import(tmpPath)
    const config = mod.default
    if (config?._type === "agent") return config
    return null
  } catch {
    return null
  } finally {
    try {
      unlinkSync(tmpPath)
    } catch {}
    try {
      const { rmdirSync } = await import("fs")
      rmdirSync(tmpDir)
    } catch {}
  }
}

export async function extractSandboxConfig(
  bundle: Buffer,
): Promise<Record<string, unknown> | null> {
  const config = await importBundle(bundle)
  if (!config) return null
  const sandbox = config.sandbox as Record<string, unknown> | undefined
  if (sandbox && (sandbox as any)._type === "sandbox") {
    const { _type, ...sandboxConfig } = sandbox
    return sandboxConfig
  }
  return null
}

export type AgentMetadata = {
  model: string
  systemPrompt?: string | { type: string; preset: string; append?: string }
  permissionMode: string
  maxTurns: number
  maxBudgetUsd?: number
  mcpServers?: Array<{ name: string; url: string }>
  vaultIds?: string[]
  maxSandboxBudgetUsd?: number
  tools: { name: string; description: string }[]
  hooks: string[]
  sandbox?: {
    cpuCount?: number
    memoryMB?: number
    apt?: string[]
    build?: string[]
    setup?: string[]
    cwd?: string
    timeoutMs?: number
    networkAllowOut?: string[]
    networkDenyOut?: string[]
  }
}

const HOOK_NAMES = [
  "onStart",
  "onToolCall",
  "onToolResult",
  "onStepFinish",
  "onFinish",
  "onError",
]

const UUID_V4_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

class AgentMetadataValidationError extends Error {}

function normalizeVaultIds(raw: unknown): string[] | undefined {
  if (raw === undefined) return undefined
  if (!Array.isArray(raw)) {
    throw new AgentMetadataValidationError("vaultIds must be an array")
  }

  const seen = new Set<string>()
  const vaultIds: string[] = []
  for (const value of raw) {
    if (typeof value !== "string" || !UUID_V4_RE.test(value)) {
      throw new AgentMetadataValidationError(
        `Invalid vaultIds entry "${String(value)}"; expected a v4 UUID`,
      )
    }
    if (seen.has(value)) continue
    seen.add(value)
    vaultIds.push(value)
  }
  return vaultIds
}

export async function extractAgentMetadata(
  bundle: Buffer,
): Promise<AgentMetadata | null> {
  try {
    const config = await importBundle(bundle)
    if (!config) return null

    const tools: { name: string; description: string }[] = []
    if (config.tools && typeof config.tools === "object") {
      for (const [name, def] of Object.entries(
        config.tools as Record<string, any>,
      )) {
        tools.push({ name, description: def?.description ?? "" })
      }
    }

    const hooks = HOOK_NAMES.filter(
      (h) => typeof (config as any)[h] === "function",
    )

    const metadata: AgentMetadata = {
      model: (config.model as string) ?? "unknown",
      permissionMode: (config.permissionMode as string) ?? "default",
      maxTurns: (config.maxTurns as number) ?? 50,
      tools,
      hooks,
    }

    if (config.systemPrompt !== undefined) {
      metadata.systemPrompt =
        config.systemPrompt as AgentMetadata["systemPrompt"]
    }
    if (config.maxBudgetUsd !== undefined) {
      metadata.maxBudgetUsd = config.maxBudgetUsd as number
    }
    if (config.maxSandboxBudgetUsd !== undefined) {
      metadata.maxSandboxBudgetUsd = config.maxSandboxBudgetUsd as number
    }
    const vaultIds = normalizeVaultIds((config as any).vaultIds)
    if (vaultIds !== undefined) {
      metadata.vaultIds = vaultIds
    }
    if (Array.isArray((config as any).mcpServers)) {
      metadata.mcpServers = (config as any).mcpServers
        .filter(
          (entry: unknown) =>
            !!entry &&
            typeof entry === "object" &&
            typeof (entry as { name?: unknown }).name === "string" &&
            typeof (entry as { url?: unknown }).url === "string",
        )
        .map((entry: any) => ({
          name: entry.name,
          url: entry.url,
        }))
    }

    const sandbox = config.sandbox as Record<string, unknown> | undefined
    if (sandbox && (sandbox as any)._type === "sandbox") {
      metadata.sandbox = {}
      if (sandbox.cpuCount !== undefined)
        metadata.sandbox.cpuCount = sandbox.cpuCount as number
      if (sandbox.memoryMB !== undefined)
        metadata.sandbox.memoryMB = sandbox.memoryMB as number
      if (sandbox.apt) metadata.sandbox.apt = sandbox.apt as string[]
      if (sandbox.build) metadata.sandbox.build = sandbox.build as string[]
      if (sandbox.setup) metadata.sandbox.setup = sandbox.setup as string[]
      if (sandbox.cwd) metadata.sandbox.cwd = sandbox.cwd as string
      if (sandbox.timeoutMs !== undefined)
        metadata.sandbox.timeoutMs = sandbox.timeoutMs as number
      if (sandbox.networkAllowOut !== undefined)
        metadata.sandbox.networkAllowOut = sandbox.networkAllowOut as string[]
      if (sandbox.networkDenyOut !== undefined)
        metadata.sandbox.networkDenyOut = sandbox.networkDenyOut as string[]
    }

    return metadata
  } catch (error) {
    if (error instanceof AgentMetadataValidationError) {
      throw error
    }
    return null
  }
}
