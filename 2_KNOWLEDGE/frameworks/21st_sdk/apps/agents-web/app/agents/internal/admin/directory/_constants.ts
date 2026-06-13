export const NORMALIZED_CATEGORIES = [
  "Code Assistant",
  "Web Scraper",
  "Customer Support",
  "Sales & Marketing",
  "Email Operations",
  "UI/UX Design",
  "Business Intelligence",
  "Research Agent",
  "Content Generator",
  "DevOps / Testing",
  "Education & Learning",
  "Finance & Insurance",
  "Healthcare",
  "Industry-Specific",
  "Unconfigured",
] as const

export const TOOL_CATEGORIES = [
  "web_browsing",
  "api_integration",
  "file_operations",
  "database",
  "email",
  "search",
  "code_execution",
  "form_filling",
  "media",
  "communication",
  "custom",
] as const

export const CATEGORY_CHART_COLORS: Record<string, string> = {
  "Code Assistant": "#3b82f6",
  "Web Scraper": "#f59e0b",
  "Customer Support": "#10b981",
  "Sales & Marketing": "#ef4444",
  "Email Operations": "#8b5cf6",
  "UI/UX Design": "#ec4899",
  "Business Intelligence": "#06b6d4",
  "Research Agent": "#6366f1",
  "Content Generator": "#f97316",
  "DevOps / Testing": "#14b8a6",
  "Education & Learning": "#a855f7",
  "Finance & Insurance": "#22c55e",
  "Healthcare": "#e11d48",
  "Industry-Specific": "#64748b",
  "Unconfigured": "#94a3b8",
}

export const TOOL_CATEGORY_COLORS: Record<string, string> = {
  web_browsing: "#3b82f6",
  api_integration: "#f59e0b",
  file_operations: "#10b981",
  database: "#ef4444",
  email: "#8b5cf6",
  search: "#06b6d4",
  code_execution: "#6366f1",
  form_filling: "#f97316",
  media: "#ec4899",
  communication: "#14b8a6",
  custom: "#94a3b8",
}

export const TOOL_CATEGORY_LABELS: Record<string, string> = {
  web_browsing: "Web Browsing",
  api_integration: "API Integration",
  file_operations: "File Operations",
  database: "Database",
  email: "Email",
  search: "Search",
  code_execution: "Code Execution",
  form_filling: "Form Filling",
  media: "Media",
  communication: "Communication",
  custom: "Custom",
}

/** Minimum threads to consider an agent "active" */
export const MIN_ACTIVE_THREADS = 10

export function fmtTokens(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

export function fmtCost(n: number): string {
  if (n < 0.01 && n > 0) return "<$0.01"
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`
  return `$${n.toFixed(2)}`
}
