"use client"

import { useState } from "react"
import { motion } from "motion/react"
import type { TimelineStep } from "../types/timeline"
import type { VisualConfig } from "../types/theme"
import { useStreamingText } from "../hooks"
import { StreamingMarkdown } from "./streaming-markdown"

const TEXT_SIZES = { sm: "13px", md: "14px", lg: "15px" } as const

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="flex items-center h-6 px-0.5 mt-1">
      <button
        type="button"
        tabIndex={-1}
        onClick={handleCopy}
        className="p-1.5 rounded-md transition-[background-color,transform] duration-150 ease-out hover:bg-accent active:scale-[0.97]"
      >
        <div className="relative w-3.5 h-3.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className={`absolute inset-0 w-3.5 h-3.5 text-muted-foreground transition-[opacity,transform] duration-200 ease-out ${copied ? "opacity-0 scale-50" : "opacity-100 scale-100"}`}
          >
            <g transform="scale(1.15) translate(-1.8, -1.8)">
              <path d="M15 9V5.25C15 4.00736 13.9926 3 12.75 3H5.25C4.00736 3 3 4.00736 3 5.25V12.75C3 13.9926 4.00736 15 5.25 15H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M18.75 9H11.25C10.0074 9 9 10.0074 9 11.25V18.75C9 19.9926 10.0074 21 11.25 21H18.75C19.9926 21 21 19.9926 21 18.75V11.25C21 10.0074 19.9926 9 18.75 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            className={`absolute inset-0 w-3.5 h-3.5 text-muted-foreground transition-[opacity,transform] duration-200 ease-out ${copied ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
          >
            <path d="M5 12.75L10 19L19 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>
    </div>
  )
}

export function AssistantStream({
  step,
  onComplete,
  onUpdate,
  vc,
}: {
  step: Extract<TimelineStep, { type: "assistant-stream" }>
  onComplete: () => void
  onUpdate: () => void
  vc: VisualConfig
}) {
  const { displayedText, state } = useStreamingText(step.content, {
    delayBefore: 300,
    wordInterval: 25,
    onComplete,
    onUpdate,
  })

  const textSize = TEXT_SIZES[vc.textSizeScale]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="px-0.5 py-1" style={{ fontSize: textSize }}>
      <StreamingMarkdown
        content={displayedText}
        className={`leading-relaxed [&_p]:leading-relaxed ${vc.textContrast === "high" ? "text-foreground/90" : "text-foreground/60"}`}
      />
      {vc.showCopyButton && state === "complete" && <CopyButton text={step.content} />}
    </motion.div>
  )
}
