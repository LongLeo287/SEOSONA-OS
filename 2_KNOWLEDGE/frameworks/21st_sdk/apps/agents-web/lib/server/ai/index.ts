// @ts-nocheck

import { LANGFUSE_PATHS, withTelemetry } from "@/lib/server/ai/telemetry"
import { openai } from "@ai-sdk/openai"
import { vercel } from "@ai-sdk/vercel"
import { xai } from "@ai-sdk/xai"
import {
  GenerateObjectResult,
  generateText,
  GenerateTextResult,
  LanguageModel,
  StreamTextResult,
} from "ai"
import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { promptCachingMiddleware } from "@/lib/server/ai-latest/prompt-caching-middleware"

const openrouterWithCaching = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
  fetch: promptCachingMiddleware,
  headers: {
    "HTTP-Referer": "https://21st.dev",
    "X-Title": "21st.dev",
  },
})

const openrouterWithoutCaching = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
  headers: {
    "HTTP-Referer": "https://21st.dev",
    "X-Title": "21st.dev",
  },
})

export const models = {
  "gemini-2.5-flash": "gemini-2.5-flash",
  "gemini-2.5-flash-lite": "gemini-2.5-flash-lite-preview-06-17",
  "gemini-2.5-pro": "gemini-2.5-pro",
  "v0-1.0-md": "v0-1.0-md",
  "claude-3.7-sonnet": "claude-3.7-sonnet",
  "claude-4-sonnet": "claude-sonnet-4-20250514",
  "claude-4.6-sonnet": "claude-sonnet-4-6",
  "claude-4-opus": "claude-4-opus-20250514",
  "claude-4.6-opus": "claude-opus-4-6",
  "grok-3-fast": "grok-3-fast-latest",
  "grok-4": "grok-4",
  "gpt-4.1": "gpt-4.1",
  "gpt-4o": "gpt-4o",
  "gpt-5": "gpt-5",
  "gpt-5-nano": "gpt-5-nano",
  "gpt-o3": "o3",
  "gpt-o3-mini": "o3-mini",
  "gpt-o4-mini": "o4-mini",
  "llama-4-scout": "llama-4-scout",
  "qwen-3-coder": "qwen-3-coder",
}
console.log("rebuild")

const langfuseNameMap = {
  "gemini-2.5-flash": "gemini-2.5-flash",
  "gemini-2.5-pro": "gemini-2.5-pro",
  "gemini-2.5-flash-lite": "gemini-2.5-flash-lite-preview",
  "claude-3.7-sonnet": "claude-3.7-sonnet",
  "claude-4-sonnet": "claude-sonnet-4-latest",
  "claude-4.6-sonnet": "claude-sonnet-4-6",
  "claude-4-opus": "claude-opus-4-20250514",
  "claude-4.6-opus": "claude-opus-4-6",
  "gpt-5-nano": "gpt-5-nano",
}

const getLangFuseName = (model: string) => {
  if (langfuseNameMap[model as keyof typeof langfuseNameMap]) {
    return langfuseNameMap[model as keyof typeof langfuseNameMap]
  }

  return model
}

type FulfillModelResult = {
  model: LanguageModel
  providerOptions?: {
    google?: {
      thinkingConfig?: {
        includeThoughts: boolean
        thinkingBudget: number
      }
    }
  }
  langfuseName: string
}

export const fulfillModel = (
  model: keyof typeof models,
  caching: boolean = true,
): FulfillModelResult => {
  const isThinking = true
  const openrouter = caching ? openrouterWithCaching : openrouterWithoutCaching
  let result: FulfillModelResult

  if (model.startsWith("gemini-")) {
    const geminiToOpenRouterMap = {
      "gemini-2.5-flash": "google/gemini-2.5-flash",
      "gemini-2.5-pro": "google/gemini-2.5-pro",
      "gemini-2.5-flash-lite": "google/gemini-2.5-flash-lite-preview-06-17",
    }

    result = {
      model: openrouter(
        geminiToOpenRouterMap[model as keyof typeof geminiToOpenRouterMap],
      ),
      ...(isThinking && {
        providerOptions: {
          google: {
            thinkingConfig: {
              includeThoughts: false,
              thinkingBudget: 0,
            },
          },
        },
      }),
    }
  } else if (model.startsWith("v0-")) {
    result = {
      model: vercel(models[model]),
    }
  } else if (model.startsWith("grok-")) {
    if (model === "grok-4") {
      // Route Grok 4 via OpenRouter
      result = {
        model: openrouter("x-ai/grok-4"),
      }
    } else {
      result = {
        model: xai(models[model]),
      }
    }
  } else if (model.startsWith("gpt-")) {
    if (model === "gpt-5-nano") {
      // Use OpenRouter for gpt-5-nano
      result = {
        model: openrouter("openai/gpt-5-nano"),
      }
    } else {
      // Use direct OpenAI for other GPT models
      result = {
        model: openai(models[model]),
      }
    }
  } else if (model.startsWith("claude-")) {
    const anthropicToOpenRouterMap = {
      "claude-4-sonnet": "anthropic/claude-sonnet-4.5",
      "claude-4.6-sonnet": "anthropic/claude-sonnet-4.6",
      "claude-4-opus": "anthropic/claude-opus-4.5",
      "claude-4.6-opus": "anthropic/claude-opus-4.6",
      "claude-3.7-sonnet": "anthropic/claude-3.7-sonnet",
    }

    result = {
      model: openrouter(
        anthropicToOpenRouterMap[
          model as keyof typeof anthropicToOpenRouterMap
        ],
      ),
    }
  } else if (model.startsWith("llama-")) {
    const llamaToOpenRouterMap = {
      "llama-4-scout": "meta-llama/llama-4-scout",
    }

    result = {
      model: openrouter(
        llamaToOpenRouterMap[model as keyof typeof llamaToOpenRouterMap],
      ),
    }
  } else if (model.startsWith("qwen-")) {
    const qwenToOpenRouterMap = {
      "qwen-2.5-coder": "qwen/qwen2.5-coder",
      "qwen-3-coder": "qwen/qwen3-coder",
    }

    result = {
      model: openrouter(
        qwenToOpenRouterMap[model as keyof typeof qwenToOpenRouterMap],
      ),
    }
  } else {
    throw new Error(
      `Unsupported model: ${model}. Please add support for this model type.`,
    )
  }

  return {
    ...result,
    langfuseName: getLangFuseName(model),
  }
}

