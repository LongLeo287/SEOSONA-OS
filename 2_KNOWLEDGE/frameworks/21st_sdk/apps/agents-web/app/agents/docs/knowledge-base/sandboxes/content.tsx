import { CopyMarkdownButton } from "@/components/features/agents/an/docs/copy-markdown-button"

export default function SandboxesContent() {
  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            Sandboxes &amp; Infrastructure
          </h1>
          <CopyMarkdownButton />
        </div>
        <p className="mt-1.5 text-[14px] text-muted-foreground leading-relaxed">
          Sandbox specs, shared volumes, lifecycle hooks, concurrent users, and
          persistent storage.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">
          What are the sandbox hardware specs?
        </h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Default sandboxes run with up to 8 CPU and 8 GB RAM. For higher
          specs, contact support for a custom plan through E2B. Each sandbox
          runs Node 24 with git, curl, ripgrep, and GitHub CLI pre-installed.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">
          What happens when two users write in the same chat?
        </h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          <span className="font-medium text-foreground">Last user wins.</span>{" "}
          Each API call spawns a separate Claude process. If two users send
          messages to the same thread at the same time, both will receive their
          own responses, but Claude&apos;s internal conversation file will only
          retain the history from whichever request finishes last.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          For most applications this isn&apos;t an issue. If you need to handle
          concurrent users, use separate threads within the same sandbox - each
          thread has its own conversation history while sharing the same files
          and environment.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">
          Can I share files between sandboxes?
        </h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          E2B supports shared volumes backed by S3. This lets you mount a
          shared folder across multiple sandboxes - useful for shared skills,
          media libraries, or team assets. An alternative approach is to reuse a
          single sandbox with multiple threads instead of spinning up separate
          sandboxes per user.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          You can also build a custom solution using a tool that uploads/downloads
          from S3 or Supabase Storage, giving the agent access to shared assets
          without needing a FUSE mount.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">
          One sandbox with multiple threads vs. multiple sandboxes?
        </h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          <span className="font-medium text-foreground">
            One sandbox, multiple threads
          </span>{" "}
          - all users share the same filesystem and environment. Good when you
          want shared state (files, databases, running services). Use different
          threads to keep conversation histories separate.
        </p>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          <span className="font-medium text-foreground">
            Multiple sandboxes
          </span>{" "}
          - fully isolated environments. Good when users do heavy compute (e.g.
          video rendering) and you don&apos;t want them competing for resources.
          Use shared volumes if you need common files across sandboxes.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">
          Are there sandbox lifecycle hooks (onResume / onPause)?
        </h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Lifecycle hooks for sandbox pause/resume are on the roadmap. In the
          meantime, you can use startup scripts in your agent&apos;s{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-[13px] font-mono text-foreground">
            template/
          </code>{" "}
          directory to run initialization logic (e.g. starting a file server)
          when the sandbox starts.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">
          What happens when a sandbox times out?
        </h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Idle sandboxes are destroyed after a timeout period. After that, treat
          the old sandbox as gone and start a fresh sandbox/session. If you
          need to persist data across sandbox restarts, use environment
          variables, external storage, or shared volumes.
        </p>
      </section>
    </div>
  )
}
