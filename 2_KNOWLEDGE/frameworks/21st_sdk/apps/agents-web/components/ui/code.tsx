"use client"

import * as shiki from "shiki"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useState, useEffect, useCallback, useRef } from "react"
import { useTheme } from "next-themes"

// Create a highlighter instance that can be reused
let highlighterPromise: Promise<shiki.Highlighter> | null = null

const getHighlighter = async () => {
  if (!highlighterPromise) {
    highlighterPromise = shiki.createHighlighter({
      themes: ["github-dark", "github-light"],
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
        "plaintext",
      ],
    })
  }
  return highlighterPromise
}

// Add custom styles for shiki container
const customShikiStyles = `
.code-wrapper .shiki,
.code-wrapper .shiki pre {
  background-color: transparent !important;
  margin: 0 !important;
  padding: 0 !important;
  font-family: inherit !important;
}
.code-wrapper .shiki code {
  display: inline-block;
  min-width: 100%;
}
`

const codeVariants = cva(
  "font-mono rounded-md cursor-pointer overflow-auto transition-all duration-200 relative shadow-inner",
  {
    variants: {
      display: {
        inline: "inline-flex bg-secondary py-0 px-1",
        block: "block bg-secondary p-2 mt-2 mb-4",
      },
      fontSize: {
        xs: "text-xs",
        sm: "text-sm",
        md: "text-md",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      display: "inline",
      fontSize: "xs",
    },
  },
)

interface CodeProps
  extends Omit<
      React.HTMLAttributes<HTMLDivElement>,
      keyof VariantProps<typeof codeVariants>
    >,
    VariantProps<typeof codeVariants> {
  code: string
  fontSize?: "xs" | "sm" | "md" | "lg"
  language?: string
  background?: string
}

const Code = ({
  code,
  language = "tsx",
  display,
  fontSize,
  className,
  background,
  style,
  ...props
}: CodeProps) => {
  const [isCopied, setIsCopied] = useState(false)
  const [highlightedCode, setHighlightedCode] = useState("")
  const { resolvedTheme } = useTheme()

  const highlight = useCallback(async () => {
    try {
      const highlighter = await getHighlighter()
      const supportedLanguages = await highlighter.getLoadedLanguages()
      const langToUse = supportedLanguages.includes(
        language as shiki.BundledLanguage,
      )
        ? language
        : "plaintext"

      const html = await highlighter.codeToHtml(code, {
        lang: langToUse as shiki.BundledLanguage,
        theme: resolvedTheme === "dark" ? "github-dark" : "github-light",
      })
      setHighlightedCode(html)
    } catch (error) {
      console.error("Failed to highlight code:", error)
      setHighlightedCode(`<pre><code>${code}</code></pre>`)
    }
  }, [code, language, resolvedTheme])

  useEffect(() => {
    highlight()
  }, [highlight])

  const handleCopyClick = async () => {
    if (isCopied) return

    // Check if there's any text selected
    const selection = window.getSelection()
    const hasSelection = selection && selection.toString().trim().length > 0

    // If there's a text selection, don't copy the entire code block
    if (hasSelection) {
      return
    }

    await navigator.clipboard.writeText(code)
    setIsCopied(true)
    toast.success("Copied to clipboard", {
      duration: 1500,
      className: "select-none",
    })

    setTimeout(() => {
      setIsCopied(false)
    }, 1000)
  }

  const handleMouseDown = (event: React.MouseEvent) => {
    // Store mouse position to detect if it's a click vs drag
    const startX = event.clientX
    const startY = event.clientY

    const handleMouseUp = (e: MouseEvent) => {
      const distance = Math.sqrt(
        Math.pow(e.clientX - startX, 2) + Math.pow(e.clientY - startY, 2),
      )

      // If mouse moved less than 3px, consider it a click (not a selection)
      if (distance < 3) {
        handleCopyClick()
      }

      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mouseup", handleMouseUp)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (isCopied) return

    // Copy on Enter or Space key
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      handleCopyClick()
    }
  }

  // Create a unique ref for this code block instance
  const codeBlockRef = useRef<HTMLDivElement>(null)

  // Global Cmd+C handler for this code block
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Only handle Cmd+C / Ctrl+C
      if (!((e.metaKey || e.ctrlKey) && e.key === "c")) return

      // Check if there's any text selected
      const selection = window.getSelection()
      const hasSelection = selection && selection.toString().trim().length > 0

      if (hasSelection) {
        // If there's a text selection, let browser handle copying selected text
        return
      }

      // Check if the current focused element is within this specific code block
      const activeElement = document.activeElement
      const isWithinThisCodeBlock =
        codeBlockRef.current?.contains(activeElement) ||
        activeElement === codeBlockRef.current

      if (isWithinThisCodeBlock) {
        // Prevent default and copy entire code block only when focused and no selection
        e.preventDefault()
        handleCopyClick()
      }
    }

    document.addEventListener("keydown", handleGlobalKeyDown)
    return () => document.removeEventListener("keydown", handleGlobalKeyDown)
  }, [isCopied, code])

  return (
    <>
      <style>{customShikiStyles}</style>
      <div
        ref={codeBlockRef}
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label="Click to copy code or select text"
        className={cn(
          "code-wrapper",
          codeVariants({ fontSize, display }),
          className,
          "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none",
          "relative",
          isCopied &&
            "before:absolute before:inset-0 before:rounded-md before:pointer-events-none before:bg-emerald-400/5 before:border before:border-emerald-400/20 before:animate-copy-success",
        )}
        style={{
          backgroundColor: background,
          ...style,
        }}
        {...props}
      >
        <div
          className="shiki-wrapper"
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </div>
    </>
  )
}

Code.displayName = "Code"

export { Code }
