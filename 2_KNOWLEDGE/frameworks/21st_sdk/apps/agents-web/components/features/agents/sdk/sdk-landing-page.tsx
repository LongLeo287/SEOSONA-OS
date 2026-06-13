"use client"

import { Logo } from "@/components/features/agents/ui/canvas/[id]/{components}/ui/logo"
import { DashedBox, DashedDivider } from "@/components/features/agents/landing/dashed-divider"
import { SectionHeader } from "@/components/features/agents/landing/section-header"
import { motion } from "motion/react"
import Link from "next/link"
import { Suspense, useEffect, useRef, useState } from "react"
import { SdkEarlyAccessDialog } from "./sdk-early-access-dialog"
import { SdkFAQ } from "./sdk-faq"
import { SdkFeatures } from "./sdk-features"
import { SdkIntegrations } from "./sdk-integrations"
import { SdkUseCases } from "./sdk-use-cases"

function HeroCode() {
  const kw = "text-purple-300/70"
  const str = "text-green-300/70"
  const t = "text-white/25"
  const prop = "text-blue-300/70"
  const cmt = "text-white/20"
  return (
    <div className="overflow-hidden">
      <pre className="py-5 font-mono text-[13px] leading-relaxed overflow-x-auto">
        <code>
          <span className={kw}>curl</span>
          <span className={t}>{" -X "}</span>
          <span className={str}>POST</span>
          <span className={t}>{" \\"}</span>
          {"\n"}
          {"  "}
          <span className={str}>https://1code.dev/api/v1/tasks</span>
          <span className={t}>{" \\"}</span>
          {"\n"}
          {"  "}
          <span className={t}>{'-H "'}</span>
          <span className={prop}>Authorization</span>
          <span className={t}>{": Bearer "}</span>
          <span className={str}>YOUR_API_KEY</span>
          <span className={t}>{'" \\'}</span>
          {"\n"}
          {"  "}
          <span className={t}>{"-d '"}</span>
          <span className={t}>{"{"}</span>
          {"\n"}
          {"    "}
          <span className={prop}>{'"repository"'}</span>
          <span className={t}>{": "}</span>
          <span className={str}>{'"org/repo"'}</span>
          <span className={t}>{","}</span>
          {"\n"}
          {"    "}
          <span className={prop}>{'"prompt"'}</span>
          <span className={t}>{": "}</span>
          <span className={str}>{'"Fix the auth bug in login"'}</span>
          {"\n"}
          {"  "}
          <span className={t}>{"}"}</span>
          <span className={t}>{"'"}</span>
          {"\n"}
          {"\n"}
          <span className={cmt}>
            {"# → Agent starts in a sandbox, returns a PR"}
          </span>
        </code>
      </pre>
    </div>
  )
}

function SdkLandingPageContent() {
  const ctaRef = useRef<HTMLButtonElement>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  useEffect(() => {
    ctaRef.current?.focus()
  }, [])
  return (
    <div className="dark h-screen overflow-y-auto bg-[#09090b] text-white antialiased selection:bg-white/20">
      <div className="relative mx-auto w-full max-w-[1200px] border-x border-white/[0.06]">
        {/* Nav */}
        <nav className="flex items-center justify-between px-8 py-5">
          <Link
            href="/agents"
            className="flex items-center gap-2 text-sm font-medium tracking-tight"
          >
            <Logo className="w-4 h-4" fill="white" />
            1Code API <span className="text-white/40 hidden sm:inline">by 21st</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/agents"
              className="text-sm text-white/50 hover:text-white active:scale-[0.99] transition-all duration-150"
            >
              1Code
            </Link>
            <button
              onClick={() => setDialogOpen(true)}
              className="text-sm text-white/50 hover:text-white active:scale-[0.99] transition-all duration-150 outline-none focus-visible:text-white"
            >
              Get Early Access
            </button>
          </div>
        </nav>

        <DashedDivider />

        {/* Hero */}
        <section className="px-8 pt-20 pb-16 sm:pt-28 sm:pb-24">
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16">
            <div className="flex-1 min-w-0">
              <motion.p
                className="flex items-center gap-2 text-xs font-medium text-white/30 uppercase tracking-widest mb-8"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                  <rect x="0" y="0" width="10" height="2" />
                  <rect x="0" y="4" width="10" height="2" />
                  <rect x="0" y="8" width="10" height="2" />
                </svg>
                Run coding agents from anywhere
              </motion.p>

              <motion.h1
                className="font-pixel text-[clamp(2rem,5vw,3.25rem)] leading-[1.1] tracking-wide text-white max-w-[18ch]"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.04 }}
              >
                Start a coding agent with a single API&nbsp;call.
              </motion.h1>

              <motion.p
                className="mt-5 text-[17px] text-white/45 max-w-[36ch] leading-relaxed"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 }}
              >
                Point it at a repo, give it a task. The agent runs in a sandbox
                and delivers a PR. No infra to manage.
              </motion.p>

              <motion.div
                className="mt-8 flex items-center gap-3"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.12 }}
              >
                <button
                  ref={ctaRef}
                  onClick={() => setDialogOpen(true)}
                  className="inline-flex items-center justify-center rounded-full h-8 px-4 text-sm font-medium bg-white text-[#09090b] hover:bg-white/90 shadow-[0_0_0_0.5px_rgba(255,255,255,0.5),inset_0_0_0_1px_rgba(255,255,255,0.14)] active:scale-[0.99] transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b]"
                >
                  Get Early Access
                </button>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center rounded-full h-8 px-4 text-sm font-medium bg-white/5 backdrop-blur-sm border border-white/[0.08] text-white/70 hover:bg-white/10 hover:text-white active:scale-[0.99] transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b]"
                >
                  Learn more
                </a>
              </motion.div>
            </div>

            <motion.div
              className="mt-14 lg:mt-0 shrink-0 lg:mr-8"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.16 }}
            >
              <DashedBox className="px-6">
                <HeroCode />
              </DashedBox>
            </motion.div>
          </div>
        </section>

        <DashedDivider />

        {/* Features */}
        <SdkFeatures />

        <DashedDivider />

        {/* Integrations */}
        <SdkIntegrations />

        <DashedDivider />

        {/* Use Cases */}
        <SdkUseCases />

        <DashedDivider />

        {/* FAQ */}
        <SdkFAQ />

        <DashedDivider />

        {/* Final CTA */}
        <section className="px-8 py-20 sm:py-28">
          <SectionHeader
            overline="Get started"
            heading="One API call. One sandbox. One PR."
            subtext="Your repo. Your prompt. Agent handles the rest."
          />
          <div className="mt-8">
            <button
              onClick={() => setDialogOpen(true)}
              className="inline-flex items-center justify-center rounded-full h-8 px-4 text-sm font-medium bg-white text-[#09090b] hover:bg-white/90 shadow-[0_0_0_0.5px_rgba(255,255,255,0.5),inset_0_0_0_1px_rgba(255,255,255,0.14)] active:scale-[0.99] transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b]"
            >
              Get Early Access
            </button>
          </div>
        </section>

        <DashedDivider />

        {/* Footer */}
        <div className="px-8 py-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-[13px] text-white/25">1Code API</span>
          <div className="flex flex-col gap-1 sm:items-end">
            <span className="text-[13px] text-white/25">
              support@21st.dev
            </span>
          </div>
        </div>
      </div>

      <SdkEarlyAccessDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}

export function SdkLandingPage() {
  return (
    <Suspense fallback={<div className="dark h-screen bg-[#09090b]" />}>
      <SdkLandingPageContent />
    </Suspense>
  )
}
