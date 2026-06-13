"use client"

import { Suspense, useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"

import { useAgentsSession, useAgentsViewer } from "@/lib/agents/auth/client"
import {
  capture21stAgentsPageview,
  identify21stAgentsUser,
  init21stAgentsPostHog,
  reset21stAgentsUser,
} from "@/lib/posthog-21st-agents"

function PageviewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!pathname) return
    const query = searchParams?.toString()
    const url = query ? `${pathname}?${query}` : pathname
    capture21stAgentsPageview(`${window.location.origin}${url}`)
  }, [pathname, searchParams])

  return null
}

export function Agents21stPostHogProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const session = useAgentsSession()
  const viewer = useAgentsViewer()
  const lastIdentifiedUserIdRef = useRef<string | null>(null)

  useEffect(() => {
    init21stAgentsPostHog(session.userId ?? undefined)
  }, [session.userId])

  useEffect(() => {
    if (!session.isLoaded) return

    if (session.userId && viewer) {
      if (lastIdentifiedUserIdRef.current !== session.userId) {
        identify21stAgentsUser(session.userId, {
          email: viewer.email,
          name: viewer.fullName,
        })
        lastIdentifiedUserIdRef.current = session.userId
      }
      return
    }

    if (!session.isSignedIn && lastIdentifiedUserIdRef.current) {
      reset21stAgentsUser()
      lastIdentifiedUserIdRef.current = null
    }
  }, [session.isLoaded, session.isSignedIn, session.userId, viewer])

  return (
    <>
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
      {children}
    </>
  )
}
