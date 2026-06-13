import type { VisualConfig } from "../../types/theme"

export function SendButtonUnified({
  style,
  stopStyle,
  color,
  isTyping,
  isStreaming,
}: {
  style: VisualConfig["sendButtonStyle"]
  stopStyle: VisualConfig["stopButtonStyle"]
  color: string
  isTyping: boolean
  isStreaming: boolean
}) {
  if (isStreaming) {
    if (stopStyle === "pill-text") {
      return (
        <div className="h-7 px-3 rounded-full bg-foreground flex items-center justify-center cursor-pointer gap-1.5">
          <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor" className="text-background">
            <path d="M11.75 3h-7.5C3.56 3 3 3.56 3 4.25v7.5c0 .69.56 1.25 1.25 1.25h7.5c.69 0 1.25-.56 1.25-1.25v-7.5C13 3.56 12.44 3 11.75 3" />
          </svg>
          <span className="text-[12px] font-medium text-background">Stop</span>
        </div>
      )
    }
    // "circle-square" (default)
    return (
      <div className="h-7 w-7 rounded-full bg-foreground flex items-center justify-center cursor-pointer">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-background">
          <path d="M11.75 3h-7.5C3.56 3 3 3.56 3 4.25v7.5c0 .69.56 1.25 1.25 1.25h7.5c.69 0 1.25-.56 1.25-1.25v-7.5C13 3.56 12.44 3 11.75 3" />
        </svg>
      </div>
    )
  }

  const effectiveColor = color || "#3b82f6"

  if (style === "pill-text") {
    return (
      <div
        className="h-7 px-3 rounded-full flex items-center justify-center text-[12px] font-medium"
        style={{
          opacity: isTyping ? 1 : 0.4,
          background: isTyping ? effectiveColor : "rgba(128,128,128,0.06)",
          color: isTyping ? "white" : undefined,
        }}
      >
        Send
      </div>
    )
  }

  // "circle-icon" (default)
  return (
    <div
      className="h-7 w-7 rounded-full flex items-center justify-center"
      style={{
        opacity: isTyping ? 1 : 0.4,
        background: isTyping ? effectiveColor : "rgba(128,128,128,0.06)",
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill={isTyping ? "white" : "currentColor"} className={isTyping ? "" : "text-foreground/30"}>
        <path d="M8.53 2.22a.75.75 0 0 0-1.06 0L3.15 6.54A.75.75 0 0 0 4.21 7.6l3.04-3.04v8.737c0 .388.336.703.75.703s.75-.315.75-.703V4.56l3.04 3.04a.75.75 0 0 0 1.06-1.061z" />
      </svg>
    </div>
  )
}
