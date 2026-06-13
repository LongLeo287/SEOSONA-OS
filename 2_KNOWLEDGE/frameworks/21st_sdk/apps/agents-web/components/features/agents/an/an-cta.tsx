"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Logo } from "@/components/features/agents/ui/canvas/[id]/{components}/ui/logo"
import {
  DashedBox,
} from "@/components/features/agents/landing/dashed-divider"
import { motion, AnimatePresence, useInView } from "motion/react"
import { AnEarlyAccessDialog } from "./an-early-access-dialog"

/* ─── Grid constants ─── */
const S = 12 // step (cell + gap)
const C = 10 // cell size

type Pixel = { x: number; y: number }

/* Each logo variant is a set of pixel coordinates on a grid */
const LOGOS: { name: string; pixels: Pixel[]; color: string }[] = [
  {
    // Pixel "A"
    name: "a",
    color: "#6B6B6C",
    pixels: [
      { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 },
      { x: 0, y: 1 }, { x: 4, y: 1 },
      { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 },
      { x: 0, y: 3 }, { x: 4, y: 3 },
      { x: 0, y: 4 }, { x: 4, y: 4 },
    ],
  },
  {
    // Pixel "N"
    name: "n",
    color: "#9D9D9E",
    pixels: [
      { x: 0, y: 0 }, { x: 4, y: 0 },
      { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 4, y: 1 },
      { x: 0, y: 2 }, { x: 2, y: 2 }, { x: 4, y: 2 },
      { x: 0, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 },
      { x: 0, y: 4 }, { x: 4, y: 4 },
    ],
  },
  {
    // Diamond / rhombus
    name: "diamond",
    color: "#D10029",
    pixels: [
      { x: 2, y: 0 },
      { x: 1, y: 1 }, { x: 3, y: 1 },
      { x: 0, y: 2 }, { x: 4, y: 2 },
      { x: 1, y: 3 }, { x: 3, y: 3 },
      { x: 2, y: 4 },
    ],
  },
  {
    // Cross / plus
    name: "cross",
    color: "#007ACC",
    pixels: [
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 },
      { x: 2, y: 3 },
      { x: 2, y: 4 },
    ],
  },
  {
    // Arrow up / chevron
    name: "arrow",
    color: "#41B883",
    pixels: [
      { x: 2, y: 0 },
      { x: 1, y: 1 }, { x: 3, y: 1 },
      { x: 0, y: 2 }, { x: 2, y: 2 }, { x: 4, y: 2 },
      { x: 2, y: 3 },
      { x: 2, y: 4 },
    ],
  },
  {
    // Block / square frame
    name: "frame",
    color: "#BD34FE",
    pixels: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 },
      { x: 0, y: 1 }, { x: 4, y: 1 },
      { x: 0, y: 2 }, { x: 4, y: 2 },
      { x: 0, y: 3 }, { x: 4, y: 3 },
      { x: 0, y: 4 }, { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 },
    ],
  },
  {
    // Lightning bolt
    name: "bolt",
    color: "#F6DE19",
    pixels: [
      { x: 2, y: 0 }, { x: 3, y: 0 },
      { x: 1, y: 1 }, { x: 2, y: 1 },
      { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 },
      { x: 2, y: 3 }, { x: 3, y: 3 },
      { x: 1, y: 4 }, { x: 2, y: 4 },
    ],
  },
  {
    // Asterisk / star burst
    name: "star",
    color: "#FF3E00",
    pixels: [
      { x: 2, y: 0 },
      { x: 0, y: 1 }, { x: 2, y: 1 }, { x: 4, y: 1 },
      { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 },
      { x: 0, y: 3 }, { x: 2, y: 3 }, { x: 4, y: 3 },
      { x: 2, y: 4 },
    ],
  },
  {
    // Pixel heart
    name: "heart",
    color: "#FF0066",
    pixels: [
      { x: 1, y: 0 }, { x: 3, y: 0 },
      { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 },
      { x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 },
      { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 },
      { x: 2, y: 4 },
    ],
  },
  {
    // Spiral / @ shape
    name: "spiral",
    color: "#00DC82",
    pixels: [
      { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 },
      { x: 0, y: 1 }, { x: 4, y: 1 },
      { x: 0, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 },
      { x: 0, y: 3 },
      { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 },
    ],
  },
]

const VB = 5 * S - (S - C) // 58 — fixed viewBox for 5×5 grid

function AnLogoMark({
  className = "",
  logoIndex,
  onExitComplete,
}: {
  className?: string
  logoIndex: number
  onExitComplete?: () => void
}) {
  // Two-phase: `displayed` is the logo currently rendered.
  // When `logoIndex` changes we first set `show` to false to trigger exit,
  // then in onExitComplete we swap to the new logo and re-enter.
  const [displayed, setDisplayed] = useState(logoIndex)
  const [show, setShow] = useState(true)

  useEffect(() => {
    if (logoIndex !== displayed) {
      // Trigger exit animation
      setShow(false)
    }
  }, [logoIndex, displayed])

  const handleExitComplete = useCallback(() => {
    // Exit finished — swap to the new logo and enter
    setDisplayed(logoIndex)
    setShow(true)
    onExitComplete?.()
  }, [logoIndex, onExitComplete])

  const logo = LOGOS[displayed % LOGOS.length]!

  return (
    <svg
      viewBox={`0 0 ${VB} ${VB}`}
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <filter id="an-glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
        {show &&
          logo.pixels.map((p, i) => (
            <motion.rect
              key={`${displayed}-${i}`}
              x={p.x * S}
              y={p.y * S}
              width={C}
              height={C}
              fill={logo.color}
              filter="url(#an-glow)"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                duration: 0.25,
                delay: i * 0.02,
                ease: "easeOut",
              }}
            />
          ))}
      </AnimatePresence>
    </svg>
  )
}

