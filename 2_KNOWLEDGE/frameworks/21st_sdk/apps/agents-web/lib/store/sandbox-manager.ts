import { WebSocketSession } from "codesandbox-sdk-v1"
import {
  connectToSandbox,
  createPreview,
  Preview,
} from "codesandbox-sdk-v1/browser"
import { useMemo } from "react"
import { create } from "zustand"

interface SandboxConnection {
  client: WebSocketSession
  preview: Preview
  watcher?: any
}

interface SandboxManagerState {
  connections: Map<string, SandboxConnection>
  reloadTimestamps: Record<string, number>
  initializedSandboxes: Set<string>

  // Actions
  initializeAll: (
    sandboxConfigs: Array<{ id: string; sandboxId: string }>,
  ) => Promise<void>
  getPreviewUrl: (sandboxId: string) => string | null
  readAppFile: (sandboxId: string) => Promise<string | null>
  cleanup: () => void
}

// Client-side only store for managing sandbox connections
// This runs in the browser and maintains connections across component re-renders
export const useSandboxManager = create<SandboxManagerState>((set, get) => ({
  connections: new Map(),
  reloadTimestamps: {},
  initializedSandboxes: new Set(),

  initializeAll: async (sandboxConfigs) => {
    const { connections, initializedSandboxes } = get()

    // Find new sandboxes to initialize
    const newConfigs = sandboxConfigs.filter(
      (config) => !initializedSandboxes.has(config.sandboxId),
    )

    // Find old sandboxes to remove
    const currentSandboxIds = new Set(
      sandboxConfigs.map((config) => config.sandboxId),
    )
    const toRemove = Array.from(initializedSandboxes).filter(
      (sandboxId) => !currentSandboxIds.has(sandboxId),
    )

    // Clean up removed sandboxes
    const updatedConnections = new Map(connections)
    const updatedInitialized = new Set(initializedSandboxes)

    toRemove.forEach((sandboxId) => {
      const connection = updatedConnections.get(sandboxId)
      if (connection?.watcher?.destroy) {
        connection.watcher.destroy()
      }
      updatedConnections.delete(sandboxId)
      updatedInitialized.delete(sandboxId)
    })

    // If no new configs to initialize, just update state and return
    if (newConfigs.length === 0) {
      set({
        connections: updatedConnections,
        initializedSandboxes: updatedInitialized,
      })
      return
    }

    // Initialize only new connections in parallel
    await Promise.all(
      newConfigs.map(async ({ sandboxId }) => {
        if (!sandboxId) return

        try {
          // Get session from API - this creates a new session each time
          const getSessionData = async (retryCount = 0): Promise<any> => {
            const sessionResponse = await fetch(
              `/api/ai-sdk-5/sandbox/${sandboxId}`,
              {
                method: "POST",
              },
            )
            const sessionData = await sessionResponse.json()

            if (sessionData.bootupType === "CLEAN") {
              if (retryCount < 3) {
                await new Promise((resolve) => setTimeout(resolve, 7000))
                return getSessionData(retryCount + 1)
              }
              throw new Error("Failed to get clean session after 3 retries")
            }

            return sessionData
          }

          const sessionData = await getSessionData()
          // Connect to sandbox (client-side connection)
          const client = await connectToSandbox({
            session: sessionData,
            getSession: async (id: string) => {
              const res = await fetch(`/api/ai-sdk-5/sandbox/${id}`, {
                method: "POST",
              })
              return res.json()
            },
          })

          // Create preview
          const preview = await createPreview(client.hosts.getUrl(8080))

          console.log("preview", preview)

          // Setup file watcher
          const watcher = await client.fs.watch("/project/sandbox/dist", {
            recursive: true,
          })

          // Debounced reload handler
          let debounceTimer: NodeJS.Timeout | null = null

          watcher.onEvent(() => {
            if (debounceTimer) {
              clearTimeout(debounceTimer)
            }

            debounceTimer = setTimeout(() => {
              set((state) => ({
                reloadTimestamps: {
                  ...state.reloadTimestamps,
                  [sandboxId]: Date.now(),
                },
              }))
            }, 500)
          })

          updatedConnections.set(sandboxId, {
            //@ts-ignore
            client,
            preview,
            watcher,
          })
          updatedInitialized.add(sandboxId)
        } catch (error) {
          console.error(`Failed to initialize sandbox ${sandboxId}:`, error)
        }
      }),
    )

    set({
      connections: updatedConnections,
      initializedSandboxes: updatedInitialized,
    })
  },

  getPreviewUrl: (sandboxId) => {
    const connection = get().connections.get(sandboxId)
    if (!connection) return null

    // Use the client to get the URL instead of accessing private property
    return connection.client.hosts.getUrl(8080)
  },

  readAppFile: async (sandboxId) => {
    // Wait for connection with retries if not yet initialized
    let connection = get().connections.get(sandboxId)

    if (!connection) {
      // Retry up to 10 times with 500ms delay (5s total) waiting for connection
      for (let i = 0; i < 10; i++) {
        await new Promise((resolve) => setTimeout(resolve, 500))
        connection = get().connections.get(sandboxId)
        if (connection) break
      }
    }

    if (!connection) return null

    try {
      const fileContent = await connection.client.fs.readTextFile(
        "/project/sandbox/src/App.tsx",
      )
      return fileContent
    } catch (error) {
      console.error(`Failed to read App.tsx from sandbox ${sandboxId}:`, error)
      return null
    }
  },

  cleanup: () => {
    const { connections } = get()

    // Cleanup all watchers
    connections.forEach(({ watcher }) => {
      if (watcher?.destroy) {
        watcher.destroy()
      }
    })

    set({
      connections: new Map(),
      reloadTimestamps: {},
      initializedSandboxes: new Set(),
    })
  },
}))

// Hook for components to subscribe to reload events
export const useSandboxReload = (sandboxId: string | undefined) => {
  const timestamp = useSandboxManager((state) =>
    sandboxId ? state.reloadTimestamps[sandboxId] || 0 : 0,
  )
  return timestamp
}

// Hook to get preview URL with theme support
export const useSandboxPreviewUrl = (
  sandboxId: string | undefined,
  theme?: string,
) => {
  const baseUrl = useSandboxManager((state) =>
    sandboxId ? state.getPreviewUrl(sandboxId) : null,
  )

  if (!baseUrl) return null

  const url = new URL(baseUrl)
  if (theme) {
    url.searchParams.set("theme", theme)
  }
  return url.toString()
}

// Hook to check if a sandbox connection is ready (reactive)
export const useSandboxConnected = (sandboxId: string | undefined) => {
  return useSandboxManager((state) =>
    sandboxId ? state.connections.has(sandboxId) : false,
  )
}

// Hook to read App.tsx file from sandbox
export const useSandboxAppFile = (sandboxId: string | undefined) => {
  const readAppFile = useSandboxManager((state) => state.readAppFile)

  return useMemo(
    () => ({
      readAppFile: () =>
        sandboxId ? readAppFile(sandboxId) : Promise.resolve(null),
    }),
    [sandboxId, readAppFile],
  )
}
