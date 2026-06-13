import { CopyMarkdownButton } from "@/components/features/agents/an/docs/copy-markdown-button"

export default function MessagesAndHistoryContent() {
  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            Messages &amp; History
          </h1>
          <CopyMarkdownButton />
        </div>
        <p className="mt-1.5 text-[14px] text-muted-foreground leading-relaxed">
          How message persistence works, lazy loading history, and restoring
          conversations on mount.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">
          How are messages stored?
        </h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Messages are stored per thread in the 21st Agents database. On each
          turn, the relay appends the newest user message and the agent&apos;s
          response to the existing thread history. You can retrieve the full
          stored history via{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-[13px] font-mono text-foreground">
            client.threads.get({"{"} sandboxId, threadId {"}"})
          </code>
          .
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">
          How does message sending work under the hood?
        </h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          On each{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-[13px] font-mono text-foreground">
            sendMessage
          </code>{" "}
          call, you can pass the AI SDK&apos;s current{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-[13px] font-mono text-foreground">
            messages
          </code>{" "}
          array, but the relay uses only the last{" "}
          <span className="text-foreground font-medium">user</span> message as
          the next turn. Existing history is loaded from the stored thread, and
          the new turn is appended server-side instead of replacing the full
          message list in the database.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">
          How do I restore history on page mount?
        </h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          After mounting your chat component, fetch the existing messages using{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-[13px] font-mono text-foreground">
            client.threads.get({"{"} sandboxId, threadId {"}"})
          </code>{" "}
          and pass them to the AI SDK. This lets users see previous conversation
          when they return to the page. If you intentionally use one thread per
          sandbox and omit <code className="rounded bg-muted px-1.5 py-0.5 text-[13px] font-mono text-foreground">threadId</code>{" "}
          on send, look up the latest thread for that sandbox before hydrating
          the UI.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">
          Is lazy loading of message history supported?
        </h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Lazy loading for scrolling through long histories is on the roadmap.
          Currently, you fetch the full thread history on mount. For most use
          cases this is sufficient since individual threads don&apos;t
          accumulate thousands of messages.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-[15px] font-medium">
          Can I have multiple conversation threads?
        </h2>
        <p className="text-[14px] text-muted-foreground leading-relaxed">
          Yes. Threads are supported out of the box - create multiple threads
          within the same sandbox. Each thread has its own message history while
          sharing the same sandbox environment (files, state, tools). If you
          omit <code className="rounded bg-muted px-1.5 py-0.5 text-[13px] font-mono text-foreground">threadId</code>, the relay resumes the latest thread in that sandbox, so
          for multiple parallel conversations you should create threads
          explicitly and store each <code className="rounded bg-muted px-1.5 py-0.5 text-[13px] font-mono text-foreground">threadId</code>.
        </p>
      </section>
    </div>
  )
}
