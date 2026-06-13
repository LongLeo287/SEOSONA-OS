import { AgentsLink as Link } from "@/components/agents-link"
import { CodeBlock } from "@/components/features/agents/an/docs/code-block"
import { CopyMarkdownButton } from "@/components/features/agents/an/docs/copy-markdown-button"

const AGENT_DEFINITION = `import { agent, tool } from "@21st-sdk/agent"
import { z } from "zod"

export default agent({
  model: "claude-sonnet-4-6",
  runtime: "claude-code",
  systemPrompt: "You are a helpful AI assistant.",

  // Controls what the agent can do without asking
  permissionMode: "bypassPermissions",
  maxTurns: 30,
  maxBudgetUsd: 2,

  tools: {
    searchDocs: tool({
      description: "Search documentation by query",
      inputSchema: z.object({
        query: z.string(),
        limit: z.number().optional(),
      }),
      execute: async ({ query, limit }) => {
        const results = await fetch(
          \`https://api.example.com/search?q=\${query}&limit=\${limit ?? 5}\`
        ).then((r) => r.json())
        return {
          content: [{ type: "text", text: JSON.stringify(results) }],
        }
      },
    }),
  },
})`

const DEPLOY_COMMANDS = `npx @21st-sdk/cli login     # authenticate with your API key
npx @21st-sdk/cli deploy    # bundle and deploy to E2B sandbox`

const TOKEN_ROUTE = `import { createTokenHandler } from "@21st-sdk/nextjs/server"

export const POST = createTokenHandler({
  apiKey: process.env.API_KEY_21ST!,
})`

const CHAT_COMPONENT = `"use client"

import { AgentChat, createAgentChat } from "@21st-sdk/nextjs"
import { useChat } from "@ai-sdk/react"

const chat = createAgentChat({
  agent: "my-agent",
  tokenUrl: "/api/an-token",
  sandboxId: "sb_abc123",
})

export default function Page() {
  const { messages, handleSubmit, status, stop, error } =
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
}`

const NODE_SDK_EXAMPLE = `import { AgentClient } from "@21st-sdk/node"

const client = new AgentClient({ apiKey: process.env.API_KEY_21ST! })

// Create a sandbox for your agent
const sandbox = await client.sandboxes.create({ agent: "my-agent" })

// Create a thread in the sandbox
const thread = await client.threads.create({
  sandboxId: sandbox.id,
  name: "Research Task",
})

// Generate a short-lived token for client-side use
const token = await client.tokens.create({ agent: "my-agent" })
// Pass token.token to the client (e.g. via API response)`

const PYTHON_SDK_EXAMPLE = `from twentyfirst_sdk import AgentClient
import os

client = AgentClient(api_key=os.environ["API_KEY_21ST"])

sandbox = client.sandboxes.create(agent="my-agent")
thread = client.threads.create(sandbox_id=sandbox.id, name="Chat 1")

run = client.threads.run(
    agent="my-agent",
    sandbox_id=sandbox.id,
    thread_id=thread.id,
    messages=[{
        "role": "user",
        "parts": [{"type": "text", "text": "Research this topic"}],
    }],
)

for line in run.response.iter_lines(decode_unicode=True):
    if line:
        print(line)`

const RUNTIME_OPTIONS = `const reviewOptions = {
  systemPrompt: {
    type: "preset",
    preset: "claude_code",
    append: "Focus on regressions and missing tests. Do not edit files.",
  },
  maxTurns: 4,
  maxBudgetUsd: 0.2,
  disallowedTools: ["Bash"],
}`

const CUSTOM_TOOL_EXAMPLE = `import { tool } from "@21st-sdk/agent"
import { z } from "zod"

const notifySlack = tool({
  description: "Send a Slack notification when a task is done",
  inputSchema: z.object({
    channel: z.string(),
    message: z.string(),
  }),
  execute: async ({ channel, message }) => {
    await fetch(process.env.SLACK_WEBHOOK_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel, text: message }),
    })
    return { content: [{ type: "text", text: "Sent" }] }
  },
})`

