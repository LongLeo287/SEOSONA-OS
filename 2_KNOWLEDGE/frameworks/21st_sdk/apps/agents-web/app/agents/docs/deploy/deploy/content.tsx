"use client"

import { AgentsLink as Link } from "@/components/agents-link"
import { CodeBlock } from "@/components/features/agents/an/docs/code-block"
import { CopyMarkdownButton } from "@/components/features/agents/an/docs/copy-markdown-button"
import type { DocsCodeLanguage } from "@/lib/atoms/agents-docs"

const CLI_INSTALL_CODE = `# Run directly with npx
npx @21st-sdk/cli login
npx @21st-sdk/cli deploy

# Or install globally
npm install -g @21st-sdk/cli
@21st-sdk/cli login
@21st-sdk/cli deploy`

const DEPLOY_CODE = `# deploy every agent under agents/
npx @21st-sdk/cli deploy

# deploy only one agent
npx @21st-sdk/cli deploy --agent my-agent`

const ENV_CLI_CODE = `# list configured env vars
npx @21st-sdk/cli env list my-agent

# set one or more keys
npx @21st-sdk/cli env set my-agent OPENAI_API_KEY=sk-live-... STRIPE_KEY=sk_live-...

# remove a key
npx @21st-sdk/cli env remove my-agent OPENAI_API_KEY`

function getLoginCode(apiKey?: string) {
  const key = apiKey || "21st_sk_..."
  return `$ @21st-sdk/cli login
  Enter your API key: ${key}
  Authenticated as John (team: my-team)`
}

const DEPLOY_STEPS = [
  {
    step: "1",
    title: "Bundle",
    description:
      "The CLI finds each agent entrypoint. JavaScript and TypeScript agents are bundled with esbuild. Go agents are built locally with your Go toolchain and wrapped for the runtime.",
  },
  {
    step: "2",
    title: "Upload",
    description:
      "The bundle, template archive, and deployment metadata are uploaded to the deploy API together with your agent slug.",
  },
  {
    step: "3",
    title: "Sandbox",
    description:
      "The platform prepares the E2B sandbox template and starts the runtime processes that host your tools and MCP servers inside that sandbox.",
  },
  {
    step: "4",
    title: "Live",
    description:
      "Your deployment becomes live immediately. The agent then runs in an isolated execution layer inside the sandbox when chats start.",
  },
]

const TS_CODE_ITEMS = [
  { what: "Agent config", source: "agents/my-agent/index.ts" },
  { what: "System prompt", source: "agents/my-agent/index.ts" },
  { what: "Custom tools", source: "agents/my-agent/index.ts" },
  { what: "Lifecycle hooks", source: "agents/my-agent/index.ts" },
]

const GO_CODE_ITEMS = [
  { what: "Agent config", source: "agents/my-agent/index.go" },
  { what: "System prompt", source: "agents/my-agent/index.go" },
  { what: "Custom tools", source: "agents/my-agent/index.go" },
]

const PLATFORM_ITEMS = [
  { what: "Environment variables", via: "Dashboard or cli env set" },
  { what: "Deployments", via: "cli deploy" },
  { what: "Logs & costs", via: "Dashboard or cli logs" },
]

