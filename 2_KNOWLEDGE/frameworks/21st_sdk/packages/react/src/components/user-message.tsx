import React, { memo } from "react"
import { motion } from "motion/react"
import type { UIMessage } from "ai"
import { cn } from "../utils/cn"
import { useThemeConfig } from "../theme-config"
import { ImageThumb } from "./image-thumb"

interface UserMessageProps {
  message: UIMessage
  className?: string
}

export const UserMessage = memo(function UserMessage({
  message,
  className,
}: UserMessageProps) {
  const config = useThemeConfig()
  const textParts = message.parts?.filter((p) => p.type === "text") ?? []
  const text = textParts.map((p) => (p as any).text).join("")

  const images: string[] = []
  for (const part of message.parts ?? []) {
    if ((part as any).type === "file" && (part as any).mimeType?.startsWith("image/")) {
      images.push((part as any).url || `data:${(part as any).mimeType};base64,${(part as any).data}`)
    }
    if ((part as any).type === "image") {
      images.push((part as any).url || (part as any).image)
    }
    if ((part as any).type === "data-image" && (part as any).data?.url) {
      images.push((part as any).data.url)
    }
  }
  if ((message as any).experimental_attachments) {
    for (const att of (message as any).experimental_attachments) {
      if (att.contentType?.startsWith("image/")) {
        images.push(att.url)
      }
    }
  }

  if (!text && images.length === 0) return null

  const motionProps = {
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.25 },
  }

  if (config.messageStyle === "full-width") {
    return (
      <motion.div
        {...motionProps}
        className={cn("an-user-message w-full text-sm", className)}
        style={{
          borderRadius: "var(--an-message-border-radius, 16px)",
          padding: "var(--an-user-message-padding, 10px 14px)",
          border: "1px solid var(--an-border-color, #e5e5e5)",
          background: "var(--an-background, #ffffff)",
          color: "var(--an-foreground, #1a1a1a)",
          boxShadow: config.messageShadow ? "0 4px 12px rgba(0,0,0,0.08)" : "none",
        }}
      >
        {images.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-2">
            {images.map((url, i) => <ImageThumb key={i} src={url} />)}
          </div>
        )}
        {text && (
          <p className={`leading-relaxed whitespace-pre-wrap break-words ${config.textContrast === "high" ? "text-foreground/90" : "text-foreground/70"}`}>
            {text}
          </p>
        )}
      </motion.div>
    )
  }

  // bubble-right (default)
  return (
    <motion.div {...motionProps} className={cn("an-user-message flex flex-col items-end gap-1 pb-2", className)}>
      {images.length > 0 && images.map((url, i) => (
        <div
          key={i}
          className="max-w-[200px] p-1.5 bg-foreground/[0.04] shadow-[0_0_0_1px_rgba(128,128,128,0.12)]"
          style={{ borderRadius: "var(--an-message-border-radius, 16px)" }}
        >
          <img
            src={url}
            alt="attachment"
            className="block object-cover max-w-[184px] max-h-[120px]"
            style={{ borderRadius: "calc(var(--an-message-border-radius, 16px) - 4px)" }}
          />
        </div>
      ))}
      {text && (
        <div style={{ maxWidth: "calc(95% - 40px)", marginInlineStart: 70 }}>
          <div
            className="px-3.5 py-1.5 text-sm transition-colors"
            style={{
              borderRadius: "var(--an-message-border-radius, 16px)",
              background: "var(--an-user-message-bg, #f5f5f5)",
              color: "var(--an-user-message-text, var(--an-foreground, #1a1a1a))",
              boxShadow: config.messageShadow ? "0 4px 12px rgba(0,0,0,0.08)" : "none",
            }}
          >
            <p className="leading-5 whitespace-pre-wrap break-words">{text}</p>
          </div>
        </div>
      )}
    </motion.div>
  )
})
