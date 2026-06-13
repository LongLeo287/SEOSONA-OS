import { auth as clerkAuth } from "@clerk/nextjs/server"
import { headers as nextHeaders } from "next/headers"

import { getBetterAuth } from "./better-auth"
import { IS_BETTER_AUTH } from "./config"
import type {
  AgentsAuthenticatedPrincipal,
  AgentsAuthProvider,
  AgentsPrincipal,
} from "./types"

export class AgentsUnauthorizedError extends Error {
  status = 401

  constructor() {
    super("Unauthorized")
  }
}

function toAgentsPrincipal(
  userId: string | null | undefined,
  provider: AgentsAuthProvider,
  providerUserId?: string | null,
): AgentsPrincipal {
  if (!userId) {
    return {
      isAuthenticated: false,
      internalUserId: null,
      provider: null,
      providerUserId: null,
    }
  }

  return {
    isAuthenticated: true,
    internalUserId: userId,
    provider,
    providerUserId: providerUserId ?? null,
  }
}

async function getBetterAuthPrincipalFromHeaders(
  headers: Headers,
): Promise<AgentsPrincipal> {
  const session = await getBetterAuth().api.getSession({
    headers,
  })

  return toAgentsPrincipal(session?.user?.id, "better-auth", null)
}

export async function getAgentsServerSession(): Promise<AgentsPrincipal> {
  if (IS_BETTER_AUTH) {
    return getBetterAuthPrincipalFromHeaders(new Headers(await nextHeaders()))
  }

  const { userId } = await clerkAuth()
  return toAgentsPrincipal(userId, "clerk", userId)
}

export async function requireAgentsServerSession(): Promise<AgentsAuthenticatedPrincipal> {
  const session = await getAgentsServerSession()

  if (!session.isAuthenticated || !session.internalUserId || !session.provider) {
    throw new AgentsUnauthorizedError()
  }

  return {
    ...session,
    isAuthenticated: true,
    internalUserId: session.internalUserId,
    provider: session.provider,
    providerUserId: session.providerUserId,
  }
}

export async function getAgentsRequestSession(request: Request): Promise<AgentsPrincipal> {
  if (IS_BETTER_AUTH) {
    return getBetterAuthPrincipalFromHeaders(request.headers)
  }

  return getAgentsServerSession()
}

export async function requireAgentsRequestSession(
  request: Request,
): Promise<AgentsAuthenticatedPrincipal> {
  const session = await getAgentsRequestSession(request)

  if (!session.isAuthenticated || !session.internalUserId || !session.provider) {
    throw new AgentsUnauthorizedError()
  }

  return {
    ...session,
    isAuthenticated: true,
    internalUserId: session.internalUserId,
    provider: session.provider,
    providerUserId: session.providerUserId,
  }
}
