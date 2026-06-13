"use client"

import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Provider as JotaiProvider } from "jotai"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { FeaturebaseUserSync } from "@/components/features/support/featurebase-provider"
import { SettingsDialogProvider } from "@/components/providers/settings-dialog-provider"
import { IS_BETTER_AUTH } from "@/lib/agents/auth/config"
import { AgentsAuthUiProvider } from "@/lib/agents/auth/ui"
import { TRPCReactProvider } from "@/trpc/client"

const queryClient = new QueryClient()
const AGENTS_ZONE_HEADER_NAME = "x-21st-zone"
const AGENTS_ZONE_HEADER_VALUE = "agents"

declare global {
  interface Window {
    __agentsZoneOriginalFetch?: typeof fetch
  }
}

function AgentsZoneFetchPatch() {
  useEffect(() => {
    if (typeof window === "undefined") return

    const originalFetch = window.__agentsZoneOriginalFetch ?? window.fetch

    window.__agentsZoneOriginalFetch = originalFetch

    const patchedFetch = Object.assign(
      (async (input: URL | RequestInfo, init?: RequestInit) => {
        const request =
          input instanceof Request ? input : new Request(input, init)
        const url = new URL(request.url, window.location.origin)

        const shouldMarkRequest =
          url.origin === window.location.origin &&
          url.pathname.startsWith("/api/")

        if (!shouldMarkRequest) {
          return originalFetch(input, init)
        }

        const headers = new Headers(request.headers)
        headers.set(AGENTS_ZONE_HEADER_NAME, AGENTS_ZONE_HEADER_VALUE)

        return originalFetch(new Request(request, { headers }))
      }) as typeof fetch,
      originalFetch,
    )

    window.fetch = patchedFetch

    return () => {
      if (window.__agentsZoneOriginalFetch) {
        window.fetch = window.__agentsZoneOriginalFetch
        delete window.__agentsZoneOriginalFetch
      }
    }
  }, [])

  return null
}

function ThemedClerkProvider({
  children,
  is1CodeDomain = false,
}: {
  children: React.ReactNode
  is1CodeDomain?: boolean
}) {
  const { theme, resolvedTheme } = useTheme()
  const router = useRouter()

  // Use resolvedTheme for more accurate theme detection
  const isDark = resolvedTheme === "dark" || theme === "dark"

  const routerPush = (to: string) => {
    if (typeof window === "undefined") return
    try {
      router.push(to)
    } catch {
      window.location.href = to
    }
  }

  const routerReplace = (to: string) => {
    if (typeof window === "undefined") return
    try {
      router.replace(to)
    } catch {
      window.location.replace(to)
    }
  }

  const sharedProps = {
    allowedRedirectOrigins: [
      process.env.NEXT_PUBLIC_ONECODE_APP_URL,
      process.env.NEXT_PUBLIC_APP_URL,
    ].filter((origin): origin is string => Boolean(origin)),
    appearance: {
      baseTheme: isDark ? dark : undefined,
      variables: {
        colorPrimary: isDark ? "#fafafa" : "#2563eb",
      },
    },
  }

  if (is1CodeDomain) {
    return (
      <ClerkProvider
        {...sharedProps}
        routerPush={routerPush}
        routerReplace={routerReplace}
        isSatellite
        domain={new URL(process.env.NEXT_PUBLIC_ONECODE_APP_URL!).host}
        signInUrl={`${process.env.NEXT_PUBLIC_APP_URL!}/sign-in`}
        signUpUrl={`${process.env.NEXT_PUBLIC_APP_URL!}/sign-in`}
      >
        {children}
      </ClerkProvider>
    )
  }

  return <ClerkProvider {...sharedProps}>{children}</ClerkProvider>
}

function InnerAppProviders({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function AgentsAuthProvider({
  children,
  is1CodeDomain,
}: {
  children: React.ReactNode
  is1CodeDomain?: boolean
}) {
  if (IS_BETTER_AUTH) {
    return <>{children}</>
  }

  return (
    <ThemedClerkProvider is1CodeDomain={is1CodeDomain}>
      {children}
    </ThemedClerkProvider>
  )
}

export function AppProviders({
  children,
  is1CodeDomain,
}: {
  children: React.ReactNode
  is1CodeDomain?: boolean
}): React.ReactElement {
  return (
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        <AgentsAuthProvider is1CodeDomain={is1CodeDomain}>
          <AgentsAuthUiProvider>
            <TRPCReactProvider>
              <AgentsZoneFetchPatch />
              <FeaturebaseUserSync />
              <SettingsDialogProvider />
              <InnerAppProviders>{children}</InnerAppProviders>
            </TRPCReactProvider>
          </AgentsAuthUiProvider>
        </AgentsAuthProvider>
      </QueryClientProvider>
    </JotaiProvider>
  )
}
