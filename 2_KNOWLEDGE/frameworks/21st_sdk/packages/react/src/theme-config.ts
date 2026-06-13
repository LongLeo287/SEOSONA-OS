import React, { createContext, useContext } from "react"
import type { ChatTheme } from "./types"

export interface ChatThemeConfig {
  messageStyle: "bubble-right" | "full-width"
  messageDensity: "relaxed" | "compact" | "dense"
  inputStyle: "rounded" | "flat" | "bordered"
  sendButtonStyle: "circle-icon" | "pill-text" | "minimal"
  stopButtonStyle: "circle-square" | "pill-text"
  thinkingDisplay: "collapsed" | "streaming" | "hidden"
  codeActionDisplay: "diff-card" | "minimal" | "hidden"
  bashDisplay: "terminal-card" | "minimal" | "hidden"
  searchDisplay: "rich-group" | "minimal" | "hidden"
  showToolIcons: boolean
  messageShadow: boolean
  stickyUserMessages: boolean
  showDateDivider: boolean
  inputBarPlaceholder: string
  toolCallStyle: "normal" | "compact"
  textContrast: "normal" | "high"
  showCopyButton: boolean
  attachmentButtonStyle: "plus-circle" | "paperclip" | "hidden"
  attachmentButtonPosition: "left" | "right"
  modelSelectorPosition: "input-bar" | "hidden"
  modelSelectorDisplay: "popover" | "badge"
  modelSelectorSide: "left" | "right"
  modeSelectorPosition: "inline" | "popover" | "hidden"
  inputFill: boolean
  inputShadow: boolean
  showWindowChrome: boolean
  attachmentPreviewStyle: "thumbnail" | "chip" | "hidden"
}

// Legacy type alias kept for compatibility.
export type AnThemeConfig = ChatThemeConfig

export const DEFAULT_THEME_CONFIG: ChatThemeConfig = {
  messageStyle: "bubble-right",
  messageDensity: "relaxed",
  inputStyle: "bordered",
  sendButtonStyle: "circle-icon",
  stopButtonStyle: "circle-square",
  thinkingDisplay: "collapsed",
  codeActionDisplay: "diff-card",
  bashDisplay: "terminal-card",
  searchDisplay: "rich-group",
  showToolIcons: false,
  messageShadow: false,
  stickyUserMessages: false,
  showDateDivider: false,
  inputBarPlaceholder: "Send a message...",
  toolCallStyle: "compact",
  textContrast: "normal",
  showCopyButton: true,
  attachmentButtonStyle: "hidden",
  attachmentButtonPosition: "left",
  modelSelectorPosition: "hidden",
  modelSelectorDisplay: "popover",
  modelSelectorSide: "right",
  modeSelectorPosition: "hidden",
  inputFill: false,
  inputShadow: false,
  showWindowChrome: false,
  attachmentPreviewStyle: "thumbnail",
}

const VALID_VALUES: Record<string, string[]> = {
  messageStyle: ["bubble-right", "full-width"],
  messageDensity: ["relaxed", "compact", "dense"],
  inputStyle: ["rounded", "flat", "bordered"],
  sendButtonStyle: ["circle-icon", "pill-text", "minimal"],
  stopButtonStyle: ["circle-square", "pill-text"],
  thinkingDisplay: ["collapsed", "streaming", "hidden"],
  codeActionDisplay: ["diff-card", "minimal", "hidden"],
  bashDisplay: ["terminal-card", "minimal", "hidden"],
  searchDisplay: ["rich-group", "minimal", "hidden"],
  toolCallStyle: ["normal", "compact"],
  textContrast: ["normal", "high"],
  attachmentButtonStyle: ["plus-circle", "paperclip", "hidden"],
  attachmentButtonPosition: ["left", "right"],
  modelSelectorPosition: ["input-bar", "hidden"],
  modelSelectorDisplay: ["popover", "badge"],
  modelSelectorSide: ["left", "right"],
  modeSelectorPosition: ["inline", "popover", "hidden"],
  attachmentPreviewStyle: ["thumbnail", "chip", "hidden"],
}

