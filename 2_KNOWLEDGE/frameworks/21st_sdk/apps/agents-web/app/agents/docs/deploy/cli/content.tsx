import { AgentsLink as Link } from "@/components/agents-link"
import { CodeBlock } from "@/components/features/agents/an/docs/code-block"
import { CopyMarkdownButton } from "@/components/features/agents/an/docs/copy-markdown-button"
import type { DocsCodeLanguage } from "@/lib/atoms/agents-docs"

const LOGIN_CODE = `npx @21st-sdk/cli login

# non-interactive
API_KEY_21ST=21st_sk_... npx @21st-sdk/cli login --api-key $API_KEY_21ST`

const TS_PROJECT_LAYOUT = `agents/
  my-agent/
    index.ts    # or index.js
    template/
      ...

package.json`

const GO_PROJECT_LAYOUT = `agents/
  my-agent/
    index.go
    template/
      ...

go.mod`

const DEPLOY_CODE = `# deploy every agent under agents/
npx @21st-sdk/cli deploy

# deploy only one agent
npx @21st-sdk/cli deploy --agent my-agent`

const DEPLOY_NAME_CODE = `# deploy the same source code as a different agent
npx @21st-sdk/cli deploy --agent my-agent --name my-agent-staging

# in CI/CD - deploy to different environments from the same branch
npx @21st-sdk/cli deploy --agent my-agent --name my-agent-dev      # dev
npx @21st-sdk/cli deploy --agent my-agent --name my-agent-staging   # staging
npx @21st-sdk/cli deploy --agent my-agent --name my-agent-prod      # production`

const ENV_CODE = `# list configured keys
npx @21st-sdk/cli env list my-agent

# set or update one key
npx @21st-sdk/cli env set my-agent OPENAI_API_KEY sk-live-...

# set or update multiple keys
npx @21st-sdk/cli env set my-agent OPENAI_API_KEY=sk-live-... ANTHROPIC_API_KEY=sk-ant-...

# quote values with spaces the usual shell way
npx @21st-sdk/cli env set my-agent SYSTEM_PROMPT="hello world"

# remove one key
npx @21st-sdk/cli env remove my-agent OPENAI_API_KEY`

const INIT_CODE = `# interactive - prompts for agent name
npx @21st-sdk/cli init

# non-interactive
npx @21st-sdk/cli init --name my-agent`

const AGENTS_CODE = `# list all agents
npx @21st-sdk/cli agents

# get details for one agent
npx @21st-sdk/cli agents get my-agent

# delete an agent and all its deployments
npx @21st-sdk/cli agents delete my-agent

# skip confirmation (useful in scripts)
npx @21st-sdk/cli agents delete my-agent --force`

const VERSIONS_CODE = `# list deployment versions
npx @21st-sdk/cli versions my-agent

# machine-readable output
npx @21st-sdk/cli versions my-agent --json`

const ROLLBACK_CODE = `# rollback to the previous version
npx @21st-sdk/cli rollback my-agent

# rollback to a specific version
npx @21st-sdk/cli rollback my-agent 3`

const LOGS_CODE = `# list chats
npx @21st-sdk/cli logs my-agent

# inspect one chat
npx @21st-sdk/cli logs my-agent <chat-id>

# inspect one thread
npx @21st-sdk/cli logs my-agent <chat-id> <thread-id>

# machine-readable output
npx @21st-sdk/cli logs my-agent --json`

const PAGINATION_CODE = `npx @21st-sdk/cli logs my-agent --status active --limit 20
npx @21st-sdk/cli logs my-agent --status active --limit 20 --cursor <nextCursor>`

