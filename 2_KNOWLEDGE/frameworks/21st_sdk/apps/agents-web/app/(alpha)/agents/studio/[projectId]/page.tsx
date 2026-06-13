import { WorkspaceClient } from "./_components/workspace-client"

export default async function StudioWorkspacePage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>
  searchParams: Promise<{ prompt?: string | string[] }>
}) {
  const { projectId } = await params
  const resolvedSearchParams = await searchParams
  const initialPrompt = Array.isArray(resolvedSearchParams.prompt)
    ? resolvedSearchParams.prompt[0]
    : resolvedSearchParams.prompt

  return <WorkspaceClient projectId={projectId} initialPrompt={initialPrompt ?? null} />
}
