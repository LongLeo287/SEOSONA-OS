import React, { memo, useMemo, useState, useCallback } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { cn } from "../utils/cn"
import { Check, Copy } from "lucide-react"

function fixNumberedListBreaks(text: string): string {
  return text.replace(/^(\d+)\.\s*\n+\s*\n*/gm, "$1. ")
}

// Minimal code theme using CSS vars
const codeTheme: Record<string, React.CSSProperties> = {
  'code[class*="language-"]': {
    fontFamily: "var(--an-code-font-family, ui-monospace, monospace)",
    fontSize: "var(--an-code-font-size, 13px)",
    color: "var(--an-code-color, #d4d4d4)",
    background: "transparent",
    textAlign: "left",
    whiteSpace: "pre-wrap",
    wordBreak: "normal",
    wordWrap: "break-word",
    lineHeight: "1.5",
    tabSize: 2,
  },
  'pre[class*="language-"]': {
    fontFamily: "var(--an-code-font-family, ui-monospace, monospace)",
    fontSize: "var(--an-code-font-size, 13px)",
    color: "var(--an-code-color, #d4d4d4)",
    background: "transparent",
    overflow: "auto",
    margin: 0,
    padding: 0,
    lineHeight: "1.5",
    tabSize: 2,
  },
  // Base style for all unstyled tokens — ensures text is always visible on dark code bg
  plain: {
    color: "var(--an-code-color, #d4d4d4)",
  },
  comment: { color: "#8b949e" },
  punctuation: { color: "#e6edf3" },
  property: { color: "#79c0ff" },
  tag: { color: "#7ee787" },
  boolean: { color: "#79c0ff" },
  number: { color: "#79c0ff" },
  string: { color: "#a5d6ff" },
  keyword: { color: "#ff7b72" },
  function: { color: "#d2a8ff" },
  "class-name": { color: "#ffa657" },
  operator: { color: "#e6edf3" },
  variable: { color: "#ffa657" },
}

function CodeBlock({
  language,
  children,
}: {
  language?: string
  children: string
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [children])

  return (
    <div
      className="an-code-block relative my-2 rounded-lg overflow-hidden"
      style={{
        border: "1px solid var(--an-border-color, #e5e5e5)",
        background: "var(--an-code-background, #1e1e1e)",
      }}
    >
      <button
        onClick={handleCopy}
        tabIndex={-1}
        className="absolute top-1.5 right-1.5 p-1 rounded hover:bg-white/10 transition-colors"
        title={copied ? "Copied!" : "Copy code"}
      >
        {copied ? (
          <Check className="w-3 h-3" style={{ color: "#4ade80" }} />
        ) : (
          <Copy className="w-3 h-3" style={{ color: "var(--an-code-color, #d4d4d4)", opacity: 0.5 }} />
        )}
      </button>
      <SyntaxHighlighter
        language={language as any}
        style={codeTheme}
        PreTag="div"
        customStyle={{
          margin: 0,
          padding: "0.5rem 0.75rem",
          paddingRight: "2rem",
        }}
        wrapLongLines
      >
        {children}
      </SyntaxHighlighter>
    </div>
  )
}

interface StreamingMarkdownProps {
  content: string
  className?: string
  textContrast?: "normal" | "high"
}

