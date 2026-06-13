"use client"

import { AgentsLink as Link } from "@/components/agents-link"
import type { AnTemplate } from "@/lib/constants/agents-templates"
import Image from "next/image"
import {
  FileText,
  Activity,
  NotebookPen,
} from "lucide-react"
import { BookIcon } from "@/components/features/agents/an/docs/icons"

const CHAT_APP_TEMPLATE_ICON = (
  <Image
    src="/agents/templates/logos/nextjs.svg"
    alt="Next.js"
    width={18}
    height={18}
    className="dark:invert"
  />
)

const GO_TEMPLATE_ICON = (
  <Image
    src="/agents/templates/logos/go.svg"
    alt="Go"
    width={24}
    height={10}
    className="dark:invert"
  />
)

const TEMPLATE_ICONS: Record<string, React.ReactNode> = {
  "chat-app": CHAT_APP_TEMPLATE_ICON,
  "python-terminal-chat": (
    <Image
      src="/agents/templates/logos/python.svg"
      alt="Python"
      width={18}
      height={18}
      className="dark:invert"
    />
  ),
  "golang-terminal-chat": GO_TEMPLATE_ICON,
  "fill-form": <FileText className="h-5 w-5" />,
  "note-taker": <NotebookPen className="h-5 w-5" />,
  "monitor-agent": <Activity className="h-5 w-5" />,
  "docs-assistant": <BookIcon className="h-5 w-5" />,
}

const PARTNER_LOGOS: Record<
  string,
  { src: string; invert?: "dark" | "light"; size?: number }
> = {
  "Nia MCP": { src: "/agents/templates/logos/nia.svg", invert: "dark", size: 28 },
  AgentMail: { src: "/agents/templates/logos/agentmail.svg", invert: "dark" },
  Convex: { src: "/agents/templates/logos/convex.svg", invert: "dark", size: 24 },
  Slack: { src: "/agents/templates/logos/slack.svg", invert: "dark" },
  "Browser Use": { src: "/agents/templates/logos/browseruse.svg", invert: "dark" },
}

/**
 * Returns the primary third-party integration name, if any.
 * Filters out "21st Agents SDK" and "Claude Code" which are standard.
 */
function getThirdPartyIntegration(tmpl: AnTemplate): string | null {
  const thirdParty = tmpl.integrations.filter(
    (i) => i !== "21st Agents SDK" && i !== "Claude Code" && i in PARTNER_LOGOS,
  )
  return thirdParty[0] || null
}

function PartnerLogo({ name, sizeOverride }: { name: string; sizeOverride?: number }) {
  const logo = PARTNER_LOGOS[name]
  if (logo) {
    const w = sizeOverride ?? logo.size ?? 20
    const invertClass =
      logo.invert === "dark"
        ? "dark:invert"
        : logo.invert === "light"
          ? "invert dark:invert-0"
          : ""
    return (
      <Image
        src={logo.src}
        alt={name}
        width={w}
        height={w}
        className={invertClass}
      />
    )
  }
  return (
    <span className="text-[9px] font-semibold leading-none text-center text-muted-foreground select-none">
      {name}
    </span>
  )
}

const ICON_SIZES = {
  sm: { container: "h-7 w-7 rounded-md", icon: "h-4 w-4", logo: 14 },
  md: { container: "h-9 w-9 rounded-lg", icon: "h-5 w-5", logo: undefined },
  lg: { container: "h-10 w-10 rounded-xl", icon: "h-5 w-5", logo: undefined },
} as const

const TEMPLATE_ICONS_SM: Record<string, React.ReactNode> = {
  "chat-app": (
    <Image
      src="/agents/templates/logos/nextjs.svg"
      alt="Next.js"
      width={14}
      height={14}
      className="dark:invert"
    />
  ),
  "python-terminal-chat": (
    <Image
      src="/agents/templates/logos/python.svg"
      alt="Python"
      width={14}
      height={14}
      className="dark:invert"
    />
  ),
  "golang-terminal-chat": GO_TEMPLATE_ICON,
  "fill-form": <FileText className="h-4 w-4" />,
  "note-taker": <NotebookPen className="h-4 w-4" />,
  "monitor-agent": <Activity className="h-4 w-4" />,
  "docs-assistant": <BookIcon className="h-4 w-4" />,
}

export function TemplateIcon({ template, size = "md" }: { template: AnTemplate; size?: "sm" | "md" | "lg" }) {
  const s = ICON_SIZES[size]
  const partner = getThirdPartyIntegration(template)

  if (partner) {
    return (
      <div className={`flex shrink-0 items-center justify-center ${s.container} bg-foreground/[0.05] text-foreground`}>
        <PartnerLogo name={partner} sizeOverride={s.logo} />
      </div>
    )
  }

  const icon = size === "sm"
    ? (TEMPLATE_ICONS_SM[template.slug] || <Activity className="h-4 w-4" />)
    : (TEMPLATE_ICONS[template.slug] || <Activity className="h-5 w-5" />)

  return (
    <div className={`flex shrink-0 items-center justify-center ${s.container} bg-foreground/[0.05] text-foreground`}>
      {icon}
    </div>
  )
}

export function TemplateCard({ template }: { template: AnTemplate }) {
  return (
    <Link
      href={`/agents/docs/templates/${template.slug}`}
      className="an-focus-btn group block rounded-[12px] text-left"
    >
      <div
        className="relative w-full h-[180px] rounded-[12px] overflow-hidden flex flex-col items-start justify-between p-5 bg-muted/50 group-hover:bg-muted/80 transition-colors duration-200"
        style={{
          boxShadow: "inset 0 0 0 1px #0000000a, 0 1px 3px #00000012",
        }}
      >
        <TemplateIcon template={template} />
        <div className="space-y-1.5 w-full">
          <p className="text-[14px] font-medium text-foreground leading-tight">
            {template.name}
          </p>
          <p className="text-[12px] text-muted-foreground leading-relaxed line-clamp-2">
            {template.description}
          </p>
        </div>
      </div>
    </Link>
  )
}

export function TemplateGrid({ templates }: { templates: AnTemplate[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {templates.map((tmpl) => (
        <TemplateCard key={tmpl.slug} template={tmpl} />
      ))}
    </div>
  )
}

export const TEMPLATE_CATEGORIES = [
  { id: "starter", label: "Starters" },
  { id: "use-case", label: "Use Cases" },
  { id: "integration", label: "Integrations" },
] as const

export function CategorizedTemplateGrid({
  templates,
  activeCategory,
}: {
  templates: AnTemplate[]
  activeCategory?: string
}) {
  const starters = templates.filter((t) => t.category === "starter")
  const useCases = templates.filter((t) => t.category === "use-case")
  const integrations = templates.filter((t) => t.category === "integration")

  const sections = [
    { id: "starter", label: "Starters", items: starters },
    { id: "use-case", label: "Use Cases", items: useCases },
    { id: "integration", label: "Integrations", items: integrations },
  ].filter((s) => !activeCategory || s.id === activeCategory)

  return (
    <div className="space-y-8">
      {sections.map(
        ({ id, label, items }) =>
          items.length > 0 && (
            <div key={id} id={`category-${id}`} className="space-y-3">
              <h3 className="text-[13px] font-medium text-muted-foreground">
                {label}
              </h3>
              <TemplateGrid templates={items} />
            </div>
          ),
      )}
    </div>
  )
}
