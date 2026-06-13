"use client"

import Script from "next/script"
import { useEffect } from "react"
import { useTheme } from "next-themes"
import { useUserProfile } from "@/components/hooks/use-user-profile"
import { useAtomValue } from "jotai"
import { userStateAtom } from "@/lib/store/user-store"
import { PLAN_LIMITS } from "@/lib/config/subscription-plans"

declare global {
  interface Window {
    Featurebase: ((...args: unknown[]) => void) & { q?: unknown[] }
  }
}

const FEATUREBASE_APP_ID = process.env.NEXT_PUBLIC_FEATUREBASE_APP_ID
const FEATUREBASE_ORG = process.env.NEXT_PUBLIC_FEATUREBASE_ORG

/**
 * Loads the Featurebase SDK script.
 */
export function FeaturebaseScript() {
  if (!FEATUREBASE_APP_ID) {
    return null
  }

  return (
    <>
      <Script
        id="featurebase-sdk-loader"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(e, t) {
              var a = "featurebase-sdk";
              function n() {
                if (!t.getElementById(a)) {
                  var s = t.createElement("script");
                  s.id = a;
                  s.src = "https://do.featurebase.app/js/sdk.js";
                  s.async = true;
                  t.head.appendChild(s);
                }
              }
              if (typeof e.Featurebase !== "function") {
                e.Featurebase = function() {
                  (e.Featurebase.q = e.Featurebase.q || []).push(arguments);
                };
              }
              if (t.readyState === "complete" || t.readyState === "interactive") {
                n();
              } else {
                t.addEventListener("DOMContentLoaded", n);
              }
            })(window, document);

            window.Featurebase("boot", {
              appId: "${FEATUREBASE_APP_ID}",
              hideDefaultLauncher: true
            });
          `,
        }}
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `
            #featurebase-iframe-wrapper.featurebase-messenger-frame-wrapper {
              --fb-element-bottom: 20px !important;
            }
            .featurebase-notification-frame-wrapper {
              --fb-element-bottom: 4px !important;
            }
          `,
        }}
      />
    </>
  )
}

/**
 * Syncs user info and theme with Featurebase.
 */
export function FeaturebaseUserSync() {
  const { user: dbUser, isLoading, clerkUser } = useUserProfile()
  const { resolvedTheme } = useTheme()
  const userState = useAtomValue(userStateAtom)
  const subscription = userState.subscription

  useEffect(() => {
    if (
      !FEATUREBASE_APP_ID ||
      isLoading ||
      typeof window === "undefined" ||
      !window.Featurebase
    ) {
      return
    }

// Get plan display name
    const planDisplayName = subscription
      ? PLAN_LIMITS[subscription.type]?.displayName ||
        subscription.name ||
        "Free"
      : "Free"

    // Initialize messenger (support chat)
    window.Featurebase("boot", {
      appId: FEATUREBASE_APP_ID,
      hideDefaultLauncher: true,
      theme: resolvedTheme === "dark" ? "dark" : "light",
      ...(dbUser
        ? {
            email: clerkUser?.primaryEmailAddress?.emailAddress,
            name:
              dbUser.display_name ||
              dbUser.name ||
              dbUser.display_username ||
              dbUser.username ||
              undefined,
            userId: dbUser.id,
            plan: planDisplayName,
          }
        : {}),
    })

    // Initialize feedback widget
    window.Featurebase("initialize_feedback_widget", {
      organization: FEATUREBASE_ORG,
      theme: "light",
      ...(dbUser
        ? {
            email: clerkUser?.primaryEmailAddress?.emailAddress,
          }
        : {}),
    })
  }, [dbUser, isLoading, clerkUser, resolvedTheme, subscription])

  return null
}

/**
 * Wrapper component that renders the Featurebase script and children.
 */
export function FeaturebaseProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <FeaturebaseScript />
      {children}
    </>
  )
}

/**
 * Opens the Featurebase support chat.
 */
export function openSupportChat() {
  if (typeof window === "undefined" || !window.Featurebase) {
    return
  }
  window.Featurebase("show")
}

/**
 * Opens the Featurebase feedback widget.
 */
export function openFeedbackWidget() {
  if (typeof window === "undefined") {
    return
  }
  window.postMessage({
    target: "FeaturebaseWidget",
    data: {
      action: "openFeedbackWidget",
    },
  })
}
