import { Suspense } from "react"
import { AnLogoSpinner } from "@/components/features/agents/an/dashboard/an-logo-spinner"
import { DeploymentDetailClient } from "./_components/deployment-detail-client"

export default async function DeploymentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center">
          <AnLogoSpinner />
        </div>
      }
    >
      <DeploymentDetailClient id={id} />
    </Suspense>
  )
}