function readEnum<T extends string>(
  record: Record<string, string>,
  cssVar: string,
  key: string,
  fallback: T,
): T {
  const val = record[cssVar]
  if (!val) return fallback
  const clean = val.trim()
  if (VALID_VALUES[key]?.includes(clean)) return clean as T
  return fallback
}

export function extractThemeConfig(theme?: ChatTheme): ChatThemeConfig {
  if (!theme?.theme) return DEFAULT_THEME_CONFIG
  const t = theme.theme

  return {
    messageStyle: readEnum(t, "--an-message-style", "messageStyle", DEFAULT_THEME_CONFIG.messageStyle),
    messageDensity: readEnum(t, "--an-message-density", "messageDensity", DEFAULT_THEME_CONFIG.messageDensity),
    inputStyle: readEnum(t, "--an-input-style", "inputStyle", DEFAULT_THEME_CONFIG.inputStyle),
    sendButtonStyle: readEnum(t, "--an-send-button-style", "sendButtonStyle", DEFAULT_THEME_CONFIG.sendButtonStyle),
    stopButtonStyle: readEnum(t, "--an-stop-button-style", "stopButtonStyle", DEFAULT_THEME_CONFIG.stopButtonStyle),
    thinkingDisplay: readEnum(t, "--an-thinking-display", "thinkingDisplay", DEFAULT_THEME_CONFIG.thinkingDisplay),
    codeActionDisplay: readEnum(t, "--an-code-action-display", "codeActionDisplay", DEFAULT_THEME_CONFIG.codeActionDisplay),
    bashDisplay: readEnum(t, "--an-bash-display", "bashDisplay", DEFAULT_THEME_CONFIG.bashDisplay),
    searchDisplay: readEnum(t, "--an-search-display", "searchDisplay", DEFAULT_THEME_CONFIG.searchDisplay),
    showToolIcons: t["--an-show-tool-icons"] === "true",
    messageShadow: t["--an-message-shadow"] === "true",
    stickyUserMessages: t["--an-sticky-user-messages"] === "true",
    showDateDivider: t["--an-show-date-divider"] === "true",
    inputBarPlaceholder: t["--an-input-placeholder"] || "Send a message...",
    toolCallStyle: readEnum(t, "--an-tool-call-style", "toolCallStyle", DEFAULT_THEME_CONFIG.toolCallStyle),
    textContrast: readEnum(t, "--an-text-contrast", "textContrast", DEFAULT_THEME_CONFIG.textContrast),
    showCopyButton: t["--an-show-copy-button"] !== "false",
    attachmentButtonStyle: readEnum(t, "--an-attachment-button-style", "attachmentButtonStyle", DEFAULT_THEME_CONFIG.attachmentButtonStyle),
    attachmentButtonPosition: readEnum(t, "--an-attachment-button-position", "attachmentButtonPosition", DEFAULT_THEME_CONFIG.attachmentButtonPosition),
    modelSelectorPosition: readEnum(t, "--an-model-selector-position", "modelSelectorPosition", DEFAULT_THEME_CONFIG.modelSelectorPosition),
    modelSelectorDisplay: readEnum(t, "--an-model-selector-display", "modelSelectorDisplay", DEFAULT_THEME_CONFIG.modelSelectorDisplay),
    modelSelectorSide: readEnum(t, "--an-model-selector-side", "modelSelectorSide", DEFAULT_THEME_CONFIG.modelSelectorSide),
    modeSelectorPosition: readEnum(t, "--an-mode-selector-position", "modeSelectorPosition", DEFAULT_THEME_CONFIG.modeSelectorPosition),
    inputFill: t["--an-input-fill"] === "true",
    inputShadow: t["--an-input-shadow-toggle"] === "true",
    showWindowChrome: t["--an-show-window-chrome"] === "true",
    attachmentPreviewStyle: readEnum(t, "--an-attachment-preview-style", "attachmentPreviewStyle", DEFAULT_THEME_CONFIG.attachmentPreviewStyle),
  }
}

export const ThemeConfigContext = createContext<ChatThemeConfig>(DEFAULT_THEME_CONFIG)

export function useThemeConfig(): ChatThemeConfig {
  return useContext(ThemeConfigContext)
}
