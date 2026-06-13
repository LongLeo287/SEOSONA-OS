"use client"

import { useState, useEffect, useCallback } from "react"
import { useTheme } from "next-themes"
import * as shiki from "shiki"
import { EyeOff } from "lucide-react"
import { CopyIcon, CheckIcon } from "@/components/features/agents/an/docs/icons"
import { FileExtIcon } from "@/components/features/agents/an/chat-preview/icons/file-ext-icon"
import { cn } from "@/lib/utils"

let highlighterPromise: Promise<shiki.Highlighter> | null = null
const getHighlighter = () => {
  if (!highlighterPromise) {
    highlighterPromise = shiki.createHighlighter({
      themes: ["vesper", "github-light"],
      langs: ["json", "typescript", "tsx", "bash", "python", "go", "plaintext"],
    })
  }
  return highlighterPromise
}

const vesperLightOverrides = `
.an-docs-code .shiki span[style*="color:#24292e"] { color: #000000 !important; }
.an-docs-code .shiki span[style*="color:#d73a49"] { color: #495057 !important; font-weight: 500; }
.an-docs-code .shiki span[style*="color:#032f62"] { color: #146C43 !important; }
.an-docs-code .shiki span[style*="color:#6f42c1"] { color: #C2410C !important; }
.an-docs-code .shiki span[style*="color:#005cc5"] { color: #C2410C !important; }
.an-docs-code .shiki span[style*="color:#e36209"] { color: #C2410C !important; }
.an-docs-code .shiki span[style*="color:#6a737d"] { color: #6C757D !important; }
`

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      className={className}
    >
      <path d="M1.5 8s2.5-5 6.5-5 6.5 5 6.5 5-2.5 5-6.5 5-6.5-5-6.5-5Z" />
      <circle cx="8" cy="8" r="2" />
    </svg>
  )
}

function EyeOffIcon({ className }: { className?: string }) {
  return <EyeOff className={className} />
}

const SECRET_KEY_PATTERNS = /(?:KEY|SECRET|TOKEN|PASSWORD|CREDENTIAL)/i

function maskSecretValues(code: string): string {
  // Mask ENV-style lines: API_KEY_21ST=21st_sk_abc...xyz
  let result = code.replace(/^([A-Z_]+=)(.+)$/gm, (_, key, value) => {
    if (!SECRET_KEY_PATTERNS.test(key)) return `${key}${value}`
    if (value.length <= 8) return `${key}${"•".repeat(value.length)}`
    return `${key}${value.slice(0, 4)}${"•".repeat(Math.min(32, value.length - 8))}${value.slice(-4)}`
  })
  // Mask inline API keys, including legacy an_sk_ tokens.
  result = result.replace(/\b(?:21st_sk_|an_sk_)[a-f0-9]{8,}\b/g, (token) => {
    return `${token.slice(0, 8)}${"•".repeat(Math.min(32, token.length - 12))}${token.slice(-4)}`
  })
  return result
}

const AUTO_COLLAPSE_LINE_THRESHOLD = 20

const FILENAME_LANGUAGE_MAP: Record<string, string> = {
  ts: "typescript",
  tsx: "tsx",
  js: "javascript",
  jsx: "jsx",
  json: "json",
  jsonc: "json",
  sh: "bash",
  bash: "bash",
  py: "python",
  go: "go",
}

function getLanguageFromFilename(filename?: string) {
  if (!filename) return null
  const ext = filename.split(".").pop()?.toLowerCase()
  if (!ext) return null
  return FILENAME_LANGUAGE_MAP[ext] ?? null
}

