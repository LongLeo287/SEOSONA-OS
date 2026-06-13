import { Suspense } from "react"
import { ApiKeysPageClient } from "./_components/api-keys-page-client"
import { ApiKeysSkeleton } from "./_components/api-keys-skeleton"

export default function ApiKeysPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 flex-col overflow-auto bg-tl-background">
          <ApiKeysSkeleton />
        </div>
      }
    >
      <ApiKeysPageClient />
    </Suspense>
  )
}
