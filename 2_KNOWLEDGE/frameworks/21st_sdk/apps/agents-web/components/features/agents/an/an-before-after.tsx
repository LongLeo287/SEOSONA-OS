"use client"

import { SectionHeader } from "@/components/features/agents/landing/section-header"
import { motion } from "motion/react"

const comparisonItems = [
  { label: "User sessions & chat history", without: "Build from scratch", with: "Included" },
  { label: "Streaming & reliability", without: "Custom WebSocket layer", with: "Included" },
  { label: "Sandboxed tool execution", without: "Manage infra yourself", with: "Included" },
  { label: "Usage limits & plans", without: "Build plan logic + metering", with: "Included" },
  { label: "Traces & debugging", without: "Stitch observability tools", with: "Included" },
  { label: "Agent UI components", without: "Design & build from zero", with: "Included" },
]

export function AnBeforeAfter() {
  return (
    <section className="px-8 py-20 sm:py-28">
      <SectionHeader
        overline="Build vs. buy"
        heading="Your team shouldn't build agent infrastructure."
        maxHeadingWidth="28ch"
      />

      <motion.div
        className="mt-16 overflow-x-auto"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.08 }}
      >
        <table className="w-full min-w-[540px]">
          <thead>
            <tr className="text-left text-[11px] font-mono uppercase tracking-widest">
              <th className="pb-4 text-white/25 font-medium" />
              <th className="pb-4 text-red-400/60 font-medium">Without An</th>
              <th className="pb-4 text-emerald-400/60 font-medium">
                With An
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisonItems.map((item, index) => (
              <motion.tr
                key={item.label}
                className="border-t border-white/[0.06]"
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, delay: index * 0.03 }}
              >
                <td className="py-4 pr-8 text-[15px] font-medium text-white/80">
                  {item.label}
                </td>
                <td className="py-4 pr-8 text-sm text-white/35">
                  {item.without}
                </td>
                <td className="py-4 text-sm text-emerald-400/70 font-medium">
                  {item.with}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      <motion.p
        className="mt-10 text-[17px] text-white/40 max-w-[52ch] leading-relaxed"
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        Mandatory, non-differentiating work. We built it so you
        don&apos;t&nbsp;have&nbsp;to.
      </motion.p>
    </section>
  )
}
