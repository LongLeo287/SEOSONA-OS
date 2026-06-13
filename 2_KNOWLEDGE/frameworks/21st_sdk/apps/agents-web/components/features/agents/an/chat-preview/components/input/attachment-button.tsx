import type { VisualConfig } from "../../types/theme"
import { PaperclipIcon } from "../shared-icons"

export function AttachmentButton({ style, innerRadius }: { style: VisualConfig["attachmentButtonStyle"]; innerRadius?: number }) {
  if (style === "hidden") return null

  if (style === "plus-circle") {
    return (
      <div className="h-7 w-7 flex items-center justify-center hover:bg-foreground/[0.06] transition-colors cursor-pointer" style={{ borderRadius: `${innerRadius ?? 2}px` }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-foreground/30">
          <path d="M10 3.59a.66.66 0 0 1 .66.66v5.09h5.09a.66.66 0 0 1 0 1.32h-5.09v5.09a.66.66 0 0 1-1.32 0v-5.09H4.25a.66.66 0 0 1 0-1.32h5.09V4.25a.66.66 0 0 1 .66-.66" />
        </svg>
      </div>
    )
  }

  // "paperclip"
  return (
    <div
      className="h-7 w-7 flex items-center justify-center hover:bg-foreground/[0.06] transition-colors cursor-pointer"
      style={{ borderRadius: `${innerRadius ?? 2}px` }}
    >
      <PaperclipIcon />
    </div>
  )
}
