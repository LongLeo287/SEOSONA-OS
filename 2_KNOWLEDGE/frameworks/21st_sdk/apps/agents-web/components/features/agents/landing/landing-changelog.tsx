"use client"

import { ProcessedRelease } from "@/types/changelog"
import { motion } from "motion/react"
import Link from "next/link"
import { SectionHeader } from "./section-header"

type SerializedRelease = Omit<ProcessedRelease, "publishedAt"> & {
  publishedAt: string
}

interface LandingChangelogProps {
  releases: SerializedRelease[]
}

export function LandingChangelog({ releases }: LandingChangelogProps) {
  if (releases.length === 0) return null

  return (
    <section className="px-8 py-20 sm:py-28">
      <SectionHeader overline="Changelog" heading="Always improving." />

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {releases.map((release, index) => (
          <motion.div
            key={release.id}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.04 }}
          >
            <Link
              href={`/agents/changelog#${release.version}`}
              className="block rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-colors duration-150 min-h-[202px]"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] text-white/40">
                  {release.version}
                </span>
                <time className="text-[11px] text-white/25">
                  {new Date(release.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </div>
              <h3 className="text-[15px] font-semibold text-white/90 mb-3">
                {release.title}
              </h3>
              {release.content && (
                <ul className="text-sm text-white/35 leading-relaxed space-y-1.5">
                  {release.content
                    .replace(/^#.*$/gm, "")
                    .replace(/What's New.*?[-—]/gi, "")
                    .split(/[-•]\s+/)
                    .map((item) => item.trim())
                    .filter((item) => item.length > 0)
                    .slice(0, 3)
                    .map((item, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-white/15 shrink-0">-</span>
                        <span className="line-clamp-1">
                          {item
                            .replace(/[*_`]/g, "")
                            .replace(/\n/g, " ")
                            .slice(0, 80)}
                          {item.length > 80 ? "..." : ""}
                        </span>
                      </li>
                    ))}
                </ul>
              )}
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Link
          href="/1code/changelog"
          className="text-sm text-white/25 hover:text-white/50 transition-colors duration-150"
        >
          View all updates &rarr;
        </Link>
      </motion.div>
    </section>
  )
}
