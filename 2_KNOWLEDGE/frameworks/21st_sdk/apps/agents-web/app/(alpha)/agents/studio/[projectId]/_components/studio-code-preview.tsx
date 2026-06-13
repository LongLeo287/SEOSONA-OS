"use client"

import { useCallback, useEffect, useState } from "react"
import * as shiki from "shiki"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

type PreviewLanguage =
  | "json"
  | "typescript"
  | "javascript"
  | "tsx"
  | "jsx"
  | "html"
  | "css"
  | "bash"
  | "markdown"
  | "yaml"
  | "plaintext"

let highlighterPromise: Promise<shiki.Highlighter> | null = null

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = shiki.createHighlighter({
      themes: ["vesper", "github-light"],
      langs: [
        "json",
        "typescript",
        "javascript",
        "tsx",
        "jsx",
        "html",
        "css",
        "bash",
        "markdown",
        "yaml",
        "plaintext",
      ],
    })
  }

  return highlighterPromise
}

const lightThemeOverrides = `
.studio-shiki:not(.studio-shiki--dark) .shiki span[style*="color:#24292e"] { color: hsl(var(--foreground)) !important; }
.studio-shiki:not(.studio-shiki--dark) .shiki span[style*="color:#d73a49"] { color: #7C2D12 !important; font-weight: 500; }
.studio-shiki:not(.studio-shiki--dark) .shiki span[style*="color:#032f62"] { color: #166534 !important; }
.studio-shiki:not(.studio-shiki--dark) .shiki span[style*="color:#6f42c1"] { color: #7C3AED !important; }
.studio-shiki:not(.studio-shiki--dark) .shiki span[style*="color:#005cc5"] { color: #1D4ED8 !important; }
.studio-shiki:not(.studio-shiki--dark) .shiki span[style*="color:#e36209"] { color: #C2410C !important; }
.studio-shiki:not(.studio-shiki--dark) .shiki span[style*="color:#6a737d"] { color: hsl(var(--muted-foreground)) !important; }
`

export function getStudioFileLanguage(path: string): PreviewLanguage {
  const extension = path.split(".").pop()?.toLowerCase() ?? ""

  switch (extension) {
    case "ts":
    case "mts":
    case "cts":
      return "typescript"
    case "tsx":
      return "tsx"
    case "js":
    case "mjs":
    case "cjs":
      return "javascript"
    case "jsx":
      return "jsx"
    case "json":
      return "json"
    case "md":
    case "mdx":
      return "markdown"
    case "css":
    case "scss":
    case "sass":
      return "css"
    case "html":
    case "htm":
      return "html"
    case "sh":
    case "bash":
    case "zsh":
      return "bash"
    case "yml":
    case "yaml":
      return "yaml"
    default:
      return "plaintext"
  }
}

export function getStudioFileLanguageLabel(path: string): string {
  const lang = getStudioFileLanguage(path)
  if (lang === "plaintext") return "Text"
  if (lang === "tsx") return "TSX"
  if (lang === "jsx") return "JSX"
  if (lang === "json") return "JSON"
  if (lang === "yaml") return "YAML"
  if (lang === "bash") return "Shell"
  if (lang === "markdown") return "Markdown"
  if (lang === "html") return "HTML"
  if (lang === "css") return "CSS"
  if (lang === "javascript") return "JavaScript"
  return "TypeScript"
}

export function StudioCodePreview({
  code,
  path,
  className,
}: {
  code: string
  path: string
  className?: string
}) {
  const [html, setHtml] = useState("")
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const theme = isDark ? "vesper" : "github-light"
  const language = getStudioFileLanguage(path)

  const highlight = useCallback(async () => {
    try {
      const highlighter = await getHighlighter()
      const result = highlighter.codeToHtml(code, {
        lang: language,
        theme,
      })
      setHtml(result.replace(/<pre /g, '<pre tabindex="-1" '))
    } catch (error) {
      console.error("Failed to highlight Studio file preview", error)
      setHtml("")
    }
  }, [code, language, theme])

  useEffect(() => {
    void highlight()
  }, [highlight])

  if (!html) {
    return (
      <pre
        className={cn(
          "overflow-auto px-4 py-4 font-mono text-[12px] leading-6 text-foreground/70 whitespace-pre-wrap break-words",
          className,
        )}
        tabIndex={-1}
      >
        <code>{code}</code>
      </pre>
    )
  }

  return (
    <>
      <style>{`
        .studio-shiki .shiki,
        .studio-shiki .shiki pre {
          background-color: transparent !important;
          margin: 0 !important;
          padding: 0 !important;
          white-space: pre-wrap !important;
          overflow-wrap: anywhere !important;
          word-break: break-word !important;
        }
        .studio-shiki .shiki code {
          display: block;
          min-width: 0;
          width: 100%;
          font-size: 12px;
          line-height: 1.75;
          font-family: var(--font-mono, ui-monospace, monospace);
          white-space: pre-wrap !important;
          overflow-wrap: anywhere !important;
          word-break: break-word !important;
        }
        ${!isDark ? lightThemeOverrides : ""}
      `}</style>
      <div
        className={cn(
          "studio-shiki overflow-auto px-4 py-4",
          isDark && "studio-shiki--dark",
          className,
        )}
        tabIndex={-1}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  )
}
