"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { DISCORD_1CODE_OPENSOURCE } from "@/lib/config/discord"
import { motion } from "motion/react"
import Link from "next/link"
import { SectionHeader } from "./section-header"

const faqs = [
  {
    question: "What is 1Code?",
    answer:
      "1Code is an open-source app for running coding agents visually. Run multiple sessions in parallel, track progress, review diffs, and ship PRs - all from one interface.",
  },
  {
    question: "Which coding agents are supported?",
    answer:
      "Claude Code and OpenAI Codex. Switch between agents instantly within the app.",
  },
  {
    question: "Is 1Code open source?",
    answer: (
      <>
        Yes, fully open source. Check out the{" "}
        <Link
          href="https://github.com/21st-dev/1Code"
          target="_blank"
          className="underline underline-offset-4 hover:text-white"
        >
          GitHub repository
        </Link>
        .
      </>
    ),
  },
  {
    question: "How does authentication work?",
    answer:
      "Flexible. Use your Claude Pro or Max subscription, bring your own API key, or replace the base URL with any compatible provider like OpenRouter or GLM.",
  },
  {
    question: "How is 1Code different from the CLI?",
    answer:
      "1Code adds a visual layer on top. Track multiple agents at once, view diffs visually, preview changes in worktrees, and manage everything without memorizing terminal commands.",
  },
  {
    question: "How is 1Code different from Claude Desktop?",
    answer:
      "1Code is built for coding with multiple agents. Full terminal, GitHub integration, visual diffs, worktree management, and the ability to switch between Claude Code and Codex instantly. Claude Desktop is great for chat - 1Code is for shipping code.",
  },
  {
    question: "How is 1Code different from Conductor?",
    answer:
      "More flexibility. Work locally with or without worktrees, manage git yourself or let us handle it. Background agents with browser preview, and a PWA to continue from your phone.",
  },
  {
    question: "What operating systems are supported?",
    answer:
      "Desktop app for macOS. For Windows and Linux, use the web app - same experience with full local execution through our CLI.",
  },
  {
    question: "Is my code sent to your servers?",
    answer:
      "No. 1Code communicates directly with the model provider using your account. Your code and conversations never pass through our servers.",
  },
  {
    question: "How do I get help?",
    answer: (
      <>
        Join the{" "}
        <Link
          href={DISCORD_1CODE_OPENSOURCE}
          target="_blank"
          className="underline underline-offset-4 hover:text-white"
        >
          Discord community
        </Link>{" "}
        to get help, report issues, or request features.
      </>
    ),
  },
]

export function LandingFAQ() {
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
