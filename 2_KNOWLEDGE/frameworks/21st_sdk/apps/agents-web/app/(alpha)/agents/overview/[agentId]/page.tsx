import { AgentOverviewClient } from "./_components/agent-overview-client"

export default async function AgentOverviewPage({
  params,
}: {
  params: Promise<{ agentId: string }>
}) {
  const { agentId } = await params
  return <AgentOverviewClient agentId={agentId} />
}
