"use client"

import { useEffect, useState, useCallback, useRef, useLayoutEffect } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { AnimatedCopyIcon } from "./icons"

/* ── Brand icons ─────────────────────────────────────────────────────── */

const ChatGPTIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <mask id="openai_toc" width="16" height="16" x="0" y="0" maskUnits="userSpaceOnUse">
      <path fill="#fff" d="M15.568.494H.433v15h15.135z" />
    </mask>
    <g mask="url(#openai_toc)">
      <path fill="currentColor" d="M6.238 5.954V4.529c0-.12.045-.21.15-.27l2.865-1.65c.39-.225.855-.33 1.335-.33 1.8 0 2.94 1.395 2.94 2.88 0 .105 0 .225-.015.345l-2.97-1.74a.5.5 0 0 0-.54 0zm6.69 5.55V8.099c0-.21-.09-.36-.27-.465l-3.765-2.19 1.23-.705a.27.27 0 0 1 .3 0l2.865 1.65c.825.48 1.38 1.5 1.38 2.49 0 1.14-.675 2.19-1.74 2.625m-7.575-3-1.23-.72c-.105-.06-.15-.15-.15-.27v-3.3c0-1.605 1.23-2.82 2.895-2.82.63 0 1.215.21 1.71.585l-2.955 1.71a.5.5 0 0 0-.27.465zm2.648 1.53-1.763-.99v-2.1l1.763-.99 1.762.99v2.1zm1.132 4.56c-.63 0-1.215-.21-1.71-.585l2.955-1.71a.5.5 0 0 0 .27-.465v-4.35l1.245.72c.105.06.15.15.15.27v3.3c0 1.605-1.245 2.82-2.91 2.82m-3.555-3.345-2.865-1.65c-.825-.48-1.38-1.5-1.38-2.49 0-1.155.69-2.19 1.755-2.625v3.42c0 .21.09.36.27.465l3.75 2.175-1.23.705a.27.27 0 0 1-.3 0m-.165 2.46c-1.695 0-2.94-1.275-2.94-2.85 0-.12.015-.24.03-.36l2.955 1.71q.27.158.54 0l3.765-2.175v1.425c0 .12-.045.21-.15.27l-2.865 1.65c-.39.225-.855.33-1.335.33m3.72 1.785a3.75 3.75 0 0 0 3.675-3c1.68-.435 2.76-2.01 2.76-3.615 0-1.05-.45-2.07-1.26-2.805.075-.315.12-.63.12-.945 0-2.145-1.74-3.75-3.75-3.75-.405 0-.795.06-1.185.195A3.76 3.76 0 0 0 6.868.494a3.75 3.75 0 0 0-3.675 3c-1.68.435-2.76 2.01-2.76 3.615 0 1.05.45 2.07 1.26 2.805a4 4 0 0 0-.12.945c0 2.145 1.74 3.75 3.75 3.75.405 0 .795-.06 1.185-.195a3.76 3.76 0 0 0 2.625 1.08" />
    </g>
  </svg>
)

const ClaudeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path fill="#D97757" d="M3.432 10.466 6.39 8.81l.05-.144-.05-.08h-.144l-.495-.03-1.69-.045-1.467-.061-1.42-.076-.358-.076-.335-.44.035-.22.3-.201.43.038.952.064 1.428.099 1.036.06 1.534.16h.244l.034-.099-.084-.06-.065-.061-1.477-.998L3.25 5.586l-.837-.607-.453-.308-.229-.288-.099-.63.411-.451.552.038.141.038.56.428 1.195.922 1.561 1.146.229.19L6.37 6l.012-.046-.103-.17-.85-1.53-.905-1.556-.404-.645-.107-.387a1.9 1.9 0 0 1-.064-.455l.468-.634.259-.083.624.083.263.228.388.884.629 1.393.974 1.893.286.562.152.52.057.159h.1v-.091l.08-1.066.148-1.31.144-1.684.05-.475.236-.569.468-.307.366.174.3.43-.041.276-.18 1.157-.35 1.814-.228 1.215h.133l.152-.152.617-.816 1.036-1.29.457-.513.533-.565.342-.27h.648l.476.706-.214.729-.666.842-.552.714-.792 1.062-.495.85.046.069.118-.012 1.79-.38.966-.174 1.154-.197.522.243.057.246-.206.505-1.234.304-1.446.288-2.155.508-.027.02.03.037.971.091.415.023h1.017l1.892.14.495.327.297.398-.05.304-.76.387-1.029-.243-2.398-.569-.823-.205h-.114v.068l.685.668 1.257 1.131 1.572 1.457.08.36-.202.285-.213-.03-1.382-1.036-.533-.467-1.207-1.013h-.08v.106l.278.406 1.47 2.201.076.676-.107.22-.38.133-.42-.076-.86-1.203-.887-1.355-.716-1.214-.087.05-.423 4.534-.198.231-.457.175-.38-.289-.202-.466.202-.923.243-1.202.198-.957.18-1.187.106-.395-.008-.027-.087.012-.899 1.23-1.367 1.84-1.081 1.153-.259.103-.45-.232.043-.413.251-.368 1.496-1.898.903-1.176.582-.68-.004-.098h-.034L3.07 12.094l-.708.09-.304-.284.038-.467.144-.151 1.196-.82z" />
  </svg>
)

const CursorIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path fill="currentColor" d="M14.473 3.953 8.318.399a.64.64 0 0 0-.64 0L1.524 3.953a.54.54 0 0 0-.27.465v7.166a.54.54 0 0 0 .27.465l6.155 3.555a.64.64 0 0 0 .64 0l6.155-3.554a.54.54 0 0 0 .27-.465V4.417a.54.54 0 0 0-.27-.465m-.386.752L8.145 14.998c-.04.069-.147.04-.147-.04v-6.74a.38.38 0 0 0-.189-.326L1.974 4.524c-.07-.041-.042-.147.039-.147h11.884a.22.22 0 0 1 .19.328" />
  </svg>
)

