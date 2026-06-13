"use client"

import { useAgentsSession } from "@/lib/agents/auth/client"
import { useAtom, useAtomValue } from "jotai"
import { selectedTeamIdAtom } from "@/lib/atoms/team"
import { anSelectedAgentAtom } from "@/lib/atoms/an-agent"
import { apiRefSelectedAgentSlugAtom } from "@/lib/atoms/agents-docs"
import { api } from "@/trpc/client"
import { CodeBlock } from "@/components/features/agents/an/docs/code-block"
import { cn } from "@/lib/utils"

export const RELAY_URL = "https://relay.an.dev"

export function useCredentials() {
  const { isSignedIn } = useAgentsSession()
  const teamId = useAtomValue(selectedTeamIdAtom)
  const selectedAgent = useAtomValue(anSelectedAgentAtom)

  const { data: teams } = api.teams.getUserTeams.useQuery(undefined, {
    enabled: !!isSignedIn && !teamId,
    staleTime: 5 * 60_000,
  })
  const resolvedTeamId = teamId || teams?.[0]?.id
  const canFetch = !!isSignedIn && !!resolvedTeamId

  const { data: configs } = api.agentConfigs.listConfigs.useQuery(
    { teamId: resolvedTeamId! },
    { enabled: canFetch },
  )

  const agents = configs?.map((c) => ({ id: c.id, slug: c.slug })) || []
  const defaultSlug = selectedAgent?.slug || agents[0]?.slug

  return { agents, defaultSlug, apiKey: undefined, hasCredentials: false }
}

export function useResolvedCredentials() {
  const { agents, defaultSlug, apiKey, hasCredentials } = useCredentials()
  const [selectedSlug] = useAtom(apiRefSelectedAgentSlugAtom)
  const resolvedSlug = selectedSlug && agents.some((a) => a.slug === selectedSlug)
    ? selectedSlug
    : defaultSlug
  const slug = resolvedSlug || "YOUR_AGENT_SLUG"
  const resolvedApiKey = apiKey || "YOUR_API_KEY"
  const isReal = hasCredentials

  return { slug, resolvedApiKey, isReal }
}

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  POST: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20",
  DELETE: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20",
  PATCH: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20",
  PUT: "bg-violet-500/15 text-violet-700 dark:text-violet-400 border-violet-500/20",
}

export function MethodBadge({ method }: { method: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[11px] font-semibold font-mono uppercase tracking-wide",
        METHOD_COLORS[method] || "bg-muted text-foreground border-border",
      )}
    >
      {method}
    </span>
  )
}

export function EndpointUrl({ method, path }: { method: string; path: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/30 px-3 py-2.5 font-mono text-[13px]">
      <MethodBadge method={method} />
      <span className="text-muted-foreground">{RELAY_URL}</span>
      <span className="text-foreground">{path}</span>
    </div>
  )
}

export interface ParamRow {
  name: string
  type: string
  required: boolean
  description: string
}

export function ParamsTable({ params, title }: { params: ParamRow[]; title?: string }) {
  return (
    <div className="space-y-2">
      {title && <h3 className="text-[13px] font-medium">{title}</h3>}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Name</th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Type</th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Required</th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Description</th>
            </tr>
          </thead>
          <tbody>
            {params.map((p) => (
              <tr key={p.name} className="border-b border-border last:border-0">
                <td className="px-3 py-2 font-mono text-[12px]">{p.name}</td>
                <td className="px-3 py-2 font-mono text-[12px] text-muted-foreground">{p.type}</td>
                <td className="px-3 py-2">
                  {p.required ? (
                    <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">Required</span>
                  ) : (
                    <span className="text-[11px] text-muted-foreground">Optional</span>
                  )}
                </td>
                <td className="px-3 py-2 text-muted-foreground">{p.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function EndpointSection({
  id,
  method,
  path,
  title,
  description,
  params,
  bodyParams,
  queryParams,
  children,
}: {
  id: string
  method: string
  path: string
  title: string
  description?: string
  params?: ParamRow[]
  bodyParams?: ParamRow[]
  queryParams?: ParamRow[]
  children?: React.ReactNode
}) {
  return (
    <section id={id} className="space-y-4 scroll-mt-24">
      <h3 className="text-[15px] font-medium">{title}</h3>
      <EndpointUrl method={method} path={path} />
      {description && (
        <p className="text-[13px] text-muted-foreground leading-relaxed">{description}</p>
      )}
      {params && <ParamsTable params={params} title="Path Parameters" />}
      {queryParams && <ParamsTable params={queryParams} title="Query Parameters" />}
      {bodyParams && <ParamsTable params={bodyParams} title="Request Body" />}
      {children}
    </section>
  )
}

export function ResponseField({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h4 className="text-[13px] font-medium text-muted-foreground">Response</h4>
      {children}
    </div>
  )
}

export { CodeBlock }
