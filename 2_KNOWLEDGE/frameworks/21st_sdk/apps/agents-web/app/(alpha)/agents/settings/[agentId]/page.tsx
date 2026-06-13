import { AgentSettingsClient } from "./_components/agent-settings-client"

export default async function AgentSettingsPage({
  params,
}: {
  params: Promise<{ agentId: string }>
}) {
  const { agentId } = await params
  return <AgentSettingsClient agentId={agentId} />
}
