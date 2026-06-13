import { listTemplates } from "@/lib/agent-templates"
import { getAgentsServerSession } from "@/lib/agents/auth/server"

export async function GET() {
  const session = await getAgentsServerSession()
  const userId = session.internalUserId
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const templates = await listTemplates()
  return Response.json({ templates })
}
