"use client"

import { createAuthClient } from "better-auth/react"
import { ssoClient } from "@better-auth/sso/client"

const baseURL =
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  undefined

export const betterAuthClient: ReturnType<typeof createAuthClient> =
  createAuthClient({
    ...(baseURL ? { baseURL } : {}),
    plugins: [ssoClient()],
  })
