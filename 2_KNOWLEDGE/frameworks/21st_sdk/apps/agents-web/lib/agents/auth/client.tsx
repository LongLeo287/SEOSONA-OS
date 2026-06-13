"use client"

import {
  AuthenticateWithRedirectCallback,
  useAuth,
  useClerk,
  useSignIn,
  useSignUp,
  useUser,
} from "@clerk/nextjs"
import { useCallback, useEffect, useMemo } from "react"

import { betterAuthClient } from "./better-auth-client"
import {
  BETTER_AUTH_OKTA_PROVIDER_ID,
  IS_BETTER_AUTH,
} from "./config"
import { toRelativeAuthRedirectUrl } from "./redirect"
import type {
  AgentsEmailAuthFlow,
  AgentsOAuthProvider,
  AgentsSession,
  AgentsViewer,
} from "./types"

function getClerkErrorMessage(error: unknown, fallback: string) {
  if (error && typeof error === "object" && "errors" in error) {
    const errors = (error as { errors?: Array<{ longMessage?: string; message?: string }> }).errors
    const firstError = errors?.[0]
    if (firstError?.longMessage) return firstError.longMessage
    if (firstError?.message) return firstError.message
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}

function toAgentsAuthError(error: unknown, fallback: string) {
  return new Error(getClerkErrorMessage(error, fallback))
}

function getBetterAuthErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  if (error && typeof error === "object") {
    const message = (error as { message?: unknown }).message
    if (typeof message === "string" && message.length > 0) {
      return message
    }
  }

  return fallback
}

function splitFirstName(fullName: string | null | undefined) {
  if (!fullName) return null
  const value = fullName.trim()
  if (!value) return null
  return value.split(/\s+/)[0] ?? null
}

async function postBetterAuthJson<T>(path: string, body: Record<string, unknown>) {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  const payload = (await response.json().catch(() => null)) as T | null
  if (!response.ok) {
    throw new Error(
      getBetterAuthErrorMessage(payload, "Something went wrong"),
    )
  }

  return payload
}

export function useAgentsSession(): AgentsSession {
  if (IS_BETTER_AUTH) {
    const sessionState = betterAuthClient.useSession()

    return useMemo(
      () => ({
        isLoaded: !sessionState.isPending,
        isSignedIn: !!sessionState.data?.user?.id,
        userId: sessionState.data?.user?.id ?? null,
        provider: sessionState.data?.user?.id ? "better-auth" : null,
      }),
      [sessionState.data?.user?.id, sessionState.isPending],
    )
  }

  const authState = useAuth()

  return useMemo(
    () => ({
      isLoaded: authState.isLoaded,
      isSignedIn: authState.isSignedIn ?? !!authState.userId,
      userId: authState.userId ?? null,
      provider: authState.userId ? "clerk" : null,
    }),
    [authState.isLoaded, authState.isSignedIn, authState.userId],
  )
}

export function useAgentsViewer(): AgentsViewer | null {
  if (IS_BETTER_AUTH) {
    const sessionState = betterAuthClient.useSession()
    const user = sessionState.data?.user

    return useMemo(() => {
      if (!user) return null

      const fullName = user.name ?? null

      return {
        id: user.id,
        firstName: splitFirstName(fullName),
        fullName,
        username: null,
        email: user.email ?? null,
        imageUrl: user.image ?? null,
        primaryEmailAddressId: user.email ? "primary" : null,
        emailAddresses: user.email
          ? [
              {
                id: "primary",
                emailAddress: user.email,
              },
            ]
          : [],
        externalAccounts: [],
      }
    }, [user])
  }

  const { user } = useUser()

  return useMemo(() => {
    if (!user) return null

    return {
      id: user.id,
      firstName: user.firstName ?? null,
      fullName: user.fullName ?? null,
      username: user.username ?? null,
      email: user.primaryEmailAddress?.emailAddress ?? null,
      imageUrl: user.imageUrl ?? null,
      primaryEmailAddressId: user.primaryEmailAddressId ?? null,
      emailAddresses: user.emailAddresses.map((emailAddress) => ({
        id: emailAddress.id,
        emailAddress: emailAddress.emailAddress,
      })),
      externalAccounts: user.externalAccounts.map((account) => ({
        id: account.id,
        provider: account.provider,
        username: account.username ?? null,
        emailAddress: account.emailAddress ?? null,
      })),
    }
  }, [user])
}

export function useAgentsSignOut() {
  if (IS_BETTER_AUTH) {
    return useCallback(async (redirectUrl?: string) => {
      await betterAuthClient.signOut()

      if (redirectUrl && typeof window !== "undefined") {
        window.location.href = redirectUrl
      }
    }, [])
  }

  const { signOut } = useClerk()

  return useCallback(
    async (redirectUrl?: string) => {
      await signOut(redirectUrl ? { redirectUrl } : undefined)
    },
    [signOut],
  )
}

