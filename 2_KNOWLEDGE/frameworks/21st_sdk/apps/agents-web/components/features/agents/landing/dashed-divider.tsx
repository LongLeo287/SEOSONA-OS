"use client"

export function DashedDivider({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`w-full h-px text-border ${className}`}
      preserveAspectRatio="none"
    >
      <line
        x1="0"
        y1="0.5"
        x2="100%"
        y2="0.5"
        stroke="currentColor"
        strokeDasharray="4 6"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function DashedBox({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`relative ${className}`}>
      {/* Top — dashed, stretches past vertical lines */}
      <div className="absolute top-0 -left-1 -right-1 sm:-left-4 sm:-right-4 h-px">
        <svg
          className="w-full h-px text-border"
          preserveAspectRatio="none"
        >
          <line
            x1="0"
            y1="0.5"
            x2="100%"
            y2="0.5"
            stroke="currentColor"
            strokeDasharray="4 6"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {/* Bottom — dashed, stretches past vertical lines */}
      <div className="absolute bottom-0 -left-1 -right-1 sm:-left-4 sm:-right-4 h-px">
        <svg
          className="w-full h-px text-border"
          preserveAspectRatio="none"
        >
          <line
            x1="0"
            y1="0.5"
            x2="100%"
            y2="0.5"
            stroke="currentColor"
            strokeDasharray="4 6"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {/* Left — solid, with vertical overlap (z-40 stays above sticky section headers z-30) */}
      <div className="absolute -top-3 left-0 w-px -bottom-3 bg-border z-40" />
      {/* Right — solid, with vertical overlap */}
      <div className="absolute -top-3 right-0 w-px -bottom-3 bg-border z-40" />
      {children}
    </div>
  )
}
