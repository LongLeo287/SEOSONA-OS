"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { SectionHeader } from "@/components/features/agents/landing/section-header"
import { motion } from "motion/react"

const faqs = [
  {
    question: "What is 1Code API?",
    answer:
      "1Code API lets you start a Claude Code agent on any GitHub repo with a single API call. The agent runs in a remote sandbox - repo cloned, dependencies installed, fully isolated. It works on your task asynchronously and delivers a PR when done. Think of it as programmatic access to the same engine that powers 1Code Async.",
  },
  {
    question: "How is this different from 1Code Async?",
    answer:
      "Async comes with pre-built triggers - PR reviews, Linear tasks, GitHub issues, Slack mentions. The API gives you the same power, but you write the triggers yourself. Hook it into your CI/CD, build a Slack bot, run batch scripts - whatever workflow you need.",
  },
  {
    question: "Do I need to manage any infrastructure?",
    answer:
      "No. We handle everything - remote sandboxes, repo cloning, git operations, isolation, cleanup. You make one API call with a repo and a prompt. The agent runs in the cloud and opens a PR. No servers, no containers, no setup.",
  },
  {
    question: "How does it work?",
    answer:
      "POST to /api/v1/tasks with your repository and prompt. We spin up an isolated sandbox, clone your repo, and start Claude Code on the task. Poll the task status or send follow-up messages. When the agent is done, you get a PR.",
  },
  {
    question: "Can I send follow-up instructions?",
    answer:
      "Yes. POST to /api/v1/tasks/:id with a new prompt. The agent resumes in the same sandbox with full context - it picks up exactly where it left off.",
  },
  {
    question: "Is it secure?",
    answer:
      "Every task runs in an isolated sandbox provided by an enterprise-grade infrastructure partner with SOC 2 Type II certification. Sandboxes are created per-task and destroyed after completion. Your code never leaves the isolated environment.",
  },
  {
    question: "What can I build with it?",
    answer:
      "Anything that triggers coding tasks - CI/CD integrations, custom Slack/Discord bots, batch refactoring scripts, internal dashboards, scheduled maintenance jobs, or any workflow where you want Claude Code to work on your repos programmatically.",
  },
]

export function SdkFAQ() {
  return (
    <section className="px-8 py-20 sm:py-28">
      <SectionHeader
        overline="FAQ"
        heading="Frequently asked questions."
      />

      <motion.div
        className="mt-12 max-w-2xl"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b border-white/[0.08]"
            >
              <AccordionTrigger className="text-[15px] font-medium text-white/70 hover:text-white hover:no-underline py-5 text-left gap-6 [&>svg]:text-white/30 [&>svg]:shrink-0 transition-colors duration-150 outline-none focus-visible:text-white">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-white/35 text-sm leading-relaxed pb-5 pt-0">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </section>
  )
}
