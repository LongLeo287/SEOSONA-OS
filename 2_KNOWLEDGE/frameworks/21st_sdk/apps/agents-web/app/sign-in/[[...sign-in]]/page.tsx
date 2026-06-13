"use client"

import { AnCustomSignIn } from "@/app/agents/_components/an-custom-sign-in"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function SignInContent() {
  const searchParams = useSearchParams()
  const redirectUrl =
    searchParams.get("redirect_url") || "/agents/app"

  return (
    <div className="an-theme">
      <AnCustomSignIn redirectUrl={redirectUrl} />
    </div>
  )
}

export default function AnSignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  )
}
