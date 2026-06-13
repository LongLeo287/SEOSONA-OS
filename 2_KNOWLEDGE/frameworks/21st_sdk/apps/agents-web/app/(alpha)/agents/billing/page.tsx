import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { IS_STANDALONE_APP } from "@/lib/agents/auth/config"
import { redirect } from "next/navigation"
import { BillingPageClient } from "./_components/billing-page-client"

function BillingSkeleton() {
  return (
    <div className="h-full w-full overflow-auto bg-tl-background">
      <div className="mx-auto w-full max-w-[720px] px-8 py-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-16 rounded-md" />
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card">
            <div className="border-b p-4">
              <Skeleton className="h-5 w-16 mb-1" />
              <Skeleton className="h-4 w-96" />
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-10 w-48" />
              </div>
              <Skeleton className="h-2.5 w-full rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BillingPage() {
  if (IS_STANDALONE_APP) {
    redirect("/agents/usage")
  }

  return (
    <Suspense fallback={<BillingSkeleton />}>
      <BillingPageClient />
    </Suspense>
  )
}
