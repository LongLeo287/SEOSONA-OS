import { useReducer, useMemo } from "react"
import type {
  AgentConfig,
  PlaygroundAction,
  FrameworkId,
  VisualConfig,
} from "./playground-types"
import { CLAUDE_MODELS, CODEX_MODELS, VISUAL_PRESETS, TOOL_CALL_STYLE_DEFAULTS, resolveColor } from "./playground-types"

/* ── Helpers ── */

function toCamelCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, ch) => ch.toUpperCase())
    .replace(/^[A-Z]/, (ch) => ch.toLowerCase())
}

function getModelString(config: AgentConfig): string {
  if (config.agentProvider === "claude-code") {
    const m = CLAUDE_MODELS.find((m) => m.id === config.claudeModel)
    return `claude-${config.claudeModel}-${m?.version ?? "4.6"}`
  }
  return config.codexModel
}

/* ── Default config ── */

export const DEFAULT_CONFIG: AgentConfig = {
  name: "my-agent",
  description: "A helpful AI assistant",
  agentProvider: "claude-code",
  claudeModel: "sonnet",
  codexModel: "gpt-5.4",
  systemPrompt: "",
  appType: "support",
  tools: [],
  modes: {
    available: ["agent", "plan"],
    defaultMode: "agent",
  },
  attachments: { enabled: false, allowedTypes: ["all"], customExtensions: "" },
  allowedModels: ["sonnet"],
  plans: { enabled: false, tiers: [] },
  visual: VISUAL_PRESETS.notion!.config,
  activePreset: "notion",
}

/* ── Reducer ── */

function playgroundReducer(
  state: AgentConfig,
  action: PlaygroundAction,
): AgentConfig {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload }
    case "SET_DESCRIPTION":
      return { ...state, description: action.payload }
    case "SET_AGENT_PROVIDER": {
      const newDefault = action.payload === "claude-code" ? state.claudeModel : state.codexModel
      return { ...state, agentProvider: action.payload, allowedModels: [newDefault] }
    }
    case "SET_CLAUDE_MODEL":
      return { ...state, claudeModel: action.payload }
    case "SET_CODEX_MODEL":
      return { ...state, codexModel: action.payload }
    case "SET_SYSTEM_PROMPT":
      return { ...state, systemPrompt: action.payload }
    case "SET_APP_TYPE":
      return { ...state, appType: action.payload }
    case "ADD_TOOL":
      return { ...state, tools: [...state.tools, action.payload] }
    case "UPDATE_TOOL":
      return {
        ...state,
        tools: state.tools.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload.tool } : t,
        ),
      }
    case "REMOVE_TOOL":
      return {
        ...state,
        tools: state.tools.filter((t) => t.id !== action.payload),
      }
    case "SET_MODES":
      return { ...state, modes: { ...state.modes, ...action.payload } }
    case "SET_ATTACHMENTS":
      return {
        ...state,
        attachments: { ...state.attachments, ...action.payload },
      }
    case "SET_ALLOWED_MODELS":
      return { ...state, allowedModels: action.payload }
    case "SET_PLANS_ENABLED":
      return {
        ...state,
        plans: { ...state.plans, enabled: action.payload },
      }
    case "ADD_PLAN_TIER":
      return {
        ...state,
        plans: {
          ...state.plans,
          tiers: [...state.plans.tiers, action.payload],
        },
      }
    case "UPDATE_PLAN_TIER":
      return {
        ...state,
        plans: {
          ...state.plans,
          tiers: state.plans.tiers.map((t) =>
            t.id === action.payload.id
              ? { ...t, ...action.payload.tier }
              : t,
          ),
        },
      }
    case "REMOVE_PLAN_TIER":
      return {
        ...state,
        plans: {
          ...state.plans,
          tiers: state.plans.tiers.filter((t) => t.id !== action.payload),
        },
      }
    case "SET_VISUAL": {
      const newVisual = { ...state.visual, ...action.payload }

      // Switching tool call style → apply its display-mode defaults (not showToolIcons)
      if (action.payload.toolCallStyle) {
        const defaults = TOOL_CALL_STYLE_DEFAULTS[action.payload.toolCallStyle]
        Object.assign(newVisual, defaults)
      }

      return { ...state, visual: newVisual, activePreset: null }
    }
    case "LOAD_VISUAL_PRESET": {
      const preset = VISUAL_PRESETS[action.payload]
      if (!preset) return state
      return {
        ...state,
        visual: { ...preset.config },
        activePreset: action.payload,
      }
    }
    case "RESET":
      return DEFAULT_CONFIG
    case "LOAD_PRESET":
      return action.payload
    default:
      return state
  }
}

