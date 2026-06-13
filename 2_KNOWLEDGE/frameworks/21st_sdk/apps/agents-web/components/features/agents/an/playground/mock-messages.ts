import type { UIMessage } from "ai"
import { chatTimeline, notionChatTimeline } from "../chat-preview/data/timelines"
import type { TimelineStep } from "../chat-preview/types/timeline"

type ToolCallStep = Extract<TimelineStep, { type: "tool-call" }>

function timelineToMessages(steps: TimelineStep[]): UIMessage[] {
  const messages: UIMessage[] = []
  let currentAssistantParts: any[] = []
  let assistantId = 0

  function flushAssistant() {
    if (currentAssistantParts.length === 0) return
    messages.push({
      id: `assistant-${assistantId++}`,
      role: "assistant",
      parts: currentAssistantParts,
      createdAt: new Date(),
    } as UIMessage)
    currentAssistantParts = []
  }

  for (const step of steps) {
    if (step.type === "pause" || step.type === "input-typing") continue

    if (step.type === "user-message") {
      flushAssistant()

      const parts: any[] = []
      if (step.image) {
        parts.push({ type: "image", url: step.image })
      }
      parts.push({ type: "text", text: step.content })

      messages.push({
        id: step.id,
        role: "user",
        parts,
        createdAt: new Date(),
      } as UIMessage)
      continue
    }

    if (step.type === "tool-call") {
      currentAssistantParts.push(convertToolStep(step))
      continue
    }

    if (step.type === "assistant-stream") {
      currentAssistantParts.push({ type: "text", text: step.content })
    }
  }

  flushAssistant()
  return messages
}

function convertToolStep(step: ToolCallStep): any {
  // Thinking tool
  if (step.toolVariant === "thinking") {
    return {
      type: "tool-Thinking",
      toolCallId: step.id,
      state: "output-available",
      input: { thinking: step.thoughtContent || "" },
      output: { thinking: step.thoughtContent || "" },
    }
  }

  // Search tool (WebSearch variant)
  if (step.toolVariant === "search") {
    return {
      type: "tool-WebSearch",
      toolCallId: step.id,
      state: "output-available",
      input: { query: step.searchQuery || step.toolDetail },
      output: { results: [] },
    }
  }

  // Bash tool
  if (step.bashCommand) {
    return {
      type: "tool-Bash",
      toolCallId: step.id,
      state: "output-available",
      input: { command: step.bashCommand },
      output: {
        stdout: step.bashOutput || "",
        exitCode: step.bashSuccess === false ? 1 : 0,
      },
    }
  }

  // Edit/Write tool (has file path + diff lines)
  if (step.filePath && step.diffLines) {
    const isWrite = step.toolName === "Write"
    const structuredPatch = [{
      lines: step.diffLines.map(l =>
        l.type === "add" ? `+${l.content}` :
        l.type === "remove" ? `-${l.content}` :
        ` ${l.content}`
      ),
    }]
    return {
      type: isWrite ? "tool-Write" : "tool-Edit",
      toolCallId: step.id,
      state: "output-available",
      input: { file_path: step.filePath },
      output: { structuredPatch },
    }
  }

  // Generic MCP-style tool (fallback for named tools without special fields)
  return {
    type: `tool-mcp__user-tools__${step.toolName.replace(/\s+/g, "_")}`,
    toolCallId: step.id,
    state: "output-available",
    input: { detail: step.toolDetail },
    output: { success: true },
  }
}

export const chatMessages = timelineToMessages(chatTimeline)
export const notionChatMessages = timelineToMessages(notionChatTimeline)
