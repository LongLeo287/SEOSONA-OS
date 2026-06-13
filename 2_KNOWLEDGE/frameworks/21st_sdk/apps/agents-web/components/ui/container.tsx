"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export function Container({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full transition-all duration-200",
        className,
      )}
      style={{
        width: "min(100%, 3680px)",
        // Do not shrink content area based on sidebar state.
        // The sidebar system manages its own gap; keep content at full viewport width.
        maxWidth: "100vw",
      }}
    >
      {children}
    </div>
  )
}
