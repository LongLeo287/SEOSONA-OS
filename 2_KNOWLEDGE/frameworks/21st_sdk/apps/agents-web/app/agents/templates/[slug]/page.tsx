"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { useParams } from "next/navigation"
import { AN_TEMPLATES } from "@/lib/constants/agents-templates"
import { useAgentsRouter } from "@/hooks/use-agents-router"
import { WizardShell } from "@/components/features/agents/an/wizard/wizard-shell"
import { TemplateIcon } from "@/components/features/agents/an/docs/template-card"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
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

export default function TemplateDetailPage() {
  const params = useParams<{ slug: string }>()
  const router = useAgentsRouter()
  const [readme, setReadme] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [promptCopied, setPromptCopied] = useState(false)

  const template = AN_TEMPLATES.find((t) => t.slug === params.slug)

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

  const handleCopyPrompt = useCallback(() => {
    navigator.clipboard.writeText(promptMarkdown)
    setPromptCopied(true)
    setTimeout(() => setPromptCopied(false), 2000)
  }, [promptMarkdown])

  if (!template) {
    return (
      <WizardShell
        onBack={() => router.back()}
      >
        <p className="text-muted-foreground">Template not found.</p>
      </WizardShell>
    )
  }

  const repoUrl = `https://github.com/${template.sourceRepo}/tree/main/${template.sourcePath}`

  const mdComponents = useMemo<Components>(
    () => ({
      h1: ({ children }) => (
        <h1 className="text-2xl font-semibold tracking-tight mt-10 mb-4 first:mt-0">
          {children}
        </h1>
      ),
      h2: ({ children }) => (
        <h2 className="text-[15px] font-medium text-foreground mt-10 mb-3">
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-[13px] font-medium mt-6 mb-2">{children}</h3>
      ),
      p: ({ children }) => (
        <p className="text-[13px] text-muted-foreground leading-relaxed my-3">
          {children}
        </p>
      ),
      a: ({ href, children }) => (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors"
        >
          {children}
        </a>
      ),
      ul: ({ children }) => (
        <ul className="my-3 list-disc pl-5 space-y-1.5 text-[13px] text-muted-foreground leading-relaxed">
          {children}
        </ul>
      ),
      ol: ({ children }) => (
        <ol className="my-3 list-decimal pl-5 space-y-1.5 text-[13px] text-muted-foreground leading-relaxed">
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
        // Block code is handled by the pre component
        return <code className={className}>{children}</code>
      },
      pre: ({ children }) => {
        // Extract language and code from the <code> child
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
          <div className="my-4">
            <CodeBlock code={code} language={lang} />
          </div>
        )
      },
      table: ({ children }) => (
        <div className="my-4 overflow-hidden rounded-lg border border-border">
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
        <div className="my-4 rounded-lg border border-border bg-secondary/30 p-3.5 text-[13px] text-muted-foreground leading-relaxed">
          {children}
        </div>
      ),
      hr: () => <hr className="my-8 border-border" />,
      img: ({ src, alt }) => (
        <img
          src={src}
          alt={alt ?? ""}
          className="my-4 max-w-full rounded-lg border border-border"
        />
      ),
      strong: ({ children }) => (
        <strong className="font-medium text-foreground">{children}</strong>
      ),
    }),
    [],
  )

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      {/* Absolute nav */}
      <nav className="fixed top-0 left-0 right-0 z-20 flex items-center px-5 py-4">
        <button
          onClick={() => router.back()}
          className="an-focus-btn flex items-center gap-1.5 rounded-md text-muted-foreground hover:text-foreground/70 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          <span className="text-[13px]">Back</span>
        </button>
      </nav>

      <div className="mx-auto w-full max-w-[900px] px-6 pt-16 pb-20">
        {/* Hero */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <TemplateIcon template={template} size="lg" />
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                {template.name}
              </h1>
              <p className="mt-1 text-[14px] text-muted-foreground">
                {template.description}
              </p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={handleCopyPrompt}
              className="relative an-focus-btn inline-flex h-9 items-center overflow-hidden rounded-lg bg-foreground px-4 text-[13px] font-medium text-background transition-[background-color,transform] duration-150 ease-out hover:bg-foreground/90 active:scale-[0.97]"
            >
              <span
                className={cn(
                  "flex items-center gap-1.5 transition-[opacity,transform] duration-200 ease-out",
                  promptCopied
                    ? "-translate-y-full opacity-0"
                    : "translate-y-0 opacity-100",
                )}
              >
                <CopyIcon className="h-3.5 w-3.5" />
                Copy prompt
              </span>
              <span
                className={cn(
                  "absolute inset-0 flex items-center justify-center gap-1.5 transition-[opacity,transform] duration-200 ease-out",
                  promptCopied
                    ? "translate-y-0 opacity-100"
                    : "translate-y-full opacity-0",
                )}
              >
                <CheckIcon className="h-3.5 w-3.5" />
                Copied
              </span>
            </button>
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="an-focus-btn inline-flex h-9 items-center gap-2 rounded-lg border border-border px-4 text-[13px] font-medium text-foreground transition-all duration-150 hover:bg-foreground/[0.04] active:scale-[0.97]"
              style={{ borderWidth: "0.5px" }}
            >
              GitHub
              <ExternalLinkIcon className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Content + Sidebar */}
        <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-start">
          {/* README */}
          <div className="min-w-0 flex-1">
            {loading ? (
              <div className="space-y-3">
                {[85, 92, 60, 78, 95, 70, 88, 65].map((w, i) => (
                  <div
                    key={i}
                    className="h-4 animate-pulse rounded bg-foreground/[0.05]"
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>
            ) : readme ? (
              <div className="max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={mdComponents}
                >
                  {readme}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-[14px] text-muted-foreground">
                Could not load README.
              </p>
            )}
          </div>

          {/* Sticky Sidebar */}
          <div className="w-full flex-shrink-0 lg:w-48 lg:sticky lg:top-6 lg:self-start">
            <div className="flex flex-row flex-wrap gap-8 lg:flex-col lg:gap-6">
              <div>
                <p className="text-[13px] font-medium text-foreground mb-2">
                  GitHub Repo
                </p>
                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  {template.sourceRepo.split("/")[1]}
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </div>
              <div>
                <p className="text-[13px] font-medium text-foreground mb-2">
                  Use Cases
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {template.useCases.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-blue-500/10 px-2 py-0.5 text-[12px] text-blue-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[13px] font-medium text-foreground mb-2">
                  Stack
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {template.stack.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-foreground/[0.06] px-2 py-0.5 text-[12px] text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[13px] font-medium text-foreground mb-2">
                  Integrations
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {template.integrations.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-foreground/[0.06] px-2 py-0.5 text-[12px] text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
