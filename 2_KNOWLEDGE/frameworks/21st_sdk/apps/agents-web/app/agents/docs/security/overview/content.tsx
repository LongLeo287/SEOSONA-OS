import { AgentsLink as Link } from "@/components/agents-link"
import { CopyMarkdownButton } from "@/components/features/agents/an/docs/copy-markdown-button"

export default function SecurityPage() {
  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">Security</h1>
          <CopyMarkdownButton />
        </div>
        <p className="mt-1.5 text-[14px] text-muted-foreground leading-relaxed max-w-[520px]">
          How the 21st Agents runtime isolates agent execution, protects
          secrets, and controls access to tools and model providers.
        </p>
      </div>

      {/* Trust model */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Trust model</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Running an AI agent that can execute code, read files, and call
          external services creates a trust problem. The runtime splits every
          session into two layers:
        </p>
        <div className="rounded-xl border border-border overflow-hidden">
          {/* Trusted layer */}
          <div className="bg-foreground/[0.02] p-5 space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-[13px] font-medium">Sandbox Manager</h3>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                trusted
              </span>
            </div>
            <p className="text-[12px] text-muted-foreground leading-relaxed">
              The control layer that prepares the session, starts the agent,
              manages streaming, proxies tool and MCP calls, and controls
              access to secrets and model providers.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {["Secrets", "Model keys", "MCP servers", "Env vars"].map(
                (item) => (
                  <span
                    key={item}
                    className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                  >
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>

          {/* Isolation boundary */}
          <div className="flex items-center gap-3 px-5 py-1.5 bg-muted/40">
            <div className="h-px flex-1 border-t border-dashed border-border" />
            <span className="text-[10px] font-medium text-muted-foreground tracking-wider uppercase shrink-0">
              Isolation boundary
            </span>
            <div className="h-px flex-1 border-t border-dashed border-border" />
          </div>

          {/* Untrusted layer */}
          <div className="bg-muted/30 p-5 space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-[13px] font-medium">Agent process</h3>
              <span className="rounded-full bg-orange-500/10 px-2 py-0.5 text-[10px] font-medium text-orange-600 dark:text-orange-400">
                untrusted
              </span>
            </div>
            <p className="text-[12px] text-muted-foreground leading-relaxed">
              The Claude Code process that runs shell commands, scripts, package
              installs, and code execution. It lives inside an isolated
              container and never holds real provider credentials or tool
              secrets.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {["Shell", "Code exec", "File I/O", "Package installs"].map(
                (item) => (
                  <span
                    key={item}
                    className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                  >
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          The part that orchestrates the session is never the same part that
          runs the untrusted agent workload.
        </p>
      </section>

      {/* Runtime isolation */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Runtime isolation</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Each session gets its own sandboxed E2B environment. Inside that
          sandbox, the agent process runs in a separate{" "}
          <strong className="text-foreground font-medium">
            execution container
          </strong>{" "}
          &mdash; it does not run directly on the sandbox host or in the same
          process as the Sandbox Manager.
        </p>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          The execution container is further isolated with{" "}
          <strong className="text-foreground font-medium">gVisor</strong>{" "}
          (<code className="rounded bg-secondary px-1 py-0.5 text-[12px] font-mono">runsc</code>),
          adding an extra kernel-level boundary beyond the standard container
          boundary. If the agent process misbehaves, that extra layer matters.
        </p>
      </section>

      {/* File access */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">File access</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Project files are prepared on the sandbox host side. The Sandbox
          Manager creates the workspace and writes runtime files before the
          agent starts. That workspace is then{" "}
          <strong className="text-foreground font-medium">bind-mounted</strong>{" "}
          into the execution container as the agent&apos;s working directory.
        </p>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          The agent sees the real project through a mounted workspace, not a
          copied snapshot. It can read, edit, create, and execute files &mdash;
          but all of that happens inside the isolated container.
        </p>
        <div className="rounded-lg border border-border bg-secondary/30 p-4 text-[13px] text-muted-foreground leading-relaxed">
          If the agent writes a script and executes it, that code runs inside
          the container, not on the sandbox host.
        </div>
      </section>

      {/* Model access */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Model access</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The agent process does not call Anthropic or OpenRouter directly.
          Instead, the sandbox receives a{" "}
          <strong className="text-foreground font-medium">
            short-lived proxy token
          </strong>{" "}
          and uses it to call the 21st private proxy service. The proxy
          forwards the request upstream with the real provider credentials
          attached.
        </p>
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-3 py-2 text-left text-[11px] font-medium text-muted-foreground">
                  What the agent gets
                </th>
                <th className="px-3 py-2 text-left text-[11px] font-medium text-muted-foreground">
                  What stays on the proxy
                </th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50">
                <td className="px-3 py-2">Short-lived proxy token</td>
                <td className="px-3 py-2">
                  Real{" "}
                  <code className="rounded bg-secondary px-1 py-0.5 text-[12px] font-mono">
                    ANTHROPIC_API_KEY
                  </code>
                </td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="px-3 py-2">Access to inference</td>
                <td className="px-3 py-2">Provider account credentials</td>
              </tr>
              <tr>
                <td className="px-3 py-2">Scoped, time-limited access</td>
                <td className="px-3 py-2">
                  OpenRouter and other upstream keys
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          The agent gets access to inference but does not get direct ownership
          of the provider account credentials.
        </p>
      </section>

      {/* Tools & MCP isolation */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Tools & MCP isolation</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Tool and MCP requests follow a different route from model inference.
          The agent process does not connect to integrations directly &mdash;
          all requests go through the{" "}
          <strong className="text-foreground font-medium">
            Sandbox Manager
          </strong>
          .
        </p>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          The Sandbox Manager starts MCP servers on the host side (both local
          stdio and remote servers), manages their lifecycle, and proxies
          requests from the agent container. It also injects the current
          environment variables for that execution and sends only the result
          back into the agent session.
        </p>
        <div className="rounded-lg border border-border bg-secondary/30 p-4 text-[13px] text-muted-foreground leading-relaxed">
          <span className="font-medium text-foreground">Key boundary:</span>{" "}
          The agent can use real integrations, but tool-side secrets and MCP
          credentials never live inside the untrusted agent process.
        </div>
      </section>

      {/* Secrets & credentials */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Secrets & credentials</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          API keys authenticate your app&apos;s requests via a short-lived JWT
          exchange &mdash; the raw key never reaches the browser. Environment
          variables are injected by the Sandbox Manager into tool execution
          only, so the agent process never has direct access to secrets.
        </p>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          See{" "}
          <Link
            href="/agents/docs/security/api-keys"
            className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            API Keys & Env Vars
          </Link>{" "}
          for key formats, token exchange flow, safety practices, and
          environment variable management.
        </p>
      </section>

      {/* Summary */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Summary</h2>
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-3 py-2 text-left text-[11px] font-medium text-muted-foreground">
                  Resource
                </th>
                <th className="px-3 py-2 text-left text-[11px] font-medium text-muted-foreground">
                  Agent gets
                </th>
                <th className="px-3 py-2 text-left text-[11px] font-medium text-muted-foreground">
                  Boundary
                </th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50">
                <td className="px-3 py-2 font-medium text-foreground">
                  Workspace
                </td>
                <td className="px-3 py-2">Full file access via bind-mount</td>
                <td className="px-3 py-2">Isolated container + gVisor</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="px-3 py-2 font-medium text-foreground">
                  Model
                </td>
                <td className="px-3 py-2">Short-lived proxy token</td>
                <td className="px-3 py-2">Private proxy service</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="px-3 py-2 font-medium text-foreground">
                  Tools & MCPs
                </td>
                <td className="px-3 py-2">Proxied through Sandbox Manager</td>
                <td className="px-3 py-2">Host-side gateway</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-medium text-foreground">
                  Secrets
                </td>
                <td className="px-3 py-2">Never directly accessible</td>
                <td className="px-3 py-2">
                  Sandbox Manager injects at execution
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* What's next */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">What&apos;s next</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { title: "API Keys & Env Vars", description: "Create keys, manage env vars, and configure secrets.", href: "/agents/docs/security/api-keys" },
            { title: "Sandbox", description: "Configure the sandboxed execution environment.", href: "/agents/docs/build/sandbox" },
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
