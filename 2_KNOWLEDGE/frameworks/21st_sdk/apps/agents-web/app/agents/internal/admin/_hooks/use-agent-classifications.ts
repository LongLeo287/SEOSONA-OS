"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { api } from "@/trpc/client"
import { MIN_ACTIVE_THREADS } from "../directory/_constants"

const MAX_CONCURRENT = 3

type AgentMetadata = {
  model?: string
  systemPrompt?: string | { type: string; preset: string; append?: string }
  tools?: { name: string; description: string }[]
  hooks?: string[]
}

export type ToolClassification = {
  name: string
  category: string
  purpose: string
}

export type AgentClassification = {
  category: string
  subcategory: string
  summary: string
  toolCategories: string[]
  toolClassifications: ToolClassification[]
  classifiedAt: number
}

type AgentConfig = {
  id: string
  name: string
  slug: string
  activeDeployment?: {
    bundle_hash?: string | null
    metadata?: AgentMetadata | null
  } | null
}

function getSystemPromptText(
  sp: string | { type: string; preset: string; append?: string },
): string {
  if (typeof sp === "string") return sp
  let text = `[preset: ${sp.preset}]`
  if (sp.append) text += `\n${sp.append}`
  return text
}

export function useAgentClassifications(
  configs: AgentConfig[],
  usageStats?: Record<string, { threadCount: number }>,
) {
  const [classifications, setClassifications] = useState<
    Map<string, AgentClassification & { loading?: boolean }>
  >(new Map())
  const [isClassifying, setIsClassifying] = useState(false)
  const classifyMutation = api.agentsAdmin.classifyAgent.useMutation()
  const deleteClassification = api.agentsAdmin.deleteClassification.useMutation()
  const deleteAllClassifications = api.agentsAdmin.deleteAllClassifications.useMutation()
  const runningRef = useRef(false)

  // Build the list of active agent hashes to query
  const activeAgentHashes = configs
    .filter((c) => {
      if (!c.activeDeployment?.metadata) return false
      if (!usageStats) return false
      return (usageStats[c.id]?.threadCount ?? 0) >= MIN_ACTIVE_THREADS
    })
    .map((c) => ({
      agentId: c.id,
      bundleHash: c.activeDeployment!.bundle_hash ?? "no-hash",
    }))

  // Fetch existing classifications from DB
  const { data: dbClassifications, isLoading: isLoadingDb } =
    api.agentsAdmin.getClassifications.useQuery(
      { agentBundleHashes: activeAgentHashes },
      { enabled: activeAgentHashes.length > 0 },
    )

  // Main classify function — fills in what DB doesn't have
  const classify = useCallback(async () => {
    if (runningRef.current || configs.length === 0 || !usageStats || isLoadingDb) return
    runningRef.current = true

    const initial = new Map<
      string,
      AgentClassification & { loading?: boolean }
    >()
    const needsClassification: AgentConfig[] = []

    for (const config of configs) {
      const dep = config.activeDeployment
      if (!dep?.metadata) continue

      const threads = usageStats[config.id]?.threadCount ?? 0
      if (threads < MIN_ACTIVE_THREADS) continue

      // Check if DB already has it
      const dbEntry = dbClassifications?.[config.id]
      if (dbEntry) {
        initial.set(config.id, dbEntry)
      } else {
        needsClassification.push(config)
        initial.set(config.id, {
          category: "...",
          subcategory: "...",
          summary: "Classifying...",
          toolCategories: [],
          toolClassifications: [],
          classifiedAt: 0,
          loading: true,
        })
      }
    }

    setClassifications(new Map(initial))

    if (needsClassification.length === 0) {
      runningRef.current = false
      return
    }

    setIsClassifying(true)

    // Prioritize by most threads first
    needsClassification.sort(
      (a, b) =>
        (usageStats[b.id]?.threadCount ?? 0) -
        (usageStats[a.id]?.threadCount ?? 0),
    )

    const queue = [...needsClassification]
    const processNext = async () => {
      const config = queue.shift()
      if (!config) return

      const dep = config.activeDeployment!
      const metadata = dep.metadata!
      const promptText = metadata.systemPrompt
        ? getSystemPromptText(metadata.systemPrompt)
        : undefined

      try {
        const result = await classifyMutation.mutateAsync({
          agentId: config.id,
          bundleHash: dep.bundle_hash ?? "no-hash",
          systemPrompt: promptText,
          tools: metadata.tools,
          model: metadata.model,
          hooks: metadata.hooks,
        })

        const classification: AgentClassification = {
          category: result.category,
          subcategory: result.subcategory,
          summary: result.summary,
          toolCategories: result.toolCategories,
          toolClassifications: result.toolClassifications,
          classifiedAt: Date.now(),
        }

        setClassifications((prev) => {
          const next = new Map(prev)
          next.set(config.id, classification)
          return next
        })
      } catch {
        setClassifications((prev) => {
          const next = new Map(prev)
          next.set(config.id, {
            category: "Error",
            subcategory: "Error",
            summary: "Failed to classify",
            toolCategories: [],
            toolClassifications: [],
            classifiedAt: 0,
          })
          return next
        })
      }
    }

    const workers = Array.from(
      { length: Math.min(MAX_CONCURRENT, queue.length) },
      async () => {
        while (queue.length > 0) {
          await processNext()
        }
      },
    )

    await Promise.all(workers)
    setIsClassifying(false)
    runningRef.current = false
  }, [configs, classifyMutation, usageStats, dbClassifications, isLoadingDb])

  // Run when DB data is ready
  useEffect(() => {
    if (!isLoadingDb && usageStats) {
      classify()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingDb, !!usageStats, configs.length])

  const reclassify = useCallback(
    (agentId: string) => {
      const config = configs.find((c) => c.id === agentId)
      if (!config?.activeDeployment) return

      const bundleHash = config.activeDeployment.bundle_hash ?? "no-hash"

      // Delete from DB
      deleteClassification.mutate({ agentId, bundleHash })

      setClassifications((prev) => {
        const next = new Map(prev)
        next.set(agentId, {
          category: "...",
          subcategory: "...",
          summary: "Reclassifying...",
          toolCategories: [],
          toolClassifications: [],
          classifiedAt: 0,
          loading: true,
        })
        return next
      })

      const dep = config.activeDeployment
      const metadata = dep.metadata as AgentMetadata | null
      if (!metadata) return

      const promptText = metadata.systemPrompt
        ? getSystemPromptText(metadata.systemPrompt)
        : undefined

      classifyMutation
        .mutateAsync({
          agentId,
          bundleHash,
          systemPrompt: promptText,
          tools: metadata.tools,
          model: metadata.model,
          hooks: metadata.hooks,
        })
        .then((result) => {
          const classification: AgentClassification = {
            category: result.category,
            subcategory: result.subcategory,
            summary: result.summary,
            toolCategories: result.toolCategories,
            toolClassifications: result.toolClassifications,
            classifiedAt: Date.now(),
          }

          setClassifications((prev) => {
            const next = new Map(prev)
            next.set(agentId, classification)
            return next
          })
        })
        .catch(() => {
          setClassifications((prev) => {
            const next = new Map(prev)
            next.set(agentId, {
              category: "Error",
              subcategory: "Error",
              summary: "Failed to classify",
              toolCategories: [],
              toolClassifications: [],
              classifiedAt: 0,
            })
            return next
          })
        })
    },
    [configs, classifyMutation, deleteClassification],
  )

  const clearAllCache = useCallback(() => {
    // Delete all from DB
    deleteAllClassifications.mutate(undefined, {
      onSuccess: () => {
        setClassifications(new Map())
        runningRef.current = false
        classify()
      },
    })
  }, [classify, deleteAllClassifications])

  return { classifications, isClassifying, reclassify, clearAllCache }
}
