/* ── Visual config types ── */

export type MessageBubbleStyle = "bubble-right" | "full-width"
export type MessageDensity = "relaxed" | "compact" | "dense"

export type ModesSelectorPosition = "popover" | "inline" | "hidden"
export type ModelSelectorPosition = "input-bar" | "header" | "hidden"

export type SendButtonStyle = "circle-icon" | "pill-text"
export type StopButtonStyle = "circle-square" | "pill-text"

export type ThinkingDisplayStyle = "collapsed" | "streaming" | "hidden"
export type CodeActionStyle = "diff-card" | "minimal" | "hidden"
export type BashDisplayStyle = "terminal-card" | "minimal" | "hidden"
export type SearchDisplayStyle = "rich-group" | "minimal" | "hidden"

export type AttachmentButtonStyle = "plus-circle" | "paperclip" | "hidden"
export type AttachmentPreviewStyle = "thumbnail" | "chip" | "hidden"

export type TextSizeScale = "sm" | "md" | "lg"
export type TextContrast = "normal" | "high"

export type IconFamily = "lucide" | "phosphor" | "tabler" | "heroicons"

/* ── Tool call style (unified selector) ── */

export type ToolCallStyle = "normal" | "compact"

export const TOOL_CALL_STYLE_DEFAULTS: Record<ToolCallStyle, Pick<VisualConfig,
  "thinkingDisplay" | "codeActionDisplay" | "bashDisplay" | "searchDisplay"
>> = {
  normal: {
    thinkingDisplay: "collapsed",
    codeActionDisplay: "minimal",
    bashDisplay: "minimal",
    searchDisplay: "rich-group",
  },
  compact: {
    thinkingDisplay: "streaming",
    codeActionDisplay: "diff-card",
    bashDisplay: "terminal-card",
    searchDisplay: "minimal",
  },
}

/** Color properties that can differ between light and dark modes. */
export interface ThemeModeColors {
  primaryColor?: string
  sendButtonColor?: string
  userMessageBg?: string
}

export interface VisualConfig {
  // Chat Layout
  messageBubbleStyle: MessageBubbleStyle
  messageDensity: MessageDensity
  showDateDivider: boolean
  stickyUserMessages: boolean

  // Message Appearance
  userMessageBg: string
  messageBorderRadius: string
  messageShadow: boolean

  // Input Bar
  inputBarShadow: boolean
  inputBarFill: boolean
  attachButtonRight: boolean
  modelSelectorLeft: boolean
  inputBarBorderRadius: string
  inputBarPlaceholder: string
  modesSelectorPosition: ModesSelectorPosition
  modelSelectorPosition: ModelSelectorPosition

  // Buttons
  sendButtonStyle: SendButtonStyle
  sendButtonColor: string
  stopButtonStyle: StopButtonStyle

  // Tool Calls
  toolCallStyle: ToolCallStyle
  thinkingDisplay: ThinkingDisplayStyle
  codeActionDisplay: CodeActionStyle
  bashDisplay: BashDisplayStyle
  searchDisplay: SearchDisplayStyle
  showToolIcons: boolean
  iconFamily: IconFamily

  // Theme
  primaryColor: string
  fontFamily: string
  textSizeScale: TextSizeScale
  textContrast: TextContrast

  // Attachments UI
  attachmentButtonStyle: AttachmentButtonStyle
  attachmentPreviewStyle: AttachmentPreviewStyle

  // Message Actions
  showCopyButton: boolean

  // Window Chrome
  showWindowChrome: boolean

  // Per-mode color overrides (override base value for that mode)
  light?: ThemeModeColors
  dark?: ThemeModeColors
}

/* ── Theme CSS custom property map ── */

export const THEME_VAR_MAP: Record<string, keyof VisualConfig> = {
  "--an-primary-color": "primaryColor",
  "--an-font-family": "fontFamily",
  "--an-text-size": "textSizeScale",
  "--an-text-contrast": "textContrast",
  "--an-border-radius": "messageBorderRadius",
  "--an-message-style": "messageBubbleStyle",
  "--an-message-density": "messageDensity",
  "--an-message-shadow": "messageShadow",
  "--an-user-message-bg": "userMessageBg",
  "--an-input-shadow-toggle": "inputBarShadow",
  "--an-input-fill": "inputBarFill",
  "--an-attachment-button-position": "attachButtonRight",
  "--an-model-selector-side": "modelSelectorLeft",
  "--an-input-placeholder": "inputBarPlaceholder",
  "--an-send-button-style": "sendButtonStyle",
  "--an-send-button-color": "sendButtonColor",
  "--an-stop-button-style": "stopButtonStyle",
  "--an-tool-call-style": "toolCallStyle",
  "--an-thinking-display": "thinkingDisplay",
  "--an-code-action-display": "codeActionDisplay",
  "--an-bash-display": "bashDisplay",
  "--an-search-display": "searchDisplay",
  "--an-show-tool-icons": "showToolIcons",
  "--an-attachment-button-style": "attachmentButtonStyle",
  "--an-attachment-preview-style": "attachmentPreviewStyle",
}

/* ── Visual presets ── */

