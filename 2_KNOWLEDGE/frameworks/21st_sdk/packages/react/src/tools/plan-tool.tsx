import React, { memo, useState } from "react"
import { Circle, SkipForward, FileCode2 } from "lucide-react"
import { IconSpinner, ExpandIcon, CollapseIcon, CheckIcon, PlanIcon } from "../icons"
import { TextShimmer } from "../components/text-shimmer"
import { getToolStatus } from "../utils/format-tool"
import { cn } from "../utils/cn"

interface PlanStep {
  id: string
  title: string
  description?: string
  files?: readonly string[] | string[]
  estimatedComplexity?: "low" | "medium" | "high"
  status: "pending" | "in_progress" | "completed" | "skipped"
}

interface Plan {
  id: string
  title: string
  summary?: string
  steps: readonly PlanStep[] | PlanStep[]
  status: "draft" | "awaiting_approval" | "approved" | "in_progress" | "completed"
}

interface PlanToolProps {
  part: {
    type: string
    toolCallId: string
    state?: string
    input?: {
      action?: "create" | "update" | "approve" | "complete"
      plan?: Plan
    }
    output?: {
      success?: boolean
      message?: string
    }
  }
  chatStatus?: string
}

const StepStatusIcon = ({ status, isPending }: { status: PlanStep["status"]; isPending?: boolean }) => {
  if (isPending && status === "in_progress") {
    return (
      <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0" style={{ border: "0.5px solid var(--an-foreground-muted)" }}>
        <IconSpinner className="w-2.5 h-2.5" />
      </div>
    )
  }

  switch (status) {
    case "completed":
      return (
        <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--an-background-secondary)", border: "0.5px solid var(--an-border-color)" }}>
          <CheckIcon className="w-2 h-2" style={{ color: "var(--an-tool-color-muted)" }} />
        </div>
      )
    case "in_progress":
      return (
        <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0" style={{ border: "0.5px solid var(--an-foreground-muted)" }}>
          <IconSpinner className="w-2.5 h-2.5" />
        </div>
      )
    case "skipped":
      return (
        <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--an-background-secondary)", border: "0.5px solid var(--an-border-color)" }}>
          <SkipForward className="w-2 h-2" style={{ color: "var(--an-tool-color-muted)" }} />
        </div>
      )
    default:
      return (
        <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0" style={{ border: "0.5px solid var(--an-foreground-muted)" }} />
      )
  }
}

const ComplexityBadge = ({ complexity }: { complexity?: "low" | "medium" | "high" }) => {
  if (!complexity) return null
  return (
    <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: "var(--an-background-secondary)", color: "var(--an-tool-color-muted)" }}>
      {complexity}
    </span>
  )
}

