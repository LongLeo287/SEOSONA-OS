"use client"

import { motion } from "motion/react"
import { SectionHeader } from "./section-header"

const steps = [
  {
    title: "Connect your agent",
    description: "Sign in with Anthropic, OpenAI, or bring your own API key.",
  },
  {
    title: "Run agents anywhere",
    description: "Launch from the desktop app or the web.",
  },
  {
    title: "Ship from the UI",
    description:
      "Open PRs, review diffs, and merge - all in one place.",
  },
]

export function LandingHowItWorks() {
  return (
    <section className="px-8 py-20 sm:py-28">
      <SectionHeader
        overline="Getting started"
        heading="Three steps to shipping."
      />

      <div className="mt-16 grid gap-4 sm:grid-cols-3">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            className="border-l border-white/[0.1] pl-5"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.04 }}
          >
            <p className="text-[11px] font-mono text-white/25 mb-2">
              0{index + 1}
            </p>
            <p className="text-[15px] font-semibold text-white/90">
              {step.title}
            </p>
            <p className="text-sm text-white/35 mt-0.5">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
