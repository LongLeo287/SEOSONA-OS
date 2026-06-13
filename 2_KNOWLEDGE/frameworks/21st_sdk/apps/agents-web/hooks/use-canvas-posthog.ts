import { useCallback } from "react"
import {
  captureCanvasEvent,
  identifyCanvasUser,
  getCanvasPosthog,
} from "@/lib/posthog-canvas"

export function useCanvasPosthog() {
  const capture = useCallback(
    (eventName: string, properties?: Record<string, any>) => {
      captureCanvasEvent(eventName, properties)
    },
    [],
  )

  const identify = useCallback(
    (userId: string, traits?: Record<string, any>) => {
      identifyCanvasUser(userId, traits)
    },
    [],
  )

  const getPosthogInstance = useCallback(() => {
    return getCanvasPosthog()
  }, [])

  // Специализированные методы для Canvas событий
  const trackProjectCreated = useCallback(
    (projectData: {
      projectId: string
      projectType: string
      template?: string
      theme?: string
    }) => {
      capture("canvas_project_created", {
        project_id: projectData.projectId,
        project_type: projectData.projectType,
        template: projectData.template,
        theme: projectData.theme,
        timestamp: Date.now(),
      })
    },
    [capture],
  )

  const trackInspirationAdded = useCallback(
    (inspirationData: {
      inspirationType: "component" | "screen" | "image"
      itemId: string
      itemName?: string
      source:
        | "component_search"
        | "screen_search"
        | "file_upload"
        | "drag_drop"
        | "paste"
      projectId?: string
    }) => {
      capture("canvas_inspiration_added", {
        inspiration_type: inspirationData.inspirationType,
        item_id: inspirationData.itemId,
        item_name: inspirationData.itemName,
        source: inspirationData.source,
        project_id: inspirationData.projectId,
        timestamp: Date.now(),
      })
    },
    [capture],
  )

  const trackThemeChange = useCallback(
    (themeData: { projectId: string; fromTheme: string; toTheme: string }) => {
      capture("canvas_theme_changed", {
        project_id: themeData.projectId,
        from_theme: themeData.fromTheme,
        to_theme: themeData.toTheme,
        timestamp: Date.now(),
      })
    },
    [capture],
  )

  const trackChatMessage = useCallback(
    (messageData: {
      messageType: "user" | "ai"
      messageLength: number
      hasAttachments?: boolean
      projectId?: string
    }) => {
      capture("canvas_chat_message", {
        message_type: messageData.messageType,
        message_length: messageData.messageLength,
        has_attachments: messageData.hasAttachments || false,
        project_id: messageData.projectId,
        timestamp: Date.now(),
      })
    },
    [capture],
  )

  const trackError = useCallback(
    (errorData: {
      errorType: string
      errorMessage: string
      stackTrace?: string
      projectId?: string
    }) => {
      capture("canvas_error", {
        error_type: errorData.errorType,
        error_message: errorData.errorMessage,
        stack_trace: errorData.stackTrace,
        project_id: errorData.projectId,
        timestamp: Date.now(),
      })
    },
    [capture],
  )

  const trackPerformance = useCallback(
    (performanceData: {
      action: string
      duration: number
      projectId?: string
      additionalMetrics?: Record<string, number>
    }) => {
      capture("canvas_performance", {
        action: performanceData.action,
        duration_ms: performanceData.duration,
        project_id: performanceData.projectId,
        ...performanceData.additionalMetrics,
        timestamp: Date.now(),
      })
    },
    [capture],
  )

  return {
    // Базовые методы
    capture,
    identify,
    getPosthogInstance,

    // Специализированные методы для Canvas
    trackProjectCreated,
    trackInspirationAdded,
    trackThemeChange,
    trackChatMessage,
    trackError,
    trackPerformance,
  }
}
