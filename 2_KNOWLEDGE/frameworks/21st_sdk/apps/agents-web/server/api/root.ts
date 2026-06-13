import { agentConfigsRouter } from "@/server/api/routers/agent-configs/router"
import { anApiKeysRouter } from "./routers/an-api-keys/router"
import { anBillingRouter } from "./routers/an-billing/router"
import { anRunsRouter } from "./routers/an-runs/router"
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc"
import { agentsAdminRouter } from "./routers/agents-admin/router"
import { agentsRouter } from "./routers/agents/router"
import { mcpVaultsRouter } from "./routers/mcp-vaults/router"
import { styleProfileRouter } from "./routers/style-profile/router"
import { teamsRouter } from "./routers/teams/router"
import { usersRouter } from "./routers/users/router"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */

export const appRouter = createTRPCRouter({
  users: usersRouter,
  teams: teamsRouter,
  styleProfile: styleProfileRouter,
  agents: agentsRouter,
  agentsAdmin: agentsAdminRouter,
  agentConfigs: agentConfigsRouter,
  anApiKeys: anApiKeysRouter,
  anBilling: anBillingRouter,
  anRuns: anRunsRouter,
  mcpVaults: mcpVaultsRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter)
