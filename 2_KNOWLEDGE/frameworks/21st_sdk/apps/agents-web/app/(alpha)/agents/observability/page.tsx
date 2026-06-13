import { Suspense } from "react"
import { ObservabilitySkeleton } from "./_components/observability-skeleton"
import { ObservabilityPageClient } from "./_components/observability-page-client"

export default function ObservabilityPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 flex-col overflow-auto bg-tl-background">
          <ObservabilitySkeleton />
        </div>
      }
    >
      <ObservabilityPageClient />
    </Suspense>
  )
}
