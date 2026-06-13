// Extract the first top-level JSON object from arbitrary text (handles code fences and balanced braces)
export function extractJSONObject(text: string): string | null {
  // 1) Prefer fenced JSON blocks
  const fenceMatch = text.match(/```json\s*([\s\S]*?)\s*```/i)
  if (fenceMatch && fenceMatch[1]) return fenceMatch[1].trim()
  const genericFenceMatch = text.match(/```\s*([\s\S]*?)\s*```/)
  if (genericFenceMatch && genericFenceMatch[1]) {
    const inner = genericFenceMatch[1].trim()
    if (inner.startsWith("{") && inner.endsWith("}")) return inner
  }

  // 2) Scan for first balanced top-level JSON object
  let inString = false
  let escape = false
  let depth = 0
  let start = -1
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (inString) {
      if (escape) {
        escape = false
      } else if (ch === "\\") {
        escape = true
      } else if (ch === '"') {
        inString = false
      }
      continue
    }
    if (ch === '"') {
      inString = true
      continue
    }
    if (ch === "{") {
      if (depth === 0) start = i
      depth++
      continue
    }
    if (ch === "}") {
      depth--
      if (depth === 0 && start !== -1) {
        return text.slice(start, i + 1)
      }
    }
  }
  return null
}

export function safeParseJSON(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    return undefined
  }
}
