/**
 * @21st-sdk/react chat preview — public API surface
 *
 * Demo mode:
 *   import { UnifiedChatPreview } from "./chat-preview"
 *
 * Components (for custom composition):
 *   import { UserMessage, AssistantStream, ... } from "./chat-preview/components"
 *
 * Types:
 *   import type { Message, Theme, TimelineStep } from "./chat-preview/types"
 *
 * Data:
 *   import { chatTimeline, SEARCH_RESULT_SETS } from "./chat-preview/data"
 */

// ── Main preview component ──
export { UnifiedChatPreview } from "./unified-preview"

// ── Types ──
export type { TimelineStep, StepState, Turn } from "./types/timeline"
export type { Message, ToolCall, ToolCallStatus, Attachment, ChatError } from "./types/message"
export type { Theme, ResolvedTheme } from "./types/theme"

// ── Hooks ──
export { useAnimationTimeline } from "./hooks/use-animation-timeline"
export { useStreamingText } from "./hooks/use-streaming-text"
export { useContainerHeight } from "./hooks/use-container-height"
export { groupIntoTurns } from "./hooks/group-into-turns"

// ── Components (re-export for custom composition) ──
export {
  UserMessage,
  AssistantStream,
  StreamingMarkdown,
  WindowChrome,
  DateDivider,
  ReplayButton,
  ImageThumb,
} from "./components"

export {
  ToolTimer,
  ThinkingTool,
  EditToolDiffCard, EditToolMinimal,
  BashToolTerminalCard, BashToolMinimal,
  SearchGroupRich, SearchGroupMinimal,
  ActionRow,
  GenericToolRow,
  routeToolCall,
} from "./components/tools"

export {
  UnifiedInputBar,
  SendButtonUnified,
  AttachmentButton,
  ModelPopover, ModelBadge,
  SettingsPopover,
  InlineModeSelector,
} from "./components/input"
