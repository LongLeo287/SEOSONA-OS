export interface CssVarMeta {
  name: string
  category: "typography" | "geometry" | "layout" | "sizes" | "colors"
  type: "color" | "size" | "font" | "string" | "number"
  defaultValue: string
  label: string
  scope: "shared" | "mode"
}

export const CSS_VAR_REGISTRY: CssVarMeta[] = [
  // Typography
  { name: "--an-font-family", category: "typography", type: "font", defaultValue: "system-ui, sans-serif", label: "Font Family", scope: "shared" },
  { name: "--an-text-size", category: "typography", type: "size", defaultValue: "14px", label: "Text Size", scope: "shared" },
  { name: "--an-text-size-sm", category: "typography", type: "size", defaultValue: "13px", label: "Text Size (sm)", scope: "shared" },
  { name: "--an-text-size-xs", category: "typography", type: "size", defaultValue: "11px", label: "Text Size (xs)", scope: "shared" },
  { name: "--an-line-height", category: "typography", type: "number", defaultValue: "1.6", label: "Line Height", scope: "shared" },
  { name: "--an-font-weight", category: "typography", type: "number", defaultValue: "400", label: "Font Weight", scope: "shared" },
  { name: "--an-font-weight-medium", category: "typography", type: "number", defaultValue: "500", label: "Font Weight Medium", scope: "shared" },
  { name: "--an-font-weight-semibold", category: "typography", type: "number", defaultValue: "600", label: "Font Weight Semibold", scope: "shared" },
  { name: "--an-code-font-family", category: "typography", type: "font", defaultValue: "ui-monospace, monospace", label: "Code Font Family", scope: "shared" },
  { name: "--an-code-font-size", category: "typography", type: "size", defaultValue: "13px", label: "Code Font Size", scope: "shared" },

  // Geometry
  { name: "--an-border-radius", category: "geometry", type: "size", defaultValue: "16px", label: "Border Radius", scope: "shared" },
  { name: "--an-message-border-radius", category: "geometry", type: "size", defaultValue: "16px", label: "Message Border Radius", scope: "shared" },
  { name: "--an-input-border-radius", category: "geometry", type: "size", defaultValue: "16px", label: "Input Border Radius", scope: "shared" },
  { name: "--an-tool-border-radius", category: "geometry", type: "size", defaultValue: "12px", label: "Tool Border Radius", scope: "shared" },
  { name: "--an-code-border-radius", category: "geometry", type: "size", defaultValue: "8px", label: "Code Border Radius", scope: "shared" },

  // Layout
  { name: "--an-user-message-padding", category: "layout", type: "string", defaultValue: "10px 14px", label: "User Message Padding", scope: "shared" },
  { name: "--an-input-padding", category: "layout", type: "string", defaultValue: "12px 16px", label: "Input Padding", scope: "shared" },

  // Sizes
  { name: "--an-send-button-size", category: "sizes", type: "size", defaultValue: "32px", label: "Send Button Size", scope: "shared" },
  { name: "--an-stop-button-size", category: "sizes", type: "size", defaultValue: "32px", label: "Stop Button Size", scope: "shared" },
  { name: "--an-send-button-border-radius", category: "sizes", type: "size", defaultValue: "9999px", label: "Send Button Radius", scope: "shared" },

  // Colors (mode-specific)
  { name: "--an-background", category: "colors", type: "color", defaultValue: "#ffffff", label: "Background", scope: "mode" },
  { name: "--an-background-secondary", category: "colors", type: "color", defaultValue: "#f5f5f5", label: "Background Secondary", scope: "mode" },
  { name: "--an-background-tertiary", category: "colors", type: "color", defaultValue: "#fafafa", label: "Background Tertiary", scope: "mode" },
  { name: "--an-foreground", category: "colors", type: "color", defaultValue: "#1a1a1a", label: "Foreground", scope: "mode" },
  { name: "--an-foreground-muted", category: "colors", type: "color", defaultValue: "#737373", label: "Foreground Muted", scope: "mode" },
  { name: "--an-foreground-subtle", category: "colors", type: "color", defaultValue: "#a3a3a3", label: "Foreground Subtle", scope: "mode" },
  { name: "--an-border-color", category: "colors", type: "color", defaultValue: "#e5e5e5", label: "Border Color", scope: "mode" },
  { name: "--an-border-color-light", category: "colors", type: "color", defaultValue: "#f0f0f0", label: "Border Color Light", scope: "mode" },
  { name: "--an-primary-color", category: "colors", type: "color", defaultValue: "#3b82f6", label: "Primary Color", scope: "mode" },
  { name: "--an-user-message-bg", category: "colors", type: "color", defaultValue: "#f5f5f5", label: "User Message Bg", scope: "mode" },
  { name: "--an-user-message-text", category: "colors", type: "color", defaultValue: "#1a1a1a", label: "User Message Text", scope: "mode" },
  { name: "--an-input-background", category: "colors", type: "color", defaultValue: "#ffffff", label: "Input Background", scope: "mode" },
  { name: "--an-input-border-color", category: "colors", type: "color", defaultValue: "#e5e5e5", label: "Input Border", scope: "mode" },
  { name: "--an-input-color", category: "colors", type: "color", defaultValue: "#1a1a1a", label: "Input Color", scope: "mode" },
  { name: "--an-input-placeholder-color", category: "colors", type: "color", defaultValue: "#a3a3a3", label: "Input Placeholder", scope: "mode" },
  { name: "--an-send-button-bg", category: "colors", type: "color", defaultValue: "#3b82f6", label: "Send Button Bg", scope: "mode" },
  { name: "--an-send-button-color", category: "colors", type: "color", defaultValue: "#ffffff", label: "Send Button Color", scope: "mode" },
  { name: "--an-stop-button-bg", category: "colors", type: "color", defaultValue: "#1a1a1a", label: "Stop Button Bg", scope: "mode" },
  { name: "--an-stop-button-color", category: "colors", type: "color", defaultValue: "#ffffff", label: "Stop Button Color", scope: "mode" },
  { name: "--an-tool-background", category: "colors", type: "color", defaultValue: "#fafafa", label: "Tool Background", scope: "mode" },
  { name: "--an-tool-border-color", category: "colors", type: "color", defaultValue: "#e5e5e5", label: "Tool Border", scope: "mode" },
  { name: "--an-tool-color", category: "colors", type: "color", defaultValue: "#1a1a1a", label: "Tool Color", scope: "mode" },
  { name: "--an-tool-color-muted", category: "colors", type: "color", defaultValue: "#737373", label: "Tool Color Muted", scope: "mode" },
  { name: "--an-code-background", category: "colors", type: "color", defaultValue: "#1e1e1e", label: "Code Background", scope: "mode" },
  { name: "--an-code-color", category: "colors", type: "color", defaultValue: "#d4d4d4", label: "Code Color", scope: "mode" },
  { name: "--an-diff-added-text", category: "colors", type: "color", defaultValue: "#15803d", label: "Diff Added Text", scope: "mode" },
  { name: "--an-diff-removed-text", category: "colors", type: "color", defaultValue: "#dc2626", label: "Diff Removed Text", scope: "mode" },
]

export function getVarsByCategory() {
  const grouped: Record<string, CssVarMeta[]> = {}
  for (const v of CSS_VAR_REGISTRY) {
    if (!grouped[v.category]) grouped[v.category] = []
    grouped[v.category].push(v)
  }
  return grouped
}
