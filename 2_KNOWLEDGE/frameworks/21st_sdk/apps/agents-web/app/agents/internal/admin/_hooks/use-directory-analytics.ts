"use client"

import { useMemo } from "react"
import type {
  AgentClassification,
  ToolClassification,
} from "./use-agent-classifications"

type AgentConfig = {
  id: string
  name: string
  slug: string
  created_at?: Date | string
  activeDeployment?: {
    bundle_hash?: string | null
    metadata?: Record<string, unknown> | null
    deployed_at?: Date | string | null
  } | null
  team?: {
    id?: string
    name?: string
    user?: { email?: string }
  }
}

export type DirectoryAgent = {
  id: string
  name: string
  slug: string
  summary: string
  subcategory: string
  toolCount: number
  toolNames?: { name: string; category: string; purpose: string }[]
  teamId: string
  teamName: string
  ownerEmail: string
  loading?: boolean
  threadCount?: number
  totalTokens?: number
  totalCostUsd?: number
  lastActivity?: string | null
}

export type AgentUsageStats = {
  threadCount: number
  sandboxCount: number
  totalTokens: number
  totalCostUsd: number
  lastActivity: string | null
}

export type AgentWithUsage = DirectoryAgent & {
  threadCount: number
  totalTokens: number
  totalCostUsd: number
  lastActivity: string | null
  category: string
}

