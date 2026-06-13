import type { TimelineStep, StepState } from "../chat-preview/types/timeline"

/**
 * Maps AI SDK tool invocation state to chat-preview StepState.
 */
function extractWebSearchResults(
  result: unknown,
): { title: string; url?: string }[] | undefined {
  if (!result || typeof result !== "object") {
    if (typeof result === "string") return parseMarkdownResults(result)
    return undefined
  }

  const obj = result as Record<string, unknown>

  if (Array.isArray(obj.results)) {
    const items: { title: string; url?: string }[] = []
    for (const entry of obj.results) {
      if (typeof entry === "string") continue
      if (entry && typeof entry === "object") {
        const e = entry as Record<string, unknown>
        if (Array.isArray(e.content)) {
          for (const item of e.content) {
            if (item && typeof item === "object" && (item as Record<string, unknown>).title) {
              items.push({
                title: String((item as Record<string, unknown>).title),
                url: (item as Record<string, unknown>).url
                  ? String((item as Record<string, unknown>).url)
                  : undefined,
              })
            }
          }
        }
        if (e.title) {
          items.push({ title: String(e.title), url: e.url ? String(e.url) : undefined })
        }
      }
    }
    if (items.length > 0) return items
  }

  if (Array.isArray(obj.content)) {
    for (const block of obj.content) {
      if (block && typeof block === "object" && (block as Record<string, unknown>).type === "text") {
        const text = (block as Record<string, unknown>).text
        if (typeof text === "string") {
          const parsed = parseMarkdownResults(text)
          if (parsed) return parsed
        }
      }
    }
  }

  return undefined
}

function parseMarkdownResults(text: string): { title: string; url?: string }[] | undefined {
  const sections = text.split(/^###\s+/m).filter(Boolean)
  if (sections.length === 0) return undefined
  const items: { title: string; url?: string }[] = []
  for (const section of sections) {
    const lines = section.split("\n").map((l) => l.trim()).filter(Boolean)
    if (lines.length === 0) continue
    const title = lines[0]!
    const urlLine = lines[1]
    let url: string | undefined
    if (urlLine && /^https?:\/\//.test(urlLine)) {
      url = urlLine
    }
    items.push({ title, url })
  }
  return items.length > 0 ? items : undefined
}

export function mapToolStateToStepState(
  aiState: "partial-call" | "call" | "result",
): StepState {
  return aiState === "result" ? "complete" : "animating"
}

/**
 * Maps a well-known tool name to the toolVariant used by chat-preview routing.
 */
function mapToolNameToVariant(
  toolName: string,
): "thinking" | "action" | "search" | undefined {
  const lower = toolName.toLowerCase()
  const baseName = lower.includes("__") ? lower.split("__").pop()! : lower
  if (baseName === "thinking" || baseName === "reasoning") return "thinking"
  if (
    baseName === "websearch" ||
    baseName === "web_search" ||
    baseName === "exa_search" ||
    baseName === "grep" ||
    baseName === "glob" ||
    baseName === "webfetch" ||
    baseName === "web_fetch" ||
    baseName.endsWith("_search")
  )
    return "search"
  return undefined
}

/**
 * Extracts a human-readable detail string from tool args.
 */
function extractToolDetail(toolName: string, args: Record<string, any>): string {
  const baseName = toolName.includes("__") ? toolName.split("__").pop()! : toolName
  switch (baseName) {
    case "Bash":
      return args?.command
        ? String(args.command).slice(0, 80)
        : ""
    case "Edit":
    case "Write":
    case "Read":
      return args?.file_path
        ? String(args.file_path).split("/").pop() ?? ""
        : ""
    case "Grep":
      return args?.pattern ? String(args.pattern) : ""
    case "Glob":
      return args?.pattern ? String(args.pattern) : ""
    case "WebSearch":
    case "web_search":
    case "exa_search":
      return args?.query ? String(args.query) : ""
    case "WebFetch":
    case "web_fetch":
      return args?.url ? String(args.url).slice(0, 60) : ""
    default:
      return ""
  }
}

/**
 * Converts an AI SDK tool invocation into a TimelineStep of type "tool-call"
 * that can be rendered by the chat-preview tool components.
 */
export function mapToolInvocationToStep(
  toolCallId: string,
  toolInvocation: {
    toolName: string
    args?: Record<string, any>
    state: "partial-call" | "call" | "result"
    result?: any
  },
): Extract<TimelineStep, { type: "tool-call" }> {
  const { toolName, args = {}, result } = toolInvocation
  const detail = extractToolDetail(toolName, args)

  const step: Extract<TimelineStep, { type: "tool-call" }> = {
    id: toolCallId,
    type: "tool-call",
    toolName,
    toolDetail: detail,
    duration: Number.MAX_SAFE_INTEGER, // prevent useToolComplete timer from firing
    toolVariant: mapToolNameToVariant(toolName),
  }

  // Bash fields
  if (toolName === "Bash") {
    step.bashCommand = args?.command ? String(args.command) : undefined
    if (toolInvocation.state === "result" && result) {
      step.bashOutput = typeof result === "string" ? result : JSON.stringify(result)
      step.bashSuccess = true
    }
  }

  // Edit / Write fields
  if (toolName === "Edit" || toolName === "Write" || toolName === "Read") {
    step.filePath = args?.file_path ? String(args.file_path) : undefined
  }

  // Search fields
  const isSearch = step.toolVariant === "search"
  if (isSearch) {
    const rawSearchQuery = args?.query ?? args?.pattern
    step.searchQuery = rawSearchQuery ? String(rawSearchQuery) : undefined
    const baseLower = toolName.toLowerCase().includes("__")
      ? toolName.toLowerCase().split("__").pop()!
      : toolName.toLowerCase()
    step.searchSource = (baseLower === "grep" || baseLower === "glob") ? "code" : "web"

    if (toolInvocation.state === "result" && result) {
      step.searchResults = extractWebSearchResults(result)
    }
  }

  // Thinking fields
  if (toolName.toLowerCase() === "thinking" || toolName.toLowerCase() === "reasoning") {
    step.thoughtContent =
      typeof args?.thought === "string"
        ? args.thought
        : typeof result === "string"
          ? result
          : undefined
  }

  return step
}
