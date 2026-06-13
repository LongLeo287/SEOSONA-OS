import React from "react"

interface SpinnerProps {
  size?: number
  color?: string
  className?: string
}

export const Spinner = ({
  size = 20,
  color = "currentColor",
  className,
}: SpinnerProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={`animate-spin ${className || ""}`}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity={0.2}
      />
      <path
        d="M12 2C6.48 2 2 6.48 2 12"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}
