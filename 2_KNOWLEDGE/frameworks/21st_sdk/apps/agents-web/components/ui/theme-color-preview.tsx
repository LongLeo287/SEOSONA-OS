interface ThemeColorPreviewProps {
  styles?: {
    light?: {
      primary?: string
      secondary?: string
      accent?: string
      border?: string
    }
  }
  size?: "sm" | "md" | "lg"
  className?: string
}

export function ThemeColorPreview({
  styles,
  size = "sm",
  className = "",
}: ThemeColorPreviewProps) {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
    lg: "w-4 h-4",
  }

  const circleSize = sizeClasses[size]

  return (
    <div className={`flex gap-0.5 ${className}`}>
      <div
        className={`${circleSize} rounded-full border border-border/20`}
        style={{
          backgroundColor: styles?.light?.primary,
        }}
      />
      <div
        className={`${circleSize} rounded-full border border-border/20`}
        style={{
          backgroundColor: styles?.light?.secondary,
        }}
      />
      <div
        className={`${circleSize} rounded-full border border-border/20`}
        style={{
          backgroundColor: styles?.light?.accent,
        }}
      />
      <div
        className={`${circleSize} rounded-full border border-border/20`}
        style={{
          backgroundColor: styles?.light?.border,
        }}
      />
    </div>
  )
}