const AI_TOOLS = [
  {
    name: "ChatGPT",
    icon: <ChatGPTIcon />,
    url: (md: string) => `https://chatgpt.com/?q=${encodeURIComponent(md)}`,
  },
  {
    name: "Claude",
    icon: <ClaudeIcon />,
    url: (md: string) => `https://claude.ai/new?q=${encodeURIComponent(md)}`,
  },
  {
    name: "Cursor",
    icon: <CursorIcon />,
    url: (md: string) => `https://cursor.com/?q=${encodeURIComponent(md.slice(0, 2000))}`,
  },
]

/* ── Hook: use isomorphic layout effect ──────────────────────────────── */

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

/* ── Component ───────────────────────────────────────────────────────── */

interface TocItem {
  id: string
  text: string
  level: number
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState("")
  const [copied, setCopied] = useState(false)
  const [indicator, setIndicator] = useState({ top: 0, height: 0, visible: false })
  const pathname = usePathname()
  const listRef = useRef<HTMLOListElement>(null)
  const itemRefs = useRef<Map<string, HTMLLIElement>>(new Map())

  // Collect headings + set up scroll tracking
  useEffect(() => {
    itemRefs.current.clear()

    const article = document.querySelector("[data-docs-content]")
    if (!article) return

    const elements = article.querySelectorAll("h2, h3")
    const items: TocItem[] = []

    elements.forEach((el) => {
      if (!el.id) {
        el.id =
          el.textContent
            ?.toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "") || ""
      }
      items.push({
        id: el.id,
        text: el.textContent || "",
        level: el.tagName === "H2" ? 2 : 3,
      })
    })

    setHeadings(items)
    setActiveId("")

    const handleScroll = () => {
      const scrollY = window.scrollY
      const els = article.querySelectorAll("h2, h3")
      let current = ""

      els.forEach((el) => {
        const htmlEl = el as HTMLElement
        if (htmlEl.offsetTop - 100 <= scrollY) {
          current = el.id
        }
      })

      if (!current && els.length > 0) {
        current = els[0]!.id
      }

      setActiveId(current)
    }

    handleScroll()

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname])

  // Update indicator position after DOM paints
  useIsomorphicLayoutEffect(() => {
    if (!activeId || !listRef.current) {
      setIndicator({ top: 0, height: 0, visible: false })
      return
    }

    const activeItem = itemRefs.current.get(activeId)
    if (!activeItem) {
      setIndicator({ top: 0, height: 0, visible: false })
      return
    }

    setIndicator({
      top: activeItem.offsetTop,
      height: activeItem.offsetHeight,
      visible: true,
    })
  }, [activeId, headings])

  const fetchMarkdown = useCallback(async () => {
    const slug = pathname.replace(/^\/(?:an|agents)\/docs\/?/, "") || ""
    const res = await fetch(`/agents/api/markdown?slug=${encodeURIComponent(slug)}`)
    if (!res.ok) return null
    return res.text()
  }, [pathname])

  const handleCopy = useCallback(async () => {
    const md = await fetchMarkdown()
    if (!md) return
    await navigator.clipboard.writeText(md)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [fetchMarkdown])

  const handleOpenIn = useCallback(
    async (buildUrl: (md: string) => string) => {
      const md = await fetchMarkdown()
      if (!md) return
      window.open(buildUrl(md), "_blank")
    },
    [fetchMarkdown],
  )

  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-[220px] shrink-0 overflow-y-auto pb-8 pt-10 xl:block">
      {headings.length > 0 && (
        <div className="relative">
          {/* Background track */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />
          {/* Animated active indicator */}
          <div
            className="absolute left-0 w-px bg-foreground transition-all duration-200 ease-out"
            style={{
              top: indicator.top,
              height: indicator.height,
              opacity: indicator.visible ? 1 : 0,
            }}
          />
          <ol ref={listRef} aria-label="On this page" role="list" className="relative pl-4 text-[13px]">
            {headings.map((heading) => (
              <li
                key={heading.id}
                ref={(el) => {
                  if (el) itemRefs.current.set(heading.id, el)
                }}
                className={cn("mt-2.5 first:mt-0", heading.level === 3 && "pl-3")}
              >
                <a
                  href={`#${heading.id}`}
                  className={cn(
                    "block leading-snug transition-all duration-200 -mx-1.5 px-1.5 py-0.5 rounded-md",
                    activeId === heading.id
                      ? "text-foreground bg-accent"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Actions — Copy + Open in AI */}
      <div className={cn("flex flex-col gap-0.5", headings.length > 0 && "mt-6 border-t border-border pt-4")}>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 rounded-md px-1 py-1.5 text-[13px] text-muted-foreground transition-colors hover:text-muted-foreground"
        >
          <AnimatedCopyIcon copied={copied} size="h-3.5 w-3.5" />
          {copied ? "Copied!" : "Copy as markdown"}
        </button>

        {AI_TOOLS.map((tool) => (
          <button
            key={tool.name}
            onClick={() => handleOpenIn(tool.url)}
            className="flex items-center gap-2 rounded-md px-1 py-1.5 text-[13px] text-muted-foreground transition-colors hover:text-muted-foreground"
          >
            <span className="shrink-0">{tool.icon}</span>
            Open in {tool.name}
          </button>
        ))}
      </div>
    </aside>
  )
}
