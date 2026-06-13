"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { useParams } from "next/navigation"
import { useTheme } from "next-themes"
import {
  AN_TEMPLATES,
  getTemplateDemoUrl,
} from "@/lib/constants/agents-templates"
import { AgentsLink as Link } from "@/components/agents-link"
import { TemplateIcon } from "@/components/features/agents/an/docs/template-card"
import {
  CopyIcon,
  CheckIcon,
  ExternalLinkIcon,
} from "@/components/features/agents/an/docs/icons"
import { CodeBlock } from "@/components/features/agents/an/docs/code-block"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import type { Components } from "react-markdown"


function generateTemplatePrompt(
  template: (typeof AN_TEMPLATES)[number],
  readme: string | null,
  apiKey?: string,
) {
  const repoUrl = `https://github.com/${template.sourceRepo}/tree/main/${template.sourcePath}`
  let md = `# Template: ${template.name}\n\n`
  md += `${template.description}\n\n`
  md += `## Source\n\n`
  md += `- **Repository:** ${repoUrl}\n`
  md += `- **Path:** \`${template.sourcePath}\`\n`
  md += `- **Stack:** ${template.stack.join(", ")}\n`
  md += `- **Integrations:** ${template.integrations.join(", ")}\n\n`

  if (apiKey) {
    md += `## Credentials\n\n`
    md += `\`\`\`bash\nAPI_KEY_21ST=${apiKey}\n\`\`\`\n\n`
  }

  if (readme) {
    md += `## README\n\n${readme}\n\n`
  }

  md += `---\n\n`
  md += `Clone this template and follow the README to get started. `
  md += `Use the 21st Agents SDK to deploy and integrate the agent into your app.\n`

  return md.trim()
}

function generateTemplateOverviewMarkdown(
  template: (typeof AN_TEMPLATES)[number],
): string {
  const githubUrl = `https://github.com/${template.sourceRepo}/tree/main/${template.sourcePath}`

  return [
    `# ${template.name}`,
    "",
    template.description,
    "",
    `- [All Templates](/agents/docs/md/templates)`,
    `- [GitHub](${githubUrl})`,
    "",
    "## Use Cases",
    "",
    ...template.useCases.map((value) => `- ${value}`),
    "",
    "## Stack",
    "",
    ...template.stack.map((value) => `- ${value}`),
    "",
    "## Integrations",
    "",
    ...template.integrations.map((value) => `- ${value}`),
  ].join("\n")
}

