import { CopyMarkdownButton } from "@/components/features/agents/an/docs/copy-markdown-button"

export default function TroubleshootingContent() {
  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            Troubleshooting
          </h1>
          <CopyMarkdownButton />
        </div>
        <p className="mt-1.5 text-[14px] text-muted-foreground leading-relaxed">
          Common issues and how to fix them.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">
          The API returns fewer messages than expected
        </h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The relay appends only the newest turn to the stored thread history.
          If older messages seem to be missing, you are usually writing into a
          different sandbox or thread than you expect. Reuse the same{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-[13px] font-mono text-foreground">
            sandboxId
          </code>
          , and if you have multiple conversations in one sandbox, also reuse
          the same{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-[13px] font-mono text-foreground">
            threadId
          </code>
          . If you omit <code className="rounded bg-muted px-1.5 py-0.5 text-[13px] font-mono text-foreground">threadId</code>, the relay resumes the latest thread in that sandbox.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">
          Auth &amp; token issues
        </h2>
        <ul className="space-y-2 text-[14px] text-muted-foreground leading-relaxed">
          <li>
            <span className="font-medium text-foreground">
              401 Unauthorized
            </span>{" "}
            - your API key is missing or invalid. Re-run{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-[13px] font-mono text-foreground">
              an login
            </code>{" "}
            or check{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-[13px] font-mono text-foreground">
              API_KEY_21ST
            </code>{" "}
            in your environment.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Token exchange failing
            </span>{" "}
            - ensure your{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-[13px] font-mono text-foreground">
              /api/an-token
            </code>{" "}
            route is correctly calling{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-[13px] font-mono text-foreground">
              createTokenHandler
            </code>{" "}
            with a valid API key.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">
          Agent not responding
        </h2>
        <ul className="space-y-2 text-[14px] text-muted-foreground leading-relaxed">
          <li>
            <span className="font-medium text-foreground">
              Sandbox expired
            </span>{" "}
            - idle sandboxes are destroyed after a timeout. When that happens,
            treat the old sandbox as gone and start a fresh sandbox/session.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Max turns reached
            </span>{" "}
            - the agent hit its{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-[13px] font-mono text-foreground">
              maxTurns
            </code>{" "}
            limit. Increase it in the agent config or per-request via{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-[13px] font-mono text-foreground">
              options.maxTurns
            </code>
            .
          </li>
          <li>
            <span className="font-medium text-foreground">
              Budget exceeded
            </span>{" "}
            - if{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-[13px] font-mono text-foreground">
              maxBudgetUsd
            </code>{" "}
            is set and the cost exceeds it, the agent stops.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">
          Tool permission errors
        </h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          If the agent can&apos;t execute a tool, check the permission mode in
          your agent config. In{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-[13px] font-mono text-foreground">
            default
          </code>{" "}
          mode, risky tools require user confirmation. Use{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-[13px] font-mono text-foreground">
            bypass
          </code>{" "}
          for fully autonomous agents in isolated sandboxes.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">
          SSE streaming drops or doesn&apos;t start
        </h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Ensure your client supports Server-Sent Events and that no proxy or
          CDN is buffering the response. Check the Logs page in the dashboard
          for error details on the specific dialog.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">
          Deploy fails
        </h2>
        <ul className="space-y-2 text-[14px] text-muted-foreground leading-relaxed">
          <li>
            <span className="font-medium text-foreground">
              Missing entry point
            </span>{" "}
            - ensure{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-[13px] font-mono text-foreground">
              agents/&lt;slug&gt;/index.ts
            </code>{" "}
            exists with a default export using{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-[13px] font-mono text-foreground">
              agent()
            </code>
            .
          </li>
          <li>
            <span className="font-medium text-foreground">
              Invalid API key
            </span>{" "}
            - re-run{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-[13px] font-mono text-foreground">
              an login
            </code>
            .
          </li>
          <li>
            <span className="font-medium text-foreground">
              Bundle too large
            </span>{" "}
            - keep agent code small, avoid heavy dependencies in the entry
            point.
          </li>
        </ul>
      </section>
    </div>
  )
}
