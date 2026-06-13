"use client"

import { useEffect, useRef, useState } from "react"
import { useAgentsPathname } from "@/hooks/use-agents-pathname"
import { agentsHref } from "@/lib/utils/agents-href"
import { AgentsLink } from "@/components/agents-link"
import { Logo } from "@/components/features/agents/ui/canvas/[id]/{components}/ui/logo"
import { ThemeToggle } from "./dashboard/theme-toggle"
import { useAtom } from "jotai"
import { docsAgentSidebarOpenAtom } from "./docs/docs-agent-chat"
import { ClaudeCodeIcon } from "@/components/features/agents/ui/canvas/[id]/{components}/ui/icons"
import { useAgentsSession } from "@/lib/agents/auth/client"
import { useAgentsAuthUi } from "@/lib/agents/auth/ui"
import { motion } from "motion/react"

const NAV_TABS = [
  { label: "Home", href: "/agents", exact: true },
  { label: "Docs", href: "/agents/docs", exact: false },
  { label: "What's New", href: "/agents/docs/whats-new", exact: false },
  { label: "API Reference", href: "/agents/docs/api-reference", exact: false },
  { label: "Knowledge Base", href: "/agents/docs/knowledge-base", exact: false },
  { label: "Examples", href: "/agents/docs/templates", exact: false },
] as const

function AnimatedAuthButton({ isSignedIn }: { isSignedIn: boolean }) {
  const { openSignIn } = useAgentsAuthUi()
  const label = isSignedIn ? "Dashboard" : "Sign in"
  const sizerRef = useRef<HTMLSpanElement>(null)
  const [width, setWidth] = useState<number | null>(null)
  const hasTransition = useRef(false)

  useEffect(() => {
    if (sizerRef.current) {
      setWidth(sizerRef.current.offsetWidth)
    }
    requestAnimationFrame(() => {
      hasTransition.current = true
    })
  }, [label])

  if (!isSignedIn) {
    return (
      <button
        type="button"
        onClick={() => openSignIn()}
        style={{
          width: width ?? undefined,
          transition: hasTransition.current
            ? "width 0.3s cubic-bezier(0.4,0,0.2,1), background-color 0.15s, transform 0.15s"
            : "none",
        }}
        className="an-focus-btn relative inline-flex items-center justify-center rounded-[10px] h-8 px-4 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 shadow-[0_0_0_0.5px_hsl(var(--foreground)/0.5),inset_0_0_0_1px_hsl(var(--foreground)/0.14)] active:scale-[0.99] whitespace-nowrap overflow-hidden"
      >
        <span
          ref={sizerRef}
          className="absolute left-0 top-0 invisible whitespace-nowrap text-sm font-medium pointer-events-none px-4"
        >
          {label}
        </span>
        {label}
      </button>
    )
  }

  return (
    <a
      href={agentsHref("/agents/app")}
      style={{
        width: width ?? undefined,
        transition: hasTransition.current
          ? "width 0.3s cubic-bezier(0.4,0,0.2,1), background-color 0.15s, transform 0.15s"
          : "none",
      }}
      className="an-focus-btn relative inline-flex items-center justify-center rounded-[10px] h-8 px-4 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 shadow-[0_0_0_0.5px_hsl(var(--foreground)/0.5),inset_0_0_0_1px_hsl(var(--foreground)/0.14)] active:scale-[0.99] whitespace-nowrap overflow-hidden"
    >
      <span
        ref={sizerRef}
        className="absolute left-0 top-0 invisible whitespace-nowrap text-sm font-medium pointer-events-none px-4"
      >
        {label}
      </span>
      {label}
    </a>
  )
}

function NavAuthButton() {
  const { isSignedIn } = useAgentsSession()

  return <AnimatedAuthButton isSignedIn={!!isSignedIn} />
}

function SearchButton() {
  return (
    <button
      onClick={() => {
        document.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "k",
            metaKey: true,
            bubbles: true,
          }),
        )
      }}
      className="an-focus-btn hidden sm:inline-flex items-center gap-2 h-8 pl-3 pr-1.5 rounded-lg border border-foreground/[0.08] bg-muted text-sm text-foreground/40 hover:text-foreground/60 hover:bg-foreground/[0.06] hover:border-foreground/[0.12] transition-all duration-150 min-w-[200px]"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0 text-neutral-600"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <span className="flex-1 text-left">Search...</span>
      <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-foreground/[0.1] bg-foreground/[0.05] px-1.5 font-mono text-[10px] text-foreground/30">
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
        </svg>
        K
      </kbd>
    </button>
  )
}

