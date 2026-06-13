import type { AgentProviderId } from "@/components/features/agents/an/types"
import type { DocsCodeLanguage } from "@/lib/atoms/agents-docs"

export interface PromptConfig {
  agentName?: string
  systemPrompt?: string
  runtime?: AgentProviderId
}

const API_KEY_PLACEHOLDER = "21st_sk_..."

export function getEnvCode(apiKey?: string) {
  return `API_KEY_21ST=${apiKey ?? API_KEY_PLACEHOLDER}`
}

export function getTokenRouteCode() {
  return `import { createTokenHandler } from "@21st-sdk/nextjs/server"

export const POST = createTokenHandler({
  apiKey: process.env.API_KEY_21ST!,
})`
}

export function getUsageCode(slug: string, hasTheme: boolean) {
  const themeImport = hasTheme ? `\nimport theme from "./theme.json"` : ""
  const themeProp = hasTheme ? `\n      theme={theme}` : ""

  return `"use client"

import { AgentChat, createAgentChat } from "@21st-sdk/nextjs"
import { useChat } from "@ai-sdk/react"${themeImport}

const chat = createAgentChat({
  agent: "${slug}",
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
      error={error ?? undefined}${themeProp}
    />
  )
}`
}

const AGENT_INIT = `npm init -y
npm install @21st-sdk/agent zod`

function getModelByRuntime(runtime: AgentProviderId = "claude-code") {
  if (runtime === "codex") {
    return "gpt-5.4/medium"
  }

  return "claude-sonnet-4-6"
}

function getAgentCode(config?: PromptConfig) {
  const model = getModelByRuntime(config?.runtime)
  const systemPrompt = config?.systemPrompt?.trim() || "You are a helpful coding assistant."
  return `import { agent, tool } from "@21st-sdk/agent"
import { z } from "zod"

export default agent({
  model: "${model}",
  systemPrompt: ${JSON.stringify(systemPrompt)},
  tools: {
    add: tool({
      description: "Add two numbers",
      inputSchema: z.object({ a: z.number(), b: z.number() }),
      execute: async ({ a, b }) => ({
        content: [{ type: "text", text: \`\${a + b}\` }],
      }),
    }),
  },
})`
}

const DEPLOY_COMMANDS = `npx @21st-sdk/cli login
npx @21st-sdk/cli deploy`

const NODE_INSTALL_COMMAND =
  "pnpm add @21st-sdk/agent @21st-sdk/nextjs @21st-sdk/react @21st-sdk/node @ai-sdk/react ai zod"

const NODE_SDK_USAGE = `import { AgentClient } from "@21st-sdk/node"

const client = new AgentClient({ apiKey: process.env.API_KEY_21ST! })

// Create a sandbox for an agent
const sandbox = await client.sandboxes.create({ agent: "my-agent" })

// Create a thread in the sandbox
const thread = await client.threads.create({
  sandboxId: sandbox.id,
  name: "Chat 1",
})

// Create a short-lived token for client-side use
const token = await client.tokens.create({ agent: "my-agent" })`

const PYTHON_SDK_USAGE = `import os

from twentyfirst_sdk import AgentClient

client = AgentClient(api_key=os.environ["API_KEY_21ST"])

# Create a sandbox and thread for a persistent terminal/server session.
sandbox = client.sandboxes.create(agent="my-agent")
thread = client.threads.create(sandbox_id=sandbox.id, name="Chat 1")

# Launch the agent against that thread.
run = client.threads.run(
    agent="my-agent",
    sandbox_id=sandbox.id,
    thread_id=thread.id,
    messages=[
        {
            "role": "user",
            "parts": [
                {"type": "text", "text": "Review the latest PR comments."},
            ],
        },
    ],
)

try:
    for raw_line in run.response.iter_lines(decode_unicode=True):
        if raw_line:
            print(raw_line)
finally:
    run.response.close()`

