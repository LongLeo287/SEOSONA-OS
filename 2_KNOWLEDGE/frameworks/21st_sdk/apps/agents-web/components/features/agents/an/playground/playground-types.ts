import type {
  AgentConfig,
  VisualConfig,
  AgentProviderId,
  ClaudeModelId,
  CodexModelId,
  AppType,
  ToolDefinition,
  PlanTier,
} from "../types"

/* ── Playground-specific types ── */

export type FrameworkId = "react" | "nextjs" | "sdk"

export const FRAMEWORK_OPTIONS: { id: FrameworkId; label: string }[] = [
  { id: "react", label: "React" },
  { id: "nextjs", label: "Next.js" },
  { id: "sdk", label: "SDK" },
]

/* ── Playground actions (reducer) ── */

export type PlaygroundAction =
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_DESCRIPTION"; payload: string }
  | { type: "SET_AGENT_PROVIDER"; payload: AgentProviderId }
  | { type: "SET_CLAUDE_MODEL"; payload: ClaudeModelId }
  | { type: "SET_CODEX_MODEL"; payload: CodexModelId }
  | { type: "SET_SYSTEM_PROMPT"; payload: string }
  | { type: "SET_APP_TYPE"; payload: AppType }
  | { type: "ADD_TOOL"; payload: ToolDefinition }
  | { type: "UPDATE_TOOL"; payload: { id: string; tool: Partial<ToolDefinition> } }
  | { type: "REMOVE_TOOL"; payload: string }
  | { type: "SET_MODES"; payload: Partial<AgentConfig["modes"]> }
  | { type: "SET_ATTACHMENTS"; payload: Partial<AgentConfig["attachments"]> }
  | { type: "SET_ALLOWED_MODELS"; payload: string[] }
  | { type: "SET_PLANS_ENABLED"; payload: boolean }
  | { type: "ADD_PLAN_TIER"; payload: PlanTier }
  | { type: "UPDATE_PLAN_TIER"; payload: { id: string; tier: Partial<PlanTier> } }
  | { type: "REMOVE_PLAN_TIER"; payload: string }
  | { type: "SET_VISUAL"; payload: Partial<VisualConfig> }
  | { type: "LOAD_VISUAL_PRESET"; payload: string }
  | { type: "RESET" }
  | { type: "LOAD_PRESET"; payload: AgentConfig }

/* ── Backward compatibility: re-export all shared types ── */

export * from "../types"
