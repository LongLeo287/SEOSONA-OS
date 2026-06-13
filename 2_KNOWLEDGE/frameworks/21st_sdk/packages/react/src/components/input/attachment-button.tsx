import React, { memo } from "react"
import { PaperclipIcon } from "../../icons/shared-icons"
import { useThemeConfig } from "../../theme-config"

interface AttachmentButtonProps {
  style?: "plus-circle" | "paperclip" | "hidden"
  borderRadius?: number
  onClick?: () => void
}

export const AttachmentButton = memo(function AttachmentButton({ style, borderRadius, onClick }: AttachmentButtonProps) {
  const config = useThemeConfig()
  const effectiveStyle = style ?? config.attachmentButtonStyle
  const radius = borderRadius ?? 2

  if (effectiveStyle === "hidden") return null

  if (effectiveStyle === "plus-circle") {
    return (
      <button type="button" onClick={onClick}
        className="h-7 w-7 flex items-center justify-center hover:bg-foreground/[0.06] transition-colors cursor-pointer"
        style={{ borderRadius: `${radius}px` }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-foreground/30">
          <path d="M10 3.59a.66.66 0 0 1 .66.66v5.09h5.09a.66.66 0 0 1 0 1.32h-5.09v5.09a.66.66 0 0 1-1.32 0v-5.09H4.25a.66.66 0 0 1 0-1.32h5.09V4.25a.66.66 0 0 1 .66-.66" />
        </svg>
      </button>
    )
  }

  return (
    <button type="button" onClick={onClick}
      className="h-7 w-7 flex items-center justify-center hover:bg-foreground/[0.06] transition-colors cursor-pointer"
      style={{ borderRadius: `${radius}px` }}>
      <PaperclipIcon />
    </button>
  )
})
