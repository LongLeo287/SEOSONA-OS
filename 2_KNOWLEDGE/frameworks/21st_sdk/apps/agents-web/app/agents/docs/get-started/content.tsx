"use client"

import { AgentsLink as Link } from "@/components/agents-link"
import { CodeBlock } from "@/components/features/agents/an/docs/code-block"
import { CopyMarkdownButton } from "@/components/features/agents/an/docs/copy-markdown-button"
import { CheckIcon, CopyIcon } from "@/components/features/agents/an/docs/icons"
import {
  AN_SDK_SKILL,
  generateIntegrationMarkdown,
} from "@/components/features/agents/an/utils/generate-integration-markdown"
import type { DocsCodeLanguage } from "@/lib/atoms/agents-docs"
import { anSelectedAgentAtom } from "@/lib/atoms/an-agent"
import { useAgentsSession } from "@/lib/agents/auth/client"
import { selectedTeamIdAtom } from "@/lib/atoms/team"
import { AN_TEMPLATES } from "@/lib/constants/agents-templates"
import { cn } from "@/lib/utils"
import { agentsHref } from "@/lib/utils/agents-href"
import { api } from "@/trpc/client"
import { useAtomValue } from "jotai"
import { CategorizedTemplateGrid } from "@/components/features/agents/an/docs/template-card"
import { BookText } from "lucide-react"
import { useTheme } from "next-themes"
import { useCallback, useEffect, useMemo, useState } from "react"
import * as shiki from "shiki"

let highlighterPromise: Promise<shiki.Highlighter> | null = null
const getHighlighter = () => {
  if (!highlighterPromise) {
    highlighterPromise = shiki.createHighlighter({
      themes: ["vesper", "github-light"],
      langs: ["bash"],
    })
  }
  return highlighterPromise
}

function useHighlightedBash(code: string) {
  const [html, setHtml] = useState("")
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  const highlight = useCallback(async () => {
    try {
      const h = await getHighlighter()
      const result = h.codeToHtml(code, {
        lang: "bash",
        theme: isDark ? "vesper" : "github-light",
      })
      setHtml(result)
    } catch {
      setHtml("")
    }
  }, [code, isDark])

  useEffect(() => {
    highlight()
  }, [highlight])

  return { html, isDark }
}

const vesperLightOverrides = `
.install-code .shiki span[style*="color:#24292e"] { color: #000000 !important; }
.install-code .shiki span[style*="color:#d73a49"] { color: #495057 !important; font-weight: 500; }
.install-code .shiki span[style*="color:#032f62"] { color: #146C43 !important; }
.install-code .shiki span[style*="color:#6f42c1"] { color: #C2410C !important; }
.install-code .shiki span[style*="color:#005cc5"] { color: #C2410C !important; }
.install-code .shiki span[style*="color:#e36209"] { color: #C2410C !important; }
.install-code .shiki span[style*="color:#6a737d"] { color: #6C757D !important; }
`

const AGENT_CODE = `import { agent, tool } from "@21st-sdk/agent"
import { z } from "zod"

export default agent({
  model: "claude-sonnet-4-6",
  systemPrompt: "You are a helpful coding assistant.",
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

const GO_AGENT_CODE = `package myagent

import (
	"context"
	"fmt"

	agent "github.com/21st-dev/21st-sdk-go/agent"
)

