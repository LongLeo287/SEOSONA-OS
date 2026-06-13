export type ToolCallStatus = "pending" | "running" | "completed" | "failed"

export interface ToolCall {
  id: string
  name: string
  description?: string
  status: ToolCallStatus
  input?: Record<string, unknown>
  result?: unknown
  error?: string
  variant?: "thinking" | "search" | "code-edit" | "bash" | "action"
  thinkingContent?: string
  filePath?: string
  diffStats?: string
  diffLines?: { type: "add" | "remove" | "context"; content: string }[]
  bashCommand?: string
  bashOutput?: string
  searchQuery?: string
  searchSource?: string
}

export interface Attachment {
  id: string
  type: "image" | "document" | "code"
  name: string
  url: string
  size?: number
  mimeType?: string
}

export interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  createdAt: number
  toolCalls?: ToolCall[]
  attachments?: Attachment[]
  isStreaming?: boolean
}

export interface ChatError {
  code: "network" | "rate-limit" | "auth" | "server" | "tool-failure"
  message: string
  retryable: boolean
}
