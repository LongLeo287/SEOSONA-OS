"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"
import type { AppType } from "./chat-preview/types"

/* ═══════════════════════════════════════════════════════════════════════
   Strategy C — "Terminal install strip"
   A compact terminal chrome above the existing chat preview (children).
   Shows install + usage flow, reacts to chatStyle/appType changes.
   ═══════════════════════════════════════════════════════════════════════ */

/* ── Types ── */

type TerminalLine = {
  id: number
  type: "command" | "output"
  text: string
  color: "prompt" | "white" | "muted" | "success" | "error"
}

/* ── Constants ── */

const TYPING_SPEED = 65
const TYPING_JITTER = 0.5

/* ── Interactive commands ── */

type CmdHandler = (args: string) => { lines: { text: string; color: TerminalLine["color"] }[] }

const COMMANDS: Record<string, CmdHandler> = {
  help: () => ({
    lines: [
      { text: "Available commands:", color: "white" },
      { text: "  an status          Show server status", color: "muted" },
      { text: "  an preset list     List available presets", color: "muted" },
      { text: "  an preset apply <name>", color: "muted" },
      { text: "  an config --style <style>", color: "muted" },
      { text: "  an tools list      Show enabled tools", color: "muted" },
      { text: "  an agent info      Show active agent", color: "muted" },
      { text: "  clear              Clear terminal", color: "muted" },
    ],
  }),
  "an status": () => ({
    lines: [
      { text: "\u2713 Server running on localhost:3000", color: "success" },
      { text: "  uptime: 3m 42s", color: "muted" },
      { text: "  requests: 127", color: "muted" },
      { text: "  active sessions: 1", color: "muted" },
    ],
  }),
  "an preset list": () => ({
    lines: [
      { text: "Available presets:", color: "white" },
      { text: "  support    Customer support agent with KB & escalation", color: "muted" },
      { text: "  code       Code assistant with file-edit & terminal", color: "muted" },
      { text: "  research   Research agent with web-search & citations", color: "muted" },
    ],
  }),
  "an tools list": () => ({
    lines: [
      { text: "Enabled tools:", color: "white" },
      { text: "  \u2713 knowledge-base    active", color: "success" },
      { text: "  \u2713 ticket-lookup     active", color: "success" },
      { text: "  \u2713 escalation        active", color: "success" },
      { text: "  \u2013 web-search        disabled", color: "muted" },
      { text: "  \u2013 file-edit         disabled", color: "muted" },
    ],
  }),
  "an agent info": () => ({
    lines: [
      { text: "Active agent: claude-code", color: "white" },
      { text: "  model: claude-sonnet-4-6", color: "muted" },
      { text: "  max tokens: 8192", color: "muted" },
      { text: "  temperature: 0.7", color: "muted" },
    ],
  }),
}

/* ── Preset configs ── */

const PRESET_CONFIGS: Record<AppType, { command: string; outputLines: { text: string; color: TerminalLine["color"] }[] }> = {
  support: {
    command: "an preset apply support",
    outputLines: [
      { text: "  \u2713 agent: claude-code", color: "success" },
      { text: "  \u2713 tools: knowledge-base, ticket-lookup, escalation", color: "success" },
      { text: "  \u2713 context: customer-history", color: "success" },
      { text: "Ready \u2014 watching for changes...", color: "muted" },
    ],
  },
  code: {
    command: "an preset apply code",
    outputLines: [
      { text: "  \u2713 agent: codex", color: "success" },
      { text: "  \u2713 tools: file-edit, terminal, search, lint", color: "success" },
      { text: "  \u2713 context: repo-index", color: "success" },
      { text: "Ready \u2014 watching for changes...", color: "muted" },
    ],
  },
  research: {
    command: "an preset apply research",
    outputLines: [
      { text: "  \u2713 agent: claude-code", color: "success" },
      { text: "  \u2713 tools: web-search, pdf-reader, citations", color: "success" },
      { text: "  \u2713 context: document-store", color: "success" },
      { text: "Ready \u2014 watching for changes...", color: "muted" },
    ],
  },
}

const PRESET_TABS: { id: AppType; label: string }[] = [
  { id: "support", label: "Support" },
  { id: "code", label: "Code" },
  { id: "research", label: "Research" },
]

