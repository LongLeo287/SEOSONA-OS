import { Suspense } from "react"
import { SkillsPageClient } from "./_components/skills-page-client"
import { AnLogoSpinner } from "@/components/features/agents/an/dashboard/an-logo-spinner"

export default function SkillsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center">
          <AnLogoSpinner />
        </div>
      }
    >
      <SkillsPageClient />
    </Suspense>
  )
}
