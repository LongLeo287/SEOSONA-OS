"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { resolvedTheme } = useTheme()

  return (
    <Sonner
      position="bottom-right"
      theme={resolvedTheme as "light" | "dark" | "system"}
      closeButton
      {...props}
    />
  )
}

export { Toaster }
