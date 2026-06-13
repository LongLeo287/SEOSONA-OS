"use client"

import { motion } from "motion/react"
import { SectionHeader } from "./section-header"

const features = [
  {
    title: "Runs When You Sleep",
    description:
      "Background agents continue working even when your laptop is closed. Pick up where they left off.",
  },
  {
    title: "Cloud Sandboxes",
    description:
      "Every background session runs in an isolated cloud environment. Secure, reproducible, disposable.",
  },
  {
    title: "Live Browser Previews",
    description:
      "See your dev branch running in a real browser. Toggle between desktop and mobile viewports.",
  },
]

export function LandingBackgroundAgents() {
  return (
    <section className="px-8 py-20 sm:py-28">
      <SectionHeader
        overline="Background agents"
        heading="Agents that never sleep."
        subtext="Close your laptop. Your agents keep running in isolated cloud sandboxes with live browser previews."
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
