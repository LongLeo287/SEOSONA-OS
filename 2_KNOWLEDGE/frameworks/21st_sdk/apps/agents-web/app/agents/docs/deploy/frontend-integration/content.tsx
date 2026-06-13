import { AgentsLink as Link } from "@/components/agents-link"
import { CodeBlock } from "@/components/features/agents/an/docs/code-block"
import { CopyMarkdownButton } from "@/components/features/agents/an/docs/copy-markdown-button"

const INSTALL = `pnpm add @21st-sdk/nextjs
# also installs @21st-sdk/react, ai, @ai-sdk/react`

const TOKEN_ROUTE = `// app/api/an-token/route.ts
import { createTokenHandler } from "@21st-sdk/nextjs/server"

export const POST = createTokenHandler({
  apiKey: process.env.API_KEY_21ST!,
})`

const BASIC_PAGE = `"use client"

import { useChat } from "@ai-sdk/react"
import { createAgentChat, AgentChat } from "@21st-sdk/nextjs"
import "@21st-sdk/react/styles.css"

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
      onSend={(msg) => handleSubmit(undefined, { body: msg })}
      status={status}
      onStop={stop}
      error={error ?? undefined}
    />
  )
}`

const CREATE_AGENT_CHAT_OPTIONS = `const chat = createAgentChat({
  // Required
  agent: "my-agent",

  // Token exchange — pick one:
  tokenUrl: "/api/an-token",         // POST endpoint returning { token, expiresAt }
  // getToken: async () => "...",     // custom token fetcher

  // Optional
  apiUrl: "https://relay.an.dev",    // default relay URL
  sandboxId: "sbx_...",              // persistent sandbox for file/session sharing
  threadId: "thr_...",               // specific thread within sandbox
  onFinish: () => {},                // called when agent finishes
  onError: (error) => {},            // called on error
})`

const PER_MESSAGE_OPTIONS = `import { useChat } from "@ai-sdk/react"

const { handleSubmit } = useChat({ chat })

// Override agent options for a specific message
handleSubmit(undefined, {
  body: {
    role: "user",
    content: "Review this code for bugs",
    options: {
      model: "claude-opus-4-6",
      maxTurns: 4,
      maxBudgetUsd: 0.5,
      disallowedTools: ["Bash", "Write"],
      systemPrompt: {
        type: "preset",
        preset: "claude_code",
        append: "You are reviewing code. Do not edit files.",
      },
    },
  },
})`

const CUSTOM_TOOL_RENDERER = `import type { CustomToolRendererProps } from "@21st-sdk/react"

function WeatherRenderer({ name, input, output, status }: CustomToolRendererProps) {
  if (status === "pending" || status === "streaming") {
    return <div>Fetching weather for {input.city as string}...</div>
  }

  const data = output as { temp: number; condition: string }
  return (
    <div className="rounded-lg border p-3">
      <p className="font-medium">{input.city as string}</p>
      <p>{data.temp}°F — {data.condition}</p>
    </div>
  )
}

// Pass to AgentChat
<AgentChat
  toolRenderers={{ get_weather: WeatherRenderer }}
  {...rest}
/>`

