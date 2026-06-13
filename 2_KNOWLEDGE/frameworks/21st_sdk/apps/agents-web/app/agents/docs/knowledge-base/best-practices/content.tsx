import { AgentsLink as Link } from "@/components/agents-link"
import { CopyMarkdownButton } from "@/components/features/agents/an/docs/copy-markdown-button"

export default function BestPracticesContent() {
  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            Best Practices
          </h1>
          <CopyMarkdownButton />
        </div>
        <p className="mt-1.5 text-[14px] text-muted-foreground leading-relaxed">
          Optimizing cost, choosing between skills and system prompts, and
          security considerations.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Optimizing Cost</h2>
        <ul className="space-y-2 text-[14px] text-muted-foreground leading-relaxed">
          <li>
            <span className="font-medium text-foreground">
              Use the right model
            </span>{" "}
            - Claude Haiku 4.5 is significantly cheaper than Opus. Use Haiku for
            simple tasks and reserve Sonnet/Opus for complex reasoning.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Set{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-[13px] font-mono text-foreground">
                maxTurns
              </code>
            </span>{" "}
            - limit the number of reasoning steps to prevent runaway
            conversations.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Set{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-[13px] font-mono text-foreground">
                maxBudgetUsd
              </code>
            </span>{" "}
            - cap per-request spend as a safety net.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Keep system prompts concise
            </span>{" "}
            - every token in the system prompt is sent with every message. Move
            detailed reference material to{" "}
            <Link
              href="/agents/docs/build/skills"
              className="an-focus-btn rounded text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors"
            >
              skills
            </Link>
            .
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Skills vs System Prompt</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Use the{" "}
          <span className="font-medium text-foreground">system prompt</span> for
          identity, tone, and general rules (under 2,000 characters). Use{" "}
          <Link
            href="/agents/docs/build/skills"
            className="an-focus-btn rounded text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors"
          >
            skills
          </Link>{" "}
          for detailed reference material - API docs, procedures, domain
          knowledge. Skills are loaded on demand, reducing per-message token
          usage.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Security Considerations</h2>
        <ul className="space-y-2 text-[14px] text-muted-foreground leading-relaxed">
          <li>
            <span className="font-medium text-foreground">
              Never expose API keys client-side
            </span>{" "}
            - use the token exchange pattern via{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-[13px] font-mono text-foreground">
              createTokenHandler
            </code>
            .
          </li>
          <li>
            <span className="font-medium text-foreground">
              Use permission modes appropriately
            </span>{" "}
            - only use{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-[13px] font-mono text-foreground">
              bypass
            </code>{" "}
            mode for agents running in fully isolated sandboxes.
          </li>
          <li>
            <span className="font-medium text-foreground">Restrict tools</span>{" "}
            - only enable the tools your agent actually needs. Disable Bash if
            your agent doesn&apos;t need shell access.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Environment variables
            </span>{" "}
            - use the dashboard to set secrets. Never hardcode them in agent
            code.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Testing Agents</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Use the live chat preview in the dashboard to test changes
          iteratively. Check the{" "}
          <Link
            href="/agents/docs/deploy/logs"
            className="an-focus-btn rounded text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors"
          >
            Logs
          </Link>{" "}
          page to inspect conversations, token usage, and errors after testing.
        </p>
      </section>
    </div>
  )
}
