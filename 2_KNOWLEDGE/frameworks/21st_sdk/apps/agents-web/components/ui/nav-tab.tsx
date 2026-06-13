import { cn } from "@/lib/utils"
import { type LucideIcon } from "lucide-react"
import { type ComponentType, forwardRef } from "react"

interface NavTabProps {
  icon: LucideIcon | ComponentType<{ className?: string }>
  label: string
  isActive?: boolean
  onClick?: () => void
  className?: string
  isFocused?: boolean
}

export const NavTab = forwardRef<HTMLButtonElement, NavTabProps>(
  (
    {
      icon: Icon,
      label,
      isActive = false,
      onClick,
      className,
      isFocused = false,
    },
    ref,
  ) => {
    const iconClassName = cn(
      "h-4 w-4 flex-shrink-0",
      isActive
        ? "text-foreground"
        : "text-muted-foreground/70 group-hover:text-foreground",
    )

    return (
      <button
        ref={ref}
        className={cn(
          "group flex items-center gap-2 px-2 h-7 rounded-md text-sm transition-colors cursor-pointer w-full text-left focus:outline-none focus-visible:outline-none",
          isActive
            ? "bg-muted text-foreground dark:brightness-150"
            : "text-muted-foreground hover:bg-muted/70 dark:hover:brightness-125 hover:text-foreground",
          // Visible focus ring on keyboard navigation or roving focus
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          isFocused && "ring-2 ring-ring ring-offset-2 ring-offset-background",
          className,
        )}
        onClick={onClick}
        tabIndex={isFocused ? 0 : -1}
      >
        <Icon className={iconClassName} />
        <span className="transition-colors">{label}</span>
      </button>
    )
  },
)

NavTab.displayName = "NavTab"
