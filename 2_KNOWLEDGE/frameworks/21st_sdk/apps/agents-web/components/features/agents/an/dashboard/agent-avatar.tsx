import { cn } from "@/lib/utils"
import { useMemo } from "react"

const SIZE_CLASSES = {
  xs: "h-3.5 w-3.5 text-[7px] rounded-[2px]",
  sm: "h-5 w-5 text-[9px] rounded-[3px]",
  lg: "h-7 w-7 text-[11px] rounded-[5px]",
} as const

const PALETTES = [
  { light: "bg-[#F5E0DC] text-[#93544C]", dark: "dark:bg-[#3D2C2A] dark:text-[#E0A99D]" },
  { light: "bg-[#FAEBD7] text-[#96693F]", dark: "dark:bg-[#3A2F22] dark:text-[#E0B88A]" },
  { light: "bg-[#FBF0C4] text-[#857537]", dark: "dark:bg-[#383320] dark:text-[#D4C56A]" },
  { light: "bg-[#D8EDDB] text-[#4A764F]", dark: "dark:bg-[#222E24] dark:text-[#8DC496]" },
  { light: "bg-[#D0E8E4] text-[#3A6E64]", dark: "dark:bg-[#1F2F2D] dark:text-[#7DBFB5]" },
  { light: "bg-[#D3E4F4] text-[#3C6994]", dark: "dark:bg-[#1F2B38] dark:text-[#7DB4DE]" },
  { light: "bg-[#DDD8EF] text-[#574A85]", dark: "dark:bg-[#28253A] dark:text-[#A99DE0]" },
  { light: "bg-[#F0D6EC] text-[#854879]", dark: "dark:bg-[#332434] dark:text-[#D49AC8]" },
  { light: "bg-[#F5D5D5] text-[#8E4E4E]", dark: "dark:bg-[#352323] dark:text-[#E09090]" },
  { light: "bg-[#E2DDD5] text-[#666054]", dark: "dark:bg-[#2D2A25] dark:text-[#BFB5A5]" },
] as const

function hashName(name: string): number {
  let h = 0
  for (let i = 0; i < name.length; i++) {
    h = ((h << 5) - h + name.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

interface AgentAvatarProps {
  name: string
  size?: "xs" | "sm" | "lg"
  className?: string
}

export function AgentAvatar({ name, size = "sm", className }: AgentAvatarProps) {
  const initial = name.charAt(0).toUpperCase()
  const palette = useMemo(() => {
    const idx = hashName(name) % PALETTES.length
    return PALETTES[idx]!
  }, [name])

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center font-medium select-none",
        palette.light,
        palette.dark,
        SIZE_CLASSES[size],
        className,
      )}
    >
      {initial}
    </div>
  )
}
