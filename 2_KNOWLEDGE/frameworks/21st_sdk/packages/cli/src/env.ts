import {
  requireAuth,
  requireAgentSlug,
  requestJson,
} from "./api.js"
import * as p from "@clack/prompts"

type EnvAssignment = {
  key: string
  value: string
}

const ENV_SET_USAGE = "npx @21st-sdk/cli env set <agent-slug> KEY VALUE"
const ENV_SET_MULTI_USAGE = "npx @21st-sdk/cli env set <agent-slug> KEY=VALUE [KEY=VALUE ...]"

async function fetchEnvKeys(apiKey: string, agentSlug: string): Promise<string[]> {
  const data = await requestJson<{ keys?: string[] }>(
    apiKey,
    `/agents/${encodeURIComponent(agentSlug)}/env`,
    { method: "GET" },
    "Failed to fetch env vars",
  )
  return data.keys ?? []
}

async function setEnvVar(apiKey: string, agentSlug: string, key: string, value: string): Promise<void> {
  await requestJson(
    apiKey,
    `/agents/${encodeURIComponent(agentSlug)}/env`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    },
    "Failed to set env var",
  )
}

async function removeEnvVar(apiKey: string, agentSlug: string, key: string): Promise<void> {
  await requestJson(
    apiKey,
    `/agents/${encodeURIComponent(agentSlug)}/env`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
    },
    "Failed to remove env var",
  )
}

function exitEnvSetUsage(message?: string): never {
  if (message) {
    p.log.error(message)
  }
  console.log("Usage:")
  console.log(`  ${ENV_SET_USAGE}`)
  console.log(`  ${ENV_SET_MULTI_USAGE}`)
  process.exit(1)
}

function parseEnvAssignments(args: string[]): EnvAssignment[] {
  const envArgs = args.slice(1)

  if (envArgs.length === 0) {
    exitEnvSetUsage()
  }

  if (!envArgs[0].includes("=")) {
    const key = envArgs[0]
    const value = envArgs.slice(1).join(" ")

    if (!key || value.length === 0) {
      exitEnvSetUsage()
    }

    return [{ key, value }]
  }

  const assignments: EnvAssignment[] = []
  for (const arg of envArgs) {
    const separatorIndex = arg.indexOf("=")
    const key = separatorIndex === -1 ? "" : arg.slice(0, separatorIndex)
    const value = separatorIndex === -1 ? "" : arg.slice(separatorIndex + 1)

    if (!key || value.length === 0) {
      exitEnvSetUsage("When using KEY=VALUE syntax, every env var must be passed as its own KEY=VALUE argument.")
    }

    assignments.push({ key, value })
  }

  return assignments
}

export async function envList(args: string[]) {
  const apiKey = requireAuth()
  const agentSlug = requireAgentSlug(args, "env list <agent-slug>")
  const spinner = p.spinner()

  try {
    spinner.start(`Fetching environment variables for ${agentSlug}...`)
    const keys = await fetchEnvKeys(apiKey, agentSlug)
    spinner.stop(`Fetched environment variables for ${agentSlug}`)

    if (keys.length === 0) {
      p.log.info("No environment variables set.")
      return
    }

    console.log()
    for (const key of keys) {
      console.log(`  ${key}`)
    }
    console.log()
    p.log.info(`${keys.length} variable${keys.length !== 1 ? "s" : ""}`)
  } catch (err: any) {
    spinner.stop(`Failed to fetch environment variables for ${agentSlug}`)
    p.log.error(err.message)
    process.exit(1)
  }
}

export async function envSet(args: string[]) {
  const apiKey = requireAuth()
  const agentSlug = requireAgentSlug(args, "env set <agent-slug> KEY VALUE | KEY=VALUE [KEY=VALUE ...]")
  const assignments = parseEnvAssignments(args)
  const spinner = p.spinner()
  const targetLabel = assignments.length === 1 ? assignments[0].key : `${assignments.length} env vars`

  try {
    spinner.start(`Updating ${targetLabel} for ${agentSlug}...`)
    for (const assignment of assignments) {
      await setEnvVar(apiKey, agentSlug, assignment.key, assignment.value)
    }
    spinner.stop(`Saved ${targetLabel} for ${agentSlug}.`)
  } catch (err: any) {
    spinner.stop(`Failed to update ${targetLabel} for ${agentSlug}`)
    p.log.error(err.message)
    process.exit(1)
  }
}

export async function envRemove(args: string[]) {
  const apiKey = requireAuth()
  const agentSlug = requireAgentSlug(args, "env remove <agent-slug> KEY")

  const key = args[1]
  const spinner = p.spinner()
  if (!key) {
    p.log.error("Usage: npx @21st-sdk/cli env remove <agent-slug> KEY")
    process.exit(1)
  }

  try {
    spinner.start(`Removing ${key} from ${agentSlug}...`)
    const keys = await fetchEnvKeys(apiKey, agentSlug)
    if (!keys.includes(key)) {
      spinner.stop(`${key} not found in ${agentSlug}`)
      return
    }
    await removeEnvVar(apiKey, agentSlug, key)
    spinner.stop(`Removed ${key} from ${agentSlug}`)
  } catch (err: any) {
    spinner.stop(`Failed to remove ${key} from ${agentSlug}`)
    p.log.error(err.message)
    process.exit(1)
  }
}
