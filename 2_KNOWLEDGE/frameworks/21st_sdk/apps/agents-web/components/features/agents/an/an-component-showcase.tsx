"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import * as shiki from "shiki"
import { SectionHeader } from "@/components/features/agents/landing/section-header"
import {
  DashedBox,
} from "@/components/features/agents/landing/dashed-divider"
import { motion, AnimatePresence, useInView } from "motion/react"
import { PreviewAgentChat } from "./an-preview-chat"
import { PreviewToolExecution } from "./an-preview-tools"
import { PreviewUsageMeter } from "./an-preview-usage"

/* ── Shared shiki highlighter ── */

let highlighterPromise: Promise<shiki.Highlighter> | null = null

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = shiki.createHighlighter({
      themes: ["vesper"],
      langs: ["tsx"],
    })
  }
  return highlighterPromise
}

function HighlightedCode({ code }: { code: string }) {
  const [html, setHtml] = useState("")

  const highlight = useCallback(async () => {
    try {
      const highlighter = await getHighlighter()
      const result = highlighter.codeToHtml(code, {
        lang: "tsx",
        theme: "vesper",
      })
      setHtml(result)
    } catch {
      setHtml("")
    }
  }, [code])

  useEffect(() => {
    highlight()
  }, [highlight])

  if (!html) {
    return (
      <pre className="text-[11px] leading-relaxed font-mono text-white/50 overflow-x-auto whitespace-pre-wrap">
        <code>{code}</code>
      </pre>
    )
  }

  return (
    <>
      <style>{`
        .an-shiki .shiki,
        .an-shiki .shiki pre {
          background-color: transparent !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        .an-shiki .shiki code {
          display: inline-block;
          min-width: 100%;
          font-size: 11px;
          line-height: 1.625;
          font-family: var(--font-mono, ui-monospace, monospace);
        }
        .an-shiki .shiki {
          filter: saturate(0) brightness(0.7);
          transition: filter 0.25s ease;
        }
        .an-shiki:hover .shiki {
          filter: saturate(1) brightness(1);
        }
      `}</style>
      <div
        className="an-shiki overflow-x-auto whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  )
}

/* ── Data ── */

const showcaseComponents = [
  {
    id: "agent-chat",
    name: "<AgentChat />",
    tagline: "Full chat experience with streaming, history, and session control.",
    code: `import { AgentChat } from "@21st-sdk/react"

<AgentChat
  agent="travel-assistant"
  userId={user.id}
  tools={[searchFlights, fetchReviews]}
/>`,
  },
  {
    id: "tool-execution",
    name: "<ToolExecution />",
    tagline: "Live tool call trace: inputs, outputs, timing, and status.",
    code: `import { ToolExecution } from "@21st-sdk/react"

<ToolExecution
  tools={[queryEvents, buildFunnel]}
  sandbox={{ timeout: 30_000 }}
  onResult={(r) => console.log(r)}
/>`,
  },
  {
    id: "usage-meter",
    name: "<UsageMeter />",
    tagline: "Per-user consumption gauge with plan limits and upgrade prompt.",
    code: `import { UsageMeter } from "@21st-sdk/react"

<UsageMeter
  userId={user.id}
  plan={user.plan}
  showUpgrade={true}
/>`,
  },
] as const

type ChatStyle = "cursor" | "notion" | "perplexity" | "custom"

const chatStyles = [
  { id: "notion" as const, label: "Notion AI", disabled: false, soon: false },
  { id: "cursor" as const, label: "Cursor", disabled: false, soon: false },
  { id: "perplexity" as const, label: "Perplexity", disabled: true, soon: true },
  { id: "custom" as const, label: "Custom", disabled: false, soon: false },
]

/* ── Accordion item ── */

type ShowcaseId = (typeof showcaseComponents)[number]["id"]

function AccordionItem({
  item,
  isActive,
  onSelect,
  index,
}: {
  item: (typeof showcaseComponents)[number]
  isActive: boolean
  onSelect: () => void
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: 0.06 + index * 0.08 }}
      className={`transition-colors duration-200 ${
        isActive ? "bg-muted" : "hover:bg-white/[0.01]"
      }`}
    >
      <button
        onClick={onSelect}
        className="w-full text-left px-4 py-5 flex items-start gap-4"
      >
        {/* Index pill */}
        <span className="shrink-0 mt-0.5 w-5 h-5 rounded-md border border-white/[0.08] bg-muted flex items-center justify-center text-[9px] font-mono text-white/30">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span
              className={`font-mono text-[13px] font-medium transition-colors duration-150 ${
                isActive ? "text-white/90" : "text-white/40"
              }`}
            >
              {item.name}
            </span>
            {/* Chevron */}
            <motion.svg
              animate={{ rotate: isActive ? 90 : 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className="shrink-0 text-white/20"
            >
              <path
                d="M4.5 3L7.5 6L4.5 9"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </div>

          <p
            className={`text-[12px] leading-relaxed mt-0.5 transition-colors duration-150 ${
              isActive ? "text-white/35" : "text-white/20"
            }`}
          >
            {item.tagline}
          </p>

          {/* Code block - visible on hover or active */}
          <AnimatePresence initial={false}>
            {isActive && (
              <motion.div
                key="code"
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden"
              >
                <div className="rounded-lg border border-white/[0.06] bg-muted px-4 py-4">
                  <HighlightedCode code={item.code} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </button>
    </motion.div>
  )
}

/* ── Main showcase section ── */

export function AnComponentShowcase() {
  const [activeId, setActiveId] = useState<ShowcaseId>("agent-chat")
  const [chatStyle, setChatStyle] = useState<ChatStyle>("notion")
  const previewRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(previewRef, { once: false, amount: 0.3 })

  const activeIndex = showcaseComponents.findIndex((c) => c.id === activeId)

  return (
    <section className="px-8 py-20 sm:py-28">
      <SectionHeader
        overline="Drop-in components"
        heading="Pixel-perfect agent UI, embedded in minutes."
        maxHeadingWidth="30ch"
        subtext="Pre-built React components for every layer of the agent experience. Drop in, style to your brand, ship."
      />

      <div className="mt-16">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-10 items-stretch">
        {/* ── Left: style selector + accordion ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.04 }}
        >
          {/* Style selector — above the accordion */}
          <AnimatePresence>
            {activeId !== "usage-meter" && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-white/20 uppercase tracking-widest">
                    Style
                  </span>
                  <div className="relative flex items-center gap-1 rounded-lg border border-white/[0.06] bg-muted p-0.5">
                    {chatStyles.map((s) => (
                      <button
                        key={s.id}
                        disabled={s.disabled}
                        onClick={() => !s.disabled && setChatStyle(s.id)}
                        className={`relative text-[12px] font-medium px-3 py-1.5 rounded-md transition-colors duration-200 flex items-center gap-1.5 ${
                          chatStyle === s.id
                            ? "text-white/90"
                            : s.disabled
                              ? "text-white/15 cursor-not-allowed"
                              : "text-white/35 hover:text-white/60"
                        }`}
                      >
                        {chatStyle === s.id && (
                          <motion.div
                            layoutId="chat-style-indicator"
                            className="absolute inset-0 bg-white/[0.08] rounded-md shadow-sm"
                            transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                          />
                        )}
                        <span className="relative z-10">{s.label}</span>
                        {s.soon && (
                          <span className="relative z-10 text-[9px] uppercase tracking-wider text-white/20 bg-muted px-1.5 py-0.5 rounded-full">
                            soon
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="divide-y divide-white/[0.06] border-t border-b border-white/[0.06]">
            {showcaseComponents.map((item, index) => (
              <AccordionItem
                key={item.id}
                item={item}
                index={index}
                isActive={activeId === item.id}
                onSelect={() => setActiveId(item.id)}
              />
            ))}
          </div>
        </motion.div>

        {/* ── Right: live component preview ── */}
        <motion.div
          ref={previewRef}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.12 }}
          className="flex flex-col"
        >
          <DashedBox className="overflow-hidden flex-1 min-h-0 flex flex-col">
            {/* Subtle top gradient accent keyed to active component */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeId + "-glow"}
                className={`absolute top-0 left-0 right-0 h-px ${
                  activeIndex === 0
                    ? "bg-[radial-gradient(ellipse_at_center,rgba(52,211,153,0.5)_0%,transparent_70%)]"
                    : activeIndex === 1
                      ? "bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.45)_0%,transparent_70%)]"
                      : "bg-[radial-gradient(ellipse_at_center,rgba(167,139,250,0.45)_0%,transparent_70%)]"
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              />
            </AnimatePresence>

            {/* Component label strip */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.06]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeId + "-dot"}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`w-1.5 h-1.5 rounded-full ${
                    activeIndex === 0
                      ? "bg-emerald-400/80"
                      : activeIndex === 1
                        ? "bg-amber-400/80"
                        : "bg-violet-400/80"
                  }`}
                />
              </AnimatePresence>
              <span className="text-[10px] font-mono text-white/20 tracking-widest uppercase">
                Preview
              </span>
              <span className="ml-auto text-[10px] font-mono text-white/20">
                {showcaseComponents[activeIndex]?.name}
              </span>
            </div>

            {/* Preview area with crossfade */}
            <div className="relative flex-1 min-h-0 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeId + "-" + chatStyle}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute inset-0 flex flex-col"
                >
                  {activeId === "agent-chat" && <PreviewAgentChat style={chatStyle} paused={!isInView} />}
                  {activeId === "tool-execution" && <PreviewToolExecution style={chatStyle} paused={!isInView} />}
                  {activeId === "usage-meter" && <PreviewUsageMeter />}
                </motion.div>
              </AnimatePresence>
            </div>
          </DashedBox>
        </motion.div>
      </div>
      </div>
    </section>
  )
}