export const PlanTool = memo(function PlanTool({ part, chatStatus }: PlanToolProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { isPending } = getToolStatus(part, chatStatus)

  const plan = part.input?.plan
  const action = part.input?.action || "create"

  if (!plan) return null

  const steps = plan.steps || []
  const completedCount = steps.filter(s => s.status === "completed").length
  const inProgressCount = steps.filter(s => s.status === "in_progress").length
  const totalSteps = steps.length

  const getHeaderTitle = () => {
    if (isPending) {
      if (action === "create") return "Creating plan..."
      if (action === "approve") return "Approving plan..."
      if (action === "complete") return "Completing plan..."
      return "Updating plan..."
    }
    if (plan.status === "awaiting_approval") return "Plan ready for review"
    if (plan.status === "completed") return "Plan completed"
    if (plan.status === "approved") return "Plan approved"
    return plan.title
  }

  const getProgressText = () => {
    if (totalSteps === 0) return null
    if (completedCount === totalSteps) return `${completedCount} of ${totalSteps} Completed`
    if (inProgressCount > 0) return `${completedCount} of ${totalSteps} Completed, ${inProgressCount} in progress`
    return `${completedCount} of ${totalSteps} Completed`
  }

  return (
    <div
      className="an-tool-plan rounded-lg overflow-hidden mx-2"
      style={{ border: "1px solid var(--an-tool-border-color)", background: "var(--an-tool-background)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-2.5 py-2 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <PlanIcon className="w-4 h-4 flex-shrink-0" style={{ color: "var(--an-tool-color-muted)" }} />
          <div className="flex flex-col min-w-0 flex-1">
            {isPending ? (
              <TextShimmer as="span" duration={1.2} className="text-xs font-medium">{getHeaderTitle()}</TextShimmer>
            ) : (
              <span className="text-xs font-medium truncate" style={{ color: "var(--an-tool-color)" }}>{getHeaderTitle()}</span>
            )}
            {plan.summary && !isExpanded && (
              <span className="text-[11px] truncate" style={{ color: "var(--an-tool-color-muted)", opacity: 0.6 }}>
                {plan.summary}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          {isPending && <IconSpinner className="w-3 h-3" />}
          {totalSteps > 0 && !isPending && (
            <span className="text-xs" style={{ color: "var(--an-tool-color-muted)" }}>{completedCount}/{totalSteps}</span>
          )}
          <div className="relative w-4 h-4">
            <ExpandIcon
              className={cn("absolute inset-0 w-4 h-4 transition-opacity duration-200", isExpanded ? "opacity-0" : "opacity-100")}
              style={{ color: "var(--an-tool-color-muted)" }}
            />
            <CollapseIcon
              className={cn("absolute inset-0 w-4 h-4 transition-opacity duration-200", isExpanded ? "opacity-100" : "opacity-0")}
              style={{ color: "var(--an-tool-color-muted)" }}
            />
          </div>
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div style={{ borderTop: "1px solid var(--an-tool-border-color)" }}>
          {plan.summary && (
            <div className="px-2.5 py-2 text-xs" style={{ color: "var(--an-tool-color-muted)", borderBottom: "1px solid var(--an-tool-border-color)" }}>
              {plan.summary}
            </div>
          )}

          {totalSteps > 0 && (
            <div className="px-2.5 py-2" style={{ borderBottom: "1px solid var(--an-tool-border-color)" }}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs" style={{ color: "var(--an-tool-color-muted)" }}>{getProgressText()}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--an-background-secondary)" }}>
                <div
                  className="h-full transition-all duration-300 ease-out"
                  style={{ width: `${(completedCount / totalSteps) * 100}%`, background: "var(--an-tool-color-muted)", opacity: 0.5 }}
                />
              </div>
            </div>
          )}

          <div className="max-h-[300px] overflow-y-auto">
            {steps.map((step, idx) => (
              <div
                key={step.id}
                className="px-2.5 py-2"
                style={{ borderBottom: idx !== steps.length - 1 ? "1px solid var(--an-tool-border-color)" : undefined, opacity: idx !== steps.length - 1 ? undefined : undefined }}
              >
                <div className="flex items-start gap-2">
                  <StepStatusIcon status={step.status} isPending={isPending} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn("text-xs font-medium", (step.status === "completed" || step.status === "skipped") && "line-through")}
                        style={{ color: step.status === "completed" || step.status === "skipped" ? "var(--an-tool-color-muted)" : "var(--an-tool-color)" }}
                      >
                        {step.title}
                      </span>
                      <ComplexityBadge complexity={step.estimatedComplexity} />
                    </div>
                    {step.description && (
                      <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: "var(--an-tool-color-muted)", opacity: 0.7 }}>
                        {step.description}
                      </p>
                    )}
                    {step.files && step.files.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {step.files.map((file, fileIdx) => (
                          <span
                            key={fileIdx}
                            className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded"
                            style={{ background: "var(--an-background-secondary)", color: "var(--an-tool-color-muted)" }}
                          >
                            <FileCode2 className="w-2.5 h-2.5" />
                            {file.split("/").pop()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {plan.status === "awaiting_approval" && (
            <div className="px-2.5 py-2" style={{ borderTop: "1px solid var(--an-tool-border-color)", background: "var(--an-background-secondary)" }}>
              <span className="text-xs" style={{ color: "var(--an-tool-color-muted)" }}>Awaiting your approval to proceed</span>
            </div>
          )}

          {plan.status === "completed" && (
            <div className="px-2.5 py-2" style={{ borderTop: "1px solid var(--an-tool-border-color)", background: "var(--an-background-secondary)" }}>
              <span className="text-xs" style={{ color: "var(--an-tool-color-muted)" }}>Plan completed successfully</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
})
