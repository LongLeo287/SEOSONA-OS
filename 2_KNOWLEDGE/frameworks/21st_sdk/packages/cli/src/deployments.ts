import * as p from "@clack/prompts"
import { requireAuth, requireAgentSlug, requestJson } from "./api.js"
import { formatTimestamp, formatCell } from "./utils.js"

type Deployment = {
  id: string
  version: number
  status: string
  isActive: boolean
  deployedAt: string | null
  completedAt: string | null
  error: string | null
  metadata: {
    model?: string
    tools?: { name: string }[]
  } | null
}

type DeploymentsResponse = {
  deployments: Deployment[]
}

export async function deployments(args: string[]) {
  const apiKey = requireAuth()
  const agentSlug = requireAgentSlug(args, "deployments <agent-slug>")
  const jsonOutput = args.includes("--json")
  const spinner = p.spinner()

  try {
    if (!jsonOutput) {
      spinner.start(`Fetching deployments for ${agentSlug}...`)
    }

    const data = await requestJson<DeploymentsResponse>(
      apiKey,
      `/agents/${encodeURIComponent(agentSlug)}/deployments`,
      { method: "GET" },
      "Failed to fetch deployments",
    )

    if (!jsonOutput) {
      spinner.stop(`Fetched deployments for ${agentSlug}`)
    }

    if (jsonOutput) {
      console.log(JSON.stringify(data, null, 2))
      return
    }

    if (!data?.deployments || data.deployments.length === 0) {
      p.log.info("No deployments found.")
      return
    }

    console.log()
    console.log(
      [
        formatCell("Version", 16),
        formatCell("Status", 10),
        formatCell("Deployed", 19),
        formatCell("Model", 24),
      ].join("  "),
    )

    for (const dep of data.deployments) {
      const marker = dep.isActive ? " (active)" : ""
      const model = dep.metadata?.model ?? "-"
      console.log(
        [
          formatCell(`v${dep.version}${marker}`, 16),
          formatCell(dep.status, 10),
          formatCell(formatTimestamp(dep.deployedAt), 19),
          formatCell(model, 24),
        ].join("  "),
      )
    }

    console.log()
    p.log.info(`${data.deployments.length} deployment${data.deployments.length !== 1 ? "s" : ""}`)
  } catch (err: any) {
    const message = err instanceof Error ? err.message : String(err)
    if (jsonOutput) {
      console.error(JSON.stringify({ error: message }))
    } else {
      spinner.stop(`Failed to fetch deployments for ${agentSlug}`)
      p.log.error(message)
    }
    process.exit(1)
  }
}
