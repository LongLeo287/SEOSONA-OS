"use client"

import { memo } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

const mdComponents = {
  p: ({ children }: any) => (
    <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
  ),
  strong: ({ children }: any) => (
    <strong className="font-semibold text-foreground/90">{children}</strong>
  ),
  em: ({ children }: any) => <em className="italic">{children}</em>,
  code: ({ inline, className, children }: any) => {
    if (inline || (!className && String(children).length < 100 && !String(children).includes("\n"))) {
      return (
        <code className="bg-foreground/[0.08] text-foreground/80 text-[0.9em] rounded px-1 py-[1px] font-mono">
          {children}
        </code>
      )
    }
    return (
      <pre className="bg-foreground/[0.04] border border-foreground/[0.06] rounded-md px-3 py-2 my-2 overflow-x-auto">
        <code className="text-[0.85em] font-mono text-foreground/60 leading-relaxed">{children}</code>
      </pre>
    )
  },
  pre: ({ children }: any) => <>{children}</>,
  ul: ({ children }: any) => (
    <ul className="list-disc list-outside pl-4 space-y-0.5 mb-2">{children}</ul>
  ),
  ol: ({ children }: any) => (
    <ol className="list-decimal list-outside pl-5 space-y-0.5 mb-2">{children}</ol>
  ),
  li: ({ children }: any) => <li className="pl-0.5">{children}</li>,
  table: ({ children }: any) => (
    <div className="overflow-x-auto my-2 rounded-md border border-foreground/[0.08]">
      <table className="w-full text-[0.85em]">{children}</table>
    </div>
  ),
  thead: ({ children }: any) => (
    <thead className="border-b border-foreground/[0.1] bg-muted">{children}</thead>
  ),
  tbody: ({ children }: any) => <tbody>{children}</tbody>,
  tr: ({ children }: any) => <tr className="border-b border-foreground/[0.05] last:border-b-0">{children}</tr>,
  th: ({ children }: any) => (
    <th className="text-left font-medium text-foreground/60 px-2.5 py-1.5">{children}</th>
  ),
  td: ({ children }: any) => (
    <td className="text-foreground/50 px-2.5 py-1.5">{children}</td>
  ),
  a: ({ href, children }: any) => (
    <span className="text-blue-400/70">{children}</span>
  ),
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-2 border-foreground/[0.1] pl-3 italic text-foreground/50 mb-2">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-3 border-t border-foreground/[0.08]" />,
}

export const StreamingMarkdown = memo(function StreamingMarkdown({
  content,
  className,
}: {
  content: string
  className?: string
}) {
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
        {content}
      </ReactMarkdown>
    </div>
  )
})
