import React, { memo, useState, useMemo } from "react"
import { ChevronRight } from "lucide-react"
import { TextShimmer } from "../components/text-shimmer"
import { getToolStatus, areToolPropsEqual } from "../utils/format-tool"
import type { McpToolInfo } from "./tool-registry"
import { cn } from "../utils/cn"
import { useThemeConfig } from "../theme-config"
import { TOOL_ROW_STYLES } from "../types/tool-styles"

interface McpToolProps {
  part: any
  mcpInfo: McpToolInfo
  chatStatus?: string
}

const PRIORITY_ARGS = ["query", "question", "email", "name", "id", "customer", "url", "issue", "body", "summary", "title"]

const ACTIVE_VERBS: Record<string, string> = {
  List: "Listing", Get: "Getting", Create: "Creating", Update: "Updating",
  Delete: "Deleting", Search: "Searching", Fetch: "Fetching", Retrieve: "Retrieving",
  Send: "Sending", Generate: "Generating", Add: "Adding", Remove: "Removing",
  Modify: "Modifying", Draft: "Drafting", Manage: "Managing", Query: "Querying",
  Start: "Starting", Set: "Setting", Check: "Checking", Find: "Finding",
}

const COMPLETED_VERBS: Record<string, string> = {
  List: "Listed", Get: "Got", Create: "Created", Update: "Updated",
  Delete: "Deleted", Search: "Searched", Fetch: "Fetched", Retrieve: "Retrieved",
  Send: "Sent", Generate: "Generated", Add: "Added", Remove: "Removed",
  Modify: "Modified", Draft: "Drafted", Manage: "Managed", Query: "Queried",
  Start: "Started", Set: "Set", Check: "Checked", Find: "Found",
}

function getActiveTitle(info: McpToolInfo): string {
  const words = info.displayName.split(" ")
  const verb = words[0]
  const rest = words.slice(1).join(" ")
  const active = ACTIVE_VERBS[verb]
  if (active) return rest ? `${active} ${rest}` : active
  return info.displayName
}

function getCompletedTitle(info: McpToolInfo): string {
  const words = info.displayName.split(" ")
  const verb = words[0]
  const rest = words.slice(1).join(" ")
  const completed = COMPLETED_VERBS[verb]
  return completed ? (rest ? `${completed} ${rest}` : completed) : info.displayName
}

function getResultCount(output: any): string | null {
  if (!output) return null
  if (Array.isArray(output)) {
    const n = output.length
    return `${n} ${n === 1 ? "result" : "results"}`
  }
  if (typeof output === "object") {
    let longest: any[] | undefined
    for (const v of Object.values(output)) {
      if (Array.isArray(v) && (!longest || v.length > longest.length)) {
        longest = v
      }
    }
    if (longest) {
      const n = longest.length
      return `${n} ${n === 1 ? "result" : "results"}`
    }
  }
  return null
}

function formatMcpArgs(input: any): string {
  if (!input || typeof input !== "object") return ""
  const entries = Object.entries(input).filter(([, v]) => v !== undefined && v !== null && v !== "")
  if (entries.length === 0) return ""

  const sorted = [...entries].sort(([a], [b]) => {
    const ai = PRIORITY_ARGS.indexOf(a)
    const bi = PRIORITY_ARGS.indexOf(b)
    if (ai !== -1 && bi !== -1) return ai - bi
    if (ai !== -1) return -1
    if (bi !== -1) return 1
    return 0
  })

  const parts: string[] = []
  for (const [key, value] of sorted) {
    if (parts.length >= 2) break
    const val = typeof value === "string" ? value : JSON.stringify(value)
    const display = val.length > 30 ? val.slice(0, 27) + "..." : val
    parts.push(`${key}: ${display}`)
  }
  return parts.join("  ")
}

export function unwrapMcpOutput(output: any): any {
  if (!output) return output
  if (Array.isArray(output)) {
    const textParts: string[] = []
    for (const block of output) {
      if (block?.type === "text" && typeof block?.text === "string") {
        textParts.push(block.text)
      }
    }
    if (textParts.length > 0) {
      const combined = textParts.join("")
      try { return JSON.parse(combined) } catch { return combined }
    }
    return output
  }
  if (output?.type === "text" && typeof output?.text === "string") {
    try { return JSON.parse(output.text) } catch { return output.text }
  }
  if (typeof output === "string") {
    try { return JSON.parse(output) } catch { return output }
  }
  return output
}

function formatOutputForDisplay(output: any): string {
  const unwrapped = unwrapMcpOutput(output)
  if (typeof unwrapped === "string") {
    return unwrapped.length > 3000 ? unwrapped.slice(0, 3000) + "\n..." : unwrapped
  }
  const text = JSON.stringify(unwrapped, null, 2)
  return text.length > 3000 ? text.slice(0, 3000) + "\n..." : text
}

