"use client"

import { AnimatePresence, motion } from "motion/react"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface WizardShellProps {
  children: React.ReactNode
  onBack?: () => void
  rightSlot?: React.ReactNode
  wide?: boolean      // 900px
  fullscreen?: boolean // 1400px
}

export function WizardShell({
  children,
  onBack,
  rightSlot,
  wide,
  fullscreen,
}: WizardShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased overflow-x-hidden">
      <nav className="flex items-center justify-between px-5 py-4">
        <AnimatePresence mode="wait">
          {onBack ? (
            <motion.button
              key="back"
              onClick={onBack}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className="an-focus-btn flex items-center gap-1.5 rounded-md text-muted-foreground hover:text-foreground/70 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 text-muted-foreground" />
              <span className="text-[13px]">Back</span>
            </motion.button>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            />
          )}
        </AnimatePresence>
        {rightSlot ?? <div />}
      </nav>

      <div
        className={cn("mx-auto w-full px-6")}
        style={{
          maxWidth: fullscreen ? "1400px" : wide ? "900px" : "388px",
          transition: "max-width 500ms cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <div
          style={{
            paddingTop: fullscreen ? "8px" : "calc(30vh - 56px)",
            transition: "padding-top 500ms cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
