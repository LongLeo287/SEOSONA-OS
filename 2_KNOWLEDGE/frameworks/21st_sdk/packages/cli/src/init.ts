import { existsSync, mkdirSync, writeFileSync, readFileSync } from "fs"
import { join } from "path"
import * as p from "@clack/prompts"
import { isInteractive } from "./detect.js"
import { getFlagValue, validateSlug } from "./utils.js"

const AGENT_TEMPLATE = `import { agent, tool } from "@21st-sdk/agent"
import { z } from "zod"

export default agent({
  model: "claude-sonnet-4-6",
  tools: {
    greet: tool({
      description: "Greet a user by name",
      inputSchema: z.object({
        name: z.string().describe("Name to greet"),
      }),
      execute: async ({ name }) => {
        return {
          content: [{ type: "text", text: \`Hello, \${name}!\` }],
        }
      },
    }),
  },
})
`

function ensureDependencies() {
  const cwd = process.cwd()
  const pkgPath = join(cwd, "package.json")

  if (!existsSync(pkgPath)) return

  try {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"))
    const allDeps = {
      ...(pkg.dependencies ?? {}),
      ...(pkg.devDependencies ?? {}),
    }
    const missingDeps = ["@21st-sdk/agent", "zod"].filter((dep) => !allDeps[dep])
    if (missingDeps.length > 0) {
      p.log.warn(`Missing dependencies: ${missingDeps.join(", ")}. Run: npm install ${missingDeps.join(" ")}`)
    }
  } catch {}
}

export async function init(args: string[]) {
  const flagSlug = getFlagValue(args, "--name")

  let slug: string

  if (flagSlug) {
    const err = validateSlug(flagSlug)
    if (err) {
      p.log.error(err)
      process.exit(1)
    }
    slug = flagSlug
  } else if (!isInteractive()) {
    p.log.error("Agent slug is required in non-interactive mode. Use --name <slug>.")
    process.exit(1)
  } else {
    p.intro("21st init")

    const result = await p.text({
      message: "Agent slug (lowercase, hyphens allowed)",
      placeholder: "my-agent",
      validate: (val) => validateSlug(val),
    })

    if (p.isCancel(result)) {
      p.cancel("Cancelled.")
      process.exit(0)
    }

    slug = result
  }

  const agentsDir = join(process.cwd(), "agents")
  const agentDir = join(agentsDir, slug)
  const entryFile = join(agentDir, "index.ts")

  if (existsSync(entryFile)) {
    p.log.error(`Agent already exists at agents/${slug}/index.ts`)
    process.exit(1)
  }

  try {
    mkdirSync(agentDir, { recursive: true })
    writeFileSync(entryFile, AGENT_TEMPLATE)
  } catch (err: any) {
    p.log.error(`Failed to create agent files: ${err instanceof Error ? err.message : String(err)}`)
    process.exit(1)
  }

  ensureDependencies()

  p.log.success(`Created agents/${slug}/index.ts`)
  console.log()
  console.log("Next steps:")
  console.log(`  1. Edit agents/${slug}/index.ts`)
  console.log(`  2. Run: npx @21st-sdk/cli deploy`)
}
