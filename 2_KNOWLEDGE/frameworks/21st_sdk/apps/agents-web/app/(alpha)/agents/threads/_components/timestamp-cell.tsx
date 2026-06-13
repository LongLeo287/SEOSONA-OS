"use client"

import { useMemo } from "react"
import { format, formatDistanceToNow } from "date-fns"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

function pad2(n: number) {
  return n.toString().padStart(2, "0")
}

export function TimestampCell({
  date,
  className,
}: {
  date: string | Date
  className?: string
}) {
  const d = useMemo(() => new Date(date), [date])

  const shortParts = useMemo(() => {
    const mon = format(d, "MMM").toUpperCase()
    const day = pad2(d.getDate())
    const h = pad2(d.getHours())
    const m = pad2(d.getMinutes())
    const s = pad2(d.getSeconds())
    const ms = pad2(Math.floor(d.getMilliseconds() / 10))
    return {
      date: `${mon} ${day} `,
      time: `${h}:${m}:${s}`,
      ms: `.${ms}`,
    }
  }, [d])

  const localParts = useMemo(() => {
    const ms = pad2(Math.floor(d.getMilliseconds() / 10))
    return {
      date: format(d, "MMM d, yyyy "),
      time: format(d, "h:mm:ss"),
      ms: `.${ms}`,
      suffix: format(d, " a"),
    }
  }, [d])

  const utcParts = useMemo(() => {
    const mon = format(d, "MMM").toUpperCase()
    return {
      date: `${mon} ${pad2(d.getUTCDate())}, ${d.getUTCFullYear()} `,
      time: `${pad2(d.getUTCHours())}:${pad2(d.getUTCMinutes())}:${pad2(d.getUTCSeconds())}`,
      ms: `.${pad2(Math.floor(d.getUTCMilliseconds() / 10))}`,
      suffix: " UTC",
    }
  }, [d])

  const relative = useMemo(
    () => formatDistanceToNow(d, { addSuffix: true }),
    [d],
  )

  return (
    <Tooltip delayDuration={500}>
      <TooltipTrigger asChild>
        <span className={className}>
          <span className="text-muted-foreground">{shortParts.date}</span>
          {shortParts.time}
          <span className="text-muted-foreground">{shortParts.ms}</span>
        </span>
      </TooltipTrigger>
      <TooltipContent side="bottom" align="start" className="text-xs">
        <div className="flex flex-col gap-1 py-0.5">
          <div className="flex items-baseline gap-2">
            <span className="w-12 text-[10px] text-muted-foreground">Local</span>
            <span className="tabular-nums">
              <span className="text-muted-foreground">{localParts.date}</span>
              {localParts.time}
              <span className="text-muted-foreground">{localParts.ms}{localParts.suffix}</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="w-12 text-[10px] text-muted-foreground">UTC</span>
            <span className="tabular-nums">
              <span className="text-muted-foreground">{utcParts.date}</span>
              {utcParts.time}
              <span className="text-muted-foreground">{utcParts.ms}{utcParts.suffix}</span>
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="w-12 text-[10px] text-muted-foreground">Relative</span>
            <span>{relative}</span>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
