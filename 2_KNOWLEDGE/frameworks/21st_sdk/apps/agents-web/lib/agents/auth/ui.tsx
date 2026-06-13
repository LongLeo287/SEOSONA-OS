"use client"

import { Logo } from "@/components/features/agents/ui/canvas/[id]/{components}/ui/logo"
import { Spinner } from "@/components/icons/spinner"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { agentsHref } from "@/lib/utils/agents-href"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import { useAgentsAuthFlow, useAgentsSession } from "./client"
import { IS_BETTER_AUTH } from "./config"
import { toRelativeAuthRedirectUrl } from "./redirect"

type AgentsOpenSignInOptions = {
  redirectUrl?: string
}

type AgentsAuthUiContextValue = {
  isSignInOpen: boolean
  openSignIn: (options?: AgentsOpenSignInOptions) => void
  closeSignIn: () => void
}

const AgentsAuthUiContext = createContext<AgentsAuthUiContextValue | null>(null)

function resolveRedirectUrl(redirectUrl?: string) {
  return toRelativeAuthRedirectUrl(redirectUrl)
}

function BetterAuthSignInContent({
  redirectUrl,
}: {
  redirectUrl: string
}) {
  const { isLoaded, startOAuth } = useAgentsAuthFlow()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleContinue = useCallback(async () => {
    if (!isLoaded || loading) return

    setError("")
    setLoading(true)

    try {
      await startOAuth({
        provider: "okta",
        redirectUrl: agentsHref("/agents/sso-callback"),
        redirectUrlComplete: redirectUrl,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setLoading(false)
    }
  }, [isLoaded, loading, redirectUrl, startOAuth])

  return (
    <div className="space-y-6 p-8 sm:p-10">
      <div className="flex items-center justify-center gap-2.5">
        <Logo className="h-5 w-5 text-foreground" fill="currentColor" />
        <span className="text-[17px] font-semibold tracking-tight">21st</span>
      </div>

      <div className="space-y-2 text-center">
        <DialogTitle className="text-2xl font-semibold tracking-tight">
          Sign in to continue
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          Continue with your organization&apos;s Okta SSO.
        </DialogDescription>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={handleContinue}
          disabled={!isLoaded || loading}
          className="an-focus-btn relative flex h-11 w-full items-center justify-center overflow-hidden rounded-lg bg-foreground text-[15px] font-medium text-background transition-all duration-150 hover:bg-foreground/90 active:scale-[0.99] disabled:opacity-40"
        >
          <span
            className={cn(
              "transition-[opacity,transform] duration-200 ease-out",
              loading
                ? "-translate-y-full opacity-0"
                : "translate-y-0 opacity-100",
            )}
          >
            Continue with Okta
          </span>
          <span
            className={cn(
              "absolute inset-0 flex items-center justify-center transition-[opacity,transform] duration-200 ease-out",
              loading
                ? "translate-y-0 opacity-100"
                : "translate-y-full opacity-0",
            )}
          >
            <Spinner size={18} color="hsl(var(--background))" />
          </span>
        </button>

        {error ? (
          <p className="text-center text-[13px] text-red-400">{error}</p>
        ) : null}
      </div>
    </div>
  )
}

export function AgentsAuthUiProvider({
  children,
}: {
  children: ReactNode
}) {
  const { isLoaded, isSignedIn } = useAgentsSession()
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const [redirectUrl, setRedirectUrl] = useState(agentsHref("/agents/app"))

  const openSignIn = useCallback((options?: AgentsOpenSignInOptions) => {
    const nextRedirectUrl = resolveRedirectUrl(options?.redirectUrl)

    if (!IS_BETTER_AUTH) {
      window.location.assign(
        agentsHref(`/sign-in?redirect_url=${encodeURIComponent(nextRedirectUrl)}`),
      )
      return
    }

    setRedirectUrl(nextRedirectUrl)
    setIsSignInOpen(true)
  }, [])

  const closeSignIn = useCallback(() => {
    setIsSignInOpen(false)
  }, [])

  useEffect(() => {
    if (isSignInOpen && isLoaded && isSignedIn) {
      setIsSignInOpen(false)
    }
  }, [isLoaded, isSignInOpen, isSignedIn])

  const value = useMemo<AgentsAuthUiContextValue>(
    () => ({
      isSignInOpen,
      openSignIn,
      closeSignIn,
    }),
    [closeSignIn, isSignInOpen, openSignIn],
  )

  return (
    <AgentsAuthUiContext.Provider value={value}>
      {children}
      {IS_BETTER_AUTH ? (
        <Dialog open={isSignInOpen} onOpenChange={setIsSignInOpen}>
          <DialogContent
            hideCloseButton={false}
            className={cn(
              "overflow-hidden border-border bg-background p-0 w-[440px] max-w-[calc(100%-2rem)]",
            )}
          >
            <BetterAuthSignInContent redirectUrl={redirectUrl} />
          </DialogContent>
        </Dialog>
      ) : null}
    </AgentsAuthUiContext.Provider>
  )
}

export function useAgentsAuthUi() {
  const context = useContext(AgentsAuthUiContext)

  if (!context) {
    throw new Error("useAgentsAuthUi must be used within AgentsAuthUiProvider")
  }

  return context
}
