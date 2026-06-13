import { Suspense } from "react"
import { ThreadsPageClient } from "./_components/threads-page-client"
import { AnLogoSpinner } from "@/components/features/agents/an/dashboard/an-logo-spinner"

export default function LogsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center">
          <AnLogoSpinner />
        </div>
      }
    >
      <ThreadsPageClient />
    </Suspense>
  )
}
