import { getApiBaseUrl, getApiKey, getAppBaseUrl } from "./config.js"
import {
  findAgentEntryPoints,
  bundleAgent,
  createTemplateArchive,
  extractSandboxConfig,
  extractAgentMetadata,
  readSiblingMcpConfig,
} from "./bundler.js"
import { buildGoAgent } from "./go-bundler.js"
import { existsSync } from "fs"
import { join } from "path"
import * as p from "@clack/prompts"
import { validateSlug } from "./utils.js"

const API_BASE = getApiBaseUrl()
const AN_BASE = getAppBaseUrl()
const NDJSON_CONTENT_TYPE = "application/x-ndjson"

export function hasMcpConfigConflict(
  mcpConfig: Buffer | null,
  metadata: { mcpServers?: Array<unknown> } | null | undefined,
) {
  return Boolean(mcpConfig && metadata?.mcpServers && metadata.mcpServers.length > 0)
}

function getFlag(flag: string): string | undefined {
  const argv = process.argv
  const idx = argv.indexOf(flag)
  if (idx === -1 || idx + 1 >= argv.length) return undefined
  const val = argv[idx + 1]?.trim()
  return val && val.length > 0 ? val : undefined
}

type DeployEvent =
  | { type: "status"; message: string }
  | {
      type: "result"
      result: {
        slug: string
        agentId: string
        bundleUrl: string
        deployedAt: string
        version: number
        deploymentId: string
      }
    }
  | { type: "error"; message: string }

