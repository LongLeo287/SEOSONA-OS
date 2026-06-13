import { useAuth } from "@clerk/nextjs"
import { useEffect, useState } from "react"

import { Component, User } from "@/types/global"

/**
 * Hook for generating install URLs for components that can be used with shadcn CLI
 * @param component - Component object containing component_slug and other metadata
 * @param user - User object containing username
 * @returns install URL string or undefined if still loading
 */
export const useInstallUrl = (component: Component, user: User) => {
  const auth = useAuth()
  const [installUrl, setInstallUrl] = useState<string | undefined>()

  useEffect(() => {
    // TODO: Add custom template to make JWT live longer
    auth.getToken({ template: "long-token" }).then((token) => {
      const url = new URL(
        `${process.env.NEXT_PUBLIC_APP_URL}/r/${user.username}/${component.component_slug}`,
      )
      if (token) {
        url.searchParams.set("api_key", token)
      }
      setInstallUrl(url.toString())
    })
  }, [component.id, user.id])

  return installUrl
}




