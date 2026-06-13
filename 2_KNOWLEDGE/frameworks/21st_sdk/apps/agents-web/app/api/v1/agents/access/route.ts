import { createRestRoute } from "@/lib/api/trpc-rest"

// GET /api/v1/agents/access
export const { GET } = createRestRoute("agents.hasAgentsAccess")
