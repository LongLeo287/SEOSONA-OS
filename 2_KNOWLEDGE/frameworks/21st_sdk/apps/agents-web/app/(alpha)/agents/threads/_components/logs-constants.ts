import { atom } from "jotai"
import { VISUAL_PRESETS } from "@/components/features/agents/an/types"
import { atomWithStorage } from "jotai/utils"
import type { DateRangeValue } from "./logs-date-range-picker"

export type SandboxStatusType = "active" | "error"
export type ThreadStatusType = "streaming" | "completed" | "error" | "cancelled"

export interface MessagePart {
  type: string
  text?: string
  toolName?: string
  args?: Record<string, unknown>
  input?: Record<string, unknown>
  result?: unknown
  output?: unknown
  state?: string
}

export interface Message {
  id: string
  role: "user" | "assistant" | "system"
  parts?: MessagePart[]
  content?: string
}

export const DEFAULT_VC = { ...VISUAL_PRESETS.notion!.config, showToolIcons: false, userMessageBg: "" }

export const SANDBOX_STATUS_STYLES: Record<SandboxStatusType, string> = {
  active: "bg-secondary text-foreground",
  error: "bg-destructive/10 text-destructive",
}

export const SANDBOX_DOT_COLORS: Record<SandboxStatusType, string> = {
  active: "bg-emerald-500",
  error: "bg-destructive",
}

export const THREAD_STATUS_STYLES: Record<ThreadStatusType, string> = {
  streaming: "bg-secondary text-foreground animate-pulse",
  completed: "bg-secondary text-foreground",
  error: "bg-destructive/10 text-destructive",
  cancelled: "bg-secondary text-muted-foreground",
}

export const THREAD_DOT_COLORS: Record<ThreadStatusType, string> = {
  completed: "bg-emerald-500",
  error: "bg-destructive",
  streaming: "bg-blue-500 animate-pulse",
  cancelled: "bg-muted-foreground",
}

export const DATE_RANGE_PRESETS = [
  { value: "all", label: "All Time" },
  { value: "1h", label: "Last Hour" },
  { value: "24h", label: "Last 24 Hours" },
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
] as const

export function formatDuration(ms: number | null | undefined): string {
  if (ms == null) return "-"
  if (ms < 1_000) return `${Math.round(ms)}ms`
  if (ms < 60_000) return `${(ms / 1_000).toFixed(1)}s`
  return `${(ms / 60_000).toFixed(1)}m`
}

export function formatTokens(n: number | null | undefined): string {
  if (n == null) return "-"
  return n.toLocaleString()
}

export function formatCost(usd: number | null | undefined): string {
  if (usd == null) return "-"
  if (usd < 0.01) return "<$0.01"
  return `$${usd.toFixed(2)}`
}

export function getDateFromPreset(preset: string, customFrom?: Date): string | undefined {
  if (preset === "custom" && customFrom) {
    return customFrom.toISOString()
  }
  const now = Date.now()
  switch (preset) {
    case "1h":
      return new Date(now - 60 * 60 * 1_000).toISOString()
    case "24h":
      return new Date(now - 24 * 60 * 60 * 1_000).toISOString()
    case "7d":
      return new Date(now - 7 * 24 * 60 * 60 * 1_000).toISOString()
    case "30d":
      return new Date(now - 30 * 24 * 60 * 60 * 1_000).toISOString()
    default:
      return undefined
  }
}

export function getDateToFromPreset(preset: string, customTo?: Date): string | undefined {
  if (preset === "custom" && customTo) {
    return customTo.toISOString()
  }
  return undefined
}

export function formatMessagePreview(preview: string | null | undefined): string {
  if (!preview) return "\u2014"
  return preview
}

export const logsStatusFilterAtom = atom<ThreadStatusType[]>([])
export const logsDateRangeAtom = atom<DateRangeValue>({ preset: "all" })
export const logsSearchQueryAtom = atom<string>("")
export const logsAgentFilterAtom = atom<string[]>([])
export const logsSandboxFilterAtom = atom<string[]>([])
export const logsGroupBySandboxAtom = atom<boolean>(false)

export const logsRightPanelWidthAtom = atomWithStorage<number>(
  "logs-right-panel-width",
  380,
  undefined,
  { getOnInit: true },
)

export const logsBottomPanelHeightAtom = atomWithStorage<number>(
  "logs-bottom-panel-height",
  Math.round(typeof window !== "undefined" ? window.innerHeight * 0.4 : 400),
  undefined,
  { getOnInit: true },
)

export const logsInspectorHeightAtom = atomWithStorage<number>(
  "logs-inspector-height",
  200,
  undefined,
  { getOnInit: true },
)

export const traceTreeWidthAtom = atomWithStorage<number>(
  "trace-tree-width",
  260,
  undefined,
  { getOnInit: true },
)

export const traceDetailWidthAtom = atomWithStorage<number>(
  "trace-detail-width",
  260,
  undefined,
  { getOnInit: true },
)

export const timelineTreeWidthAtom = atomWithStorage<number>(
  "timeline-tree-width",
  160,
  undefined,
  { getOnInit: true },
)

export const timelineInspectorDetailWidthAtom = atomWithStorage<number>(
  "timeline-inspector-detail-width",
  320,
  undefined,
  { getOnInit: true },
)
