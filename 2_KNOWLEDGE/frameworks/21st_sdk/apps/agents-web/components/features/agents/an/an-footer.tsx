"use client"

import { agentsHref } from "@/lib/utils/agents-href"

const footerLinks = [
  { label: "Docs", href: agentsHref("/agents/docs") },
  { label: "GitHub", href: "https://github.com/21st-dev", external: true },
  { label: "Discord", href: "https://discord.gg/Aq2B7bCp", external: true },
  { label: "Blog", href: "https://21st.dev/blog", external: true },
  { label: "X", href: "https://x.com/21st_dev", external: true },
]

export function AnFooter() {
  return (
    <div className="px-4 sm:px-8 py-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-[13px] text-foreground/40">Agents by 21st</span>
      <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
        {footerLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            className="text-[13px] text-foreground/40 hover:text-foreground/60 transition-colors"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </div>
  )
}
