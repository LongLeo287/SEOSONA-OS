# @21st-sdk/cli

Deploy AI agents to [21st Agents](https://21st.dev/agents) from your terminal.

## Quick Start

```bash
# 1. Login with your API key (get one at https://21st.dev/agents/api-keys)
npx @21st-sdk/cli login

# 2. Scaffold a new agent
npx @21st-sdk/cli init --name my-agent

# 3. Install dependencies
npm init -y && npm install @21st-sdk/agent zod
```

The `init` command creates `agents/my-agent/index.ts` with a starter template. Edit it to define your agent:

```ts
import { agent, tool } from "@21st-sdk/agent"
import { z } from "zod"

export default agent({
  model: "claude-sonnet-4-6",
  systemPrompt: "You are a helpful assistant.",
  tools: {
    add: tool({
      description: "Add two numbers",
      inputSchema: z.object({ a: z.number(), b: z.number() }),
      execute: async ({ a, b }) => ({
        content: [{ type: "text", text: `${a + b}` }],
      }),
    }),
  },
})
```

```bash
# 4. Deploy
npx @21st-sdk/cli deploy
```

That's it. Your agent is live.

## Commands

### `npx @21st-sdk/cli init`

Scaffold a new agent project.

```bash
npx @21st-sdk/cli init
# Enter agent slug: my-agent
# Created agents/my-agent/index.ts

# Non-interactive
npx @21st-sdk/cli init --name my-agent
```

### `npx @21st-sdk/cli login`

Authenticate with your API key.

```bash
npx @21st-sdk/cli login
# Enter your API key: 21st_sk_...
# Authenticated as John (team: my-team)
```

Your key is saved to `~/.an/credentials`.

### `npx @21st-sdk/cli deploy`

Bundle and deploy your agent.

Current layout:

```text
agents/
  my-agent/
    template/
      custom-file.txt
      ...
    index.ts
```

```bash
npx @21st-sdk/cli deploy
# Found 1 agent
# Bundled my-agent (12.3kb)
# my-agent deployed (v1)
# Deployed 1 agent
#   my-agent  →  https://21st.dev/agents
```

The CLI:
1. Finds agents in the `agents/` directory, with `agents/<slug>/index.ts` as the primary entrypoint layout
2. Bundles your code + dependencies with esbuild
3. Deploys to a secure cloud sandbox
4. Prints the Agents dashboard URL

### `npx @21st-sdk/cli agents`

List, inspect, and delete agents.

```bash
# List all agents
npx @21st-sdk/cli agents

# Show agent details
npx @21st-sdk/cli agents get my-agent

# Delete an agent and all its deployments
npx @21st-sdk/cli agents delete my-agent

# Machine-readable output
npx @21st-sdk/cli agents --json
```

### `npx @21st-sdk/cli versions`

List deployment versions for an agent. `deployments` is an alias.

```bash
npx @21st-sdk/cli versions my-agent
npx @21st-sdk/cli versions my-agent --json
```

### `npx @21st-sdk/cli rollback`

Roll back an agent to a previous deployment version.

```bash
# Roll back to previous version
npx @21st-sdk/cli rollback my-agent

# Roll back to a specific version
npx @21st-sdk/cli rollback my-agent 3

# Machine-readable output
npx @21st-sdk/cli rollback my-agent --json
```

### `npx @21st-sdk/cli env`

Manage environment variables for a deployed agent.

```bash
# List configured keys
npx @21st-sdk/cli env list my-agent

# Set or update one value
npx @21st-sdk/cli env set my-agent OPENAI_API_KEY sk-live-...

# Set or update multiple values
npx @21st-sdk/cli env set my-agent OPENAI_API_KEY=sk-live-... ANTHROPIC_API_KEY=sk-ant-...

# Quote values with spaces the usual shell way
npx @21st-sdk/cli env set my-agent SYSTEM_PROMPT="hello world"

# Remove a key
npx @21st-sdk/cli env remove my-agent OPENAI_API_KEY
```

### `npx @21st-sdk/cli logs`

List recent chat log sessions for a deployed agent, or inspect a specific chat/thread.

```bash
# Recent sessions
npx @21st-sdk/cli logs my-agent

# Chat detail
npx @21st-sdk/cli logs my-agent my-chat-id

# Thread detail
npx @21st-sdk/cli logs my-agent my-chat-id thread-id

# Only failed sessions
npx @21st-sdk/cli logs my-agent --status error

# Next page
npx @21st-sdk/cli logs my-agent --cursor 018f5d28-6a8d-7c2f-9d9f-6a1b9bb3e3f2

# Machine-readable output
npx @21st-sdk/cli logs my-agent --json
```

## How It Works

```
Your code  -->  @21st-sdk/cli deploy  -->  Cloud Sandbox  -->  Clients
                                (21st Agents)
```

- Your agent runs in an isolated cloud sandbox with Node.js, git, and system tools
- The `@21st-sdk/agent` runtime executes your agent with the model and tools you defined
- Deployed agents are managed through the 21st Agents app and API

## Project Linking

The CLI does not use project-local config files. If you still have `.an/project.json` from an older setup, it is no longer used and can be removed.

## CLI Environment Variables

`API_KEY_21ST` — Override the API key used by the CLI

`API_URL_21ST` — Override the API endpoint (default: `https://an.dev/api/v1`)

`APP_URL_21ST` — Override the app URL used in deploy output (default: `https://21st.dev`)

## License

MIT
