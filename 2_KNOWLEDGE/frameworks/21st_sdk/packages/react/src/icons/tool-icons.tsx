/* Tool icons — all normalized to viewBox 0 0 16 16 for consistent sizing */

export function LightbulbIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className ?? "w-4 h-4 shrink-0 text-muted-foreground"}>
      <path d="M8 1.385c-2.23 0-4.035 1.793-4.035 3.985 0 .782.193 1.525.56 2.147.09.161.181.312.281.473.454.725.86 1.386.86 2.08a.63.63 0 0 0 .624.625.63.63 0 0 0 .625-.625c.01-1.064-.553-1.972-1.041-2.75l-.27-.448a3 3 0 0 1-.389-1.512C5.215 3.853 6.46 2.625 8 2.625s2.785 1.228 2.785 2.735c0 .558-.137 1.084-.39 1.512l-.269.449-.01.016c-.475.773-1.03 1.675-1.03 2.723a.63.63 0 0 0 .55.62v.015h.074a.63.63 0 0 0 .625-.625c0-.684.406-1.355.859-2.08v-.002l.001-.001q.067-.117.139-.233t.141-.237c.367-.622.56-1.365.56-2.147 0-2.202-1.815-3.985-4.035-3.985m-1.6 10.19a.63.63 0 0 0-.625.625.63.63 0 0 0 .625.625h3.2a.63.63 0 0 0 .625-.625.63.63 0 0 0-.625-.625zm.8 1.8a.63.63 0 0 0-.625.625.63.63 0 0 0 .625.625h1.6A.63.63 0 0 0 9.425 14a.63.63 0 0 0-.625-.625z" />
    </svg>
  )
}

export function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className ?? "w-4 h-4 shrink-0 text-muted-foreground"}>
      <path d="M7.67 2.33l.93 2.47 2.47.93-2.47.93-.93 2.47-.93-2.47-2.47-.93 2.47-.93.93-2.47zM12 8.33l.53 1.4 1.4.53-1.4.53-.53 1.4-.53-1.4-1.4-.53 1.4-.53.53-1.4z" />
    </svg>
  )
}

export function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className ?? "w-4 h-4 shrink-0 text-muted-foreground"}>
      <path
        d="M7.33 12c2.58 0 4.67-2.09 4.67-4.67S9.91 2.67 7.33 2.67 2.67 4.76 2.67 7.33 4.76 12 7.33 12z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M13.33 13.33l-2.63-2.63"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function TerminalIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className ?? "w-4 h-4 shrink-0 text-muted-foreground"}>
      <path
        d="M5 5.33l1.17 1.17L5 7.67M8 7.67h1.33M4.67 13.33h6.67c1.1 0 2-0.9 2-2V4.67c0-1.1-0.9-2-2-2H4.67c-1.1 0-2 0.9-2 2v6.67c0 1.1 0.9 2 2 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ChevronRightIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 16 16" fill="currentColor"
      className="shrink-0 text-muted-foreground transition-transform duration-150"
      style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)" }}
    >
      <path d="M6.722 3.238a.625.625 0 1 0-.884.884L9.716 8l-3.878 3.878a.625.625 0 0 0 .884.884l4.32-4.32a.625.625 0 0 0 0-.884z" />
    </svg>
  )
}

export function SpinnerIcon16({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className ?? "w-4 h-4 shrink-0 animate-spin text-muted-foreground"}>
      <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="28" strokeDashoffset="8" strokeLinecap="round" />
    </svg>
  )
}

export function CheckIcon16({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className ?? "w-4 h-4 shrink-0 text-muted-foreground"}>
      <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0" />
    </svg>
  )
}

export const ChevronDown = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className ?? "w-2.5 h-2.5 text-muted-foreground shrink-0"}>
    <path d="m4 6 4 4 4-4" />
  </svg>
)
