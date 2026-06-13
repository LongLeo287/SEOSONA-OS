"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { DISCORD_1CODE_OPENSOURCE } from "@/lib/config/discord"
import Link from "next/link"

const faqs = [
  {
    question: "What is 1Code?",
    answer:
      "1Code is an open-source app that provides a calm, visual interface for Claude Code. It lets you run multiple coding sessions in parallel, track progress visually, and manage your AI-assisted development workflow more effectively.",
  },
  {
    question: "Is 1Code open source?",
    answer: (
      <>
        Yes! 1Code is fully open source. Check out our{" "}
        <Link
          href="https://github.com/21st-dev/1Code"
          target="_blank"
          className="underline underline-offset-4 hover:text-foreground"
        >
          GitHub repository
        </Link>{" "}
        to see the code, contribute, or report issues.
      </>
    ),
  },
  {
    question: "Do I need a Claude subscription?",
    answer:
      "Yes, 1Code works with your Claude Pro or Max subscription. Sign in with your Anthropic account and use your existing subscription. We charge separately for the 1Code app.",
  },
  {
    question: "How is 1Code different from Claude Code CLI?",
    answer:
      "1Code adds a visual interface for people who prefer seeing their work. Track multiple agents at once, view diffs visually, preview changes in worktrees, and manage everything without memorizing terminal commands.",
  },
  {
    question: "How is 1Code different from Claude Desktop?",
    answer:
      "1Code is built for coding. It has a full terminal, GitHub integration, visual diff previews, and worktree management. Claude Desktop is great for chat — 1Code is built for shipping code.",
  },
  {
    question: "How is 1Code different from Conductor?",
    answer:
      "1Code gives you more flexibility: work locally with or without worktrees — manage git yourself or let us handle it. We also offer background agents with browser preview, and a mobile-friendly interface so you can continue chatting from your phone.",
  },
  {
    question: "Can I run multiple sessions at once?",
    answer:
      "Yes! One of the key features of 1Code is parallel workflows. You can work on multiple projects or tasks simultaneously, each in its own session, without context switching or losing track of progress.",
  },
  {
    question: "What operating systems are supported?",
    answer:
      "The desktop app is available for macOS. For Windows and Linux, use our web app — it provides the same experience with full local execution through our CLI.",
  },
  {
    question: "Is my code sent to 21st.dev servers?",
    answer:
      "No. 1Code communicates directly with Anthropic using your account. Your code and conversations stay between you and Anthropic. We don't process, store, or have access to your code.",
  },
  {
    question: "Is 1Code affiliated with Anthropic or OpenAI?",
    answer:
      "No. 1Code is an independent product by 21st.dev. We're not affiliated with Anthropic or OpenAI. We just built a better interface for developers who love coding agents.",
  },
  {
    question: "How do I get help or report issues?",
    answer: (
      <>
        You can join our{" "}
        <Link
          href={DISCORD_1CODE_OPENSOURCE}
          target="_blank"
          className="underline underline-offset-4 hover:text-foreground"
        >
          Discord community
        </Link>{" "}
        to get help, report issues, or request features. We're actively developing 1Code and love hearing from users.
      </>
    ),
  },
]

export function AgentsFAQ() {
  return (
    <section className="py-10 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-foreground mb-2">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to know about 1Code
          </p>
        </div>

        <div className="mt-16 mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="rounded-xl border border-border/40 dark:border-white/10 px-5 bg-background/80 dark:bg-white/[0.03] overflow-hidden transition-colors data-[state=open]:bg-muted/30 dark:data-[state=open]:bg-white/[0.06] border-b-0"
              >
                <AccordionTrigger className="text-base font-medium text-foreground hover:no-underline py-4 text-left gap-4 [&>svg]:text-muted-foreground [&>svg]:h-5 [&>svg]:w-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-[15px] leading-relaxed">
                  <div className="pb-4">{faq.answer}</div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
