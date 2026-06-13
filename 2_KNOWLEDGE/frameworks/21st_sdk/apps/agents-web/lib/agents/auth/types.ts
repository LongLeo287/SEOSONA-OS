export type AgentsAuthProvider = "clerk" | "better-auth"

export interface AgentsSession {
  isLoaded: boolean
  isSignedIn: boolean
  userId: string | null
  provider: AgentsAuthProvider | null
}

export interface AgentsViewer {
  id: string
  firstName: string | null
  fullName: string | null
  username: string | null
  email: string | null
  imageUrl: string | null
  primaryEmailAddressId: string | null
  emailAddresses: Array<{
    id: string
    emailAddress: string
  }>
  externalAccounts: Array<{
    id: string
    provider: string
    username: string | null
    emailAddress: string | null
  }>
}

export interface AgentsPrincipal {
  isAuthenticated: boolean
  internalUserId: string | null
  provider: AgentsAuthProvider | null
  providerUserId: string | null
}

export interface AgentsAuthenticatedPrincipal extends AgentsPrincipal {
  isAuthenticated: true
  internalUserId: string
  provider: AgentsAuthProvider
  providerUserId: string | null
}

export type AgentsEmailAuthFlow = "sign-in" | "sign-up"
export type AgentsOAuthProvider = "google" | "github" | "okta"
