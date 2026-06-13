"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { agentsHref } from "@/lib/utils/agents-href"

/* ─────────────────────────────────────────────
   Logo variants for an.dev
   Each is a pure SVG mark that works at any size.
   ───────────────────────────────────────────── */

/** Variant A — "Stacked bars" : abstract letter 'a' formed by
 *  two horizontal bars + a vertical stem, evoking a terminal prompt / agent */
function LogoA({ size = 120, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Top bar */}
      <rect x="60" y="60" width="280" height="70" rx="16" fill={color} />
      {/* Bottom bar */}
      <rect x="60" y="170" width="280" height="70" rx="16" fill={color} />
      {/* Vertical right stem — the "n" leg */}
      <rect x="270" y="170" width="70" height="170" rx="16" fill={color} />
      {/* Small square dot — the agent "cursor" */}
      <rect x="60" y="290" width="50" height="50" rx="12" fill={color} opacity="0.5" />
    </svg>
  )
}

/** Variant B — "Rounded A + N" : a monogram where lowercase 'a' and 'n'
 *  merge into a single connected glyph inside a rounded square */
function LogoB({ size = 120, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Container */}
      <rect x="0" y="0" width="400" height="400" rx="80" fill={color} opacity="0.08" />
      {/* 'a' — arch with descender */}
      <path
        d="M80 280V180C80 124.772 124.772 80 180 80H200C255.228 80 280 104.772 280 160V170"
        stroke={color}
        strokeWidth="52"
        strokeLinecap="round"
      />
      {/* 'a' cross bar */}
      <path
        d="M80 210H260"
        stroke={color}
        strokeWidth="52"
        strokeLinecap="round"
      />
      {/* 'n' — right vertical + arch */}
      <path
        d="M260 280V180C260 152 280 120 320 120"
        stroke={color}
        strokeWidth="52"
        strokeLinecap="round"
      />
      <path
        d="M320 120V320"
        stroke={color}
        strokeWidth="52"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Variant C — "Agent Window" : a chat window icon with an 'a' cursor
 *  blinking inside — represents the agent interface */
function LogoC({ size = 120, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Window frame */}
      <rect x="40" y="40" width="320" height="320" rx="48" stroke={color} strokeWidth="36" />
      {/* Title bar dots */}
      <circle cx="105" cy="95" r="14" fill={color} opacity="0.35" />
      <circle cx="155" cy="95" r="14" fill={color} opacity="0.35" />
      <circle cx="205" cy="95" r="14" fill={color} opacity="0.35" />
      {/* Divider */}
      <line x1="58" y1="135" x2="342" y2="135" stroke={color} strokeWidth="4" opacity="0.2" />
      {/* The "an" letterform inside */}
      <text
        x="200"
        y="290"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="700"
        fontSize="160"
        fill={color}
      >
        an
      </text>
    </svg>
  )
}

/** Variant D — "Signal / Pulse" : the letter 'a' with a broadcasting
 *  signal arc — representing the agent always listening/active */
function LogoD({ size = 120, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer signal arc */}
      <path
        d="M310 90C350 130 375 185 375 245"
        stroke={color}
        strokeWidth="28"
        strokeLinecap="round"
        opacity="0.2"
      />
      {/* Inner signal arc */}
      <path
        d="M275 130C305 155 320 195 320 240"
        stroke={color}
        strokeWidth="28"
        strokeLinecap="round"
        opacity="0.4"
      />
      {/* Main 'a' glyph — rounded */}
      <circle cx="160" cy="220" r="90" stroke={color} strokeWidth="44" />
      {/* 'a' stem */}
      <line x1="250" y1="145" x2="250" y2="340" stroke={color} strokeWidth="44" strokeLinecap="round" />
      {/* Dot */}
      <circle cx="160" cy="220" r="18" fill={color} />
    </svg>
  )
}

/** Variant E — "Geometric Mark" : clean, geometric lowercase 'an' mark.
 *  Modern, minimal, works great at small sizes. */
