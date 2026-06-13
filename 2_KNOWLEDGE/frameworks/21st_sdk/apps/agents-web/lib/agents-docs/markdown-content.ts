export interface DocPage {
  slug: string
  path: string
  title: string
  description: string
  section: string
  markdown: string
}

export const AN_DOC_PAGES: DocPage[] = [
  {
    slug: "introduction",
    path: "/docs",
    title: "Introduction",
    description: "Overview of 21st Agents - agent infrastructure for your product",
    section: "Getting Started",
    markdown: `# 21st Agents Infrastructure

Add a production-ready AI agent to your product without building the infrastructure yourself. 21st Agents handles the runtime, sandboxing, streaming, tools, and UI - you just configure and ship.

## Features

- **Multi-provider runtimes** - Claude Code and OpenAI Codex with model switching
- **E2B sandboxed execution** - Isolated environments with configurable permissions
- **SSE streaming** - Real-time token streaming with AI SDK compatibility
- **Built-in tools** - Web search, file handling, code execution, and custom actions
- **Skills system** - On-demand context blocks referenced from the system prompt
- **Chat UI theming** - Custom themes via CSS variables
- **Logs & debugging** - Session search, conversation replay, live monitoring
- **Per-dialog cost tracking** - Token counts and USD costs for every conversation turn
- **File attachments** - Image, document, and code uploads with type filtering
- **Session management** - Persistent project IDs with dialog history`,
  },
  {
    slug: "try-it-out",
    path: "/docs/try-it-out",
    title: "Try It Out",
    description: "Interactive demo of the agent chat interface",
    section: "Getting Started",
    markdown: `# Try It Out

Interactive demo of a few example visual styles for the agent chat interface. Switch between preview styles and see a live chat preview with animated agent interaction flow.

Visit the [Try It Out page](https://21st.dev/an/docs/try-it-out) to interact with the live demo.`,
  },
  {
    slug: "get-started",
    path: "/docs/get-started",
    title: "Get Started",
    description: "Create an agent, deploy it, and add it to your Next.js app",
    section: "Getting Started",
    markdown: `# Get Started

Create an agent, deploy it, and add it to your Next.js app.

## 1. Create your agent

\`\`\`bash
npm init -y
npm install @21st-sdk/agent zod
\`\`\`

Create \`agents/my-agent/index.ts\`:

\`\`\`ts
import { agent, tool } from "@21st-sdk/agent"
import { z } from "zod"

export default agent({
  model: "claude-sonnet-4-6",
  systemPrompt: "You are a helpful coding assistant.",
  tools: {
    add: tool({
      description: "Add two numbers",
      inputSchema: z.object({ a: z.number(), b: z.number() }),
      execute: async ({ a, b }) => ({
        content: [{ type: "text", text: \\\`\\\${a + b}\\\` }],
      }),
    }),
  },
})
\`\`\`

See [Deploy](/an/docs/deploy/deploy) for all configuration options.

## 2. Deploy

Log in with your [API key](/an/app) from the dashboard, then deploy:

\`\`\`bash
npx @21st-sdk/cli login
npx @21st-sdk/cli deploy
\`\`\`

Your agent is now live. Next, integrate it into your app.

## 3. Install the SDK

\`\`\`bash
pnpm add @21st-sdk/nextjs
\`\`\`

This also installs \`@21st-sdk/react\` with all UI components. Peer dependencies: \`ai\`, \`@ai-sdk/react\`.

## 4. Create a Token Route

The SDK exchanges your secret API key for short-lived tokens server-side, so credentials are never exposed to the browser.

\`\`\`typescript
// app/api/an-token/route.ts
import { createTokenHandler } from "@21st-sdk/nextjs/server"

export const POST = createTokenHandler({
  apiKey: process.env.API_KEY_21ST!,
})
\`\`\`

## 5. Add the Chat Component

Use \`createAgentChat\` to connect to your agent and \`<AgentChat>\` to render the UI. It handles streaming, tools, and theming automatically.

\`\`\`tsx
"use client"

import { AgentChat, createAgentChat } from "@21st-sdk/nextjs"
import { useChat } from "@ai-sdk/react"

const chat = createAgentChat({
  agent: "my-agent",
  tokenUrl: "/api/an-token",
})

export default function Page() {
  const { messages, input, handleInputChange, handleSubmit, status, stop, error } =
    useChat({ chat })

  return (
    <AgentChat
      messages={messages}
      onSend={() => handleSubmit()}
      status={status}
      onStop={stop}
      error={error ?? undefined}
    />
  )
}
\`\`\`

## Optional: Per-message Runtime Options

Pass \`options\` inside the AI SDK request body when one browser request should run with different runtime settings without changing the deployed agent config.

\`\`\`tsx
"use client"

import { AgentChat, createAgentChat } from "@21st-sdk/nextjs"
import { useChat } from "@ai-sdk/react"

const chat = createAgentChat({
  agent: "my-agent",
  tokenUrl: "/api/an-token",
})

const reviewOptions = {
  systemPrompt: {
    type: "preset",
    preset: "claude_code",
    append:
      "You are reviewing a checkout diff. Focus on regressions, risky edge cases, and missing tests. Do not edit files.",
  },
  maxTurns: 4,
  maxBudgetUsd: 0.2,
  disallowedTools: ["Bash"],
}

export default function Page() {
  const { messages, sendMessage, status, stop, error } = useChat({ chat })

  return (
    <AgentChat
      messages={messages}
      onSend={(message) =>
        sendMessage(
          {
            role: "user",
            parts: [{ type: "text", text: message.content }],
          },
          {
            body: { options: reviewOptions },
          },
        )
      }
      status={status}
      onStop={stop}
      error={error ?? undefined}
    />
  )
}
\`\`\`

Currently applied by the runtime: \`systemPrompt\`, \`maxTurns\`, \`maxBudgetUsd\`, and \`disallowedTools\`.

## Components

| Component | Description |
|---|---|
| \`<AgentChat />\` | Full chat interface with messages, input, and tool rendering |
| \`<MessageList />\` | Standalone message list for custom layouts |
| \`<InputBar />\` | Chat input with submit handling |
| \`<ToolRenderer />\` | Individual tool call renderer with expand/collapse |`,
  },
  {
    slug: "core-concepts",
    path: "/docs/core-concepts",
    title: "Core Concepts",
    description: "Agents, skills, projects, dialogs, and the Relay runtime - how the pieces fit together",
    section: "Getting Started",
    markdown: `# Core Concepts

Agents, skills, projects, dialogs, and the Relay runtime - how the pieces fit together.

## How it works

When a user sends a message, your app calls the Chat API. The platform routes the message to a **Relay** runtime that spins up a sandboxed environment, runs the agent with the tools and instructions you configured, and streams the response back via SSE.

\`\`\`
Your App
  └─ AgentChat component (or raw SDK)
        │
        ▼  SSE streaming
    Relay
        │
        ├─ Agent runtime (Claude Code / Codex)
        ├─ System prompt + skills
        ├─ Tool execution (your configured tools)
        └─ E2B Sandbox (isolated environment)
\`\`\`

Everything in between - auth, routing, sandboxing, token counting, cost tracking - is handled by the platform.

## Agents

An agent is a configuration that defines what the AI can do and how it behaves. Agents are **code-first** - you define them using \`@21st-sdk/agent\` (model, system prompt, tools, lifecycle hooks) and deploy with \`an deploy\`. This creates an E2B sandbox where the agent actually runs. Once deployed, you integrate it into your app with the [React SDK](/an/docs/get-started).

The dashboard is for API keys, environment variables, skills, and monitoring - not for creating or editing agent behavior. See [Deploy](/an/docs/deploy/deploy) for the full breakdown.

## Skills

A skill is a block of additional instructions and context that you can attach to any agent. Unlike the system prompt which is sent every turn, skills act as reference material the agent can draw on when needed.

For example, you might create a "Returns Policy" skill with detailed procedures and attach it to your support agent. In the system prompt you tell the agent: "When the user asks about returns, follow the Returns Policy skill." The agent then has access to the full context without bloating every single message.

## Projects & Dialogs

When a user starts chatting with your agent, the platform creates a **project** - a session that ties together the agent config, a sandbox, and the conversation history.

Each message the user sends within a project creates a **dialog** - a single conversation turn. Dialogs track:

- **Messages** - User input, assistant response, and tool calls
- **Status** - streaming → completed, error, or cancelled
- **Token usage** - Input tokens, output tokens, and total
- **Cost & duration** - USD cost and execution time in milliseconds

The project ID is stable across page refreshes. To start a fresh conversation, rotate the project ID.

## Relay

Relay is the runtime service sitting between your app and the agent. It takes care of:

1. Authenticating the request and resolving the agent config
2. Spinning up an isolated E2B sandbox for safe execution
3. Running the agent with the configured runtime (Claude Code / Codex)
4. Streaming the response back to your app via Server-Sent Events
5. Persisting session state so the agent can resume across turns

You don't interact with Relay directly - the SDK handles it.

## API Keys

API keys authenticate your app's requests to 21st Agents. You create them in the dashboard under the **API** tab.

- **Format:** \`21st_sk_\` followed by 64 hex characters. Legacy \`an_sk_\` keys still work.
- **Scope:** Each key is scoped to a team
- **Auth flow:** Your backend exchanges the API key for a short-lived JWT token via \`/api/agents/token\`, then passes the token to the client

Never expose your API key in client-side code.`,
  },
  {
    slug: "agent-projects",
    path: "/docs/deploy/deploy",
    title: "Deploy",
    description:
      "Build, configure, and deploy agents. Project structure, agent() configuration, CLI commands, and how code and dashboard responsibilities are split.",
    section: "Deploy & Operate",
    markdown: `# Deploy

Project structure, full configuration reference, CLI commands, and deploy internals.

## Quick start

\`\`\`bash
npm init -y
npm install @21st-sdk/agent zod
\`\`\`

Create \`agents/my-agent/index.ts\`:

\`\`\`ts
import { agent, tool } from "@21st-sdk/agent"
import { z } from "zod"

export default agent({
  model: "claude-sonnet-4-6",
  systemPrompt: "You are a helpful coding assistant.",
  tools: {
    add: tool({
      description: "Add two numbers",
      inputSchema: z.object({ a: z.number(), b: z.number() }),
      execute: async ({ a, b }) => ({
        content: [{ type: "text", text: \\\`\\\${a + b}\\\` }],
      }),
    }),
  },
})
\`\`\`

Deploy:

\`\`\`bash
npx @21st-sdk/cli login
npx @21st-sdk/cli deploy
\`\`\`

## Project layout

\`\`\`
21st-agents/
├── package.json              # @21st-sdk/agent + zod
├── agents/
│   └── my-agent/
│       └── index.ts          # Agent configuration (entry point)
├── .an/                      # Generated on first deploy
│   └── project.json          # Links project to deployed agent
├── .env                      # Local env vars (optional)
└── .gitignore                # Should include .an/
\`\`\`

## Agent configuration

The agent file is where all your configuration lives - model, runtime, system prompt, tools, hooks:

\`\`\`ts
import { agent, tool } from "@21st-sdk/agent"
import { z } from "zod"

export default agent({
  model: "claude-sonnet-4-6",
  runtime: "claude-code",
  systemPrompt: "You are a helpful coding assistant.",
  permissionMode: "default",
  maxTurns: 50,
  tools: {
    greet: tool({
      description: "Greet a user",
      inputSchema: z.object({ name: z.string() }),
      execute: async ({ name }) => ({
        content: [{ type: "text", text: \\\`Hello, \\\${name}!\\\` }],
      }),
    }),
  },
  onFinish: async ({ result }) => {
    console.log("Done:", result)
  },
})
\`\`\`

\`@21st-sdk/agent\` is externalized during bundling - the sandbox provides it at runtime.

## Entry point

When you run \`an deploy\`, the CLI scans the \`agents/\` directory. Each deployable agent should live at \`agents/<slug>/index.ts\` or \`agents/<slug>/index.js\`.

| File | Notes |
|------|-------|
| agents/my-agent/index.ts or agents/my-agent/index.js | Use one folder per deployable agent so sibling files like template/ can live next to it. |

The entry point must have a \`default export\` that returns an agent config created with \`agent()\`.

## package.json

Two required dependencies:

\`\`\`json
{
  "name": "my-agent",
  "type": "module",
  "dependencies": {
    "@21st-sdk/agent": "latest",
    "zod": "^3.24"
  }
}
\`\`\`

## CLI reference

### Install

\`\`\`bash
# Run directly with npx
npx @21st-sdk/cli login
npx @21st-sdk/cli deploy

# Or install globally
npm install -g @21st-sdk/cli
an login
an deploy
\`\`\`

### Login

Authenticate with your API key from the dashboard.

\`\`\`bash
$ an login
  Enter your API key: 21st_sk_...
  Authenticated as John (team: my-team)
\`\`\`

Credentials are saved to \`~/.an/credentials\`. You only need to log in once.

### Deploy

\`\`\`bash
$ an deploy
  Bundling agents/my-agent/index.ts...
  Bundled (12.3kb)
  Deploying my-agent...

  ✓ https://api.an.dev/v1/chat/my-agent
\`\`\`

## How deploy works

1. **Bundle** - esbuild bundles your code (Node 22, ESM, minified). \`@21st-sdk/agent\` is externalized.
2. **Upload** - Base64-encoded bundle sent to the deploy API with your slug and API key.
3. **Sandbox** - E2B sandbox created with the 21st Agents runtime template (Node 24, git, curl, ripgrep, GitHub CLI).
4. **Live** - Agent config saved to database, agent immediately available at its chat endpoint.

## Environment variables

Set env vars from the dashboard. Defined tools can read them via \`process.env\` in the trusted remote environment. They are not injected into the sandbox itself.

## Generated files

After your first deploy, the CLI creates a \`.an/\` directory:

\`\`\`json
// .an/project.json
{
  "agentId": "a1b2c3d4-...",
  "slug": "my-agent"
}
\`\`\`

This links your local project to the deployed agent. Add \`.an/\` to your \`.gitignore\`.

## Redeploying

Run \`an deploy\` again. The old sandbox is killed, a new one created with the updated bundle, and the agent URL stays the same.

## What lives where

Agents are **code-first**. Agent behavior lives entirely in your code. The dashboard is for monitoring and managing environment variables.

| What | Where | Managed from |
|------|-------|-------------|
| Agent config (model, runtime, permission mode, max turns) | agents/my-agent/index.ts | Code only |
| System prompt | agents/my-agent/index.ts | Code only |
| Custom tools (Zod schemas) | agents/my-agent/index.ts | Code only |
| Lifecycle hooks (onStart, onToolCall, onFinish) | agents/my-agent/index.ts | Code only |
| Environment variables | Dashboard | Dashboard |
| Deployments (sandbox, bundle hash) | Dashboard | an deploy |
| Logs & costs (conversations, tokens, USD) | Dashboard | View only |`,
  },
  {
    slug: "cli",
    path: "/docs/deploy/cli",
    title: "CLI",
    description:
      "Authenticate, deploy agents, manage environment variables, and inspect logs from your terminal.",
    section: "Deploy & Operate",
    markdown: `# CLI

Use \`@21st-sdk/cli\` to authenticate, deploy agents, manage environment variables, and inspect logs from your terminal.

## Install & Auth

Run the CLI with \`npx\`:

\`\`\`bash
npx @21st-sdk/cli login
\`\`\`

Credentials are saved to \`~/.an/credentials\`. You can also authenticate non-interactively with \`API_KEY_21ST\`.

## Project Layout

The current deploy structure is:

\`\`\`
agents/
  my-agent/
    index.ts
    template/
      ...
\`\`\`

The primary entrypoint is \`agents/<slug>/index.ts\`.

## Deploy

\`\`\`bash
npx @21st-sdk/cli deploy
\`\`\`

Deploy scans \`agents/\`, bundles detected agents, uploads them, and prints the Agents dashboard URL.

## Environment Variables

\`\`\`bash
# list configured keys
npx @21st-sdk/cli env list my-agent

# set or update one key
npx @21st-sdk/cli env set my-agent OPENAI_API_KEY sk-live-...

# remove one key
npx @21st-sdk/cli env remove my-agent OPENAI_API_KEY
\`\`\`

The list command only returns keys, not secret values.

## Logs

\`\`\`bash
# list chats
npx @21st-sdk/cli logs my-agent

# inspect one chat
npx @21st-sdk/cli logs my-agent <chat-id>

# inspect one thread
npx @21st-sdk/cli logs my-agent <chat-id> <thread-id>

# machine-readable output
npx @21st-sdk/cli logs my-agent --json
\`\`\`

## Filtering & Pagination

The logs list supports:

- \`--status active|error\`
- \`--search TEXT\`
- \`--since ISO\`
- \`--until ISO\`
- \`--limit N\`
- \`--cursor UUID\`

To fetch the next page, reuse the same filters together with the returned cursor:

\`\`\`bash
npx @21st-sdk/cli logs my-agent --status active --limit 20
npx @21st-sdk/cli logs my-agent --status active --limit 20 --cursor <nextCursor>
\`\`\`

## CLI Environment Variables

- \`API_KEY_21ST\` - Override the API key used by the CLI`,
  },
  {
    slug: "templates",
    path: "/docs/templates",
    title: "Templates",
    description: "Pre-built agent templates to get started quickly - chat apps, form filling, email agents, note takers, and monitoring",
    section: "Getting Started",
    markdown: `# Templates

Pre-built agent templates to get started quickly. Clone a template, deploy it, and integrate into your app.

## Available Templates

- **Chat App** - Next.js chat interface with AI agent powered by 21st Agents SDK
- **Fill Form** - AI-powered form filling with tabbed forms and chat interface
- **Email Agent** - Email operations copilot - send, read inbox, auto-reply via AgentMail
- **Note Taker** - AI notebook assistant with persistent notes and real-time sync via Convex
- **Monitor Agent** - Service health monitoring with Slack alerts

Each template includes a ready-to-deploy agent project, a README with setup instructions, and a prompt you can copy to get started with your AI coding assistant.`,
  },
  {
    slug: "agents",
    path: "/docs/build/agents",
    title: "Agents",
    description: "Available runtimes, models, tools, permission modes, and attachment settings",
    section: "Build",
    markdown: `# Agents

Reference for the configuration options available in your \`agent()\` call - runtimes, models, tools, permissions, and attachments. See [Deploy](/an/docs/deploy/deploy) for project setup and CLI.

## Runtime & Model

The runtime determines which AI provider executes your agent. Each runtime supports a different set of models with varying capabilities and price points.

### Anthropic - Claude Code
Full-featured agentic runtime with tool use, web access, and sandboxed execution. Best for complex multi-step tasks.

**Available models:** Claude Sonnet 4.6, Claude Opus 4.6, Claude Haiku 4.5

### OpenAI - Codex (Coming soon)
OpenAI's optimized runtime with multiple reasoning levels. Great for structured tasks and analysis.

**Model switching** - you can let end users switch between models at runtime. Enable "Allow model switching" in the agent config and select which models to expose.

## System Prompt

The system prompt defines your agent's persona, behavioral rules, and constraints. It's sent with every message and shapes how the agent responds. Max 4,000 characters.

See [System Prompts](/an/docs/build/system-prompts) for writing tips, examples, and how to reference skills.

## Tools

Tools are the capabilities your agent can use during a conversation. Toggle each tool on or off.

| Category | Tools | Description |
|---|---|---|
| Read-only | Read, Glob, Grep | Search and read files without modifications |
| Edit | Edit, Write | Create and modify files in the sandbox |
| Execution | Bash | Run shell commands in the sandboxed environment |
| Web | WebFetch, WebSearch | Fetch URLs and search the web for information |

Only enable the tools your agent actually needs.

## Permission Modes

| Mode | Behavior |
|---|---|
| Default | Ask the user before risky actions like file writes or shell commands |
| Accept Edits | Auto-approve file edits, but confirm shell commands |
| Bypass All | No confirmation needed. The agent acts autonomously |

**Tip:** For agents embedded in your product where the sandbox is fully isolated, use \`Bypass All\` to remove friction.

## Max Turns

Limits how many reasoning steps the agent can take per message (1-500). Default: 50.

## Attachments

Allow users to upload files alongside their messages. Configure allowed file types (Images, Documents, Code, or All) and custom extensions.

## Skills

Attach skills in the agent config, then reference them by name in the system prompt. See [Skills](/an/docs/build/skills) for details.`,
  },
  {
    slug: "skills",
    path: "/docs/build/skills",
    title: "Skills",
    description: "Reusable instruction blocks for on-demand agent context",
    section: "Build",
    markdown: `# Skills

Skills are reusable blocks of instructions that give your agent deeper context on specific topics - API details, behavioral rules, step-by-step procedures, or anything else it needs to know.

## What skills are

Think of skills as extra pages in an instruction manual. The system prompt tells the agent who it is and how to behave in general. Skills give it detailed knowledge on specific topics - like how to call a particular API, how to handle refunds, or what tone to use when writing marketing copy.

You write a skill once and attach it to any number of agents. When you update the skill, every agent that uses it picks up the change automatically.

## How skills work with the system prompt

The system prompt is your agent's core identity - it's sent with every message. Skills provide additional context that the agent can reference when it needs to.

The key pattern: in your system prompt, you tell the agent *when* to use each skill. The skill itself contains the *detailed instructions* for that situation.

\`\`\`
System prompt:
  "You are a support agent for Acme Inc.
   When the user asks about returns, follow the Returns Policy skill.
   When the user asks about billing, follow the Billing FAQ skill."

Skills attached:
  ├─ Returns Policy    (detailed refund steps, eligibility rules, edge cases)
  └─ Billing FAQ       (plan tiers, upgrade flow, invoice questions)
\`\`\`

This way your system prompt stays short and focused, while the agent still has access to deep context whenever a specific topic comes up.

## What to put in a skill

- **API documentation** - endpoints, parameters, authentication, example requests and responses
- **Procedures** - step-by-step instructions for handling specific situations
- **Behavioral rules** - tone, formatting, what to say and what to avoid in specific contexts
- **Domain knowledge** - product specs, pricing tables, feature comparisons, FAQs
- **Tool calling instructions** - how to use specific tools, what parameters to pass

## Skills vs system prompts

| System prompt | Skill |
|---|---|
| One per agent | Many per agent |
| Sent with every message | Referenced on demand |
| Defines identity, tone, and general rules | Provides detailed context on specific topics |
| Not shareable between agents | Shareable across multiple agents |

**Rule of thumb:** If you'd put it in the agent's "about me", it belongs in the system prompt. If it's reference material the agent needs for specific tasks, make it a skill.

## Create a skill

Open the **Skills** page in the dashboard and click **New Skill**.

| Field | Description |
|---|---|
| Name | Human-readable name (max 100 characters). A slug is auto-generated. |
| Description | Optional - a short summary of what the skill covers. |
| Content | The instructions. Written in plain text or Markdown (up to 10,000 characters). |
| Tags | Optional labels for organization (e.g. support, sales, onboarding). |

## Attach skills to agents

Once created, attach a skill to an agent in the agent's configuration page. A single agent can use multiple skills, and a single skill can be shared across multiple agents.

After attaching, reference the skill in your system prompt so the agent knows when to use it.`,
  },
  {
    slug: "mcp-servers",
    path: "/docs/build/tools-and-mcps",
    title: "Tools and MCPs",
    description: "Add external MCP servers with a sibling .mcp.json file next to your agent entrypoint",
    section: "Build",
    markdown: `# Tools and MCPs

MCP servers are configured almost the same way as skills, but the file is loaded at deploy time instead of from the sandbox filesystem.

## Skills vs MCP servers

- **Skill** - lives in \`.claude/skills/<name>/SKILL.md\`, contains reusable instructions, usually referenced from the system prompt
- **MCP server** - lives in a sibling \`.mcp.json\` next to your agent entrypoint, contains Claude Code MCP server configuration, provides an interface for external tools

See [Skills](/an/docs/build/skills) for the related pattern.

## How deploy-time loading works

During deploy, the CLI reads a sibling \`.mcp.json\` file next to your agent entrypoint and uploads it with the agent bundle.

The runtime stores that file privately and generates Claude's MCP config from it. Do not put MCP config at \`/home/user/workspace/.mcp.json\` or inside \`template/\`.

## .mcp.json format

See [Claude's MCP docs](https://platform.claude.com/docs/en/agent-sdk/mcp) for the native format and supported options.

Keep secrets as placeholders here, for example \`Bearer \${NIA_TOKEN}\`, and set the real value through dashboard env vars.

Do not hardcode secrets directly in \`.mcp.json\`. Use placeholders and agent env vars instead.

\`\`\`json
{
  "mcpServers": {
    "nia": {
      "type": "http",
      "url": "https://apigcp.trynia.ai/mcp",
      "headers": {
        "Authorization": "Bearer <public-demo-token>"
      }
    },
    "svelte": {
      "command": "npx",
      "args": ["-y", "@sveltejs/mcp"]
    }
  }
}
\`\`\`

## Add the file next to your agent entrypoint

For deployed agents, create a sibling \`.mcp.json\` file next to \`index.ts\`, \`index.js\`, or \`index.go\`.

The deploy CLI uploads that file automatically. Do not add it through \`Sandbox({ files })\` or \`template/\`.

\`\`\`ts
import { agent } from "@21st-sdk/agent"

export default agent({
  model: "claude-sonnet-4-6",
  systemPrompt: \`You are a full-stack coding assistant.
Use the configured MCP servers whenever they are helpful.\`,
})
\`\`\`

Also create \`agents/my-agent/.mcp.json\` with the JSON above. The platform picks up that sibling file during deploy and wires the MCP servers into the runtime automatically.`,
  },
  {
    slug: "system-prompts",
    path: "/docs/build/system-prompts",
    title: "System Prompts",
    description: "Configure agent behavior with custom system prompts and instructions",
    section: "Build",
    markdown: `# System Prompts

The system prompt is the single most important setting for your agent. It defines who the agent is, what it knows, and how it behaves.

## How it works

Every time a user sends a message, your system prompt is included at the top of the conversation sent to the model. Max length is 4,000 characters. The field is optional - agents work without a custom prompt, but they won't be tailored to your use case.

## Default prompt layering

Agents ship with a built-in base prompt that handles tool usage and safety. When you write a custom prompt, it gets appended on top of the default. You can turn off defaults for full control.

- **Defaults on (recommended)** - Your custom prompt layers on top of the built-in safety and tool-use instructions.
- **Defaults off** - Your prompt is the only system prompt the agent sees. Use this when you need full control.

**Tip:** Keep defaults on unless you have a specific reason to replace them.

## Writing a good prompt

The best system prompts are short, specific, and structured.

### Customer support agent

\`\`\`
You are a support agent for Acme Inc.

- Be friendly, concise, and solution-oriented
- Always greet the user and ask how you can help
- When the user asks about returns, follow the Returns Policy skill
- When the user asks about billing, follow the Billing FAQ skill
- If you can't resolve an issue, offer to escalate to a human agent
- Never make up information - if you don't know, say so
\`\`\`

### Sales assistant

\`\`\`
You are a sales assistant for Acme SaaS platform.

- Help users understand our pricing and features
- Ask qualifying questions to recommend the right plan
- Compare our product to competitors when asked, but stay factual
- Always include a link to the pricing page when discussing plans
- Tone: professional but approachable, never pushy
\`\`\`

### Research assistant

\`\`\`
You are a research assistant. Help users find and summarize information.

- Use web search to find up-to-date information
- Always cite your sources with links
- Provide structured summaries with key takeaways
- When asked to compare options, use a table format
- Flag when information might be outdated or uncertain
\`\`\`

## Best practices

- **Be specific** - "Be friendly and concise, answer in 2-3 sentences" works better than "be helpful"
- **Keep it under 2,000 characters** - move detailed reference material to [skills](/an/docs/build/skills)
- **Reference your skills** - tell the agent when to use each attached skill by name
- **Test iteratively** - use the live chat preview in the dashboard
- **Structure with lists** - bullet points are easier for the model to follow than dense paragraphs

## When to use skills instead

If your prompt is growing past ~2,000 characters with detailed reference material - API docs, step-by-step procedures, pricing tables - move that content into [skills](/an/docs/build/skills). Keep the system prompt focused on identity, tone, and general rules. The agent will reference skills on demand without bloating every message.`,
  },
  {
    slug: "themes",
    path: "/docs/build/themes",
    title: "Themes",
    description: "Theme variables and custom theme configuration",
    section: "Build",
    markdown: `# Themes

Customize the chat UI with theme variables. The docs preview shows a few example styles, but in code the \`theme\` prop accepts a \`theme.json\` object rather than a preset string.

## Custom Themes

Create a \`theme.json\` file with three sections: \`theme\`, \`light\`, and \`dark\`:

\`\`\`json
{
  "theme": {},
  "light": {},
  "dark": {}
}
\`\`\`

Pass it to the component:

\`\`\`tsx
import theme from "./theme.json"

<AgentChat theme={theme} />
\`\`\`

## Theme Properties

- **theme** - shared CSS variables such as typography, spacing, and display options
- **light** - light-mode color variables
- **dark** - dark-mode color variables`,
  },
  {
    slug: "threads",
    path: "/docs/deploy/logs",
    title: "Threads",
    description: "Browse individual chat sessions, inspect dialogs, and debug errors in real time",
    section: "Deploy & Operate",
    markdown: `# Threads

Browse individual chat sessions, inspect every dialog turn, and debug errors from the Threads view.

## Overview

The Threads page in the dashboard shows every chat session for the selected agent. Each session contains one or more dialogs (conversation turns), and you can drill down into any turn to see the full message history, token usage, cost, and duration.

Active streams are highlighted with a real-time indicator, and the view auto-refreshes while dialogs are streaming.

## Session Table

The main view lists all chat sessions for the selected agent.

| Column | Description |
|---|---|
| Created | When the chat session started |
| Status | Active (green) or Error (red) badge based on dialog outcomes |
| Chat ID | Client project ID - click to copy |
| Dialogs | Number of conversation turns in the session |

## Filtering & Search

- **Status filter** - show All, Active, or Error to quickly find conversations that need attention
- **Date range** - presets (last hour, 24h, 7d, 30d) or custom range
- **Search** - paste a Chat ID to jump to a specific session (debounced)

## Chat Details

Click any row to open a detail sidebar showing Chat ID, Agent, Created, Total tokens, Total cost, and Total duration. Below the summary is a dialog table - one row per turn.

## Dialog View

The dialog detail view shows per-turn metrics and the full conversation replay.

- **Input tokens** - Tokens sent to the model
- **Output tokens** - Tokens generated by the model
- **Cost** - USD cost for this turn
- **Duration** - Execution time in milliseconds

If a dialog failed, an error message is displayed in a highlighted block. Below the metrics, you can replay the full conversation including rendered tool calls.

## Live Monitoring

When any dialog is actively streaming, the toolbar shows a pulsing blue **Live** indicator. The selected project auto-refreshes every 2 seconds while streams are active.

| Status | Indicator | Description |
|---|---|---|
| Streaming | Blue pulse | Dialog is actively generating a response |
| Completed | Green dot | Dialog finished successfully |
| Error | Red dot | Dialog failed with an error |
| Cancelled | Gray dot | Dialog was stopped by the user |`,
  },
  {
    slug: "observability",
    path: "/docs/deploy/observability",
    title: "Observability",
    description: "Monitor agent activity, track costs and token usage, and identify issues",
    section: "Deploy & Operate",
    markdown: `# Observability

High-level view of your agent activity - session counts, cost tracking, error rates, and usage trends.

## Overview

The dashboard gives you two levels of visibility into your agents. This page covers the high-level metrics. For drilling into individual sessions and conversation turns, see [Logs](/an/docs/deploy/logs).

## Dashboard layout

The overview chart at the top shows sessions and dialogs over time - toggle between the two views. Below it, three metric cards track cost, duration, and errors.

- **Cost** - Total USD spend over the selected period.
- **Duration** - Average execution time per dialog.
- **Errors** - Error rate (%) and absolute count. Recent errors are listed below the cards.

## Date range filtering

All metrics can be filtered by date range: 1h, 24h, 7d, 30d, or a custom range. Granularity auto-adjusts (hourly for short ranges, daily for longer ones).

## Live monitoring

When any dialog is actively streaming, a pulsing blue **Live** indicator appears next to the date picker. The dashboard auto-refreshes while streams are active.

## Debugging tips

- **Recent errors** - scroll below the metric cards to see the latest errors with timestamps
- **Cost spikes** - switch between date ranges to narrow down when costs jumped, then drill into [Logs](/an/docs/deploy/logs)
- **Slow responses** - check the Duration card, then replay slow dialogs in Logs`,
  },
  {
    slug: "security-overview",
    path: "/docs/security/overview",
    title: "Security",
    description: "How the 21st Agents runtime isolates agent execution, protects secrets, and controls access to tools and model providers",
    section: "Security & Access",
    markdown: `# Security

How the 21st Agents runtime isolates agent execution, protects secrets, and controls access to tools and model providers.

## Trust model

Running an AI agent that can execute code, read files, and call external services creates a trust problem. The runtime splits every session into two layers:

- **Agent process (untrusted)** - The Claude Code process that runs shell commands, scripts, package installs, and code execution. It lives inside an isolated container and never holds real provider credentials or tool secrets.
- **Sandbox Manager (trusted)** - The control layer that prepares the session, starts the agent, manages streaming, proxies tool and MCP calls, and controls access to secrets and model providers.

The part that orchestrates the session is never the same part that runs the untrusted agent workload.

## Runtime isolation

Each session gets its own sandboxed E2B environment. Inside that sandbox, the agent process runs in a separate execution container — it does not run directly on the sandbox host or in the same process as the Sandbox Manager.

The execution container is further isolated with gVisor (\`runsc\`), adding an extra kernel-level boundary beyond the standard container boundary.

## File access

Project files are prepared on the sandbox host side. The Sandbox Manager creates the workspace and writes runtime files before the agent starts. That workspace is then bind-mounted into the execution container as the agent's working directory.

The agent sees the real project through a mounted workspace, not a copied snapshot. It can read, edit, create, and execute files — but all of that happens inside the isolated container.

## Model access

The agent process does not call Anthropic or OpenRouter directly. Instead, the sandbox receives a short-lived proxy token and uses it to call the 21st private proxy service. The proxy forwards the request upstream with the real provider credentials attached.

| What the agent gets | What stays on the proxy |
|---|---|
| Short-lived proxy token | Real \`ANTHROPIC_API_KEY\` |
| Access to inference | Provider account credentials |
| Scoped, time-limited access | OpenRouter and other upstream keys |

## Tools & MCP isolation

Tool and MCP requests follow a different route from model inference. The agent process does not connect to integrations directly — all requests go through the Sandbox Manager.

The Sandbox Manager starts MCP servers on the host side (both local stdio and remote servers), manages their lifecycle, and proxies requests from the agent container. It also injects the current environment variables for that execution and sends only the result back into the agent session.

**Key boundary:** The agent can use real integrations, but tool-side secrets and MCP credentials never live inside the untrusted agent process.

## Secrets & credentials

API keys authenticate your app's requests via a short-lived JWT exchange — the raw key never reaches the browser. Environment variables are injected by the Sandbox Manager into tool execution only, so the agent process never has direct access to secrets.

See [API Keys & Env Vars](/an/docs/security/api-keys) for key formats, token exchange flow, safety practices, and environment variable management.

## Summary

| Resource | Agent gets | Boundary |
|---|---|---|
| Workspace | Full file access via bind-mount | Isolated container + gVisor |
| Model | Short-lived proxy token | Private proxy service |
| Tools & MCPs | Proxied through Sandbox Manager | Host-side gateway |
| Secrets | Never directly accessible | Sandbox Manager injects at execution |`,
  },
  {
    slug: "api-keys",
    path: "/docs/security/api-keys",
    title: "API Keys & Environment Variables",
    description: "How to create, use, and protect API keys and manage environment variables for your agents",
    section: "Security & Access",
    markdown: `# API Keys & Environment Variables

How to create, use, and protect API keys that authenticate your app's requests, and how to manage environment variables for your agents.

## API keys

API keys are team-scoped credentials that authenticate your app's requests to the 21st Agents platform. You create and manage them in the dashboard under the API tab.

- **Format** - \`21st_sk_\` prefix + 64 hex characters. Legacy \`an_sk_\` keys still work.
- **Scope** - Each key is scoped to a single team
- **Visibility** - The full key is shown only once at creation. Store it securely.
- **Revocation** - Deactivate a key instantly from the dashboard. Active sessions using that key will stop working.

## Token exchange flow

Your API key should never be exposed in client-side code. Instead, use a server-side token route that exchanges the API key for a short-lived JWT token:

1. Client calls your backend → POST /api/an-token
2. Backend uses API key → client.tokens.create({ agent })
3. Backend returns JWT → short-lived, scoped token
4. Client uses JWT → passed to AgentChat / SDK

\`\`\`typescript
// app/api/an-token/route.ts
import { AgentClient } from "@21st-sdk/node"
import { NextResponse } from "next/server"

const client = new AgentClient({
  apiKey: process.env.API_KEY_21ST!,
})

export async function POST() {
  const token = await client.tokens.create({ agent: "my-agent" })
  return NextResponse.json(token)
}
\`\`\`

The [Get Started](/an/docs/get-started) guide walks through this setup step by step.

## Key safety practices

| Do | Don't |
|---|---|
| Store in \`.env.local\` or secret manager | Commit to git or hardcode in source |
| Use the token exchange route | Pass \`API_KEY_21ST\` to the browser |
| Rotate keys periodically | Share keys between environments |
| Deactivate unused keys immediately | Leave old keys active "just in case" |

## Environment variables

Environment variables let you pass secrets (database URLs, third-party API keys) to your agent's tools without exposing them to the agent process. The [Sandbox Manager](/an/docs/security/overview) injects them at tool execution time only.

## Managing env vars

There are two ways to configure environment variables:

- **Dashboard** - Open your agent in the dashboard, go to the Environment tab, and add key-value pairs. Changes take effect on the next sandbox session.
- **CLI** - Use \`@21st-sdk/cli env\` to list, set, or remove variables from your terminal. Ideal for CI/CD and scripted workflows.

\`\`\`bash
# list configured env vars
npx @21st-sdk/cli env list my-agent

# set or update one key
npx @21st-sdk/cli env set my-agent OPENAI_API_KEY sk-live-...

# set or update multiple keys
npx @21st-sdk/cli env set my-agent OPENAI_API_KEY=sk-live-... ANTHROPIC_API_KEY=sk-ant-...

# remove a key
npx @21st-sdk/cli env remove my-agent OPENAI_API_KEY
\`\`\`

## Isolation

Env vars set via the dashboard or CLI are not ordinary environment variables inside the agent process. They are injected by the Sandbox Manager into tool execution only — tools that need a database connection or third-party API key get the value at call time, but the agent itself cannot read them from \`process.env\`.

This means even if the agent is tricked into inspecting its own environment, tool secrets remain hidden. See [Security](/an/docs/security/overview) for the full trust model.`,
  },
  {
    slug: "api-reference",
    path: "/docs/api-reference",
    title: "API Reference",
    description: "REST API overview, authentication, conventions, and endpoint index",
    section: "Reference",
    markdown: `# API Reference

REST API for the 21st Agents runtime. Manage sandboxes, threads, files, and stream chat responses.

## Base URL

\`\`\`
https://relay.an.dev
\`\`\`

All API requests use HTTPS. Request and response bodies are JSON-encoded.

## Authentication

All endpoints require a bearer token via the \`Authorization\` header:

\`\`\`
Authorization: Bearer <your_api_key>
\`\`\`

## Conventions

- Property names use \`camelCase\`.
- Timestamps are ISO 8601 strings (e.g. \`2026-02-26T12:00:00Z\`).
- IDs are prefixed strings (\`sb_\` for sandboxes, \`th_\` for threads).
- The chat endpoint returns Server-Sent Events (SSE) for streaming.
- Errors return structured JSON with \`code\`, \`message\`, and \`status\` fields.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /v1/sandboxes | Create sandbox |
| GET | /v1/sandboxes/:id | Get sandbox |
| DELETE | /v1/sandboxes/:id | Delete sandbox |
| POST | /v1/sandboxes/:id/exec | Execute command |
| POST | /v1/sandboxes/:id/files | Write files |
| GET | /v1/sandboxes/:id/files | Read file |
| POST | /v1/sandboxes/:id/git/clone | Clone repository |
| GET | /v1/sandboxes/:id/threads | List threads |
| POST | /v1/sandboxes/:id/threads | Create thread |
| GET | /v1/sandboxes/:id/threads/:threadId | Get thread |
| DELETE | /v1/sandboxes/:id/threads/:threadId | Delete thread |
| POST | /v1/chat/:slug | Send message (SSE) |
| GET | /v1/chat/:slug/:sandboxId/stream | Resume stream |
| DELETE | /v1/chat/:slug/:sandboxId/stream | Cancel stream |
`,
  },
  {
    slug: "api-reference-sandboxes",
    path: "/docs/api-reference/sandboxes",
    title: "Sandboxes API",
    description: "Create, retrieve, and delete sandbox environments",
    section: "Reference",
    markdown: `# Sandboxes API

A sandbox is a persistent runtime environment with its own filesystem, git state, and sessions.

## Create Sandbox

\`POST /v1/sandboxes\`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| agent | string | Yes | Agent slug |
| files | object | No | Map of file path to content |
| envs | object | No | Environment variables |
| setup | string[] | No | Shell commands to run after creation |

Response: \`{ "id": "sb_abc123", "sandboxId": "e2b-sandbox-id", "status": "active", "createdAt": "..." }\`

## Get Sandbox

\`GET /v1/sandboxes/:id\`

Returns sandbox details including agent info, threads list, status, and timestamps.

## Delete Sandbox

\`DELETE /v1/sandboxes/:id\`

Deletes the sandbox and cascades deletion to all threads. Returns 204 No Content.
`,
  },
  {
    slug: "api-reference-sandbox-operations",
    path: "/docs/api-reference/sandbox-operations",
    title: "Sandbox Operations API",
    description: "Execute commands, read/write files, and clone git repos inside a sandbox",
    section: "Reference",
    markdown: `# Sandbox Operations API

Run commands, read/write files, and clone repos inside a sandbox.

## Execute Command

\`POST /v1/sandboxes/:id/exec\`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| command | string | Yes | Shell command to execute |
| cwd | string | No | Working directory |
| envs | object | No | Additional environment variables |
| timeoutMs | number | No | Timeout in milliseconds (default: 30000) |

Response: \`{ "stdout": "...", "stderr": "", "exitCode": 0 }\`

## Write Files

\`POST /v1/sandboxes/:id/files\`

Body: \`{ "files": [{ "path": "/home/user/workspace/hello.txt", "content": "Hello world!" }] }\`

## Read File

\`GET /v1/sandboxes/:id/files?path=/home/user/workspace/hello.txt\`

Response: \`{ "path": "...", "content": "..." }\`

## Clone Repository

\`POST /v1/sandboxes/:id/git/clone\`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| url | string | Yes | Git repository URL |
| path | string | No | Target directory |
| token | string | No | Auth token for private repos |
| depth | number | No | Clone depth (1 for shallow) |
`,
  },
  {
    slug: "api-reference-threads",
    path: "/docs/api-reference/threads",
    title: "Threads API",
    description: "List, create, retrieve, and delete conversation threads within a sandbox",
    section: "Reference",
    markdown: `# Threads API

A thread is a conversation within a sandbox. Each thread has its own message history, status, and cost tracking.

## List Threads

\`GET /v1/sandboxes/:id/threads\`

Returns all threads within a sandbox.

## Create Thread

\`POST /v1/sandboxes/:id/threads\`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| name | string | No | Display name for the thread |

## Get Thread

\`GET /v1/sandboxes/:id/threads/:threadId\`

Returns thread details with full message history.

## Delete Thread

\`DELETE /v1/sandboxes/:id/threads/:threadId\`

Deletes the thread and its message history. Returns 204 No Content.
`,
  },
  {
    slug: "api-reference-chat",
    path: "/docs/api-reference/chat",
    title: "Chat API",
    description: "SSE streaming chat endpoint with AI SDK compatibility",
    section: "Reference",
    markdown: `# Chat API

SSE streaming chat endpoint with AI SDK compatibility.

## Send Message

\`POST /v1/chat/:slug\`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| messages | Message[] | Yes | Array of message objects |
| sandboxId | string | No | Existing sandbox ID |
| threadId | string | No | Existing thread ID (requires sandboxId) |
| options | object | No | Per-request runtime overrides |

### Behavior

- **sandboxId + threadId:** continue an existing thread in a sandbox.
- **sandboxId only:** creates a new thread in the existing sandbox.
- **No sandbox/thread:** creates a new sandbox and thread automatically.
- **threadId without sandboxId:** returns 400 error.

### Options

| Option | Type | Description |
|--------|------|-------------|
| systemPrompt | object | System prompt override (type, preset, append) |
| maxTurns | number | Maximum agent turns |
| maxBudgetUsd | number | Maximum cost in USD |
| disallowedTools | string[] | Tools the agent cannot use |

### SSE Response Format

\`\`\`
data: {"type":"start"}
data: {"type":"text-start","id":"..."}
data: {"type":"text-delta","id":"...","delta":"Hello world"}
data: {"type":"text-end","id":"..."}
data: {"type":"message-metadata","messageMetadata":{"sessionId":"...","totalCostUsd":0.034}}
data: {"type":"finish"}
data: [DONE]
\`\`\`

## Resume Stream

\`GET /v1/chat/:slug/:sandboxId/stream\`

Reconnect to an active SSE stream.

## Cancel Stream

\`DELETE /v1/chat/:slug/:sandboxId/stream\`

Cancel an active stream. Returns 204 No Content.
`,
  },
  {
    slug: "api-reference-errors",
    path: "/docs/api-reference/errors",
    title: "Error Codes",
    description: "HTTP status codes, error response format, and error codes",
    section: "Reference",
    markdown: `# Error Codes

All error responses follow a consistent JSON format:

\`\`\`json
{ "error": { "code": "invalid_request", "message": "...", "status": 400 } }
\`\`\`

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 204 | No Content (deleted) |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

## Error Codes

| Code | Description |
|------|-------------|
| invalid_request | Malformed request body or missing required fields |
| unauthorized | Invalid, expired, or missing API key |
| forbidden | Insufficient permissions |
| not_found | Resource does not exist |
| rate_limit_exceeded | Too many requests |
| sandbox_error | Sandbox runtime error |
| budget_exceeded | Exceeded a configured budget limit |
| stream_active | A stream is already active for this sandbox |
`,
  },
  {
    slug: "messages-and-history",
    path: "/docs/knowledge-base/messages-and-history",
    title: "Messages & History",
    description: "How message persistence works, lazy loading history, and restoring conversations on mount",
    section: "Knowledge Base",
    markdown: `# Messages & History

How message persistence works, lazy loading history, and restoring conversations on mount.

## How are messages stored?

Messages are stored on 21st Agents side in our database. When you send a message, we persist both your message and the agent's response. You can retrieve the full history via \`client.threads.get({ sandboxId, threadId })\`.

## How does message sending work under the hood?

On each \`sendMessage\` call, you send the full conversation history plus the new message. The platform feeds only the last message to the agent - Claude already knows the full history from its local conversation file. The full history you send is what gets persisted in our database.

## How do I restore history on page mount?

After mounting your chat component, fetch the existing messages using \`client.threads.get()\` and pass them to the AI SDK. This lets users see previous conversation when they return to the page.

## Is lazy loading of message history supported?

Lazy loading for scrolling through long histories is on the roadmap. Currently, you fetch the full thread history on mount.

## Can I have multiple conversation threads?

Yes. Create multiple threads within the same sandbox. Each thread has its own message history while sharing the same sandbox environment.`,
  },
  {
    slug: "sandboxes",
    path: "/docs/knowledge-base/sandboxes",
    title: "Sandboxes & Infrastructure",
    description: "Sandbox specs, shared volumes, lifecycle hooks, concurrent users, and persistent storage",
    section: "Knowledge Base",
    markdown: `# Sandboxes & Infrastructure

Sandbox specs, shared volumes, lifecycle hooks, concurrent users, and persistent storage.

## What are the sandbox hardware specs?

Default sandboxes run with up to 8 CPU and 8 GB RAM. For higher specs, contact support for a custom plan through E2B.

## What happens when two users write in the same chat?

Last user wins. Each API call spawns a separate Claude process. If two users send messages to the same thread simultaneously, both receive their own responses, but Claude's internal conversation file retains the history from whichever request finishes last. Use separate threads within the same sandbox to avoid conflicts.

## Can I share files between sandboxes?

E2B supports shared volumes backed by S3. You can also reuse a single sandbox with multiple threads, or build a custom solution using a tool that uploads/downloads from S3 or Supabase Storage.

## One sandbox with multiple threads vs. multiple sandboxes?

One sandbox, multiple threads - shared filesystem, good for shared state. Multiple sandboxes - fully isolated, good for heavy compute. Use shared volumes if you need common files across sandboxes.

## Are there sandbox lifecycle hooks (onResume / onPause)?

Lifecycle hooks are on the roadmap. Use startup scripts in your agent's \`template/\` directory for initialization logic.

## What happens when a sandbox times out?

Idle sandboxes are destroyed after a timeout. The next message automatically creates a new sandbox. The agent URL stays the same.`,
  },
  {
    slug: "troubleshooting",
    path: "/docs/knowledge-base/troubleshooting",
    title: "Troubleshooting",
    description: "Common issues: missing messages, auth errors, tool permissions, deploy failures",
    section: "Knowledge Base",
    markdown: `# Troubleshooting

Common issues and how to fix them.

## The API returns fewer messages than expected

Make sure you're sending the full message history on each \`sendMessage\` call. The platform persists whatever history you send.

## Auth & token issues

- **401 Unauthorized** - API key missing or invalid. Re-run \`an login\`.
- **Token exchange failing** - ensure \`/api/an-token\` route calls \`createTokenHandler\` with a valid key.

## Agent not responding

- **Sandbox expired** - idle sandboxes are destroyed. Next message creates a new one.
- **Max turns reached** - increase \`maxTurns\` in config or per-request.
- **Budget exceeded** - increase \`maxBudgetUsd\` or remove the limit.

## Tool permission errors

Check permission mode. Use \`bypass\` for autonomous agents in isolated sandboxes.

## Deploy fails

- **Missing entry point** - ensure \`agents/<slug>/index.ts\` exists with \`agent()\` default export.
- **Invalid API key** - re-run \`an login\`.
- **Bundle too large** - avoid heavy dependencies in agent entry point.`,
  },
  {
    slug: "best-practices",
    path: "/docs/knowledge-base/best-practices",
    title: "Best Practices",
    description: "Optimizing cost, choosing between skills and system prompts, and security considerations",
    section: "Knowledge Base",
    markdown: `# Best Practices

Optimizing cost, choosing between skills and system prompts, and security considerations.

## Optimizing Cost

- **Use the right model** - Haiku for simple tasks, Sonnet/Opus for complex reasoning.
- **Set \`maxTurns\`** - limit reasoning steps to prevent runaway conversations.
- **Set \`maxBudgetUsd\`** - cap per-request spend.
- **Keep system prompts concise** - move detailed reference material to skills.

## Skills vs System Prompt

System prompt for identity, tone, and general rules (under 2,000 chars). Skills for detailed reference material - loaded on demand, reducing per-message token usage.

## Security

- Never expose API keys client-side - use \`createTokenHandler\`.
- Only use \`bypass\` permission mode in fully isolated sandboxes.
- Only enable tools your agent needs.
- Use the dashboard for secrets, never hardcode them.`,
  },
  {
    slug: "claude-code-agent",
    path: "/docs/knowledge-base/claude-code-agent",
    title: "Claude Code Agent",
    description: "How to build, deploy, and embed a production AI agent powered by Claude Code with 21st SDK",
    section: "Knowledge Base",
    markdown: `# Claude Code Agent

How to build, deploy, and embed a production AI agent powered by Claude Code - sandboxing, streaming, custom tools, and React UI.

## What is Claude Code and why run it as a production agent?

Claude Code (the Claude Agent SDK) is Anthropic's agentic runtime with built-in tools for file I/O, terminal, web search, and multi-step reasoning. 21st SDK wraps it with cloud sandboxing, SSE streaming, auth, and a React chat component so you can ship production agents.

## How do I run Claude Code in an E2B cloud sandbox?

Define your agent, deploy with one CLI command, and the platform provisions E2B sandboxes on demand. Each sandbox is an isolated Linux environment with full terminal, network access, and persistence.

## How do I define a Claude Code agent?

Use the agent() function from @21st-sdk/agent with model, runtime, systemPrompt, tools, permissionMode, maxTurns, and maxBudgetUsd options.

## How do I deploy a Claude Code agent to production?

Run npx @21st-sdk/cli login and npx @21st-sdk/cli deploy. No Docker, no Kubernetes.

## How does streaming work with a Claude Code agent?

The platform streams via Server-Sent Events (SSE), compatible with Vercel AI SDK. Text, tool calls, tool results, and thinking blocks all stream in real time.

## How do I add a chat UI for my Claude Code agent in React / Next.js?

Install @21st-sdk/nextjs and @21st-sdk/react, create a token route with createTokenHandler, and use the AgentChat component.

## How do I add custom tools to a Claude Code agent?

Define tools using the tool() function with Zod schemas. They run inside the E2B sandbox alongside the agent.

## How do I control costs and prevent runaway API spend?

Use maxBudgetUsd for per-conversation caps, maxTurns to limit loops, and disallowedTools to restrict tool access.

## How do I monitor and debug my Claude Code agent in production?

The 21st dashboard provides session logs, token and cost tracking, live monitoring, and error tracking.`,
  },
]

export function getDocByPath(path: string): DocPage | undefined {
  return AN_DOC_PAGES.find((p) => p.path === path)
}

export function getAllDocs(): DocPage[] {
  return AN_DOC_PAGES
}
