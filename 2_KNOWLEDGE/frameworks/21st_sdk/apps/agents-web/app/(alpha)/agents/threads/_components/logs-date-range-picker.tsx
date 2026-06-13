"use client"

import { useMemo, useState } from "react"
import {
  addDays,
  addMonths,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  isWithinInterval,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/features/agents/ui/1code/{components}/ui/popover"

const PRESETS = [
  { label: "All time", value: "all" },
  { label: "Last hour", value: "1h" },
  { label: "Last 24 hours", value: "24h" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
] as const

type PresetValue = (typeof PRESETS)[number]["value"]

export interface DateRangeValue {
  preset: PresetValue | "custom"
  from?: Date
  to?: Date
}

function getTriggerLabel(
  value: DateRangeValue,
  options?: {
    allTimeLabel?: string
    customRangeLabel?: string
  },
): string {
  if (value.preset === "custom" && value.from && value.to) {
    if (options?.customRangeLabel) {
      return options.customRangeLabel
    }
    if (isSameMonth(value.from, value.to)) {
      return `${format(value.from, "MMM d")} – ${format(value.to, "d, yyyy")}`
    }
    return `${format(value.from, "MMM d")} – ${format(value.to, "MMM d, yyyy")}`
  }
  if (value.preset === "custom" && value.from) {
    if (options?.customRangeLabel) {
      return options.customRangeLabel
    }
    return `${format(value.from, "MMM d")} – …`
  }
  if (value.preset === "all" && options?.allTimeLabel) {
    return options.allTimeLabel
  }
  return PRESETS.find((p) => p.value === value.preset)?.label ?? "All time"
}

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]

function MiniCalendar({
  value,
  hoverDate,
  isSelecting,
  onDateClick,
  onMouseEnter,
}: {
  value: { start: Date | null; end: Date | null }
  hoverDate: Date | null
  isSelecting: boolean
  onDateClick: (day: Date) => void
  onMouseEnter: (day: Date) => void
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const today = useMemo(() => new Date(), [])

  const days = useMemo(() => {
    const arr: Date[] = []
    let day = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 })
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 })
    while (day <= end) {
      arr.push(day)
      day = addDays(day, 1)
    }
    return arr
  }, [currentMonth])

  return (
    <div className="w-[252px]">
      {/* Month nav */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[13px] font-medium text-foreground">
          {format(currentMonth, "MMMM yyyy")}
        </span>
        <div className="flex gap-0.5">
          <button
            type="button"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent dark:hover:bg-neutral-800 hover:text-foreground"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent dark:hover:bg-neutral-800 hover:text-foreground"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Weekday header */}
      <div className="mb-1 grid grid-cols-7 text-center">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-[11px] font-medium text-muted-foreground"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const inMonth = isSameMonth(day, currentMonth)
          const isFuture = day > today
          const isStart = value.start && isSameDay(day, value.start)
          const isEnd = value.end && isSameDay(day, value.end)
          const isHover = hoverDate && isSelecting && isSameDay(day, hoverDate)

          const inRange =
            value.start &&
            ((value.end &&
              isWithinInterval(day, {
                start: value.start,
                end: value.end,
              })) ||
              (hoverDate &&
                isSelecting &&
                (hoverDate >= value.start
                  ? isWithinInterval(day, {
                      start: value.start,
                      end: hoverDate,
                    })
                  : isWithinInterval(day, {
                      start: hoverDate,
                      end: value.start,
                    }))))

          const isDisabled = !inMonth || isFuture

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "flex items-center justify-center",
                inRange &&
                  !isStart &&
                  !isEnd &&
                  !isHover &&
                  "bg-foreground/[0.06]",
              )}
              onMouseEnter={() => !isDisabled && onMouseEnter(day)}
            >
              <button
                type="button"
                disabled={isDisabled}
                onClick={() => !isDisabled && onDateClick(day)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-md text-[13px] transition-colors",
                  isDisabled
                    ? "cursor-default text-muted-foreground/30"
                    : "cursor-pointer text-foreground hover:bg-accent dark:hover:bg-neutral-800",
                  (isStart || isEnd) &&
                    !isDisabled &&
                    "bg-primary text-primary-foreground hover:bg-primary",
                  isHover &&
                    !isDisabled &&
                    "ring-2 ring-primary bg-primary text-primary-foreground",
                  isToday(day) &&
                    !isStart &&
                    !isEnd &&
                    !isHover &&
                    !isDisabled &&
                    "bg-accent dark:bg-neutral-800 font-semibold",
                )}
              >
                {format(day, "d")}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function LogsDateRangePicker({
  value,
  onChange,
  allTimeLabel,
  customRangeLabel,
  triggerClassName,
}: {
  value: DateRangeValue
  onChange: (value: DateRangeValue) => void
  allTimeLabel?: string
  customRangeLabel?: string
  triggerClassName?: string
}) {
  const [open, setOpen] = useState(false)
  const [selectionStart, setSelectionStart] = useState<Date | null>(
    value.from ?? null,
  )
  const [selectionEnd, setSelectionEnd] = useState<Date | null>(
    value.to ?? null,
  )
  const [hoverDate, setHoverDate] = useState<Date | null>(null)
  const [isSelecting, setIsSelecting] = useState(false)

  const handlePreset = (preset: PresetValue) => {
    onChange({ preset })
    setSelectionStart(null)
    setSelectionEnd(null)
    setIsSelecting(false)
    setHoverDate(null)
    setOpen(false)
  }

  const handleDateClick = (day: Date) => {
    if (!selectionStart || (selectionStart && selectionEnd)) {
      // Start new selection
      setSelectionStart(day)
      setSelectionEnd(null)
      setHoverDate(day)
      setIsSelecting(true)
    } else if (isSelecting) {
      // Finish selection
      let from: Date
      let to: Date
      if (day >= selectionStart) {
        from = selectionStart
        to = day
      } else {
        from = day
        to = selectionStart
      }
      setSelectionStart(from)
      setSelectionEnd(to)
      setIsSelecting(false)
      setHoverDate(null)
      onChange({
        preset: "custom",
        from: startOfDay(from),
        to: endOfDay(to),
      })
      setOpen(false)
    }
  }

  const handleMouseEnter = (day: Date) => {
    if (isSelecting && selectionStart) {
      setHoverDate(day)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "an-focus-input flex h-8 items-center gap-1.5 rounded-md border border-border bg-foreground/[0.05] px-2.5 text-[12px] text-foreground/70 hover:border-foreground/15 transition-colors",
            triggerClassName,
            open && "border-foreground/15",
          )}
        >
          <CalendarIcon className="h-3 w-3 shrink-0 text-muted-foreground" />
          <span className="whitespace-nowrap">
            {getTriggerLabel(value, { allTimeLabel, customRangeLabel })}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start" sideOffset={6}>
        <div className="flex">
          {/* Presets */}
          <div className="flex w-[130px] flex-col gap-0.5 border-r-[0.5px] border-border p-1.5">
            {PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => handlePreset(preset.value)}
                className={cn(
                  "rounded-md px-2.5 py-1.5 text-left text-[12px] text-foreground/70 transition-colors hover:bg-accent dark:hover:bg-neutral-800 hover:text-foreground",
                  value.preset === preset.value &&
                    "bg-accent dark:bg-neutral-800 font-medium text-foreground",
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Calendar */}
          <div className="p-3">
            <MiniCalendar
              value={{ start: selectionStart, end: selectionEnd }}
              hoverDate={hoverDate}
              isSelecting={isSelecting}
              onDateClick={handleDateClick}
              onMouseEnter={handleMouseEnter}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
