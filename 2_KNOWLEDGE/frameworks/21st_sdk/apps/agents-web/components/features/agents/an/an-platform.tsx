"use client"

import { SectionHeader } from "@/components/features/agents/landing/section-header"
import { motion } from "motion/react"

const platformFeatures = [
  {
    title: "Frontier agents",
    description:
      "Claude Code, Codex, OpenClaw - best-in-class agents from Anthropic and OpenAI, running inside your product.",
  },
  {
    title: "Sessions & history",
    description:
      "Every user gets persistent conversations. Resume, branch, replay - built in.",
  },
  {
    title: "Plans & usage limits",
    description:
      "Define plans, set per-user limits, track consumption. You handle billing - we enforce the quotas.",
  },
  {
    title: "Sandboxed execution",
    description:
      "Tools run in isolated sandboxes. We host them, scale them, secure them.",
  },
  {
    title: "Observability",
    description:
      "Traces, logs, replay for every run. Debug in production without guessing.",
  },
  {
    title: "Agent UI",
    description:
      "Drop-in React components. Chat, actions, results. Fully customizable to your brand.",
  },
]

export function AnPlatform() {
  return (
    <section id="platform" className="px-8 py-20 sm:py-28">
      <SectionHeader
        overline="Platform"
        heading="Everything you need for agent infrastructure."
        maxHeadingWidth="28ch"
        subtext="You bring tools and domain logic. We handle the rest."
      />

      <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {platformFeatures.map((feature, index) => (
          <motion.div
            key={feature.title}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.04 }}
          >
            <p className="text-[15px] font-semibold text-white/90">
              {feature.title}
            </p>
            <p className="text-sm text-white/35 mt-1.5 leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
