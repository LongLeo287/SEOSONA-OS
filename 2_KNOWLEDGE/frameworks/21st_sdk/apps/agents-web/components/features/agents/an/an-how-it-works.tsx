"use client"

import { SectionHeader } from "@/components/features/agents/landing/section-header"
import { motion } from "motion/react"

function DefineCodeSnippet() {
  return (
    <div className="mt-4 rounded border border-foreground/[0.08] bg-muted p-3 font-mono text-[10px] leading-[1.7] space-y-[2px]">
      <div>
        <span className="text-violet-400/60">const</span>{" "}
        <span className="text-foreground/50">agent</span>{" "}
        <span className="text-foreground/30">=</span>{" "}
        <span className="text-emerald-400/70">createAgent</span>
        <span className="text-foreground/30">{"({"}</span>
      </div>
      <div className="pl-4">
        <span className="text-foreground/40">runtime:</span>{" "}
        <span className="text-amber-300/45">&apos;claude-code&apos;</span>
        <span className="text-foreground/30">,</span>
      </div>
      <div className="pl-4">
        <span className="text-foreground/40">tools:</span>{" "}
        <span className="text-foreground/30">[</span>
        <span className="text-foreground/50">searchDocs</span>
        <span className="text-foreground/30">,</span>{" "}
        <span className="text-foreground/50">createTicket</span>
        <span className="text-foreground/30">,</span>{" "}
        <span className="text-foreground/50">queryDB</span>
        <span className="text-foreground/30">],</span>
      </div>
      <div>
        <span className="text-foreground/30">{"})"}</span>
      </div>
    </div>
  )
}

function EmbedCodeSnippet() {
  return (
    <div className="mt-4 rounded border border-foreground/[0.08] bg-muted p-3 font-mono text-[10px] leading-[1.7] space-y-[2px]">
      <div>
        <span className="text-foreground/30">&lt;</span>
        <span className="text-emerald-400/70">AgentChat</span>
      </div>
      <div className="pl-4">
        <span className="text-foreground/40">agent</span>
        <span className="text-foreground/30">={"{"}</span>
        <span className="text-foreground/50">agent</span>
        <span className="text-foreground/30">{"}"}</span>
      </div>
      <div className="pl-4">
        <span className="text-foreground/40">userId</span>
        <span className="text-foreground/30">={"{"}</span>
        <span className="text-foreground/50">user.id</span>
        <span className="text-foreground/30">{"}"}</span>
      </div>
      <div>
        <span className="text-foreground/30">/&gt;</span>
      </div>
    </div>
  )
}

function DeployCodeSnippet() {
  return (
    <div className="mt-4 rounded border border-foreground/[0.08] bg-muted p-3 font-mono text-[10px] leading-[1.7]">
      <div>
        <span className="text-foreground/40">$</span>{" "}
        <span className="text-foreground/50">npx 21st agents deploy</span>
      </div>
    </div>
  )
}

const steps = [
  {
    title: "Define",
    description:
      "Pick your runtime. Add your tools and system prompt.",
    code: DefineCodeSnippet,
  },
  {
    title: "Embed",
    description:
      "One component. Chat UI, streaming, file attachments.",
    code: EmbedCodeSnippet,
  },
  {
    title: "Deploy",
    description:
      "Sandboxes, API security, observability — handled.",
    code: DeployCodeSnippet,
  },
]

export function AnHowItWorks() {
  return (
    <section id="how-it-works" className="px-8 py-20 sm:py-28">
      <SectionHeader
        overline="HOW IT WORKS"
        heading="Three steps to a production agent."
        maxHeadingWidth="24ch"
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
            <p className="text-sm text-white/35 mt-1 leading-relaxed">
              {step.description}
            </p>
            <step.code />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
