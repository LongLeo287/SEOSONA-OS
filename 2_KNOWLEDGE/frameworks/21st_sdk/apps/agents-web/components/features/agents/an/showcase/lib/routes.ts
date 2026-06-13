export interface RouteEntry {
  path: string
  label: string
  section: "Components" | "Tools" | "Theme" | null
}

const BASE = "/agents/showcase"

export const ROUTES: RouteEntry[] = [
  { path: BASE, label: "Overview", section: null },

  // Components
  { path: `${BASE}/components/an-agent-chat`, label: "AgentChat", section: "Components" },
  { path: `${BASE}/components/message-list`, label: "MessageList", section: "Components" },
  { path: `${BASE}/components/input-bar`, label: "InputBar", section: "Components" },
  { path: `${BASE}/components/user-message`, label: "UserMessage", section: "Components" },
  { path: `${BASE}/components/assistant-message`, label: "AssistantMessage", section: "Components" },
  { path: `${BASE}/components/streaming-markdown`, label: "StreamingMarkdown", section: "Components" },
  { path: `${BASE}/components/message-actions`, label: "MessageActions", section: "Components" },

  // Tools
  { path: `${BASE}/tools/bash-tool`, label: "BashTool", section: "Tools" },
  { path: `${BASE}/tools/edit-tool`, label: "EditTool", section: "Tools" },
  { path: `${BASE}/tools/search-tool`, label: "SearchTool", section: "Tools" },
  { path: `${BASE}/tools/todo-tool`, label: "TodoTool", section: "Tools" },
  { path: `${BASE}/tools/plan-tool`, label: "PlanTool", section: "Tools" },
  { path: `${BASE}/tools/task-tool`, label: "TaskTool", section: "Tools" },
  { path: `${BASE}/tools/mcp-tool`, label: "McpTool", section: "Tools" },
  { path: `${BASE}/tools/thinking-tool`, label: "ThinkingTool", section: "Tools" },
  { path: `${BASE}/tools/generic-tool`, label: "GenericTool", section: "Tools" },

  // Theme
  { path: `${BASE}/theme`, label: "Theme Editor", section: "Theme" },
]

export function getRoutesBySection(): Record<string, RouteEntry[]> {
  const sections: Record<string, RouteEntry[]> = {}
  for (const route of ROUTES) {
    const key = route.section ?? "Overview"
    if (!sections[key]) sections[key] = []
    sections[key].push(route)
  }
  return sections
}