/* ── Code generation ── */

/* ── Color helpers ── */

function hexToRgb(hex: string): [number, number, number] {
  const c = hex.replace("#", "")
  if (c.length !== 6) return [0, 0, 0]
  return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)]
}

function rgbToHex(r: number, g: number, b: number): string {
  const cl = (v: number) => Math.round(Math.max(0, Math.min(255, v)))
  return "#" + [cl(r), cl(g), cl(b)].map((v) => v.toString(16).padStart(2, "0")).join("")
}

function darken(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex)
  const f = 1 - amount
  return rgbToHex(r * f, g * f, b * f)
}

function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255)
  const lin = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

function contrastText(hex: string): string {
  if (!hex || !/^#[0-9a-fA-F]{6}$/.test(hex)) return "#1a1a1a"
  return luminance(hex) > 0.179 ? "#1a1a1a" : "#ffffff"
}

/* ── Theme JSON generation ── */

const TEXT_SIZE_PX: Record<string, string> = { sm: "13px", md: "14px", lg: "15px" }

/** True when the colour is a neutral gray (low saturation). */
function isNeutralColor(hex: string): boolean {
  const [r, g, b] = hexToRgb(hex)
  return Math.max(r, g, b) - Math.min(r, g, b) < 30
}

/** Shared variables — identical in light & dark (typography, geometry, layout). */
function generateSharedTheme(visual: VisualConfig): Record<string, string> {
  const v = visual
  const textSize = TEXT_SIZE_PX[v.textSizeScale] ?? "14px"

  // Geometry
  const radius = v.messageBorderRadius || "16px"
  const radiusPx = parseInt(radius) || 16
  const innerRadius = Math.max(0, radiusPx - 8)

  const inputRadius = v.inputBarBorderRadius || radius
  const inputRadiusPx = parseInt(inputRadius) || radiusPx
  const inputInnerRadius = Math.max(0, inputRadiusPx - 8)

  const sendButtonRadius = v.sendButtonStyle === "circle-icon" ? "9999px" : `${inputInnerRadius}px`

  const densityGap: Record<string, string> = { relaxed: "16px", compact: "8px", dense: "2px" }
  const densityPadding: Record<string, string> = { relaxed: "12px 16px", compact: "10px 14px", dense: "8px 12px" }

  return {
    // Typography
    "--an-font-family": v.fontFamily,
    "--an-font-weight": "400",
    "--an-font-weight-medium": "500",
    "--an-font-weight-semibold": "600",
    "--an-text-size": textSize,
    "--an-text-size-sm": "13px",
    "--an-text-size-xs": "11px",
    "--an-line-height": "1.6",

    // Geometry
    "--an-border-radius": radius,
    "--an-message-border-radius": radius,
    "--an-input-border-radius": inputRadius,
    "--an-input-inner-border-radius": `${inputInnerRadius}px`,
    "--an-send-button-border-radius": sendButtonRadius,
    "--an-stop-button-border-radius": v.stopButtonStyle !== "pill-text" ? "9999px" : sendButtonRadius,
    "--an-mode-selector-border-radius": `${inputInnerRadius}px`,
    "--an-tool-border-radius": `${Math.min(innerRadius, 12)}px`,
    "--an-code-border-radius": `${Math.min(innerRadius, 8)}px`,
    "--an-attachment-border-radius": `${inputInnerRadius}px`,

    // Layout
    "--an-message-gap": densityGap[v.messageDensity] ?? "8px",
    "--an-user-message-padding": densityPadding[v.messageDensity] ?? "10px 14px",
    "--an-input-padding": "12px 16px",
    "--an-tool-padding": "8px 12px",
    "--an-code-padding": "16px",

    // Sizes
    "--an-send-button-size": "32px",
    "--an-stop-button-size": "32px",
    "--an-scrollbar-width": "6px",

    // Font sizes
    "--an-input-font-size": textSize,
    "--an-date-divider-font-size": "11px",
    "--an-model-selector-font-size": "12px",
    "--an-tool-font-size": "13px",
    "--an-code-font-size": "13px",
    "--an-code-font-family": "ui-monospace, monospace",
    "--an-attachment-font-size": "12px",

    // Config
    "--an-message-style": v.messageBubbleStyle,
    "--an-message-density": v.messageDensity,
    "--an-input-style": v.inputBarFill ? "flat" : v.inputBarShadow ? "rounded" : "bordered",
    "--an-send-button-style": v.sendButtonStyle,
    "--an-stop-button-style": v.stopButtonStyle,
    "--an-sticky-user-messages": v.stickyUserMessages ? "true" : "false",
    "--an-show-date-divider": v.showDateDivider ? "true" : "false",
    "--an-show-copy-button": v.showCopyButton ? "true" : "false",
    "--an-text-contrast": v.textContrast,
    "--an-input-placeholder": v.inputBarPlaceholder,
    "--an-attachment-button-style": v.attachmentButtonStyle,
    "--an-attachment-preview-style": v.attachmentPreviewStyle,
    "--an-tool-call-style": v.toolCallStyle,
    "--an-thinking-display": v.thinkingDisplay,
    "--an-code-action-display": v.codeActionDisplay,
    "--an-bash-display": v.bashDisplay,
    "--an-search-display": v.searchDisplay,
    "--an-show-tool-icons": v.showToolIcons ? "true" : "false",
    "--an-message-shadow": v.messageShadow ? "true" : "false",
    "--an-input-fill": v.inputBarFill ? "true" : "false",
    "--an-input-shadow-toggle": v.inputBarShadow ? "true" : "false",
    "--an-show-window-chrome": v.showWindowChrome ? "true" : "false",

    // Max width (playground preview width)
    "--an-max-width": "420px",

    // Input bar feature positions (read by SDK extractThemeConfig)
    "--an-attachment-button-position": v.attachButtonRight ? "right" : "left",
    "--an-model-selector-position": v.modelSelectorPosition === "hidden" ? "hidden" : "input-bar",
    "--an-model-selector-side": v.modelSelectorLeft ? "left" : "right",
    "--an-mode-selector-position": v.modesSelectorPosition,
  }
}

/** Mode-specific variables — colours, shadows, anything that differs between light & dark. */
function generateColorTheme(visual: VisualConfig, mode: "light" | "dark"): Record<string, string> {
  const v = visual
  const isDark = mode === "dark"

  // Accent colours (per-mode)
  const primary = resolveColor(v, "primaryColor", mode) || "#3b82f6"
  const primaryHover = darken(primary, 0.12)
  const primaryActive = darken(primary, 0.2)

  const sendBg = resolveColor(v, "sendButtonColor", mode) || primary
  const sendText = contrastText(sendBg)
  const sendHover = darken(sendBg, 0.12)
  const sendActive = darken(sendBg, 0.2)

  // Structural colours (match @21st-sdk/react defaults)
  const bg           = isDark ? "#0a0a0a" : "#ffffff"
  const bgSecondary  = isDark ? "#242424" : "#f0f0f0"
  const bgTertiary   = isDark ? "#141414" : "#f8f8f8"
  const fg           = isDark ? "#fafafa" : "#1a1a1a"
  const fgMuted      = isDark ? "#8c8c8c" : "#737373"
  const fgSubtle     = isDark ? "#71717a" : "#a3a3a3"
  const border       = isDark ? "#2a2a2a" : "#e4e4e7"
  const borderLight  = isDark ? "#1f1f1f" : "#ededf0"

  // User message bg — invert neutral grays, keep brand colours
  const rawUserBg = resolveColor(v, "userMessageBg", mode) || "#f5f5f5"
  const userBg = isDark && isNeutralColor(rawUserBg) && luminance(rawUserBg) > 0.3
    ? bgSecondary
    : rawUserBg
  const userText = contrastText(userBg)

  // Stop button (inverts in dark)
  const stopBg    = isDark ? "#fafafa" : "#1a1a1a"
  const stopColor = isDark ? "#0a0a0a" : "#ffffff"
  const stopHover = isDark ? "#d4d4d8" : "#333333"

  // Input style-dependent colours
  const messageShadow = v.messageShadow
    ? (isDark ? "0 1px 2px 0 rgba(0,0,0,0.4)" : "0 1px 2px 0 rgba(0,0,0,0.05)")
    : "none"
  const inputShadow = v.inputBarShadow
    ? (isDark ? "0 1px 3px 0 rgba(0,0,0,0.4)" : "0 1px 3px 0 rgba(0,0,0,0.04)")
    : "none"

  return {
    // Structural
    "--an-background": bg,
    "--an-background-secondary": bgSecondary,
    "--an-background-tertiary": bgTertiary,
    "--an-foreground": fg,
    "--an-foreground-muted": fgMuted,
    "--an-foreground-subtle": fgSubtle,
    "--an-border-color": border,
    "--an-border-color-light": borderLight,

    // Messages
    "--an-message-shadow": messageShadow,
    "--an-user-message-bg": userBg,
    "--an-user-message-text": userText,

    // Date Divider
    "--an-date-divider-color": fgSubtle,
    "--an-date-divider-border-color": borderLight,

    // Input Bar
    "--an-input-background": v.inputBarFill ? bg : "transparent",
    "--an-input-border-color": v.inputBarShadow ? border : borderLight,
    "--an-input-color": fg,
    "--an-input-placeholder-color": fgSubtle,
    "--an-input-shadow": inputShadow,

    // Stop Button
    "--an-stop-button-color": stopColor,
    "--an-stop-button-bg": stopBg,

    // Mode Selector
    "--an-mode-selector-background": bgSecondary,
    "--an-mode-selector-color": fgMuted,
    "--an-mode-selector-active-color": fg,
    "--an-mode-selector-active-background": isDark ? bgTertiary : bg,

    // Model Selector
    "--an-model-selector-color": fgMuted,
    "--an-model-selector-hover-color": fg,

    // Tool Calls
    "--an-tool-background": bgTertiary,
    "--an-tool-border-color": border,
    "--an-tool-color": fg,
    "--an-tool-color-muted": fgMuted,
    "--an-tool-icon-color": fgMuted,

    // Code Block
    "--an-code-background": isDark ? "#0a0a0a" : "#1e1e1e",
    "--an-code-color": "#d4d4d4",

    // Attachments
    "--an-attachment-background": bgSecondary,
    "--an-attachment-border-color": border,
    "--an-attachment-hover-background": isDark ? "#27272a" : "#ebebeb",
    "--an-attachment-color": fg,
    "--an-attachment-color-muted": fgMuted,

    // Scrollbar
    "--an-scrollbar-color": isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)",
    "--an-scrollbar-hover-color": isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",

    // Accent colours (per-mode)
    "--an-primary-color": primary,
    "--an-primary-color-hover": primaryHover,
    "--an-primary-color-active": primaryActive,
    "--an-focus-color": primary,
    "--an-send-button-color": sendText,
    "--an-send-button-bg": sendBg,
    "--an-send-button-hover-color": sendText,
    "--an-send-button-hover-bg": sendHover,
    "--an-send-button-active-bg": sendActive,
    "--an-send-button-shadow": "none",
    "--an-input-focus-border-color": primary,
    "--an-input-focus-shadow": `0 0 0 2px ${primary}1a`,

    // Diff colours
    "--an-diff-added-bg": isDark ? "rgba(34, 197, 94, 0.15)" : "rgba(34, 197, 94, 0.1)",
    "--an-diff-added-border": isDark ? "rgba(34, 197, 94, 0.4)" : "rgba(34, 197, 94, 0.5)",
    "--an-diff-added-text": isDark ? "#4ade80" : "#15803d",
    "--an-diff-removed-bg": isDark ? "rgba(239, 68, 68, 0.15)" : "rgba(239, 68, 68, 0.1)",
    "--an-diff-removed-border": isDark ? "rgba(239, 68, 68, 0.4)" : "rgba(239, 68, 68, 0.5)",
    "--an-diff-removed-text": isDark ? "#f87171" : "#dc2626",
  }
}

