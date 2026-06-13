import type { VisualConfig } from "../../types/visual"

export interface Theme {
  preset?: "notion" | "cursor" | "minimal"
  primaryColor?: string
  fontFamily?: string
  borderRadius?: string
  textSize?: "sm" | "md" | "lg"
  messageStyle?: "bubble-right" | "full-width"
  inputBarShadow?: boolean
  inputBarFill?: boolean
  attachButtonRight?: boolean
  modelSelectorLeft?: boolean
  placeholder?: string
  thinkingDisplay?: "collapsed" | "streaming" | "hidden"
  codeActionDisplay?: "diff-card" | "minimal" | "hidden"
  bashDisplay?: "terminal-card" | "minimal" | "hidden"
  searchDisplay?: "rich-group" | "minimal" | "hidden"
  showToolIcons?: boolean
}

export type ResolvedTheme = VisualConfig

export type ToolSize = "normal" | "compact"

export const TOOL_ROW_STYLES = {
  normal: {
    container: "gap-2 py-1",
    text: "text-[14px] leading-5",
    textColor: "text-foreground/40",
    shimmerClass: "inline-flex items-center text-[14px] leading-5 m-0",
    iconContainer: "w-4 h-4",
    /** pl that aligns expanded content under the label when icon is shown (icon w-4 + gap-2 = 24px) */
    expandedPl: "pl-6",
  },
  compact: {
    container: "gap-1.5 py-0.5",
    text: "text-xs",
    textColor: "text-foreground/40",
    shimmerClass: "inline-flex items-center text-xs leading-none h-4 m-0",
    iconContainer: "w-3.5 h-3.5",
    /** pl that aligns expanded content under the label when icon is shown (icon w-3.5 + gap-1.5 = 20px) */
    expandedPl: "pl-5",
  },
} as const

export { type VisualConfig }