export function useAgentsAuthFlow() {
  if (IS_BETTER_AUTH) {
    const requestEmailCode = useCallback(async (_email: string): Promise<AgentsEmailAuthFlow> => {
      throw new Error("Email auth is not supported in Better Auth mode")
    }, [])

    const verifyEmailCode = useCallback(
      async (_params: {
        code: string
        flow: AgentsEmailAuthFlow
        redirectUrl: string
      }) => {
        throw new Error("Email auth is not supported in Better Auth mode")
      },
      [],
    )

    const startOAuth = useCallback(
      async ({
        provider,
        redirectUrlComplete,
      }: {
        provider: AgentsOAuthProvider
        redirectUrl: string
        redirectUrlComplete: string
      }) => {
        if (provider !== "okta") {
          throw new Error("Only Okta is supported in Better Auth mode")
        }

        const callbackURL = toRelativeAuthRedirectUrl(redirectUrlComplete)
        const result = await postBetterAuthJson<{ url?: string }>(
          "/api/auth/sign-in/sso",
          {
            providerId: BETTER_AUTH_OKTA_PROVIDER_ID,
            providerType: "saml",
            callbackURL,
          },
        )

        if (!result?.url) {
          throw new Error("Missing OAuth redirect URL")
        }

        if (typeof window !== "undefined") {
          window.location.href = result.url
        }
      },
      [],
    )

    return {
      isLoaded: true,
      requestEmailCode,
      verifyEmailCode,
      startOAuth,
    }
  }

  const { signIn, isLoaded: signInLoaded, setActive } = useSignIn()
  const { signUp, isLoaded: signUpLoaded } = useSignUp()
  const isLoaded = signInLoaded && signUpLoaded

  const requestEmailCode = useCallback(
    async (email: string): Promise<AgentsEmailAuthFlow> => {
      if (!isLoaded || !signIn || !signUp) {
        throw new Error("Auth is still loading")
      }

      try {
        const result = await signIn.create({ identifier: email })
        const emailCodeFactor = result.supportedFirstFactors?.find(
          (factor) =>
            factor.strategy === "email_code" && "emailAddressId" in factor,
        )

        if (!emailCodeFactor || !("emailAddressId" in emailCodeFactor)) {
          throw new Error("Email sign-in is not available")
        }

        await signIn.prepareFirstFactor({
          strategy: "email_code",
          emailAddressId: emailCodeFactor.emailAddressId,
        })

        return "sign-in"
      } catch (error) {
        const errorCode =
          error &&
          typeof error === "object" &&
          "errors" in error &&
          Array.isArray((error as { errors?: Array<{ code?: string }> }).errors)
            ? (error as { errors?: Array<{ code?: string }> }).errors?.[0]?.code
            : undefined

        if (errorCode !== "form_identifier_not_found") {
          throw toAgentsAuthError(error, "Something went wrong")
        }

        try {
          await signUp.create({ emailAddress: email })
          await signUp.prepareEmailAddressVerification({
            strategy: "email_code",
          })

          return "sign-up"
        } catch (signUpError) {
          throw toAgentsAuthError(signUpError, "Something went wrong")
        }
      }
    },
    [isLoaded, signIn, signUp],
  )

  const verifyEmailCode = useCallback(
    async ({
      code,
      flow,
      redirectUrl,
    }: {
      code: string
      flow: AgentsEmailAuthFlow
      redirectUrl: string
    }) => {
      if (!isLoaded || !setActive || !signIn || !signUp) {
        throw new Error("Auth is still loading")
      }

      try {
        const result =
          flow === "sign-up"
            ? await signUp.attemptEmailAddressVerification({ code })
            : await signIn.attemptFirstFactor({
                strategy: "email_code",
                code,
              })

        if (result.status !== "complete" || !result.createdSessionId) {
          throw new Error("Invalid code")
        }

        await setActive({ session: result.createdSessionId })

        if (typeof window !== "undefined") {
          window.location.href = redirectUrl
        }
      } catch (error) {
        throw toAgentsAuthError(error, "Invalid code")
      }
    },
    [isLoaded, setActive, signIn, signUp],
  )

  const startOAuth = useCallback(
    async ({
      provider,
      redirectUrl,
      redirectUrlComplete,
    }: {
      provider: AgentsOAuthProvider
      redirectUrl: string
      redirectUrlComplete: string
    }) => {
      if (!isLoaded || !signIn) {
        throw new Error("Auth is still loading")
      }

      try {
        await signIn.authenticateWithRedirect({
          strategy:
            provider === "google" ? "oauth_google" : "oauth_github",
          redirectUrl,
          redirectUrlComplete,
        })
      } catch (error) {
        throw toAgentsAuthError(error, "Something went wrong")
      }
    },
    [isLoaded, signIn],
  )

  return {
    isLoaded,
    requestEmailCode,
    verifyEmailCode,
    startOAuth,
  }
}

function BetterAuthRedirectCallback({
  redirectUrl,
}: {
  redirectUrl: string
}) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.location.replace(redirectUrl)
    }
  }, [redirectUrl])

  return null
}

export function AgentsAuthRedirectCallback({
  signInFallbackRedirectUrl = "/agents/app",
  signUpFallbackRedirectUrl = "/agents/app",
}: {
  signInFallbackRedirectUrl?: string
  signUpFallbackRedirectUrl?: string
}) {
  if (IS_BETTER_AUTH) {
    return <BetterAuthRedirectCallback redirectUrl={signInFallbackRedirectUrl} />
  }

  return (
    <AuthenticateWithRedirectCallback
      signInFallbackRedirectUrl={signInFallbackRedirectUrl}
      signUpFallbackRedirectUrl={signUpFallbackRedirectUrl}
    />
  )
}