async function readDeployStream(
  response: Response,
  spinner: ReturnType<typeof p.spinner>,
): Promise<Extract<DeployEvent, { type: "result" }>["result"]> {
  if (!response.body) {
    throw new Error("Deploy response did not include a stream")
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ""
  let result: Extract<DeployEvent, { type: "result" }>["result"] | null = null

  const handleLine = (line: string) => {
    let event: DeployEvent
    try {
      event = JSON.parse(line) as DeployEvent
    } catch {
      throw new Error(`Invalid deploy stream response: ${line}`)
    }

    if (event.type === "status") {
      spinner.message(event.message)
      return
    }

    if (event.type === "error") {
      throw new Error(event.message)
    }

    result = event.result
  }

  while (true) {
    const { done, value } = await reader.read()
    buffer += decoder.decode(value ?? new Uint8Array(), { stream: !done })

    let newlineIndex = buffer.indexOf("\n")
    while (newlineIndex !== -1) {
      const line = buffer.slice(0, newlineIndex).trim()
      buffer = buffer.slice(newlineIndex + 1)
      if (line) handleLine(line)
      newlineIndex = buffer.indexOf("\n")
    }

    if (done) break
  }

  const tail = buffer.trim()
  if (tail) handleLine(tail)

  if (!result) {
    throw new Error("Deploy stream ended without a result")
  }

  return result
}

async function readErrorMessage(response: Response): Promise<string> {
  const errorText = await response.text().catch(() => "")
  if (!errorText) {
    return `Deploy failed (${response.status})`
  }

  try {
    const parsed = JSON.parse(errorText) as { message?: string }
    if (typeof parsed.message === "string" && parsed.message.length > 0) {
      return parsed.message
    }
  } catch {}

  return errorText
}

export async function deploy() {
  p.intro("@21st-sdk/cli deploy")

  // 1. Check auth
  const apiKey = getApiKey()
  if (!apiKey) {
    p.log.error(
      "Not logged in. Run `npx @21st-sdk/cli login` first, or set API_KEY_21ST.",
    )
    process.exit(1)
  }

  // Deprecation notice for old project config
  if (existsSync(join(process.cwd(), ".an", "project.json"))) {
    p.log.warn(".an/project.json is no longer used and can be removed.")
  }

  // 2. Find agent entry points
  let agents
  try {
    agents = await findAgentEntryPoints()
  } catch (err: any) {
    p.log.error(err.message)
    process.exit(1)
  }

  const onlySlug = getFlag("--agent")
  if (onlySlug) {
    agents = agents.filter((a) => a.slug === onlySlug)
    if (agents.length === 0) {
      p.log.error(
        `No agent with slug "${onlySlug}" in ./agents/ (see npx @21st-sdk/cli deploy --help)`,
      )
      process.exit(1)
    }
  }

  const nameOverride = getFlag("--name")
  if (nameOverride) {
    const slugError = validateSlug(nameOverride)
    if (slugError) {
      p.log.error(`Invalid --name "${nameOverride}": ${slugError}`)
      process.exit(1)
    }
    if (agents.length > 1) {
      p.log.error(
        `--name can only be used when deploying a single agent. Use --agent to select one.`,
      )
      process.exit(1)
    }
  }

  p.log.info(`Found ${agents.length} agent${agents.length > 1 ? "s" : ""}`)

  // 3. Deploy each agent
  const deployed: { slug: string }[] = []

  for (const agent of agents) {
    const slug = nameOverride ?? agent.slug

    const s = p.spinner()
    s.start(`Bundling ${agent.slug}...`)
    const { bundle, templateArchive } =
      agent.language === "go"
        ? await buildGoAgent(agent.entryPoint)
        : {
            bundle: await bundleAgent(agent.entryPoint),
            templateArchive: await createTemplateArchive(agent.entryPoint),
          }
    const mcpConfig = await readSiblingMcpConfig(agent.entryPoint)
    const sandboxConfig = await extractSandboxConfig(bundle)
    const metadata = await extractAgentMetadata(bundle)

    if (hasMcpConfigConflict(mcpConfig, metadata)) {
      s.stop(`Bundled ${agent.slug}`)
      p.log.error(
        `Agent "${agent.slug}" defines MCP servers both inline and via sibling .mcp.json. Keep only one.`,
      )
      process.exit(1)
    }

    s.stop(`Bundled ${agent.slug} (${(bundle.length / 1024).toFixed(1)}kb)`)

    const s2 = p.spinner()
    s2.start(`Deploying ${slug}...`)
    const form = new FormData()
    form.set("slug", slug)
    form.set(
      "bundle",
      new File([bundle], "agent-bundle.js", {
        type: "application/javascript",
      }),
    )
    if (templateArchive) {
      form.set(
        "templateArchive",
        new File([templateArchive], "template.tar.gz", {
          type: "application/gzip",
        }),
      )
    }
    if (mcpConfig) {
      form.set(
        "mcpConfig",
        new File([mcpConfig], ".mcp.json", {
          type: "application/json",
        }),
      )
    }
    if (sandboxConfig) {
      form.set("sandboxConfig", JSON.stringify(sandboxConfig))
    }
    form.set("agentLanguage", agent.language)
    if (metadata) {
      form.set("metadata", JSON.stringify(metadata))
    }
    const res = await fetch(`${API_BASE}/agents/deploy`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: NDJSON_CONTENT_TYPE,
      },
      body: form,
    })

    if (!res.ok) {
      s2.stop(`Failed to deploy ${slug}`)
      p.log.error(await readErrorMessage(res))

      if (deployed.length > 0) {
        p.log.info(`\nDeployed before failure:`)
        for (const a of deployed) {
          p.log.info(`  ${a.slug}  →  ${AN_BASE}/agents`)
        }
      }
      process.exit(1)
    }

    let result: Awaited<ReturnType<typeof readDeployStream>>
    try {
      result = await readDeployStream(res, s2)
    } catch (err: any) {
      s2.stop(`Failed to deploy ${slug}`)
      p.log.error(err?.message || "Deploy failed")

      if (deployed.length > 0) {
        p.log.info(`\nDeployed before failure:`)
        for (const a of deployed) {
          p.log.info(`  ${a.slug}  →  ${AN_BASE}/agents`)
        }
      }
      process.exit(1)
    }
    deployed.push({ slug })
    const versionTag = result.version ? ` (v${result.version})` : ""
    s2.stop(`${slug} deployed${versionTag}`)
  }

  // 4. Output
  p.log.success(
    `Deployed ${deployed.length} agent${deployed.length > 1 ? "s" : ""}`,
  )
  console.log()
  for (const agent of deployed) {
    console.log(`  ${agent.slug}  →  ${AN_BASE}/agents`)
  }
  console.log()
  p.log.info("Next steps:")
  console.log("  · Open the link above to test your agent")
  console.log("  · Run `npx @21st-sdk/cli deploy` again after changes")
  console.log(`  · View all deployments: ${AN_BASE}/agents`)

  p.outro("Done")
}