/* ── Boot sequence ── */

const BOOT_SEQUENCE: { type: "command" | "output"; text: string; color: TerminalLine["color"]; speed?: number; delay?: number }[] = [
  { type: "command", text: "npm install @21st/an", color: "white", speed: 65, delay: 1000 },
  { type: "output", text: "\u2713 added 3 packages in 1.2s", color: "success", delay: 1200 },
  { type: "command", text: 'npx an dev --agent claude-code --style notion', color: "white", speed: 55, delay: 800 },
]

/* ── Typing hook ── */

function useTypingEffect(
  text: string,
  isActive: boolean,
  speed: number,
  onComplete?: () => void,
) {
  const [displayed, setDisplayed] = useState("")
  const completedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    if (!isActive) {
      setDisplayed("")
      completedRef.current = false
      return
    }

    let index = 0
    let cancelled = false
    completedRef.current = false
    setDisplayed("")

    const tick = () => {
      if (cancelled) return
      if (index < text.length) {
        index++
        setDisplayed(text.slice(0, index))
        const jitter = speed * TYPING_JITTER
        const delay = speed + (Math.random() * jitter * 2 - jitter)
        const extra = text[index - 1] === " " ? speed * 0.25 : 0
        setTimeout(tick, delay + extra)
      } else if (!completedRef.current) {
        completedRef.current = true
        onCompleteRef.current?.()
      }
    }

    const startTimer = setTimeout(tick, speed * 0.4)
    return () => {
      cancelled = true
      clearTimeout(startTimer)
    }
  }, [text, isActive, speed])

  return displayed
}

/* ── Terminal Prompt ── */

function TerminalPrompt() {
  return (
    <span className="text-emerald-400/80 select-none whitespace-pre">$ </span>
  )
}

/* ── Typed Command Line (actively typing) ── */

function TypedCommandLine({
  text,
  speed,
  onComplete,
}: {
  text: string
  speed: number
  onComplete: () => void
}) {
  const typed = useTypingEffect(text, true, speed, onComplete)
  const isComplete = typed.length === text.length

  return (
    <div className="font-mono text-[11px] leading-[1.7] flex items-center whitespace-nowrap">
      <TerminalPrompt />
      <span className="text-white/90">{typed}</span>
      {!isComplete && (
        <span className="inline-block w-[6px] h-[13px] bg-white/70 ml-[1px] animate-pulse" />
      )}
    </div>
  )
}

/* ── Static rendered line ── */

function RenderedLine({ line }: { line: TerminalLine }) {
  const colorMap: Record<TerminalLine["color"], string> = {
    prompt: "text-emerald-400/80",
    white: "text-white/90",
    muted: "text-white/35",
    success: "text-emerald-400/80",
    error: "text-red-400/70",
  }

  if (line.type === "command") {
    return (
      <div className="font-mono text-[11px] leading-[1.7] flex whitespace-nowrap">
        <TerminalPrompt />
        <span className="text-white/90">{line.text}</span>
      </div>
    )
  }

  return (
    <div className={`font-mono text-[11px] leading-[1.7] whitespace-nowrap ${colorMap[line.color]}`}>
      {line.text}
    </div>
  )
}

/* ── Terminal Title Bar (macOS chrome) ── */

