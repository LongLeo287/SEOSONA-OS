"use client"

import { useEffect, useRef, useState, lazy, Suspense } from "react"
import { motion, AnimatePresence, useInView } from "motion/react"
import { agentsHref } from "@/lib/utils/agents-href"
import { AgentsLink } from "@/components/agents-link"
import {
  DashedBox,
  DashedDivider,
} from "@/components/features/agents/landing/dashed-divider"
import { AnFooter } from "./an-footer"
import { SearchProvider } from "./docs/search-context"
import type { SearchRecord } from "@/lib/agents-docs/search"

const DiamondGridBackground = lazy(() =>
  import("./diamond-grid-background").then((m) => ({ default: m.DiamondGridBackground }))
)
const SearchModal = lazy(() =>
  import("./docs/search-modal").then((m) => ({ default: m.SearchModal }))
)

/* ── Mobile detection — skip entrance animations on small screens ── */

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(`(max-width: ${breakpoint - 1}px)`).matches
      : false
  )
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    setIsMobile(mql.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mql.addEventListener("change", handler)
    return () => mql.removeEventListener("change", handler)
  }, [breakpoint])
  return isMobile
}

/* ── YC Badge ── */

function YCBadge({ skipAnimation }: { skipAnimation?: boolean }) {
  return (
    <motion.div
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-muted text-sm text-muted-foreground w-fit"
      initial={skipAnimation ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={skipAnimation ? { duration: 0 } : { duration: 0.4, delay: 0.1 }}
    >
      <span className="text-muted-foreground">Backed by</span>
      <svg
        className="w-4 h-4 text-foreground"
        viewBox="0 0 256 256"
        fill="none"
      >
        <rect width="256" height="256" rx="40" fill="currentColor" />
        <path
          d="M119.374 144.746L75.433 62.432h20.081l25.848 52.092c.398.928.862 1.889 1.392 2.883.53.994.994 2.022 1.391 3.082.266.398.464.762.597 1.094.133.33.265.63.398.894a65.643 65.643 0 0 1 1.79 3.877c.53 1.26.993 2.42 1.39 3.48 1.061-2.254 2.221-4.673 3.48-7.257 1.26-2.585 2.552-5.27 3.877-8.053l26.246-52.092h18.69l-44.34 83.308v53.087h-16.9v-54.081z"
          className="fill-background"
        />
      </svg>
      <span>Combinator</span>
    </motion.div>
  )
}

/* ── Hero Section ── */

function HeroSection({ skipAnimation }: { skipAnimation?: boolean }) {
  return (
    <section className="relative flex flex-col items-center justify-center px-4 sm:px-8 min-h-[calc(100dvh-96px)]">
      {/* Chrome glow */}
      <motion.div
        className="absolute inset-0 z-[1] pointer-events-none"
        aria-hidden="true"
        initial={skipAnimation ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={skipAnimation ? { duration: 0 } : { duration: 1.5, delay: 1.2, ease: "easeOut" }}
      >
        <svg className="absolute" width="0" height="0" aria-hidden="true">
          <filter id="glow-dither" x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
            <feDisplacementMap in="SourceGraphic" scale="3" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(ellipse at center, rgba(var(--an-glow-rgb),0.09) 0%, rgba(var(--an-glow-rgb),0.07) 10%, rgba(var(--an-glow-rgb),0.05) 20%, rgba(var(--an-glow-rgb),0.035) 30%, rgba(var(--an-glow-rgb),0.022) 40%, rgba(var(--an-glow-rgb),0.013) 50%, rgba(var(--an-glow-rgb),0.007) 60%, rgba(var(--an-glow-rgb),0.003) 70%, rgba(var(--an-glow-rgb),0.001) 80%, transparent 90%)",
            filter: "url(#glow-dither)",
          }}
        />
      </motion.div>

      <div className="relative z-10 mb-6">
        <YCBadge skipAnimation={skipAnimation} />
      </div>

      <h1
        className="relative z-10 font-line text-[clamp(1.7rem,6vw,4rem)] leading-[1.1] tracking-normal text-foreground text-center"
        style={{ textShadow: "-2px 0 rgba(var(--an-glow-rgb), 0.15), 2px 0 rgba(var(--an-glow-rgb), 0.15)" }}
      >
        {["Ship", "agents", "to"].map((word, i) => (
          <motion.span
            key={word}
            initial={skipAnimation ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={skipAnimation ? { duration: 0 } : {
              duration: 1.1,
              delay: 0.4 + i * 0.4,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block"
          >
            {word}{"\u00A0"}
          </motion.span>
        ))}
        <motion.span
          className="text-foreground/60"
          initial={skipAnimation ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={skipAnimation ? { duration: 0 } : {
            duration: 1.1,
            delay: 0.4 + 3 * 0.4,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          production.
        </motion.span>
      </h1>

      <motion.p
        className="relative z-10 mt-6 text-[14px] sm:text-[17px] text-foreground/65 max-w-[56ch] leading-relaxed text-center"
        initial={skipAnimation ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={skipAnimation ? { duration: 0 } : {
          duration: 1.1,
          delay: 1.9,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        Infrastructure for CLI-based AI agents.
        Sandboxing, auth, UI, and observability — out of the box.
      </motion.p>

      <motion.div
        className="relative z-10 mt-9 flex items-center gap-3"
        initial={skipAnimation ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={skipAnimation ? { duration: 0 } : {
          duration: 1.1,
          delay: 2.4,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <AgentsLink
          href="/agents/app"
          className="inline-flex items-center justify-center rounded-[10px] h-10 px-6 text-[15px] font-medium bg-foreground text-background hover:bg-foreground/90 shadow-[0_0_0_0.5px_hsl(var(--foreground)/0.5),inset_0_0_0_1px_hsl(var(--foreground)/0.14)] active:scale-[0.99] transition-all duration-150"
        >
          Get started
        </AgentsLink>
        <AgentsLink
          href="/agents/docs"
          className="inline-flex items-center justify-center rounded-[10px] h-10 px-6 text-[15px] font-medium bg-muted border border-border text-muted-foreground hover:bg-accent hover:text-foreground active:scale-[0.99] transition-all duration-150"
        >
          Read docs
        </AgentsLink>
      </motion.div>

    </section>
  )
}

/* ── Problem Statement ── */

function ProblemStatement() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <section ref={ref} className="px-4 sm:px-8 py-14 sm:py-20">
      <motion.p
        className="text-center font-line text-[clamp(1.1rem,3.5vw,1.75rem)] leading-[1.3] text-foreground/70 max-w-[36ch] mx-auto"
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        Building an agent takes a weekend.
        <br />
        <span className="text-foreground/45">Running it in production takes months.</span>
      </motion.p>
    </section>
  )
}

/* ── Before / After ── */

function BeforeAfterSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <section ref={ref} className="px-4 sm:px-8 py-10 sm:py-14">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Without 21st */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <DashedBox className="overflow-hidden h-full">
            <div className="absolute top-0 left-0 right-0 h-px z-10" style={{ background: "radial-gradient(ellipse at center, rgba(239,68,68,0.35) 0%, transparent 70%)" }} />
            <div className="px-5 py-5">
              <p className="text-[12px] uppercase tracking-[0.15em] text-foreground/40 mb-4">Without 21st</p>
              <div className="space-y-2.5 text-[14px] leading-relaxed">
                {[
                  "Containers & sandboxing",
                  "Secrets & credential injection",
                  "Auth & token exchange",
                  "Logging & tracing",
                  "Tenant isolation",
                  "Chat UI components",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <span className="text-red-500/70 dark:text-red-400/60 text-[13px] shrink-0">&#10005;</span>
                    <span className="text-foreground/50 line-through decoration-foreground/20">{item}</span>
                  </div>
                ))}
                <p className="text-foreground/40 text-[13px] mt-1 italic">Weeks of infra work</p>
              </div>
            </div>
          </DashedBox>
        </motion.div>

        {/* With 21st */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          <DashedBox className="overflow-hidden h-full">
            <div className="absolute top-0 left-0 right-0 h-px z-10" style={{ background: "radial-gradient(ellipse at center, rgba(52,211,153,0.45) 0%, transparent 70%)" }} />
            <div className="px-5 py-5">
              <p className="text-[12px] uppercase tracking-[0.15em] text-foreground/40 mb-4">With 21st</p>
              <div className="rounded-lg border border-border bg-muted px-4 py-3.5 font-mono text-[12px] sm:text-[13px] leading-[1.8] mb-4">
                <div className="text-foreground/45">{"// agents/my-agent/index.ts"}</div>
                <div>
                  <span className="text-[#495057] font-medium dark:text-[#A0A0A0] dark:font-normal">export default</span>{" "}
                  <span className="text-foreground/60">agent</span>
                  <span className="text-foreground/40">({"{"}</span>
                </div>
                <div className="pl-3">
                  <span className="text-foreground/55">model:</span>{" "}
                  <span className="text-[#146C43] dark:text-[#99FFE4]">&quot;claude-sonnet-4-6&quot;</span>
                  <span className="text-foreground/40">,</span>
                </div>
                <div className="pl-3">
                  <span className="text-foreground/55">tools:</span>{" "}
                  <span className="text-foreground/40">{"{ ... }"}</span>
                  <span className="text-foreground/40">,</span>
                </div>
                <div>
                  <span className="text-foreground/40">{"})"}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <code className="font-mono text-[13px] text-foreground/70">npx @21st-sdk/cli deploy</code>
                <span className="text-[14px] text-foreground/50">— done.</span>
              </div>
            </div>
          </DashedBox>
        </motion.div>
      </div>
    </section>
  )
}

/* ── Core Platform (4 blocks) ── */

const corePlatformCards = [
  {
    title: "Sandboxed Runtimes",
    description: "Every agent session runs in an isolated E2B sandbox with gVisor. Boots in seconds, not minutes.",
    glow: "rgba(251,191,36,0.45)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/60">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <path d="M6 10h.01M10 10h.01" />
      </svg>
    ),
  },
  {
    title: "Credential Management",
    description: "API keys, env vars, secrets — injected securely at runtime. Token exchange auth for browser clients.",
    glow: "rgba(52,211,153,0.45)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/60">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    title: "Agent UI",
    description: "Drop-in React components for chat, streaming, and tool rendering. Works with Next.js out of the box.",
    glow: "rgba(96,165,250,0.5)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/60">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
    ),
  },
  {
    title: "Observability",
    description: "Every step traced. Cost per session, latency, errors, token usage — one dashboard.",
    glow: "rgba(167,139,250,0.45)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/60">
        <path d="M3 3v18h18" />
        <path d="M18 17V9" />
        <path d="M13 17V5" />
        <path d="M8 17v-3" />
      </svg>
    ),
  },
]

function CorePlatformSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <section ref={ref} className="px-4 sm:px-8 py-10 sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <p className="text-[12px] uppercase tracking-[0.15em] text-foreground/40 mb-3">Platform</p>
        <h2 className="text-[clamp(1.1rem,2.5vw,1.35rem)] font-semibold leading-[1.2] tracking-normal text-foreground">
          Everything you need to run agents in production.
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {corePlatformCards.map((card, i) => (
          <motion.div
            key={card.title}
            className="h-full"
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <DashedBox className="overflow-hidden h-full">
              <div className="absolute top-0 left-0 right-0 h-px z-10" style={{ background: `radial-gradient(ellipse at center, ${card.glow} 0%, transparent 70%)` }} />
              <div className="px-5 py-5 h-full flex flex-col">
                <div className="mb-3">{card.icon}</div>
                <p className="text-[15px] font-semibold text-foreground/90 leading-snug mb-2">{card.title}</p>
                <p className="text-[14px] text-foreground/60 leading-relaxed">{card.description}</p>
              </div>
            </DashedBox>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ── How It Works (3 steps) ── */

const howItWorksSteps = [
  {
    step: "1",
    title: "Define",
    description: "Write your agent in TypeScript. Add tools with Zod schemas. Configure model, system prompt, and MCP servers.",
  },
  {
    step: "2",
    title: "Deploy",
    description: "npx @21st-sdk/cli deploy pushes your agent to a sandboxed, production-grade environment.",
  },
  {
    step: "3",
    title: "Integrate",
    description: "Every agent gets an API endpoint. Embed the React chat UI, or connect via the server SDK.",
  },
]

function HowItWorksSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <section ref={ref} className="px-4 sm:px-8 py-10 sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <p className="text-[12px] uppercase tracking-[0.15em] text-foreground/40 mb-3">How it works</p>
        <h2 className="text-[clamp(1.1rem,2.5vw,1.35rem)] font-semibold leading-[1.2] tracking-normal text-foreground">
          Three steps. Zero infra.
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {howItWorksSteps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <DashedBox className="overflow-hidden h-full">
              <div className="absolute top-0 left-0 right-0 h-px z-10" style={{ background: "radial-gradient(ellipse at center, rgba(var(--an-glow-rgb),0.3) 0%, transparent 70%)" }} />
              <div className="px-5 py-5 h-full">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-border text-[13px] font-medium text-foreground/60 mb-3">
                  {step.step}
                </span>
                <p className="text-[15px] font-semibold text-foreground/90 leading-snug mb-2">{step.title}</p>
                <p className="text-[14px] text-foreground/60 leading-relaxed">{step.description}</p>
              </div>
            </DashedBox>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ── Code Example (Tabbed) ── */

function CodeExampleSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const [tab, setTab] = useState<"agent" | "frontend" | "dashboard">("agent")

  return (
    <section ref={ref} className="px-4 sm:px-8 py-10 sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <p className="text-[12px] uppercase tracking-[0.15em] text-foreground/40 mb-3">Code</p>
        <h2 className="text-[clamp(1.1rem,2.5vw,1.35rem)] font-semibold leading-[1.2] tracking-normal text-foreground">
          Code-first. TypeScript all the way.
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.08 }}
      >
        <DashedBox className="overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px z-10" style={{ background: "radial-gradient(ellipse at center, rgba(var(--an-glow-rgb),0.35) 0%, transparent 70%)" }} />

          {/* Tab bar */}
          <div className="flex items-center gap-0 border-b border-border overflow-x-auto">
            {([
              { id: "agent" as const, label: "agents/my-agent/index.ts" },
              { id: "frontend" as const, label: "app/page.tsx" },
              { id: "dashboard" as const, label: "Dashboard" },
            ]).map((t) => {
              const isActive = tab === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`relative px-4 py-3 text-[13px] font-mono transition-colors duration-150 shrink-0 ${
                    isActive
                      ? "text-foreground/80 bg-muted"
                      : "text-foreground/35 hover:text-foreground/55"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="code-tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-px bg-foreground/30"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                    />
                  )}
                  {t.label}
                </button>
              )
            })}
          </div>

          {/* Tab content */}
          <div className="font-mono text-[12px] sm:text-[13px] leading-[1.8] px-5 py-5 min-h-[280px]">
            <AnimatePresence mode="wait">
              {tab === "agent" && (
                <motion.div
                  key="agent"
                  initial={{ opacity: 0, filter: "blur(3px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(3px)" }}
                  transition={{ duration: 0.15 }}
                  className="space-y-[2px]"
                >
                  <div>
                    <span className="text-[#495057] font-medium dark:text-[#A0A0A0] dark:font-normal">import</span>{" "}
                    <span className="text-foreground/50 dark:text-[#A0A0A0]">{"{"}</span>{" "}
                    <span className="text-[#C2410C] dark:text-[#FFC799]">agent</span>
                    <span className="text-foreground/40">,</span>{" "}
                    <span className="text-[#C2410C] dark:text-[#FFC799]">tool</span>{" "}
                    <span className="text-foreground/50 dark:text-[#A0A0A0]">{"}"}</span>{" "}
                    <span className="text-[#495057] font-medium dark:text-[#A0A0A0] dark:font-normal">from</span>{" "}
                    <span className="text-[#146C43] dark:text-[#99FFE4]">&quot;@21st-sdk/agent&quot;</span>
                  </div>
                  <div>
                    <span className="text-[#495057] font-medium dark:text-[#A0A0A0] dark:font-normal">import</span>{" "}
                    <span className="text-foreground/50 dark:text-[#A0A0A0]">{"{"}</span>{" "}
                    <span className="text-[#C2410C] dark:text-[#FFC799]">z</span>{" "}
                    <span className="text-foreground/50 dark:text-[#A0A0A0]">{"}"}</span>{" "}
                    <span className="text-[#495057] font-medium dark:text-[#A0A0A0] dark:font-normal">from</span>{" "}
                    <span className="text-[#146C43] dark:text-[#99FFE4]">&quot;zod&quot;</span>
                  </div>
                  <div className="h-2" />
                  <div>
                    <span className="text-[#495057] font-medium dark:text-[#A0A0A0] dark:font-normal">export default</span>{" "}
                    <span className="text-[#C2410C] dark:text-[#FFC799]">agent</span>
                    <span className="text-foreground/40 dark:text-[#A0A0A0]">({"{"}</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-foreground/55 dark:text-white">model:</span>{" "}
                    <span className="text-[#146C43] dark:text-[#99FFE4]">&quot;claude-sonnet-4-6&quot;</span>
                    <span className="text-foreground/40">,</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-foreground/55 dark:text-white">systemPrompt:</span>{" "}
                    <span className="text-[#146C43] dark:text-[#99FFE4]">&quot;You are a helpful assistant.&quot;</span>
                    <span className="text-foreground/40">,</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-foreground/55 dark:text-white">tools:</span>{" "}
                    <span className="text-foreground/40">{"{"}</span>
                  </div>
                  <div className="pl-8">
                    <span className="text-foreground/55 dark:text-white">search:</span>{" "}
                    <span className="text-[#C2410C] dark:text-[#FFC799]">tool</span>
                    <span className="text-foreground/40">({"{"}</span>
                  </div>
                  <div className="pl-12">
                    <span className="text-foreground/55 dark:text-white">description:</span>{" "}
                    <span className="text-[#146C43] dark:text-[#99FFE4]">&quot;Search the knowledge base&quot;</span>
                    <span className="text-foreground/40">,</span>
                  </div>
                  <div className="pl-12">
                    <span className="text-foreground/55 dark:text-white">inputSchema:</span>{" "}
                    <span className="text-foreground/50">z.object({"{"} query: z.string() {"}"})</span>
                    <span className="text-foreground/40">,</span>
                  </div>
                  <div className="pl-12">
                    <span className="text-foreground/55 dark:text-white">execute:</span>{" "}
                    <span className="text-foreground/50">async ({"{"} query {"}"}) =&gt; ...</span>
                  </div>
                  <div className="pl-8">
                    <span className="text-foreground/40">{"})"}</span>
                    <span className="text-foreground/40">,</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-foreground/40">{"}"}</span>
                    <span className="text-foreground/40">,</span>
                  </div>
                  <div>
                    <span className="text-foreground/40 dark:text-[#A0A0A0]">{"})"}</span>
                  </div>
                </motion.div>
              )}
              {tab === "frontend" && (
                <motion.div
                  key="frontend"
                  initial={{ opacity: 0, filter: "blur(3px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(3px)" }}
                  transition={{ duration: 0.15 }}
                  className="space-y-[2px]"
                >
                  <div>
                    <span className="text-[#495057] font-medium dark:text-[#A0A0A0] dark:font-normal">import</span>{" "}
                    <span className="text-foreground/50 dark:text-[#A0A0A0]">{"{"}</span>{" "}
                    <span className="text-[#C2410C] dark:text-[#FFC799]">AgentChat</span>{" "}
                    <span className="text-foreground/50 dark:text-[#A0A0A0]">{"}"}</span>{" "}
                    <span className="text-[#495057] font-medium dark:text-[#A0A0A0] dark:font-normal">from</span>{" "}
                    <span className="text-[#146C43] dark:text-[#99FFE4]">&quot;@21st-sdk/nextjs&quot;</span>
                  </div>
                  <div>
                    <span className="text-[#495057] font-medium dark:text-[#A0A0A0] dark:font-normal">import</span>{" "}
                    <span className="text-[#146C43] dark:text-[#99FFE4]">&quot;@21st-sdk/react/styles.css&quot;</span>
                  </div>
                  <div className="h-2" />
                  <div>
                    <span className="text-[#495057] font-medium dark:text-[#A0A0A0] dark:font-normal">export default function</span>{" "}
                    <span className="text-[#C2410C] dark:text-[#FFC799]">ChatPage</span>
                    <span className="text-foreground/40">() {"{"}</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-[#495057] font-medium dark:text-[#A0A0A0] dark:font-normal">return</span>{" "}
                    <span className="text-foreground/40">(</span>
                  </div>
                  <div className="pl-8">
                    <span className="text-foreground/40">&lt;</span>
                    <span className="text-[#C2410C] dark:text-[#FFC799]">AgentChat</span>
                  </div>
                  <div className="pl-12">
                    <span className="text-foreground/55 dark:text-white">agent=</span>
                    <span className="text-[#146C43] dark:text-[#99FFE4]">&quot;my-agent&quot;</span>
                  </div>
                  <div className="pl-12">
                    <span className="text-foreground/55 dark:text-white">apiUrl=</span>
                    <span className="text-[#146C43] dark:text-[#99FFE4]">&quot;/api/agent&quot;</span>
                  </div>
                  <div className="pl-8">
                    <span className="text-foreground/40">/&gt;</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-foreground/40">)</span>
                  </div>
                  <div>
                    <span className="text-foreground/40">{"}"}</span>
                  </div>
                </motion.div>
              )}
              {tab === "dashboard" && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, filter: "blur(3px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(3px)" }}
                  transition={{ duration: 0.15 }}
                  className="select-none"
                >
                  {/* Dashboard mockup */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] font-semibold text-foreground/70 font-sans">my-agent</span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/70 dark:bg-emerald-400/60" />
                        <span className="text-[12px] text-emerald-500/70 dark:text-emerald-400/60 font-sans">Active</span>
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: "Sessions today", value: "142" },
                        { label: "Avg latency", value: "1.2s" },
                        { label: "Cost today", value: "$3.41" },
                      ].map((stat) => (
                        <div key={stat.label} className="rounded border border-border bg-background px-3 py-2.5">
                          <p className="text-[10px] text-foreground/35 font-sans mb-1">{stat.label}</p>
                          <p className="text-[16px] font-semibold text-foreground/70 font-sans tabular-nums">{stat.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] text-foreground/35 uppercase tracking-wider font-sans">Recent traces</p>
                      {[
                        { id: "sb_a1b2", status: "ok", dur: "2.1s", cost: "$0.024", time: "2m ago" },
                        { id: "sb_c3d4", status: "ok", dur: "3.4s", cost: "$0.031", time: "5m ago" },
                        { id: "sb_e5f6", status: "err", dur: "0.8s", cost: "$0.008", time: "12m ago" },
                      ].map((trace) => (
                        <div key={trace.id} className="flex items-center gap-3 rounded border border-border bg-background px-3 py-2">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${trace.status === "ok" ? "bg-emerald-500/60" : "bg-red-500/60"}`} />
                          <span className="text-[11px] text-foreground/50 font-sans">{trace.id}</span>
                          <span className="text-[11px] text-foreground/35 font-sans ml-auto tabular-nums">{trace.dur}</span>
                          <span className="text-[11px] text-foreground/45 font-sans tabular-nums">{trace.cost}</span>
                          <span className="text-[10px] text-foreground/25 font-sans">{trace.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DashedBox>
      </motion.div>
    </section>
  )
}

/* ── Templates ── */

const templateShowcase = [
  {
    name: "Support Agent",
    slug: "support-agent",
    description: "Docs-powered Q&A with email escalation",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/60">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    name: "Lead Research",
    slug: "lead-research-agent",
    description: "Qualify leads, alert via Slack",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/60">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
  },
  {
    name: "Web Scraper",
    slug: "web-scraper",
    description: "Extract data from any website",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/60">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    name: "Email Agent",
    slug: "email-agent",
    description: "Send, read, auto-reply via AgentMail",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/60">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    name: "Docs Assistant",
    slug: "docs-assistant",
    description: "Instant Q&A from your llms.txt",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/60">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M16 13H8M16 17H8M10 9H8" />
      </svg>
    ),
  },
  {
    name: "Slack Monitor",
    slug: "monitor-agent",
    description: "Track services, alert on Slack",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-foreground/60">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
  },
]

function TemplatesSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <section ref={ref} className="px-4 sm:px-8 py-10 sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <p className="text-[12px] uppercase tracking-[0.15em] text-foreground/40 mb-3">Templates</p>
        <h2 className="text-[clamp(1.1rem,2.5vw,1.35rem)] font-semibold leading-[1.2] tracking-normal text-foreground">
          Start from a working agent.
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templateShowcase.map((tmpl, i) => (
          <motion.div
            key={tmpl.slug}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="h-full"
          >
            <AgentsLink href={`/agents/templates/${tmpl.slug}`} className="block h-full group">
              <DashedBox className="overflow-hidden h-full transition-colors group-hover:border-foreground/10">
                <div className="absolute top-0 left-0 right-0 h-px z-10" style={{ background: "radial-gradient(ellipse at center, rgba(var(--an-glow-rgb),0.15) 0%, transparent 70%)" }} />
                <div className="px-5 py-5 h-full flex flex-col">
                  <div className="mb-3">{tmpl.icon}</div>
                  <p className="text-[15px] font-semibold text-foreground/90 leading-snug mb-2 group-hover:text-foreground transition-colors">{tmpl.name}</p>
                  <p className="text-[14px] text-foreground/60 leading-relaxed">{tmpl.description}</p>
                </div>
              </DashedBox>
            </AgentsLink>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-5 flex justify-center"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <AgentsLink
          href="/agents/docs/templates"
          className="text-[13px] text-foreground/40 hover:text-foreground/60 transition-colors"
        >
          View all templates &rarr;
        </AgentsLink>
      </motion.div>
    </section>
  )
}

/* ── Pricing ── */

const pricingPlans = [
  {
    name: "Usage",
    price: "Pay as you go",
    description: "For developers shipping their first agents.",
    features: [
      "Unlimited agents",
      "E2B sandboxed runtimes with gVisor",
      "Built-in token exchange auth",
      "AgentChat React components",
      "Observability & tracing dashboard",
      "Environment variables & secrets",
      "Claude Code runtime",
      "Community Discord support",
    ],
    cta: "Get started",
    href: "/agents/app",
    highlight: false,
  },
  {
    name: "Scale",
    price: "Custom",
    description: "For teams running agents on their own infrastructure.",
    features: [
      "Everything in Usage, plus:",
      "On-premise deploy in your VPC",
      "SSO & Okta (SAML, OIDC)",
      "Immutable audit logs",
      "Budget caps per agent & workflow",
      "Full run replay with cost breakdown",
      "Custom sandbox specs (CPU, RAM, disk)",
      "Dedicated support & SLA",
    ],
    cta: "Talk to us",
    href: "https://cal.com/team/21st/an?overlayCalendar=true",
    highlight: true,
  },
]

function PricingSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <section ref={ref} className="px-4 sm:px-8 py-10 sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <p className="text-[12px] uppercase tracking-[0.15em] text-foreground/40 mb-3">Pricing</p>
        <h2 className="text-[clamp(1.1rem,2.5vw,1.35rem)] font-semibold leading-[1.2] tracking-normal text-foreground">
          Start free. Scale when you need to.
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {pricingPlans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <DashedBox className="overflow-hidden h-full">
              <div className="absolute top-0 left-0 right-0 h-px z-10" style={{ background: `radial-gradient(ellipse at center, rgba(var(--an-glow-rgb),${plan.highlight ? "0.5" : "0.15"}) 0%, transparent 70%)` }} />
              <div className="px-6 py-6 h-full flex flex-col">
                <p className="text-[13px] font-medium text-foreground/50 mb-1">{plan.name}</p>
                <p className="font-line text-[clamp(1.3rem,2.5vw,1.75rem)] leading-none text-foreground mb-2">{plan.price}</p>
                <p className="text-[13px] text-foreground/50 mb-5">{plan.description}</p>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[14px] text-foreground/65">
                      <span className="text-foreground/40 text-[12px] mt-[3px] shrink-0">&#10003;</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={plan.href.startsWith("http") ? plan.href : agentsHref(plan.href)}
                  target={plan.href.startsWith("http") ? "_blank" : undefined}
                  rel={plan.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={`inline-flex items-center justify-center rounded-[10px] h-10 px-6 text-[15px] font-medium active:scale-[0.99] transition-all duration-150 ${
                    plan.highlight
                      ? "bg-foreground text-background hover:bg-foreground/90 shadow-[0_0_0_0.5px_hsl(var(--foreground)/0.5),inset_0_0_0_1px_hsl(var(--foreground)/0.14)]"
                      : "bg-muted border border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            </DashedBox>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ── Final CTA ── */

function FinalCTA() {
  return (
    <div className="px-4 sm:px-8 py-10 sm:py-14">
      <DashedBox className="overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "radial-gradient(ellipse at center, rgba(var(--an-glow-rgb),0.15) 0%, transparent 70%)" }} />
        <div className="flex flex-col items-center text-center gap-4 px-6 py-8 sm:py-10">
          <h2 className="font-line text-[clamp(1.1rem,3vw,1.5rem)] leading-[1.2] tracking-normal text-foreground">
            Ship your first agent in 5 minutes.
          </h2>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <AgentsLink
              href="/agents/app"
              className="inline-flex items-center justify-center rounded-[10px] h-9 px-5 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 shadow-[0_0_0_0.5px_hsl(var(--foreground)/0.5),inset_0_0_0_1px_hsl(var(--foreground)/0.14)] active:scale-[0.99] transition-all duration-150"
            >
              Get started
            </AgentsLink>
            <AgentsLink
              href="/agents/docs"
              className="inline-flex items-center justify-center rounded-[10px] h-9 px-5 text-sm font-medium bg-muted border border-border text-muted-foreground hover:bg-accent hover:text-foreground active:scale-[0.99] transition-all duration-150"
            >
              Read docs
            </AgentsLink>
            <a
              href="https://discord.gg/Aq2B7bCp"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-[10px] h-9 px-5 text-sm font-medium bg-muted border border-border text-muted-foreground hover:bg-accent hover:text-foreground active:scale-[0.99] transition-all duration-150"
            >
              Join Discord
            </a>
          </div>
        </div>
      </DashedBox>
    </div>
  )
}

/* ── Page ── */

export default function AnLanding({ searchIndex = [], enableGrid = false }: { searchIndex?: SearchRecord[]; enableGrid?: boolean }) {
  const isMobile = useIsMobile()
  const [showBorder, setShowBorder] = useState(isMobile)

  // Set cookie so /agents/app won't redirect to landing again
  useEffect(() => {
    document.cookie = "agents_landing_seen=true; path=/; max-age=31536000; samesite=lax"
  }, [])

  useEffect(() => {
    if (isMobile) { setShowBorder(true); return }
    const t = setTimeout(() => setShowBorder(true), 3800)
    return () => clearTimeout(t)
  }, [isMobile])

  return (
    <SearchProvider>
      <div
        data-an-landing
        className="h-full overflow-x-hidden overflow-y-auto bg-background text-foreground antialiased selection:bg-foreground/20"
      >
        <div
          className="relative mx-auto w-full max-w-[1200px] border-x"
          style={{
            borderColor: showBorder ? "rgba(var(--an-glow-rgb), 0.06)" : "transparent",
            transition: "border-color 0.5s ease",
          }}
        >
          {enableGrid && (
            <Suspense fallback={null}>
              <DiamondGridBackground immediate={isMobile} />
            </Suspense>
          )}
          <HeroSection skipAnimation={isMobile} />
          <div className="relative z-[2] bg-background">
              <DashedDivider />
              <ProblemStatement />
              <DashedDivider />
              <BeforeAfterSection />
              <DashedDivider />
              <CorePlatformSection />
              <DashedDivider />
              <HowItWorksSection />
              <DashedDivider />
              <CodeExampleSection />
              <DashedDivider />
              <TemplatesSection />
              <DashedDivider />
              <PricingSection />
              <DashedDivider />
              <FinalCTA />
              <DashedDivider />
              <AnFooter />
          </div>
        </div>
        <Suspense fallback={null}>
          <SearchModal index={searchIndex} />
        </Suspense>
      </div>
    </SearchProvider>
  )
}