export function AgentProjectsContent({
  lang,
}: {
  lang: DocsCodeLanguage
}) {
  const docsCodeLanguage = lang
  const isGo = docsCodeLanguage === "go"
  const isPython = docsCodeLanguage === "python"
  const codeItems = isGo ? GO_CODE_ITEMS : TS_CODE_ITEMS

  if (isPython) {
    return (
      <div className="space-y-10">
        <div>
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-semibold tracking-tight">
              Deploy
            </h1>
            <CopyMarkdownButton />
          </div>
          <p className="mt-1.5 text-[14px] text-muted-foreground leading-relaxed max-w-[520px]">
            CLI commands, deploy pipeline, redeploying, and what lives where.
          </p>
          <div className="mt-4 rounded-lg border border-border bg-secondary/30 p-4 text-[13px] leading-relaxed text-muted-foreground">
            Python agents are not supported yet. Python agent authoring is
            currently in development. Use JavaScript / TypeScript or Go for
            now.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            Deploy
          </h1>
          <CopyMarkdownButton />
        </div>
        <p className="mt-1.5 text-[14px] text-muted-foreground leading-relaxed max-w-[520px]">
          CLI commands, deploy pipeline, redeploying, and what lives where.
          Set up your project first in{" "}
          <Link
            href="/agents/docs/build/agents"
            className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            Project Setup
          </Link>
          .
        </p>
      </div>

      {/* CLI Reference */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">CLI reference</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The CLI is available as an npm package. Run it with{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">
            npx
          </code>{" "}
          or install globally:
        </p>
        <CodeBlock code={CLI_INSTALL_CODE} language="bash" />

        <h3 className="text-[14px] font-medium pt-2">Login</h3>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Authenticate with your API key. Get one from the{" "}
          <Link
            href="/agents/api"
            className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            dashboard
          </Link>
          .
        </p>
        <CodeBlock code={getLoginCode()} language="bash" />
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          Credentials are saved to{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">
            ~/.an/credentials
          </code>
          . You only need to log in once.
        </p>

        <h3 className="text-[14px] font-medium pt-2">Deploy</h3>
        <CodeBlock code={DEPLOY_CODE} language="bash" />
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          Use{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">
            --agent &lt;slug&gt;
          </code>{" "}
          when you only want to redeploy one agent from the{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">
            agents/
          </code>{" "}
          directory.
        </p>
      </section>

      {/* How Deploy Works */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">How deploy works</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          When you run{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">
            @21st-sdk/cli deploy
          </code>
          , four things happen:
        </p>
        <div className="flex flex-col">
          {DEPLOY_STEPS.map((item, index) => (
            <div key={item.step} className="flex gap-3">
              {/* Timeline column */}
              <div className="flex flex-col items-center">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground text-background text-[11px] font-semibold">
                  {item.step}
                </span>
                {index < DEPLOY_STEPS.length - 1 && (
                  <div className="w-px flex-1 bg-border" />
                )}
              </div>
              {/* Content */}
              <div className={index < DEPLOY_STEPS.length - 1 ? "pb-4" : ""}>
                <p className="text-[13px] font-medium leading-6">
                  {item.title}
                </p>
                <p className="mt-0.5 text-[12px] text-muted-foreground leading-relaxed">
                  {item.step === "1"
                    ? isGo
                      ? "The CLI finds your Go entrypoint, builds it locally with your Go toolchain, and wraps it for the runtime."
                      : "The CLI finds your entrypoint and bundles it locally with esbuild."
                    : item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Environment Variables */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Environment variables</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Set secrets and config values (API keys for tools, database URLs)
          from the{" "}
          <Link
            href="/agents/environment-variables"
            className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            dashboard
          </Link>{" "}
          or via the CLI. Changes take effect on the next request &mdash; no
          redeploy required.
        </p>
        <CodeBlock code={ENV_CLI_CODE} language="bash" filename="terminal" />
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          See{" "}
          <Link
            href="/agents/docs/security/api-keys"
            className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            API Keys & Env Vars
          </Link>{" "}
          for how env vars are stored, injected, and isolated from the agent
          process.
        </p>
      </section>

      {/* Redeploying */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Redeploying</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Run{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">
            @21st-sdk/cli deploy
          </code>{" "}
          again to update your agent, or use{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">
            @21st-sdk/cli deploy --agent my-agent
          </code>{" "}
          to update just one slug. The CLI:
        </p>
        <ol className="list-decimal pl-5 space-y-1.5 text-[13px] text-muted-foreground leading-relaxed">
          <li>Bundles your updated code</li>
          <li>Kills the old sandbox</li>
          <li>Creates a fresh sandbox with the new bundle</li>
          <li>Updates the agent config in the database</li>
        </ol>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          The agent URL stays the same. Active chat sessions may be interrupted
          during redeploy.
        </p>
      </section>

      {/* What Lives Where */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">What lives where</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Agents are{" "}
          <strong className="text-foreground font-medium">code-first</strong>.
          Agent behavior lives entirely in your code. The dashboard is for
          monitoring and managing environment variables.
        </p>
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-3 py-2 text-left text-[11px] font-medium text-muted-foreground">
                  What
                </th>
                <th className="px-3 py-2 text-left text-[11px] font-medium text-muted-foreground">
                  Source
                </th>
                <th className="px-3 py-2 text-left text-[11px] font-medium text-muted-foreground">
                  Managed via
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Code-managed group */}
              <tr className="border-b border-border bg-muted/20">
                <td
                  colSpan={3}
                  className="px-3 py-1.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Code-managed
                </td>
              </tr>
              {codeItems.map((row, i) => (
                <tr
                  key={row.what}
                  className={
                    i < codeItems.length - 1
                      ? "border-b border-border"
                      : "border-b border-border"
                  }
                >
                  <td className="px-3 py-2.5 font-medium text-foreground">
                    {row.what}
                  </td>
                  <td className="px-3 py-2.5">
                    <code className="rounded bg-secondary px-1.5 py-0.5 text-[11px] font-mono">
                      {row.source}
                    </code>
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">
                    Code &amp; redeploy
                  </td>
                </tr>
              ))}

              {/* Platform-managed group */}
              <tr className="border-b border-border bg-muted/20">
                <td
                  colSpan={3}
                  className="px-3 py-1.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Platform-managed
                </td>
              </tr>
              {PLATFORM_ITEMS.map((row, i) => (
                <tr
                  key={row.what}
                  className={
                    i < PLATFORM_ITEMS.length - 1
                      ? "border-b border-border"
                      : ""
                  }
                >
                  <td className="px-3 py-2.5 font-medium text-foreground">
                    {row.what}
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">
                    Dashboard
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">
                    {row.via}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Project Metadata */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Project metadata</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Current CLI deploys do not require a local project metadata file. If
          you still have an old{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">
            .an/project.json
          </code>{" "}
          from an older version, you can remove it.
        </p>
      </section>

      {/* What's next */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">What&apos;s next</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { title: "CLI", description: "Full CLI reference for deploy, env vars, and logs.", href: "/agents/docs/deploy/cli" },
            { title: "Backend Integration", description: "Manage sandboxes, threads, and run agents from your server.", href: "/agents/docs/deploy/backend-integration" },
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
