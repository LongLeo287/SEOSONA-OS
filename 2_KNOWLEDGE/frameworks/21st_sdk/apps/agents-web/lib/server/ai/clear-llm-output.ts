export function clearLLMOutput(text: string): string {
  return text.replace(/```\w*\r?\n?|```/g, "")
}

export function extractCodeBlock(text: string): string {
  const codeBlockRegex = /```(?:\w+)?\r?\n([\s\S]*?)```/
  const match = text.match(codeBlockRegex)
  return match?.[1]?.trim() ?? ""
}
