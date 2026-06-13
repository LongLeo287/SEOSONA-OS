import React, { memo, useState, useMemo } from "react"
import { Circle } from "lucide-react"
import { IconSpinner, ExpandIcon, CollapseIcon, CheckIcon, PlanIcon, IconArrowRight, IconDoubleChevronRight } from "../icons"
import { TextShimmer } from "../components/text-shimmer"
import { getToolStatus, areToolPropsEqual } from "../utils/format-tool"
import { cn } from "../utils/cn"

export interface TodoItem {
  content: string
  status: "pending" | "in_progress" | "completed"
  activeForm?: string
}

interface TodoToolProps {
  part: any
  chatStatus?: string
}

interface TodoChange {
  todo: TodoItem
  oldStatus?: TodoItem["status"]
  newStatus: TodoItem["status"]
  index: number
}

type ChangeType = "creation" | "single" | "multiple"

interface DetectedChanges {
  type: ChangeType
  items: TodoChange[]
}

function detectChanges(oldTodos: TodoItem[], newTodos: TodoItem[]): DetectedChanges {
  if (!oldTodos || oldTodos.length === 0) {
    return {
      type: "creation",
      items: newTodos.map((todo, index) => ({ todo, newStatus: todo.status, index })),
    }
  }

  const changes: TodoChange[] = []
  newTodos.forEach((newTodo, index) => {
    const oldTodo = oldTodos[index]
    if (!oldTodo || oldTodo.status !== newTodo.status) {
      changes.push({ todo: newTodo, oldStatus: oldTodo?.status, newStatus: newTodo.status, index })
    }
  })

  if (changes.length === 1) return { type: "single", items: changes }
  return { type: "multiple", items: changes }
}

function getStatusVerb(status: TodoItem["status"], content: string): string {
  switch (status) {
    case "in_progress": return `Started: ${content}`
    case "completed": return `Finished: ${content}`
    case "pending": return `Created: ${content}`
    default: return content
  }
}

const STATUS_ICONS = {
  completed: CheckIcon,
  in_progress: IconDoubleChevronRight,
  pending: Circle,
} as const

const ProgressCircle = ({ completed, total, size = 16, className }: { completed: number; total: number; size?: number; className?: string }) => {
  const cx = size / 2
  const cy = size / 2
  const outerRadius = (size - 1) / 2
  const innerRadius = outerRadius - 1.5

  const segments = []
  for (let i = 0; i < total; i++) {
    const startAngle = (i / total) * 360 - 90
    const endAngle = ((i + 1) / total) * 360 - 90
    const gap = total > 1 ? 4 : 0
    const adjustedStartAngle = startAngle + gap / 2
    const adjustedEndAngle = endAngle - gap / 2
    const startRad = (adjustedStartAngle * Math.PI) / 180
    const endRad = (adjustedEndAngle * Math.PI) / 180
    const x1 = cx + innerRadius * Math.cos(startRad)
    const y1 = cy + innerRadius * Math.sin(startRad)
    const x2 = cx + innerRadius * Math.cos(endRad)
    const y2 = cy + innerRadius * Math.sin(endRad)
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0
    const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
    segments.push(
      <path key={i} d={pathData} fill={i < completed ? "currentColor" : "transparent"} opacity={i < completed ? 0.7 : 0.15} />,
    )
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className} style={{ color: "var(--an-tool-color-muted)" }}>
      <circle cx={cx} cy={cy} r={outerRadius} fill="none" stroke="currentColor" strokeWidth={0.5} opacity={0.3} />
      {segments}
    </svg>
  )
}

const TodoStatusIcon = ({ status, isPending }: { status: TodoItem["status"]; isPending?: boolean }) => {
  if (isPending && status === "in_progress") {
    return (
      <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--an-foreground)" }}>
        <IconArrowRight className="w-2 h-2" style={{ color: "var(--an-background)" }} />
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
        <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--an-foreground)" }}>
          <IconArrowRight className="w-2 h-2" style={{ color: "var(--an-background)" }} />
        </div>
      )
    default:
      return (
        <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0" style={{ border: "0.5px solid var(--an-foreground-muted)" }} />
      )
  }
}

