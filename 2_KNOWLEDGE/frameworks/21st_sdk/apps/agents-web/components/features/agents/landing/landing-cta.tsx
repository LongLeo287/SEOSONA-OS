"use client"

import { useDesktopDownload } from "@/hooks/use-desktop-download"
import { trackDesktopDownload } from "@/lib/posthog-agents"
import { Download } from "lucide-react"

interface LandingCTAProps {
  hasAgentsAccess: boolean | undefined
}

export function LandingCTA({ hasAgentsAccess }: LandingCTAProps) {
  const { downloadUrl, platform, platformLabel, isDesktopAvailable } =
    useDesktopDownload()

  return (
    <section className="px-8 py-20 sm:py-28">
      <h2 className="font-pixel text-[clamp(1.5rem,4vw,2.25rem)] leading-[1.15] tracking-wide text-white max-w-[20ch]">
        Ready to ship&nbsp;faster?
      </h2>
      <p className="mt-4 text-white/40 text-[17px]">
        Open source. Backed by Y&nbsp;Combinator. Built for developers who
        ship.
      </p>
      <div className="mt-8 flex items-center gap-3">
        {isDesktopAvailable && !hasAgentsAccess ? (
          <>
            <a
              href={downloadUrl ?? "#"}
              onClick={() =>
                trackDesktopDownload({
                  platform: platform ?? "unknown",
                  source: "bottom_cta",
                })
              }
              className="inline-flex items-center justify-center gap-2 rounded-full h-8 px-4 text-sm font-medium bg-white text-[#09090b] hover:bg-white/90 shadow-[0_0_0_0.5px_rgba(255,255,255,0.5),inset_0_0_0_1px_rgba(255,255,255,0.14)] active:scale-[0.99] transition-all duration-150"
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
              href="/1code/app"
              className="inline-flex items-center justify-center rounded-full h-8 px-4 text-sm font-medium bg-white text-[#09090b] hover:bg-white/90 shadow-[0_0_0_0.5px_rgba(255,255,255,0.5),inset_0_0_0_1px_rgba(255,255,255,0.14)] active:scale-[0.99] transition-all duration-150"
            >
              Open App
            </a>
            <a
              href={downloadUrl ?? "#"}
              onClick={() =>
                trackDesktopDownload({
                  platform: platform ?? "unknown",
                  source: "bottom_cta",
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
              href="/1code/app"
              className="inline-flex items-center justify-center rounded-full h-8 px-4 text-sm font-medium bg-white text-[#09090b] hover:bg-white/90 shadow-[0_0_0_0.5px_rgba(255,255,255,0.5),inset_0_0_0_1px_rgba(255,255,255,0.14)] active:scale-[0.99] transition-all duration-150"
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
      </div>
    </section>
  )
}
