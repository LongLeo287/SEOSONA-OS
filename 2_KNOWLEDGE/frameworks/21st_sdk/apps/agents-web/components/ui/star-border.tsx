import { cn } from "@/lib/utils"
import React, { ElementType, ComponentPropsWithoutRef } from "react"

interface StarBorderProps<T extends ElementType> {
  as?: T
  color?: string
  speed?: string
  className?: string
  children: React.ReactNode
}

export function StarBorder<T extends ElementType = "button">({
  as,
  className,
  color,
  speed = "6s",
  children,
  ...props
}: StarBorderProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof StarBorderProps<T>>) {
  const Component = (as || "button") as T
  const defaultColor = color || "hsl(var(--foreground))"

  const ComponentWithProps = Component as any

  return (
    <ComponentWithProps
      className={cn(
        "relative inline-block py-[1px] overflow-hidden rounded-lg disabled:opacity-50 disabled:pointer-events-none",
        className,
      )}
      {...(props as any)}
    >
      <div
        className={cn(
          "absolute w-[300%] h-[50%] bottom-[-11px] right-[-250%] rounded-full animate-star-movement-bottom z-0",
          "opacity-20 dark:opacity-70",
        )}
        style={{
          background: `radial-gradient(circle, ${defaultColor}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div
        className={cn(
          "absolute w-[300%] h-[50%] top-[-10px] left-[-250%] rounded-full animate-star-movement-top z-0",
          "opacity-20 dark:opacity-70",
        )}
        style={{
          background: `radial-gradient(circle, ${defaultColor}, transparent 10%)`,
          animationDuration: speed,
        }}
      />
      <div
        className={cn(
          "relative z-1 inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors",
          "h-8 px-3 border text-foreground",
          "bg-gradient-to-b from-background/90 to-muted/90 border-border/40",
          "dark:from-background dark:to-muted dark:border-border",
        )}
      >
        {children}
      </div>
    </ComponentWithProps>
  )
}