const TodoChangeItem = memo(function TodoChangeItem({ change, showSeparator }: { change: TodoChange; showSeparator: boolean }) {
  const StatusIcon = STATUS_ICONS[change.newStatus] || STATUS_ICONS.pending
  return (
    <div className="flex items-center gap-1 flex-shrink-0">
      <StatusIcon className="w-3 h-3" />
      <span className="truncate">{change.todo.content}</span>
      {showSeparator && <span className="mx-0.5">,</span>}
    </div>
  )
})

const TodoListItem = memo(function TodoListItem({ todo, isPending, isLast }: { todo: TodoItem; isPending: boolean; isLast: boolean }) {
  return (
    <div
      className={cn("flex items-center gap-2 px-2.5 py-1.5", !isLast && "border-b")}
      style={{ borderColor: !isLast ? "var(--an-border-color)" : undefined }}
    >
      <TodoStatusIcon status={todo.status} isPending={isPending} />
      <span
        className={cn("text-xs truncate", todo.status === "completed" && "line-through")}
        style={{
          color: isPending || todo.status === "completed" || todo.status === "pending"
            ? "var(--an-tool-color-muted)"
            : "var(--an-tool-color)",
        }}
      >
        {todo.content}
      </span>
    </div>
  )
})

export const TodoTool = memo(function TodoTool({ part, chatStatus }: TodoToolProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { isPending } = getToolStatus(part, chatStatus)

  const isStreaming = part.state === "input-streaming"
  const oldTodos: TodoItem[] = part.output?.oldTodos || []
  const newTodos: TodoItem[] = part.input?.todos || part.output?.newTodos || []

  const isCreation = oldTodos.length === 0
  const changes = useMemo(() => detectChanges(oldTodos, newTodos), [oldTodos, newTodos])

  // Streaming placeholder
  if (isStreaming || newTodos.length === 0) {
    return (
      <div className="an-tool-todo flex items-start gap-1.5 py-0.5 rounded-md px-2">
        <div className="flex-1 min-w-0 flex items-center gap-1.5">
          <span className="text-xs" style={{ color: "var(--an-tool-color-muted)" }}>
            {isPending ? (
              <TextShimmer as="span" duration={1.2} className="inline-flex items-center text-xs leading-none h-4 m-0">
                {isCreation ? "Creating to-do list..." : "Updating to-dos..."}
              </TextShimmer>
            ) : (
              isCreation ? "Creating to-do list..." : "Updating to-dos..."
            )}
          </span>
        </div>
      </div>
    )
  }

  // Single update - compact display
  if (changes.type === "single") {
    const change = changes.items[0]
    const titleText = change.newStatus === "in_progress" && change.todo.activeForm
      ? change.todo.activeForm
      : change.todo.content

    return (
      <div className="an-tool-todo flex items-start gap-1.5 py-0.5 rounded-md px-2">
        <div className="flex-1 min-w-0 flex items-center gap-1.5">
          <div className="text-xs flex items-center gap-1.5 min-w-0" style={{ color: "var(--an-tool-color-muted)" }}>
            <span className="font-medium whitespace-nowrap flex-shrink-0">
              {isPending ? (
                <TextShimmer as="span" duration={1.2} className="inline-flex items-center text-xs leading-none h-4 m-0">
                  {getStatusVerb(change.newStatus, titleText)}
                </TextShimmer>
              ) : (
                getStatusVerb(change.newStatus, titleText)
              )}
            </span>
          </div>
        </div>
      </div>
    )
  }

  // Multiple updates - compact summary
  if (changes.type === "multiple") {
    const completedChanges = changes.items.filter(c => c.newStatus === "completed").length
    const startedChanges = changes.items.filter(c => c.newStatus === "in_progress").length

    let summaryTitle = "Updated to-dos"
    if (completedChanges > 0 && startedChanges === 0) {
      summaryTitle = `Finished ${completedChanges} ${completedChanges === 1 ? "task" : "tasks"}`
    } else if (startedChanges > 0 && completedChanges === 0) {
      summaryTitle = `Started ${startedChanges} ${startedChanges === 1 ? "task" : "tasks"}`
    } else if (completedChanges > 0 && startedChanges > 0) {
      summaryTitle = `Updated ${changes.items.length} ${changes.items.length === 1 ? "task" : "tasks"}`
    }

    const MAX_VISIBLE_ITEMS = 3
    const visibleItems = changes.items.slice(0, MAX_VISIBLE_ITEMS)
    const remainingCount = changes.items.length - MAX_VISIBLE_ITEMS

    return (
      <div className="an-tool-todo flex items-start gap-1.5 py-0.5 rounded-md px-2">
        <div className="flex-1 min-w-0 flex items-center gap-1.5">
          <div className="text-xs flex items-center gap-1.5 min-w-0" style={{ color: "var(--an-tool-color-muted)" }}>
            <span className="font-medium whitespace-nowrap flex-shrink-0">
              {isPending ? (
                <TextShimmer as="span" duration={1.2} className="inline-flex items-center text-xs leading-none h-4 m-0">
                  {summaryTitle}
                </TextShimmer>
              ) : (
                summaryTitle
              )}
            </span>
            <div className="flex items-center gap-1 font-normal truncate min-w-0" style={{ opacity: 0.6 }}>
              {visibleItems.map((c, idx) => (
                <TodoChangeItem key={idx} change={c} showSeparator={idx < visibleItems.length - 1} />
              ))}
              {remainingCount > 0 && (
                <span className="whitespace-nowrap flex-shrink-0">+{remainingCount} more</span>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Creation - full expandable list
  const displayTodos = newTodos
  const completedCount = displayTodos.filter(t => t.status === "completed").length
  const inProgressCount = displayTodos.filter(t => t.status === "in_progress").length
  const totalTodos = displayTodos.length
  const visualProgress = completedCount + inProgressCount

  const currentTask = displayTodos.find(t => t.status === "in_progress") || displayTodos.find(t => t.status === "pending")
  const currentTaskIndex = currentTask
    ? displayTodos.findIndex(t => t === currentTask) + 1
    : completedCount

  return (
    <div className="an-tool-todo mx-2">
      {/* Header */}
      <div
        className="rounded-t-lg px-2.5 py-1.5 cursor-pointer"
        style={{ border: "1px solid var(--an-tool-border-color)", borderBottom: "none", background: "var(--an-tool-background)" }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-1.5">
          <PlanIcon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--an-tool-color-muted)" }} />
          <span className="text-xs font-medium" style={{ color: "var(--an-tool-color)" }}>To-dos</span>
          <span className="text-xs truncate flex-1" style={{ color: "var(--an-tool-color-muted)" }}>
            {displayTodos[0]?.content || "To-do list"}
          </span>
          <div className="relative w-4 h-4 flex-shrink-0">
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

      {/* Bottom block */}
      <div className="rounded-b-lg" style={{ border: "1px solid var(--an-tool-border-color)", background: "var(--an-tool-background)" }}>
        {/* Collapsed view */}
        {!isExpanded && (
          <div
            className="flex items-center gap-2.5 px-2.5 py-1.5 cursor-pointer"
            onClick={() => setIsExpanded(true)}
          >
            {completedCount === totalTodos && totalTodos > 0 ? (
              <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--an-background-secondary)", border: "0.5px solid var(--an-border-color)" }}>
                <CheckIcon className="w-2.5 h-2.5" style={{ color: "var(--an-tool-color-muted)" }} />
              </div>
            ) : (
              <ProgressCircle completed={visualProgress} total={totalTodos} size={16} className="flex-shrink-0" />
            )}
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              {currentTask && (
                <span className="text-xs truncate" style={{ color: "var(--an-tool-color-muted)" }}>
                  {currentTask.status === "in_progress" ? currentTask.activeForm || currentTask.content : currentTask.content}
                </span>
              )}
              {!currentTask && completedCount === totalTodos && totalTodos > 0 && (
                <span className="text-xs truncate" style={{ color: "var(--an-tool-color-muted)" }}>
                  {displayTodos[totalTodos - 1]?.content}
                </span>
              )}
            </div>
            <span className="text-xs tabular-nums flex-shrink-0" style={{ color: "var(--an-tool-color-muted)" }}>
              {currentTaskIndex}/{totalTodos}
            </span>
          </div>
        )}

        {/* Expanded view */}
        {isExpanded && (
          <div className="max-h-[300px] overflow-y-auto cursor-pointer" onClick={() => setIsExpanded(false)}>
            {displayTodos.map((todo, idx) => (
              <TodoListItem key={idx} todo={todo} isPending={isPending} isLast={idx === displayTodos.length - 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}, areToolPropsEqual)
