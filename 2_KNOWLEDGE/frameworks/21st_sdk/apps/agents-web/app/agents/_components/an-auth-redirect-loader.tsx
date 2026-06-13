"use client"

import { useState, useEffect } from "react"
import { Logo } from "@/components/features/agents/ui/canvas/[id]/{components}/ui/logo"

export function AnAuthRedirectLoader() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translate(0, 0)" : "translate(20px, -20px)",
          transition: "opacity 600ms cubic-bezier(0.22, 1, 0.36, 1), transform 600ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <Logo
          className="w-5 h-5 animate-pulse text-foreground"
          fill="currentColor"
        />
      </div>
    </div>
  )
}
