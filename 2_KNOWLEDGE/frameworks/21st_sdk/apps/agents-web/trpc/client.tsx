"use client"

import { QueryClientProvider, type QueryClient } from "@tanstack/react-query"
import {
  httpBatchStreamLink,
  httpLink,
  HTTPHeaders,
  loggerLink,
} from "@trpc/client"
import { splitLink } from "@trpc/client/links/splitLink"
import { createTRPCReact } from "@trpc/react-query"
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server"
import { useState } from "react"
import SuperJSON from "superjson"

import { type AppRouter } from "@/server/api/root"
import { createQueryClient } from "./query-client"

let clientQueryClientSingleton: QueryClient | undefined = undefined
const getQueryClient = () => {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return createQueryClient()
  }
  // Browser: use singleton pattern to keep the same query client
  clientQueryClientSingleton ??= createQueryClient()

  return clientQueryClientSingleton
}

export const api = createTRPCReact<AppRouter>()

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        splitLink({
          // Route particularly slow procedures over a non-batched link
          condition: (op) => SLOW_PROCEDURES.has(op.path),
          true: httpLink({
            url: getBaseUrl() + "/api/trpc",
            transformer: SuperJSON,
            headers: buildHeaders,
          }),
          // Everything else stays batched & streamed
          false: httpBatchStreamLink({
            transformer: SuperJSON,
            url: getBaseUrl() + "/api/trpc",
            headers: buildHeaders,
          }),
        }),
      ],
    }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  )
}

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT ?? 3000}`
}

// Centralized headers builder used by both links
function buildHeaders() {
  const headers = new Headers()
  headers.set("x-trpc-source", "nextjs-react")
  headers.set("x-21st-zone", "agents")

  if (typeof window !== "undefined") {
    try {
      const userState = localStorage.getItem("userState")
      const userId = localStorage.getItem("user_id")
      let anonId = localStorage.getItem("21st_anon_id")
      if (!anonId) {
        anonId = Math.random().toString(36).slice(2) + Date.now().toString(36)
        try {
          localStorage.setItem("21st_anon_id", anonId)
        } catch {}
      }

      if (userState) {
        const parsed = JSON.parse(userState)
        if (parsed?.id) {
          headers.set("x-user-id", parsed.id)
        }
      } else if (userId) {
        headers.set("x-user-id", userId)
      }

      if (anonId) {
        headers.set("x-anon-id", anonId)
      }
    } catch (error) {
      console.warn("Failed to parse user state:", error)
    }
  }

  return headers as unknown as HTTPHeaders
}

// Known slow procedures that should not be batched to avoid head-of-line blocking
const SLOW_PROCEDURES = new Set<string>([
  "teams.getUserProjects",
  "teams.getFavoriteProjects",
  "styleProfile.getPresetThemes",
  "inspiration.getFeaturedPages",
])
