"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import * as shiki from "shiki"
import { useTheme } from "next-themes"

/* ── Shared shiki highlighter ── */

let highlighterPromise: Promise<shiki.Highlighter> | null = null

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = shiki.createHighlighter({
      themes: ["vesper", "github-light"],
      langs: ["tsx", "json"],
    })
  }
  return highlighterPromise
}

const vesperLightOverrides = `
.pg-shiki:not(.pg-shiki--dark) .shiki span[style*="color:#24292e"] { color: #000000 !important; }
.pg-shiki:not(.pg-shiki--dark) .shiki span[style*="color:#d73a49"] { color: #495057 !important; font-weight: 500; }
.pg-shiki:not(.pg-shiki--dark) .shiki span[style*="color:#032f62"] { color: #146C43 !important; }
.pg-shiki:not(.pg-shiki--dark) .shiki span[style*="color:#6f42c1"] { color: #C2410C !important; }
.pg-shiki:not(.pg-shiki--dark) .shiki span[style*="color:#005cc5"] { color: #C2410C !important; }
.pg-shiki:not(.pg-shiki--dark) .shiki span[style*="color:#e36209"] { color: #C2410C !important; }
.pg-shiki:not(.pg-shiki--dark) .shiki span[style*="color:#6a737d"] { color: #6C757D !important; }
`

export function HighlightedCode({ code, lang = "tsx" }: { code: string; lang?: "tsx" | "json" }) {
  const [html, setHtml] = useState("")
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const shikiTheme = isDark ? "vesper" : "github-light"

  const highlight = useCallback(async () => {
    try {
      const highlighter = await getHighlighter()
      const result = highlighter.codeToHtml(code, {
        lang,
        theme: shikiTheme,
      })
      setHtml(result.replace(/<pre /g, '<pre tabindex="-1" '))
    } catch {
      setHtml("")
    }
  }, [code, lang, shikiTheme])

  useEffect(() => {
    highlight()
  }, [highlight])

  if (!html) {
    return (
      <pre className="text-[11px] leading-relaxed font-mono text-foreground/60 overflow-x-auto whitespace-pre-wrap" tabIndex={-1}>
        <code>{code}</code>
      </pre>
    )
  }

  return (
    <>
      <style>{`
        .pg-shiki .shiki,
        .pg-shiki .shiki pre {
          background-color: transparent !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        .pg-shiki .shiki code {
          display: inline-block;
          min-width: 100%;
          font-size: 11px;
          line-height: 1.625;
          font-family: var(--font-mono, ui-monospace, monospace);
        }
        ${!isDark ? vesperLightOverrides : ""}
      `}</style>
      <div
        className={`pg-shiki overflow-x-auto whitespace-pre-wrap ${isDark ? "pg-shiki--dark" : ""}`}
        tabIndex={-1}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  )
}

/* ── Copy button (animated icon swap) ── */

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>(null)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API not available
    }
  }

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      className="p-1.5 rounded-md transition-[background-color,transform] duration-150 ease-out hover:bg-foreground/[0.06] active:scale-[0.97] an-focus-btn"
    >
      <div className="relative w-3.5 h-3.5" aria-hidden="true">
        {/* Copy icon */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`absolute inset-0 w-3.5 h-3.5 text-muted-foreground transition-[opacity,transform] duration-200 ease-out ${
            copied ? "opacity-0 scale-50" : "opacity-100 scale-100"
          }`}
        >
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
        {/* Check icon */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`absolute inset-0 w-3.5 h-3.5 text-emerald-500 transition-[opacity,transform] duration-200 ease-out ${
            copied ? "opacity-100 scale-100" : "opacity-0 scale-50"
          }`}
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
    </button>
  )
}
