"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "motion/react"
import { AnEarlyAccessDialog } from "./an-early-access-dialog"


const rotatingWords = ["frontier", "Claude Code", "Codex"]

function RotatingWord() {
  const [index, setIndex] = useState(0)
  const isFirstRender = useRef(true)
  const measuredWidths = useRef<number[]>([])
  const measureRef = useRef<HTMLSpanElement>(null)
  const [width, setWidth] = useState<number | undefined>(undefined)

  // Measure all words once on mount
  const measureAll = useCallback((el: HTMLSpanElement | null) => {
    if (!el || measuredWidths.current.length === rotatingWords.length) return
    measureRef.current = el
    const widths: number[] = []
    for (const word of rotatingWords) {
      el.textContent = word
      widths.push(el.offsetWidth)
    }
    measuredWidths.current = widths
    el.textContent = ""
    setWidth(widths[0])
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % rotatingWords.length
        if (measuredWidths.current.length) {
          setWidth(measuredWidths.current[next])
        }
        return next
      })
    }, 2400)
    isFirstRender.current = false
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* Hidden measurer — same font styles, invisible */}
      <span
        ref={measureAll}
        className="absolute invisible whitespace-nowrap pointer-events-none"
        style={{ font: "inherit", letterSpacing: "inherit" }}
        aria-hidden="true"
      />
      <span
        className="relative inline-flex overflow-hidden align-bottom justify-center"
        style={{
          height: "1.15em",
          width: width !== undefined ? `${width}px` : "auto",
          transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={rotatingWords[index]}
            className="absolute inline-block whitespace-nowrap"
            initial={isFirstRender.current ? false : { y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            {rotatingWords[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </>
  )
}

export function AnHero() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <section className="relative px-8 pt-20 pb-20 sm:pt-28 sm:pb-28 overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute left-1/2 top-0 -translate-x-1/2 pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="w-[600px] h-[400px] rounded-full opacity-[0.08]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255,255,255,0.2) 0%, rgba(99,102,241,0.1) 45%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/5 text-sm text-white/60 mb-8"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="text-white/40">Backed by</span>
          <svg
            className="w-4 h-4 text-white/70"
            viewBox="0 0 256 256"
            fill="none"
          >
            <rect width="256" height="256" rx="40" fill="currentColor" />
            <path
              d="M119.374 144.746L75.433 62.432h20.081l25.848 52.092c.398.928.862 1.889 1.392 2.883.53.994.994 2.022 1.391 3.082.266.398.464.762.597 1.094.133.33.265.63.398.894a65.643 65.643 0 0 1 1.79 3.877c.53 1.26.993 2.42 1.39 3.48 1.061-2.254 2.221-4.673 3.48-7.257 1.26-2.585 2.552-5.27 3.877-8.053l26.246-52.092h18.69l-44.34 83.308v53.087h-16.9v-54.081z"
              fill="#09090b"
            />
          </svg>
          <span>Combinator</span>
          <span className="text-white/[0.15]">·</span>
          <span className="text-white/40">Early access</span>
        </motion.div>

        {/* H1 — two lines, rotating word smoothly changes width */}
        <motion.h1
          className="relative font-pixel text-[clamp(2.5rem,6vw,4rem)] leading-[1.2] tracking-wide text-white text-center"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.04 }}
        >
          <span className="whitespace-nowrap">
            Ship <RotatingWord /> agents
          </span>
          <br />
          inside your product.
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="mt-5 text-[17px] text-white/45 max-w-[52ch] leading-relaxed"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.12 }}
        >
          Sessions, usage limits, sandboxed execution, and agent UI — out of
          the box. Claude Code, Codex, and more. Production-ready in&nbsp;minutes.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="mt-8 flex flex-col sm:flex-row items-center gap-3"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16 }}
        >
          <button
            onClick={() => setDialogOpen(true)}
            className="inline-flex items-center justify-center rounded-[10px] h-9 px-5 text-sm font-medium bg-white text-[#09090b] hover:bg-white/90 shadow-[0_0_0_0.5px_rgba(255,255,255,0.5),inset_0_0_0_1px_rgba(255,255,255,0.14)] active:scale-[0.99] transition-all duration-150"
          >
            Get early access
          </button>
          <a
            href="#how-it-works"
            className="inline-flex items-center justify-center rounded-[10px] h-9 px-5 text-sm font-medium bg-white/5 backdrop-blur-sm border border-white/[0.08] text-white/70 hover:bg-white/10 hover:text-white active:scale-[0.99] transition-all duration-150"
          >
            How it works
          </a>
        </motion.div>
      </div>

      <AnEarlyAccessDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </section>
  )
}
