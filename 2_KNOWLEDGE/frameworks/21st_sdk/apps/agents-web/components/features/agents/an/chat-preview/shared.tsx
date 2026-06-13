"use client"

import { memo } from "react"
import { motion } from "motion/react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

/* Image thumbnail — matches AgentImageItem (size-8, rounded, object-cover) */
export function ImageThumb({ src }: { src: string }) {
  return (
    <img
      src={src}
      alt="attachment"
      className="size-8 object-cover rounded cursor-pointer"
    />
  )
}

/* Replay button — appears when animation completes */
export function ReplayButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      whileTap={{ scale: 0.85 }}
      className="absolute bottom-3 right-3 z-20 w-8 h-8 rounded-full bg-foreground/[0.06] flex items-center justify-center hover:bg-foreground/[0.12] transition-colors cursor-pointer backdrop-blur-sm"
      title="Replay"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </svg>
    </motion.button>
  )
}

/* Paperclip icon */
export function PaperclipIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-foreground/30">
      <path d="M6 11V15C6 18.3137 8.68629 21 12 21C15.3137 21 18 18.3137 18 15V7C18 4.79086 16.2091 3 14 3C11.7909 3 10 4.79086 10 7V15C10 16.1046 10.8954 17 12 17C13.1046 17 14 16.1046 14 15V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

/* Send button — round, glow ring */
export function SendButton() {
  return (
    <div className="h-7 w-7 rounded-full bg-foreground/70 flex items-center justify-center shadow-[0_0_0_2px_hsl(var(--background)),0_0_0_4px_rgba(128,128,128,0.08)]">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--background))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m5 12 7-7 7 7" /><path d="M12 19V5" />
      </svg>
    </div>
  )
}

/* ── Streaming Markdown renderer ── */

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
