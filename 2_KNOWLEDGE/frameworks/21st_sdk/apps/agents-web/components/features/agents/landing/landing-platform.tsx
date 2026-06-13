"use client"

import { motion } from "motion/react"
import { SectionHeader } from "./section-header"

const features = [
  {
    title: "Open Source",
    description:
      "Full source code under Apache 2.0. Build it yourself or contribute.",
  },
  {
    title: "PWA",
    description: "Install as a PWA on your phone. Start agents and monitor progress on the go.",
  },
  {
    title: "Cross Platform",
    description: "macOS desktop app. Windows and Linux via the web app and CLI.",
  },
  {
    title: "Teams",
    description:
      "Collaborate with your team. Shared workspaces, shared context.",
  },
]

export function LandingPlatform() {
  return (
    <section className="px-8 py-20 sm:py-28">
      <SectionHeader
        overline="Platform"
        heading="Run anywhere. Build together."
        subtext="macOS, web, PWA. Open source Apache 2.0."
      />

      <motion.div
        className="mt-16 space-y-6"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {features.map((feature) => (
          <div
            key={feature.title}
            className="border-l border-white/[0.1] pl-5"
          >
            <p className="text-[15px] font-semibold text-white/90">
              {feature.title}
            </p>
            <p className="text-sm text-white/35 mt-0.5">{feature.description}</p>
          </div>
        ))}
      </motion.div>
    </section>
  )
}
