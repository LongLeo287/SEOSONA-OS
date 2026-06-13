"use client"

import { useState, useCallback, useRef } from "react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function CopyText({
  value,
  children,
  className,
}: {
  value: string
  children: React.ReactNode
  className?: string
}) {
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)
  const clickingRef = useRef(false)

  const handlePointerDown = useCallback(() => {
    clickingRef.current = true
  }, [])

  const handlePointerLeave = useCallback(() => {
    clickingRef.current = false
  }, [])

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      navigator.clipboard.writeText(value).then(() => {
        if (timerRef.current) clearTimeout(timerRef.current)
        clickingRef.current = false
        setCopied(true)
        setOpen(true)
        timerRef.current = setTimeout(() => {
          setOpen(false)
          setTimeout(() => setCopied(false), 150)
        }, 2_000)
      }).catch(() => {
        // Clipboard API may be unavailable in non-HTTPS contexts
      })
    },
    [value],
  )

  return (
    <Tooltip
      open={open}
      onOpenChange={(newOpen) => {
        if (copied || clickingRef.current) return
        setOpen(newOpen)
      }}
      delayDuration={500}
    >
      <TooltipTrigger asChild>
        <span
          className={cn("inline-flex w-fit cursor-pointer", className)}
          onPointerDown={handlePointerDown}
          onPointerLeave={handlePointerLeave}
          onClick={handleClick}
        >
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" align="center" collisionPadding={8} className="text-xs">
        {copied ? "Copied" : "Click to copy"}
      </TooltipContent>
    </Tooltip>
  )
}
