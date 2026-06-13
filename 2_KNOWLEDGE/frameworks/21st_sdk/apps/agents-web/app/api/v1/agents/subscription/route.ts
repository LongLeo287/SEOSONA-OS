import { createRestRoute } from "@/lib/api/trpc-rest"

// GET /api/v1/agents/subscription
export const { GET } = createRestRoute("agents.getAgentsSubscription")
