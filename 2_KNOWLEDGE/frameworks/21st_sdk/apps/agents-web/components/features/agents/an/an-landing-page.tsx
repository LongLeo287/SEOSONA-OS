"use client"

import {
  DashedDivider,
} from "@/components/features/agents/landing/dashed-divider"
import { DiamondGridBackground } from "./diamond-grid-background"
import { AnNav } from "./an-nav"
import { AnHero } from "./an-hero"
import { AnSocialProof } from "./an-social-proof"
import { AnComponentShowcase } from "./an-component-showcase"
import { AnHowItWorks } from "./an-how-it-works"
import { AnBeforeAfter } from "./an-before-after"
import { AnCTA } from "./an-cta"
import { AnFooter } from "./an-footer"

export default function AnLandingPage() {
  return (
    <div
      data-an-landing
      className="dark h-screen overflow-y-auto bg-[#09090b] text-white antialiased selection:bg-white/20"
    >
      <div className="relative mx-auto w-full max-w-[1200px] border-x border-white/[0.06]">
        <DiamondGridBackground />
        <AnNav />
        <DashedDivider />
        <AnHero />
        <DashedDivider />
        <AnSocialProof />
        <DashedDivider />
        <AnComponentShowcase />
        <DashedDivider />
        {/* <AnHowItWorks /> */}
        {/* <DashedDivider /> */}
        <AnBeforeAfter />
        <DashedDivider />
        <AnCTA />
        <DashedDivider />
        <AnFooter />
      </div>
    </div>
  )
}