function LogoE({ size = 120, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 'a' — vertical with bump */}
      <path
        d="M60 340V200C60 133.726 113.726 80 180 80C246.274 80 200 133.726 200 200V340"
        stroke={color}
        strokeWidth="48"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 'a' crossbar */}
      <path
        d="M60 250H200"
        stroke={color}
        strokeWidth="48"
        strokeLinecap="round"
      />
      {/* 'n' arch + stem */}
      <path
        d="M200 340V220C200 164.772 244.772 120 300 120V120"
        stroke={color}
        strokeWidth="48"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M300 120V340"
        stroke={color}
        strokeWidth="48"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Variant F — "Slash-A" : the letter A formed with two diagonal strokes
 *  meeting at the top, plus a horizontal bar — minimal, developer-friendly
 *  with a forward-slash aesthetic */
function LogoF({ size = 120, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Left leg of A */}
      <line x1="60" y1="350" x2="200" y2="50" stroke={color} strokeWidth="48" strokeLinecap="round" />
      {/* Right leg of A */}
      <line x1="200" y1="50" x2="340" y2="350" stroke={color} strokeWidth="48" strokeLinecap="round" />
      {/* Crossbar */}
      <line x1="110" y1="240" x2="290" y2="240" stroke={color} strokeWidth="48" strokeLinecap="round" />
    </svg>
  )
}

/* ── Logo showcase card ── */