const SANDBOX_THREADS = `"use client"

import { useState, useEffect, useMemo } from "react"
import { useChat } from "@ai-sdk/react"
import { createAgentChat, AgentChat } from "@21st-sdk/nextjs"
import "@21st-sdk/react/styles.css"

export default function Page() {
  const [sandboxId, setSandboxId] = useState<string | null>(null)
  const [threadId, setThreadId] = useState<string | null>(null)

  // Create sandbox on mount
  useEffect(() => {
    const stored = localStorage.getItem("sandboxId")
    if (stored) {
      setSandboxId(stored)
      return
    }
    fetch("/api/agent/sandbox", { method: "POST" })
      .then((r) => r.json())
      .then(({ sandboxId }) => {
        localStorage.setItem("sandboxId", sandboxId)
        setSandboxId(sandboxId)
      })
  }, [])

  // Create or load thread
  useEffect(() => {
    if (!sandboxId) return
    fetch(\`/api/agent/threads?sandboxId=\${sandboxId}\`)
      .then((r) => r.json())
      .then(({ threads }) => {
        if (threads.length > 0) {
          setThreadId(threads[0].id)
        } else {
          return fetch("/api/agent/threads", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sandboxId, name: "Main" }),
          }).then((r) => r.json())
            .then(({ id }) => setThreadId(id))
        }
      })
  }, [sandboxId])

  const chat = useMemo(() => {
    if (!sandboxId || !threadId) return null
    return createAgentChat({
      agent: "my-agent",
      tokenUrl: "/api/an-token",
      sandboxId,
      threadId,
    })
  }, [sandboxId, threadId])

  const { messages, handleSubmit, status, stop, error } = useChat({
    chat: chat ?? undefined,
  })

  if (!chat) return <div>Loading...</div>

  return (
    <AgentChat
      messages={messages}
      onSend={(msg) => handleSubmit(undefined, { body: msg })}
      status={status}
      onStop={stop}
      error={error ?? undefined}
    />
  )
}`

