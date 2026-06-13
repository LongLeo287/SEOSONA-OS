"use client"

import { motion } from "motion/react"

const TOTAL_BLOCKS = 20

function AsciiBar({ pct, delay }: { pct: number; delay: number }) {
  const filled = Math.round((pct / 100) * TOTAL_BLOCKS)
  const blocks = Array.from({ length: TOTAL_BLOCKS }, (_, i) => i < filled)

  return (
    <div className="flex gap-[2px] w-full">
      {blocks.map((on, i) => (
        <motion.span
          key={i}
          className={`inline-block flex-1 h-[10px] rounded-[1px] ${
            on ? "bg-white/30" : "bg-white/[0.05]"
          }`}
          initial={{ opacity: 0, scaleY: 0.3 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{
            delay: delay + i * 0.02,
            duration: 0.15,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  )
}

const usageMetrics = [
  {
    label: "Tokens",
    used: "47.2k",
    limit: "100k",
    pct: 47,
    icon: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
        <path d="M6 1L10.33 3.5V8.5L6 11L1.67 8.5V3.5L6 1Z" stroke="currentColor" strokeWidth="1" />
      </svg>
    ),
  },
  {
    label: "Sessions",
    used: "28",
    limit: "100",
    pct: 28,
    icon: (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
        <rect x="2" y="2" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1" />
        <circle cx="6" cy="6" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
]

export function PreviewUsageMeter({ compact }: { compact?: boolean } = {}) {
  return (
    <div className="flex flex-col h-full">
      {!compact && (
        <>
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] shrink-0">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/[0.08]" />
            </div>
            <div className="flex-1 text-center">
              <span className="text-[11px] font-mono text-white/30">
                Usage · Pro Plan
              </span>
            </div>
          </div>

          {/* Plan header */}
          <div className="px-5 pt-5 pb-4 shrink-0">
            <div className="flex items-baseline justify-between">
              <span className="text-[15px] font-semibold text-white/80">Pro</span>
              <span className="text-[13px] font-mono text-white/30">$20/mo</span>
            </div>
            <p className="text-[11px] font-mono text-white/20 mt-1">
              Resets in 12 days
            </p>
          </div>

          <div className="mx-5 border-t border-white/[0.05]" />
        </>
      )}

      {/* Metrics */}
      <div className="flex-1 px-5 pt-4 pb-4 space-y-5">
        {usageMetrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + i * 0.1, duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2 text-white/40">
                {m.icon}
                <span className="text-[12px]">{m.label}</span>
              </div>
              <span className="text-[11px] font-mono text-white/30 tabular-nums">
                {m.used}
                <span className="text-white/15"> / {m.limit}</span>
              </span>
            </div>
            <AsciiBar pct={m.pct} delay={0.25 + i * 0.15} />
          </motion.div>
        ))}

        <div className="border-t border-white/[0.05]" />

        {/* Upgrade card */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.3 }}
          className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3.5 py-3 flex items-center justify-between"
        >
          <div>
            <p className="text-[12px] text-white/50 font-medium">
              Upgrade to Max
            </p>
            <p className="text-[10px] text-white/20 mt-0.5">
              Unlimited tokens & sessions
            </p>
          </div>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="shrink-0 text-white/25"
          >
            <path
              d="M5.25 3.5L8.75 7L5.25 10.5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </div>
    </div>
  )
}