export const VISUAL_PRESETS: Record<string, { label: string; description: string; config: VisualConfig }> = {
  notion: {
    label: "Notion-like",
    description: "Collaborative workspace style",
    config: {
      messageBubbleStyle: "bubble-right",
      messageDensity: "compact",
      showDateDivider: true,
      stickyUserMessages: false,
      userMessageBg: "#f5f5f5",
      messageBorderRadius: "16px",
      messageShadow: false,
      inputBarShadow: true,
      inputBarFill: false,
      attachButtonRight: false,
      modelSelectorLeft: false,
      inputBarBorderRadius: "16px",
      inputBarPlaceholder: "Do anything with AI...",
      modesSelectorPosition: "popover",
      modelSelectorPosition: "input-bar",
      sendButtonStyle: "circle-icon",
      sendButtonColor: "",
      stopButtonStyle: "circle-square",
      toolCallStyle: "normal",
      thinkingDisplay: "collapsed",
      codeActionDisplay: "minimal",
      bashDisplay: "minimal",
      searchDisplay: "rich-group",
      showToolIcons: true,
      iconFamily: "lucide",
      primaryColor: "#3b82f6",
      fontFamily: "system-ui, sans-serif",
      textSizeScale: "md",
      textContrast: "normal",
      attachmentButtonStyle: "plus-circle",
      attachmentPreviewStyle: "thumbnail",
      showCopyButton: true,
      showWindowChrome: false,
    },
  },
  cursor: {
    label: "Cursor-like",
    description: "Code editor / IDE style",
    config: {
      messageBubbleStyle: "full-width",
      messageDensity: "relaxed",
      showDateDivider: false,
      stickyUserMessages: true,
      userMessageBg: "",
      messageBorderRadius: "12px",
      messageShadow: false,
      inputBarShadow: false,
      inputBarFill: true,
      attachButtonRight: true,
      modelSelectorLeft: true,
      inputBarBorderRadius: "12px",
      inputBarPlaceholder: "Plan, search, or ask...",
      modesSelectorPosition: "inline",
      modelSelectorPosition: "input-bar",
      sendButtonStyle: "circle-icon",
      sendButtonColor: "",
      stopButtonStyle: "circle-square",
      toolCallStyle: "compact",
      thinkingDisplay: "streaming",
      codeActionDisplay: "diff-card",
      bashDisplay: "terminal-card",
      searchDisplay: "minimal",
      showToolIcons: false,
      iconFamily: "lucide",
      primaryColor: "#81A1C1",
      fontFamily: "system-ui, sans-serif",
      textSizeScale: "sm",
      textContrast: "normal",
      attachmentButtonStyle: "paperclip",
      attachmentPreviewStyle: "chip",
      showCopyButton: true,
      showWindowChrome: false,
      light: { primaryColor: "#3C7CAB" },
    },
  },
  minimal: {
    label: "Minimal",
    description: "Clean, simple interface",
    config: {
      messageBubbleStyle: "bubble-right",
      messageDensity: "relaxed",
      showDateDivider: false,
      stickyUserMessages: true,
      userMessageBg: "",
      messageBorderRadius: "12px",
      messageShadow: false,
      inputBarShadow: false,
      inputBarFill: false,
      attachButtonRight: false,
      modelSelectorLeft: false,
      inputBarBorderRadius: "12px",
      inputBarPlaceholder: "Ask the agent anything...",
      modesSelectorPosition: "hidden",
      modelSelectorPosition: "hidden",
      sendButtonStyle: "circle-icon",
      sendButtonColor: "",
      stopButtonStyle: "circle-square",
      toolCallStyle: "compact",
      thinkingDisplay: "hidden",
      codeActionDisplay: "minimal",
      bashDisplay: "minimal",
      searchDisplay: "minimal",
      showToolIcons: false,
      iconFamily: "lucide",
      primaryColor: "#3b82f6",
      fontFamily: "system-ui, sans-serif",
      textSizeScale: "sm",
      textContrast: "normal",
      attachmentButtonStyle: "paperclip",
      attachmentPreviewStyle: "chip",
      showCopyButton: false,
      showWindowChrome: true,
    },
  },
}

/* ── Constants ── */

export const ICON_FAMILY_OPTIONS: { id: IconFamily; label: string }[] = [
  { id: "lucide", label: "Lucide" },
  { id: "phosphor", label: "Phosphor" },
  { id: "tabler", label: "Tabler" },
  { id: "heroicons", label: "Heroicons" },
]

/** Resolve a color field, checking per-mode override first, then base. */
export function resolveColor(
  visual: VisualConfig,
  field: keyof ThemeModeColors,
  mode: "light" | "dark",
): string {
  const overrides = mode === "dark" ? visual.dark : visual.light
  return overrides?.[field] || visual[field] || ""
}

export const TEXT_SIZE_OPTIONS: { id: TextSizeScale; label: string; detail: string; value: string }[] = [
  { id: "sm", label: "Small", detail: "13px", value: "13px" },
  { id: "md", label: "Medium", detail: "14px", value: "14px" },
  { id: "lg", label: "Large", detail: "15px", value: "15px" },
]
