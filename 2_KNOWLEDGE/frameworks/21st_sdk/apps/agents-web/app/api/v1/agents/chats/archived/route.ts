import { createRestRoute } from "@/lib/api/trpc-rest"

// GET /api/v1/agents/chats/archived?teamId=xxx
export const { GET } = createRestRoute("agents.getArchivedChats")
