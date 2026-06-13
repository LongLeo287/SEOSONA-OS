export type ToolSize = "normal" | "compact"

export const TOOL_ROW_STYLES = {
  normal: {
    container: "gap-2 py-1",
    text: "text-[14px] leading-5",
    textColor: "text-muted-foreground",
    shimmerClass: "inline-flex items-center text-[14px] leading-5 m-0",
    iconContainer: "w-4 h-4",
    /** pl that aligns expanded content under the label when icon is shown (icon w-4 + gap-2 = 24px) */
    expandedPl: "pl-6",
  },
  compact: {
    container: "gap-1.5 py-0.5",
    text: "text-xs",
    textColor: "text-muted-foreground",
    shimmerClass: "inline-flex items-center text-xs leading-none h-4 m-0",
    iconContainer: "w-3.5 h-3.5",
    /** pl that aligns expanded content under the label when icon is shown (icon w-3.5 + gap-1.5 = 20px) */
    expandedPl: "pl-5",
  },
} as const
