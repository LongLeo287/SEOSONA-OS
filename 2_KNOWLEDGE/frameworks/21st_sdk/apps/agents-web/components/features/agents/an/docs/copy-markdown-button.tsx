"use client"

import { useState, useCallback } from "react"
import { CheckIcon, MarkdownIcon } from "@/components/features/agents/an/docs/icons"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/features/agents/ui/1code/{components}/ui/tooltip"
import { cn } from "@/lib/utils"

/** Tags whose entire subtree should be dropped from markdown output */
const SKIP_TAGS = new Set(["button", "style", "svg", "script", "nav", "noscript", "aside"])

function getMarkdownOverride(node: HTMLElement): string | null {
  const raw = node.getAttribute("data-markdown")
  if (raw === null) return null
  return raw.replace(/\r\n?/g, "\n").trim()
}

/**
 * Detect an `an-docs-code` CodeBlock wrapper and extract filename + code.
 * Only matches if `node` itself has the class or a DIRECT child does.
 */
function tryExtractCodeBlock(node: HTMLElement): string | null {
  // CodeBlock renders: <div class="relative"> > <div class="...an-docs-code...">
  // Only match the immediate wrapper, not page-level containers
  if (node.querySelector("section") || node.querySelector("h1, h2, h3")) {
    return null
  }

  let codeContainer: Element | null = null
  if (node.classList.contains("an-docs-code")) {
    codeContainer = node
  } else {
    codeContainer = node.querySelector(".an-docs-code")
  }

  if (!codeContainer) return null

  // Extract filename from the caption div (contains a FileExtIcon svg + text)
  let filename = ""
  const filenameDiv = codeContainer.querySelector(
    ":scope > div:not([class*='absolute'])",
  )
  if (filenameDiv) {
    const text = Array.from(filenameDiv.childNodes)
      .filter((n) => n.nodeType === Node.TEXT_NODE)
      .map((n) => n.textContent?.trim())
      .filter(Boolean)
      .join("")
    if (text && !text.includes("{") && text.length < 100) {
      filename = text
    }
  }

  // Prefer raw code from data attribute (preserves unmasked secrets)
  // Fall back to parsing the rendered DOM
  const rawCode = codeContainer.getAttribute("data-raw-code")
  const codeText = rawCode?.trim() || codeContainer.querySelector("pre")?.textContent?.trim() || ""
  if (!codeText) return null

  // Guess language from filename extension
  const ext = filename.split(".").pop() || ""
  const langMap: Record<string, string> = {
    ts: "typescript",
    tsx: "tsx",
    js: "javascript",
    jsx: "jsx",
    py: "python",
    go: "go",
    json: "json",
    bash: "bash",
    sh: "bash",
  }
  const lang = langMap[ext] || ""

  let result = ""
  if (filename) result += `${filename}\n`
  result += `\`\`\`${lang}\n${codeText}\n\`\`\`\n\n`
  return result
}

/**
 * Detect the install-command block (tabs + $ prompt + code).
 * Matches the group/code wrapper div that directly contains .install-code.
 */
function tryExtractInstallBlock(node: HTMLElement): string | null {
  // The install block is: <div class="group/code"> containing .install-code somewhere inside.
  // Only match if this node IS the direct wrapper (has border/rounded styling or group/code).
  // Avoid matching on section/page-level divs by checking the node has the install-code
  // within its subtree AND the node doesn't contain <section> or <h1>-<h3> elements
  // (which would mean it's a page-level container, not the code block wrapper).
  if (node.querySelector("section") || node.querySelector("h1, h2, h3")) {
    return null
  }

  const installCode = node.querySelector(".install-code")
  if (!installCode) return null

  const codeEl =
    installCode.querySelector("code") ||
    installCode.querySelector(".shiki code")
  const text = codeEl?.textContent?.trim()
  if (!text) return null

  return `\`\`\`bash\n${text}\n\`\`\`\n\n`
}

