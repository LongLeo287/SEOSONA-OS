"use client"

import { cn } from "@/lib/utils"

interface CursorInstallButtonProps {
  href: string
  className?: string
  disabled?: boolean
  onClick?: () => void
}

export function CursorInstallButton({
  href,
  className,
  disabled = false,
  onClick,
}: CursorInstallButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault()
      return
    }
    onClick?.()
  }

  return (
    <a
      href={disabled ? undefined : href}
      onClick={handleClick}
      className={cn(
        "inline-block transition-opacity",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className,
      )}
      target="_blank"
      rel="noopener noreferrer"
    >
      {/* Dark theme button (visible in light mode) */}
      <img
        src="https://cursor.com/deeplink/mcp-install-dark.svg"
        alt="Add @21st-dev/magic MCP server to Cursor"
        height="32"
        className="dark:hidden"
      />
      {/* Light theme button (visible in dark mode) */}
      <img
        src="https://cursor.com/deeplink/mcp-install-light.svg"
        alt="Add @21st-dev/magic MCP server to Cursor"
        height="32"
        className="hidden dark:block"
      />
    </a>
  )
}
