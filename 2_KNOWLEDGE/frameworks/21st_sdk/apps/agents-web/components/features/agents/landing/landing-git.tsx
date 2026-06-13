"use client"

import { Maximize2 } from "lucide-react"
import { motion } from "motion/react"
import { useState } from "react"
import { SectionHeader } from "./section-header"
import { VideoPreviewDialog } from "./video-preview-dialog"

const features = [
  {
    title: "Visual Staging & Diffs",
    description:
      "See exactly what changed. Stage files, review diffs, and commit with confidence.",
  },
  {
    title: "PR Creation",
    description:
      "Open pull requests directly from the UI. Add descriptions, reviewers, and labels.",
  },
  {
    title: "Worktree Isolation",
    description:
      "Every agent session runs in its own git worktree. No conflicts, no stashing.",
  },
]

export function LandingGit() {
  const [isHovered, setIsHovered] = useState(false)
  const [videoOpen, setVideoOpen] = useState(false)

  return (
    <section className="px-8 py-20 sm:py-28">
      <div className="grid gap-8 sm:grid-cols-2 items-start">
        {/* Left — header + feature list */}
        <div>
          <SectionHeader
            overline="Git integration"
            heading="Built-in Git, end to end."
            subtext="Stage, commit, diff, and open PRs without leaving the app. Git worktree isolation keeps every session clean."
          />

          <motion.div
            className="mt-12 space-y-6"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {features.map((feature) => (
              <div
                key={feature.title}
                className="border-l border-white/[0.1] pl-5"
              >
                <p className="text-[15px] font-semibold text-white/90">
                  {feature.title}
                </p>
                <p className="text-sm text-white/35 mt-0.5">
                  {feature.description}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — video, aligned with heading (offset past overline + mb-16) */}
        <motion.div
          className="relative rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden sm:mt-[calc(1rem+theme(spacing.16))]"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <video
            src="/git-client.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto"
          />
          {/* Fullscreen overlay */}
          <motion.button
            className="absolute top-2 right-2 p-1.5 rounded-md bg-black/50 backdrop-blur-sm text-white/70 hover:text-white transition-colors duration-150 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setVideoOpen(true)}
          >
            <Maximize2 className="h-3 w-3" />
          </motion.button>
        </motion.div>
        <VideoPreviewDialog
          src="/git-client.mp4"
          open={videoOpen}
          onClose={() => setVideoOpen(false)}
        />
      </div>
    </section>
  )
}
