import type { TimelineStep, StepState } from "../types/timeline"
import type { ToolSize } from "../types/tool-styles"
import type { ChatThemeConfig } from "../theme-config"
import React from "react"

export function resolveToolSize(config: ChatThemeConfig): ToolSize {
  return config.toolCallStyle === "compact" ? "compact" : "normal"
}

export { routeToolCall }

// Note: routeToolCall is used by message-list to render tool calls from TimelineStep objects.
// It dynamically imports the tool components to avoid circular deps.
// This function returns a React.ReactNode.
function routeToolCall(
  step: Extract<TimelineStep, { type: "tool-call" }>,
  state: StepState,
  onComplete: () => void,
  config: ChatThemeConfig,
  actionIndex: number,
): React.ReactNode {
  // Lazy imports to prevent circular dependency issues
  const { ThinkingCollapsed, ThinkingStreaming, ThinkingHidden } = require("./thinking-tool")
  const { EditToolDiffCard, EditToolMinimal } = require("./edit-tool")
  const { BashToolTerminalCard, BashToolMinimal } = require("./bash-tool")
  const { ActionRow } = require("./action-row")
  const { GenericToolRow } = require("./generic-tool")
  const { ToolTimer } = require("./tool-timer")

  const showIcon = config.showToolIcons
  const toolSize = resolveToolSize(config)

  // Thinking
  if (step.toolVariant === "thinking") {
    if (config.thinkingDisplay === "hidden") {
      return React.createElement(ThinkingHidden, { key: step.id, step, state, onComplete })
    }
    if (config.thinkingDisplay === "streaming") {
      return React.createElement(ThinkingStreaming, { key: step.id, step, state, onComplete, showIcon, size: toolSize })
    }
    return React.createElement(ThinkingCollapsed, { key: step.id, step, state, onComplete, showIcon, size: toolSize })
  }

  // Code actions (diff-card | minimal | hidden)
  if (step.diffLines || step.filePath || step.toolName === "Write" || step.toolName === "Edit") {
    if (config.codeActionDisplay === "hidden") {
      return React.createElement(ToolTimer, { key: step.id, step, state, onComplete })
    }
    if (config.codeActionDisplay === "diff-card") {
      return React.createElement(EditToolDiffCard, { key: step.id, step, state, onComplete, showIcon })
    }
    return React.createElement(EditToolMinimal, { key: step.id, step, state, onComplete, showIcon, size: toolSize })
  }

  // Bash (terminal-card | minimal | hidden)
  if (step.bashCommand || step.toolName === "Bash") {
    if (config.bashDisplay === "hidden") {
      return React.createElement(ToolTimer, { key: step.id, step, state, onComplete })
    }
    if (config.bashDisplay === "terminal-card") {
      return React.createElement(BashToolTerminalCard, { key: step.id, step, state, onComplete, showIcon })
    }
    return React.createElement(BashToolMinimal, { key: step.id, step, state, onComplete, showIcon, size: toolSize })
  }

  // Action variant or generic fallback
  if (step.toolVariant === "action" || !step.toolVariant) {
    return React.createElement(ActionRow, { key: step.id, step, state, onComplete, index: actionIndex, showIcon, size: toolSize })
  }

  return React.createElement(GenericToolRow, { key: step.id, step, state, onComplete, showIcon, size: toolSize })
}
