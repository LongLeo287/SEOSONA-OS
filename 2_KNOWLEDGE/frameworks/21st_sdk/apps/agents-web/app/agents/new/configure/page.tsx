"use client"

import { useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useAgentsRouter } from "@/hooks/use-agents-router"

function ConfigureRedirect() {
  const searchParams = useSearchParams()
  const router = useAgentsRouter()

  useEffect(() => {
    const params = searchParams.toString()
    router.replace(`/agents/new${params ? `?${params}` : ""}`)
  }, [searchParams, router])

  return null
}

export default function ConfigurePage() {
  return (
    <Suspense>
      <ConfigureRedirect />
    </Suspense>
  )
}
