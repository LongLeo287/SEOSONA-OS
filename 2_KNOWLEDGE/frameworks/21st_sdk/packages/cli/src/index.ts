import { createRequire } from "module"
import { agentsDelete, agentsGet, agentsList } from "./agents.js"
import { deploy } from "./deploy.js"
import { deployments } from "./deployments.js"
import { envList, envRemove, envSet } from "./env.js"
import { init } from "./init.js"
import { login } from "./login.js"
import { logs } from "./logs.js"
import { rollback } from "./rollback.js"
import { getFlagValue } from "./utils.js"

const require = createRequire(import.meta.url)
const { version } = require("../package.json")

const command = process.argv[2]
const args = process.argv.slice(3)
const hasFlag = (flag: string) => args.includes(flag)

function showHelp() {
  console.log(`21st CLI v${version} — deploy AI agents\n`)
  console.log("Usage: npx @21st-sdk/cli <command>")
  console.log("   or: 21st <command>    # when the package is installed globally\n")
  console.log("Commands:")
  console.log("  init                      Scaffold a new agent")
  console.log("  login                     Authenticate with 21st Agents")
  console.log("  deploy                    Bundle and deploy your agent")
  console.log("  agents                    List all agents")
  console.log("  agents get <slug>         Show agent details")
  console.log("  agents delete <slug>      Delete an agent")
  console.log("  versions <agent>          List deployment versions")
  console.log("  rollback <agent> [ver]    Roll back to a previous version")
  console.log("  env list <agent>          List environment variables")
  console.log("  env set <agent> ...       Set one or more environment variables")
  console.log("  env remove <agent> K      Remove an environment variable")
  console.log("  logs <agent>              List recent agent log sessions")
  console.log("\nOptions:")
  console.log("  --help, -h              Show help")
  console.log("  --version, -v           Show version")
  console.log("\nEnvironment variables:")
  console.log("  API_KEY_21ST            API key (skips login prompt)")
  console.log("  API_URL_21ST            API base URL override")
  console.log("\nGet started: npx @21st-sdk/cli login")
  console.log("Docs: https://21st.dev/agents/docs")
}

function showLoginHelp() {
  console.log("Usage: npx @21st-sdk/cli login [options]")
  console.log("   or: 21st login [options]\n")
  console.log("Authenticate with 21st Agents using an API key.\n")
  console.log("Options:")
  console.log("  --api-key KEY    Pass API key directly (non-interactive)")
  console.log("\nGet your API key at https://21st.dev/agents/api-keys")
}

function showInitHelp() {
  console.log("Usage: npx @21st-sdk/cli init [options]")
  console.log("   or: 21st init [options]\n")
  console.log("Scaffold a new agent project.\n")
  console.log("Options:")
  console.log("  --name SLUG    Agent slug (required in non-interactive mode)")
  console.log("\nExamples:")
  console.log("  npx @21st-sdk/cli init")
  console.log("  npx @21st-sdk/cli init --name my-agent")
}

function showDeployHelp() {
  console.log("Usage: npx @21st-sdk/cli deploy [options]")
  console.log("   or: 21st deploy [options]\n")
  console.log("Bundle and deploy agents from the ./agents/ directory.\n")
  console.log("Options:")
  console.log("  --agent SLUG   Deploy only this agent (default: deploy all)")
  console.log("  --name  SLUG   Override the agent slug (e.g. for multi-environment deploys)")
  console.log("\nExamples:")
  console.log("  npx @21st-sdk/cli deploy")
  console.log("  npx @21st-sdk/cli deploy --agent my-agent")
  console.log("  npx @21st-sdk/cli deploy --agent my-agent --name my-agent-dev")
  console.log("\nAgent structure:")
  console.log("  agents/")
  console.log("    my-agent/")
  console.log("      index.ts       agent entry point")
  console.log("    another.ts       single-file agent")
  console.log("\nDocs: https://21st.dev/agents/docs")
}

function showAgentsHelp() {
  console.log("Usage: npx @21st-sdk/cli agents [subcommand] [options]")
  console.log("   or: 21st agents [subcommand] [options]\n")
  console.log("Manage agents.\n")
  console.log("Subcommands:")
  console.log("  agents                    List all agents")
  console.log("  agents get <slug>         Show agent details")
  console.log("  agents delete <slug>      Delete an agent and all its deployments")
  console.log("\nOptions:")
  console.log("  --json     Print raw JSON response")
  console.log("  --force    Skip confirmation prompt")
}

