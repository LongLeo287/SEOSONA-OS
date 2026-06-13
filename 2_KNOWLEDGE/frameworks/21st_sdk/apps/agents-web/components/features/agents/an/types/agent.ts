import type { VisualConfig } from "./visual"
import type { AppType } from "../chat-preview/types"

export type { AppType }

/* ── Agent providers & models ── */

export type AgentProviderId = "claude-code" | "codex"

export type ClaudeModelId = "opus" | "sonnet" | "haiku"
export type CodexModelId =
  | "gpt-5.4"
  | "gpt-5.3-codex"
  | "gpt-5.2-codex"
  | "gpt-5.2"

export interface ModelOption {
  id: string
  name: string
  version?: string
}

export const CLAUDE_MODELS: ModelOption[] = [
  { id: "opus", name: "Opus", version: "4.6" },
  { id: "sonnet", name: "Sonnet", version: "4.6" },
  { id: "haiku", name: "Haiku", version: "4.5" },
]

export const CODEX_MODELS: ModelOption[] = [
  { id: "gpt-5.4", name: "GPT 5.4" },
  { id: "gpt-5.3-codex", name: "Codex 5.3" },
  { id: "gpt-5.2-codex", name: "Codex 5.2" },
  { id: "gpt-5.2", name: "GPT 5.2" },
]

/* ── Display & UI ── */

export type AttachmentType = "image" | "document" | "code" | "all"
export type AgentMode = "agent" | "plan"

/* ── Tool definitions ── */

export interface ToolParameter {
  name: string
  type: "string" | "number" | "boolean" | "object" | "array"
  description: string
}

export interface ToolDefinition {
  id: string
  name: string
  prompt: string
  parameters: ToolParameter[]
}

/* ── Plan definitions ── */

export interface PlanTier {
  id: string
  name: string
  messagesPerMonth: string
  tokensPerMonth: string
  budgetPerUser: string
}

/* ── Agent config ── */

export interface AgentConfig {
  name: string
  description: string
  agentProvider: AgentProviderId
  claudeModel: ClaudeModelId
  codexModel: CodexModelId
  systemPrompt: string
  appType: AppType
  tools: ToolDefinition[]
  modes: {
    available: AgentMode[]
    defaultMode: AgentMode
  }
  attachments: {
    enabled: boolean
    allowedTypes: AttachmentType[]
    customExtensions: string
  }
  allowedModels: string[]
  plans: {
    enabled: boolean
    tiers: PlanTier[]
  }
  visual: VisualConfig
  activePreset: string | null
}

/* ── Constants ── */

export const ATTACHMENT_TYPE_OPTIONS: {
  id: AttachmentType
  label: string
  extensions: string
}[] = [
  { id: "image", label: "Images", extensions: ".jpg, .png, .gif, .webp" },
  { id: "document", label: "Documents", extensions: ".pdf, .doc, .docx, .txt" },
  { id: "code", label: "Code", extensions: ".ts, .tsx, .js, .py, .json, .md" },
  { id: "all", label: "All files", extensions: "No restriction" },
]

export const MODE_OPTIONS: {
  id: AgentMode
  label: string
  description: string
}[] = [
  { id: "agent", label: "Agent", description: "Full autonomous execution" },
  { id: "plan", label: "Plan", description: "Read-only planning mode" },
]

/* ── Built-in agent tools (Claude Code / Codex) ── */

export interface BuiltinTool {
  id: string
  name: string
  description: string
  category: "files" | "search" | "execution" | "web" | "mcp"
}

export const BUILTIN_TOOLS: BuiltinTool[] = [
  { id: "read", name: "Read", description: "Read file contents", category: "files" },
  { id: "edit", name: "Edit", description: "Edit existing files", category: "files" },
  { id: "write", name: "Write", description: "Create new files", category: "files" },
  { id: "glob", name: "Glob", description: "Find files by pattern", category: "search" },
  { id: "grep", name: "Grep", description: "Search file contents", category: "search" },
  { id: "bash", name: "Bash", description: "Execute shell commands", category: "execution" },
  { id: "notebook_edit", name: "NotebookEdit", description: "Edit Jupyter notebooks", category: "files" },
  { id: "web_search", name: "WebSearch", description: "Search the web", category: "web" },
  { id: "web_fetch", name: "WebFetch", description: "Fetch URL content", category: "web" },
  { id: "mcp", name: "MCP", description: "Model Context Protocol servers", category: "mcp" },
]

export const BUILTIN_TOOL_CATEGORIES: { id: BuiltinTool["category"]; label: string }[] = [
  { id: "files", label: "Files" },
  { id: "search", label: "Search" },
  { id: "execution", label: "Execution" },
  { id: "web", label: "Web" },
  { id: "mcp", label: "MCP" },
]
