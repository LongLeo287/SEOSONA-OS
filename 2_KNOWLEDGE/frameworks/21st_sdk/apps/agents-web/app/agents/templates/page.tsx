"use client"

import { AN_STARTER_TEMPLATES, AN_USE_CASE_TEMPLATES, AN_INTEGRATION_TEMPLATES } from "@/lib/constants/agents-templates"
import type { AnTemplate } from "@/lib/constants/agents-templates"
import { agentsHref } from "@/lib/utils/agents-href"
import { useAgentsRouter } from "@/hooks/use-agents-router"
import { WizardShell } from "@/components/features/agents/an/wizard/wizard-shell"
import { TemplateIcon } from "@/components/features/agents/an/docs/template-card"
import { ArrowUpRight } from "lucide-react"

function TemplateCategoryGrid({
  label,
  templates,
  router,
}: {
  label: string
  templates: AnTemplate[]
  router: ReturnType<typeof useAgentsRouter>
}) {
  if (templates.length === 0) return null
  return (
    <div className="space-y-3 mb-8">
      <h2 className="text-[13px] font-medium text-muted-foreground">{label}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((tmpl) => (
          <button
            key={tmpl.slug}
            onClick={() =>
              router.push(agentsHref(`/agents/templates/${tmpl.slug}`))
            }
            className="an-focus-btn group flex flex-col gap-4 rounded-xl border border-border p-5 text-left transition-all duration-150 hover:border-foreground/20 hover:bg-foreground/[0.02] active:scale-[0.99]"
            style={{ borderWidth: "0.5px" }}
          >
            <div className="flex items-start justify-between">
              <TemplateIcon template={tmpl} size="lg" />
              <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <div>
              <p className="text-[14px] font-medium text-foreground">
                {tmpl.name}
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                {tmpl.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function TemplatesPage() {
  const router = useAgentsRouter()

  return (
    <WizardShell
      onBack={() => router.back()}
      wide
    >
      <div className="pb-20">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Templates</h1>
          <p className="mt-2 text-[14px] text-muted-foreground">
            Get started quickly with a pre-built agent template.
          </p>
        </div>

        <TemplateCategoryGrid label="Starters" templates={AN_STARTER_TEMPLATES} router={router} />
        <TemplateCategoryGrid label="Use Cases" templates={AN_USE_CASE_TEMPLATES} router={router} />
        <TemplateCategoryGrid label="Integrations" templates={AN_INTEGRATION_TEMPLATES} router={router} />
      </div>
    </WizardShell>
  )
}
