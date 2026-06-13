import "server-only"

import { EventEmitter } from "node:events"
import { Redis as UpstashRedis } from "@upstash/redis"
import { createClient, type RedisClientType } from "redis"

import { IS_STANDALONE_APP } from "@/lib/agents/auth/config"

type RedisPrimitive = string | number | boolean | null
type RedisValue = RedisPrimitive | Record<string, unknown> | unknown[]
type RedisSetOptions = {
  ex?: number
}
type UpstashSubscriber = ReturnType<UpstashRedis["subscribe"]>

export interface RedisSubscription {
  on(event: "message", listener: (message: string, channel: string) => void): this
  unsubscribe(): Promise<void>
}

export interface AppRedisClient {
  get<T = string>(key: string): Promise<T | null>
  set(key: string, value: RedisValue, options?: RedisSetOptions): Promise<unknown>
  mget<T extends unknown[] = unknown[]>(...keys: string[]): Promise<T>
  incr(key: string): Promise<number>
  exists(key: string): Promise<number>
  expire(key: string, seconds: number): Promise<number>
  incrbyfloat(key: string, value: number): Promise<number>
  publish(channel: string, message: string): Promise<number>
  subscribe(channel: string): Promise<RedisSubscription>
}

const standaloneRedisUrl = process.env.REDIS_URL?.trim()
const upstashRedisUrl = process.env.UPSTASH_REDIS_REST_URL?.trim()
const upstashRedisToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim()

function createUpstashRedisClient() {
  if (!upstashRedisUrl || !upstashRedisToken) {
    throw new Error(
      "Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN",
    )
  }

  return new UpstashRedis({
    url: upstashRedisUrl,
    token: upstashRedisToken,
  })
}

export const upstashRedisRaw = IS_STANDALONE_APP
  ? null
  : createUpstashRedisClient()

function serializeRedisValue(value: RedisValue) {
  if (value === null) return "null"
  if (typeof value === "string") return value
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value)
  }
  return JSON.stringify(value)
}

function deserializeRedisValue<T>(value: string | null): T | null {
  if (value === null) return null
  if (value === "null") return null
  if (value === "true") return true as T
  if (value === "false") return false as T
  if (/^-?\d+(\.\d+)?$/.test(value)) {
    return Number(value) as T
  }
  if (
    (value.startsWith("{") && value.endsWith("}")) ||
    (value.startsWith("[") && value.endsWith("]"))
  ) {
    try {
      return JSON.parse(value) as T
    } catch {
      return value as T
    }
  }
  return value as T
}

function normalizeNumericResult(value: number | boolean) {
  if (typeof value === "number") return value
  return value ? 1 : 0
}

function normalizePubSubMessage(message: unknown) {
  if (typeof message === "string") return message
  return JSON.stringify(message)
}

class AwsRedisSubscription extends EventEmitter implements RedisSubscription {
  private unsubscribed = false

  constructor(
    private readonly client: RedisClientType,
    private readonly channel: string,
  ) {
    super()
  }

  override on(
    event: "message",
    listener: (message: string, channel: string) => void,
  ): this {
    return super.on(event, listener)
  }

  emitMessage(message: string) {
    this.emit("message", message, this.channel)
  }

  async unsubscribe() {
    if (this.unsubscribed) return
    this.unsubscribed = true

    try {
      await this.client.unsubscribe(this.channel)
    } finally {
      try {
        await this.client.close()
      } catch {
        this.client.destroy()
      }
    }
  }
}

let sharedAwsRedisClient: RedisClientType | null = null
let sharedAwsRedisClientPromise: Promise<RedisClientType> | null = null

async function getSharedAwsRedisClient() {
  if (sharedAwsRedisClient?.isReady) {
    return sharedAwsRedisClient
  }

  if (sharedAwsRedisClient && !sharedAwsRedisClient.isOpen) {
    sharedAwsRedisClient = null
    sharedAwsRedisClientPromise = null
  }

  if (!standaloneRedisUrl) {
    throw new Error("Missing REDIS_URL for standalone Redis")
  }

  if (!sharedAwsRedisClientPromise) {
    sharedAwsRedisClient = createClient({
      url: standaloneRedisUrl,
    })
    sharedAwsRedisClient.on("error", (error) => {
      console.error("[redis] AWS Redis client error:", error)
    })

    sharedAwsRedisClientPromise = sharedAwsRedisClient
      .connect()
      .then(() => sharedAwsRedisClient as RedisClientType)
      .catch((error) => {
        sharedAwsRedisClientPromise = null
        sharedAwsRedisClient = null
        throw error
      })
  }

  return sharedAwsRedisClientPromise
}

