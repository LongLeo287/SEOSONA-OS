import * as React from "react"
import { cn } from "@/lib/utils"
import { CmdIcon, OptionIcon, ShiftIcon, EnterIcon } from "./icons"

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Size variant of the kbd element (only for pill variant)
   * @default "default"
   */
  size?: "default" | "sm" | "xs"
  /**
   * Visual variant of the kbd element
   * @default "inline" - simple inline text with icon replacement (like desktop)
   */
  variant?: "inline" | "secondary" | "primary" | "muted"
  /**
   * Use fully rounded (pill-shaped) style (only for non-inline variants)
   * @default true
   */
  roundedFull?: boolean
}

/** Parse shortcut string and replace modifier symbols with icons */
function renderShortcut(children: React.ReactNode): React.ReactNode {
  if (typeof children !== "string") return children

  const parts: React.ReactNode[] = []

  // Map of symbols to icons (h-3 w-3 = 12px to match text-xs visually)
  const symbolMap: Record<string, React.ReactNode> = {
    "⌘": <CmdIcon key="cmd" className="h-3 w-3" />,
    "⌥": <OptionIcon key="opt" className="h-3 w-3" />,
    "⇧": <ShiftIcon key="shift" className="h-3 w-3" />,
    "⌃": <span key="ctrl">⌃</span>, // Control stays as unicode (no icon)
    "↵": <EnterIcon key="enter" className="h-3 w-3" />,
  }

  // Split by symbols and replace with icons
  const regex = /([⌘⌥⇧⌃↵])/g
  const tokens = children.split(regex)

  tokens.forEach((token, index) => {
    if (symbolMap[token]) {
      parts.push(symbolMap[token])
    } else if (token) {
      parts.push(<span key={index}>{token}</span>)
    }
  })

  return parts
}

const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  (
    {
      className,
      size = "default",
      variant = "inline",
      roundedFull = true,
      children,
      ...props
    },
    ref,
  ) => {
    // Inline variant - simple text-like appearance with icon replacement (default, like desktop)
    if (variant === "inline") {
      return (
        <kbd
          ref={ref}
          className={cn(
            "pointer-events-none inline-flex items-center gap-0.5 text-xs font-medium uppercase tracking-wide text-muted-foreground/60",
            className,
          )}
          {...props}
        >
          {renderShortcut(children)}
        </kbd>
      )
    }

    // Pill/box variants for canvas UI (backwards compatibility)
    return (
      <kbd
        ref={ref}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center border font-[inherit] font-normal",
          // Rounded variant
          roundedFull ? "rounded-full" : "rounded",
          // Size variants
          {
            "h-5 min-w-5 min-h-5 max-h-full px-1 text-[11px] -me-1 ms-2":
              size === "default",
            "h-4 min-w-4 px-1 text-[10px]": size === "sm",
            "h-4 min-w-4 px-1 text-[0.5rem]": size === "xs",
          },
          // Visual variants
          {
            "border-muted bg-secondary text-secondary-foreground":
              variant === "secondary",
            "border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground/80 font-medium":
              variant === "primary",
            "border-muted-foreground/30 bg-muted-foreground/10 text-current":
              variant === "muted",
          },
          className,
        )}
        {...props}
      >
        {children}
      </kbd>
    )
  },
)
Kbd.displayName = "Kbd"

export { Kbd }
