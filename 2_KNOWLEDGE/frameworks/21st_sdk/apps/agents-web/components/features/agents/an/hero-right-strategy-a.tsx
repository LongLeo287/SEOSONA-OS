"use client"

import { useMemo } from "react"
import { motion, AnimatePresence } from "motion/react"

/* ── Agent name mapping ── */

const AGENT_MAP: Record<string, string> = {
  support: "claude-code",
  code: "codex",
  research: "claude-code",
}

/* ── Syntax token types ── */

type SyntaxToken = {
  text: string
  type: "keyword" | "component" | "string" | "punctuation" | "prop"
}

function tokenColor(type: SyntaxToken["type"]) {
  switch (type) {
    case "keyword":
      return "text-violet-400/80"
    case "component":
      return "text-emerald-400/80"
    case "string":
      return "text-amber-300/60"
    case "punctuation":
      return "text-white/30"
    case "prop":
      return "text-white/45"
  }
}

/* ── Build code tokens from current props ── */

function buildTokens(agent: string, style: string): SyntaxToken[][] {
  return [
    // Line 1: import { AgentChat } from "@21st/an"
    [
      { text: "import", type: "keyword" },
      { text: " { ", type: "punctuation" },
      { text: "AgentChat", type: "component" },
      { text: " } ", type: "punctuation" },
      { text: "from", type: "keyword" },
      { text: " ", type: "punctuation" },
      { text: `"@21st/an"`, type: "string" },
    ],
    // Line 2: <AgentChat agent="..." style="..." />
    [
      { text: "<", type: "punctuation" },
      { text: "AgentChat", type: "component" },
      { text: " ", type: "punctuation" },
      { text: "agent", type: "prop" },
      { text: "=", type: "punctuation" },
      { text: `"${agent}"`, type: "string" },
      { text: " ", type: "punctuation" },
      { text: "style", type: "prop" },
      { text: "=", type: "punctuation" },
      { text: `"${style}"`, type: "string" },
      { text: " />", type: "punctuation" },
    ],
  ]
}

/* ── Animated string value ── */

function AnimatedValue({ value }: { value: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={value}
        initial={{ opacity: 0, y: 4, filter: "blur(2px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -4, filter: "blur(2px)" }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="inline-block"
      >
        {value}
      </motion.span>
    </AnimatePresence>
  )
}

/* ── Code Bar ── */

function CodeBar({ agent, style }: { agent: string; style: string }) {
  const lines = useMemo(() => buildTokens(agent, style), [agent, style])

  return (
    <div className="bg-[#0c0c0f] rounded-t-lg border-b border-white/[0.06] shrink-0">
      {/* File tab row */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          {/* File icon */}
          <svg
            width="10"
            height="10"
            viewBox="0 0 16 16"
            fill="none"
            className="text-white/25"
          >
            <path
              d="M3 1.5h6.5L13 5v9.5a1 1 0 01-1 1H3a1 1 0 01-1-1v-13a1 1 0 011-1z"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path d="M9.5 1.5V5H13" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          <span className="font-mono text-[10px] text-white/50">app.tsx</span>
        </div>
        <span className="text-[9px] font-mono text-white/20 px-1.5 py-0.5 rounded border border-white/[0.05] bg-white/[0.02]">
          Strategy A
        </span>
      </div>

      {/* Code lines */}
      <div className="px-3 py-2 font-mono text-[11px] leading-[1.8] whitespace-pre overflow-x-hidden">
        {lines.map((line, lineIdx) => (
          <div key={lineIdx} className="flex">
            <span className="w-4 text-right pr-2 text-white/15 select-none shrink-0 text-[10px]">
              {lineIdx + 1}
            </span>
            <span className="min-w-0">
              {line.map((token, tIdx) => {
                const isAnimatedString =
                  token.type === "string" &&
                  lineIdx === 1 &&
                  (token.text.includes(agent) || token.text.includes(style))

                if (isAnimatedString) {
                  // Determine which value to animate
                  const isAgentToken = token.text.includes(agent)
                  const raw = isAgentToken ? agent : style

                  return (
                    <span key={tIdx} className={tokenColor(token.type)}>
                      &quot;<AnimatedValue value={raw} />&quot;
                    </span>
                  )
                }

                return (
                  <span key={tIdx} className={tokenColor(token.type)}>
                    {token.text}
                  </span>
                )
              })}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Connector ("renders as") ── */

function Connector() {
  return (
    <div className="flex items-center justify-center gap-2 py-1.5 shrink-0">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      <div className="flex items-center gap-1.5 px-2">
        <svg
          width="10"
          height="10"
          viewBox="0 0 12 12"
          fill="none"
          className="text-white/25"
        >
          <path
            d="M3 6h6M7 4l2 2-2 2"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="font-mono text-[9px] text-white/20">renders as</span>
      </div>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
    </div>
  )
}

/* ── Main Component ── */

export function HeroRightStrategyA({
  children,
  chatStyle,
  appType,
}: {
  children: React.ReactNode
  chatStyle: string
  appType: string
}) {
  const agent = AGENT_MAP[appType] || "claude-code"
  const style = chatStyle || "notion"

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Label above the panel */}
      <div className="flex items-center justify-between mb-3 px-1 gap-2 min-w-0">
        <span className="text-[12px] sm:text-[13px] text-white/40 truncate min-w-0">
          <span className="text-white/60">Your code</span> &rarr;{" "}
          <span className="text-white/60">Your users&apos; experience</span>
        </span>
        <span className="text-[11px] sm:text-[13px] font-mono text-white/30 px-1.5 sm:px-2 py-0.5 rounded border border-white/[0.08] bg-white/[0.03] shrink-0">
          Strategy A
        </span>
      </div>

      {/* Code bar */}
      <CodeBar agent={agent} style={style} />

      {/* Connector */}
      <Connector />

      {/* Children: the existing chat preview (DashedBox with chat) */}
      {children}
    </div>
  )
}

export default HeroRightStrategyA
