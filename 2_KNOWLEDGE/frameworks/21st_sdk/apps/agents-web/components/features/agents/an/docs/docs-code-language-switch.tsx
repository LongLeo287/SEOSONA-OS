"use client"

import type { DocsCodeLanguage } from "@/lib/atoms/agents-docs"
import {
  GoIcon,
  PythonIcon,
  TypeScriptIcon,
} from "@/components/features/agents/an/docs/framework-icons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/features/agents/ui/canvas/[id]/{components}/ui/dropdown-menu"
import { Check, ChevronsUpDown } from "lucide-react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

export const DOCS_CODE_LANGUAGE_OPTIONS = [
  {
    id: "typescript",
    label: "TypeScript",
    icon: TypeScriptIcon,
  },
  {
    id: "python",
    label: "Python",
    icon: PythonIcon,
  },
  {
    id: "go",
    label: "Golang",
    icon: GoIcon,
  },
] as const

import { getDocsLang } from "@/lib/agents-docs/get-docs-lang"

export function DocsCodeLanguageSwitch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const docsCodeLanguage = getDocsLang(searchParams)
  const [open, setOpen] = useState(false)
  const selectedOption =
    DOCS_CODE_LANGUAGE_OPTIONS.find(
      (option) => option.id === docsCodeLanguage,
    ) ?? DOCS_CODE_LANGUAGE_OPTIONS[0]
  const SelectedIcon = selectedOption.icon

  function setLanguage(lang: DocsCodeLanguage) {
    const params = new URLSearchParams(searchParams.toString())
    if (lang === "typescript") {
      params.delete("lang")
    } else {
      params.set("lang", lang)
    }
    const qs = params.toString()
    router.replace(`${window.location.pathname}${qs ? `?${qs}` : ""}`, {
      scroll: false,
    })
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Code examples language"
          className={cn(
            "an-focus-input flex h-7 w-full items-center gap-2 rounded-md border border-border/70 px-2.5 text-[12px] font-medium shadow-none",
            open ? "bg-muted" : "bg-foreground/[0.03] hover:bg-muted/60",
          )}
        >
          <SelectedIcon className="h-3.5 w-3.5 shrink-0" />
          <span className="flex-1 truncate text-left">
            {selectedOption.label}
          </span>
          <ChevronsUpDown className="h-3 w-3 shrink-0 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={4}
        style={{ minWidth: "var(--radix-dropdown-menu-trigger-width)" }}
      >
        {DOCS_CODE_LANGUAGE_OPTIONS.map((option) => {
          const Icon = option.icon
          const isSelected = option.id === docsCodeLanguage

          return (
            <DropdownMenuItem
              key={option.id}
              onSelect={() => setLanguage(option.id as DocsCodeLanguage)}
              className="text-[12px]"
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span className="flex-1">{option.label}</span>
              {isSelected && (
                <Check className="h-4 w-4 shrink-0 text-muted-foreground" />
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