function colorizeJson(json: string): string {
  return json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"([^"\\]|\\.)*"\s*:/g, (m) => `<span style="color:var(--an-code-keyword)">${m.slice(0, -1)}</span>:`)
    .replace(/:\s*"([^"\\]|\\.)*"/g, (m) => {
      const colon = m.indexOf('"')
      return m.slice(0, colon) + `<span style="color:var(--an-code-string)">${m.slice(colon)}</span>`
    })
    .replace(/:\s*(-?\d+\.?\d*)/g, (m, n) => m.replace(n, `<span style="color:#d97706">${n}</span>`))
    .replace(/:\s*(true|false|null)\b/g, (m, v) => m.replace(v, `<span style="color:var(--an-code-keyword)">${v}</span>`))
}

export const McpTool = memo(function McpTool({ part, mcpInfo, chatStatus }: McpToolProps) {
  const config = useThemeConfig()
  const toolSize = config.toolCallStyle === "compact" ? "compact" : "normal"
  const s = TOOL_ROW_STYLES[toolSize]
  const [isExpanded, setIsExpanded] = useState(false)
  const { isPending, isInterrupted } = getToolStatus(part, chatStatus)

  const unwrappedOutput = useMemo(() => unwrapMcpOutput(part.output), [part.output])

  const title = useMemo(() => {
    if (part.state === "input-streaming") return `Preparing ${mcpInfo.displayName}`
    if (isPending) return getActiveTitle(mcpInfo)
    return getCompletedTitle(mcpInfo)
  }, [part.state, isPending, mcpInfo])

  const resultCount = useMemo(() => {
    if (isPending) return null
    return getResultCount(unwrappedOutput)
  }, [isPending, unwrappedOutput])

  const subtitle = useMemo(() => {
    if (part.state === "input-streaming") return ""
    return formatMcpArgs(part.input)
  }, [part.input, part.state])

  const displayOutput = useMemo(() => {
    if (!part.output) return null
    return formatOutputForDisplay(part.output)
  }, [part.output])

  const highlightedOutput = useMemo(() => {
    if (!displayOutput) return null
    return colorizeJson(displayOutput)
  }, [displayOutput])

  const hasExpandableContent = (
    (part.input && Object.keys(part.input).length > 0) || !!part.output
  ) && !isPending

  if (isInterrupted && !part.output) {
    return (
      <div className={cn("an-tool-mcp flex items-center", s.container)}>
        <span className={s.text} style={{ color: "var(--an-tool-color-muted)" }}>
          {mcpInfo.displayName} interrupted
        </span>
      </div>
    )
  }

  return (
    <div className="an-tool-mcp">
      <div
        onClick={() => hasExpandableContent && setIsExpanded(!isExpanded)}
        className={cn("group flex items-start", s.container, hasExpandableContent && "cursor-pointer")}
      >
        <div className="flex-1 min-w-0 flex items-center gap-1.5">
          <div className={cn("flex items-center gap-1.5 min-w-0", s.text)} style={{ color: "var(--an-tool-color-muted)" }}>
            <span className="font-medium whitespace-nowrap flex-shrink-0">
              {isPending ? (
                <TextShimmer as="span" duration={1.2} className={s.shimmerClass}>
                  {title}
                </TextShimmer>
              ) : title}
            </span>

            {subtitle && (
              <span className="font-normal truncate min-w-0" style={{ opacity: 0.6 }}>{subtitle}</span>
            )}

            {resultCount && (
              <span className="font-normal whitespace-nowrap flex-shrink-0" style={{ opacity: 0.4 }}>{resultCount}</span>
            )}

            {hasExpandableContent && (
              <ChevronRight
                className={cn(
                  toolSize === "compact" ? "w-3.5 h-3.5" : "w-4 h-4",
                  "transition-transform duration-200 ease-out flex-shrink-0",
                  isExpanded && "rotate-90",
                  !isExpanded && "opacity-0 group-hover:opacity-100",
                )}
              />
            )}
          </div>
        </div>
      </div>

      {isExpanded && hasExpandableContent && (
        <div
          className="mb-1 rounded-md overflow-hidden"
          style={{ border: "1px solid var(--an-tool-border-color)", background: "var(--an-tool-background)" }}
        >
          {part.input && Object.keys(part.input).length > 0 && (
            <div className="px-2.5 py-1.5 space-y-0.5">
              {Object.entries(part.input)
                .filter(([, v]) => v !== undefined && v !== null && v !== "")
                .map(([key, value]) => (
                  <div key={key} className="flex items-baseline gap-1.5 text-[10px]">
                    <span className="font-mono flex-shrink-0" style={{ color: "var(--an-tool-color-muted)", opacity: 0.5 }}>{key}:</span>
                    <span className="font-mono truncate" style={{ color: "var(--an-tool-color-muted)", opacity: 0.7 }}>
                      {typeof value === "string" ? (value.length > 120 ? value.slice(0, 117) + "..." : value) : JSON.stringify(value)}
                    </span>
                  </div>
                ))}
            </div>
          )}

          {highlightedOutput && (
            <div
              className={cn("px-2.5 py-1.5 max-h-[200px] overflow-y-auto", part.input && Object.keys(part.input).length > 0 && "border-t")}
              style={{ borderColor: "var(--an-tool-border-color)" }}
            >
              <pre
                className="text-[10px] font-mono leading-relaxed whitespace-pre-wrap break-words"
                style={{ color: "var(--an-tool-color)" }}
                dangerouslySetInnerHTML={{ __html: highlightedOutput }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}, areToolPropsEqual)
