import { Suspense } from "react"
import { AnLogoSpinner } from "@/components/features/agents/an/dashboard/an-logo-spinner"
import { PlaygroundPageClient } from "./_components/playground-page-client"

export default function PlaygroundPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center">
          <AnLogoSpinner />
        </div>
      }
    >
      <PlaygroundPageClient />
    </Suspense>
  )
}
