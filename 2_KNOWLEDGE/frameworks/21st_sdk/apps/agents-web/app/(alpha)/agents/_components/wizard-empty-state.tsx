"use client"

import { useContext } from "react"
import { WizardSendContext } from "./wizard-send-context"

const SUGGESTIONS = [
  {
    label: "Deep research agent",
    prompt:
      "Create a deep research agent that conducts multi-step web research with source synthesis and citations",
  },
  {
    label: "Support agent from my docs",
    prompt:
      "Create a support agent that answers customer questions from documentation and escalates when it can't find an answer",
  },
  {
    label: "Data extraction pipeline",
    prompt:
      "Create an agent that parses unstructured text (emails, PDFs, logs) into structured JSON matching a given schema",
  },
  {
    label: "Slack incident commander",
    prompt:
      "Create an incident commander agent that triages alerts, gathers context from logs, and drafts structured incident reports",
  },
]

export function WizardEmptyState() {
  const send = useContext(WizardSendContext)

  return (
    <div className="flex flex-col items-center gap-5 px-6 max-w-[400px]">
      <div className="space-y-2 text-center">
        <h2 className="text-[18px] font-semibold text-foreground">
          What do you want to build?
        </h2>
        <p className="text-[14px] text-muted-foreground">
          Describe your agent or pick a suggestion.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2 w-full">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.label}
            onClick={() => send(s.prompt)}
            className="rounded-full border border-border px-3 py-1.5 text-[13px] text-foreground/80 hover:bg-muted hover:text-foreground transition-colors"
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}
