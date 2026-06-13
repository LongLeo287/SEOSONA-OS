"use client"

import { motion } from "motion/react"

export function ReplayButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      whileTap={{ scale: 0.85 }}
      className="absolute bottom-3 right-3 z-20 w-8 h-8 rounded-full bg-foreground/[0.06] flex items-center justify-center hover:bg-foreground/[0.12] transition-colors cursor-pointer backdrop-blur-sm"
      title="Replay"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </svg>
    </motion.button>
  )
}
