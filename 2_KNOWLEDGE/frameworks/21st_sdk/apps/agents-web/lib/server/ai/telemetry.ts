import { randomUUID } from "crypto"

const PROJECT_NAME = "21st.dev"

export const LANGFUSE_PATHS = {
  magic: {
    enhancePrompt: "magic/enhance-prompt",
    searchQueries: "magic/search-queries",
    enhancePromptModern: "magic/enhance-prompt-modern",
    enhancePromptBrutalist: "magic/enhance-prompt-brutalist",
    enhancePromptLinear: "magic/enhance-prompt-linear",
    enhancePromptVercel: "magic/enhance-prompt-vercel",
    generateComponent: "magic/generate-component",
    copyComponent: "magic/copy-component",
    tagSelection: "magic/tag-selection",
    componentFilter: "magic/component-filter",
    selectComponents: {
      fromDescription: "magic/select-components/from-description",
      rerank: "magic/select-components/rerank",
    },
    chat: {
      generation: "magic/chat/generation",
      update: "magic/chat/update",
      generateDiff: "magic/chat/generate-diff",
    },
    siteCopy: {
      generateComponent: "magic/site-copy/generate-component",
      generateComponentFallback: "magic/site-copy/generate-component-fallback",
    },
  },
  canvas: {
    chat: "canvas/chat",
    createShapePrompts: "canvas/create-shape-prompts",
  },
  gemini: {
    generateText: "gemini/generate-text",
  },
} as const

type PathValues<T> =
  T extends Record<string, any>
    ? {
        [K in keyof T]: T[K] extends string
          ? T[K]
          : T[K] extends Record<string, any>
            ? PathValues<T[K]>
            : never
      }[keyof T]
    : never

export type LangfusePath = PathValues<typeof LANGFUSE_PATHS>

export interface TelemetryOptions {
  operation: LangfusePath
  metadata?: Record<string, any>
  userId?: string
  sessionId?: string
}

export function withTelemetry(options: TelemetryOptions) {
  const traceId = randomUUID()

  // Filter out undefined values for telemetry metadata
  const metadata: Record<string, string | number | boolean> = {
    langfuseTraceId: traceId,
    operation: options.operation,
    project: PROJECT_NAME,
    userId: options.userId || "anonymous",
    ...options.metadata,
  }

  if (options.sessionId) {
    metadata.sessionId = options.sessionId
  }

  return {
    experimental_telemetry: {
      isEnabled: true,
      functionId: options.operation,
      metadata,
    },
  }
}
