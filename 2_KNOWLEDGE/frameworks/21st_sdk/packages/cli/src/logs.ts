import * as p from "@clack/prompts"
import { requireAuth, requireAgentSlug, requestJson } from "./api.js"
import { getFlagValue, formatTimestamp, formatCell } from "./utils.js"

type MessagePart = {
  type: string
  text?: string
  toolName?: string
  args?: Record<string, unknown>
  result?: unknown
  state?: string
}

type Message = {
  id: string
  role: "user" | "assistant" | "system"
  parts?: MessagePart[]
  content?: string
}

type ThreadSummary = {
  id: string
  status: string
  stream_id: string | null
  claude_session_id: string | null
  input_tokens: number | null
  output_tokens: number | null
  total_tokens: number | null
  total_cost_usd: number | null
  duration_ms: number | null
  created_at: string
  completed_at: string | null
  error: string | null
  messages?: Message[] | null
}

type SandboxSummary = {
  id: string
  client_sandbox_id: string
  sandbox_id: string | null
  status: string
  error: string | null
  created_at: string
  updated_at: string
  agent: {
    id: string
    name: string
    slug: string
  }
  threads: ThreadSummary[]
}

type LogsResponse = {
  sandboxes: SandboxSummary[]
  nextCursor?: string
}

type SandboxDetailResponse = {
  sandbox: SandboxSummary
}

type SandboxHeader = Omit<SandboxSummary, "threads">

type ThreadDetailResponse = {
  sandbox: SandboxHeader
  thread: ThreadSummary
}

function formatDuration(ms: number | null | undefined): string {
  if (!ms) return "-"
  if (ms < 1_000) return `${ms}ms`
  if (ms < 60_000) return `${(ms / 1_000).toFixed(1)}s`
  return `${(ms / 60_000).toFixed(1)}m`
}

function formatTokens(n: number | null | undefined): string {
  if (n == null) return "-"
  return n.toLocaleString()
}

function formatCost(usd: number | null | undefined): string {
  if (usd == null) return "-"
  if (usd < 0.01) return "<$0.01"
  return `$${usd.toFixed(2)}`
}

function formatJson(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}

function printIndented(text: string) {
  for (const line of text.split("\n")) {
    console.log(`  ${line}`)
  }
}

function renderMessage(msg: Message) {
  console.log()
  console.log(msg.role.toUpperCase())

  if (msg.parts?.length) {
    for (const part of msg.parts) {
      if (part.type === "text" && part.text) {
        printIndented(part.text)
        continue
      }

      if (part.type === "tool-invocation" || part.type.startsWith("tool-")) {
        const toolName = part.toolName || part.type.replace(/^tool-/, "") || "unknown"
        console.log(`  [tool] ${toolName}${part.state ? ` (${part.state})` : ""}`)
        if (part.args !== undefined) {
          console.log("  args:")
          printIndented(formatJson(part.args))
        }
        if (part.result !== undefined) {
          console.log("  result:")
          printIndented(formatJson(part.result))
        }
        continue
      }

      if (part.text) {
        printIndented(part.text)
      }
    }
    return
  }

  if (msg.content) {
    printIndented(msg.content)
  }
}

function printChatDetail(sandbox: SandboxSummary) {
  const totals = sandbox.threads.reduce(
    (acc, thread) => ({
      tokens: acc.tokens + (thread.total_tokens ?? 0),
      cost: acc.cost + (thread.total_cost_usd ?? 0),
      duration: acc.duration + (thread.duration_ms ?? 0),
    }),
    { tokens: 0, cost: 0, duration: 0 },
  )

  console.log()
  console.log(`Chat ID: ${sandbox.client_sandbox_id}`)
  console.log(`Agent: ${sandbox.agent.name}`)
  console.log(`Created: ${formatTimestamp(sandbox.created_at)}`)
  console.log(`Status: ${sandbox.status}`)
  if (totals.tokens > 0) console.log(`Tokens: ${formatTokens(totals.tokens)}`)
  if (totals.cost > 0) console.log(`Cost: ${formatCost(totals.cost)}`)
  if (totals.duration > 0) console.log(`Duration: ${formatDuration(totals.duration)}`)
  if (sandbox.sandbox_id) console.log(`Sandbox: ${sandbox.sandbox_id}`)

  if (sandbox.threads.length === 0) {
    console.log()
    p.log.info("No threads found.")
    return
  }

  console.log()
  console.log("Threads")
  console.log("#  Thread ID                              Status      Tokens    Cost      Time")
  sandbox.threads.forEach((thread, index) => {
    console.log(
      [
        String(index + 1).padEnd(2, " "),
        thread.id.padEnd(36, " "),
        thread.status.padEnd(10, " "),
        formatTokens(thread.total_tokens).padEnd(8, " "),
        formatCost(thread.total_cost_usd).padEnd(9, " "),
        formatDuration(thread.duration_ms),
      ].join("  "),
    )
  })
  console.log()
}

