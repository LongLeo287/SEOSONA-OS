"use client"

import { motion } from "motion/react"
import { SectionHeader } from "./section-header"

const features = [
  {
    title: "Integrated Terminal",
    description:
      "Full xterm.js terminal. Run commands, see output, without switching windows.",
  },
  {
    title: "Voice Input",
    description:
      "Hold to talk. Describe your task out loud and let the agent work.",
  },
  {
    title: "Kanban Board",
    description:
      "Visualize your agent sessions as a kanban board. Track progress at a glance.",
  },
  {
    title: "Message Queue",
    description:
      "Queue up prompts while an agent is working. They execute in order.",
  },
  {
    title: "Inline Comments",
    description:
      "Select any text in an agent response and instantly send a follow-up about that selection.",
  },
]

export function LandingDevEx() {
  return (
    <section className="px-8 py-20 sm:py-28">
      <SectionHeader
        overline="Developer experience"
        heading="Built for developers who ship."
        subtext="Every detail designed for fast, focused coding sessions."
      />

      <motion.div
        className="mt-16 grid sm:grid-cols-2"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {features.map((feature, i) => (
          <div
            key={feature.title}
            className={`py-4 sm:py-5 border-b border-white/[0.06] ${i % 2 === 1 ? "sm:pl-5" : "sm:pr-5"}`}
          >
            <p className="text-[15px] font-semibold text-white/90">
              {feature.title}
            </p>
            <p className="text-sm text-white/35 mt-1.5 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </motion.div>
    </section>
  )
}
