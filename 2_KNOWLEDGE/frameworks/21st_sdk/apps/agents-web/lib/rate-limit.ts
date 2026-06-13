import { Ratelimit } from "@upstash/ratelimit"
import { IS_STANDALONE_APP } from "@/lib/agents/auth/config"
import { redis, upstashRedisRaw } from "@/lib/redis"

type AppLimiter = Pick<Ratelimit, "limit">
type LimitResult = Awaited<ReturnType<Ratelimit["limit"]>>

const unlimitedResult = { success: true } as LimitResult
const unlimitedLimiter: AppLimiter = {
  limit: async () => unlimitedResult,
}

function createLimiter(
  limiter: ConstructorParameters<typeof Ratelimit>[0]["limiter"],
  prefix: string,
): AppLimiter {
  if (IS_STANDALONE_APP) {
    return unlimitedLimiter
  }

  return new Ratelimit({
    redis: upstashRedisRaw!,
    limiter,
    prefix,
  })
}

export const publicChatIpLimiter = createLimiter(
  Ratelimit.slidingWindow(10, "1 h"),
  "public-chat:ip",
)

export const publicChatSessionLimiter = createLimiter(
  Ratelimit.slidingWindow(20, "1 d"),
  "public-chat:session",
)

export const publicChatGlobalLimiter = createLimiter(
  Ratelimit.tokenBucket(50, "1 m", 50),
  "public-chat:global",
)

export const publicChatSessionCreateLimiter = createLimiter(
  Ratelimit.slidingWindow(30, "1 h"),
  "public-chat:session-create",
)

// Checkout rate limiting (anti-carding)
export const checkoutUserLimiter = createLimiter(
  Ratelimit.slidingWindow(2, "1 h"),
  "checkout:user",
)

export const checkoutIpLimiter = createLimiter(
  Ratelimit.slidingWindow(5, "1 h"),
  "checkout:ip",
)

const DAILY_COST_KEY = "public-chat:daily-cost"
const DAILY_COST_CAP_USD = 50

export async function checkPublicChatRateLimit(
  ip: string,
  sessionToken: string,
) {
  const [ipResult, sessionResult, globalResult] = await Promise.all([
    publicChatIpLimiter.limit(ip),
    publicChatSessionLimiter.limit(sessionToken),
    publicChatGlobalLimiter.limit("global"),
  ])

  if (!ipResult.success) {
    return { success: false, reason: "Too many requests from your IP" as const }
  }
  if (!sessionResult.success) {
    return { success: false, reason: "Daily session limit reached" as const }
  }
  if (!globalResult.success) {
    return { success: false, reason: "Service is busy, try again later" as const }
  }

  return { success: true, reason: null }
}

export async function checkDailyCostCap(): Promise<boolean> {
  const cost = await redis.get<number>(DAILY_COST_KEY)
  return (cost ?? 0) < DAILY_COST_CAP_USD
}

export async function incrementDailyCost(costUsd: number): Promise<void> {
  const key = DAILY_COST_KEY
  const exists = await redis.exists(key)
  await redis.incrbyfloat(key, costUsd)
  if (!exists) {
    await redis.expire(key, 86_400)
  }
}