interface GenerateTextOptions {
  model?: keyof typeof models
  extractCodeBlocks?: boolean
  preserveLanguage?: boolean
  temperature?: number
}

async function geminiGenerateText(
  prompt: string,
  options: GenerateTextOptions = {
    temperature: 0.1,
  },
) {
  const { extractCodeBlocks = true, preserveLanguage = false } = options

  const { model } = fulfillModel("gemini-2.5-flash", true)

  const response = await generateText({
    model,
    prompt,
    temperature: options.temperature,
    ...withTelemetry({
      operation: LANGFUSE_PATHS.gemini.generateText,
    }),
  })

  const text = response.text || ""

  if (!extractCodeBlocks) {
    return text
  }

  const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g
  const matches = [...text.matchAll(codeBlockRegex)]

  if (matches.length === 0) {
    return text
  }

  if (preserveLanguage) {
    return matches
      .map((match) => {
        const lang = match[1] || ""
        const code = match[2]?.trim() || ""
        return lang ? `[${lang}]\n${code}` : code
      })
      .join("\n\n")
  }

  return matches
    .map((match) => match[2]?.trim() || "")
    .filter(Boolean)
    .join("\n\n")
}

export interface Usage {
  inputTokens: number
  outputTokens: number
}

export async function extractUsageFromResult(
  result?: StreamTextResult<any, any> | GenerateObjectResult<any>,
): Promise<Usage> {
  const defaultUsage: Usage = { inputTokens: 0, outputTokens: 0 }
  if (!result || !result.usage) {
    return defaultUsage
  }

  try {
    const usage = await result.usage

    const finishReason = await result.finishReason
    const isSuccessful =
      finishReason !== "error" && finishReason !== "content-filter"

    return isSuccessful
      ? {
          inputTokens: usage.inputTokens || 0,
          outputTokens: usage.outputTokens || 0,
        }
      : defaultUsage
  } catch (error) {
    console.warn("Error extracting usage from stream:", error)
    return defaultUsage
  }
}

export async function sumUsageFromResults(
  ...results: Array<
    | StreamTextResult<any, any>
    | GenerateObjectResult<any>
    | GenerateTextResult<any>
    | Usage
    | undefined
    | null
  >
): Promise<Usage> {
  let inputTokens = 0
  let outputTokens = 0

  for (const result of results) {
    if (!result) continue

    // Direct Usage-like object
    if (
      typeof result === "object" &&
      ("inputTokens" in result || "outputTokens" in result)
    ) {
      inputTokens += (result as any).inputTokens || 0
      outputTokens += (result as any).outputTokens || 0
      continue
    }

    // Fallback for generateText results exposing .totalUsage
    const totalUsage = (result as any)?.totalUsage ?? (result as any)?.usage
    if (totalUsage) {
      inputTokens += totalUsage.inputTokens || 0
      outputTokens += totalUsage.outputTokens || 0
      continue
    }

    // Fallback for results exposing per-step usage
    const steps = (result as any)?.steps
    if (Array.isArray(steps) && steps.length > 0) {
      for (const step of steps) {
        const u = step?.usage
        if (u) {
          inputTokens += u.inputTokens || 0
          outputTokens += u.outputTokens || 0
        }
      }
      continue
    }
  }

  return {
    inputTokens,
    outputTokens,
  }
}

// async function geminiGenerateText(
//   prompt: string,
//   {
//     model = "gemini-2.5-flash",
//     extractCodeBlocks = true,
//     preserveLanguage = false,
//   }: GenerateTextOptions = {},
// ) {
//   const response = await ai.models.generateContent({
//     model: models[model],
//     contents: prompt,
//     config: {
//       thinkingConfig: {
//         includeThoughts: false,
//         thinkingBudget: 0,
//       },
//     },
//   })

//   console.log("GEMINI RESPONSE", response)

//   const text = response.text || ""

//   if (!extractCodeBlocks) {
//     return text
//   }

//   const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g
//   const matches = [...text.matchAll(codeBlockRegex)]

//   if (matches.length === 0) {
//     return text
//   }

//   if (preserveLanguage) {
//     return matches
//       .map((match) => {
//         const lang = match[1] || ""
//         const code = match[2]?.trim() || ""
//         return lang ? `[${lang}]\n${code}` : code
//       })
//       .join("\n\n")
//   }

//   return matches
//     .map((match) => match[2]?.trim() || "")
//     .filter(Boolean)
//     .join("\n\n")
// }

import * as magicPrompts from "./magic.prompt"

const prompts = { magic: magicPrompts }

export { geminiGenerateText, prompts }