function printThreadDetail(sandbox: SandboxHeader, thread: ThreadSummary) {
  console.log()
  console.log(`Chat ID: ${sandbox.client_sandbox_id}`)
  console.log(`Thread ID: ${thread.id}`)
  console.log(`Status: ${thread.status}`)
  console.log(`Input: ${formatTokens(thread.input_tokens)}`)
  console.log(`Output: ${formatTokens(thread.output_tokens)}`)
  console.log(`Cost: ${formatCost(thread.total_cost_usd)}`)
  console.log(`Duration: ${formatDuration(thread.duration_ms)}`)

  if (thread.error) {
    console.log()
    console.log("Error")
    printIndented(thread.error)
  }

  const messages = thread.messages ?? []
  if (messages.length === 0) {
    console.log()
    p.log.info("No messages.")
    return
  }

  console.log()
  console.log("Messages")
  for (const msg of messages) {
    renderMessage(msg)
  }
  console.log()
}

export async function logs(args: string[]) {
  const apiKey = requireAuth()
  const agentSlug = requireAgentSlug(args, "logs <agent-slug> [chat-id] [thread-id]")
  const spinner = p.spinner()
  const jsonOutput = args.includes("--json")
  const chatId = args[1] && !args[1].startsWith("-") ? args[1] : undefined
  const threadId = args[2] && !args[2].startsWith("-") ? args[2] : undefined

  const status = getFlagValue(args, "--status")
  if (status && status !== "active" && status !== "error") {
    p.log.error("Invalid --status value. Use `active` or `error`.")
    process.exit(1)
  }

  const limitValue = getFlagValue(args, "--limit")
  const limit = limitValue ? Number.parseInt(limitValue, 10) : 20
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    p.log.error("Invalid --limit value. Use an integer from 1 to 100.")
    process.exit(1)
  }

  try {
    if (chatId) {
      if (threadId) {
        if (!jsonOutput) {
          spinner.start(`Fetching thread ${threadId} in chat ${chatId} for ${agentSlug}...`)
        }
        const data = await requestJson<ThreadDetailResponse>(
          apiKey,
          `/agents/${encodeURIComponent(agentSlug)}/logs/${encodeURIComponent(chatId)}`,
          { method: "GET" },
          "Failed to fetch thread logs",
          { threadId },
        )
        if (!jsonOutput) {
          spinner.stop(`Fetched thread ${threadId} in chat ${chatId} for ${agentSlug}`)
        }

        if (jsonOutput) {
          console.log(JSON.stringify(data.thread, null, 2))
          return
        }

        printThreadDetail(data.sandbox, data.thread)
        return
      }

      if (!jsonOutput) {
        spinner.start(`Fetching chat ${chatId} for ${agentSlug}...`)
      }
      const data = await requestJson<SandboxDetailResponse>(
        apiKey,
        `/agents/${encodeURIComponent(agentSlug)}/logs/${encodeURIComponent(chatId)}`,
        { method: "GET" },
        "Failed to fetch chat logs",
      )
      if (!jsonOutput) {
        spinner.stop(`Fetched chat ${chatId} for ${agentSlug}`)
      }

      if (jsonOutput) {
        console.log(JSON.stringify(data, null, 2))
        return
      }

      printChatDetail(data.sandbox)
      return
    }

    const query = {
      status,
      search: getFlagValue(args, "--search"),
      createdAfter: getFlagValue(args, "--since"),
      createdBefore: getFlagValue(args, "--until"),
      limit,
      cursor: getFlagValue(args, "--cursor"),
    }

    if (!jsonOutput) {
      spinner.start(`Fetching logs for ${agentSlug}...`)
    }
    const data = await requestJson<LogsResponse>(
      apiKey,
      `/agents/${encodeURIComponent(agentSlug)}/logs`,
      { method: "GET" },
      "Failed to fetch logs",
      query,
    )
    if (!jsonOutput) {
      spinner.stop(`Fetched logs for ${agentSlug}`)
    }

    if (jsonOutput) {
      console.log(JSON.stringify(data, null, 2))
      return
    }

    if (data.sandboxes.length === 0) {
      p.log.info("No logs found.")
      return
    }

    console.log()
    console.log(
      [
        formatCell("Created", 19),
        formatCell("Status", 8),
        formatCell("Chat ID", 40),
        "Threads",
      ].join("  "),
    )

    for (const sandbox of data.sandboxes) {
      console.log(
        [
          formatCell(formatTimestamp(sandbox.created_at), 19),
          formatCell(sandbox.status, 8),
          formatCell(sandbox.client_sandbox_id, 40),
          String(sandbox.threads.length),
        ].join("  "),
      )
    }

    console.log()
    p.log.info(`${data.sandboxes.length} log session${data.sandboxes.length !== 1 ? "s" : ""}`)
    if (data.nextCursor) {
      p.log.info(`Next cursor: ${data.nextCursor}`)
      console.log(`Reuse the same filters with --cursor ${data.nextCursor} to fetch the next page.`)
    }
  } catch (err: any) {
    if (!jsonOutput) {
      spinner.stop(
        threadId
          ? `Failed to fetch thread ${threadId} in chat ${chatId} for ${agentSlug}`
          : chatId
            ? `Failed to fetch chat ${chatId} for ${agentSlug}`
            : `Failed to fetch logs for ${agentSlug}`,
      )
    }
    p.log.error(err.message)
    process.exit(1)
  }
}
