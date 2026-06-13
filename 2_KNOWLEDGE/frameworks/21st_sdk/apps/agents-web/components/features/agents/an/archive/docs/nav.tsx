"use client"

import { AgentsLink as Link } from "@/components/agents-link"
import { ThemeToggle } from "./theme-toggle"
import { useSearch } from "./search-context"
import { SearchModal } from "./search-modal"
import { SearchIcon } from "./icons"
import type { SearchRecord } from "@/lib/agents-docs/search"

const LOGO_SVG = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 400 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="21st logo"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M358.333 0C381.345 0 400 18.6548 400 41.6667V295.833C400 298.135 398.134 300 395.833 300H270.833C268.532 300 266.667 301.865 266.667 304.167V395.833C266.667 398.134 264.801 400 262.5 400H41.6667C18.6548 400 0 381.345 0 358.333V304.72C0 301.793 1.54269 299.081 4.05273 297.575L153.76 207.747C157.159 205.708 156.02 200.679 152.376 200.065L151.628 200H4.16667C1.86548 200 6.71103e-08 198.135 0 195.833V104.167C1.07376e-06 101.865 1.86548 100 4.16667 100H162.5C164.801 100 166.667 98.1345 166.667 95.8333V4.16667C166.667 1.86548 168.532 1.00666e-07 170.833 0H358.333ZM170.833 100C168.532 100 166.667 101.865 166.667 104.167V295.833C166.667 298.135 168.532 300 170.833 300H262.5C264.801 300 266.667 298.135 266.667 295.833V104.167C266.667 101.865 264.801 100 262.5 100H170.833Z"
      fill="currentColor"
    />
  </svg>
)

export function Nav({ searchIndex }: { searchIndex: SearchRecord[] }) {
  const { setOpen } = useSearch()

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background backdrop-blur-xl">
        <div className="flex h-14 items-center px-6">
          {/* Logo + Docs badge */}
          <Link
            href="/agents"
            className="flex shrink-0 items-center gap-2.5 text-foreground transition-opacity hover:opacity-80"
          >
            {LOGO_SVG}
            <span className="text-[16px] font-semibold tracking-tight">21st</span>
            <span className="rounded-md bg-secondary px-2 py-0.5 text-[12px] font-medium text-muted-foreground">
              Docs
            </span>
          </Link>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Search */}
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2.5 rounded-[10px] border border-border bg-secondary px-3.5 py-1.5 text-sm text-muted-foreground transition-all hover:border-border hover:bg-accent hover:text-muted-foreground"
          >
            <SearchIcon className="h-3.5 w-3.5" />
            Search documentation
            <kbd className="pointer-events-none ml-4 hidden h-5 select-none items-center gap-0.5 rounded-md border border-border bg-background px-1.5 font-sans text-[11px] text-muted-foreground sm:inline-flex">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
              </svg>
              K
            </kbd>
          </button>

          {/* Theme toggle */}
          <div className="ml-3">
            <ThemeToggle />
          </div>

          {/* Playground button */}
          <Link
            href="/agents/playground"
            className="ml-3 rounded-[10px] bg-foreground px-4 py-1.5 text-[13px] font-medium text-background transition-opacity hover:opacity-90"
          >
            Playground
          </Link>
        </div>
      </header>

      <SearchModal index={searchIndex} />
    </>
  )
}