function LogoCard({
  name,
  description,
  children,
  index,
}: {
  name: string
  description: string
  children: React.ReactNode
  index: number
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      className="group relative rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden"
      initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        duration: 0.8,
        delay: 0.3 + index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15)_0%,transparent_70%)]" />

      {/* Logo display area */}
      <div className="flex items-center justify-center h-[220px] relative">
        {/* Grid bg */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }} />

        {/* Checkerboard for dark/light preview */}
        <motion.div
          className="relative z-10"
          animate={{ scale: hovered ? 1.08 : 1 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      </div>

      {/* Info */}
      <div className="px-5 py-4 border-t border-white/[0.06]">
        <p className="text-[13px] font-semibold text-white/90">{name}</p>
        <p className="mt-1 text-[11px] text-white/40 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}

/* ── Color variants row ── */

function ColorRow({ children, colors }: { children: (color: string) => React.ReactNode; colors: string[] }) {
  return (
    <div className="flex items-center gap-6">
      {colors.map((c) => (
        <div key={c} className="flex flex-col items-center gap-2">
          {children(c)}
          <span className="font-mono text-[10px] text-white/30">{c}</span>
        </div>
      ))}
    </div>
  )
}

/* ── Page ── */

export function AnBrandPage() {
  return (
    <div className="dark min-h-screen bg-[#09090b] text-white antialiased selection:bg-white/20">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-8 py-12 sm:py-20">
        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <a href={agentsHref("/agents")} className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/60 transition-colors mb-8">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to an.dev
          </a>
          <h1 className="font-line text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] tracking-normal text-white">
            Logo concepts
            <br />
            <span className="text-white/40">for an.dev</span>
          </h1>
          <p className="mt-4 text-[15px] text-white/45 max-w-[50ch] leading-relaxed">
            Explorations for the an.dev brand mark. Each variant is designed to work at small sizes (16px favicon) through large display.
          </p>
        </motion.div>

        {/* Logo grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
          <LogoCard name="Stacked Bars" description="Abstract 'a' from horizontal bars + vertical stem. Terminal prompt / agent feel." index={0}>
            <LogoA size={100} color="white" />
          </LogoCard>

          <LogoCard name="Monogram" description="Lowercase 'a' and 'n' merged into one connected stroke-based glyph." index={1}>
            <LogoB size={100} color="white" />
          </LogoCard>

          <LogoCard name="Agent Window" description="Chat window icon with 'an' inside — represents the agent interface." index={2}>
            <LogoC size={100} color="white" />
          </LogoCard>

          <LogoCard name="Signal" description="Letter 'a' with broadcasting signal arcs — the agent is always on." index={3}>
            <LogoD size={100} color="white" />
          </LogoCard>

          <LogoCard name="Geometric an" description="Clean geometric lowercase 'an' lettermark. Minimal, works at any size." index={4}>
            <LogoE size={100} color="white" />
          </LogoCard>

          <LogoCard name="Slash-A" description="Uppercase A with forward-slash aesthetic — developer-first, bold." index={5}>
            <LogoF size={100} color="white" />
          </LogoCard>
        </div>

        {/* Color variations section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-lg font-semibold text-white/90 mb-2">Color variations</h2>
          <p className="text-[13px] text-white/40 mb-8">Each mark in brand palette options.</p>

          <div className="space-y-10">
            <div>
              <p className="text-[11px] text-white/30 font-mono uppercase tracking-wider mb-4">Geometric an</p>
              <ColorRow colors={["#ffffff", "#ff1e32", "#3c78ff", "#a78bfa", "#34d399"]}>
                {(c) => <LogoE size={48} color={c} />}
              </ColorRow>
            </div>
            <div>
              <p className="text-[11px] text-white/30 font-mono uppercase tracking-wider mb-4">Signal</p>
              <ColorRow colors={["#ffffff", "#ff1e32", "#3c78ff", "#a78bfa", "#34d399"]}>
                {(c) => <LogoD size={48} color={c} />}
              </ColorRow>
            </div>
            <div>
              <p className="text-[11px] text-white/30 font-mono uppercase tracking-wider mb-4">Slash-A</p>
              <ColorRow colors={["#ffffff", "#ff1e32", "#3c78ff", "#a78bfa", "#34d399"]}>
                {(c) => <LogoF size={48} color={c} />}
              </ColorRow>
            </div>
          </div>
        </motion.div>

        {/* Size tests */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-lg font-semibold text-white/90 mb-2">Size test</h2>
          <p className="text-[13px] text-white/40 mb-8">How each mark holds up from favicon to display.</p>

          <div className="space-y-8">
            {[
              { name: "Geometric an", Component: LogoE },
              { name: "Signal", Component: LogoD },
              { name: "Slash-A", Component: LogoF },
            ].map(({ name, Component }) => (
              <div key={name}>
                <p className="text-[11px] text-white/30 font-mono uppercase tracking-wider mb-4">{name}</p>
                <div className="flex items-end gap-6">
                  {[16, 24, 32, 48, 64, 96].map((s) => (
                    <div key={s} className="flex flex-col items-center gap-2">
                      <div className="rounded border border-white/[0.06] bg-white/[0.02] p-2 flex items-center justify-center" style={{ width: s + 16, height: s + 16 }}>
                        <Component size={s} color="white" />
                      </div>
                      <span className="font-mono text-[9px] text-white/25">{s}px</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Wordmark section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-lg font-semibold text-white/90 mb-2">Wordmark</h2>
          <p className="text-[13px] text-white/40 mb-8">Logo mark + wordmark combinations.</p>

          <div className="space-y-6">
            {[
              { name: "Geometric an", Component: LogoE },
              { name: "Signal", Component: LogoD },
              { name: "Slash-A", Component: LogoF },
            ].map(({ name, Component }) => (
              <div
                key={name}
                className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-8 py-6"
              >
                <Component size={36} color="white" />
                <span className="text-2xl font-semibold tracking-tight text-white">an</span>
                <span className="text-2xl font-semibold tracking-tight text-white/30">.dev</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Dark / light preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-lg font-semibold text-white/90 mb-2">Dark &amp; light</h2>
          <p className="text-[13px] text-white/40 mb-8">Contrast check on both backgrounds.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Dark */}
            <div className="rounded-xl border border-white/[0.08] bg-[#09090b] p-8 flex items-center justify-center gap-6">
              <LogoE size={56} color="white" />
              <div>
                <p className="text-sm font-semibold text-white">an.dev</p>
                <p className="text-[11px] text-white/40">on dark</p>
              </div>
            </div>
            {/* Light */}
            <div className="rounded-xl border border-neutral-200 bg-white p-8 flex items-center justify-center gap-6">
              <LogoE size={56} color="#09090b" />
              <div>
                <p className="text-sm font-semibold text-[#09090b]">an.dev</p>
                <p className="text-[11px] text-neutral-400">on light</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-white/[0.06] text-center">
          <p className="text-[12px] text-white/25">an.dev brand concepts &middot; by 21st</p>
        </div>
      </div>
    </div>
  )
}