function generateThemeCode(config: AgentConfig): string {
  return generateThemeJson(config.visual)
}

/** Generate theme.json string from a VisualConfig. */
export function generateThemeJson(visual: VisualConfig): string {
  return JSON.stringify({
    theme: generateSharedTheme(visual),
    light: generateColorTheme(visual, "light"),
    dark: generateColorTheme(visual, "dark"),
  }, null, 2)
}

function generateCode(config: AgentConfig, framework: FrameworkId): string {
  if (framework === "sdk") {
    return generateSdkCode(config)
  }

  const lines: string[] = []

  // "use client" for Next.js
  if (framework === "nextjs") {
    lines.push(`"use client"`)
    lines.push(``)
  }

  // Imports — always import theme
  lines.push(`import theme from "./theme.json"`)
  const imports = ["AgentChat"]
  if (config.tools.length > 0) imports.push("defineTool")
  lines.push(`import { ${imports.join(", ")} } from "@21st-sdk/react"`)
  lines.push(``)

  // Tool definitions
  for (const tool of config.tools) {
    const camelName = toCamelCase(tool.name)
    lines.push(`const ${camelName} = defineTool({`)
    lines.push(`  name: "${tool.name}",`)
    if (tool.prompt) {
      const escaped = tool.prompt.replace(/"/g, '\\"')
      lines.push(`  description: "${escaped}",`)
    }
    if (tool.parameters.length > 0) {
      lines.push(`  parameters: {`)
      for (const p of tool.parameters) {
        if (p.description) {
          const desc = p.description.replace(/"/g, '\\"')
          lines.push(`    ${p.name}: z.${p.type}().describe("${desc}"),`)
        } else {
          lines.push(`    ${p.name}: z.${p.type}(),`)
        }
      }
      lines.push(`  },`)
    }
    const paramNames = tool.parameters.map((p) => p.name)
    const destructured = paramNames.length > 0 ? `{ ${paramNames.join(", ")} }` : "params"
    lines.push(`  execute: async (${destructured}) => {`)
    lines.push(`    // TODO: Implement your tool logic`)
    lines.push(`  },`)
    lines.push(`})`)
    lines.push(``)
  }

  // Component
  const modelStr = getModelString(config)
  lines.push(`export default function MyAgent() {`)
  lines.push(`  return (`)
  lines.push(`    <AgentChat`)
  lines.push(`      agent="${config.name}"`)
  lines.push(`      userId={user.id}`)
  lines.push(`      model="${modelStr}"`)

  // Theme prop — always use imported theme
  lines.push(`      theme={theme}`)

  // Icon family (not part of theme JSON)
  if (config.visual.iconFamily !== "lucide") {
    lines.push(`      iconFamily="${config.visual.iconFamily}"`)
  }

  if (config.tools.length > 0) {
    const toolNames = config.tools.map((t) => toCamelCase(t.name)).join(", ")
    lines.push(`      tools={[${toolNames}]}`)
  }

  if (config.systemPrompt) {
    const escaped = config.systemPrompt.replace(/`/g, "\\`")
    lines.push(`      systemPrompt={\`${escaped}\`}`)
  }

  // Attachments
  if (config.attachments.enabled) {
    const acceptMap: Record<string, string> = {
      image: "image/*",
      document: "application/pdf,text/plain,.doc,.docx",
      code: "text/*,application/json",
    }
    const typeParts = config.attachments.allowedTypes
      .filter((t) => t !== "all")
      .map((t) => acceptMap[t])
      .filter(Boolean)
    const customParts = config.attachments.customExtensions
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => (s.startsWith(".") ? s : `.${s}`))
    const isAll =
      config.attachments.allowedTypes.includes("all") &&
      customParts.length === 0
    if (isAll || (typeParts.length === 0 && customParts.length === 0)) {
      lines.push(`      attachments={{ enabled: true }}`)
    } else {
      const accept = [...typeParts, ...customParts].join(",")
      lines.push(
        `      attachments={{ enabled: true, accept: "${accept}" }}`,
      )
    }
  }

  // Allowed models
  if (config.allowedModels.length > 1) {
    const activeModelsRef = config.agentProvider === "claude-code" ? CLAUDE_MODELS : CODEX_MODELS
    const resolvedModels = config.allowedModels.filter((id) =>
      activeModelsRef.some((m) => m.id === id)
    )
    if (resolvedModels.length > 1) {
      const modelsStr = resolvedModels.map((m) => `"${m}"`).join(", ")
      lines.push(`      allowedModels={[${modelsStr}]}`)
    }
  }

  // Modes
  if (
    config.modes.available.length > 1 ||
    config.modes.defaultMode !== "agent"
  ) {
    const modesStr = config.modes.available
      .map((m) => `"${m}"`)
      .join(", ")
    lines.push(`      modes={[${modesStr}]}`)
    if (config.modes.defaultMode !== "agent") {
      lines.push(`      defaultMode="${config.modes.defaultMode}"`)
    }
  }

  // Plans
  if (config.plans.enabled && config.plans.tiers.length > 0) {
    lines.push(`      plans={[`)
    for (const tier of config.plans.tiers) {
      const parts: string[] = [`name: "${tier.name}"`]
      if (tier.messagesPerMonth) {
        parts.push(`messagesPerMonth: ${tier.messagesPerMonth}`)
      }
      if (tier.tokensPerMonth) {
        parts.push(`tokensPerMonth: ${tier.tokensPerMonth}`)
      }
      if (tier.budgetPerUser && tier.budgetPerUser !== "unlimited") {
        parts.push(`budgetPerUser: ${tier.budgetPerUser}`)
      } else if (tier.budgetPerUser === "unlimited") {
        parts.push(`budgetPerUser: Infinity`)
      }
      lines.push(`        { ${parts.join(", ")} },`)
    }
    lines.push(`      ]}`)
  }

  lines.push(`    />`)
  lines.push(`  )`)
  lines.push(`}`)

  return lines.join("\n")
}

function generateSdkCode(config: AgentConfig): string {
  const lines: string[] = []
  const modelStr = getModelString(config)

  lines.push(`import { AgentChat } from "@21st-sdk/react"`)
  lines.push(``)
  lines.push(`const an = new An({`)
  lines.push(`  apiKey: process.env.API_KEY_21ST,`)
  lines.push(`})`)
  lines.push(``)
  lines.push(`const agent = an.agent({`)
  lines.push(`  name: "${config.name}",`)
  lines.push(`  model: "${modelStr}",`)

  if (config.description) {
    lines.push(`  description: "${config.description}",`)
  }

  if (config.systemPrompt) {
    const escaped = config.systemPrompt.replace(/"/g, '\\"')
    lines.push(`  systemPrompt: "${escaped}",`)
  }

  if (config.tools.length > 0) {
    lines.push(`  tools: [`)
    for (const tool of config.tools) {
      lines.push(`    {`)
      lines.push(`      name: "${tool.name}",`)
      if (tool.prompt) {
        const escaped = tool.prompt.replace(/"/g, '\\"')
        lines.push(`      description: "${escaped}",`)
      }
      if (tool.parameters.length > 0) {
        lines.push(`      parameters: {`)
        for (const p of tool.parameters) {
          const parts = [`type: "${p.type}"`]
          if (p.description) {
            parts.push(`description: "${p.description.replace(/"/g, '\\"')}"`)
          }
          lines.push(`        ${p.name}: { ${parts.join(", ")} },`)
        }
        lines.push(`      },`)
      }
      lines.push(`    },`)
    }
    lines.push(`  ],`)
  }

  // Modes
  if (
    config.modes.available.length > 1 ||
    config.modes.defaultMode !== "agent"
  ) {
    const modesStr = config.modes.available.map((m) => `"${m}"`).join(", ")
    lines.push(`  modes: [${modesStr}],`)
    lines.push(`  defaultMode: "${config.modes.defaultMode}",`)
  }

  // Allowed models
  if (config.allowedModels.length > 1) {
    const activeModelsRef = config.agentProvider === "claude-code" ? CLAUDE_MODELS : CODEX_MODELS
    const resolvedModels = config.allowedModels.filter((id) =>
      activeModelsRef.some((m) => m.id === id)
    )
    if (resolvedModels.length > 1) {
      const modelsStr = resolvedModels.map((m) => `"${m}"`).join(", ")
      lines.push(`  allowedModels: [${modelsStr}],`)
    }
  }

  // Plans
  if (config.plans.enabled && config.plans.tiers.length > 0) {
    lines.push(`  plans: [`)
    for (const tier of config.plans.tiers) {
      lines.push(`    {`)
      lines.push(`      name: "${tier.name}",`)
      if (tier.messagesPerMonth)
        lines.push(`      messagesPerMonth: ${tier.messagesPerMonth},`)
      if (tier.tokensPerMonth)
        lines.push(`      tokensPerMonth: ${tier.tokensPerMonth},`)
      if (tier.budgetPerUser === "unlimited") {
        lines.push(`      budgetPerUser: Infinity,`)
      } else if (tier.budgetPerUser) {
        lines.push(`      budgetPerUser: ${tier.budgetPerUser},`)
      }
      lines.push(`    },`)
    }
    lines.push(`  ],`)
  }

  lines.push(`})`)
  lines.push(``)
  lines.push(`// Start a session`)
  lines.push(`const session = await agent.createSession({`)
  lines.push(`  userId: "user_123",`)
  lines.push(`})`)
  lines.push(``)
  lines.push(`const response = await session.send("Hello!")`)
  lines.push(`console.log(response.text)`)

  return lines.join("\n")
}

/* ── Hook ── */

export function usePlaygroundState(framework: FrameworkId = "react") {
  const [config, dispatch] = useReducer(playgroundReducer, DEFAULT_CONFIG)

  const generatedCode = useMemo(
    () => generateCode(config, framework),
    [config, framework],
  )

  const themeCode = useMemo(
    () => generateThemeCode(config),
    [config],
  )

  return { config, dispatch, generatedCode, themeCode }
}
