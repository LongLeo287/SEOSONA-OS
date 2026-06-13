"use client"

import { SectionHeader } from "@/components/features/agents/landing/section-header"
import { motion } from "motion/react"

function NotionIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none">
      <path d="M6.017 4.313l55.333-4.087c6.797-.583 8.543-.19 12.817 2.917l17.663 12.443c2.913 2.083 3.897 2.723 3.897 5.053v68.243c0 4.277-1.553 6.807-6.99 7.193L24.467 99.967c-4.08.193-6.023-.39-8.16-3.113L3.3 79.94c-2.333-3.113-3.3-5.443-3.3-8.167V11.113c0-3.5 1.553-6.413 6.017-6.8z" fill="#fff"/>
      <path d="M61.35.227 6.017 4.313C1.553 4.7 0 7.613 0 11.113v60.66c0 2.724.967 5.054 3.3 8.167l13.007 16.913c2.137 2.723 4.08 3.307 8.16 3.113l64.257-3.89c5.437-.387 6.99-2.917 6.99-7.194V20.64c0-2.33-.984-2.97-3.897-5.053L74.167 3.143C69.893.027 68.147-.357 61.35.227zM25.89 19.523c-5.247.353-6.437.433-9.417-1.99L8.927 11.507c-.77-.78-.383-1.753 1.557-1.947l53.193-3.887c4.467-.39 6.793 1.167 8.543 2.527l9.123 6.61c.39.197 1.36 1.36.193 1.36l-54.933 3.307-.713.047zM19.803 88.3V30.367c0-2.53.777-3.697 3.103-3.893L86 22.78c2.14-.193 3.107 1.167 3.107 3.693v57.547c0 2.53-.39 4.67-3.883 4.863l-60.377 3.5c-3.497.193-5.043-.97-5.043-4.083zm59.6-54.827c.387 1.75 0 3.5-1.75 3.7l-2.91.577v42.773c-2.527 1.36-4.853 2.137-6.797 2.137-3.11 0-3.883-.977-6.21-3.887l-19.03-29.94v28.967l6.02 1.363s0 3.5-4.857 3.5l-13.39.777c-.39-.78 0-2.723 1.357-3.11l3.497-.97v-38.3l-4.857-.39c-.39-1.75.58-4.277 3.3-4.473l14.367-.967 19.8 30.327v-26.83l-5.047-.58c-.39-2.143 1.163-3.7 3.103-3.89l13.4-.78z" fill="#000" fillRule="evenodd" clipRule="evenodd"/>
    </svg>
  )
}

type Integration = {
  name: string
  description: string
  logo?: string
  icon?: React.FC<{ className?: string }>
}

const integrations: Integration[] = [
  {
    name: "Notion",
    description: "Update docs & wikis",
    icon: NotionIcon,
  },
  {
    name: "Linear",
    description: "Manage tasks & issues",
    logo: "https://svgl.app/library/linear.svg",
  },
  {
    name: "GitHub",
    description: "Issues, PRs & repos",
    logo: "https://svgl.app/library/github_dark.svg",
  },
  {
    name: "Slack",
    description: "Post updates & alerts",
    logo: "https://svgl.app/library/slack.svg",
  },
  {
    name: "Sentry",
    description: "Read errors & traces",
    logo: "https://svgl.app/library/sentry.svg",
  },
  {
    name: "PostgreSQL",
    description: "Query & migrate data",
    logo: "https://svgl.app/library/postgresql.svg",
  },
]

export function SdkIntegrations() {
  return (
    <section className="px-8 py-20 sm:py-28">
      <SectionHeader
        overline="Integrations"
        heading="Configure your sandbox with MCP."
        subtext="Add MCP servers to your agent's sandbox. Update Notion docs, create Linear tickets, query your database - all from inside the task."
      />

      <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {integrations.map((item, index) => (
          <motion.div
            key={item.name}
            className="flex flex-col items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-5 hover:bg-white/[0.04] transition-colors duration-150"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.04 }}
          >
            {item.icon ? (
              <item.icon className="w-7 h-7 opacity-80" />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={item.logo}
                alt={item.name}
                width={28}
                height={28}
                className="opacity-80"
              />
            )}
            <div className="text-center">
              <p className="text-[13px] font-medium text-white/80">{item.name}</p>
              <p className="text-[11px] text-white/30 mt-0.5">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.p
        className="mt-6 text-sm text-white/25"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        Any MCP-compatible server works. Bring your own or use community servers.
      </motion.p>
    </section>
  )
}