function AskClaudeButton() {
  const [isOpen, setIsOpen] = useAtom(docsAgentSidebarOpenAtom)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey && e.key === "i") {
        e.preventDefault()
        setIsOpen((v) => !v)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [setIsOpen])

  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="an-focus-btn hidden sm:inline-flex items-center gap-2 h-8 pl-3 pr-1.5 rounded-lg border border-foreground/[0.08] bg-muted text-sm text-foreground/50 hover:text-foreground/80 hover:bg-foreground/[0.06] hover:border-foreground/[0.12] transition-all duration-150"
    >
      <ClaudeCodeIcon className="h-4 w-4 shrink-0" />
      <span>Ask AI</span>
      <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-foreground/[0.1] bg-foreground/[0.05] px-1.5 font-mono text-[10px] text-foreground/30">
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
        </svg>
        I
      </kbd>
    </button>
  )
}

function isTabActive(
  tabHref: string,
  exact: boolean,
  pathname: string,
): boolean {
  if (exact) return pathname === tabHref
  if (tabHref === "/agents/docs/templates") {
    return (
      pathname === "/agents/docs/templates" ||
      pathname.startsWith("/agents/docs/templates/")
    )
  }
  if (tabHref === "/agents/docs/whats-new") {
    return (
      pathname === "/agents/docs/whats-new" ||
      pathname.startsWith("/agents/docs/whats-new/")
    )
  }
  if (tabHref === "/agents/docs/knowledge-base") {
    return (
      pathname === "/agents/docs/knowledge-base" ||
      pathname.startsWith("/agents/docs/knowledge-base/")
    )
  }
  if (tabHref === "/agents/docs/api-reference") {
    return (
      pathname === "/agents/docs/api-reference" ||
      pathname.startsWith("/agents/docs/api-reference/")
    )
  }
  if (tabHref === "/agents/docs") {
    return (
      pathname.startsWith("/agents/docs") &&
      !pathname.startsWith("/agents/docs/whats-new") &&
      !pathname.startsWith("/agents/docs/templates") &&
      !pathname.startsWith("/agents/docs/knowledge-base") &&
      !pathname.startsWith("/agents/docs/api-reference")
    )
  }
  return pathname === tabHref || pathname.startsWith(tabHref + "/")
}

function shouldShowHeader(pathname: string): boolean {
  if (pathname === "/agents") return true
  if (pathname.startsWith("/agents/docs")) return true
  if (pathname.startsWith("/agents/templates")) return true
  return false
}

export function AgentsHeader() {
  const pathname = useAgentsPathname()

  if (!shouldShowHeader(pathname)) return null

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      {/* Top row: Logo + search + actions */}
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-4 sm:px-6">
        <a
          href={agentsHref("/agents")}
          className="an-focus-btn flex items-center gap-2 text-sm font-medium tracking-tight hover:opacity-80 transition-opacity shrink-0 rounded-md"
        >
          <Logo className="w-4 h-4" fill="currentColor" />
          <span>Agents SDK</span>
        </a>

        {/* Center: Search + Ask AI */}
        <div className="hidden sm:flex items-center gap-2 flex-1 justify-center px-6">
          <SearchButton />
          <AskClaudeButton />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="https://github.com/21st-dev/21st-sdk"
            target="_blank"
            rel="noopener noreferrer"
            className="an-focus-btn flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.97]"
            aria-label="GitHub"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
          <ThemeToggle />
          <NavAuthButton />
        </div>
      </div>

      {/* Nav tabs row */}
      <nav className="mx-auto flex max-w-[1200px] items-center px-4 sm:px-6 h-10">
        {NAV_TABS.map((tab) => {
          const active = isTabActive(tab.href, tab.exact, pathname)
          return (
            <AgentsLink
              key={tab.href}
              href={tab.href}
              className={`an-focus-btn group relative flex h-full items-center px-2.5 text-[13px] font-medium transition-colors rounded-md ${
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div
                className={`absolute inset-x-1 inset-y-1.5 rounded-md transition-colors ${
                  active ? "bg-foreground/5" : "group-hover:bg-foreground/5"
                }`}
              />
              {active && (
                <motion.div
                  layoutId="header-nav-tab-line"
                  className="absolute inset-x-1 bottom-0 h-[1.5px] bg-foreground rounded-full"
                  transition={{ duration: 0.15 }}
                />
              )}
              <span className="relative">{tab.label}</span>
            </AgentsLink>
          )
        })}
      </nav>
    </header>
  )
}