const GO_SDK_USAGE = `package main

import (
	"bufio"
	"context"
	"log"
	"os"

	agents "github.com/21st-dev/21st-sdk-go"
)

func main() {
	ctx := context.Background()
	client := agents.NewAgentClient(os.Getenv("API_KEY_21ST"))

	sandbox, err := client.Sandboxes.Create(ctx, &agents.CreateSandboxRequest{
		Agent: "my-agent",
	})
	if err != nil {
		log.Fatal(err)
	}

	thread, err := client.Threads.Create(ctx, sandbox.ID, "Chat 1")
	if err != nil {
		log.Fatal(err)
	}

	run, err := client.Threads.Run(ctx, &agents.RunThreadRequest{
		Agent:     "my-agent",
		SandboxID: sandbox.ID,
		ThreadID:  thread.ID,
		Messages: []agents.RunThreadMessage{
			{
				Role: "user",
				Parts: []map[string]interface{}{
					{"type": "text", "text": "Review the latest PR comments."},
				},
			},
		},
	})
	if err != nil {
		log.Fatal(err)
	}
	defer run.Response.Body.Close()

	scanner := bufio.NewScanner(run.Response.Body)
	for scanner.Scan() {
		if line := scanner.Text(); line != "" {
			log.Println(line)
		}
	}
	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}
}`

const GET_STARTED_LANGUAGE_CONTENT: Record<
  DocsCodeLanguage,
  {
    intro: string
    envFilename: string
    envFileDescription: string
    envUsageSuffix: string
    postDeployDescription: string
    supportsClientSetup: boolean
    sdkInstallStep?: {
      title: string
      command: string
    }
    serverSdk: {
      title: string
      packageName: string
      description: string
      code: string
      filename: string
      language: "go" | "python" | "typescript"
    }
  }
> = {
  typescript: {
    intro: "Create an agent, deploy it, and add it to your Next.js app.",
    envFilename: ".env.local",
    envFileDescription: "file.",
    envUsageSuffix: "(step 2) and the token route (step 4).",
    postDeployDescription: "Your agent is now live. Next, integrate it into your app.",
    supportsClientSetup: true,
    sdkInstallStep: {
      title: "Install the SDK",
      command: NODE_INSTALL_COMMAND,
    },
    serverSdk: {
      title: "Server-side SDK",
      packageName: "@21st-sdk/node",
      description:
        "for server-side sandbox and thread management — creating sandboxes, listing threads, and generating tokens.",
      code: NODE_SDK_USAGE,
      filename: "server.ts",
      language: "typescript",
    },
  },
  python: {
    intro: "Create an agent, deploy it, and connect to it from your Python server.",
    envFilename: ".env",
    envFileDescription: "file or environment variables.",
    envUsageSuffix: "(step 2) and the Python server SDK example below.",
    postDeployDescription: "Your agent is now live. Next, connect to it from your server.",
    supportsClientSetup: false,
    sdkInstallStep: {
      title: "Install the Python SDK",
      command: "pip install 21st-sdk",
    },
    serverSdk: {
      title: "Use the server-side SDK",
      packageName: "21st-sdk",
      description:
        "for sandbox, thread, and streaming run management from Python. Method arguments use snake_case, while response fields stay camelCase.",
      code: PYTHON_SDK_USAGE,
      filename: "server.py",
      language: "python",
    },
  },
  go: {
    intro: "Create an agent, deploy it, and connect to it from your Go server.",
    envFilename: ".env",
    envFileDescription: "file or environment variables.",
    envUsageSuffix: "(step 2) and the Go server SDK example below.",
    postDeployDescription: "Your agent is now live. Next, connect to it from your server.",
    supportsClientSetup: false,
    sdkInstallStep: {
      title: "Install the Go SDK",
      command: "go get github.com/21st-dev/21st-sdk-go",
    },
    serverSdk: {
      title: "Use the server-side SDK",
      packageName: "github.com/21st-dev/21st-sdk-go",
      description:
        "for sandbox, thread, token, and streaming run management from Go. The client exposes Go-style methods and exported structs for the relay API.",
      code: GO_SDK_USAGE,
      filename: "main.go",
      language: "go",
    },
  },
}

export const AN_SDK_SKILL = `---
name: 21st-sdk
description: Use for any interaction with @21st-sdk packages or 21st Agents. If the task involves files in ./agents/, it most likely refers to 21st SDK.
---

# 21st SDK / 21st Agents

1. For any @21st-sdk or 21st Agents task, fetch \`https://21st-search-engine.fly.dev/help\` first.
2. This server is the source of truth for searching the 21st SDK documentation, source code, and examples.
3. Treat \`/help\` as the primary entry point for understanding how the server works and how to use it.`