export function CodeBlock({
  code,
  language,
  filename,
  showPrompt,
  secret,
  collapsible,
  defaultExpanded,
  className: outerClassName,
}: {
  code: string
  language: string
  filename?: string
  showPrompt?: boolean
  secret?: boolean
  collapsible?: boolean
  defaultExpanded?: boolean
  className?: string
}) {
  const lineCount = code.split("\n").length
  const isCollapsible = collapsible ?? lineCount > AUTO_COLLAPSE_LINE_THRESHOLD

  const [copied, setCopied] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [expanded, setExpanded] = useState(defaultExpanded ?? false)
  const [html, setHtml] = useState("")
  const { resolvedTheme } = useTheme()

  const isDark = resolvedTheme === "dark"
  const isCollapsed = isCollapsible && !expanded
  const displayCode = secret && !revealed ? maskSecretValues(code) : code
  const resolvedLanguage = getLanguageFromFilename(filename) ?? language

  const highlight = useCallback(async () => {
    try {
      const highlighter = await getHighlighter()
      const langs = await highlighter.getLoadedLanguages()
      const lang = langs.includes(resolvedLanguage as shiki.BundledLanguage)
        ? resolvedLanguage
        : "plaintext"
      const result = highlighter.codeToHtml(displayCode, {
        lang: lang as shiki.BundledLanguage,
        theme: isDark ? "vesper" : "github-light",
      })
      setHtml(result.replace(/\stabindex="[^"]*"/g, ""))
    } catch {
      setHtml(`<pre><code>${displayCode}</code></pre>`)
    }
  }, [displayCode, resolvedLanguage, isDark])

  useEffect(() => {
    highlight()
  }, [highlight])

  return (
    <>
      {!isDark && <style>{vesperLightOverrides}</style>}
      <div className="relative">
        {/* Gradient border overlay for collapsible blocks - fades via opacity */}
        {isCollapsible && (
          <div
            className={cn(
              "pointer-events-none absolute inset-0 z-10 rounded-lg transition-opacity duration-300",
              isCollapsed ? "opacity-100" : "opacity-0",
            )}
            style={{
              padding: "1px",
              background:
                "linear-gradient(to bottom, hsl(var(--border)) 0%, hsl(var(--border)) 30%, transparent 100%)",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />
        )}
        {/* Code block - clips content when collapsed */}
        <div
          className={cn(
            "group/code an-docs-code relative w-full min-w-0 overflow-hidden rounded-lg border transition-[max-height,border-color] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
            isCollapsed ? "border-transparent" : "border-border",
            isCollapsed && "max-h-64 has-[.expand-btn:hover]:max-h-72",
            outerClassName,
          )}
          data-raw-code={code}
        >
          {/* Floating action buttons - single row: Expand | Eye | Copy */}
          <div className="absolute top-1.5 right-1.5 z-20 flex items-center">
            {isCollapsible && (
              <>
                <button
                  type="button"
                  onClick={() => setExpanded((e) => !e)}
                  className="expand-btn an-focus-btn cursor-pointer rounded-md px-2.5 py-1 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:scale-[0.97]"
                >
                  {expanded ? "Collapse" : "Expand"}
                </button>
                <div className="mx-1.5 h-5 w-px shrink-0 bg-border" />
              </>
            )}
            {secret && (
              <>
                <button
                  type="button"
                  onClick={() => setRevealed((r) => !r)}
                  className="an-focus-btn flex size-7 cursor-pointer items-center justify-center rounded-md opacity-70 transition-[opacity,background-color] hover:bg-accent hover:opacity-100 active:scale-[0.97]"
                  aria-label={
                    revealed ? "Hide secret values" : "Reveal secret values"
                  }
                >
                  <div className="relative size-4">
                    <EyeIcon
                      className={cn(
                        "absolute inset-0 size-4 text-muted-foreground transition-[opacity,transform] duration-200 ease-out",
                        revealed
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-50",
                      )}
                    />
                    <EyeOffIcon
                      className={cn(
                        "absolute inset-0 size-4 text-muted-foreground transition-[opacity,transform] duration-200 ease-out",
                        revealed
                          ? "opacity-0 scale-50"
                          : "opacity-100 scale-100",
                      )}
                    />
                  </div>
                </button>
                <div className="mx-1 h-5 w-px shrink-0 bg-border" />
              </>
            )}
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(code)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              }}
              className="an-focus-btn flex size-7 cursor-pointer items-center justify-center rounded-md opacity-70 transition-[opacity,background-color] hover:bg-accent hover:opacity-100 active:scale-[0.97]"
              aria-label="Copy code"
            >
              <div className="relative size-4">
                <CopyIcon
                  className={cn(
                    "absolute inset-0 size-4 text-muted-foreground transition-[opacity,transform] duration-200 ease-out",
                    copied ? "opacity-0 scale-50" : "opacity-100 scale-100",
                  )}
                />
                <CheckIcon
                  className={cn(
                    "absolute inset-0 size-4 text-muted-foreground transition-[opacity,transform] duration-200 ease-out",
                    copied ? "opacity-100 scale-100" : "opacity-0 scale-50",
                  )}
                />
              </div>
            </button>
          </div>

          {/* Filename caption */}
          {filename && (
            <div className="flex items-center gap-2 px-4 py-2.5 text-[.8125rem] text-foreground/70 [&_svg]:size-4 [&_svg]:text-foreground/70">
              <FileExtIcon filename={filename} className="size-4 shrink-0" />
              {filename}
            </div>
          )}

          {/* Code content */}
          <div
            tabIndex={-1}
            className={cn(
              "relative px-4 py-3.5 text-[.8125rem] leading-relaxed outline-none focus:outline-none focus-visible:outline-none [&:focus]:ring-0 [&:focus]:shadow-none [&:focus-visible]:ring-0 [&:focus-visible]:shadow-none",
              secret ? "overflow-hidden" : "overflow-x-auto",
            )}
          >
            {showPrompt && (
              <span className="select-none text-[#FFC799] mr-1.5 font-mono">
                $
              </span>
            )}
            {html ? (
              <div
                className={cn(
                  "[&_.shiki]:!bg-transparent [&_.shiki_pre]:!bg-transparent [&_.shiki_pre]:!m-0 [&_.shiki_pre]:!p-0 [&_.shiki]:!m-0 [&_.shiki]:!p-0 [&_.shiki_code]:font-mono [&_pre]:!outline-none [&_pre]:!ring-0 [&_pre]:!shadow-none [&_code]:!outline-none",
                  showPrompt && "inline [&_pre]:!inline",
                  secret &&
                  "[&_.shiki_pre]:!whitespace-pre-wrap [&_.shiki_pre]:!break-all [&_.shiki_code]:!w-auto [&_.shiki_code]:!min-w-0",
                )}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : (
              <pre className="font-mono inline">
                <code>{displayCode}</code>
              </pre>
            )}
          </div>

          {/* Bottom gradient fade + hover zone */}
          {isCollapsed && (
            <>
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-20 rounded-b-lg"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent, var(--code-block-bg, hsl(var(--background))) 90%)",
                }}
              />
              <div
                className="expand-btn absolute inset-x-0 bottom-0 h-20 cursor-pointer transition-[height] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:h-[112px]"
                onClick={() => setExpanded(true)}
              />
            </>
          )}
        </div>
      </div>
    </>
  )
}
