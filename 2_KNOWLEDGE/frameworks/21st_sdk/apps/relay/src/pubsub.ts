import Redis, { RedisOptions } from 'ioredis';

console.log('[PUBSUB] Loading PubSubService module...');

const getRedisOptions = (url: string): RedisOptions => {
  const isTLS = url.startsWith('rediss://');
  console.log(`[PUBSUB] Redis URL uses TLS: ${isTLS}`);

  return {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    lazyConnect: true,
    retryStrategy: (times) => {
      console.log(`[REDIS] Reconnect attempt ${times}`);
      const delay = Math.min(times * 100, 5000);
      console.log(`[REDIS] Will retry in ${delay}ms`);
      return delay;
    },
    reconnectOnError: (err) => {
      console.log(`[REDIS] reconnectOnError triggered:`, err.message);
      return true;
    },
    ...(isTLS && { tls: { rejectUnauthorized: false } }),
  };
};

export class PubSubService {
  private publisher: Redis;
  private redisUrl: string;

  constructor(redisUrl: string = process.env.REDIS_URL || 'redis://localhost:6379') {
    console.log('[PUBSUB] Constructor called');
    console.log('[PUBSUB] Redis URL:', redisUrl.replace(/\/\/.*@/, '//<credentials>@'));

    this.redisUrl = redisUrl;
    this.publisher = this.createConnection('publisher');
    console.log('[PUBSUB] Publisher connection created');
  }

  private createConnection(name: string, silent = false): Redis {
    console.log(`[REDIS] Creating ${name} connection (silent: ${silent})`);

    const conn = new Redis(this.redisUrl, getRedisOptions(this.redisUrl));

    conn.on('error', (err) => {
      console.error(`[REDIS] ${name} error:`, err.message);
      console.error(`[REDIS] ${name} error stack:`, err.stack);
    });

    conn.on('connect', () => {
      console.log(`[REDIS] ${name} connected`);
    });

    conn.on('ready', () => {
      console.log(`[REDIS] ${name} ready`);
    });

    conn.on('reconnecting', () => {
      console.log(`[REDIS] ${name} reconnecting...`);
    });

    conn.on('close', () => {
      console.log(`[REDIS] ${name} connection closed`);
    });

    conn.on('end', () => {
      console.log(`[REDIS] ${name} connection ended`);
    });

    console.log(`[REDIS] ${name} event listeners attached`);
    return conn;
  }

  async publish(channel: string, message: object): Promise<void> {
    console.log(`[PUBSUB] publish() called`);
    console.log(`[PUBSUB] Channel: ${channel}`);
    console.log(`[PUBSUB] Message:`, JSON.stringify(message));

    try {
      console.log(`[PUBSUB] Calling Redis PUBLISH...`);
      const subscribers = await this.publisher.publish(channel, JSON.stringify(message));
      console.log(`[PUBSUB] Published successfully, ${subscribers} subscriber(s) received`);
    } catch (err) {
      console.error('[PUBSUB] Publish failed:', err);
      console.error('[PUBSUB] Publish error stack:', (err as Error).stack);
    }
  }

  subscribe(channel: string, onMessage: (message: object) => void): () => void {
    console.log(`[PUBSUB] subscribe() called`);
    console.log(`[PUBSUB] Subscribing to channel: ${channel}`);

    const subscriber = this.createConnection('subscriber');

    console.log(`[PUBSUB] Calling Redis SUBSCRIBE...`);
    subscriber.subscribe(channel)
      .then(() => {
        console.log(`[PUBSUB] Successfully subscribed to: ${channel}`);
      })
      .catch((err) => {
        console.error(`[PUBSUB] Subscribe failed for ${channel}:`, err);
        console.error(`[PUBSUB] Subscribe error stack:`, err.stack);
      });

    subscriber.on('message', (receivedChannel, data) => {
      console.log(`[PUBSUB] Message received on channel: ${receivedChannel}`);
      console.log(`[PUBSUB] Raw data: ${data}`);

      try {
        const parsed = JSON.parse(data);
        console.log(`[PUBSUB] Parsed message:`, JSON.stringify(parsed));
        console.log(`[PUBSUB] Calling onMessage callback...`);
        onMessage(parsed);
        console.log(`[PUBSUB] onMessage callback completed`);
      } catch (err) {
        console.error('[PUBSUB] Message parse error:', err);
        console.error('[PUBSUB] Failed to parse:', data);
      }
    });

    subscriber.on('messageBuffer', (channel, message) => {
      console.log(`[PUBSUB] messageBuffer event on ${channel}`);
    });

    console.log(`[PUBSUB] Returning cleanup function`);
    return () => {
      console.log(`[PUBSUB] Cleanup called for channel: ${channel}`);
      subscriber.unsubscribe()
        .then(() => console.log(`[PUBSUB] Unsubscribed from: ${channel}`))
        .catch((err) => console.error(`[PUBSUB] Unsubscribe error:`, err));
      subscriber.quit()
        .then(() => console.log(`[PUBSUB] Subscriber quit for: ${channel}`))
        .catch((err) => console.error(`[PUBSUB] Subscriber quit error:`, err));
    };
  }

  async close(): Promise<void> {
    console.log('[PUBSUB] close() called');
    await this.publisher.quit()
      .then(() => console.log('[PUBSUB] Publisher quit successfully'))
      .catch((err) => console.error('[PUBSUB] Publisher quit error:', err));
  }
}

export const pubsub = new PubSubService();
console.log('[PUBSUB] Default pubsub instance created');