export function TemplateDetailContent() {
  const params = useParams<{ slug: string }>()
  const [readme, setReadme] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [promptCopied, setPromptCopied] = useState(false)
  const [previewTheme, setPreviewTheme] = useState<"light" | "dark">("light")
  const [isDesktop, setIsDesktop] = useState(false)

  const template = AN_TEMPLATES.find((t) => t.slug === params.slug)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => {
    if (resolvedTheme) {
      setPreviewTheme(resolvedTheme === "dark" ? "dark" : "light")
    }
  }, [resolvedTheme])

  useEffect(() => {
    if (!template) return
    const url = `https://raw.githubusercontent.com/${template.sourceRepo}/main/${template.sourcePath}/README.md`
    fetch(url)
      .then((r) => (r.ok ? r.text() : null))
      .then((text) => {
        setReadme(text)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [template])

  const promptMarkdown = useMemo(
    () => (template ? generateTemplatePrompt(template, readme, undefined) : ""),
    [template, readme],
  )
  const overviewMarkdown = useMemo(
    () => (template ? generateTemplateOverviewMarkdown(template) : ""),
    [template],
  )

  const handleCopyPrompt = useCallback(() => {
    navigator.clipboard.writeText(promptMarkdown)
    setPromptCopied(true)
    setTimeout(() => setPromptCopied(false), 2000)
  }, [promptMarkdown])

  const mdComponents = useMemo<Components>(
    () => ({
      h1: ({ children }) => (
        <h1 className="text-lg font-semibold tracking-tight mt-8 mb-3 first:mt-0">
          {children}
        </h1>
      ),
      h2: ({ children }) => (
        <h2 className="text-[14px] font-medium text-foreground mt-8 mb-2">
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-[13px] font-medium mt-5 mb-1.5">{children}</h3>
      ),
      p: ({ children }) => (
        <p className="text-[13px] text-muted-foreground leading-relaxed my-2">
          {children}
        </p>
      ),
      a: ({ href, children }) => (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="an-focus-btn rounded font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors"
        >
          {children}
        </a>
      ),
      ul: ({ children }) => (
        <ul className="my-2 list-disc pl-5 space-y-1 text-[13px] text-muted-foreground leading-relaxed">
          {children}
        </ul>
      ),
      ol: ({ children }) => (
        <ol className="my-2 list-decimal pl-5 space-y-1 text-[13px] text-muted-foreground leading-relaxed">
          {children}
        </ol>
      ),
      li: ({ children }) => <li className="leading-relaxed">{children}</li>,
      code: ({ className, children }) => {
        const isInline = !className
        if (isInline) {
          return (
            <code className="rounded bg-secondary px-1 py-0.5 text-[12px] font-mono">
              {children}
            </code>
          )
        }
        return <code className={className}>{children}</code>
      },
      pre: ({ children }) => {
        const codeChild = children as React.ReactElement<{
          className?: string
          children?: React.ReactNode
        }>
        const className = codeChild?.props?.className ?? ""
        const lang = className.replace("language-", "") || "plaintext"
        const code = String(codeChild?.props?.children ?? "").replace(
          /\n$/,
          "",
        )
        return (
          <div className="my-3">
            <CodeBlock code={code} language={lang} />
          </div>
        )
      },
      table: ({ children }) => (
        <div className="my-3 overflow-hidden rounded-lg border border-border">
          <table className="w-full text-[13px]">{children}</table>
        </div>
      ),
      thead: ({ children }) => (
        <thead className="border-b border-border bg-muted/30">{children}</thead>
      ),
      th: ({ children }) => (
        <th className="px-3 py-2 text-left text-[11px] font-medium text-muted-foreground">
          {children}
        </th>
      ),
      td: ({ children }) => (
        <td className="border-b border-border/50 px-3 py-2.5 text-muted-foreground">
          {children}
        </td>
      ),
      blockquote: ({ children }) => (
        <div className="my-3 rounded-lg border border-border bg-secondary/30 p-3 text-[13px] text-muted-foreground leading-relaxed">
          {children}
        </div>
      ),
      hr: () => <hr className="my-6 border-border" />,
      img: ({ src, alt }) => (
        <img
          src={src}
          alt={alt ?? ""}
          className="my-3 max-w-full rounded-lg border border-border"
        />
      ),
      strong: ({ children }) => (
        <strong className="font-medium text-foreground">{children}</strong>
      ),
    }),
    [],
  )

  if (!template) {
    return <p className="text-muted-foreground">Template not found.</p>
  }

  const repoUrl = `https://github.com/${template.sourceRepo}/tree/main/${template.sourcePath}`
  const iframeDemoUrl = getTemplateDemoUrl(template, previewTheme)

  if (!iframeDemoUrl) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6 md:px-8 md:py-10">
        <TemplateInfo
          template={template}
          repoUrl={repoUrl}
          demoUrl={null}
          promptCopied={promptCopied}
          onCopyPrompt={handleCopyPrompt}
          readmeLoading={loading}
          readme={readme}
          mdComponents={mdComponents}
          overviewMarkdown={overviewMarkdown}
        />
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col lg:flex-row h-full">
      {/* Left panel - info (scrollable on desktop) */}
      <div className="w-full lg:w-[35%] lg:min-w-[320px] lg:max-w-[420px] lg:h-[calc(100svh-var(--agents-header-h,96px))] lg:overflow-y-auto lg:overscroll-contain shrink-0">
        <TemplateInfo
          template={template}
          repoUrl={repoUrl}
          demoUrl={iframeDemoUrl}
          promptCopied={promptCopied}
          onCopyPrompt={handleCopyPrompt}
          readmeLoading={loading}
          readme={readme}
          mdComponents={mdComponents}
          overviewMarkdown={overviewMarkdown}
          className="p-5 lg:pl-6 lg:pr-5 lg:pt-6 pb-20"
        />
      </div>

      {/* Right panel - iframe */}
      <div
        className="relative flex-1 min-h-[50vh] lg:h-[calc(100svh-var(--agents-header-h,96px))] lg:overflow-hidden"
        style={isDesktop ? { overscrollBehavior: "none", touchAction: "none" } : undefined}
      >
        <iframe
          key={previewTheme}
          title={`${template.name} demo`}
          src={iframeDemoUrl}
          loading="lazy"
          className="w-full h-full border-0 bg-background"
          style={{ minHeight: "50vh" }}
        />
      </div>
    </div>
  )
}

function TemplateInfo({
  template,
  repoUrl,
  demoUrl,
  promptCopied,
  onCopyPrompt,
  readmeLoading,
  readme,
  mdComponents,
  overviewMarkdown,
  className,
}: {
  template: (typeof AN_TEMPLATES)[number]
  repoUrl: string
  demoUrl: string | null
  promptCopied: boolean
  onCopyPrompt: () => void
  readmeLoading: boolean
  readme: string | null
  mdComponents: Components
  overviewMarkdown: string
  className?: string
}) {
  return (
    <div className={className}>
      <div data-markdown={overviewMarkdown}>
        {/* Back link */}
        <Link
          href="/agents/docs/templates"
          className="an-focus-btn rounded inline-flex items-center gap-1 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-5"
        >
          &larr; All Templates
        </Link>

        {/* Header */}
        <div className="flex items-start gap-3 mb-5">
          <TemplateIcon template={template} />
          <div className="min-w-0">
            <h1 className="text-[15px] font-semibold leading-tight">{template.name}</h1>
            <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed">{template.description}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={onCopyPrompt}
            className="an-focus-btn relative inline-flex h-8 items-center overflow-hidden rounded-lg bg-foreground px-3 text-[13px] font-medium text-background transition-[background-color,transform] duration-150 hover:bg-foreground/90 active:scale-[0.97]"
          >
            <span className={cn("flex items-center gap-1.5 transition-[opacity,transform] duration-200", promptCopied ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100")}>
              <CopyIcon className="h-3.5 w-3.5" />
              Copy prompt
            </span>
            <span className={cn("absolute inset-0 flex items-center justify-center gap-1.5 transition-[opacity,transform] duration-200", promptCopied ? "translate-y-0 opacity-100" : "translate-y-full opacity-0")}>
              <CheckIcon className="h-3.5 w-3.5" />
              Copied
            </span>
          </button>
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="an-focus-btn inline-flex h-8 items-center gap-1.5 rounded-lg border border-border px-3 text-[13px] font-medium text-foreground hover:bg-foreground/[0.04] transition-all active:scale-[0.97]"
          >
            GitHub
            <ExternalLinkIcon className="h-3.5 w-3.5" />
          </a>
          {demoUrl && (
            <a
              href={(() => { const url = new URL(demoUrl); url.searchParams.delete("sidebar"); return url.toString() })()}
              target="_blank"
              rel="noopener noreferrer"
              className="an-focus-btn inline-flex h-8 items-center gap-1.5 rounded-lg border border-border px-3 text-[13px] font-medium text-foreground hover:bg-foreground/[0.04] transition-all active:scale-[0.97]"
            >
              Open demo
              <ExternalLinkIcon className="h-3.5 w-3.5" />
            </a>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-col gap-4 mb-6">
          {[
            { label: "Use Cases", items: template.useCases, cls: "bg-blue-500/10 text-blue-400" },
            { label: "Stack", items: template.stack, cls: "bg-foreground/[0.06] text-muted-foreground" },
            { label: "Integrations", items: template.integrations, cls: "bg-foreground/[0.06] text-muted-foreground" },
          ].map(({ label, items, cls }) => (
            <div key={label}>
              <p className="text-[11px] font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">{label}</p>
              <div className="flex flex-wrap gap-1.5">
                {items.map((tag) => (
                  <span key={tag} className={cn("rounded-md px-2 py-0.5 text-[12px]", cls)}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* README */}
      <div className="border-t border-border/50 pt-5">
        <p className="text-[11px] font-medium text-muted-foreground mb-3 uppercase tracking-wide">README</p>
        {readmeLoading ? (
          <div className="space-y-2">
            {[85, 92, 60, 78, 95, 70].map((w, i) => (
              <div key={i} className="h-3 animate-pulse rounded bg-foreground/[0.05]" style={{ width: `${w}%` }} />
            ))}
          </div>
        ) : readme ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
            {readme}
          </ReactMarkdown>
        ) : (
          <p className="text-[13px] text-muted-foreground">Could not load README.</p>
        )}
      </div>
    </div>
  )
}
