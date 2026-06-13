"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { motion, useInView } from "motion/react"
import {
  DashedBox,
} from "@/components/features/agents/landing/dashed-divider"

/* ── Flowing SDK capability chips ── */

const sdkChips = [
  { label: "<AgentChat />", color: "emerald" as const },
  { label: "streaming", color: "emerald" as const },
  { label: "billing", color: "violet" as const },
  { label: "auth", color: "amber" as const },
  { label: "rate-limits", color: "violet" as const },
  { label: "traces", color: "blue" as const },
  { label: "tools", color: "emerald" as const },
  { label: "session replay", color: "blue" as const },
]

function chipColorClasses(color: "emerald" | "violet" | "blue" | "amber") {
  switch (color) {
    case "emerald":
      return "border-emerald-400/25 bg-emerald-400/[0.06] text-emerald-400/70"
    case "violet":
      return "border-violet-400/25 bg-violet-400/[0.06] text-violet-400/70"
    case "blue":
      return "border-blue-400/25 bg-blue-400/[0.06] text-blue-400/70"
    case "amber":
      return "border-amber-400/25 bg-amber-400/[0.06] text-amber-400/70"
  }
}

function FlowingChips() {
  const doubled = useMemo(() => [...sdkChips, ...sdkChips], [])

  return (
    <div className="overflow-hidden w-full relative h-[26px]">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-6 z-10 bg-gradient-to-r from-[#080a09] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-6 z-10 bg-gradient-to-l from-[#080a09] to-transparent pointer-events-none" />

      <motion.div
        className="flex gap-1.5 w-fit items-center absolute top-0 left-0"
        animate={{ x: [0, -(sdkChips.length * 100)] }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {doubled.map((chip, i) => (
          <span
            key={`${chip.label}-${i}`}
            className={`inline-flex items-center px-2 py-0.5 rounded-full border font-mono text-[9px] whitespace-nowrap ${chipColorClasses(chip.color)}`}
          >
            {chip.label}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/* ── Animated dot traveling along a dashed connector ── */

function TravelingDot({
  direction,
  delay = 0,
  color = "rgba(52,211,153,0.6)",
}: {
  direction: "down" | "up"
  delay?: number
  color?: string
}) {
  return (
    <motion.div
      className="absolute left-1/2 -translate-x-1/2 rounded-full"
      style={{
        width: 3,
        height: 3,
        backgroundColor: color,
        boxShadow: `0 0 6px ${color}`,
      }}
      initial={{
        top: direction === "down" ? "-3px" : "calc(100% + 3px)",
        opacity: 0,
      }}
      animate={{
        top: direction === "down" ? ["0%", "100%"] : ["100%", "0%"],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 1.8,
        repeat: Infinity,
        delay,
        ease: "linear",
      }}
    />
  )
}

/* ── Dashed connector between SDK layer and AI Providers ── */

function DashedConnector() {
  return (
    <div className="relative w-full h-8 flex items-center justify-center my-0.5">
      {/* Left dashed line */}
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
      >
        <line
          x1="30%"
          y1="0"
          x2="30%"
          y2="100%"
          stroke="rgba(255,255,255,0.06)"
          strokeDasharray="3 4"
          strokeLinecap="round"
        />
        <line
          x1="70%"
          y1="0"
          x2="70%"
          y2="100%"
          stroke="rgba(255,255,255,0.06)"
          strokeDasharray="3 4"
          strokeLinecap="round"
        />
      </svg>

      {/* Traveling dots - left side (requests down) */}
      <div className="absolute top-0 bottom-0" style={{ left: "30%" }}>
        <TravelingDot direction="down" delay={0} color="rgba(52,211,153,0.45)" />
        <TravelingDot direction="down" delay={1.1} color="rgba(52,211,153,0.3)" />
      </div>

      {/* Traveling dots - right side (responses up) */}
      <div className="absolute top-0 bottom-0" style={{ left: "70%" }}>
        <TravelingDot direction="up" delay={0.5} color="rgba(167,139,250,0.45)" />
        <TravelingDot direction="up" delay={1.6} color="rgba(167,139,250,0.3)" />
      </div>

      {/* Center labels */}
      <div className="relative z-10 flex items-center gap-6 pointer-events-none">
        <span className="flex items-center gap-1">
          <svg width="7" height="7" viewBox="0 0 8 8" fill="none" className="text-emerald-400/30">
            <path d="M4 1v6M4 7L2 5M4 7l2-2" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
          </svg>
          <span className="font-mono text-[7px] text-white/20">prompts</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="font-mono text-[7px] text-white/20">tokens</span>
          <svg width="7" height="7" viewBox="0 0 8 8" fill="none" className="text-violet-400/30">
            <path d="M4 7V1M4 1L2 3M4 1l2 2" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
          </svg>
        </span>
      </div>
    </div>
  )
}

/* ── AI Providers layer ── */

function AIProvidersLayer() {
  const [activeProvider, setActiveProvider] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveProvider((prev) => (prev + 1) % 2)
    }, 3_000)
    return () => clearInterval(interval)
  }, [])

  const providers = [
    {
      name: "Anthropic",
      sub: "Claude Code",
      icon: (active: boolean) => (
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={active ? "text-[#D97757]" : "text-white/20"}
        >
          <path d="M5.92405 15.2962L9.85823 13.0903L9.92405 12.8981L9.85823 12.7918H9.66582L9.0076 12.7513L6.75949 12.6906L4.81013 12.6097L2.92152 12.5085L2.44557 12.4073L2 11.8204L2.04557 11.5269L2.44557 11.2588L3.01772 11.3094L4.28354 11.3954L6.18228 11.5269L7.55949 11.6079L9.6 11.8204H9.92405L9.96962 11.6888L9.85823 11.6079L9.77215 11.5269L7.8076 10.1963L5.68101 8.78978L4.56709 7.98027L3.96456 7.57045L3.66076 7.18594L3.52911 6.34607L4.07595 5.74399L4.81013 5.79459L4.99747 5.84518L5.74177 6.4169L7.33165 7.64635L9.4076 9.1743L9.71139 9.42727L9.83291 9.34126L9.8481 9.28055L9.71139 9.05287L8.58228 7.01391L7.37722 4.93954L6.84051 4.07943L6.69873 3.56337C6.6481 3.35087 6.61266 3.17379 6.61266 2.95624L7.23544 2.11131L7.57975 2L8.41013 2.11131L8.75949 2.41487L9.27595 3.59373L10.1114 5.45054L11.4076 7.97521L11.7873 8.72401L11.9899 9.41715L12.0658 9.62965H12.1975V9.50822L12.3038 8.08652L12.5013 6.34101L12.6937 4.09461L12.7595 3.46218L13.0734 2.70326L13.6962 2.29345L14.1823 2.52618L14.5823 3.0979L14.5266 3.46724L14.2886 5.01037L13.8228 7.42879L13.519 9.04781H13.6962L13.8987 8.84543L14.719 7.75765L16.0962 6.03744L16.7038 5.35441L17.4127 4.60056L17.8684 4.24134H18.7291L19.362 5.18239L19.0785 6.15381L18.1924 7.27701L17.4582 8.22818L16.4051 9.64483L15.7468 10.7781L15.8076 10.8692L15.9646 10.854L18.3443 10.3481L19.6304 10.1154L21.1646 9.85226L21.8582 10.1761L21.9342 10.5049L21.6608 11.1778L20.0203 11.5826L18.0962 11.9671L15.2304 12.6451L15.1949 12.6704L15.2354 12.721L16.5266 12.8424L17.0785 12.8728H18.4304L20.9468 13.06L21.6051 13.4951L22 14.0263L21.9342 14.4311L20.9215 14.9471L19.5544 14.6233L16.3646 13.8644L15.2709 13.5912H15.119V13.6823L16.0304 14.5727L17.7013 16.0804L19.7924 18.0233L19.8987 18.5039L19.6304 18.8834L19.3468 18.8429L17.5089 17.4617L16.8 16.8394L15.1949 15.4885H15.0886V15.6302L15.4582 16.1715L17.4127 19.106L17.5139 20.0066L17.3722 20.3L16.8658 20.4771L16.3089 20.3759L15.1646 18.7721L13.9848 16.9658L13.0329 15.3468L12.9165 15.4126L12.3544 21.4586L12.0911 21.7673L11.4835 22L10.9772 21.6155L10.7089 20.9932L10.9772 19.7637L11.3013 18.1599L11.5646 16.8849L11.8025 15.3013L11.9443 14.7751L11.9342 14.7397L11.8177 14.7549L10.6228 16.3941L8.80506 18.848L7.36709 20.386L7.02279 20.5226L6.42532 20.214L6.48101 19.6625L6.81519 19.1718L8.80506 16.642L10.0051 15.0736L10.7797 14.168L10.7747 14.0364H10.7291L5.44304 17.4667L4.50127 17.5882L4.0962 17.2087L4.14684 16.5864L4.33924 16.384L5.92911 15.2912L5.92405 15.2962Z" />
        </svg>
      ),
    },
    {
      name: "OpenAI",
      sub: "Codex",
      icon: (active: boolean) => (
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={active ? "text-white/70" : "text-white/20"}
        >
          <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.998 5.998 0 0 0-3.998 2.9 6.042 6.042 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073M13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.143-.08 4.773-2.756a.776.776 0 0 0 .391-.676v-6.738l2.018 1.165a.07.07 0 0 1 .038.052v5.573a4.504 4.504 0 0 1-4.487 4.5M3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.774 2.756a.776.776 0 0 0 .78 0l5.83-3.368v2.332a.08.08 0 0 1-.03.06L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646M2.34 7.896a4.485 4.485 0 0 1 2.34-1.972V11.6a.77.77 0 0 0 .387.676l5.829 3.365-2.017 1.165a.076.076 0 0 1-.069.006L4 14.019a4.5 4.5 0 0 1-1.66-6.123M19.42 11.6l-5.829-3.366L15.608 7.07a.076.076 0 0 1 .069-.006l4.812 2.779a4.5 4.5 0 0 1-.69 8.138v-5.677a.79.79 0 0 0-.378-.703m2.009-3.023-.142-.085-4.774-2.756a.776.776 0 0 0-.78 0L9.902 9.1V6.77a.08.08 0 0 1 .03-.061l4.813-2.787a4.5 4.5 0 0 1 6.684 4.655m-12.64 4.135L6.77 11.547a.07.07 0 0 1-.037-.052V5.922a4.5 4.5 0 0 1 7.37-3.463l-.143.08L9.188 5.3a.776.776 0 0 0-.391.676zm1.095-2.362 2.596-1.5 2.596 1.5v2.999l-2.596 1.5-2.596-1.5z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.015] px-2.5 py-2 overflow-hidden">
      {/* Provider cards row */}
      <div className="flex items-center gap-2">
        {providers.map((p, i) => (
          <div
            key={p.name}
            className={`flex-1 flex items-center gap-2 rounded-md border px-2 py-1.5 transition-all duration-700 ${
              activeProvider === i
                ? "border-white/[0.1] bg-white/[0.04]"
                : "border-white/[0.04] bg-transparent"
            }`}
          >
            {p.icon(activeProvider === i)}
            <div className="min-w-0">
              <div
                className={`font-mono text-[9px] leading-tight transition-colors duration-700 ${
                  activeProvider === i ? "text-white/60" : "text-white/20"
                }`}
              >
                {p.name}
              </div>
              <div
                className={`font-mono text-[7px] leading-tight transition-colors duration-700 ${
                  activeProvider === i ? "text-white/35" : "text-white/12"
                }`}
              >
                {p.sub}
              </div>
            </div>
            {activeProvider === i ? (
              <motion.span
                className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400/60 shrink-0"
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ) : (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/[0.08] shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 mt-1.5 pt-1.5 border-t border-white/[0.04]">
        <span className="font-mono text-[7px] text-white/20">Managed connections</span>
        <span className="text-white/[0.06]">|</span>
        <span className="font-mono text-[7px] text-white/20">auto-retry</span>
        <span className="text-white/[0.06]">|</span>
        <span className="font-mono text-[7px] text-white/20">fallback</span>
      </div>
    </div>
  )
}

/* ── Main Component ── */

export function HeroRightStrategyB({
  children,
}: {
  children: React.ReactNode
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.2 })

  return (
    <motion.div
      ref={containerRef}
      className="relative flex-1 min-w-0 hidden lg:flex flex-col lg:h-auto"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
    >
      {/* Label above the panel */}
      <div className="flex items-center justify-between mb-3 px-1 gap-2 min-w-0">
        <span className="text-[12px] sm:text-[13px] text-white/40 truncate min-w-0">
          <span className="text-white/60">Architecture</span> &middot; An is a
          layer in your stack
        </span>
        <span className="text-[11px] sm:text-[13px] font-mono text-white/30 px-1.5 sm:px-2 py-0.5 rounded border border-white/[0.08] bg-white/[0.03] shrink-0">
          Strategy B
        </span>
      </div>

      <DashedBox className="overflow-hidden flex-1 min-h-0 flex flex-col">
        {/* Top emerald glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-[radial-gradient(ellipse_at_center,rgba(52,211,153,0.5)_0%,transparent_70%)]" />

        <div className="px-3 py-3 flex flex-col flex-1 min-h-0">
          {/* ── Layer 1: "Your Product" outer wrapper ── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="relative rounded-lg border border-dashed border-white/[0.08] bg-white/[0.01] p-2.5 flex-1 min-h-0 flex flex-col"
          >
            {/* "Your Product" label */}
            <div className="flex items-center gap-1.5 mb-2 shrink-0">
              <span className="font-mono text-[8px] text-white/20 uppercase tracking-wider">
                Your Product
              </span>
              <div className="flex-1 h-px bg-white/[0.04]" />
              <span className="font-mono text-[7px] text-white/15 px-1.5 py-0.5 rounded border border-white/[0.05] bg-white/[0.02]">
                yourapp.com
              </span>
            </div>

            {/* ── Layer 2: 21st SDK (highlighted, contains children) ── */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={
                isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }
              }
              transition={{ duration: 0.4, delay: 0.15 }}
              className="relative rounded-lg border border-emerald-400/20 bg-emerald-400/[0.02] flex-1 min-h-0 flex flex-col overflow-hidden"
            >
              {/* Subtle emerald glow animation on border */}
              <motion.div
                className="absolute inset-0 rounded-lg pointer-events-none"
                animate={{
                  boxShadow: [
                    "0 0 0px rgba(52,211,153,0), inset 0 0 0px rgba(52,211,153,0)",
                    "0 0 16px rgba(52,211,153,0.05), inset 0 0 16px rgba(52,211,153,0.015)",
                    "0 0 0px rgba(52,211,153,0), inset 0 0 0px rgba(52,211,153,0)",
                  ],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Top glow line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-[radial-gradient(ellipse_at_center,rgba(52,211,153,0.35)_0%,transparent_70%)]" />

              {/* 21st SDK header strip */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 border-b border-emerald-400/[0.08] shrink-0">
                <div className="w-4 h-4 rounded-[4px] border border-emerald-400/20 bg-emerald-400/[0.06] flex items-center justify-center">
                  <svg
                    width="8"
                    height="8"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-emerald-400/70"
                  >
                    <path
                      d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="font-mono text-[10px] text-emerald-400/70 font-medium">
                  21st SDK
                </span>
                <span className="font-mono text-[8px] text-white/20">
                  @21st/an
                </span>
                <div className="ml-auto">
                  <span className="font-mono text-[7px] text-emerald-400/35 px-1 py-0.5 rounded border border-emerald-400/10 bg-emerald-400/[0.03]">
                    v1.0
                  </span>
                </div>
              </div>

              {/* Children slot (the existing chat preview) */}
              <div className="relative flex-1 min-h-0 overflow-hidden">
                {children}
              </div>

              {/* Flowing chips strip below the chat preview */}
              <div className="shrink-0 px-1.5 py-1.5 border-t border-emerald-400/[0.06]">
                <FlowingChips />
              </div>
            </motion.div>

            {/* ── Dashed connector with animated dots ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.25 }}
              className="shrink-0"
            >
              <DashedConnector />
            </motion.div>

            {/* ── Layer 3: AI Providers ── */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={
                isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }
              }
              transition={{ duration: 0.4, delay: 0.3 }}
              className="shrink-0"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="font-mono text-[8px] text-white/20 uppercase tracking-wider">
                  AI Providers
                </span>
                <div className="flex-1 h-px bg-white/[0.04]" />
              </div>
              <AIProvidersLayer />
            </motion.div>
          </motion.div>
        </div>
      </DashedBox>
    </motion.div>
  )
}

export default HeroRightStrategyB
