import { AgentsLink as Link } from "@/components/agents-link"
import { CopyMarkdownButton } from "@/components/features/agents/an/docs/copy-markdown-button"

export default function ObservabilityPage() {
  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            Observability
          </h1>
          <CopyMarkdownButton />
        </div>
        <p className="mt-1.5 text-[14px] text-muted-foreground leading-relaxed max-w-[520px]">
          High-level view of your agent activity - session counts, cost
          tracking, error rates, and usage trends across all your agents.
        </p>
      </div>

      {/* Overview */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Overview</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The dashboard gives you two levels of visibility into your agents.
          This page covers the high-level metrics. For drilling into individual
          sessions and conversation turns, see{" "}
          <Link
            href="/agents/docs/deploy/logs"
            className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
          >
            Logs
          </Link>
          .
        </p>
      </section>

      {/* Dashboard layout */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Dashboard layout</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          The overview chart at the top shows sessions and threads over time.
          Toggle between the two views. Below it, three metric cards track
          cost, duration, and errors.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              label: "Cost",
              description:
                "Total USD spend over the selected period. Spot unexpected spikes early.",
            },
            {
              label: "Duration",
              description:
                "Average execution time per thread. Identify slow turns or timeouts.",
            },
            {
              label: "Errors",
              description:
                "Error rate (%) and absolute count. Recent errors are listed below the cards.",
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
      </section>

      {/* Live monitoring */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Live monitoring</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          When any thread is actively streaming, a pulsing blue{" "}
          <span className="font-medium text-foreground">Live</span> indicator
          appears next to the date picker. The dashboard auto-refreshes while
          streams are active.
        </p>
      </section>

      {/* Date range filtering */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Date range filtering</h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          All metrics can be filtered by date range. Use the presets or pick a
          custom range.
        </p>
        <div className="flex flex-wrap gap-2">
          {["Last hour", "Last 24 hours", "Last 7 days", "Last 30 days", "Custom range"].map(
            (preset) => (
              <span
                key={preset}
                className="rounded-lg border border-border px-3 py-1.5 text-[12px] text-muted-foreground"
              >
                {preset}
              </span>
            ),
          )}
        </div>
      </section>

      {/* Debugging tips */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">Debugging tips</h2>
        <ul className="list-disc pl-5 space-y-2 text-[13px] text-muted-foreground leading-relaxed">
          <li>
            <span className="font-medium text-foreground">
              Recent errors
            </span>{" "}
            - scroll below the metric cards to see the latest errors with
            timestamps. Look for patterns across sessions.
          </li>
          <li>
            <span className="font-medium text-foreground">Cost spikes</span> -
            switch between date ranges to narrow down when costs jumped. Drill
            into individual sessions in{" "}
            <Link
              href="/agents/docs/deploy/logs"
              className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground"
            >
              Logs
            </Link>{" "}
            to see which threads drove the cost.
          </li>
          <li>
            <span className="font-medium text-foreground">
              Slow responses
            </span>{" "}
            - check the Duration card for high averages. Replay slow threads in
            Logs to see if the agent is making too many tool calls.
          </li>
        </ul>
      </section>

      {/* CTA */}
      <div className="rounded-xl border border-dashed border-border bg-sidebar p-6 text-center space-y-3">
        <div>
          <p className="text-[15px] font-medium">Monitor your agents</p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Open the dashboard to view metrics and track agent performance.
          </p>
        </div>
        <Link
          href="/agents/observability"
          className="an-focus-btn inline-flex items-center gap-1.5 rounded-[10px] bg-foreground px-4 py-1.5 text-[13px] font-medium text-background transition-all duration-150 hover:opacity-90 active:scale-[0.99]"
        >
          Open Observability
        </Link>
      </div>

      {/* What's next */}
      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">What&apos;s next</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { title: "Logs", description: "Browse sessions, inspect dialogs, and debug errors.", href: "/agents/docs/deploy/logs" },
            { title: "Security", description: "Runtime isolation, permissions, and access control.", href: "/agents/docs/security/overview" },
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
