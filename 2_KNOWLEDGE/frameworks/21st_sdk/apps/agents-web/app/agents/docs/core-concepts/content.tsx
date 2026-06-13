import { AgentsLink as Link } from "@/components/agents-link"
import { CopyMarkdownButton } from "@/components/features/agents/an/docs/copy-markdown-button"

export default function CoreConceptsPage() {
  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            Core Concepts
          </h1>
          <CopyMarkdownButton />
        </div>
        <p className="mt-1.5 text-[14px] text-muted-foreground leading-relaxed max-w-[520px]">
          The primitives that make up the 21st Agents platform and how they fit
          together.
        </p>
      </div>

      {/* Primitives at a glance */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Primitives at a glance</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 font-medium text-foreground">
                  Primitive
                </th>
                <th className="text-left py-2 pr-4 font-medium text-foreground">
                  What it is
                </th>
                <th className="text-left py-2 font-medium text-foreground">
                  Defined in
                </th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {[
                [
                  "Agent",
                  "A code-first config defining what the AI can do",
                  "Your code",
                ],
                [
                  "Tool",
                  "A capability the agent can invoke (built-in or custom)",
                  "Your code + runtime",
                ],
                [
                  "Skill",
                  "Reference knowledge the agent can draw on when needed",
                  "Your code",
                ],
                [
                  "System Prompt",
                  "Instructions sent with every message defining agent behavior",
                  "Your code / per-request",
                ],
                [
                  "Sandbox",
                  "An isolated E2B environment with its own filesystem and runtime",
                  "Platform (auto-provisioned)",
                ],
                [
                  "Thread",
                  "A single conversation within a sandbox",
                  "Platform (auto-created or explicit)",
                ],
                [
                  "Relay",
                  "The runtime service that connects your app to the agent",
                  "Platform (managed)",
                ],
                [
                  "API Key",
                  "Team-scoped credential for authenticating requests",
                  "Dashboard",
                ],
              ].map(([name, desc, where]) => (
                <tr key={name} className="border-b border-border/50">
                  <td className="py-2 pr-4 font-medium text-foreground">
                    {name}
                  </td>
                  <td className="py-2 pr-4">{desc}</td>
                  <td className="py-2 whitespace-nowrap">{where}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* How it works */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">How it works</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          When a user sends a message, your app calls the Chat API. The platform
          routes the message to the{" "}
          <strong className="text-foreground font-medium">Relay</strong>, which
          provisions an E2B sandbox, starts the runtime, runs the agent with
          your tools and instructions, and streams the response back via SSE.
        </p>
        <div className="overflow-hidden rounded-lg border border-border bg-secondary/30 p-5">
          <pre className="text-[12px] font-mono text-muted-foreground leading-[1.7] whitespace-pre overflow-x-auto">
            {`Your App
  └─ AgentChat component (or raw SDK)
        │
        ▼  SSE streaming (11 event types)
    Relay (auth, routing, cost tracking)
        │
        ▼
    E2B Sandbox
        ├─ Agent runtime (Claude Code / Codex)
        │     ├─ System prompt + skills
        │     ├─ Built-in tools (Bash, Read, Write, Glob, Grep, WebSearch...)
        │     └─ Custom tools (your Zod-schema functions)
        ├─ MCP servers
        ├─ Isolated filesystem
        └─ Thread(s) → messages, tokens, cost`}
          </pre>
        </div>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          Everything in between &mdash; auth, sandboxing, token counting, cost
          tracking, session persistence &mdash; is handled by the platform.
        </p>
      </section>

      {/* Agents */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Agent</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          <strong className="text-foreground font-medium">
            A configuration that defines what the AI can do and how it behaves.
          </strong>{" "}
          Agents are code-first &mdash; you define them in TypeScript (model,
          system prompt, tools, permissions) and deploy with{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px] font-mono">
            @21st-sdk/cli deploy
          </code>
          . The agent config lives in{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px] font-mono">
            agents/&lt;slug&gt;/index.ts
          </code>
          .
        </p>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          An agent contains: a model, a runtime, a system prompt, tools,
          permission settings, cost controls (
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px] font-mono">
            maxTurns
          </code>
          ,{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px] font-mono">
            maxBudgetUsd
          </code>
          ), and optional lifecycle hooks.
        </p>
        <div className="rounded-lg border border-border bg-secondary/30 p-4 text-[13px] text-muted-foreground leading-relaxed">
          The{" "}
          <Link
            href="/agents/app"
            className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            dashboard
          </Link>{" "}
          is for API keys, environment variables, and monitoring &mdash;
          not for creating or editing agent behavior. See{" "}
          <Link
            href="/agents/docs/build/agents"
            className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            Agent Customization
          </Link>{" "}
          for the full config reference.
        </div>
      </section>

      {/* Tools */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Tools</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          <strong className="text-foreground font-medium">
            A capability the agent can invoke to interact with the world.
          </strong>{" "}
          Tools come in three flavors:
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              label: "Built-in tools",
              description:
                "Bash, Read, Write, Edit, Glob, Grep, WebSearch, WebFetch - enabled by default with the Claude Code runtime",
            },
            {
              label: "Custom tools",
              description:
                "Your own functions defined with Zod schemas in the agent config - run inside the sandbox",
            },
            {
              label: "MCP servers",
              description:
                "External integrations (databases, APIs, GitHub, Slack) connected via the Model Context Protocol",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-border p-3.5"
            >
              <p className="text-[13px] font-medium">{item.label}</p>
              <p className="mt-0.5 text-[12px] text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          The agent decides which tools to call based on the user&apos;s message
          and its system prompt. Tool calls are streamed in real time (
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px] font-mono">
            tool-input-start
          </code>
          ,{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px] font-mono">
            tool-output-available
          </code>
          ). See{" "}
          <Link
            href="/agents/docs/build/tools-and-mcps"
            className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            Tools and MCPs
          </Link>{" "}
          for setup.
        </p>
      </section>

      {/* Skills */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Skills</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          <strong className="text-foreground font-medium">
            Reference knowledge the agent can draw on when needed.
          </strong>{" "}
          Unlike the system prompt (sent every turn), skills act as on-demand
          context &mdash; the agent loads them when relevant. Skills are defined
          in your agent code via{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px] font-mono">
            Sandbox({"{"} files {"}"})
          </code>{" "}
          and deployed alongside the agent config.
        </p>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          For example, a &ldquo;Returns Policy&rdquo; skill with detailed
          procedures can be attached to a support agent. In the system prompt
          you say: &ldquo;When the user asks about returns, follow the Returns
          Policy skill.&rdquo; The agent gets full context without bloating
          every message.
        </p>
        <p className="text-[13px] text-muted-foreground">
          See the{" "}
          <Link
            href="/agents/docs/build/skills"
            className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            Skills
          </Link>{" "}
          page for details.
        </p>
      </section>

      {/* Sandbox */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Sandbox</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          <strong className="text-foreground font-medium">
            An isolated E2B environment with its own filesystem, git state, and
            runtime processes.
          </strong>{" "}
          The sandbox ties together the agent config, the execution environment,
          and your tools. Each sandbox is a dedicated microVM with full network
          access.
        </p>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          Tools and MCP servers run inside the sandbox alongside the agent, but
          the agent process itself is isolated from that runtime layer. Dashboard
          env vars are available to tools without becoming ordinary env vars
          inside the agent process.
        </p>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          Sandboxes persist across page refreshes and messages. To start from
          scratch, create a new sandbox. For hardware specs, timeouts, and file
          sharing, see the{" "}
          <Link
            href="/agents/docs/knowledge-base/sandboxes"
            className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            Sandboxes FAQ
          </Link>
          .
        </p>
      </section>

      {/* Thread */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Thread</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          <strong className="text-foreground font-medium">
            A single conversation within a sandbox.
          </strong>{" "}
          A sandbox can contain multiple threads. Each thread tracks:
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              label: "Messages",
              description:
                "User input, assistant response, and tool calls",
            },
            {
              label: "Status",
              description: "streaming, completed, error, or cancelled",
            },
            {
              label: "Token usage",
              description: "Input tokens, output tokens, and total",
            },
            {
              label: "Cost & duration",
              description: "USD cost and execution time in milliseconds",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-border p-3.5"
            >
              <p className="text-[13px] font-medium">{item.label}</p>
              <p className="mt-0.5 text-[12px] text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          If you keep one thread per sandbox, you can omit{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">
            threadId
          </code>{" "}
          on chat requests and the relay will resume the latest thread. To start
          a fresh conversation in the same environment, create a new thread. For
          message storage and history, see the{" "}
          <Link
            href="/agents/docs/knowledge-base/messages-and-history"
            className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            Messages & History FAQ
          </Link>
          .
        </p>
      </section>

      {/* Relay */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Relay</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          <strong className="text-foreground font-medium">
            The managed runtime service sitting between your app and the agent.
          </strong>{" "}
          It takes care of:
        </p>
        <ol className="list-decimal pl-5 space-y-1.5 text-[13px] text-muted-foreground leading-relaxed">
          <li>
            Authenticating the request and resolving the agent config
          </li>
          <li>
            Provisioning the E2B sandbox and starting the runtime processes
          </li>
          <li>Starting user tools and MCP servers</li>
          <li>
            Running the agent in an isolated execution layer
          </li>
          <li>
            Streaming the response back via Server-Sent Events
          </li>
          <li>
            Persisting session state so the agent can resume across turns
          </li>
        </ol>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          You don&apos;t interact with Relay directly &mdash; the SDK handles
          it. But understanding that it exists helps when debugging latency or
          connection issues.
        </p>
      </section>

      {/* Streaming */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Streaming</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Every chat response is delivered as a{" "}
          <strong className="text-foreground font-medium">
            Server-Sent Events (SSE)
          </strong>{" "}
          stream, compatible with the Vercel AI SDK. The stream emits 11 event
          types that let you render text tokens, tool calls, and metadata in
          real time.
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
        <div className="rounded-lg border border-border bg-secondary/30 p-4 text-[13px] text-muted-foreground leading-relaxed">
          <p>
            <strong className="font-medium text-foreground">
              Typical flow:
            </strong>{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-[11px] font-mono">
              start
            </code>{" "}
            &rarr; text blocks &rarr; tool call cycle (input start &rarr; input
            deltas &rarr; input available &rarr; output available) &rarr; more
            text blocks &rarr;{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-[11px] font-mono">
              message-metadata
            </code>{" "}
            &rarr;{" "}
            <code className="rounded bg-secondary px-1 py-0.5 text-[11px] font-mono">
              finish
            </code>
            . Tool call cycles repeat as the agent uses tools. See the{" "}
            <Link
              href="/agents/docs/api-reference/chat"
              className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
            >
              Chat API reference
            </Link>{" "}
            for the full SSE payload format, stream resumption, and
            cancellation.
          </p>
        </div>
      </section>

      {/* API Keys */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">API Keys</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          <strong className="text-foreground font-medium">
            Team-scoped credentials that authenticate your app&apos;s requests.
          </strong>{" "}
          You create them in the dashboard under the{" "}
          <span className="font-medium text-foreground">API</span> tab.
        </p>
        <div className="rounded-lg border border-border bg-secondary/30 p-4 text-[13px] text-muted-foreground leading-relaxed space-y-2">
          <p>
            <span className="font-medium text-foreground">Format:</span>{" "}
            <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">
              21st_sk_
            </code>{" "}
            followed by 64 hex characters. Legacy an_sk_ keys still work.
          </p>
          <p>
            <span className="font-medium text-foreground">Scope:</span> Each
            key is scoped to a team
          </p>
          <p>
            <span className="font-medium text-foreground">Auth flow:</span>{" "}
            Your backend exchanges the API key for a short-lived JWT token via{" "}
            <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">
              /api/an/token
            </code>
            , then passes the token to the client
          </p>
        </div>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          Never expose your API key in client-side code. The{" "}
          <Link
            href="/agents/docs/get-started"
            className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            Get Started
          </Link>{" "}
          guide shows how to set up the token exchange route.
        </p>
      </section>

      {/* CTA */}
      <div className="rounded-xl border border-dashed border-border bg-sidebar p-6 text-center space-y-3">
        <div>
          <p className="text-[15px] font-medium">
            Ready to build your agent?
          </p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Install the SDK and add the chat component in under 5 minutes.
          </p>
        </div>
        <Link
          href="/agents/docs/get-started"
          className="an-focus-btn inline-flex items-center gap-1.5 rounded-[10px] bg-foreground px-4 py-1.5 text-[13px] font-medium text-background transition-all duration-150 hover:opacity-90 active:scale-[0.99]"
        >
          Get Started
        </Link>
      </div>

      {/* What's next */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">What&apos;s next</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { title: "Agents", description: "Custom tools, lifecycle hooks, and full configuration.", href: "/agents/docs/build/agents" },
            { title: "Skills", description: "Reusable instruction blocks for on-demand agent context.", href: "/agents/docs/build/skills" },
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