export function FrontendIntegrationContent() {
  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            Frontend Integration
          </h1>
          <CopyMarkdownButton />
        </div>
        <p className="mt-1.5 text-[14px] text-muted-foreground leading-relaxed max-w-[520px]">
          Add an agent chat to your Next.js app with the React SDK — install,
          create a token route, drop in the chat component.
        </p>
      </div>

      {/* Install */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Install</h2>
        <CodeBlock code={INSTALL} language="bash" />
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          This also installs{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px] font-mono">
            @21st-sdk/react
          </code>{" "}
          with all UI components. Peer dependencies:{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px] font-mono">
            ai
          </code>
          ,{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px] font-mono">
            @ai-sdk/react
          </code>
          .
        </p>
      </section>

      {/* Token Route */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Token route</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The SDK exchanges your secret API key for short-lived JWT tokens
          server-side, so credentials are never exposed to the browser.
        </p>
        <CodeBlock
          code={TOKEN_ROUTE}
          language="typescript"
          filename="app/api/an-token/route.ts"
        />
        <div className="rounded-lg border border-border bg-secondary/30 p-3.5 text-[13px] text-muted-foreground leading-relaxed">
          <span className="font-medium text-foreground">Important:</span>{" "}
          Set{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">
            API_KEY_21ST
          </code>{" "}
          in your{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">
            .env.local
          </code>
          . Get your key from the{" "}
          <Link
            href="/agents/app"
            className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            dashboard
          </Link>
          . Never expose this key in client-side code.
        </div>
      </section>

      {/* Basic Chat */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Chat component</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Create a chat instance with{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">
            createAgentChat
          </code>
          , connect it to{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">
            useChat
          </code>{" "}
          from AI SDK, and render{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">
            AgentChat
          </code>
          .
        </p>
        <CodeBlock
          code={BASIC_PAGE}
          language="typescript"
          filename="app/page.tsx"
        />
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          Don&apos;t forget to import{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px] font-mono">
            @21st-sdk/react/styles.css
          </code>{" "}
          — it provides the base styles for the chat UI.
        </p>
      </section>

      {/* createAgentChat options */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">createAgentChat options</h2>
        <CodeBlock code={CREATE_AGENT_CHAT_OPTIONS} language="typescript" />
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-3 py-2 text-left text-[11px] font-medium text-muted-foreground">
                  Option
                </th>
                <th className="px-3 py-2 text-left text-[11px] font-medium text-muted-foreground">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { option: "agent", desc: "Agent slug from the dashboard (required)" },
                { option: "tokenUrl", desc: "POST endpoint that returns { token, expiresAt }. Tokens are cached for 1 min." },
                { option: "getToken", desc: "Custom async function returning a token string. Alternative to tokenUrl." },
                { option: "sandboxId", desc: "Persistent sandbox ID — lets the agent access the same filesystem across sessions." },
                { option: "threadId", desc: "Thread within the sandbox — separate conversation with shared files." },
              ].map((row, i, arr) => (
                <tr key={row.option} className={i < arr.length - 1 ? "border-b border-border" : ""}>
                  <td className="px-3 py-2.5">
                    <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">{row.option}</code>
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* AgentChat props */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">AgentChat props</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">
            AgentChat
          </code>{" "}
          component renders the full chat UI — messages, input bar, tool
          visualizations, and streaming.
        </p>
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-3 py-2 text-left text-[11px] font-medium text-muted-foreground">Prop</th>
                <th className="px-3 py-2 text-left text-[11px] font-medium text-muted-foreground">Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                { prop: "messages", desc: "Chat messages from useChat() (required)" },
                { prop: "onSend", desc: "Called when user sends a message (required)" },
                { prop: "status", desc: "Chat status from useChat() (required)" },
                { prop: "onStop", desc: "Stop generation callback (required)" },
                { prop: "theme", desc: "CSS variable overrides for light/dark themes" },
                { prop: "colorMode", desc: '"light" | "dark" | "auto"' },
                { prop: "classNames", desc: "Per-element CSS class overrides (root, messageList, inputBar, etc.)" },
                { prop: "slots", desc: "Replace sub-components: InputBar, UserMessage, AssistantMessage, ToolRenderer" },
                { prop: "toolRenderers", desc: "Custom renderers for specific tool names" },
                { prop: "modelSelector", desc: "Show a model picker if the agent allows model switching" },
                { prop: "attachments", desc: "File upload configuration (allowed types, max size)" },
              ].map((row, i, arr) => (
                <tr key={row.prop} className={i < arr.length - 1 ? "border-b border-border" : ""}>
                  <td className="px-3 py-2.5">
                    <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">{row.prop}</code>
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Custom Tool Renderers */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Custom tool renderers</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          When your agent calls a custom tool, render the result with your own
          React component instead of the default JSON view.
        </p>
        <CodeBlock code={CUSTOM_TOOL_RENDERER} language="typescript" filename="components/weather-renderer.tsx" />
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-3 py-2 text-left text-[11px] font-medium text-muted-foreground">Prop</th>
                <th className="px-3 py-2 text-left text-[11px] font-medium text-muted-foreground">Type</th>
                <th className="px-3 py-2 text-left text-[11px] font-medium text-muted-foreground">Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                { prop: "name", type: "string", desc: "Tool name" },
                { prop: "input", type: "Record<string, unknown>", desc: "Tool input arguments" },
                { prop: "output", type: "unknown | undefined", desc: "Tool output (undefined while pending)" },
                { prop: "status", type: '"pending" | "streaming" | "success" | "error"', desc: "Execution status" },
              ].map((row, i, arr) => (
                <tr key={row.prop} className={i < arr.length - 1 ? "border-b border-border" : ""}>
                  <td className="px-3 py-2.5">
                    <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">{row.prop}</code>
                  </td>
                  <td className="px-3 py-2.5">
                    <code className="text-[11px] font-mono text-muted-foreground">{row.type}</code>
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Per-message options */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Per-message options</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Override agent runtime settings for individual messages — switch
          models, limit cost, or restrict tools for specific tasks.
        </p>
        <CodeBlock code={PER_MESSAGE_OPTIONS} language="typescript" />
      </section>

      {/* Sandbox + threads */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Persistent sandboxes and threads</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          For apps where the agent needs to remember files or hold multiple
          conversations, create a sandbox on the server and pass its ID to the
          chat. Use threads for separate conversations within the same sandbox.
        </p>
        <CodeBlock code={SANDBOX_THREADS} language="typescript" filename="app/page.tsx" />
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          The sandbox and thread API routes use the{" "}
          <Link
            href="/agents/docs/deploy/backend-integration"
            className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            Server SDK
          </Link>
          . See the backend integration page for the full API.
        </p>
      </section>

      {/* What's next */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">What&apos;s next</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { title: "Backend Integration", description: "Sandbox management, threads, and running agents from your server.", href: "/agents/docs/deploy/backend-integration" },
            { title: "Themes", description: "Customize the chat UI with CSS variables.", href: "/agents/docs/build/themes" },
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
