import React, { memo, useState, useCallback } from "react"
import { cn } from "../utils/cn"
import { Check, Copy } from "lucide-react"

interface MessageActionsProps {
  content: string
  className?: string
}

export const MessageActions = memo(function MessageActions({
  content,
  className,
}: MessageActionsProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [content])

  if (!content) return null

  return (
    <div
      className={cn(
        "an-message-actions flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
        className,
      )}
    >
      <button
        onClick={handleCopy}
        className="p-1 rounded transition-colors"
        style={{ color: "var(--an-foreground-muted)" }}
        title={copied ? "Copied!" : "Copy message"}
      >
        {copied ? (
          <Check className="w-3.5 h-3.5" style={{ color: "#22c55e" }} />
        ) : (
          <Copy className="w-3.5 h-3.5" style={{ opacity: 0.5 }} />
        )}
      </button>
    </div>
  )
})