export default function ClaudeCodeAgentContent() {
  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            How to Build a Production Agent on Claude Code
          </h1>
          <CopyMarkdownButton />
        </div>
        <p className="mt-1.5 text-[14px] text-muted-foreground leading-relaxed max-w-[560px]">
          Everything you need to know about running Claude Code (Claude Agent SDK)
          in a cloud sandbox, streaming responses to a React UI, adding custom tools,
          and deploying for production use.
        </p>
      </div>

      {/* ── FAQ: What is Claude Code and why run it as an agent? ── */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">
          What is Claude Code and why run it as a production agent?
        </h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Claude Code is Anthropic&apos;s agentic coding runtime (also called the
          Claude Agent SDK). It can read and write files, run terminal commands,
          search the web, and reason through multi-step tasks autonomously. Out
          of the box, it&apos;s a local CLI &mdash; great for personal use but not for
          serving users at scale.
        </p>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          To turn it into a <strong className="text-foreground font-medium">production agent</strong> you
          need infrastructure: cloud sandboxing, SSE streaming, authentication,
          multi-tenancy, cost controls, and a chat UI. That&apos;s what 21st SDK
          provides &mdash; it wraps Claude Code in a secure E2B sandbox, handles
          the infra, and gives you a drop-in React component.
        </p>
      </section>

      {/* ── FAQ: What tools does Claude Code agent have access to? ── */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">
          What built-in tools does a Claude Code agent have access to?
        </h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          When you set{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px] font-mono">
            runtime: &quot;claude-code&quot;
          </code>{" "}
          (the default), the agent runs on the full Claude Agent SDK inside an
          E2B sandbox with these built-in tools:
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            { name: "Bash", desc: "Execute terminal commands, install packages, run scripts" },
            { name: "Read / Write / Edit", desc: "Full filesystem access within the sandbox" },
            { name: "Glob / Grep", desc: "Search files by name pattern and content" },
            { name: "WebSearch / WebFetch", desc: "Search the web and fetch any URL" },
            { name: "TodoWrite", desc: "Manage task lists for multi-step workflows" },
            { name: "Custom tools", desc: "Your own tools defined with Zod schemas (see below)" },
          ].map((item) => (
            <div
              key={item.name}
              className="rounded-lg border border-border p-3.5"
            >
              <p className="text-[13px] font-medium">{item.name}</p>
              <p className="mt-0.5 text-[12px] text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          This means your agent can clone repos, analyze codebases, write and
          execute code, research topics on the web, install dependencies, run
          tests, and interact with external APIs &mdash; all autonomously inside
          its sandbox.
        </p>
      </section>

      {/* ── FAQ: How to run Claude Code in an E2B sandbox ── */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">
          How do I run Claude Code in an E2B cloud sandbox?
        </h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          With 21st SDK you don&apos;t configure E2B manually. You define your
          agent in TypeScript, deploy with one CLI command, and the platform
          provisions E2B sandboxes automatically.
        </p>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          Each sandbox is an isolated Linux environment with:
        </p>
        <ul className="list-disc list-outside pl-5 space-y-1 text-[13px] text-muted-foreground leading-relaxed">
          <li><strong className="text-foreground font-medium">Isolated filesystem</strong> &mdash; each conversation gets its own sandbox</li>
          <li><strong className="text-foreground font-medium">Full terminal access</strong> &mdash; agent can run any command, install packages</li>
          <li><strong className="text-foreground font-medium">Network access</strong> &mdash; web search, API calls, git clone</li>
          <li><strong className="text-foreground font-medium">Persistence</strong> &mdash; sandbox state persists across messages in a conversation</li>
          <li><strong className="text-foreground font-medium">Auto-cleanup</strong> &mdash; ephemeral by default, no manual teardown</li>
        </ul>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          Permissions are auto-bypassed inside the sandbox (safe because it&apos;s
          isolated), so you don&apos;t need{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px] font-mono">
            --dangerously-skip-permissions
          </code>{" "}
          &mdash; the 21st platform handles this for you.
        </p>
      </section>

      {/* ── Step 1: Define agent ── */}
      <section className="space-y-3">
        <h2 className="text-[15px] font-medium">
          How do I define a Claude Code agent? (Step 1)
        </h2>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          Install the SDK and create your agent file. The{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">
            agent()
          </code>{" "}
          function is a pure config wrapper with full TypeScript type inference.
        </p>
        <CodeBlock code="npm install @21st-sdk/agent zod" language="bash" />
        <p className="text-[13px] text-muted-foreground">
          Create{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">
            agents/my-agent/index.ts
          </code>
          :
        </p>
        <CodeBlock
          code={AGENT_DEFINITION}
          language="typescript"
          filename="agents/my-agent/index.ts"
        />
      </section>

      {/* ── FAQ: Agent config reference ── */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">
          What configuration options does the agent() function accept?
        </h2>
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-[13px]">
            <thead className="bg-secondary/30">
              <tr>
                <th className="text-left py-2 px-3 font-medium text-foreground border-b border-border">Option</th>
                <th className="text-left py-2 px-3 font-medium text-foreground border-b border-border">Description</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr>
                <td className="py-2 px-3 border-b border-border font-mono text-[12px]">model</td>
                <td className="py-2 px-3 border-b border-border">Claude model (<code className="rounded bg-secondary px-1 py-0.5 text-[11px]">claude-sonnet-4-6</code>, <code className="rounded bg-secondary px-1 py-0.5 text-[11px]">claude-opus-4-6</code>, etc.)</td>
              </tr>
              <tr>
                <td className="py-2 px-3 border-b border-border font-mono text-[12px]">runtime</td>
                <td className="py-2 px-3 border-b border-border"><code className="rounded bg-secondary px-1 py-0.5 text-[11px]">&quot;claude-code&quot;</code> (default) &mdash; full Claude Agent SDK with file, terminal, and web tools</td>
              </tr>
              <tr>
                <td className="py-2 px-3 border-b border-border font-mono text-[12px]">systemPrompt</td>
                <td className="py-2 px-3 border-b border-border">Instructions that define the agent&apos;s personality, behavior, and constraints</td>
              </tr>
              <tr>
                <td className="py-2 px-3 border-b border-border font-mono text-[12px]">tools</td>
                <td className="py-2 px-3 border-b border-border">Custom tools defined with Zod schemas for full type safety</td>
              </tr>
              <tr>
                <td className="py-2 px-3 border-b border-border font-mono text-[12px]">permissionMode</td>
                <td className="py-2 px-3 border-b border-border"><code className="rounded bg-secondary px-1 py-0.5 text-[11px]">&quot;default&quot;</code> | <code className="rounded bg-secondary px-1 py-0.5 text-[11px]">&quot;acceptEdits&quot;</code> | <code className="rounded bg-secondary px-1 py-0.5 text-[11px]">&quot;bypassPermissions&quot;</code></td>
              </tr>
              <tr>
                <td className="py-2 px-3 border-b border-border font-mono text-[12px]">maxTurns</td>
                <td className="py-2 px-3 border-b border-border">Limit agentic turns per conversation (default 50) to prevent infinite loops</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-mono text-[12px]">maxBudgetUsd</td>
                <td className="py-2 px-3">Per-conversation cost cap in USD to control spend</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          See{" "}
          <Link
            href="/agents/docs/build/agents"
            className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            Agent Customization
          </Link>{" "}
          for the full list of options including lifecycle hooks (
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">onStart</code>,{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">onToolCall</code>,{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">onFinish</code>,{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">onError</code>).
        </p>
      </section>

      {/* ── Step 2: Deploy ── */}
      <section className="space-y-3">
        <h2 className="text-[15px] font-medium">
          How do I deploy a Claude Code agent to production? (Step 2)
        </h2>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          Log in with your{" "}
          <Link
            href="/agents/app"
            className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            API key
          </Link>{" "}
          and deploy. The CLI bundles your agent code with esbuild and pushes it
          to the 21st platform, which provisions E2B sandboxes on demand.
        </p>
        <CodeBlock code={DEPLOY_COMMANDS} language="bash" />
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          That&apos;s it. No Docker, no Kubernetes, no infra to manage. Your
          agent is live and accessible via the Chat API.
        </p>
      </section>

      {/* ── FAQ: Streaming ── */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">
          How does streaming work with a Claude Code agent?
        </h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The 21st platform streams agent responses via{" "}
          <strong className="text-foreground font-medium">
            Server-Sent Events (SSE)
          </strong>
          , compatible with the Vercel AI SDK. You don&apos;t need to set up
          WebSockets or poll for results.
        </p>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          The stream emits 11 event types that cover the full agent lifecycle:
          text tokens, tool calls with streaming input, tool results, cost
          metadata, and control signals. Here&apos;s the full list:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 font-medium text-foreground">
                  Event
                </th>
                <th className="text-left py-2 font-medium text-foreground">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {[
                ["start", "First event in every stream"],
                ["text-start", "Start of a text content block"],
                ["text-delta", "Streaming text token"],
                ["text-end", "End of text content block"],
                [
                  "tool-input-start",
                  "Agent begins calling a tool (includes tool name)",
                ],
                ["tool-input-delta", "Streaming tool input JSON"],
                [
                  "tool-input-available",
                  "Complete tool call input (parsed JSON)",
                ],
                ["tool-output-available", "Tool execution result"],
                [
                  "message-metadata",
                  "Session ID, cost (USD), tokens, duration",
                ],
                ["finish", "Stream completed successfully"],
                ["error", "Error occurred during streaming"],
              ].map(([event, desc]) => (
                <tr key={event} className="border-b border-border/50">
                  <td className="py-2 pr-4 font-mono text-[12px] text-foreground">
                    {event}
                  </td>
                  <td className="py-2">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          The{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px] font-mono">
            {"<AgentChat>"}
          </code>{" "}
          React component handles all event types automatically, including
          rendering tool call visualizations (file diffs, terminal output, web
          search results). For server-side streaming, the Node.js / Python / Go
          SDKs return a streaming response you can iterate line-by-line. See the{" "}
          <Link
            href="/agents/docs/api-reference/chat"
            className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            Chat API reference
          </Link>{" "}
          for the full SSE payload format, stream resumption, and cancellation.
        </p>
      </section>

      {/* ── Step 3: React UI ── */}
      <section className="space-y-3">
        <h2 className="text-[15px] font-medium">
          How do I add a chat UI for my Claude Code agent in React / Next.js? (Step 3)
        </h2>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          Create a server-side token route to keep your API key secure, then add
          the drop-in chat component.
        </p>
        <CodeBlock
          code={TOKEN_ROUTE}
          language="typescript"
          filename="app/api/an-token/route.ts"
        />
        <CodeBlock
          code={CHAT_COMPONENT}
          language="tsx"
          filename="app/page.tsx"
        />
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          The{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">
            {"<AgentChat>"}
          </code>{" "}
          component renders streaming markdown with syntax highlighting, tool
          call visualizations (file diffs, terminal output, web search results),
          and supports custom theming. It&apos;s compatible with Vercel AI SDK&apos;s{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">useChat</code>.
        </p>
      </section>

      {/* ── FAQ: Custom tools ── */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">
          How do I add custom tools to a Claude Code agent?
        </h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Define custom tools using the{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px] font-mono">
            tool()
          </code>{" "}
          function with a Zod schema for type-safe inputs. Your tools run inside
          the same E2B sandbox alongside the agent:
        </p>
        <CodeBlock
          code={CUSTOM_TOOL_EXAMPLE}
          language="typescript"
          filename="tools/notify-slack.ts"
        />
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          Custom tools are available to the agent alongside all built-in tools
          (Bash, Read, Write, WebSearch, etc.). The agent decides when to call
          them based on its system prompt and the user&apos;s request.
        </p>
      </section>

      {/* ── FAQ: MCP Servers ── */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">
          Can I connect MCP servers and external integrations?
        </h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Yes. Beyond built-in and custom tools, your agent can connect to{" "}
          <a
            href="https://modelcontextprotocol.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            MCP servers
          </a>{" "}
          for databases, Slack, email, GitHub, and any other external service.
          The 21st platform supports the full MCP protocol. See{" "}
          <Link
            href="/agents/docs/build/tools-and-mcps"
            className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            Tools and MCPs
          </Link>{" "}
          for setup.
        </p>
      </section>

      {/* ── FAQ: Server-side SDK ── */}
      <section className="space-y-3">
        <h2 className="text-[15px] font-medium">
          How do I control the agent from a backend (Node.js / Python / Go)?
        </h2>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          Use the server SDKs to create sandboxes, manage threads, generate
          tokens, and stream responses programmatically &mdash; for CI/CD
          pipelines, webhook handlers, or backend-only integrations.
        </p>
        <CodeBlock
          code={NODE_SDK_EXAMPLE}
          language="typescript"
          filename="server.ts"
        />
        <CodeBlock
          code={PYTHON_SDK_EXAMPLE}
          language="python"
          filename="server.py"
        />
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          SDKs available:{" "}
          <a
            href="https://www.npmjs.com/package/@21st-sdk/node"
            target="_blank"
            rel="noopener noreferrer"
            className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            Node.js
          </a>
          {", "}
          <a
            href="https://pypi.org/project/21st-sdk/"
            target="_blank"
            rel="noopener noreferrer"
            className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            Python
          </a>
          {", "}
          <a
            href="https://github.com/21st-dev/21st-sdk-go"
            target="_blank"
            rel="noopener noreferrer"
            className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            Go
          </a>
          .
        </p>
      </section>

      {/* ── FAQ: Runtime options ── */}
      <section className="space-y-3">
        <h2 className="text-[15px] font-medium">
          Can I override agent settings per message without redeploying?
        </h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Yes. Pass{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">options</code>{" "}
          in the AI SDK request body to override settings for a single request:
        </p>
        <CodeBlock
          code={RUNTIME_OPTIONS}
          language="typescript"
        />
        <div className="rounded-lg border border-border bg-secondary/30 p-4 text-[13px] text-muted-foreground leading-relaxed">
          Currently supported:{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">systemPrompt</code>,{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">maxTurns</code>,{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">maxBudgetUsd</code>, and{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px]">disallowedTools</code>.
        </div>
      </section>

      {/* ── FAQ: Cost control ── */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">
          How do I control costs and prevent runaway API spend?
        </h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The 21st platform provides multiple layers of cost control:
        </p>
        <ul className="list-disc list-outside pl-5 space-y-1.5 text-[13px] text-muted-foreground leading-relaxed">
          <li><strong className="text-foreground font-medium">maxBudgetUsd</strong> &mdash; hard per-conversation cost cap defined in agent config</li>
          <li><strong className="text-foreground font-medium">maxTurns</strong> &mdash; limits the number of agentic loops to prevent infinite tool chains</li>
          <li><strong className="text-foreground font-medium">disallowedTools</strong> &mdash; restrict which tools the agent can use per request</li>
          <li><strong className="text-foreground font-medium">Dashboard tracking</strong> &mdash; per-dialog token counts and USD costs in real time</li>
        </ul>
      </section>

      {/* ── FAQ: Comparison ── */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">
          What&apos;s the difference between raw Claude Code and 21st SDK?
        </h2>
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-[13px]">
            <thead className="bg-secondary/30">
              <tr>
                <th className="text-left py-2 px-3 font-medium text-foreground border-b border-border"></th>
                <th className="text-left py-2 px-3 font-medium text-foreground border-b border-border">Raw Claude Code CLI</th>
                <th className="text-left py-2 px-3 font-medium text-foreground border-b border-border">21st SDK + Claude Code</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {[
                ["Use case", "Local dev, personal automation", "Production agents for your users"],
                ["Execution", "Local terminal", "Cloud sandbox (E2B)"],
                ["Auth", "Local API key", "JWT tokens, team API keys"],
                ["UI", "CLI / terminal", "React chat component, theming"],
                ["Streaming", "stdout / stream-json", "SSE, Vercel AI SDK compatible"],
                ["Monitoring", "None", "Dashboard, logs, cost tracking"],
                ["Multi-tenant", "No", "Yes, per-sandbox isolation"],
                ["Custom tools", "MCP servers", "MCP + typed Zod tools"],
                ["Deployment", "Manual", "One CLI command"],
              ].map(([label, raw, sdk]) => (
                <tr key={label}>
                  <td className="py-2 px-3 border-b border-border font-medium text-foreground">{label}</td>
                  <td className="py-2 px-3 border-b border-border">{raw}</td>
                  <td className="py-2 px-3 border-b border-border">{sdk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── FAQ: Monitoring ── */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">
          How do I monitor and debug my Claude Code agent in production?
        </h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The{" "}
          <Link
            href="/agents/app"
            className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            21st dashboard
          </Link>{" "}
          gives you full observability:
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            { name: "Session logs", desc: "Every conversation with full tool call traces and outputs" },
            { name: "Cost tracking", desc: "Per-dialog input/output tokens and USD costs" },
            { name: "Live monitoring", desc: "Watch agent executions streaming in real time" },
            { name: "Error tracking", desc: "Failures, timeouts, and debug traces for every turn" },
          ].map((item) => (
            <div
              key={item.name}
              className="rounded-lg border border-border p-3.5"
            >
              <p className="text-[13px] font-medium">{item.name}</p>
              <p className="mt-0.5 text-[12px] text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
        <p className="text-[13px] text-muted-foreground">
          See{" "}
          <Link
            href="/agents/docs/deploy/observability"
            className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            Observability
          </Link>{" "}
          for details.
        </p>
      </section>

      {/* ── FAQ: Architecture ── */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">
          What is the architecture of a 21st SDK agent?
        </h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Here&apos;s how the pieces fit together:
        </p>
        <div className="overflow-hidden rounded-lg border border-border bg-secondary/30 p-5">
          <pre className="text-[12px] font-mono text-muted-foreground leading-[1.7] whitespace-pre overflow-x-auto">
{`Your App (React / Next.js / backend)
  └─ AgentChat component  or  Server SDK
        │
        ▼  SSE streaming / AI SDK protocol
    21st Relay (hosted)
        │
        ├─ Auth (JWT tokens, API keys)
        ├─ E2B Sandbox (isolated Linux env)
        │     ├─ Claude Agent SDK runtime
        │     ├─ Your custom tools
        │     ├─ MCP servers
        │     └─ Isolated filesystem
        ├─ Cost tracking & token counting
        └─ Session persistence`}
          </pre>
        </div>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          You don&apos;t interact with the Relay directly &mdash; the SDK handles
          it. Everything between your app and the agent (auth, sandboxing, tool
          execution, streaming, cost tracking) is managed by the platform.
        </p>
      </section>

      {/* ── Next steps ── */}
      <section className="space-y-3">
        <h2 className="text-[15px] font-medium">Next steps</h2>
        <ul className="space-y-2 text-[13px] text-muted-foreground leading-relaxed">
          <li>
            <Link
              href="/agents/docs/get-started"
              className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
            >
              Get Started
            </Link>{" "}
            &mdash; full setup walkthrough with install, deploy, and React integration
          </li>
          <li>
            <Link
              href="/agents/docs/build/agents"
              className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
            >
              Agent Customization
            </Link>{" "}
            &mdash; all config options, lifecycle hooks, and permission modes
          </li>
          <li>
            <Link
              href="/agents/docs/build/tools-and-mcps"
              className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
            >
              Tools and MCPs
            </Link>{" "}
            &mdash; connect external tools via Model Context Protocol
          </li>
          <li>
            <Link
              href="/agents/docs/build/sandbox"
              className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
            >
              Sandbox Customization
            </Link>{" "}
            &mdash; environment variables, pre-installed packages, filesystem setup
          </li>
          <li>
            <Link
              href="/agents/docs/templates"
              className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
            >
              Templates
            </Link>{" "}
            &mdash; real-world agent examples (lead research, docs assistant, support agent)
          </li>
          <li>
            <Link
              href="/agents/docs/api-reference"
              className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
            >
              API Reference
            </Link>{" "}
            &mdash; full Chat API and server SDK documentation
          </li>
        </ul>
      </section>

      {/* CTA */}
      <div className="rounded-xl border border-dashed border-border bg-sidebar p-6 text-center space-y-3">
        <div>
          <p className="text-[15px] font-medium">Ready to build your Claude Code agent?</p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Define your agent, deploy with one command, and add the chat UI in minutes.
          </p>
        </div>
        <Link
          href="/agents/docs/get-started"
          className="an-focus-btn inline-flex items-center gap-1.5 rounded-[10px] bg-foreground px-4 py-1.5 text-[13px] font-medium text-background transition-all duration-150 hover:opacity-90 active:scale-[0.99]"
        >
          Get Started
        </Link>
      </div>
    </div>
  )
}
