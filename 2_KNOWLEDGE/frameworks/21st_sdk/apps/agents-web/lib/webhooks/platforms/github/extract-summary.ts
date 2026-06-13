/**
 * Extract a readable summary from agent messages for GitHub comment
 */

interface MessagePart {
  type: string
  text?: string
  toolName?: string
  result?: unknown
}

interface AgentMessage {
  role: "user" | "assistant"
  parts?: MessagePart[]
}

/**
 * Extract summary from agent conversation messages
 * Focuses on the last assistant response text
 */
export function extractSummary(messages: AgentMessage[]): string {
  // Find the last assistant message
  const assistantMessages = messages.filter((m) => m.role === "assistant")
  const lastAssistant = assistantMessages.at(-1)

  if (!lastAssistant || !lastAssistant.parts) {
    return "No response generated."
  }

  // Extract text parts from the message
  const textParts = lastAssistant.parts
    .filter((p) => p.type === "text" && p.text)
    .map((p) => p.text!)

  if (textParts.length === 0) {
    // Check for tool calls as fallback
    const toolCalls = lastAssistant.parts.filter(
      (p) => p.type === "tool-call" || p.type === "tool-result"
    )
    if (toolCalls.length > 0) {
      const toolNames = Array.from(
        new Set(toolCalls.map((t) => t.toolName).filter(Boolean))
      )
      return `Agent executed tools: ${toolNames.join(", ")}`
    }
    return "Task completed (no text output)."
  }

  // Use only the LAST text part - that's the final response
  // Earlier text parts are just "thinking out loud" before tool calls
  const fullText = textParts[textParts.length - 1]!

  // Truncate if too long for GitHub comment (GitHub limit is 65536, but keep it readable)
  const MAX_LENGTH = 20000
  if (fullText.length > MAX_LENGTH) {
    return fullText.slice(0, MAX_LENGTH) + "...\n\n_(truncated)_"
  }

  return fullText
}
