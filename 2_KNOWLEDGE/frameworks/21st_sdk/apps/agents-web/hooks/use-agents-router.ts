"use client"

import { useRouter } from "next/navigation"
import { useMemo } from "react"
import { agentsHref } from "@/lib/utils/agents-href"

export function useAgentsRouter() {
  const router = useRouter()
  return useMemo(
    () => ({
      ...router,
      push: (href: string, options?: Parameters<typeof router.push>[1]) =>
        router.push(agentsHref(href), options),
      replace: (href: string, options?: Parameters<typeof router.replace>[1]) =>
        router.replace(agentsHref(href), options),
    }),
    [router],
  )
}