class AwsRedisAdapter implements AppRedisClient {
  async get<T = string>(key: string): Promise<T | null> {
    const client = await getSharedAwsRedisClient()
    const value = await client.get(key)
    return deserializeRedisValue<T>(value)
  }

  async set(key: string, value: RedisValue, options?: RedisSetOptions) {
    const client = await getSharedAwsRedisClient()
    const serializedValue = serializeRedisValue(value)

    if (options?.ex) {
      return client.set(key, serializedValue, { EX: options.ex })
    }

    return client.set(key, serializedValue)
  }

  async mget<T extends unknown[] = unknown[]>(...keys: string[]): Promise<T> {
    const client = await getSharedAwsRedisClient()
    const values = await client.mGet(keys)
    return values.map((value) => deserializeRedisValue(value)) as T
  }

  async incr(key: string) {
    const client = await getSharedAwsRedisClient()
    return client.incr(key)
  }

  async exists(key: string) {
    const client = await getSharedAwsRedisClient()
    return normalizeNumericResult(await client.exists(key))
  }

  async expire(key: string, seconds: number) {
    const client = await getSharedAwsRedisClient()
    return normalizeNumericResult(await client.expire(key, seconds))
  }

  async incrbyfloat(key: string, value: number) {
    const client = await getSharedAwsRedisClient()
    return Number(await client.incrByFloat(key, value))
  }

  async publish(channel: string, message: string) {
    const client = await getSharedAwsRedisClient()
    return client.publish(channel, message)
  }

  async subscribe(channel: string) {
    const baseClient = await getSharedAwsRedisClient()
    const subscriberClient = baseClient.duplicate()
    subscriberClient.on("error", (error) => {
      console.error("[redis] AWS Redis subscriber error:", error)
    })
    await subscriberClient.connect()

    const subscription = new AwsRedisSubscription(subscriberClient, channel)
    await subscriberClient.subscribe(channel, (message) => {
      subscription.emitMessage(message)
    })

    return subscription
  }
}

class UpstashRedisSubscription implements RedisSubscription {
  constructor(private readonly subscriber: UpstashSubscriber) {}

  on(
    event: "message",
    listener: (message: string, channel: string) => void,
  ): this {
    this.subscriber.on(event, ({ channel, message }) => {
      listener(normalizePubSubMessage(message), channel)
    })

    return this
  }

  unsubscribe() {
    return this.subscriber.unsubscribe()
  }
}

class UpstashRedisAdapter implements AppRedisClient {
  constructor(private readonly client: UpstashRedis) {}

  get<T = string>(key: string): Promise<T | null> {
    return this.client.get<T>(key)
  }

  set(key: string, value: RedisValue, options?: RedisSetOptions) {
    if (options?.ex) {
      return this.client.set(key, value, { ex: options.ex })
    }

    return this.client.set(key, value)
  }

  mget<T extends unknown[] = unknown[]>(...keys: string[]): Promise<T> {
    return this.client.mget<T>(...keys)
  }

  incr(key: string) {
    return this.client.incr(key)
  }

  exists(key: string) {
    return this.client.exists(key)
  }

  expire(key: string, seconds: number) {
    return this.client.expire(key, seconds)
  }

  incrbyfloat(key: string, value: number) {
    return this.client.incrbyfloat(key, value)
  }

  publish(channel: string, message: string) {
    return this.client.publish(channel, message)
  }

  async subscribe(channel: string) {
    const subscriber = this.client.subscribe(channel)
    return new UpstashRedisSubscription(subscriber)
  }
}

export const redis: AppRedisClient = IS_STANDALONE_APP
  ? new AwsRedisAdapter()
  : new UpstashRedisAdapter(upstashRedisRaw as UpstashRedis)