export const StreamingMarkdown = memo(function StreamingMarkdown({
  content,
  className,
  textContrast = "normal",
}: StreamingMarkdownProps) {
  const components = useMemo(
    () => ({
      h1: ({ children, ...props }: any) => (
        <h1 className="an-md-h1 text-base font-semibold mt-3 mb-1.5" {...props}>{children}</h1>
      ),
      h2: ({ children, ...props }: any) => (
        <h2 className="an-md-h2 text-base font-semibold mt-3 mb-1.5" {...props}>{children}</h2>
      ),
      h3: ({ children, ...props }: any) => (
        <h3 className="an-md-h3 text-sm font-semibold mt-2 mb-1" {...props}>{children}</h3>
      ),
      h4: ({ children, ...props }: any) => (
        <h4 className="an-md-h4 text-sm font-medium mt-2 mb-1" {...props}>{children}</h4>
      ),
      p: ({ children, ...props }: any) => (
        <p className="an-md-p text-sm leading-relaxed" style={{ color: "color-mix(in srgb, var(--an-foreground) 80%, transparent)" }} {...props}>{children}</p>
      ),
      ul: ({ children, ...props }: any) => (
        <ul className="an-md-ul list-disc list-outside space-y-0.5 text-sm mb-2 pl-4" style={{ color: "color-mix(in srgb, var(--an-foreground) 80%, transparent)" }} {...props}>{children}</ul>
      ),
      ol: ({ children, ...props }: any) => (
        <ol className="an-md-ol list-decimal list-outside space-y-0.5 text-sm mb-2 pl-5" style={{ color: "color-mix(in srgb, var(--an-foreground) 80%, transparent)" }} {...props}>{children}</ol>
      ),
      li: ({ children, ...props }: any) => (
        <li className="an-md-li text-sm pl-0.5" style={{ color: "color-mix(in srgb, var(--an-foreground) 80%, transparent)" }} {...props}>{children}</li>
      ),
      strong: ({ children, ...props }: any) => (
        <strong className="font-medium" style={{ color: "var(--an-foreground)" }} {...props}>{children}</strong>
      ),
      a: ({ href, children, ...props }: any) => {
        if (!href) return <span>{children}</span>
        const isExternal = href.startsWith("http") || href.startsWith("mailto:")
        return (
          <a
            {...props}
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="an-md-link hover:underline underline-offset-2"
            style={{ color: "var(--an-primary-color, #3b82f6)" }}
          >
            {children}
          </a>
        )
      },
      blockquote: ({ children, ...props }: any) => (
        <blockquote
          className="an-md-blockquote pl-3 italic mb-2 text-sm"
          style={{ borderLeft: "2px solid var(--an-border-color)", color: "color-mix(in srgb, var(--an-foreground) 70%, transparent)" }}
          {...props}
        >
          {children}
        </blockquote>
      ),
      hr: ({ ...props }: any) => (
        <hr className="an-md-hr my-4" style={{ borderColor: "var(--an-border-color)" }} {...props} />
      ),
      table: ({ children, ...props }: any) => (
        <div className="overflow-x-auto my-3 rounded-lg" style={{ border: "1px solid var(--an-border-color)" }}>
          <table className="an-md-table w-full text-xs" {...props}>{children}</table>
        </div>
      ),
      th: ({ children, ...props }: any) => (
        <th className="text-left font-medium px-3 py-2" style={{ background: "var(--an-background-secondary)" }} {...props}>{children}</th>
      ),
      td: ({ children, ...props }: any) => (
        <td className="px-3 py-2" style={{ borderTop: "1px solid var(--an-border-color)", color: "color-mix(in srgb, var(--an-foreground) 80%, transparent)" }} {...props}>{children}</td>
      ),
      pre: ({ children }: any) => <>{children}</>,
      code: ({ inline, className: codeClassName, children, ...props }: any) => {
        const match = /language-(\w+)/.exec(codeClassName || "")
        const language = match ? match[1] : undefined
        const codeContent = String(children)

        const shouldBeInline =
          inline || (!language && codeContent.length < 100 && !codeContent.includes("\n"))

        if (shouldBeInline) {
          return (
            <span
              className="an-md-inline-code font-mono text-[13px] rounded px-1 py-[1px] break-all"
              style={{ background: "var(--an-background-secondary)" }}
            >
              {children}
            </span>
          )
        }

        return (
          <CodeBlock language={language}>
            {String(children).replace(/\n$/, "")}
          </CodeBlock>
        )
      },
    }),
    [],
  )

  return (
    <div
      className={cn(
        "an-markdown",
        "overflow-hidden break-words",
        "[&_li>p]:inline [&_li>p]:mb-0",
        className,
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {fixNumberedListBreaks(content)}
      </ReactMarkdown>
    </div>
  )
})
