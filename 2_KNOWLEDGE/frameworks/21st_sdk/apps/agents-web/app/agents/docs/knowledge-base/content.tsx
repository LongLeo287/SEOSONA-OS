import { AgentsLink as Link } from "@/components/agents-link"

const KB_SECTIONS = [
  {
    title: "Claude Code Agent",
    href: "/agents/docs/knowledge-base/claude-code-agent",
    description:
      "How to build, deploy, and embed a production AI agent powered by Claude Code - sandboxing, streaming, custom tools, and React UI.",
  },
  {
    title: "Models & Providers",
    href: "/agents/docs/knowledge-base/models-and-providers",
    description:
      "Use Claude, GPT, Gemini, DeepSeek, Llama, Qwen, GLM and more through OpenRouter. Compare models, switch at runtime, and optimize for cost or performance.",
  },
  {
    title: "Messages & History",
    href: "/agents/docs/knowledge-base/messages-and-history",
    description:
      "How message persistence works, lazy loading history, and restoring conversations on mount.",
  },
  {
    title: "Sandboxes & Infrastructure",
    href: "/agents/docs/knowledge-base/sandboxes",
    description:
      "Sandbox specs, shared volumes, lifecycle hooks, concurrent users, and persistent storage.",
  },
  {
    title: "Troubleshooting",
    href: "/agents/docs/knowledge-base/troubleshooting",
    description:
      "Auth issues, missing messages, tool permission errors, and streaming problems.",
  },
  {
    title: "Best Practices",
    href: "/agents/docs/knowledge-base/best-practices",
    description:
      "Optimizing cost, choosing between skills and system prompts, and security considerations.",
  },
]

export default function KnowledgeBaseContent() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Introduction
        </h1>
        <p className="mt-1.5 text-[14px] text-muted-foreground leading-relaxed max-w-[560px]">
          The Knowledge Base covers common questions, architecture details, and
          practical guidance for building agents with 21st SDK. Use it as a
          reference alongside the{" "}
          <Link
            href="/agents/docs/get-started"
            className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            Getting Started
          </Link>{" "}
          guide and{" "}
          <Link
            href="/agents/docs/api-reference"
            className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            API Reference
          </Link>
          .
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-[15px] font-medium">Topics</h2>
        <div className="grid gap-3">
          {KB_SECTIONS.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="an-focus-btn group block rounded-lg border border-border/70 p-4 transition-colors hover:bg-foreground/[0.03] hover:border-border"
            >
              <p className="text-[13px] font-medium text-foreground">
                {section.title}
              </p>
              <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed">
                {section.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-[15px] font-medium">Can&apos;t find what you need?</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed max-w-[560px]">
          If your question isn&apos;t covered here, check the{" "}
          <Link
            href="/agents/docs/api-reference"
            className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            API Reference
          </Link>{" "}
          for endpoint details or reach out on{" "}
          <a
            href="https://discord.gg/21st-dev"
            target="_blank"
            rel="noopener noreferrer"
            className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            Discord
          </a>
          .
        </p>
      </section>
    </div>
  )
}