function htmlToMarkdown(el: HTMLElement): string {
  let md = ""

  for (const node of Array.from(el.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      md += node.textContent || ""
      continue
    }

    if (!(node instanceof HTMLElement)) continue

    const tag = node.tagName.toLowerCase()

    // Skip UI-only elements entirely
    if (SKIP_TAGS.has(tag)) continue
    const markdownOverride = getMarkdownOverride(node)
    if (markdownOverride !== null) {
      if (markdownOverride) md += `${markdownOverride}\n\n`
      continue
    }

    // Try to extract CodeBlock or install block before generic div handling
    if (tag === "div") {
      const install = tryExtractInstallBlock(node)
      if (install) {
        md += install
        continue
      }
      const codeBlock = tryExtractCodeBlock(node)
      if (codeBlock) {
        md += codeBlock
        continue
      }
    }

    switch (tag) {
      case "h1":
        md += `# ${(node.textContent || "").trim()}\n\n`
        break
      case "h2":
        md += `## ${(node.textContent || "").trim()}\n\n`
        break
      case "h3":
        md += `### ${(node.textContent || "").trim()}\n\n`
        break
      case "p":
        md += `${inlineToMarkdown(node)}\n\n`
        break
      case "pre": {
        const codeEl = node.querySelector("code")
        const lang = codeEl?.className.match(/language-(\w+)/)?.[1] || ""
        const text = (codeEl || node).textContent || ""
        md += `\`\`\`${lang}\n${text.trim()}\n\`\`\`\n\n`
        break
      }
      case "ul": {
        const items = node.querySelectorAll(":scope > li")
        items.forEach((li) => {
          md += `- ${inlineToMarkdown(li as HTMLElement).trim()}\n`
        })
        md += "\n"
        break
      }
      case "ol": {
        const items = node.querySelectorAll(":scope > li")
        items.forEach((li, i) => {
          md += `${i + 1}. ${inlineToMarkdown(li as HTMLElement).trim()}\n`
        })
        md += "\n"
        break
      }
      case "table": {
        const rows = node.querySelectorAll("tr")
        rows.forEach((row, i) => {
          const cells = row.querySelectorAll("th, td")
          const rowText = Array.from(cells)
            .map((c) => (c.textContent || "").trim())
            .join(" | ")
          md += `| ${rowText} |\n`
          if (i === 0) {
            md += `| ${Array.from(cells).map(() => "---").join(" | ")} |\n`
          }
        })
        md += "\n"
        break
      }
      case "section":
      case "div":
      case "article":
      case "main":
        md += htmlToMarkdown(node)
        break
      default:
        md += inlineToMarkdown(node)
        break
    }
  }

  return md
}

function inlineToMarkdown(el: HTMLElement): string {
  let result = ""

  for (const node of Array.from(el.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      result += node.textContent || ""
      continue
    }

    if (!(node instanceof HTMLElement)) continue

    const tag = node.tagName.toLowerCase()

    if (SKIP_TAGS.has(tag)) continue
    const markdownOverride = getMarkdownOverride(node)
    if (markdownOverride !== null) {
      result += markdownOverride
      continue
    }

    if (tag === "a") {
      const href = node.getAttribute("href") || ""
      result += `[${(node.textContent || "").trim()}](${href})`
    } else if (tag === "strong" || tag === "b") {
      result += `**${(node.textContent || "").trim()}**`
    } else if (tag === "em" || tag === "i") {
      result += `*${(node.textContent || "").trim()}*`
    } else if (tag === "code") {
      result += `\`${node.textContent || ""}\``
    } else if (tag === "br") {
      result += "\n"
    } else {
      result += inlineToMarkdown(node)
    }
  }

  return result
}

export function CopyMarkdownButton() {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    const main = document.querySelector("main")
    if (!main) return

    const clone = main.cloneNode(true) as HTMLElement

    // Remove the copy-markdown button itself
    clone.querySelectorAll("[data-copy-md]").forEach((el) => el.remove())
    // Remove elements hidden from view (select-none prompt chars like "$")
    clone.querySelectorAll(".select-none").forEach((el) => el.remove())
    // Remove docs chrome (sidebar/mobile header) from markdown output
    clone.querySelectorAll("[data-sidebar]").forEach((el) => el.remove())
    clone.querySelectorAll("header").forEach((el) => el.remove())
    clone.querySelectorAll("[data-md-skip]").forEach((el) => el.remove())

    const markdown = htmlToMarkdown(clone).replace(/\n{3,}/g, "\n\n").trim()
    navigator.clipboard.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  return (
    <TooltipProvider delayDuration={150}>
      {/* Desktop */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            data-copy-md
            onClick={handleCopy}
            aria-label={copied ? "Copied!" : "Copy as markdown"}
            className="an-focus-btn hidden md:inline-flex items-center justify-center overflow-hidden rounded-[10px] border border-input bg-background shadow-sm shadow-black/5 size-[34px] text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.97] shrink-0"
          >
            <div className="relative size-5">
              <MarkdownIcon
                className={cn(
                  "absolute left-1/2 top-1/2 h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 transition-[opacity,transform] duration-200 ease-out",
                  copied ? "opacity-0 scale-50" : "opacity-100 scale-100",
                )}
              />
              <CheckIcon
                className={cn(
                  "absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 transition-[opacity,transform] duration-200 ease-out",
                  copied ? "opacity-100 scale-100" : "opacity-0 scale-50",
                )}
              />
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {copied ? "Copied!" : "Copy page as markdown"}
        </TooltipContent>
      </Tooltip>
      {/* Mobile */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            data-copy-md
            onClick={handleCopy}
            aria-label={copied ? "Copied!" : "Copy as markdown"}
            className="an-focus-btn md:hidden inline-flex items-center justify-center overflow-hidden rounded-[10px] border border-input bg-background shadow-sm shadow-black/5 size-[30px] text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.97] shrink-0"
          >
            <div className="relative size-4">
              <MarkdownIcon
                className={cn(
                  "absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 transition-[opacity,transform] duration-200 ease-out",
                  copied ? "opacity-0 scale-50" : "opacity-100 scale-100",
                )}
              />
              <CheckIcon
                className={cn(
                  "absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 transition-[opacity,transform] duration-200 ease-out",
                  copied ? "opacity-100 scale-100" : "opacity-0 scale-50",
                )}
              />
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {copied ? "Copied!" : "Copy page as markdown"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