export function generateIntegrationMarkdown(
  slug: string,
  apiKey: string | undefined,
  themeJson: string | null,
  docsCodeLanguage: DocsCodeLanguage = "typescript",
  config?: PromptConfig,
) {
  const languageContent = GET_STARTED_LANGUAGE_CONTENT[docsCodeLanguage]
  const agentName = config?.agentName?.trim() || slug
  let md = `# Get Started\n\n`
  md += `${languageContent.intro}\n\n`
  md += `Agent: **${agentName}** (\`${slug}\`)\n\n`
  md += `## 0. Configure the 21st-sdk skill (REQUIRED, DO THIS FIRST)\n\n`
  md += `Before running any setup steps below, create/register this skill in your coding agent and use it as the source of truth for 21st Agents docs:\n\n`
  md += `\`\`\`md\n${AN_SDK_SKILL}\n\`\`\`\n\n`
  md += `After this skill is configured, use the search server for docs and code lookup, starting with \`/help\`.\n\n`

  md += `## Your credentials\n\n`
  md += `Add your API key to \`${languageContent.envFilename}\` ${languageContent.envFileDescription} The API key is used for \`an login\` ${languageContent.envUsageSuffix}\n\n`
  md += `${languageContent.envFilename}\n\`\`\`bash\n${getEnvCode(apiKey)}\n\`\`\`\n\n`

  md += `## 1. Create your agent\n\n`
  md += `\`\`\`bash\n${AGENT_INIT}\n\`\`\`\n\n`
  md += `Create \`src/agent.ts\`:\n\n`
  md += `src/agent.ts\n\`\`\`typescript\n${getAgentCode(config)}\n\`\`\`\n\n`
  md += `See [Agents](https://21st.dev/agents/docs/build/agents) for all configuration options, entry points, and project structure.\n\n`

  md += `## 2. Deploy\n\n`
  md += `Log in with your API key, then deploy:\n\n`
  md += `\`\`\`bash\n${DEPLOY_COMMANDS}\n\`\`\`\n\n`
  md += `${languageContent.postDeployDescription}\n\n`

  if (languageContent.sdkInstallStep) {
    md += `## 3. ${languageContent.sdkInstallStep.title}\n\n`
    md += `\`\`\`bash\n${languageContent.sdkInstallStep.command}\n\`\`\`\n\n`
  }

  if (languageContent.supportsClientSetup) {
    md += `## 4. Create a token route\n\n`
    md += `The SDK exchanges your secret API key for short-lived tokens server-side, so credentials are never exposed to the browser.\n\n`
    md += `app/api/an-token/route.ts\n\`\`\`typescript\n${getTokenRouteCode()}\n\`\`\`\n\n`

    let stepNum = 5
    if (themeJson) {
      md += `## ${stepNum}. Add your theme\n\n`
      md += `Save the generated theme from your agent's visual config.\n\n`
      md += `app/theme.json\n\`\`\`json\n${themeJson}\n\`\`\`\n\n`
      stepNum++
    }

    md += `## ${stepNum}. Add the chat component\n\n`
    md += `Use \`createAgentChat\` to connect to your agent and \`<AgentChat>\` to render the UI. It handles streaming, tools, and theming automatically.\n\n`
    md += `app/page.tsx\n\`\`\`tsx\n${getUsageCode(slug, !!themeJson)}\n\`\`\`\n\n`
    md += `## Components\n\n`
    md += `| Component | Description |\n`
    md += `| --- | --- |\n`
    md += `| \`<AgentChat />\` | Full chat interface with messages, input, and tool rendering. |\n`
    md += `| \`<MessageList />\` | Standalone message list for custom layouts. |\n`
    md += `| \`<InputBar />\` | Chat input with submit handling. |\n`
    md += `| \`<ToolRenderer />\` | Individual tool call renderer with expand/collapse. |\n`
  }

  md += `## ${languageContent.serverSdk.title}\n\n`
  md += `Use \`${languageContent.serverSdk.packageName}\` ${languageContent.serverSdk.description}\n\n`
  md += `${languageContent.serverSdk.filename}\n\`\`\`${languageContent.serverSdk.language}\n${languageContent.serverSdk.code}\n\`\`\`\n\n`
  md += `For the full runtime SDK surface, see [Server SDK](https://21st.dev/agents/docs/reference/server).\n\n`

  return md.trim()
}
