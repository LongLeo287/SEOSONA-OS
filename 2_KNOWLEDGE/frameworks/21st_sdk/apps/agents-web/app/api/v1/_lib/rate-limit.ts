import { IS_STANDALONE_APP } from "@/lib/agents/auth/config"
import { redis } from "@/lib/redis"

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
}

async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  const windowKey = `ratelimit:${key}:${Math.floor(Date.now() / (windowSeconds * 1000))}`

  try {
    const count = await redis.incr(windowKey)
    if (count === 1) {
      await redis.expire(windowKey, windowSeconds)
    }

    const resetAt =
      Math.ceil(Date.now() / (windowSeconds * 1000)) * windowSeconds

    return {
      allowed: count <= limit,
      remaining: Math.max(0, limit - count),
      resetAt,
    }
  } catch {
    // Fail open if Redis is down
    return { allowed: true, remaining: limit, resetAt: 0 }
  }
}

export async function checkApiRateLimits(
  apiKeyId: string,
  userId: string,
): Promise<void> {
  if (IS_STANDALONE_APP) {
    return
  }

  const perMinute = await checkRateLimit(`api:min:${apiKeyId}`, 100, 60)
  if (!perMinute.allowed) {
    const retryAfter = Math.max(1, perMinute.resetAt - Math.floor(Date.now() / 1000))
    throw {
      status: 429,
      error: "rate_limit_exceeded",
      message: "Rate limit exceeded: 100 requests per minute",
      headers: {
        "Retry-After": String(retryAfter),
        "X-RateLimit-Limit": "100",
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(perMinute.resetAt),
      },
    }
  }

  const perHour = await checkRateLimit(`api:hr:${userId}`, 1000, 3600)
  if (!perHour.allowed) {
    const retryAfter = Math.max(1, perHour.resetAt - Math.floor(Date.now() / 1000))
    throw {
      status: 429,
      error: "rate_limit_exceeded",
      message: "Rate limit exceeded: 1000 requests per hour",
      headers: {
        "Retry-After": String(retryAfter),
        "X-RateLimit-Limit": "1000",
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(perHour.resetAt),
      },
    }
  }
}
