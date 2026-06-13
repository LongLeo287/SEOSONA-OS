/**
 * Re-export shim — types and timeline data have been split into:
 *   types/timeline.ts   — TimelineStep, StepState, Turn
 *   data/timelines.ts   — all 10 timeline arrays
 *
 * This file preserves backward compatibility for external consumers.
 */

// ── Types ──
export type { TimelineStep, StepState, Turn } from "./types/timeline"

// ── Legacy types still consumed externally ──
export type ChatStyle = "cursor" | "notion" | "perplexity" | "custom"
export type AppType = "support" | "code" | "research"

export interface ChatPreviewConfig {
  attachmentsEnabled?: boolean
  allowedModels?: { id: string; name: string; version?: string }[]
  activeModelId?: string
  showToolIcons?: boolean
  availableModes?: string[]
  defaultMode?: string
  borderRadius?: string
  fullWidthMessages?: boolean
  thinkingStyle?: "collapsed" | "expanded"
  modesDisplayStyle?: "notion" | "cursor"
  primaryColor?: string
  fontFamily?: string
}

// ── Timeline data ──
export {
  chatTimeline,
  notionChatTimeline,
  toolExecutionTimeline,
  notionToolExecutionTimeline,
  supportTimeline,
  notionSupportTimeline,
  codeTimeline,
  notionCodeTimeline,
  researchTimeline,
  notionResearchTimeline,
} from "./data/timelines"
