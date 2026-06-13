"use client"

import { motion, AnimatePresence } from "motion/react"
import { overlayContentBase } from "@/components/features/agents/ui/1code/lib/overlay-styles"

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
          <motion.div className="fixed inset-0 z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 4 }}
            transition={{ duration: 0.15 }}
            className={`absolute bottom-full ${anchor === "right" ? "right-0" : "left-0"} mb-2 ${width} ${overlayContentBase} overflow-hidden`}
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
