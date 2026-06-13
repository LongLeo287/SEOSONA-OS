import { Suspense } from "react"
import { ProfilePageClient } from "./_components/profile-page-client"
import { AnLogoSpinner } from "@/components/features/agents/an/dashboard/an-logo-spinner"

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center">
          <AnLogoSpinner />
        </div>
      }
    >
      <ProfilePageClient />
    </Suspense>
  )
}