type AddInput struct {
	A float64 \`json:"a"\`
	B float64 \`json:"b"\`
}

var Agent = agent.New(agent.Config{
	Model:        "claude-sonnet-4-6",
	SystemPrompt: "You are a helpful coding assistant.",
	Tools: agent.Tools{
		"add": agent.Tool(agent.ToolConfig[AddInput]{
			Description: "Add two numbers",
			Execute: func(_ context.Context, input AddInput, _ agent.ToolContext) (agent.CallToolResult, error) {
				return agent.CallToolResult{
					Content: []agent.ToolResultContent{
						{Type: "text", Text: fmt.Sprintf("%g", input.A+input.B)},
					},
				}, nil
			},
		}),
	},
})`

const DEPLOY_COMMANDS = `npx @21st-sdk/cli login
npx @21st-sdk/cli deploy`

const GO_AGENT_INSTALL_COMMAND = "go get github.com/21st-dev/21st-sdk-go/agent"

const PACKAGE_MANAGERS = ["pnpm", "npm", "yarn", "bun"] as const
type PackageManager = (typeof PACKAGE_MANAGERS)[number]

const NODE_INSTALL_COMMANDS: Record<PackageManager, string> = {
  npm: "npm install @21st-sdk/agent @21st-sdk/nextjs @21st-sdk/react @21st-sdk/node @ai-sdk/react ai zod",
  pnpm: "pnpm add @21st-sdk/agent @21st-sdk/nextjs @21st-sdk/react @21st-sdk/node @ai-sdk/react ai zod",
  yarn: "yarn add @21st-sdk/agent @21st-sdk/nextjs @21st-sdk/react @21st-sdk/node @ai-sdk/react ai zod",
  bun: "bun add @21st-sdk/agent @21st-sdk/nextjs @21st-sdk/react @21st-sdk/node @ai-sdk/react ai zod",
}

const SERVER_ONLY_INSTALL_COMMANDS: Record<PackageManager, string> = {
  npm: "npm install @21st-sdk/agent zod",
  pnpm: "pnpm add @21st-sdk/agent zod",
  yarn: "yarn add @21st-sdk/agent zod",
  bun: "bun add @21st-sdk/agent zod",
}

function getTokenRouteCode() {
  return `import { createTokenHandler } from "@21st-sdk/nextjs/server"

export const POST = createTokenHandler({
  apiKey: process.env.API_KEY_21ST!,
})`
}

function getUsageCode(slug: string, hasTheme: boolean) {
  const themeImport = hasTheme ? `\nimport theme from "./theme.json"` : ""
  const themeProp = hasTheme ? `\n      theme={theme}` : ""

  return `"use client"

import { AgentChat, createAgentChat } from "@21st-sdk/nextjs"
import { useChat } from "@ai-sdk/react"${themeImport}

const sandboxId = "sb_abc123" // Returned by your server

const chat = createAgentChat({
  agent: "${slug}",
  tokenUrl: "/api/an-token",
  sandboxId,
  // Optional: continue a specific thread inside this sandbox
  // threadId: "uuid-of-existing-thread",
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

const FRONTEND_RUNTIME_OPTIONS_EXAMPLE = `"use client"

import { AgentChat, createAgentChat } from "@21st-sdk/nextjs"
import { useChat } from "@ai-sdk/react"

const sandboxId = "sb_abc123" // Returned by your server

const chat = createAgentChat({
  agent: "my-agent",
  tokenUrl: "/api/an-token",
  sandboxId,
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
}`

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

const INSTALL_COMMANDS: Record<
  DocsCodeLanguage,
  Record<PackageManager, string>
> = {
  typescript: NODE_INSTALL_COMMANDS,
  python: SERVER_ONLY_INSTALL_COMMANDS,
  go: SERVER_ONLY_INSTALL_COMMANDS,
}

const GET_STARTED_LANGUAGE_CONTENT: Record<
  DocsCodeLanguage,
  {
    intro: string
    envFilename: string
    envFileDescription: string
    envUsageSuffix: string
    postDeployDescription: string
    supportsClientSetup: boolean
    serverSdk: {
      step: string | null
      packageName: string
      description: string
      installCommand?: string
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
    envUsageSuffix: "(step 2) and the token route (step 3).",
    postDeployDescription:
      "Your agent is now live. Next, integrate it into your app.",
    supportsClientSetup: true,
    serverSdk: {
      step: null,
      packageName: "@21st-sdk/node",
      description:
        "for server-side sandbox and thread management - creating sandboxes, listing threads, and generating tokens.",
      code: NODE_SDK_USAGE,
      filename: "server.ts",
      language: "typescript",
    },
  },
  python: {
    intro:
      "Create an agent, deploy it, and connect to it from your Python server.",
    envFilename: ".env",
    envFileDescription: "file or environment variables.",
    envUsageSuffix: "(step 2) and the Python server SDK example below.",
    postDeployDescription:
      "Your agent is now live. Next, connect to it from your server.",
    supportsClientSetup: false,
    serverSdk: {
      step: "3.",
      packageName: "21st-sdk",
      description:
        "for sandbox, thread, and streaming run management from Python. Method arguments use snake_case, while response fields stay camelCase.",
      installCommand: "pip install 21st-sdk",
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
    postDeployDescription:
      "Your agent is now live. Next, connect to it from your server.",
    supportsClientSetup: false,
    serverSdk: {
      step: "3.",
      packageName: "github.com/21st-dev/21st-sdk-go",
      description:
        "for sandbox, thread, token, and streaming run management from Go. The client exposes Go-style methods and exported structs for the relay API.",
      installCommand: "go get github.com/21st-dev/21st-sdk-go",
      code: GO_SDK_USAGE,
      filename: "main.go",
      language: "go",
    },
  },
}

function getInstallCommand(
  pm: PackageManager,
  docsCodeLanguage: DocsCodeLanguage,
) {
  return INSTALL_COMMANDS[docsCodeLanguage][pm]
}

const FEATURED_TEMPLATES = AN_TEMPLATES
const EXAMPLES_MARKDOWN = FEATURED_TEMPLATES.map(
  (tmpl) =>
    `- [${tmpl.name}](/agents/docs/md/templates/${tmpl.slug}) - ${tmpl.description}`,
).join("\n")
const SKILL_MARKDOWN = `## 21st-sdk skill (IMPORTANT, ADD IT IF SUCH SKILL IS NOT CONFIGURED YET)

\`\`\`md
${AN_SDK_SKILL}
\`\`\``

function getEnvCode(apiKey?: string) {
  const lines: string[] = []
  if (apiKey) lines.push(`API_KEY_21ST=${apiKey}`)
  return lines.join("\n")
}

export function GetStartedContent({
  agentSlug: agentSlugProp,
  apiKey: apiKeyProp,
  lang,
}: {
  agentSlug?: string
  apiKey?: string
  lang: DocsCodeLanguage
}) {
  const [pm, setPm] = useState<PackageManager>("pnpm")
  const docsCodeLanguage = lang
  const languageContent = GET_STARTED_LANGUAGE_CONTENT[docsCodeLanguage]
  const isGoAgentAuthoring = docsCodeLanguage === "go"
  const [installCopied, setInstallCopied] = useState(false)
  const [promptCopied, setPromptCopied] = useState(false)
  const [skillCopied, setSkillCopied] = useState(false)
  const installCommand = isGoAgentAuthoring
    ? GO_AGENT_INSTALL_COMMAND
    : getInstallCommand(pm, docsCodeLanguage)
  const { html: installHtml, isDark } = useHighlightedBash(installCommand)

  // Auto-fetch credentials when signed in and no props provided
  const { isSignedIn } = useAgentsSession()
  const teamId = useAtomValue(selectedTeamIdAtom)
  const selectedAgent = useAtomValue(anSelectedAgentAtom)

  const needsFetch = !agentSlugProp && !apiKeyProp && !!isSignedIn

  const { data: teams } = api.teams.getUserTeams.useQuery(undefined, {
    enabled: needsFetch && !teamId,
    staleTime: 5 * 60 * 1000,
  })
  const resolvedTeamId = teamId || teams?.[0]?.id
  const canFetch = needsFetch && !!resolvedTeamId

  const { data: configs } = api.agentConfigs.listConfigs.useQuery(
    { teamId: resolvedTeamId! },
    { enabled: canFetch },
  )
  const agentConfig = selectedAgent
    ? configs?.find((c) => c.id === selectedAgent.id) || configs?.[0]
    : configs?.[0]
  const resolvedSlug = selectedAgent?.slug || agentConfig?.slug

  const agentSlug = agentSlugProp || (canFetch ? resolvedSlug : undefined)
  const apiKey = apiKeyProp

  const slug = agentSlug || "my-agent"
  const themeJson = null as string | null
  const hasCredentials = !!agentSlug && !!apiKey
  const integrationMarkdown = useMemo(
    () =>
      generateIntegrationMarkdown(slug, apiKey, themeJson, docsCodeLanguage),
    [slug, apiKey, themeJson, docsCodeLanguage],
  )
  const supportsClientSetup = languageContent.supportsClientSetup
  const agentCode = isGoAgentAuthoring ? GO_AGENT_CODE : AGENT_CODE
  const agentEntryFilename = isGoAgentAuthoring
    ? "agents/my-agent/index.go"
    : "agents/my-agent/index.ts"
  const agentCodeLanguage = isGoAgentAuthoring ? "go" : "typescript"

  const handleCopyPrompt = useCallback(() => {
    navigator.clipboard.writeText(integrationMarkdown)
    setPromptCopied(true)
    setTimeout(() => setPromptCopied(false), 2000)
  }, [integrationMarkdown])

  const handleCopySkill = useCallback(() => {
    navigator.clipboard.writeText(AN_SDK_SKILL)
    setSkillCopied(true)
    setTimeout(() => setSkillCopied(false), 2000)
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">Get Started</h1>
          <CopyMarkdownButton />
        </div>
        <p className="mt-1.5 text-[14px] text-muted-foreground">
          {languageContent.intro}
        </p>
        <div className="hidden" data-markdown={SKILL_MARKDOWN} />
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            data-copy-md
            onClick={handleCopyPrompt}
            className="an-focus-btn group relative overflow-hidden rounded-xl border border-border/70 bg-transparent px-4 py-3 text-left transition-[border-color,transform] duration-150 ease-out hover:border-foreground/20 active:scale-[0.99]"
          >
            <div
              className={cn(
                "flex items-start gap-3 transition-[opacity,transform] duration-200 ease-out",
                promptCopied
                  ? "opacity-0 -translate-y-1"
                  : "opacity-100 translate-y-0",
              )}
            >
              <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-foreground/[0.06] text-foreground">
                <CopyIcon className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-[14px] font-medium text-foreground">
                  Copy Prompt
                </span>
                <span className="mt-0.5 block text-[12px] text-muted-foreground">
                  Full integration prompt with setup steps and skill
                </span>
              </span>
            </div>
            <div
              className={cn(
                "pointer-events-none absolute inset-0 flex items-center justify-center gap-1.5 text-[13px] font-medium text-foreground transition-[opacity,transform] duration-200 ease-out",
                promptCopied
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2",
              )}
            >
              <CheckIcon className="h-4 w-4" />
              Copied
            </div>
          </button>

          <button
            data-copy-md
            onClick={handleCopySkill}
            className="an-focus-btn group relative overflow-hidden rounded-xl border border-border/70 bg-transparent px-4 py-3 text-left transition-[border-color,transform] duration-150 ease-out hover:border-foreground/20 active:scale-[0.99]"
          >
            <div
              className={cn(
                "flex items-start gap-3 transition-[opacity,transform] duration-200 ease-out",
                skillCopied
                  ? "opacity-0 -translate-y-1"
                  : "opacity-100 translate-y-0",
              )}
            >
              <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-foreground/[0.06] text-foreground">
                <BookText className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-[14px] font-medium text-foreground">
                  Copy Skill
                </span>
                <span className="mt-0.5 block text-[12px] text-muted-foreground">
                  Copy the `21st-sdk` skill for your coding agent to use the
                  docs
                </span>
              </span>
            </div>
            <div
              className={cn(
                "pointer-events-none absolute inset-0 flex items-center justify-center gap-1.5 text-[13px] font-medium text-foreground transition-[opacity,transform] duration-200 ease-out",
                skillCopied
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2",
              )}
            >
              <CheckIcon className="h-4 w-4" />
              Copied
            </div>
          </button>
        </div>
      </div>

      {/* Credentials as .env block - shown when we have real values */}
      {hasCredentials && (
        <section className="space-y-3" data-md-skip>
          <h2 className="text-[14px] font-medium text-foreground/70">
            Your credentials
          </h2>
          <p className="text-[13px] text-muted-foreground">
            Add these to your{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">
              {languageContent.envFilename}
            </code>{" "}
            {languageContent.envFileDescription} The API key is used for{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">
              @21st-sdk/cli login
            </code>{" "}
            {languageContent.envUsageSuffix}
          </p>
          <CodeBlock
            code={getEnvCode(apiKey)}
            language="bash"
            filename={languageContent.envFilename}
            secret
          />
        </section>
      )}

      {/* Step 1 - Create agent project */}
      <section className="space-y-3">
        <h2 className="text-[14px] font-medium text-foreground/70">
          <span className="mr-1.5 text-foreground/30">1.</span>
          Create your agent
        </h2>
        <div className="group/code relative overflow-hidden rounded-lg border border-border">
          {/* Floating copy button */}
          <button
            tabIndex={-1}
            onClick={() => {
              navigator.clipboard.writeText(installCommand)
              setInstallCopied(true)
              setTimeout(() => setInstallCopied(false), 2000)
            }}
            className="absolute top-1.5 right-1.5 z-10 flex size-7 cursor-pointer items-center justify-center rounded-md opacity-70 transition-[opacity,background-color] hover:bg-accent hover:opacity-100 active:scale-[0.97]"
            aria-label="Copy install command"
          >
            <div className="relative size-4">
              <CopyIcon
                className={cn(
                  "absolute inset-0 size-4 text-muted-foreground transition-[opacity,transform] duration-200 ease-out",
                  installCopied
                    ? "opacity-0 scale-50"
                    : "opacity-100 scale-100",
                )}
              />
              <CheckIcon
                className={cn(
                  "absolute inset-0 size-4 text-muted-foreground transition-[opacity,transform] duration-200 ease-out",
                  installCopied
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-50",
                )}
              />
            </div>
          </button>

          {/* Tabs row */}
          {!isGoAgentAuthoring ? (
            <div className="flex items-center gap-2 px-1 py-1 font-mono">
              <div className="flex gap-0.5">
                {PACKAGE_MANAGERS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPm(p)}
                    className={cn(
                      "an-focus-btn rounded-md px-2.5 py-1 text-[13px] font-medium transition-colors",
                      pm === p
                        ? "bg-accent/60 text-foreground"
                        : "text-muted-foreground/70 hover:text-muted-foreground",
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {/* Code */}
          {!isDark && <style>{vesperLightOverrides}</style>}
          <div className="install-code flex items-center overflow-x-auto px-4 py-3.5 font-mono text-[.8125rem]">
            <span className="select-none text-[#FFC799] mr-1.5">$</span>
            {installHtml ? (
              <div
                className="min-w-max [&_.shiki]:!bg-transparent [&_.shiki_pre]:!bg-transparent [&_.shiki_pre]:!m-0 [&_.shiki_pre]:!p-0 [&_.shiki]:!m-0 [&_.shiki]:!p-0 [&_.shiki_code]:font-mono"
                dangerouslySetInnerHTML={{ __html: installHtml }}
              />
            ) : (
              <code className="whitespace-nowrap text-foreground/80">
                {installCommand}
              </code>
            )}
          </div>
        </div>
        <p className="text-[13px] text-muted-foreground">
          Create{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">
            {agentEntryFilename}
          </code>
          :
        </p>
        <CodeBlock
          code={agentCode}
          language={agentCodeLanguage}
          filename={agentEntryFilename}
        />
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          See{" "}
          <a
            href={agentsHref("/agents/docs/build/agents")}
            className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            Project Setup
          </a>{" "}
          for all configuration options, entry points, and project structure.
        </p>
      </section>

      {/* Step 2 - Deploy */}
      <section className="space-y-3">
        <h2 className="text-[14px] font-medium text-foreground/70">
          <span className="mr-1.5 text-foreground/30">2.</span>
          Deploy
        </h2>
        {hasCredentials ? (
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            Log in with your API key from above, then deploy:
          </p>
        ) : (
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            Log in with your{" "}
            <a
              href={agentsHref("/agents/app")}
              className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
            >
              API key
            </a>{" "}
            from the dashboard, then deploy:
          </p>
        )}
        <CodeBlock code={DEPLOY_COMMANDS} language="bash" />
        <p className="text-[13px] text-muted-foreground">
          {languageContent.postDeployDescription}
        </p>
      </section>

      {supportsClientSetup && (
        <section className="space-y-3">
          <h2 className="text-[14px] font-medium text-foreground/70">
            <span className="mr-1.5 text-foreground/30">3.</span>
            Create a token route
          </h2>
          <p className="text-[13px] text-muted-foreground">
            The SDK exchanges your secret API key for short-lived tokens
            server-side, so credentials are never exposed to the browser.
            {!hasCredentials && (
              <>
                {" "}
                Get your API key from the{" "}
                <a
                  href={agentsHref("/agents/playground")}
                  className="an-focus-btn rounded text-foreground underline underline-offset-4 hover:opacity-70"
                >
                  dashboard
                </a>
                .
              </>
            )}
          </p>
          <CodeBlock
            code={getTokenRouteCode()}
            language="typescript"
            filename="app/api/an-token/route.ts"
          />
        </section>
      )}

      {/* Step 4 - Theme (only if agent has custom visual config) */}
      {supportsClientSetup && themeJson && (
        <section className="space-y-3">
          <h2 className="text-[14px] font-medium text-foreground/70">
            <span className="mr-1.5 text-foreground/30">4.</span>
            Add your theme
          </h2>
          <p className="text-[13px] text-muted-foreground">
            Save the generated theme from your agent&apos;s visual config.
            Import it in your page to match the look you configured in the{" "}
            <a
              href={
                isSignedIn
                  ? "/agents/playground?tab=visual"
                  : "/agents/theme-builder"
              }
              className="an-focus-btn rounded text-foreground underline underline-offset-4 hover:opacity-70"
            >
              Theme Builder
            </a>
            .
          </p>
          <CodeBlock
            code={themeJson}
            language="json"
            filename="app/theme.json"
            collapsible
          />
        </section>
      )}

      {/* Step 4/5 */}
      {supportsClientSetup && (
        <section className="space-y-3">
          <h2 className="text-[14px] font-medium text-foreground/70">
            <span className="mr-1.5 text-foreground/30">
              {themeJson ? "5" : "4"}.
            </span>
            Add the chat component
          </h2>
          <p className="text-[13px] text-muted-foreground">
            Use{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">
              createAgentChat
            </code>{" "}
            to connect to your agent and{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">
              {"<AgentChat>"}
            </code>{" "}
            to render the UI. It handles streaming, tools, and theming
            automatically.
          </p>
          <CodeBlock
            code={getUsageCode(slug, !!themeJson)}
            language="tsx"
            filename="app/page.tsx"
          />
        </section>
      )}

      {supportsClientSetup && (
        <section className="space-y-3">
          <h2 className="text-[14px] font-medium text-foreground/70">
            Optional: per-message runtime options
          </h2>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            Pass <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">options</code>{" "}
            inside the AI SDK request body when one browser request should run
            with different runtime settings without changing the deployed agent
            config.
          </p>
          <CodeBlock
            code={FRONTEND_RUNTIME_OPTIONS_EXAMPLE}
            language="tsx"
            filename="app/page.tsx"
          />
          <div className="rounded-lg border border-border bg-secondary/30 p-4 text-[13px] leading-relaxed text-muted-foreground">
            Currently applied by the runtime:{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">systemPrompt</code>,{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">maxTurns</code>,{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">maxBudgetUsd</code>, and{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">disallowedTools</code>.
          </div>
        </section>
      )}

      {/* Server-side SDK */}
      <section className="space-y-3">
        <h2 className="text-[14px] font-medium text-foreground/70">
          {languageContent.serverSdk.step ? (
            <>
              <span className="mr-1.5 text-foreground/30">
                {languageContent.serverSdk.step}
              </span>
              Server-side SDK
            </>
          ) : (
            "Server-side SDK"
          )}
        </h2>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          Use{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">
            {languageContent.serverSdk.packageName}
          </code>{" "}
          {languageContent.serverSdk.description}
        </p>
        {languageContent.serverSdk.installCommand && (
          <CodeBlock
            code={languageContent.serverSdk.installCommand}
            language="bash"
          />
        )}
        <CodeBlock
          code={languageContent.serverSdk.code}
          language={languageContent.serverSdk.language}
          filename={languageContent.serverSdk.filename}
        />
      </section>

      {/* Templates */}
      <section className="space-y-3">
        <h2 className="text-[14px] font-medium text-foreground/70">
          Templates
        </h2>
        <div data-markdown={EXAMPLES_MARKDOWN}>
          <CategorizedTemplateGrid templates={FEATURED_TEMPLATES} />
        </div>
      </section>

      {/* What's next */}
      <section className="space-y-4">
        <h2 className="text-[14px] font-medium text-foreground/70">
          What&apos;s next
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { title: "Agents", description: "Custom tools, lifecycle hooks, and full configuration.", href: "/agents/docs/build/agents" },
            { title: "Deploy", description: "Project structure, CLI commands, and deploy internals.", href: "/agents/docs/deploy/deploy" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="an-focus-btn group rounded-lg border border-border p-4 transition-colors hover:bg-secondary/30"
            >
              <p className="text-[13px] font-medium group-hover:text-foreground">{item.title}</p>
              <p className="mt-0.5 text-[12px] text-muted-foreground">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
