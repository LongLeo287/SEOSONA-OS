import { agentsHref } from "@/lib/utils/agents-href"

export function toRelativeAuthRedirectUrl(redirectUrl?: string) {
  if (!redirectUrl) {
    if (typeof window !== "undefined") {
      return (
        `${window.location.pathname}${window.location.search}${window.location.hash}` ||
        agentsHref("/agents/app")
      )
    }

    return agentsHref("/agents/app")
  }

  if (redirectUrl.startsWith("/")) {
    return redirectUrl
  }

  if (typeof window === "undefined") {
    return agentsHref("/agents/app")
  }

  try {
    const url = new URL(redirectUrl, window.location.origin)
    return `${url.pathname}${url.search}${url.hash}` || agentsHref("/agents/app")
  } catch {
    return agentsHref("/agents/app")
  }
}