export default function CliContent({
  lang,
}: {
  lang: DocsCodeLanguage
}) {
  const docsCodeLanguage = lang
  const isGo = docsCodeLanguage === "go"
  const projectLayout = isGo ? GO_PROJECT_LAYOUT : TS_PROJECT_LAYOUT

  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">CLI</h1>
          <CopyMarkdownButton />
        </div>
        <p className="mt-1.5 text-[14px] text-muted-foreground leading-relaxed">
          Use <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">@21st-sdk/cli</code>{" "}
          to scaffold, deploy, manage, rollback, and monitor agents from your terminal.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Install & Auth</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The CLI is usually run with <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">npx</code>.
          It stores credentials in <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">~/.an/credentials</code>,
          or you can pass an API key with the <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">API_KEY_21ST</code>{" "}
          environment variable.
        </p>
        <CodeBlock code={LOGIN_CODE} language="bash" />
      </section>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Init</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Scaffold a new agent project with a template entrypoint.
        </p>
        <CodeBlock code={INIT_CODE} language="bash" />
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          Creates{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">
            agents/&lt;slug&gt;/index.ts
          </code>{" "}
          with a starter agent config.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Project Layout</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The current deploy structure is one agent per folder under{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">agents/</code>.
          {isGo ? (
            <>
              {" "}The primary entrypoint is{" "}
              <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">agents/&lt;slug&gt;/index.go</code>.
            </>
          ) : (
            <>
              {" "}The primary entrypoint is{" "}
              <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">agents/&lt;slug&gt;/index.ts</code>{" "}
              or{" "}
              <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">agents/&lt;slug&gt;/index.js</code>.
            </>
          )}
        </p>
        <CodeBlock code={projectLayout} language="plaintext" />
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          Use one folder per deployable agent. See{" "}
          <Link href="/agents/docs/deploy/deploy" className="an-focus-btn rounded text-foreground underline underline-offset-4">
            Build &amp; Deploy
          </Link>{" "}
          for the full project structure.
          {isGo ? (
            <>
              {" "}Go agents also require a repo-level{" "}
              <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">go.mod</code>{" "}
              and a working local{" "}
              <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">go</code>{" "}
              installation.
            </>
          ) : null}
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Deploy</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Deploy scans the <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">agents/</code> directory,
          bundles each detected agent, uploads it, and prints a link to the Agents dashboard.
          Use{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">--agent &lt;slug&gt;</code>{" "}
          to deploy a single agent.
        </p>
        <CodeBlock code={DEPLOY_CODE} language="bash" />
      </section>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Multi-Environment Deploys</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          By default, the agent name matches its folder name. Use{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">--name &lt;slug&gt;</code>{" "}
          to deploy the same source code under a different name. Each name creates a separate
          agent with its own deployments, environment variables, and sandboxes - so you can
          run staging and production side by side from the same codebase.
        </p>
        <CodeBlock code={DEPLOY_NAME_CODE} language="bash" />
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          This is useful in CI/CD pipelines where you want to deploy different versions from
          one source - for example, deploying to staging on every push and to production on release.
          Each environment&apos;s env vars are managed independently
          via <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">an env set &lt;name&gt;</code>.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Agents</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          List, inspect, or delete agents from your team.
        </p>
        <CodeBlock code={AGENTS_CODE} language="bash" />
      </section>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Versions</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          List deployment versions for an agent. The active version is marked. Also
          available as{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">
            deployments
          </code>
          .
        </p>
        <CodeBlock code={VERSIONS_CODE} language="bash" />
      </section>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Rollback</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Roll back an agent to a previous deployment version. Without a version
          number, rolls back to the immediately previous version.
        </p>
        <CodeBlock code={ROLLBACK_CODE} language="bash" />
      </section>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Environment Variables</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Use the CLI to list configured environment variable keys, set one key with
          the legacy syntax, set one or more keys with <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">KEY=VALUE</code>,
          or remove a single key for a deployed agent.
        </p>
        <CodeBlock code={ENV_CODE} language="bash" />
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          The list command only returns keys, not secret values.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Logs</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The CLI can list recent chat sessions, inspect a chat, or fetch one specific
          thread directly.
        </p>
        <CodeBlock code={LOGS_CODE} language="bash" />
      </section>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Filtering & Pagination</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The logs list supports status filtering, search, date filtering, and cursor-based
          pagination.
        </p>
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-3 py-2 text-left text-[11px] font-medium text-muted-foreground">
                  Flag
                </th>
                <th className="px-3 py-2 text-left text-[11px] font-medium text-muted-foreground">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["--status active|error", "Filter chats by status"],
                ["--search TEXT", "Search by chat ID or sandbox ID"],
                ["--since ISO", "Only include chats created at or after the timestamp"],
                ["--until ISO", "Only include chats created at or before the timestamp"],
                ["--limit N", "Page size, from 1 to 100"],
                ["--cursor UUID", "Fetch the next page while keeping the same filters"],
              ].map(([flag, description], index, rows) => (
                <tr
                  key={flag}
                  className={index < rows.length - 1 ? "border-b border-border" : ""}
                >
                  <td className="px-3 py-2.5 font-medium whitespace-nowrap">{flag}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <CodeBlock code={PAGINATION_CODE} language="bash" />
      </section>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">CLI Environment Variables</h2>
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-3 py-2 text-left text-[11px] font-medium text-muted-foreground">
                  Variable
                </th>
                <th className="px-3 py-2 text-left text-[11px] font-medium text-muted-foreground">
                  Purpose
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["API_KEY_21ST", "Override the API key used by the CLI"],
              ].map(([key, description], index, rows) => (
                <tr
                  key={key}
                  className={index < rows.length - 1 ? "border-b border-border" : ""}
                >
                  <td className="px-3 py-2.5 font-medium whitespace-nowrap">{key}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* What's next */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">What&apos;s next</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { title: "Deploy", description: "Project structure, configuration, and deploy internals.", href: "/agents/docs/deploy/deploy" },
            { title: "Logs", description: "Browse sessions, inspect dialogs, and debug errors.", href: "/agents/docs/deploy/logs" },
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
