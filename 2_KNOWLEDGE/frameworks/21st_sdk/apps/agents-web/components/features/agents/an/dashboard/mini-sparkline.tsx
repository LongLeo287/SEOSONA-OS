"use client"

import { useState, useRef, useMemo, useCallback, useId } from "react"
import ReactDOM from "react-dom"

function getSparklineDayLabels(): string[] {
  const labels: string[] = []
  const now = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    labels.push(d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }))
  }
  return labels
}

function buildSplinePath(points: { x: number; y: number }[]) {
  const pathParts: string[] = [`M ${points[0]!.x},${points[0]!.y}`]
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)]!
    const p1 = points[i]!
    const p2 = points[i + 1]!
    const p3 = points[Math.min(i + 2, points.length - 1)]!

    const tension = 6
    const cp1x = p1.x + (p2.x - p0.x) / tension
    const cp1y = p1.y + (p2.y - p0.y) / tension
    const cp2x = p2.x - (p3.x - p1.x) / tension
    const cp2y = p2.y - (p3.y - p1.y) / tension

    pathParts.push(`C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`)
  }
  return pathParts.join(" ")
}

export function MiniSparkline({
  data,
  width = 96,
  height = 28,
  color,
  label = "threads",
  interactive = true,
}: {
  data: number[]
  width?: number
  height?: number
  color?: string
  label?: string
  interactive?: boolean
}) {
  const [hoverState, setHoverState] = useState<{ index: number; screenX: number; screenY: number } | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const gradientId = useId()

  if (data.length < 2) return null
  const max = Math.max(...data, 1)
  const padding = 2
  const usableW = width - padding * 2
  const usableH = height - padding * 2

  const points = data.map((v, i) => ({
    x: padding + (i / (data.length - 1)) * usableW,
    y: padding + usableH - (v / max) * usableH,
  }))

  const linePath = buildSplinePath(points)
  const fillPath = `${linePath} L ${points[points.length - 1]!.x},${height} L ${points[0]!.x},${height} Z`
  const strokeColor = color ?? "currentColor"
  const hasActivity = data.some((v) => v > 0)

  const dayLabels = useMemo(() => getSparklineDayLabels(), [])

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!interactive) return
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const x = e.clientX - rect.left
    const segmentWidth = usableW / (data.length - 1)
    const idx = Math.min(Math.max(Math.round((x - padding) / segmentWidth), 0), data.length - 1)
    const pt = points[idx]!
    setHoverState({
      index: idx,
      screenX: rect.left + pt.x,
      screenY: rect.top,
    })
  }, [interactive, usableW, padding, data]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleMouseLeave = useCallback(() => setHoverState(null), [])

  const hoveredPoint = hoverState !== null ? points[hoverState.index] : null

  return (
    <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className={`shrink-0 ${interactive ? "cursor-crosshair" : ""}`}
        style={{ color: hasActivity ? undefined : "var(--muted-foreground)" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          <linearGradient id={`sparkFill-${gradientId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity={0.12} />
            <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <path d={fillPath} fill={`url(#sparkFill-${width}-${height})`} />
        <path
          d={linePath}
          fill="none"
          stroke={strokeColor}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={hasActivity ? 0.6 : 0.15}
        />
        {hoveredPoint && (
          <>
            <line
              x1={hoveredPoint.x}
              y1={0}
              x2={hoveredPoint.x}
              y2={height}
              stroke={strokeColor}
              strokeWidth={1}
              opacity={0.2}
            />
            <circle
              cx={hoveredPoint.x}
              cy={hoveredPoint.y}
              r={3}
              fill="hsl(var(--background))"
              stroke={strokeColor}
              strokeWidth={1.5}
              opacity={0.8}
            />
          </>
        )}
      </svg>
      {hoverState !== null && typeof document !== "undefined" &&
        ReactDOM.createPortal(
          <div
            className="pointer-events-none fixed z-[9999] rounded-md border border-border bg-popover px-2 py-1 shadow-md whitespace-nowrap"
            style={{
              left: hoverState.screenX,
              top: hoverState.screenY,
              transform: "translate(-50%, -100%) translateY(-6px)",
            }}
          >
            <div className="text-[11px] font-medium tabular-nums">{data[hoverState.index]} {label}</div>
            <div className="text-[10px] text-muted-foreground">{dayLabels[hoverState.index]}</div>
          </div>,
          document.body,
        )}
    </div>
  )
}
