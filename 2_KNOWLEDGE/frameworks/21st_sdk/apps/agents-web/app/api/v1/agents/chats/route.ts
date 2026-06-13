import { createRestRoute } from "@/lib/api/trpc-rest"

// GET /api/v1/agents/chats?teamId=xxx
export const { GET } = createRestRoute("agents.getAgentChats")

// POST /api/v1/agents/chats  { teamId, request, repository, ... }
export const { POST } = createRestRoute("agents.createAgentChat")
