import { Suspense } from "react"
import { EnvVarsPageClient } from "./_components/env-vars-page-client"
import { EnvVarsSkeleton } from "./_components/env-vars-skeleton"

export default function EnvVarsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 flex-col overflow-auto bg-tl-background">
          <EnvVarsSkeleton />
        </div>
      }
    >
      <EnvVarsPageClient />
    </Suspense>
  )
}
