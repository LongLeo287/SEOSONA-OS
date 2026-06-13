"use client"

import { Logo } from "@/components/features/agents/ui/canvas/[id]/{components}/ui/logo"
import { GitHubStarsBasic } from "@/components/ui/github-stars-number"
import { useDesktopDownload } from "@/hooks/use-desktop-download"
import { DISCORD_1CODE_OPENSOURCE } from "@/lib/config/discord"
import { trackDesktopDownload } from "@/lib/posthog-agents"
import { Download, Maximize2 } from "lucide-react"
import { motion } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { DashedBox, DashedDivider } from "./dashed-divider"
import { VideoPreviewDialog } from "./video-preview-dialog"

interface LandingHeroProps {
  showAuthButton: boolean
  authButtonLabel: string
  hasAgentsAccess: boolean | undefined
}

export function LandingHero({
  showAuthButton,
  authButtonLabel,
  hasAgentsAccess,
}: LandingHeroProps) {
  const [videoOpen, setVideoOpen] = useState(false)
  const ctaRef = useRef<HTMLAnchorElement>(null)
  const { downloadUrl, platform, platformLabel, isDesktopAvailable } =
    useDesktopDownload()
  useEffect(() => {
    ctaRef.current?.focus()
  }, [])

  return (
    <>
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5">
        <span className="flex items-center gap-2 text-sm font-medium tracking-tight">
          <Logo className="w-4 h-4" fill="white" />
          1Code <span className="text-white/40 hidden sm:inline">by 21st</span>
        </span>

        <div className="flex items-center gap-2">
          {/* Agents SDK link */}
          <a
            href="/agents"
            className="hidden sm:inline-flex items-center justify-center rounded-full h-8 px-3 text-sm font-medium text-white/50 hover:text-white active:scale-[0.99] transition-all duration-150"
          >
            Agents SDK
          </a>
          {/* GitHub link with stars */}
          <a
            href="https://github.com/21st-dev/1Code"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full h-8 px-3 text-sm font-medium bg-white/5 border border-white/[0.08] text-white/70 hover:bg-white/10 hover:text-white active:scale-[0.99] transition-all duration-150"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <GitHubStarsBasic repo="21st-dev/1Code" />
          </a>
          {/* Discord link */}
          <a
            href={DISCORD_1CODE_OPENSOURCE}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 rounded-full h-8 px-3 text-sm font-medium bg-white/5 border border-white/[0.08] text-white/70 hover:bg-white/10 hover:text-white active:scale-[0.99] transition-all duration-150"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            Discord
          </a>
          {/* Login/Open App */}
          {showAuthButton && (
            <a
              href="/1code/app"
              className="inline-flex items-center justify-center rounded-full h-8 px-4 text-sm font-medium bg-white text-[#09090b] hover:bg-white/90 shadow-[0_0_0_0.5px_rgba(255,255,255,0.5),inset_0_0_0_1px_rgba(255,255,255,0.14)] active:scale-[0.99] transition-all duration-150"
            >
              {authButtonLabel}
            </a>
          )}
        </div>
      </nav>

      <DashedDivider />

      {/* Hero */}
      <section className="px-8 pt-20 pb-16 sm:pt-28 sm:pb-24">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16">
          {/* Left: text */}
          <div className="flex-1 min-w-0">
            {/* YC Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/5 text-sm text-white/60 mb-8"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <span className="text-white/40">Backed by</span>
              <svg
                className="w-4 h-4 text-white/70"
                viewBox="0 0 256 256"
                fill="none"
              >
                <rect width="256" height="256" rx="40" fill="currentColor" />
                <path
                  d="M119.374 144.746L75.433 62.432h20.081l25.848 52.092c.398.928.862 1.889 1.392 2.883.53.994.994 2.022 1.391 3.082.266.398.464.762.597 1.094.133.33.265.63.398.894a65.643 65.643 0 0 1 1.79 3.877c.53 1.26.993 2.42 1.39 3.48 1.061-2.254 2.221-4.673 3.48-7.257 1.26-2.585 2.552-5.27 3.877-8.053l26.246-52.092h18.69l-44.34 83.308v53.087h-16.9v-54.081z"
                  fill="#09090b"
                />
              </svg>
              <span>Combinator</span>
            </motion.div>

            <motion.h1
              className="font-pixel text-[clamp(2rem,5vw,3.25rem)] leading-[1.1] tracking-wide text-white max-w-[18ch]"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.04 }}
            >
              A calm, visual client for parallel&nbsp;work.
            </motion.h1>

            <motion.p
              className="mt-5 text-[17px] text-white/45 max-w-[36ch] leading-relaxed"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.12 }}
            >
              Claude Code and Codex in one app. Switch agents, take the best of each, ship with the best UI.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="mt-8 flex items-center gap-3"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.16 }}
            >
              {isDesktopAvailable && !hasAgentsAccess ? (
                <>
                  <a
                    ref={ctaRef}
                    href={downloadUrl ?? "#"}
                    onClick={() =>
                      trackDesktopDownload({
                        platform: platform ?? "unknown",
                        source: "hero_cta",
                      })
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-full h-8 px-4 text-sm font-medium bg-white text-[#09090b] hover:bg-white/90 shadow-[0_0_0_0.5px_rgba(255,255,255,0.5),inset_0_0_0_1px_rgba(255,255,255,0.14)] active:scale-[0.99] transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b]"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download for {platformLabel}
                  </a>
                  <a
                    href="/1code/app"
                    className="inline-flex items-center justify-center rounded-full h-8 px-4 text-sm font-medium bg-white/5 backdrop-blur-sm border border-white/[0.08] text-white/70 hover:bg-white/10 hover:text-white active:scale-[0.99] transition-all duration-150"
                  >
                    Start on Web
                  </a>
                </>
              ) : hasAgentsAccess && isDesktopAvailable ? (
                <>
                  <a
                    ref={ctaRef}
                    href="/1code/app"
                    className="inline-flex items-center justify-center rounded-full h-8 px-4 text-sm font-medium bg-white text-[#09090b] hover:bg-white/90 shadow-[0_0_0_0.5px_rgba(255,255,255,0.5),inset_0_0_0_1px_rgba(255,255,255,0.14)] active:scale-[0.99] transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b]"
                  >
                    Open App
                  </a>
                  <a
                    href={downloadUrl ?? "#"}
                    onClick={() =>
                      trackDesktopDownload({
                        platform: platform ?? "unknown",
                        source: "hero_cta",
                      })
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-full h-8 px-4 text-sm font-medium bg-white/5 backdrop-blur-sm border border-white/[0.08] text-white/70 hover:bg-white/10 hover:text-white active:scale-[0.99] transition-all duration-150"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Desktop
                  </a>
                </>
              ) : (
                <>
                  <a
                    ref={ctaRef}
                    href="/1code/app"
                    className="inline-flex items-center justify-center rounded-full h-8 px-4 text-sm font-medium bg-white text-[#09090b] hover:bg-white/90 shadow-[0_0_0_0.5px_rgba(255,255,255,0.5),inset_0_0_0_1px_rgba(255,255,255,0.14)] active:scale-[0.99] transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b]"
                  >
                    {hasAgentsAccess ? "Open App" : "Start building"}
                  </a>
                  <a
                    href="https://github.com/21st-dev/1Code"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full h-8 px-4 text-sm font-medium bg-white/5 backdrop-blur-sm border border-white/[0.08] text-white/70 hover:bg-white/10 hover:text-white active:scale-[0.99] transition-all duration-150"
                  >
                    View on GitHub
                  </a>
                </>
              )}
            </motion.div>
          </div>

          {/* Right: video in dashed box */}
          <motion.div
            className="mt-14 lg:mt-0 shrink-0 w-full lg:w-[560px]"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <DashedBox className="px-2 py-2">
              <div className="group relative cursor-pointer" onClick={() => setVideoOpen(true)}>
                <video
                  src="/1code-preview.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full rounded-sm"
                />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 p-1.5 rounded-md bg-black/50 backdrop-blur-sm text-white/70 hover:text-white">
                  <Maximize2 className="w-3 h-3" />
                </div>
              </div>
            </DashedBox>
            <VideoPreviewDialog
              src="/1code-preview.mp4"
              open={videoOpen}
              onClose={() => setVideoOpen(false)}
            />
          </motion.div>
        </div>
      </section>
    </>
  )
}
