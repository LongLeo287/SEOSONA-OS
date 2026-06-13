import React from "react"

interface CanvasIconProps {
  className?: string
  size?: number
  color?: string
}

export const CanvasIcon: React.FC<CanvasIconProps> = ({
  className = "",
  size = 24,
  color = "currentColor",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M19.9997 5V19M19.9997 5H11.9997M19.9997 5H21M19.9997 19H3.99971M19.9997 19H3H3.99971M19.9997 19H21M11.9997 5H3.99971M11.9997 5V3M3.99971 19V5M3.99971 5H3"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}
