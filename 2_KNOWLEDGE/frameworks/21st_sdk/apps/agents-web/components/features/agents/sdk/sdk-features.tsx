"use client"

import { SectionHeader } from "@/components/features/agents/landing/section-header"
import { motion } from "motion/react"

const youProvide = [
  {
    label: "Repository",
    description: "Point to any GitHub repo your team has access to",
  },
  {
    label: "Prompt",
    description: "Describe the task - fix a bug, refactor, add a feature",
  },
  {
    label: "Branch (optional)",
    description: "Target a specific branch, or let the agent create one",
  },
]

const weHandle = [
  {
    title: "Remote Sandboxes",
    description:
      "Every task runs in an isolated cloud sandbox. Your repo is cloned, dependencies installed, agent ready to go.",
  },
  {
    title: "Git & PR Integration",
    description:
      "The agent commits changes, pushes branches, and opens PRs - all automatically.",
  },
  {
    title: "Async Execution",
    description:
      "Fire a task and move on. Poll for status or get notified when the PR is ready.",
  },
  {
    title: "Follow-up Messages",
    description:
      "Send additional instructions to a running task. The agent picks up where it left off.",
  },
  {
    title: "Usage & Rate Limits",
    description:
      "Built-in rate limiting, usage tracking, and API key management. No extra setup.",
  },
  {
    title: "Auto-Updates",
    description:
      "New Claude Code version - we update the runtime. Your integration stays the same.",
  },
]

export function SdkFeatures() {
  return (
    <section id="features" className="px-8 py-20 sm:py-28">
      <SectionHeader
        overline="How it works"
        heading="You bring the repo. We bring everything else."
      />

      {/* Two-column layout */}
      <div className="mt-16 grid gap-16 lg:grid-cols-2">
        {/* Your layer */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-medium text-white/30 uppercase tracking-widest mb-8">
            What you provide
          </p>
          <div className="space-y-6">
            {youProvide.map((item) => (
              <div key={item.label} className="border-l border-white/[0.1] pl-5">
                <p className="text-[15px] font-semibold text-white/90">
                  {item.label}
                </p>
                <p className="text-sm text-white/35 mt-0.5">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Our layer */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          <p className="text-xs font-medium text-white/30 uppercase tracking-widest mb-8">
            What we handle
          </p>
          <div className="grid sm:grid-cols-2">
            {weHandle.map((feature, i) => (
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
          </div>
        </motion.div>
      </div>
    </section>
  )
}