export function useDirectoryAnalytics(
  configs: AgentConfig[],
  classifications: Map<string, AgentClassification & { loading?: boolean }>,
  usageStats?: Record<string, AgentUsageStats>,
  minThreads = 0,
) {
  return useMemo(() => {
    // Filter configs by minimum thread count when active filter is on
    const filteredConfigs =
      minThreads > 0 && usageStats
        ? configs.filter(
            (c) => (usageStats[c.id]?.threadCount ?? 0) >= minThreads,
          )
        : configs

    const classified = [...classifications.entries()].filter(
      ([agentId, c]) =>
        !c.loading &&
        c.category !== "Error" &&
        (minThreads <= 0 ||
          !usageStats ||
          (usageStats[agentId]?.threadCount ?? 0) >= minThreads),
    )

    // --- Overview ---
    const totalAgents = filteredConfigs.length
    const configuredCount = filteredConfigs.filter((c) => {
      const meta = c.activeDeployment?.metadata as Record<string, unknown> | null
      if (!meta) return false
      const sp = meta.systemPrompt
      const tools = meta.tools as unknown[] | undefined
      const hasPrompt =
        typeof sp === "string"
          ? sp.length > 0
          : sp != null && typeof sp === "object" && "preset" in (sp as Record<string, unknown>)
      return hasPrompt || (tools && tools.length > 0)
    }).length
    const unconfiguredCount = totalAgents - configuredCount

    // Model distribution
    const modelCounts = new Map<string, number>()
    for (const config of filteredConfigs) {
      if (!config.activeDeployment?.metadata) continue
      const model =
        ((config.activeDeployment.metadata as Record<string, unknown>)
          .model as string) ?? "unspecified"
      modelCounts.set(model, (modelCounts.get(model) ?? 0) + 1)
    }
    const modelDistribution = [...modelCounts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    // --- Categories ---
    const categoryCounts = new Map<string, number>()
    const subcategoryCounts = new Map<string, Map<string, number>>()
    const categoryAgents = new Map<string, DirectoryAgent[]>()

    for (const [agentId, cls] of classified) {
      const config = configs.find((c) => c.id === agentId)
      if (!config) continue

      categoryCounts.set(
        cls.category,
        (categoryCounts.get(cls.category) ?? 0) + 1,
      )

      if (!subcategoryCounts.has(cls.category))
        subcategoryCounts.set(cls.category, new Map())
      const subMap = subcategoryCounts.get(cls.category)!
      subMap.set(
        cls.subcategory,
        (subMap.get(cls.subcategory) ?? 0) + 1,
      )

      if (!categoryAgents.has(cls.category))
        categoryAgents.set(cls.category, [])
      const usage = usageStats?.[agentId]
      categoryAgents.get(cls.category)!.push({
        id: agentId,
        name: config.name,
        slug: config.slug,
        summary: cls.summary,
        subcategory: cls.subcategory,
        toolCount:
          ((config.activeDeployment?.metadata as Record<string, unknown>)
            ?.tools as unknown[] | undefined)?.length ?? 0,
        toolNames: cls.toolClassifications ?? [],
        teamId: (config as any).team?.id ?? "",
        teamName: (config as any).team?.name ?? "Unknown",
        ownerEmail: (config as any).team?.user?.email ?? "",
        threadCount: usage?.threadCount ?? 0,
        totalTokens: usage?.totalTokens ?? 0,
        totalCostUsd: usage?.totalCostUsd ?? 0,
        lastActivity: usage?.lastActivity ?? null,
      })
    }

    const categoryDistribution = [...categoryCounts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    // --- Tools ---
    const toolCategoryCounts = new Map<string, number>()
    const toolCombinations = new Map<string, number>()
    const allToolClassifications: Array<ToolClassification & { agentName: string }> = []

    for (const [agentId, cls] of classified) {
      for (const tc of cls.toolCategories) {
        toolCategoryCounts.set(tc, (toolCategoryCounts.get(tc) ?? 0) + 1)
      }
      const sorted = [...cls.toolCategories].sort()
      for (let i = 0; i < sorted.length; i++) {
        for (let j = i + 1; j < sorted.length; j++) {
          const key = `${sorted[i]}+${sorted[j]}`
          toolCombinations.set(key, (toolCombinations.get(key) ?? 0) + 1)
        }
      }
      // Collect all tool classifications
      const config = configs.find((c) => c.id === agentId)
      if (cls.toolClassifications) {
        for (const tc of cls.toolClassifications) {
          allToolClassifications.push({
            ...tc,
            agentName: config?.name ?? "Unknown",
          })
        }
      }
    }

    const toolDistribution = [...toolCategoryCounts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    const topToolCombinations = [...toolCombinations.entries()]
      .map(([pair, count]) => {
        const [a, b] = pair.split("+")
        return { toolA: a!, toolB: b!, count }
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Group tool classifications by tool name for the detail view
    const toolByName = new Map<string, { category: string; purpose: string; count: number }>()
    for (const tc of allToolClassifications) {
      const existing = toolByName.get(tc.name)
      if (existing) {
        existing.count++
      } else {
        toolByName.set(tc.name, { category: tc.category, purpose: tc.purpose, count: 1 })
      }
    }
    const topRawTools = [...toolByName.entries()]
      .map(([name, info]) => ({ name, category: info.category, purpose: info.purpose, count: info.count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 30)

    // --- Insights ---
    const agentsByToolCount = filteredConfigs
      .map((c) => {
        const u = usageStats?.[c.id]
        return {
          id: c.id,
          name: c.name,
          slug: c.slug,
          toolCount:
            ((c.activeDeployment?.metadata as Record<string, unknown>)
              ?.tools as unknown[] | undefined)?.length ?? 0,
          teamName: (c as any).team?.name ?? "",
          threadCount: u?.threadCount ?? 0,
          totalTokens: u?.totalTokens ?? 0,
          totalCostUsd: u?.totalCostUsd ?? 0,
          lastActivity: u?.lastActivity ?? null,
        }
      })
      .filter((a) => a.toolCount > 0)
      .sort((a, b) => b.toolCount - a.toolCount)
      .slice(0, 15)

    // Creation timeline (agents per month)
    const creationTimeline = new Map<string, number>()
    for (const config of filteredConfigs) {
      if (!config.created_at) continue
      const date = new Date(config.created_at)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      creationTimeline.set(key, (creationTimeline.get(key) ?? 0) + 1)
    }
    const timeline = [...creationTimeline.entries()]
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month))

    // Tools per agent distribution
    const toolsPerAgent = new Map<number, number>()
    for (const config of filteredConfigs) {
      const count =
        ((config.activeDeployment?.metadata as Record<string, unknown>)
          ?.tools as unknown[] | undefined)?.length ?? 0
      toolsPerAgent.set(count, (toolsPerAgent.get(count) ?? 0) + 1)
    }
    const toolsPerAgentDistribution = [...toolsPerAgent.entries()]
      .map(([tools, agents]) => ({ tools, agents }))
      .sort((a, b) => a.tools - b.tools)

    // --- Activity (from usage stats) ---
    const allAgentsWithUsage: AgentWithUsage[] = []
    let totalThreads = 0
    let totalTokensAll = 0
    let totalCostAll = 0
    let activeAgentCount = 0
    let dormantAgentCount = 0

    if (usageStats) {
      for (const config of filteredConfigs) {
        const usage = usageStats[config.id]
        const cls = classifications.get(config.id)
        const threads = usage?.threadCount ?? 0
        const tokens = usage?.totalTokens ?? 0
        const cost = usage?.totalCostUsd ?? 0
        totalThreads += threads
        totalTokensAll += tokens
        totalCostAll += cost

        if (threads > 0) activeAgentCount++
        else dormantAgentCount++

        allAgentsWithUsage.push({
          id: config.id,
          name: config.name,
          slug: config.slug,
          summary: cls && !cls.loading ? cls.summary : "",
          subcategory: cls && !cls.loading ? cls.subcategory : "",
          category: cls && !cls.loading ? cls.category : "Uncategorized",
          toolCount:
            ((config.activeDeployment?.metadata as Record<string, unknown>)
              ?.tools as unknown[] | undefined)?.length ?? 0,
          teamId: (config as any).team?.id ?? "",
          teamName: (config as any).team?.name ?? "Unknown",
          ownerEmail: (config as any).team?.user?.email ?? "",
          threadCount: threads,
          totalTokens: tokens,
          totalCostUsd: cost,
          lastActivity: usage?.lastActivity ?? null,
        })
      }
    }

    const topByThreads = [...allAgentsWithUsage]
      .sort((a, b) => b.threadCount - a.threadCount)
      .slice(0, 20)

    const topByTokens = [...allAgentsWithUsage]
      .sort((a, b) => b.totalTokens - a.totalTokens)
      .slice(0, 20)

    const topByCost = [...allAgentsWithUsage]
      .sort((a, b) => b.totalCostUsd - a.totalCostUsd)
      .slice(0, 20)

    const dormantAgents = allAgentsWithUsage
      .filter((a) => a.threadCount === 0)
      .slice(0, 30)

    // Usage tiers
    const tiers = { heavy: 0, moderate: 0, light: 0, dormant: 0 }
    for (const a of allAgentsWithUsage) {
      if (a.threadCount === 0) tiers.dormant++
      else if (a.threadCount >= 50) tiers.heavy++
      else if (a.threadCount >= 10) tiers.moderate++
      else tiers.light++
    }
    const usageTiers = [
      { tier: "Heavy (50+)", count: tiers.heavy },
      { tier: "Moderate (10-49)", count: tiers.moderate },
      { tier: "Light (1-9)", count: tiers.light },
      { tier: "Dormant (0)", count: tiers.dormant },
    ]

    // Thread distribution histogram
    const threadBuckets = new Map<string, number>()
    for (const a of allAgentsWithUsage) {
      let bucket: string
      if (a.threadCount === 0) bucket = "0"
      else if (a.threadCount <= 5) bucket = "1-5"
      else if (a.threadCount <= 20) bucket = "6-20"
      else if (a.threadCount <= 50) bucket = "21-50"
      else if (a.threadCount <= 100) bucket = "51-100"
      else bucket = "100+"
      threadBuckets.set(bucket, (threadBuckets.get(bucket) ?? 0) + 1)
    }
    const threadDistribution = ["0", "1-5", "6-20", "21-50", "51-100", "100+"]
      .map((bucket) => ({ bucket, agents: threadBuckets.get(bucket) ?? 0 }))
      .filter((d) => d.agents > 0)

    // Activity by category
    const categoryActivity = new Map<string, { threads: number; tokens: number; agents: number }>()
    for (const a of allAgentsWithUsage) {
      const cat = a.category
      const existing = categoryActivity.get(cat)
      if (existing) {
        existing.threads += a.threadCount
        existing.tokens += a.totalTokens
        existing.agents++
      } else {
        categoryActivity.set(cat, { threads: a.threadCount, tokens: a.totalTokens, agents: 1 })
      }
    }
    const activityByCategory = [...categoryActivity.entries()]
      .map(([category, data]) => ({
        category,
        threads: data.threads,
        tokens: data.tokens,
        agents: data.agents,
        avgThreads: data.agents > 0 ? Math.round(data.threads / data.agents) : 0,
      }))
      .sort((a, b) => b.threads - a.threads)

    return {
      overview: {
        totalAgents,
        configuredCount,
        unconfiguredCount,
        modelDistribution,
      },
      categories: {
        categoryDistribution,
        subcategoryCounts,
        categoryAgents,
      },
      tools: {
        toolDistribution,
        topToolCombinations,
        topRawTools,
        toolsPerAgentDistribution,
      },
      insights: {
        agentsByToolCount,
        timeline,
      },
      activity: {
        totalThreads,
        totalTokens: totalTokensAll,
        totalCost: totalCostAll,
        activeAgentCount,
        dormantAgentCount,
        topByThreads,
        topByTokens,
        topByCost,
        dormantAgents,
        usageTiers,
        threadDistribution,
        activityByCategory,
      },
    }
  }, [configs, classifications, usageStats, minThreads])
}
