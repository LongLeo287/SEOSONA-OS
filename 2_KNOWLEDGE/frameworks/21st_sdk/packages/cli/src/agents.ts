import * as p from "@clack/prompts"
import { requireAuth, requireAgentSlug, requestJson } from "./api.js"
import { formatTimestamp, formatCell } from "./utils.js"
import { isInteractive } from "./detect.js"

type AgentSummary = {
  id: string
  name: string
  slug: string
  runtime: string
  deployedAt: string | null
  createdAt: string
  updatedAt: string
  activeVersion: number | null
  activeDeploymentStatus: string | null
}

type AgentDetail = AgentSummary & {
  model: string | null
  totalDeployments: number
}

type AgentsListResponse = {
  agents: AgentSummary[]
}

export async function agentsList(args: string[]) {
  const apiKey = requireAuth()
  const jsonOutput = args.includes("--json")
  const spinner = p.spinner()

  try {
    if (!jsonOutput) {
      spinner.start("Fetching agents...")
    }

    const data = await requestJson<AgentsListResponse>(
      apiKey,
      "/agents",
      { method: "GET" },
      "Failed to fetch agents",
    )

    if (!jsonOutput) {
      spinner.stop("Fetched agents")
    }

    if (jsonOutput) {
      console.log(JSON.stringify(data, null, 2))
      return
    }

    if (!data?.agents || data.agents.length === 0) {
      p.log.info("No agents found.")
      return
    }

    console.log()
    console.log(
      [
        formatCell("Slug", 24),
        formatCell("Runtime", 14),
        formatCell("Version", 10),
        formatCell("Status", 10),
        formatCell("Deployed", 19),
      ].join("  "),
    )

    for (const agent of data.agents) {
      const ver = agent.activeVersion != null ? `v${agent.activeVersion}` : "-"
      const status = agent.activeDeploymentStatus ?? "-"
      console.log(
        [
          formatCell(agent.slug, 24),
          formatCell(agent.runtime, 14),
          formatCell(ver, 10),
          formatCell(status, 10),
          formatCell(formatTimestamp(agent.deployedAt), 19),
        ].join("  "),
      )
    }

    console.log()
    p.log.info(`${data.agents.length} agent${data.agents.length !== 1 ? "s" : ""}`)
  } catch (err: any) {
    const message = err instanceof Error ? err.message : String(err)
    if (jsonOutput) {
      console.error(JSON.stringify({ error: message }))
    } else {
      spinner.stop("Failed to fetch agents")
      p.log.error(message)
    }
    process.exit(1)
  }
}

export async function agentsGet(args: string[]) {
  const apiKey = requireAuth()
  const agentSlug = requireAgentSlug(args, "agents get <agent-slug>")
  const jsonOutput = args.includes("--json")
  const spinner = p.spinner()

  try {
    if (!jsonOutput) {
      spinner.start(`Fetching agent ${agentSlug}...`)
    }

    const data = await requestJson<AgentDetail>(
      apiKey,
      `/agents/${encodeURIComponent(agentSlug)}`,
      { method: "GET" },
      "Failed to fetch agent",
    )

    if (!jsonOutput) {
      spinner.stop(`Fetched agent ${agentSlug}`)
    }

    if (jsonOutput) {
      console.log(JSON.stringify(data, null, 2))
      return
    }

    console.log()
    console.log(`  Slug:        ${data.slug}`)
    console.log(`  Name:        ${data.name}`)
    console.log(`  Runtime:     ${data.runtime}`)
    console.log(`  Model:       ${data.model ?? "-"}`)
    console.log(`  Version:     ${data.activeVersion != null ? `v${data.activeVersion}` : "-"}`)
    console.log(`  Status:      ${data.activeDeploymentStatus ?? "-"}`)
    console.log(`  Deployments: ${data.totalDeployments}`)
    console.log(`  Created:     ${formatTimestamp(data.createdAt)}`)
    console.log(`  Deployed:    ${formatTimestamp(data.deployedAt)}`)
    console.log()
  } catch (err: any) {
    const message = err instanceof Error ? err.message : String(err)
    if (jsonOutput) {
      console.error(JSON.stringify({ error: message }))
    } else {
      spinner.stop(`Failed to fetch agent ${agentSlug}`)
      p.log.error(message)
    }
    process.exit(1)
  }
}

export async function agentsDelete(args: string[]) {
  const apiKey = requireAuth()
  const agentSlug = requireAgentSlug(args, "agents delete <agent-slug>")
  const jsonOutput = args.includes("--json")
  const forceDelete = args.includes("--force") || args.includes("-f")
  const spinner = p.spinner()

  if (!jsonOutput && !forceDelete && isInteractive()) {
    const confirmed = await p.confirm({
      message: `Delete agent "${agentSlug}" and all its deployments? This cannot be undone.`,
    })
    if (p.isCancel(confirmed) || !confirmed) {
      p.cancel("Cancelled.")
      process.exit(0)
    }
  }

  try {
    if (!jsonOutput) {
      spinner.start(`Deleting agent ${agentSlug}...`)
    }

    const data = await requestJson<{ success: boolean; slug: string; message: string }>(
      apiKey,
      `/agents/${encodeURIComponent(agentSlug)}`,
      { method: "DELETE" },
      "Failed to delete agent",
    )

    if (jsonOutput) {
      console.log(JSON.stringify(data, null, 2))
    } else {
      spinner.stop(data.message ?? `Deleted agent ${agentSlug}`)
    }
  } catch (err: any) {
    const message = err instanceof Error ? err.message : String(err)
    if (jsonOutput) {
      console.error(JSON.stringify({ error: message }))
    } else {
      spinner.stop(`Failed to delete agent ${agentSlug}`)
      p.log.error(message)
    }
    process.exit(1)
  }
}
