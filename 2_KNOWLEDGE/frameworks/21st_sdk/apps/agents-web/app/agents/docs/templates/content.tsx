"use client"

import { useState } from "react"
import { AN_TEMPLATES } from "@/lib/constants/agents-templates"
import {
  CategorizedTemplateGrid,
  TEMPLATE_CATEGORIES,
} from "@/components/features/agents/an/docs/template-card"
import { cn } from "@/lib/utils"

const TEMPLATES_MARKDOWN = AN_TEMPLATES
  .map(
    (tmpl) =>
      `- [${tmpl.name}](/agents/docs/md/templates/${tmpl.slug}) - ${tmpl.description}`,
  )
  .join("\n")

export function TemplatesContent() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  return (
    <div className="mx-auto flex max-w-[1200px] px-4 sm:px-6">
      {/* Sidebar */}
      <nav className="hidden md:flex flex-col gap-px w-[200px] shrink-0 sticky top-0 pt-6 pb-10 overflow-y-auto max-h-[calc(100svh-var(--agents-header-h,96px))]">
        <button
          onClick={() => setActiveCategory(null)}
          className={cn(
            "an-focus-btn rounded-md px-2 py-1.5 text-sm font-medium text-left",
            activeCategory === null
              ? "bg-foreground/[0.06] text-foreground"
              : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground",
          )}
        >
          All Templates
        </button>
        {TEMPLATE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "an-focus-btn rounded-md px-2 py-1.5 text-sm font-medium text-left",
              activeCategory === cat.id
                ? "bg-foreground/[0.06] text-foreground"
                : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground",
            )}
          >
            {cat.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <div className="flex-1 min-w-0 py-6 md:py-10 md:px-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          {activeCategory
            ? TEMPLATE_CATEGORIES.find((c) => c.id === activeCategory)?.label
            : "Templates"}
        </h1>
        <p className="mt-2 text-[14px] text-muted-foreground leading-relaxed">
          Pre-built agent templates to get started quickly. Clone a template,
          deploy it, and integrate into your app.
        </p>

        <div className="mt-6" data-markdown={TEMPLATES_MARKDOWN}>
          <CategorizedTemplateGrid
            templates={AN_TEMPLATES}
            activeCategory={activeCategory ?? undefined}
          />
        </div>
      </div>
    </div>
  )
}
