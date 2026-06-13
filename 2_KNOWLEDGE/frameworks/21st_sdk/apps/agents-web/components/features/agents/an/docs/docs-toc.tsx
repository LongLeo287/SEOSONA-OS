"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useAgentsPathname } from "@/hooks/use-agents-pathname"
import { ChevronDownIcon } from "./icons"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

interface TocHeading {
  id: string
  text: string
  level: number
}

function useDocHeadings() {
  const pathname = useAgentsPathname()
  const [headings, setHeadings] = useState<TocHeading[]>([])
  const [activeId, setActiveId] = useState<string>("")
  const observerRef = useRef<IntersectionObserver | null>(null)
  const isScrollingRef = useRef(false)
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Extract headings from the page - re-run on route change
  useEffect(() => {
    const collectHeadings = () => {
      const main = document.querySelector("main")
      if (!main) return

      const elements = main.querySelectorAll("h2, h3")
      const items: TocHeading[] = []

      elements.forEach((el) => {
        if (!el.id) {
          el.id =
            el.textContent
              ?.toLowerCase()
              .replace(/[^a-z0-9\s-]/g, "")
              .replace(/\s+/g, "-")
              .replace(/-+/g, "-")
              .trim() || ""
        }

        if (el.id) {
          items.push({
            id: el.id,
            text: el.textContent || "",
            level: el.tagName === "H2" ? 2 : 3,
          })
        }
      })

      setHeadings(items)
    }

    const timeout = setTimeout(collectHeadings, 200)
    return () => clearTimeout(timeout)
  }, [pathname])

  // Intersection observer for active heading
  useEffect(() => {
    if (headings.length === 0) return

    observerRef.current?.disconnect()

    const callback: IntersectionObserverCallback = (entries) => {
      if (isScrollingRef.current) return
      const visibleEntries = entries.filter((e) => e.isIntersecting)
      if (visibleEntries.length > 0) {
        const sorted = visibleEntries.sort(
          (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
        )
        setActiveId(sorted[0]!.target.id)
      }
    }

    observerRef.current = new IntersectionObserver(callback, {
      rootMargin: "-10% 0px -70% 0px",
      threshold: 0,
    })

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observerRef.current!.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [headings])

  const handleClick = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    setActiveId(id)
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current)
    isScrollingRef.current = true
    el.style.scrollMarginTop = "120px"
    el.scrollIntoView({ behavior: "smooth", block: "start" })
    scrollTimerRef.current = setTimeout(() => {
      isScrollingRef.current = false
    }, 1000)
  }, [])

  return { headings, activeId, handleClick }
}

export function DocsToc() {
  const { headings, activeId, handleClick } = useDocHeadings()
  const [isHovered, setIsHovered] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pathname = useAgentsPathname()

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setIsHovered(false), 200)
  }, [])

  // Hide TOC on the intro page
  if (pathname === "/agents/docs") return null
  if (pathname.startsWith("/agents/docs/whats-new")) return null
  if (headings.length === 0) return null

  return (
    <div
      className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden lg:flex items-start"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Collapsed - horizontal lines indicating headings */}
      <div
        className={cn(
          "flex flex-col items-end gap-[6px] py-3 pl-6 pr-1 transition-all duration-300",
          isHovered ? "opacity-0 pointer-events-none" : "opacity-100",
        )}
      >
        {headings.map((heading) => (
          <button
            key={heading.id}
            onClick={() => handleClick(heading.id)}
            className="an-focus-btn group flex items-center justify-end rounded-sm"
          >
            <div
              className={cn(
                "h-[1.5px] rounded-full transition-all duration-200",
                heading.level === 2 ? "w-4" : "w-2",
                activeId === heading.id
                  ? "bg-foreground"
                  : "bg-muted-foreground/25 group-hover:bg-muted-foreground/50",
              )}
            />
          </button>
        ))}
      </div>

      {/* Expanded TOC on hover */}
      <div
        className={cn(
          "absolute right-0 top-1/2 -translate-y-1/2",
          "rounded-lg border border-border bg-background/95 backdrop-blur-sm shadow-sm",
          "py-2.5 px-3 min-w-[160px] max-w-[220px]",
          "transition-all duration-300 origin-right",
          isHovered
            ? "opacity-100 scale-100 translate-x-0"
            : "opacity-0 scale-95 translate-x-2 pointer-events-none",
        )}
      >
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60 mb-2 px-1">
          On this page
        </p>
        <nav className="flex flex-col gap-0.5">
          {headings.map((heading) => (
            <button
              key={heading.id}
              onClick={() => handleClick(heading.id)}
              className={cn(
                "an-focus-btn text-left text-[12px] leading-snug rounded px-1.5 py-1 truncate",
                heading.level === 3 && "pl-3.5",
                activeId === heading.id
                  ? "text-foreground bg-secondary/60"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/40",
              )}
            >
              {heading.text}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}

export function DocsTocMobile() {
  const { headings, activeId, handleClick } = useDocHeadings()
  const pathname = useAgentsPathname()

  // Hide TOC on the intro page
  if (pathname === "/agents/docs") return null
  if (pathname.startsWith("/agents/docs/whats-new")) return null
  if (headings.length === 0) return null

  return (
    <div className="lg:hidden mb-6">
      <Collapsible className="group/toc">
        <CollapsibleTrigger className="an-focus-btn flex w-full items-center justify-between rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <span className="font-medium">On this page</span>
          <ChevronDownIcon className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-data-[state=open]/toc:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <nav className="flex flex-col gap-0.5 pt-2 pb-1">
            {headings.map((heading) => (
              <button
                key={heading.id}
                onClick={() => handleClick(heading.id)}
                className={cn(
                  "an-focus-btn text-left text-[13px] leading-snug rounded px-2 py-1.5",
                  heading.level === 3 && "pl-5",
                  activeId === heading.id
                    ? "text-foreground font-medium"
                    : "text-muted-foreground",
                )}
              >
                {heading.text}
              </button>
            ))}
          </nav>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
