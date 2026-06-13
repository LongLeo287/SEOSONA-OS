export type AgentsAuthMode = "clerk" | "better-auth"

const standaloneAppEnv = process.env.NEXT_PUBLIC_IS_STANDALONE_APP
const authModeEnv = process.env.NEXT_PUBLIC_AGENTS_AUTH_MODE

export const IS_STANDALONE_APP = standaloneAppEnv === "true"

export const AGENTS_AUTH_MODE: AgentsAuthMode =
  IS_STANDALONE_APP || authModeEnv === "better-auth"
    ? "better-auth"
    : "clerk"

export const IS_BETTER_AUTH = AGENTS_AUTH_MODE === "better-auth"
export const IS_CLERK_AUTH = AGENTS_AUTH_MODE === "clerk"

export const BETTER_AUTH_OKTA_PROVIDER_ID =
  process.env.NEXT_PUBLIC_BETTER_AUTH_OKTA_PROVIDER_ID || "okta"
