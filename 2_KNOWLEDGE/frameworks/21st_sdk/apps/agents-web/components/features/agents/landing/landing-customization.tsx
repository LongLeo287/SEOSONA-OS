"use client"

import { motion } from "motion/react"
import { SectionHeader } from "./section-header"

const features = [
  {
    title: "VS Code Themes",
    description: "Import any VS Code theme. Your editor, your colors.",
  },
  {
    title: "Custom Agents",
    description:
      "Create sub-agents with their own model, tools, and system prompts.",
  },
  {
    title: "Bring Your Own Key",
    description:
      "Use OpenAI, Ollama, or any compatible model. Not locked into one provider.",
  },
  {
    title: "Plugins",
    description:
      "Extend 1Code with plugins. Build your own or use community plugins.",
  },
]

export function LandingCustomization() {
  return (
    <section className="px-8 py-20 sm:py-28">
      <SectionHeader
        overline="Customization"
        heading="Make it yours."
        subtext="Import your VS Code theme, create custom agents, bring your own models and API keys."
      />

      <div className="mt-16 grid gap-4 sm:grid-cols-2">
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