export function AnCTA() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [logoIndex, setLogoIndex] = useState(0)
  const [displayedName, setDisplayedName] = useState(LOGOS[0]!.name)
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 })

  const cycleLogo = useCallback(() => {
    setLogoIndex((prev) => (prev + 1) % LOGOS.length)
  }, [])

  const handleSwap = useCallback(() => {
    // Called when exit finishes and the new logo is about to enter
    setDisplayedName(LOGOS[logoIndex % LOGOS.length]!.name)
  }, [logoIndex])

  useEffect(() => {
    if (!isInView) return
    const id = setInterval(cycleLogo, 4000)
    return () => clearInterval(id)
  }, [cycleLogo, isInView])

  return (
    <section ref={sectionRef} className="px-8 py-20 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
      >
        <DashedBox className="overflow-hidden">
          <div className="relative flex flex-col lg:flex-row lg:items-stretch min-h-[260px]">

            {/* ── Left: copy + buttons ── */}
            <div className="relative z-10 flex flex-col justify-center px-8 py-10 lg:py-14 flex-1 min-w-0">

              {/* Overline */}
              <p className="text-xs font-medium uppercase tracking-widest text-white/30 mb-6">
                Early access
              </p>

              <h2 className="font-pixel text-[clamp(1.4rem,3.5vw,2rem)] leading-[1.15] tracking-wide text-white max-w-[22ch]">
                Your users want agents. Ship them this&nbsp;week.
              </h2>

              <p className="mt-4 text-[16px] text-white/40 max-w-[38ch] leading-relaxed">
                We&apos;re working directly with founding teams. Tell us what
                you&apos;re building - we&apos;ll make it work.
              </p>

              {/* Trust signal */}
              <p className="mt-5 text-[12px] text-white/20 font-mono">
                No commitment. No credit card. Just a conversation.
              </p>

              {/* Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setDialogOpen(true)}
                  className="inline-flex items-center justify-center rounded-[10px] h-8 px-5 text-sm font-medium bg-white text-[#09090b] hover:bg-white/90 shadow-[0_0_0_0.5px_rgba(255,255,255,0.5),inset_0_0_0_1px_rgba(255,255,255,0.14)] active:scale-[0.99] transition-all duration-150"
                >
                  Get early access
                </button>
                <a
                  href="mailto:founders@21st.dev?subject=An - talk"
                  className="inline-flex items-center justify-center rounded-[10px] h-8 px-4 text-sm font-medium bg-white/5 backdrop-blur-sm border border-white/[0.08] text-white/60 hover:bg-white/10 hover:text-white active:scale-[0.99] transition-all duration-150"
                >
                  Talk to the founders
                </a>
              </div>

              {/* YC + 21st badge row */}
              <div className="mt-8 flex items-center gap-2 text-white/25">
                <svg className="w-3.5 h-3.5 text-white/40" viewBox="0 0 256 256" fill="none">
                  <rect width="256" height="256" rx="40" fill="currentColor" />
                  <path d="M119.374 144.746L75.433 62.432h20.081l25.848 52.092c.398.928.862 1.889 1.392 2.883.53.994.994 2.022 1.391 3.082.266.398.464.762.597 1.094.133.33.265.63.398.894a65.643 65.643 0 0 1 1.79 3.877c.53 1.26.993 2.42 1.39 3.48 1.061-2.254 2.221-4.673 3.48-7.257 1.26-2.585 2.552-5.27 3.877-8.053l26.246-52.092h18.69l-44.34 83.308v53.087h-16.9v-54.081z" fill="#09090b" />
                </svg>
                <span className="text-[11px]">Backed by Y Combinator</span>
                <span className="text-white/15 mx-1">·</span>
                <Logo className="w-3 h-3" fill="rgba(255,255,255,0.4)" />
                <span className="text-[11px]">By 21st.dev</span>
              </div>
            </div>

            {/* ── Right: decorative panel (desktop only) ── */}
            <div
              className="relative hidden lg:flex items-center justify-center shrink-0 w-[280px] border-l border-white/[0.06] overflow-hidden cursor-pointer select-none active:scale-[0.97] transition-transform duration-150"
              onClick={cycleLogo}
            >
              {/* Pixel logo mark */}
              <AnLogoMark className="relative z-10 w-[72px] h-[72px]" logoIndex={logoIndex} onExitComplete={handleSwap} />

              {/* Floating feature micro-tags */}
              <div className="absolute top-8 left-5 flex flex-col gap-2 text-[10px] font-mono text-white/20">
                <span>sessions ✓</span>
                <span>billing ✓</span>
                <span>ui ✓</span>
              </div>
              <div className="absolute bottom-8 right-5 flex flex-col gap-2 text-[10px] font-mono text-white/20 text-right">
                <span>traces ✓</span>
                <span>limits ✓</span>
                <span>sdk ✓</span>
              </div>

              {/* Logo variant name */}
              <span className="absolute bottom-2.5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-white/15 tracking-wider">
                {displayedName}
              </span>
            </div>

          </div>
        </DashedBox>
      </motion.div>

      <AnEarlyAccessDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </section>
  )
}
