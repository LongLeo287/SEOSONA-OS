"use client"

import { AnAuthRedirectLoader } from "@/app/agents/_components/an-auth-redirect-loader"
import { AgentsAuthRedirectCallback } from "@/lib/agents/auth/client"

export default function SSOCallbackPage() {
  return (
    <>
      <AgentsAuthRedirectCallback
        signInFallbackRedirectUrl="/agents/app"
        signUpFallbackRedirectUrl="/agents/app"
      />
      <AnAuthRedirectLoader />
    </>
  )
}
