"use client"

import { motion } from "motion/react"
import { SectionHeader } from "./section-header"

const features = [
  {
    title: "Parallel Agents",
    description:
      "Work on multiple features at once. Each agent runs in its own session with full context.",
  },
  {
    title: "Full Agent Power",
    description:
      "Plan mode, skills, message editing, and every feature your agent supports. Nothing held back.",
  },
  {
    title: "Keyboard-First",
    description:
      "Hotkeys for every action. Navigate, create, and manage without touching your mouse.",
  },
]

export function LandingCoreFeatures() {
  return (
    <section className="px-8 py-20 sm:py-28">
      <SectionHeader
        overline="Core features"
        heading="Ship code, not terminal commands."
        subtext="Everything you love about coding agents, with a visual interface designed for focused work."
      />

      <div className="mt-16 grid gap-4 sm:grid-cols-3">
        {features.map((feature, index) => (
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