function TerminalTitleBar({
  appType,
  onPresetClick,
}: {
  appType: AppType
  onPresetClick: (id: AppType) => void
}) {
  return (
    <div className="shrink-0">
      <div className="flex items-center gap-2 px-3 py-[7px] border-b border-white/[0.06] bg-white/[0.02]">
        <div className="flex items-center gap-[6px]">
          <span className="w-2 h-2 rounded-full bg-[#FF5F57]/80" />
          <span className="w-2 h-2 rounded-full bg-[#FEBC2E]/80" />
          <span className="w-2 h-2 rounded-full bg-[#28C840]/80" />
        </div>
        <span className="text-[10px] font-mono text-white/25 ml-1.5 select-none">
          Terminal &mdash; zsh
        </span>
        {/* Preset tabs — right-aligned */}
        <div className="ml-auto flex items-center gap-0.5">
          {PRESET_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onPresetClick(tab.id)}
              className={`text-[9px] font-mono px-2 py-0.5 rounded transition-colors duration-150 ${
                appType === tab.id
                  ? "text-white/70 bg-white/[0.08]"
                  : "text-white/25 hover:text-white/40 hover:bg-white/[0.04]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Chat skeleton (shown while booting) ── */

function ChatSkeleton() {
  return (
    <div className="px-4 py-4 space-y-3 opacity-[0.35]">
      {/* User message skeleton */}
      <div className="flex justify-end">
        <div className="rounded-xl bg-white/[0.06] px-3 py-2 max-w-[70%]">
          <div className="h-2.5 w-32 rounded-full bg-white/[0.08] animate-pulse" />
        </div>
      </div>
      {/* Assistant message skeleton */}
      <div className="flex justify-start gap-2">
        <div className="w-5 h-5 rounded-full bg-white/[0.06] shrink-0 mt-0.5 animate-pulse" />
        <div className="space-y-1.5 flex-1 max-w-[80%]">
          <div className="h-2.5 w-full rounded-full bg-white/[0.06] animate-pulse" />
          <div className="h-2.5 w-3/4 rounded-full bg-white/[0.06] animate-pulse" />
          <div className="h-2.5 w-1/2 rounded-full bg-white/[0.06] animate-pulse" />
        </div>
      </div>
      {/* Input bar skeleton */}
      <div className="mt-4 rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2.5 flex items-center gap-2">
        <div className="h-2.5 flex-1 rounded-full bg-white/[0.04] animate-pulse" />
        <div className="w-6 h-6 rounded-md bg-white/[0.04] animate-pulse" />
      </div>
    </div>
  )
}

/* ── Connector strip: localhost:3000 ── */

function ConnectorStrip({ isRunning }: { isRunning: boolean }) {
  return (
    <div className="relative flex items-center h-8 px-3 bg-[#0c0c0f] border-t border-b border-white/[0.04] overflow-hidden">
      {/* Dashed horizontal line */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <line
          x1="0"
          y1="50%"
          x2="100%"
          y2="50%"
          stroke="rgba(255,255,255,0.06)"
          strokeDasharray="4 5"
          strokeLinecap="round"
        />
      </svg>

      {/* Label */}
      <div className="relative flex items-center gap-1.5 mx-auto">
        {isRunning ? (
          <motion.span
            className="w-[5px] h-[5px] rounded-full bg-emerald-400/70"
            animate={{
              boxShadow: [
                "0 0 0px rgba(52,211,153,0)",
                "0 0 6px rgba(52,211,153,0.5)",
                "0 0 0px rgba(52,211,153,0)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : (
          <span className="w-[5px] h-[5px] rounded-full bg-white/15" />
        )}
        <span className="font-mono text-[9px] text-white/30 select-none">
          {isRunning ? (
            <>
              <span className="text-white/20">{"\u2193"}</span>{" "}
              localhost:3000
            </>
          ) : (
            "starting..."
          )}
        </span>
      </div>

    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════════════════════════ */

export function HeroRightStrategyC({
  children,
  chatStyle,
  appType,
  setAppType,
  onBootComplete,
}: {
  children: React.ReactNode
  chatStyle: string
  appType: AppType
  setAppType: (v: AppType) => void
  onBootComplete?: () => void
}) {
  const [lines, setLines] = useState<TerminalLine[]>([])
  const [typingLine, setTypingLine] = useState<{ text: string; speed: number } | null>(null)
  const [isServerRunning, setIsServerRunning] = useState(false)
  const [bootComplete, setBootComplete] = useState(false)
  // 0 = booting, 1 = space opened (terminal slides down), 2 = chat visible
  const [revealPhase, setRevealPhase] = useState<0 | 1 | 2>(0)

  const lineIdRef = useRef(0)
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const terminalBodyRef = useRef<HTMLDivElement>(null)
  const prevChatStyleRef = useRef(chatStyle)
  const prevAppTypeRef = useRef(appType)
  const isBootingRef = useRef(false)

  const nextId = useCallback(() => {
    lineIdRef.current += 1
    return lineIdRef.current
  }, [])

  const schedule = useCallback((fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms)
    timeoutsRef.current.push(t)
    return t
  }, [])

  // Auto-scroll terminal to bottom
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight
    }
  }, [lines, typingLine])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout)
    }
  }, [])

  /* ── Add a completed line to the list ── */
  const addLine = useCallback(
    (type: TerminalLine["type"], text: string, color: TerminalLine["color"]) => {
      setLines((prev) => {
        const next = [...prev, { id: nextId(), type, text, color }]
        // Keep only the last N lines for visibility
        if (next.length > 20) return next.slice(-20)
        return next
      })
    },
    [nextId],
  )

  /* ── Boot sequence ── */
  useEffect(() => {
    if (isBootingRef.current) return
    isBootingRef.current = true

    let stepIndex = 0

    const processStep = () => {
      if (stepIndex >= BOOT_SEQUENCE.length) {
        // Boot done -> phase 1: open space, terminal slides down
        schedule(() => {
          setIsServerRunning(true)
          setBootComplete(true)
          setRevealPhase(1)
          // Phase 2: show chat UI after space has opened
          schedule(() => {
            setRevealPhase(2)
            onBootComplete?.()
          }, 700)
        }, 800)
        return
      }

      const step = BOOT_SEQUENCE[stepIndex]!
      const delay = step.delay || 300

      schedule(() => {
        if (step.type === "command") {
          // Show as typing
          setTypingLine({ text: step.text, speed: step.speed || TYPING_SPEED })
        } else {
          // Output line — show instantly
          addLine("output", step.text, step.color)
          stepIndex++
          processStep()
        }
      }, delay)
    }

    // Typing complete handler is called via the onTypingComplete callback
    // We store the step processor so onTypingComplete can advance it
    typingCompleteHandlerRef.current = () => {
      const step = BOOT_SEQUENCE[stepIndex]!
      addLine("command", step.text, step.color)
      setTypingLine(null)
      stepIndex++

      // Process the next step (which might be an output line that follows immediately)
      const nextStep = BOOT_SEQUENCE[stepIndex]
      if (nextStep && nextStep.type === "output") {
        schedule(() => {
          addLine("output", nextStep.text, nextStep.color)
          stepIndex++
          processStep()
        }, nextStep.delay || 300)
      } else {
        processStep()
      }
    }

    processStep()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const typingCompleteHandlerRef = useRef<() => void>(() => {})

  const handleTypingComplete = useCallback(() => {
    typingCompleteHandlerRef.current()
  }, [])

  /* ── React to chatStyle changes (no server restart — preview stays visible) ── */
  useEffect(() => {
    if (!bootComplete) return
    if (prevChatStyleRef.current === chatStyle) return
    prevChatStyleRef.current = chatStyle

    const cmd = `an config --style ${chatStyle}`
    setTypingLine({ text: cmd, speed: 55 })

    typingCompleteHandlerRef.current = () => {
      addLine("command", cmd, "white")
      setTypingLine(null)
      schedule(() => {
        addLine("output", `\u2713 Applied style: ${chatStyle}`, "success")
      }, 200)
    }
  }, [chatStyle, bootComplete, addLine, schedule])

  /* ── React to appType changes (rich preset output, no server restart) ── */
  useEffect(() => {
    if (!bootComplete) return
    if (prevAppTypeRef.current === appType) return
    prevAppTypeRef.current = appType

    const preset = PRESET_CONFIGS[appType]
    if (!preset) return

    setTypingLine({ text: preset.command, speed: 55 })

    typingCompleteHandlerRef.current = () => {
      addLine("command", preset.command, "white")
      setTypingLine(null)

      // Stagger output lines
      preset.outputLines.forEach((ol, i) => {
        schedule(() => {
          addLine("output", ol.text, ol.color)
        }, 300 + i * 200)
      })
    }
  }, [appType, bootComplete, addLine, schedule])

  /* ── Handle preset tab click ── */
  const handlePresetClick = useCallback((presetId: AppType) => {
    if (presetId === appType) return
    setAppType(presetId)
  }, [appType, setAppType])

  /* ── Interactive input ── */
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const isIdle = !typingLine && bootComplete

  const executeCommand = useCallback((raw: string) => {
    const cmd = raw.trim()
    if (!cmd) return

    addLine("command", cmd, "white")

    if (cmd === "clear") {
      setLines([])
      return
    }

    // Check for preset apply
    const presetMatch = cmd.match(/^an preset apply (\w+)$/)
    if (presetMatch) {
      const presetId = presetMatch[1] as string
      if (presetId in PRESET_CONFIGS) {
        setAppType(presetId as AppType)
        // The appType effect will handle output lines
        return
      }
      addLine("output", `Unknown preset: ${presetId}. Try: support, code, research`, "error")
      return
    }

    // Check for style config
    const styleMatch = cmd.match(/^an config --style (\w+)$/)
    if (styleMatch) {
      // Style changes are handled by the parent — just show feedback
      addLine("output", `\u2713 Applied style: ${styleMatch[1]}`, "success")
      return
    }

    // Lookup known commands
    const handler = COMMANDS[cmd]
    if (handler) {
      const result = handler("")
      result.lines.forEach((ol, i) => {
        schedule(() => {
          addLine("output", ol.text, ol.color)
        }, 150 + i * 100)
      })
      return
    }

    // Unknown command
    addLine("output", `command not found: ${cmd}. Type "help" for available commands.`, "error")
  }, [addLine, schedule, setAppType])

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      executeCommand(inputValue)
      setInputValue("")
    }
  }, [inputValue, executeCommand])

  // Focus input when clicking terminal body
  const handleTerminalClick = useCallback(() => {
    if (isIdle && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isIdle])

  /* ── Visible lines ── */
  const visibleLines = lines

  // Phase 0: terminal full screen, centered
  // Phase 1: space opens above (terminal stays same size, slides down), empty placeholder visible
  // Phase 2: chat fades in inside the space, connector + title bar appear

  const spaceOpen = revealPhase >= 1  // space above terminal exists
  const chatVisible = revealPhase >= 2 // chat UI rendered & visible

  return (
    <div className="flex flex-col justify-center h-full min-h-0">
      {/* ── Chat + connector — grows from 0, pushing terminal down naturally ── */}
      <div
        className="min-h-0 flex flex-col overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          flex: spaceOpen ? "1 1 0%" : "0 0 0px",
        }}
      >
        {/* Chat content — fades in phase 2 */}
        <div
          className="flex-1 min-h-0 flex flex-col transition-opacity duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ opacity: chatVisible ? 1 : 0 }}
        >
          {spaceOpen && children}
        </div>

        {/* Connector strip — inside chat area, fades in phase 2 */}
        <div
          className="shrink-0 transition-opacity duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ opacity: chatVisible ? 1 : 0 }}
        >
          <ConnectorStrip isRunning={isServerRunning} />
        </div>
      </div>

      {/* ── Terminal — fixed size, stays centered until chat pushes it ── */}
      <div
        className="shrink-0 overflow-hidden flex flex-col rounded-lg border border-white/[0.06]"
        style={{ backgroundColor: "#0c0c0f" }}
      >
        {/* Title bar — height animates from 0, fades in phase 2 */}
        <div
          className="shrink-0 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden"
          style={{
            maxHeight: chatVisible ? 40 : 0,
            opacity: chatVisible ? 1 : 0,
          }}
        >
          <TerminalTitleBar appType={appType} onPresetClick={handlePresetClick} />
        </div>

        {/* Terminal body — always 140px */}
        <div
          ref={terminalBodyRef}
          className="px-3 py-2.5 overflow-y-auto scrollbar-none cursor-text"
          style={{ height: 140 }}
          onClick={handleTerminalClick}
        >
          {visibleLines.map((line) => (
            <RenderedLine key={line.id} line={line} />
          ))}

          {typingLine && (
            <TypedCommandLine
              key={`typing-${typingLine.text}`}
              text={typingLine.text}
              speed={typingLine.speed}
              onComplete={handleTypingComplete}
            />
          )}

          {isIdle && (
            <div className="font-mono text-[11px] leading-[1.7] flex items-center">
              <TerminalPrompt />
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleInputKeyDown}
                className="flex-1 bg-transparent text-white/90 outline-none border-none p-0 m-0 font-mono text-[11px] leading-[1.7] caret-white/70 placeholder:text-white/20"
                spellCheck={false}
                autoComplete="off"
                placeholder="type help..."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HeroRightStrategyC
