# CLI Reference

`@21st-sdk/cli` provides the `21st` bin for deploying and managing agents. With `npx`, use `npx @21st-sdk/cli <command>`. Use bare `21st <command>` only when the package is installed and the bin is available on your PATH.

## Install

```bash
npm install -g @21st-sdk/cli
# or use npx
npx @21st-sdk/cli <command>
```

## Commands

### `21st init`

Scaffold a new agent project.

```bash
npx @21st-sdk/cli init
# Enter agent slug: my-agent
# Created agents/my-agent/index.ts

# Non-interactive
npx @21st-sdk/cli init --name my-agent
```

Creates `agents/<slug>/index.ts` with a starter agent template.

### `21st login`

Authenticate with the 21st Agents platform.

```bash
npx @21st-sdk/cli login
# Enter your API key: 21st_sk_...
# Authenticated as John (team: my-team)
```

Your key is saved to `~/.an/credentials`.

### `21st deploy`

Bundle and deploy your agent.

```bash
npx @21st-sdk/cli deploy
# Bundling my-agent...
# Bundled (12.3kb)
# Deploying my-agent...
# my-agent deployed (v3)
```

Options:
- `--agent <slug>` — Deploy only this agent (default: deploy all)
- `--name <slug>` — Override the agent slug (e.g. for multi-environment deploys)

The CLI:
1. Finds agents in the `agents/` directory
2. Bundles your code + dependencies with esbuild
3. Deploys to a secure cloud sandbox
4. Returns your agent's dashboard URL

### `21st agents`

List, inspect, and delete agents.

```bash
# List all agents
npx @21st-sdk/cli agents

# Show details for one agent
npx @21st-sdk/cli agents get my-agent

# Delete an agent and all its deployments
npx @21st-sdk/cli agents delete my-agent

# Machine-readable output
npx @21st-sdk/cli agents --json
```

### `21st versions`

List deployment versions for an agent. `deployments` is an alias.

```bash
npx @21st-sdk/cli versions my-agent
npx @21st-sdk/cli versions my-agent --json
```

### `21st rollback`

Roll back an agent to a previous deployment version.

```bash
# Roll back to previous version
npx @21st-sdk/cli rollback my-agent

# Roll back to a specific version
npx @21st-sdk/cli rollback my-agent 3
```

### `21st env`

Manage environment variables for a deployed agent.

```bash
# List configured keys
npx @21st-sdk/cli env list my-agent

# Set or update one value
npx @21st-sdk/cli env set my-agent OPENAI_API_KEY sk-live-...

# Set or update multiple values
npx @21st-sdk/cli env set my-agent OPENAI_API_KEY=sk-live-... ANTHROPIC_API_KEY=sk-ant-...

# Remove a key
npx @21st-sdk/cli env remove my-agent OPENAI_API_KEY
```

### `21st logs`

List recent chat log sessions, or inspect a specific chat/thread.

```bash
# List sessions
npx @21st-sdk/cli logs my-agent

# Inspect one chat
npx @21st-sdk/cli logs my-agent <chat-id>

# Inspect one thread
npx @21st-sdk/cli logs my-agent <chat-id> <thread-id>

# Filter and paginate
npx @21st-sdk/cli logs my-agent --status error --limit 20

# Machine-readable output
npx @21st-sdk/cli logs my-agent --json
```

## Project Layout

```
agents/
  my-agent/
    index.ts       agent entry point
  another.ts       single-file agent
```

Your entry file must `export default agent(...)`.

## Bundling

The CLI uses esbuild to bundle your agent code:

- Target: Node 22, ESM
- `@21st-sdk/agent` is externalized (provided by the sandbox runtime)
- All other dependencies are bundled into a single file

## Configuration Files

| File | Location | Purpose |
|------|----------|---------|
| `~/.an/credentials` | Global | API key (`{ "apiKey": "21st_sk_..." }`) |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `API_KEY_21ST` | — | Override the API key used by the CLI |
| `API_URL_21ST` | `https://an.dev/api/v1` | Override API endpoint |
| `APP_URL_21ST` | `https://21st.dev` | Override app URL in deploy output |
