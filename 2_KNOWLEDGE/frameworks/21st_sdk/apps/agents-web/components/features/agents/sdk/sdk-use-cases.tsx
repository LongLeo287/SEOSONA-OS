"use client"

import { SectionHeader } from "@/components/features/agents/landing/section-header"
import { motion } from "motion/react"

const useCases = [
  {
    title: "CI/CD Integration",
    description:
      "Trigger Claude Code on every failing build or flaky test. The agent reads logs, fixes the issue, and opens a PR.",
    tools: ["POST /api/v1/tasks", "webhook", "ci_pipeline"],
  },
  {
    title: "Custom Slack/Discord Bot",
    description:
      "Build your own @bot that runs Claude Code on demand. Your team messages a task, gets a PR back.",
    tools: ["POST /api/v1/tasks", "slack_webhook", "GET /api/v1/tasks/:id"],
  },
  {
    title: "Batch Operations",
    description:
      "Script bulk changes across repos - update dependencies, migrate APIs, fix lint issues. One loop, many PRs.",
    tools: ["POST /api/v1/tasks", "GET /api/v1/tasks", "cron"],
  },
]

export function SdkUseCases() {
  return (
    <section className="px-8 py-20 sm:py-28">
      <SectionHeader
        overline="Use cases"
        heading="Build your own triggers."
      />

      <div className="mt-16 grid gap-x-8 sm:grid-cols-3 sm:grid-rows-[auto_auto_auto]">
        {useCases.map((useCase, index) => (
          <motion.div
            key={useCase.title}
            className="grid grid-rows-subgrid row-span-3 gap-0"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
          >
            <h3 className="text-[15px] font-semibold text-white/90">
              {useCase.title}
            </h3>
            <p className="mt-2.5 text-sm text-white/35 leading-relaxed">
              {useCase.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-1.5 content-start">
              {useCase.tools.map((tool) => (
                <code
                  key={tool}
                  className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] text-white/40"
                >
                  {tool}
                </code>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
