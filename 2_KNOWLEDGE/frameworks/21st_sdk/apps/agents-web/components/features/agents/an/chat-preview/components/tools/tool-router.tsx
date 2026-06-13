import type { TimelineStep, StepState } from "../../types/timeline"
import type { VisualConfig, ToolSize } from "../../types/theme"
import { ThinkingTool } from "./thinking-tool"
import { EditToolDiffCard, EditToolMinimal } from "./edit-tool"
import { BashToolTerminalCard, BashToolMinimal } from "./bash-tool"
import { ActionRow } from "./action-row"
import { GenericToolRow } from "./generic-tool-row"
import { ToolTimer } from "./tool-timer"

export function resolveToolSize(vc: VisualConfig): ToolSize {
  return vc.toolCallStyle === "compact" ? "compact" : "normal"
}

export function routeToolCall(
  step: Extract<TimelineStep, { type: "tool-call" }>,
  state: StepState,
  onComplete: () => void,
  vc: VisualConfig,
  actionIndex: number,
): React.ReactNode {
  const showIcon = vc.showToolIcons
  const toolSize = resolveToolSize(vc)

  // Thinking
  if (step.toolVariant === "thinking") {
    return <ThinkingTool key={step.id} step={step} state={state} onComplete={onComplete} vc={vc} size={toolSize} />
  }

  // Code actions (diff-card | minimal | hidden)
  if (step.diffLines || step.filePath || step.toolName === "Write" || step.toolName === "Edit") {
    if (vc.codeActionDisplay === "hidden") {
      return <ToolTimer key={step.id} step={step} state={state} onComplete={onComplete} />
    }
    if (vc.codeActionDisplay === "diff-card") {
      return <EditToolDiffCard key={step.id} step={step} state={state} onComplete={onComplete} showIcon={showIcon} />
    }
    return <EditToolMinimal key={step.id} step={step} state={state} onComplete={onComplete} showIcon={showIcon} size={toolSize} />
  }

  // Bash (terminal-card | minimal | hidden)
  if (step.bashCommand || step.toolName === "Bash") {
    if (vc.bashDisplay === "hidden") {
      return <ToolTimer key={step.id} step={step} state={state} onComplete={onComplete} />
    }
    if (vc.bashDisplay === "terminal-card") {
      return <BashToolTerminalCard key={step.id} step={step} state={state} onComplete={onComplete} showIcon={showIcon} />
    }
    return <BashToolMinimal key={step.id} step={step} state={state} onComplete={onComplete} showIcon={showIcon} size={toolSize} />
  }

  // Action variant or generic fallback
  if (step.toolVariant === "action" || !step.toolVariant) {
    return <ActionRow key={step.id} step={step} state={state} onComplete={onComplete} index={actionIndex} showIcon={showIcon} size={toolSize} />
  }

  return <GenericToolRow key={step.id} step={step} state={state} onComplete={onComplete} showIcon={showIcon} size={toolSize} />
}
