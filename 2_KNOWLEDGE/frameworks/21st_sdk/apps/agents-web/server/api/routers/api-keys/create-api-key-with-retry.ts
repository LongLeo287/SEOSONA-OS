import { TRPCError } from "@trpc/server"
import type { Database } from "@/types/supabase"

export const FK_CONSTRAINT_ERROR = "api_keys_user_id_fkey"
export const MAX_RETRIES = 5
export const RETRY_DELAY_MS = 1_000

type ApiPlan = Database["public"]["Enums"]["api_plan"]

type RpcError = {
  message?: string
}

type CreateApiKeyRpcResult<TData> = {
  data: TData | null
  error: RpcError | null
}

type Awaitable<T> = PromiseLike<T> | T

type CreateApiKeyRpc<TData> = (args: {
  user_id: string
  plan: ApiPlan
  requests_limit: number
}) => Awaitable<CreateApiKeyRpcResult<TData>>

type SleepFn = (ms: number) => Promise<void>

export function isApiKeyUserFkError(error: RpcError | null | undefined) {
  return error?.message?.includes(FK_CONSTRAINT_ERROR) ?? false
}

export async function createApiKeyWithRetry<TData extends { key?: string | null }>({
  rpc,
  userId,
  plan,
  requestsLimit,
  maxRetries = MAX_RETRIES,
  retryDelayMs = RETRY_DELAY_MS,
  sleep = (ms) => new Promise<void>((resolve) => setTimeout(resolve, ms)),
}: {
  rpc: CreateApiKeyRpc<TData>
  userId: string
  plan: ApiPlan
  requestsLimit: number
  maxRetries?: number
  retryDelayMs?: number
  sleep?: SleepFn
}) {
  let lastError: unknown

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const { data, error } = await rpc({
      user_id: userId,
      plan,
      requests_limit: requestsLimit,
    })

    if (error) {
      lastError = error

      if (isApiKeyUserFkError(error) && attempt < maxRetries) {
        console.warn(
          `API key creation FK error for user ${userId}, retrying (${attempt}/${maxRetries})...`,
        )
        await sleep(retryDelayMs * attempt)
        continue
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to create API key: ${error.message}`,
      })
    }

    if (!data || !data.key) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "No API key data returned",
      })
    }

    return data as TData & { key: string }
  }

  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: `Failed to create API key after ${maxRetries} retries: ${lastError}`,
  })
}
