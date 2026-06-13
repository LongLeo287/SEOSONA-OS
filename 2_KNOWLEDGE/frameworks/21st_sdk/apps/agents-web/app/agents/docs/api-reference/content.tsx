import { AgentsLink as Link } from "@/components/agents-link"
import { agentsHref } from "@/lib/utils/agents-href"
import { CopyMarkdownButton } from "@/components/features/agents/an/docs/copy-markdown-button"
import { MethodBadge, RELAY_URL } from "./_shared"

const ENDPOINTS = [
  {
    section: "Sandboxes",
    href: "/agents/docs/api-reference/sandboxes",
    items: [
      { method: "POST", path: "/v1/sandboxes", title: "Create Sandbox" },
      { method: "GET", path: "/v1/sandboxes/:id", title: "Get Sandbox" },
      { method: "DELETE", path: "/v1/sandboxes/:id", title: "Delete Sandbox" },
    ],
  },
  {
    section: "Sandbox Operations",
    href: "/agents/docs/api-reference/sandbox-operations",
    items: [
      { method: "POST", path: "/v1/sandboxes/:id/exec", title: "Execute Command" },
      { method: "POST", path: "/v1/sandboxes/:id/files", title: "Write Files" },
      { method: "GET", path: "/v1/sandboxes/:id/files", title: "Read File" },
      { method: "POST", path: "/v1/sandboxes/:id/git/clone", title: "Clone Repository" },
    ],
  },
  {
    section: "Threads",
    href: "/agents/docs/api-reference/threads",
    items: [
      { method: "GET", path: "/v1/sandboxes/:id/threads", title: "List Threads" },
      { method: "POST", path: "/v1/sandboxes/:id/threads", title: "Create Thread" },
      { method: "GET", path: "/v1/sandboxes/:id/threads/:threadId", title: "Get Thread" },
      { method: "DELETE", path: "/v1/sandboxes/:id/threads/:threadId", title: "Delete Thread" },
    ],
  },
  {
    section: "Chat",
    href: "/agents/docs/api-reference/chat",
    items: [
      { method: "POST", path: "/v1/chat/:slug", title: "Send Message" },
      { method: "GET", path: "/v1/chat/:slug/:sandboxId/stream", title: "Resume Stream" },
      { method: "DELETE", path: "/v1/chat/:slug/:sandboxId/stream", title: "Cancel Stream" },
    ],
  },
  {
    section: "Vaults",
    href: "/agents/docs/api-reference/vaults",
    items: [
      { method: "GET", path: "/v1/mcp/vaults", title: "List Vaults" },
      { method: "POST", path: "/v1/mcp/vaults", title: "Create Vault" },
      { method: "GET", path: "/v1/mcp/vaults/:vaultId", title: "Get Vault" },
      { method: "PATCH", path: "/v1/mcp/vaults/:vaultId", title: "Update Vault" },
      { method: "DELETE", path: "/v1/mcp/vaults/:vaultId", title: "Archive or Delete Vault" },
      { method: "POST", path: "/v1/mcp/vaults/:vaultId/set-default", title: "Set Default Vault" },
      { method: "POST", path: "/v1/mcp/vaults/:vaultId/credentials", title: "Create Credential" },
      { method: "PATCH", path: "/v1/mcp/vaults/:vaultId/credentials/:credentialId", title: "Update Credential" },
      { method: "DELETE", path: "/v1/mcp/vaults/:vaultId/credentials/:credentialId", title: "Archive or Delete Credential" },
    ],
  },
]

export function ApiReferenceContent() {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">API Reference</h1>
          <CopyMarkdownButton />
        </div>
        <p className="mt-1.5 text-[14px] text-muted-foreground">
          REST API for the 21st Agents runtime. Manage sandboxes, threads, files, and stream chat responses.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Base URL</h2>
        <div className="rounded-lg border border-border bg-muted/30 px-3 py-2.5 font-mono text-[13px]">
          {RELAY_URL}
        </div>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          All API requests use HTTPS. Request and response bodies are JSON-encoded.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Authentication</h2>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          All endpoints require a bearer token passed via the{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">Authorization</code>{" "}
          header. Create an API key in the{" "}
          <a
            href={agentsHref("/agents/app")}
            className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            Dashboard
          </a>.
        </p>
        <div className="rounded-lg border border-border bg-muted/30 px-3 py-2.5 font-mono text-[13px]">
          Authorization: Bearer {"<your_api_key>"}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Conventions</h2>
        <ul className="space-y-2 text-[13px] text-muted-foreground leading-relaxed list-disc pl-5">
          <li>Property names use <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">camelCase</code>.</li>
          <li>Timestamps are ISO 8601 strings (e.g. <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">2026-02-26T12:00:00Z</code>).</li>
          <li>IDs are prefixed strings (e.g. <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">sb_</code> for sandboxes, <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">th_</code> for threads).</li>
          <li>The chat endpoint returns Server-Sent Events (SSE) for streaming responses.</li>
          <li>Errors return a structured JSON body with <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">code</code>, <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">message</code>, and <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">status</code> fields. See{" "}
            <Link
              href="/agents/docs/api-reference/errors"
              className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
            >
              Errors
            </Link>.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Endpoints</h2>
        <div className="space-y-6">
          {ENDPOINTS.map((group) => (
            <div key={group.section} className="space-y-2">
              <h3 className="text-[13px] font-medium">
                <Link
                  href={group.href}
                  className="an-focus-btn rounded hover:underline underline-offset-4"
                >
                  {group.section}
                </Link>
              </h3>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-[13px]">
                  <tbody>
                    {group.items.map((ep) => (
                      <tr key={`${ep.method}-${ep.path}`} className="border-b border-border last:border-0">
                        <td className="px-3 py-2 w-16">
                          <MethodBadge method={ep.method} />
                        </td>
                        <td className="px-3 py-2 font-mono text-[12px] text-muted-foreground">{ep.path}</td>
                        <td className="px-3 py-2">
                          <Link
                            href={group.href}
                            className="an-focus-btn rounded text-foreground hover:underline underline-offset-4"
                          >
                            {ep.title}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-[15px] font-medium">SDKs</h2>
        <div className="rounded-lg border border-border bg-secondary/30 p-4 text-[13px] text-muted-foreground leading-relaxed space-y-2">
          <p>
            <strong className="font-medium text-foreground">Next.js SDK</strong>{" "}
            - For the recommended approach using{" "}
            <code className="rounded bg-secondary px-1.5 py-0.5 text-[12px] font-mono">@21st-sdk/nextjs</code>{" "}
            with server-side token exchange, see the{" "}
            <a
              href={agentsHref("/agents/docs/get-started")}
              className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
            >
              Get Started
            </a>{" "}
            guide.
          </p>
          <p>
            <strong className="font-medium text-foreground">Server SDK</strong>{" "}
            - For server-side sandbox and thread management, see the{" "}
            <a
              href={agentsHref("/agents/docs/reference/server")}
              className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
            >
              Server SDK
            </a>{" "}
            page.
          </p>
        </div>
      </section>
    </div>
  )
}
