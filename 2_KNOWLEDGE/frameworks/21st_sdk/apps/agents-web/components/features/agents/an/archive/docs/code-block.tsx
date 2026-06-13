"use client"

import { useState, useRef, useCallback } from "react"
import { AnimatedCopyIcon } from "./icons"

export function CodeBlock({ html, code }: { html: string; code: string }) {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setCopied(false), 2000)
  }, [code])

  return (
    <div className="group/code relative my-6">
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <button
        onClick={handleCopy}
        className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background/80 text-muted-foreground opacity-0 backdrop-blur transition-all hover:bg-accent hover:text-muted-foreground group-hover/code:opacity-100"
        aria-label="Copy code"
      >
        <AnimatedCopyIcon copied={copied} />
      </button>
    </div>
  )
}
