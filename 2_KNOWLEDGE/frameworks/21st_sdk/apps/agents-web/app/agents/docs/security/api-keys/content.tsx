import { AgentsLink as Link } from "@/components/agents-link"
import { CodeBlock } from "@/components/features/agents/an/docs/code-block"
import { CopyMarkdownButton } from "@/components/features/agents/an/docs/copy-markdown-button"

const TOKEN_ROUTE_CODE = `// app/api/an-token/route.ts
import { AgentClient } from "@21st-sdk/node"
import { NextResponse } from "next/server"

const client = new AgentClient({
  apiKey: process.env.API_KEY_21ST!,
})

export async function POST() {
  const token = await client.tokens.create({ agent: "my-agent" })
  return NextResponse.json(token)
}`

const ENV_CLI_CODE = `# list configured env vars
npx @21st-sdk/cli env list my-agent

# set or update one key
npx @21st-sdk/cli env set my-agent OPENAI_API_KEY sk-live-...

# set or update multiple keys
npx @21st-sdk/cli env set my-agent OPENAI_API_KEY=sk-live-... ANTHROPIC_API_KEY=sk-ant-...

# remove a key
npx @21st-sdk/cli env remove my-agent OPENAI_API_KEY`

export default function ApiKeysPage() {
  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            API Keys & Environment Variables
          </h1>
          <CopyMarkdownButton />
        </div>
        <p className="mt-1.5 text-[14px] text-muted-foreground leading-relaxed max-w-[520px]">
          How to create, use, and protect API keys that authenticate your
          app&apos;s requests, and how to manage environment variables for your
          agents.
        </p>
      </div>

      {/* API keys overview */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">API keys</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          API keys are{" "}
          <strong className="text-foreground font-medium">
            team-scoped credentials
          </strong>{" "}
          that authenticate your app&apos;s requests to the 21st Agents
          platform. You create and manage them in the dashboard under the{" "}
          <span className="font-medium text-foreground">API</span> tab.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              label: "Format",
              value: (
                <>
                  <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">
                    21st_sk_
                  </code>{" "}
                  prefix + 64 hex characters. Legacy an_sk_ keys still work.
                </>
              ),
            },
            {
              label: "Scope",
              value: "Each key is scoped to a single team",
            },
            {
              label: "Visibility",
              value:
                "The full key is shown only once at creation. Store it securely.",
            },
            {
              label: "Revocation",
              value:
                "Deactivate a key instantly from the dashboard. Active sessions using that key will stop working.",
            },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-border p-3.5">
              <p className="text-[13px] font-medium">{item.label}</p>
              <p className="mt-0.5 text-[12px] text-muted-foreground leading-relaxed">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Token exchange */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Token exchange flow</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Your API key should{" "}
          <strong className="text-foreground font-medium">
            never be exposed in client-side code
          </strong>
          . Instead, use a server-side token route that exchanges the API key
          for a short-lived JWT token:
        </p>
        <div className="overflow-hidden rounded-lg border border-border bg-secondary/30 p-5">
          <pre className="text-[12px] font-mono text-muted-foreground leading-[1.7] whitespace-pre overflow-x-auto">
            {`1. Client calls your backend  →  POST /api/an-token
2. Backend uses API key       →  client.tokens.create({ agent })
3. Backend returns JWT        →  short-lived, scoped token
4. Client uses JWT            →  passed to AgentChat / SDK`}
          </pre>
        </div>
        <CodeBlock
          code={TOKEN_ROUTE_CODE}
          language="typescript"
          filename="app/api/an-token/route.ts"
        />
        <div className="rounded-lg border border-border bg-secondary/30 p-4 text-[13px] text-muted-foreground leading-relaxed">
          <span className="font-medium text-foreground">Tip:</span> The{" "}
          <Link
            href="/agents/docs/get-started"
            className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            Get Started
          </Link>{" "}
          guide walks through this setup step by step.
        </div>
      </section>

      {/* Best practices */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Key safety practices</h2>
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-3 py-2 text-left text-[11px] font-medium text-muted-foreground">
                  Do
                </th>
                <th className="px-3 py-2 text-left text-[11px] font-medium text-muted-foreground">
                  Don&apos;t
                </th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50">
                <td className="px-3 py-2">
                  Store in{" "}
                  <code className="rounded bg-secondary px-1 py-0.5 text-[12px] font-mono">
                    .env.local
                  </code>{" "}
                  or secret manager
                </td>
                <td className="px-3 py-2">Commit to git or hardcode in source</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="px-3 py-2">Use the token exchange route</td>
                <td className="px-3 py-2">
                  Pass{" "}
                  <code className="rounded bg-secondary px-1 py-0.5 text-[12px] font-mono">
                    API_KEY_21ST
                  </code>{" "}
                  to the browser
                </td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="px-3 py-2">
                  Rotate keys periodically
                </td>
                <td className="px-3 py-2">
                  Share keys between environments
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2">
                  Deactivate unused keys immediately
                </td>
                <td className="px-3 py-2">
                  Leave old keys active &ldquo;just in case&rdquo;
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Environment variables */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Environment variables</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Environment variables let you pass secrets (database URLs, third-party
          API keys) to your agent&apos;s tools{" "}
          <strong className="text-foreground font-medium">
            without exposing them to the agent process
          </strong>
          . The{" "}
          <Link
            href="/agents/docs/security/overview"
            className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            Sandbox Manager
          </Link>{" "}
          injects them at tool execution time only.
        </p>
      </section>

      {/* Setting env vars */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Managing env vars</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          There are two ways to configure environment variables:
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border p-5 space-y-2">
            <h3 className="text-[13px] font-medium">Dashboard</h3>
            <p className="text-[12px] text-muted-foreground leading-relaxed">
              Open your agent in the dashboard, go to the{" "}
              <span className="font-medium text-foreground">
                Environment
              </span>{" "}
              tab, and add key-value pairs. Changes take effect on the next
              sandbox session.
            </p>
          </div>
          <div className="rounded-xl border border-border p-5 space-y-2">
            <h3 className="text-[13px] font-medium">CLI</h3>
            <p className="text-[12px] text-muted-foreground leading-relaxed">
              Use{" "}
              <code className="rounded bg-secondary px-1 py-0.5 text-[12px] font-mono">
                @21st-sdk/cli env
              </code>{" "}
              to list, set, or remove variables from your terminal. Ideal for
              CI/CD and scripted workflows.
            </p>
          </div>
        </div>
        <CodeBlock code={ENV_CLI_CODE} language="bash" filename="terminal" />
      </section>

      {/* How env vars are isolated */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Isolation</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Env vars set via the dashboard or CLI are{" "}
          <strong className="text-foreground font-medium">
            not ordinary environment variables
          </strong>{" "}
          inside the agent process. They are injected by the Sandbox Manager
          into tool execution only &mdash; tools that need a database
          connection or third-party API key get the value at call time, but the
          agent itself cannot read them from{" "}
          <code className="rounded bg-secondary px-1 py-0.5 text-[12px] font-mono">
            process.env
          </code>
          .
        </p>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          This means even if the agent is tricked into inspecting its own
          environment, tool secrets remain hidden. See{" "}
          <Link
            href="/agents/docs/security/overview"
            className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            Security
          </Link>{" "}
          for the full trust model.
        </p>
      </section>

      {/* What's next */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">What&apos;s next</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { title: "Security", description: "Runtime isolation, permissions, and access control.", href: "/agents/docs/security/overview" },
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
