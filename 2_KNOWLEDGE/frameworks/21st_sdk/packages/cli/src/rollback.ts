import * as p from "@clack/prompts"
import { requireAuth, requireAgentSlug, requestJson } from "./api.js"

type RollbackResponse = {
  slug: string
  version: number
  deploymentId: string
  message: string
}

export async function rollback(args: string[]) {
  const apiKey = requireAuth()
  const agentSlug = requireAgentSlug(args, "rollback <agent-slug> [version]")
  const jsonOutput = args.includes("--json")

  // Version is the next positional arg after slug (args[0])
  const versionArg = args[1] && !args[1].startsWith("-") ? args[1] : undefined
  let version: number | undefined

  if (versionArg) {
    if (!/^\d+$/.test(versionArg)) {
      p.log.error("Version must be a positive integer.")
      process.exit(1)
    }
    version = Number.parseInt(versionArg, 10)
    if (version < 1) {
      p.log.error("Version must be a positive integer.")
      process.exit(1)
    }
  }

  const spinner = p.spinner()

  try {
    if (!jsonOutput) {
      spinner.start(
        version
          ? `Rolling back ${agentSlug} to v${version}...`
          : `Rolling back ${agentSlug} to previous version...`,
      )
    }

    const data = await requestJson<RollbackResponse>(
      apiKey,
      `/agents/${encodeURIComponent(agentSlug)}/rollback`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version }),
      },
      "Failed to rollback",
    )

    if (!jsonOutput) {
      spinner.stop(`Rolled back ${agentSlug} to v${data.version}`)
    }

    if (jsonOutput) {
      console.log(JSON.stringify(data, null, 2))
    }
  } catch (err: any) {
    const message = err instanceof Error ? err.message : String(err)
    if (jsonOutput) {
      console.error(JSON.stringify({ error: message }))
    } else {
      spinner.stop(`Failed to rollback ${agentSlug}`)
      p.log.error(message)
    }
    process.exit(1)
  }
}
