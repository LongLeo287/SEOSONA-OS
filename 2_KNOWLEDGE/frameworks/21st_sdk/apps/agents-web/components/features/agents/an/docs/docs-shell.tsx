"use client"

import { Suspense, useCallback, useEffect, useRef, useState } from "react"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { DocsNav } from "./docs-nav"
import { KnowledgeBaseNav } from "./knowledge-base-nav"
import { ApiReferenceNav } from "./api-reference-nav"
import { DocsToc, DocsTocMobile } from "./docs-toc"
import { DocsMobileNav } from "./docs-mobile-header"
import {
  docsAgentSidebarOpenAtom,
  DocsAgentSidebar,
} from "./docs-agent-chat"
import { useAtomValue } from "jotai"
import { SearchProvider } from "./search-context"
import { SearchModal } from "./search-modal"
import { buildSearchIndex } from "@/lib/agents-docs/search"

const searchIndex = buildSearchIndex()

const HIGHLIGHT_CLASS = "search-highlight"

const HIGHLIGHT_STYLE = `
  .${HIGHLIGHT_CLASS} {
    all: unset;
    background: transparent;
    transition: background 0.3s ease-in;
  }
  .${HIGHLIGHT_CLASS}.active {
    background: hsl(50 100% 50% / 0.4);
  }
  .${HIGHLIGHT_CLASS}.fading {
    background: transparent;
    transition: background 0.6s ease-out;
  }
`

export function DocsShell({
  children,
}: {
  children: React.ReactNode
  initialSidebarOpen?: boolean
  initialSidebarWidth?: number
}) {
  const pathname = usePathname()
  const isTemplateDetailPage = /^\/agents\/docs\/templates\/[^/]+$/.test(pathname)
  const isTemplatesPage = pathname === "/agents/docs/templates" || isTemplateDetailPage
  const isWhatsNewPage = pathname.startsWith("/agents/docs/whats-new")
  const isKnowledgeBasePage = pathname.startsWith("/agents/docs/knowledge-base")
  const isApiReferencePage = pathname.startsWith("/agents/docs/api-reference")

  const scrollRef = useRef<HTMLDivElement>(null)

  // Scroll to top on route change
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [pathname])

  function getNav() {
    if (isApiReferencePage) return <ApiReferenceNav />
    if (isKnowledgeBasePage) return <KnowledgeBaseNav />
    return <DocsNav />
  }

  return (
    <SearchProvider>
      <div
        className="flex h-full"
        style={{ "--muted-foreground": "0 0% 62%" } as React.CSSProperties}
      >
        <div ref={scrollRef} className="flex-1 min-w-0 overflow-y-auto">
          {/* Mobile nav drawer */}
          <DocsMobileNav />

          {isTemplatesPage || isWhatsNewPage ? (
            <div className="flex-1 min-w-0">
              {children}
            </div>
          ) : (
            /* Centered two-column layout */
            <div className="mx-auto flex max-w-[1200px] px-4 sm:px-6">
              {/* Left: Navigation */}
              {getNav()}

              {/* Right: Content */}
              <div className="flex-1 min-w-0">
                <div className="mx-auto max-w-2xl px-0 md:px-8 py-6 md:py-10">
                  <DocsTocMobile />
                  {children}
                </div>
              </div>
            </div>
          )}
        </div>

        <DocsAgentSidebar />
      </div>

      <DocsAgentTocWrapper />
      <SearchModal index={searchIndex} />
      <Suspense>
        <HighlightOnNavigate />
      </Suspense>
    </SearchProvider>
  )
}

/** Hide DocsToc when agent sidebar is open to prevent overlap */
function DocsAgentTocWrapper() {
  const isSidebarOpen = useAtomValue(docsAgentSidebarOpenAtom)
  if (isSidebarOpen) return null
  return <DocsToc />
}

function HighlightOnNavigate() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const highlight = searchParams.get("highlight")
  const processedRef = useRef<string | null>(null)

  useEffect(() => {
    if (!highlight) {
      processedRef.current = null
      return
    }

    const key = `${pathname}:${highlight}`
    if (processedRef.current === key) return
    processedRef.current = key

    const timeout = setTimeout(() => {
      const marks = highlightTextInDom(highlight)
      if (marks.length > 0) {
        marks[0]!.scrollIntoView({ behavior: "smooth", block: "center" })

        setTimeout(() => {
          for (const mark of marks) {
            mark.classList.add("active")
          }

          setTimeout(() => {
            for (const mark of marks) {
              mark.classList.remove("active")
              mark.classList.add("fading")
            }
            setTimeout(() => {
              for (const mark of marks) {
                const parent = mark.parentNode
                if (parent) {
                  parent.replaceChild(
                    document.createTextNode(mark.textContent || ""),
                    mark,
                  )
                  parent.normalize()
                }
              }
            }, 700)
          }, 2000)
        }, 600)
      }

      const url = new URL(window.location.href)
      url.searchParams.delete("highlight")
      window.history.replaceState({}, "", url.toString())
    }, 300)

    return () => clearTimeout(timeout)
  }, [highlight, pathname, router])

  return <style dangerouslySetInnerHTML={{ __html: HIGHLIGHT_STYLE }} />
}

function highlightTextInDom(query: string): HTMLElement[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (terms.length === 0) return []

  const mainEl = document.querySelector("main")
  if (!mainEl) return []

  const marks: HTMLElement[] = []
  const walker = document.createTreeWalker(mainEl, NodeFilter.SHOW_TEXT)

  const textNodes: Text[] = []
  let node: Text | null
  while ((node = walker.nextNode() as Text | null)) {
    if (node.nodeValue && node.nodeValue.trim().length > 0) {
      textNodes.push(node)
    }
  }

  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
  const regex = new RegExp(`(${escaped.join("|")})`, "gi")

  for (const textNode of textNodes) {
    const text = textNode.nodeValue || ""
    if (!regex.test(text)) {
      regex.lastIndex = 0
      continue
    }
    regex.lastIndex = 0

    const frag = document.createDocumentFragment()
    let lastIdx = 0
    let match: RegExpExecArray | null

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIdx) {
        frag.appendChild(document.createTextNode(text.slice(lastIdx, match.index)))
      }
      const mark = document.createElement("span")
      mark.className = HIGHLIGHT_CLASS
      mark.textContent = match[0]
      frag.appendChild(mark)
      marks.push(mark)
      lastIdx = match.index + match[0].length
    }
    if (lastIdx < text.length) {
      frag.appendChild(document.createTextNode(text.slice(lastIdx)))
    }

    textNode.parentNode?.replaceChild(frag, textNode)
  }

  return marks
}
