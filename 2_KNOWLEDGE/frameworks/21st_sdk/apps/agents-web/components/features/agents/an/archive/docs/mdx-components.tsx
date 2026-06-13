import type { MDXComponents } from "mdx/types"
import { CodeBlock } from "./code-block"
import { InstallTabs } from "./install-tabs"

function Callout({
  children,
  type = "note",
}: {
  children: React.ReactNode
  type?: "note" | "warning" | "important"
}) {
  const icons = {
    note: "💡",
    warning: "⚠️",
    important: "✅",
  }
  return (
    <div className={`callout callout-${type}`}>
      <span className="mr-2">{icons[type]}</span>
      {children}
    </div>
  )
}

function Steps({ children }: { children: React.ReactNode }) {
  return <div className="steps-container ml-4 border-l border-border pl-8 [counter-reset:step]">{children}</div>
}

function Step({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="step relative pb-8 [counter-increment:step]">
      <div className="absolute -left-[2.55rem] flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background text-xs font-mono text-muted-foreground before:content-[counter(step)]" />
      <h3 className="text-[15px] font-semibold text-foreground mb-2">{title}</h3>
      <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
    </div>
  )
}

function Properties({ children }: { children: React.ReactNode }) {
  return (
    <div className="properties divide-y divide-border border border-border rounded-xl overflow-hidden">
      {children}
    </div>
  )
}

function Property({
  name,
  type,
  required,
  children,
}: {
  name: string
  type: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="px-4 py-3 bg-secondary">
      <div className="flex items-center gap-2 mb-1">
        <code className="text-sm font-mono text-foreground">{name}</code>
        <span className="text-xs font-mono text-muted-foreground">{type}</span>
        {required && (
          <span className="text-[10px] uppercase tracking-widest text-amber-500 dark:text-amber-400 font-medium">
            required
          </span>
        )}
      </div>
      <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
    </div>
  )
}

function CodeGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="code-group rounded-xl border border-border overflow-hidden my-6">
      {children}
    </div>
  )
}

export const mdxComponents: MDXComponents = {
  Callout,
  Steps,
  Step,
  Properties,
  Property,
  CodeGroup,
  InstallTabs,
  "code-block": ({ "data-html": html, "data-code": code }: { "data-html": string; "data-code": string }) => (
    <CodeBlock html={html} code={code} />
  ),
  h1: (props) => (
    <h1
      className="text-[clamp(1.75rem,4vw,2.25rem)] font-semibold tracking-tight text-foreground mb-4 leading-tight"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="text-xl font-semibold tracking-tight text-foreground mt-12 mb-4 leading-tight"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="text-base font-semibold text-foreground mt-8 mb-3"
      {...props}
    />
  ),
  p: (props) => (
    <p className="text-[15px] text-muted-foreground leading-relaxed mb-4" {...props} />
  ),
  strong: (props) => (
    <strong className="font-semibold text-foreground" {...props} />
  ),
  ul: (props) => (
    <ul
      className="text-[15px] text-muted-foreground leading-relaxed mb-4 list-disc pl-5 space-y-1"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="text-[15px] text-muted-foreground leading-relaxed mb-4 list-decimal pl-5 space-y-1"
      {...props}
    />
  ),
  a: (props) => (
    <a
      className="text-foreground underline decoration-muted-foreground underline-offset-[3px] hover:decoration-muted-foreground transition-colors"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="bg-muted rounded px-1.5 py-0.5 text-[13px] font-mono text-foreground"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="bg-secondary border border-border rounded-xl p-4 overflow-x-auto text-[13px] leading-[1.7] font-mono my-6"
      {...props}
    />
  ),
  table: (props) => (
    <div className="overflow-x-auto my-6 rounded-xl border border-border overflow-hidden">
      <table className="w-full text-sm border-collapse" {...props} />
    </div>
  ),
  thead: (props) => (
    <thead className="border-b border-border" {...props} />
  ),
  tr: (props) => (
    <tr
      className="[&:not(:last-child)]:border-b [&:not(:last-child)]:border-border"
      {...props}
    />
  ),
  th: (props) => (
    <th
      className="text-left text-sm font-medium text-foreground px-3 py-2 bg-secondary border-r border-border last:border-r-0"
      {...props}
    />
  ),
  td: (props) => (
    <td
      className="text-sm text-muted-foreground px-3 py-2 border-r border-border last:border-r-0"
      {...props}
    />
  ),
  hr: () => <hr className="border-border my-12" />,
  blockquote: (props) => (
    <blockquote
      className="border-l-2 border-border pl-4 italic text-muted-foreground my-4"
      {...props}
    />
  ),
}
