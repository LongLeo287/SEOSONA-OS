import type { AgentPurpose } from "./atoms"

export interface AgentPreset {
  label: string
  description: string
  icon: string
  tools: string[]
  defaultModel: string
  runtime: "claude-code" | "codex"
  suggestedPrompt: string
}

export const TOOL_DISPLAY_LABELS: Record<string, string> = {
  Read: "Read Files",
  Glob: "File Search",
  Grep: "Content Search",
  Edit: "Edit Files",
  Write: "Write Files",
  Bash: "Terminal",
  WebFetch: "Web Fetch",
  WebSearch: "Web Search",
}

export const AGENT_PRESETS: Record<AgentPurpose, AgentPreset | null> = {
  "customer-support": {
    label: "Customer Support",
    description:
      "Help users with questions, troubleshoot issues, and provide relevant documentation. Includes web search and content reading tools.",
    icon: "headphones",
    tools: ["Read", "Glob", "Grep", "WebFetch", "WebSearch"],
    defaultModel: "claude-sonnet-4-6",
    runtime: "claude-code",
    suggestedPrompt:
      "You are a helpful customer support agent. Answer user questions clearly and concisely. Search the documentation and web for relevant information when needed. Be friendly and professional.",
  },
  sales: {
    label: "Sales Assistant",
    description:
      "Qualify leads, answer product questions, and surface relevant materials. Includes web search and file reading for product knowledge.",
    icon: "briefcase",
    tools: ["Read", "Glob", "Grep", "WebFetch", "WebSearch"],
    defaultModel: "claude-sonnet-4-6",
    runtime: "claude-code",
    suggestedPrompt:
      "You are a sales assistant. Help qualify leads by understanding their needs and matching them to product capabilities. Search documentation and the web to provide accurate product information. Be professional, consultative, and focused on understanding the customer's problem.",
  },
  research: {
    label: "Research & Analysis",
    description:
      "Analyze codebases, search the web, read documents, and provide structured insights. Full read-only toolset with web access.",
    icon: "search",
    tools: ["Read", "Glob", "Grep", "WebFetch", "WebSearch"],
    defaultModel: "claude-sonnet-4-6",
    runtime: "claude-code",
    suggestedPrompt:
      "You are a research assistant. Analyze questions thoroughly using available tools. Search files, web, and documentation to provide comprehensive, well-structured answers with sources.",
  },
  "docs-assistant": {
    label: "Docs Assistant",
    description:
      "Help users navigate documentation, find answers, and explain technical concepts. Reads and searches your docs.",
    icon: "book",
    tools: ["Read", "Glob", "Grep", "WebFetch"],
    defaultModel: "claude-sonnet-4-6",
    runtime: "claude-code",
    suggestedPrompt:
      "You are a documentation assistant. Help users find answers in the documentation. Search through files to locate relevant sections, explain technical concepts clearly, and link to related topics when helpful. Be concise and accurate.",
  },
  onboarding: {
    label: "Onboarding Guide",
    description:
      "Walk new users through setup and first steps. Guides them through your product with contextual help.",
    icon: "rocket",
    tools: ["Read", "Glob", "Grep", "WebFetch", "WebSearch"],
    defaultModel: "claude-sonnet-4-6",
    runtime: "claude-code",
    suggestedPrompt:
      "You are an onboarding guide. Walk new users through setup step by step. Be patient, encouraging, and proactive about explaining next steps. Search documentation to provide accurate instructions. Anticipate common questions and offer help before users get stuck.",
  },
  "internal-tools": {
    label: "Internal Tooling",
    description:
      "Automate workflows, query data, manage files, and run operations. Full access to all tools including execution.",
    icon: "wrench",
    tools: ["Read", "Glob", "Grep", "Edit", "Write", "Bash", "WebFetch", "WebSearch"],
    defaultModel: "claude-sonnet-4-6",
    runtime: "claude-code",
    suggestedPrompt:
      "You are an internal tooling agent with full system access. Help automate workflows, query and transform data, manage files, and run operations. Be precise with commands, confirm destructive actions before executing, and provide clear output summaries.",
  },
  custom: null,
}

export const ALL_AVAILABLE_TOOLS = [
  { name: "Read", category: "Read-only", description: "Read file contents" },
  { name: "Glob", category: "Read-only", description: "Search for files by pattern" },
  { name: "Grep", category: "Read-only", description: "Search file contents" },
  { name: "Edit", category: "Edit", description: "Modify existing files" },
  { name: "Write", category: "Edit", description: "Create new files" },
  { name: "Bash", category: "Execution", description: "Run shell commands" },
  { name: "WebFetch", category: "Web", description: "Fetch URL content" },
  { name: "WebSearch", category: "Web", description: "Search the web" },
]
