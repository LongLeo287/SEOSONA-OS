"use client"

import { useState, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"
import { AnimatedCopyIcon } from "./icons"

/* ── Package manager config ────────────────────────────────────────── */

type PackageManager = "npm" | "pnpm" | "yarn" | "bun"

const MANAGERS: { id: PackageManager; label: string; command: (pkg: string) => string }[] = [
  { id: "npm", label: "npm", command: (pkg) => `npm install ${pkg}` },
  { id: "pnpm", label: "pnpm", command: (pkg) => `pnpm add ${pkg}` },
  { id: "yarn", label: "yarn", command: (pkg) => `yarn add ${pkg}` },
  { id: "bun", label: "bun", command: (pkg) => `bun add ${pkg}` },
]

const STORAGE_KEY = "an-docs-pkg-manager"

/* ── Component ─────────────────────────────────────────────────────── */

export function InstallTabs({ pkg }: { pkg: string }) {
  const [active, setActive] = useState<PackageManager>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY) as PackageManager | null
      if (stored && MANAGERS.some((m) => m.id === stored)) return stored
    }
    return "npm"
  })
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

  const command = MANAGERS.find((m) => m.id === active)!.command(pkg)

  const handleTabChange = useCallback((id: PackageManager) => {
    setActive(id)
    localStorage.setItem(STORAGE_KEY, id)
  }, [])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(command)
    setCopied(true)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setCopied(false), 2000)
  }, [command])

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-border bg-secondary">
      {/* Tab bar */}
      <div className="flex items-center border-b border-border">
        <div className="flex overflow-x-auto px-3 text-[13px] scrollbar-hide">
          {MANAGERS.map((m) => (
            <button
              key={m.id}
              onClick={() => handleTabChange(m.id)}
              className={cn(
                "group/tab relative cursor-pointer px-2.5 pb-2 pt-3 font-medium transition-colors",
                active === m.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-muted-foreground",
              )}
            >
              {m.label}
              {/* Active indicator line */}
              <div
                className={cn(
                  "absolute inset-x-2 -bottom-px h-px transition-opacity duration-150",
                  active === m.id
                    ? "bg-primary opacity-100"
                    : "opacity-0",
                )}
              />
            </button>
          ))}
        </div>

        {/* Copy button — right side */}
        <div className="ml-auto pr-3">
          <button
            onClick={handleCopy}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-muted-foreground"
            aria-label="Copy install command"
          >
            <AnimatedCopyIcon copied={copied} size="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Code area */}
      <div className="overflow-x-auto px-5 py-4">
        <pre className="text-[13px] leading-[1.7] font-mono">
          <code className="text-foreground">{command}</code>
        </pre>
      </div>
    </div>
  )
}