function showVersionsHelp() {
  console.log("Usage: npx @21st-sdk/cli versions <agent-slug> [options]")
  console.log("       npx @21st-sdk/cli deployments <agent-slug> [options]")
  console.log("   or: 21st versions <agent-slug> [options]\n")
  console.log("List deployment versions for an agent.\n")
  console.log("Options:")
  console.log("  --json    Print raw JSON response")
}

function showRollbackHelp() {
  console.log("Usage: npx @21st-sdk/cli rollback <agent-slug> [version] [options]")
  console.log("   or: 21st rollback <agent-slug> [version] [options]\n")
  console.log("Roll back an agent to a previous deployment version.\n")
  console.log("If no version is specified, rolls back to the previous version.\n")
  console.log("Options:")
  console.log("  --json    Print raw JSON response")
  console.log("\nExamples:")
  console.log("  npx @21st-sdk/cli rollback my-agent")
  console.log("  npx @21st-sdk/cli rollback my-agent 3")
}

function showEnvHelp() {
  console.log("Usage: npx @21st-sdk/cli env <subcommand> <agent-slug>")
  console.log("   or: 21st env <subcommand> <agent-slug>\n")
  console.log("Manage environment variables for an agent.\n")
  console.log("Subcommands:")
  console.log("  env list <agent>                      List configured env var keys")
  console.log("  env set <agent> KEY VALUE             Set or update one env var")
  console.log("  env set <agent> KEY=VALUE [...]       Set one or more env vars")
  console.log("  env remove <agent> KEY                Remove an env var")
}

function showLogsHelp() {
  console.log("Usage: npx @21st-sdk/cli logs <agent-slug> [chat-id] [thread-id] [options]")
  console.log("   or: 21st logs <agent-slug> [chat-id] [thread-id] [options]\n")
  console.log("List recent chat log sessions, or inspect a specific chat/thread.\n")
  console.log("Options:")
  console.log("  --status active|error   Filter by session status")
  console.log("  --search TEXT           Search by chat id or sandbox id")
  console.log("  --since ISO             Filter by created_at >= timestamp")
  console.log("  --until ISO             Filter by created_at <= timestamp")
  console.log("  --limit N               Limit results (default: 20)")
  console.log("  --cursor UUID           Fetch the next page of log sessions")
  console.log("  --json                  Print raw JSON response")
}

if (command === "init") {
  if (hasFlag("--help") || hasFlag("-h")) {
    showInitHelp()
  } else {
    await init(args)
  }
} else if (command === "login") {
  if (hasFlag("--help") || hasFlag("-h")) {
    showLoginHelp()
  } else {
    await login({ apiKey: getFlagValue(args, "--api-key") })
  }
} else if (command === "deploy") {
  if (hasFlag("--help") || hasFlag("-h")) {
    showDeployHelp()
  } else {
    if (hasFlag("--project")) {
      console.log("Warning: --project flag is no longer used and will be ignored.")
    }
    await deploy()
  }
} else if (command === "agents") {
  const subcommand = args[0]
  if (subcommand === "--help" || subcommand === "-h") {
    showAgentsHelp()
  } else if (subcommand === "get") {
    await agentsGet(args.slice(1))
  } else if (subcommand === "delete") {
    await agentsDelete(args.slice(1))
  } else if (!subcommand || subcommand === "--json") {
    // `21st agents` or `21st agents --json` → list all
    await agentsList(args)
  } else {
    console.log(`Unknown agents subcommand: ${subcommand}`)
    showAgentsHelp()
    process.exit(1)
  }
} else if (command === "versions" || command === "deployments") {
  if (hasFlag("--help") || hasFlag("-h")) {
    showVersionsHelp()
  } else {
    await deployments(args)
  }
} else if (command === "rollback") {
  if (hasFlag("--help") || hasFlag("-h")) {
    showRollbackHelp()
  } else {
    await rollback(args)
  }
} else if (command === "env") {
  const subcommand = args[0]
  const subArgs = args.slice(1)
  if (!subcommand || subcommand === "--help" || subcommand === "-h") {
    showEnvHelp()
  } else if (subcommand === "list") {
    await envList(subArgs)
  } else if (subcommand === "set") {
    await envSet(subArgs)
  } else if (subcommand === "remove") {
    await envRemove(subArgs)
  } else {
    console.log(`Unknown env subcommand: ${subcommand}`)
    showEnvHelp()
    process.exit(1)
  }
} else if (command === "logs") {
  if (hasFlag("--help") || hasFlag("-h")) {
    showLogsHelp()
  } else {
    await logs(args)
  }
} else if (command === "--version" || command === "-v") {
  console.log(version)
} else {
  showHelp()
}
