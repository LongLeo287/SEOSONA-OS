import { Suspense } from "react"
import { StandaloneRunsPageClient } from "@/app/(alpha)/agents/_components/standalone-runs-page-client"
import { IS_STANDALONE_APP } from "@/lib/agents/auth/config"
import { Skeleton } from "@/components/ui/skeleton"
import { UsagePageClient } from "./_components/usage-page-client"

function UsageSkeleton() {
  return (
    <div className="h-full w-full overflow-auto bg-tl-background">
      <div className="mx-auto w-full max-w-[720px] px-8 py-6">
        <div className="flex flex-col gap-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export default function UsagePage() {
  return (
    <Suspense fallback={<UsageSkeleton />}>
      {IS_STANDALONE_APP ? (
        <StandaloneRunsPageClient title="Usage" />
      ) : (
        <UsagePageClient />
      )}
    </Suspense>
  )
}
