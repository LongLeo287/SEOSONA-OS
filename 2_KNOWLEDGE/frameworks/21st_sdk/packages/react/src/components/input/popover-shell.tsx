import React from "react"
import { motion, AnimatePresence } from "motion/react"

const OVERLAY_STYLES: React.CSSProperties = {
  borderRadius: 10,
  border: "1px solid var(--an-border-color)",
  background: "var(--an-background)",
  color: "var(--an-foreground)",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  fontSize: "var(--an-text-size-sm, 14px)",
  zIndex: 50,
  overflow: "auto",
}

export function PopoverShell({
  open,
  onClose,
  anchor = "right",
  width = "w-[200px]",
  children,
}: {
  open: boolean
  onClose: () => void
  anchor?: "left" | "right"
  width?: string
  children: React.ReactNode
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className={`absolute bottom-full ${anchor === "right" ? "right-0" : "left-0"} mb-2 ${width} overflow-hidden`}
            style={OVERLAY_STYLES}
            initial={{ opacity: 0, scale: 0.95, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 4 }}
            transition={{ duration: 0.15 }}
          >
            <div className="p-1 flex flex-col gap-px">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
