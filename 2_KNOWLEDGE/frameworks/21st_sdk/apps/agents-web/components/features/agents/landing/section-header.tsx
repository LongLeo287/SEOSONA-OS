"use client"

import { motion } from "motion/react"

interface SectionHeaderProps {
  overline: string
  heading: string
  subtext?: string
  maxHeadingWidth?: string
}

export function SectionHeader({
  overline,
  heading,
  subtext,
  maxHeadingWidth = "24ch",
}: SectionHeaderProps) {
  return (
    <>
      <motion.div
        className="flex items-center text-xs font-medium text-white/25 uppercase tracking-widest mb-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <span className="flex items-center gap-2">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
            <rect x="0" y="0" width="10" height="2" />
            <rect x="0" y="4" width="10" height="2" />
            <rect x="0" y="8" width="10" height="2" />
          </svg>
          {overline}
        </span>
      </motion.div>

      <motion.h2
        className="font-pixel text-[clamp(1.5rem,4vw,2.25rem)] leading-[1.15] tracking-wide text-white"
        style={{ maxWidth: maxHeadingWidth }}
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.04 }}
      >
        {heading}
      </motion.h2>

      {subtext && (
        <motion.p
          className="mt-4 text-[17px] text-white/40 max-w-[44ch] leading-relaxed"
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.08 }}
        >
          {subtext}
        </motion.p>
      )}
    </>
  )
}
