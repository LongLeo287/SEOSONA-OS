# Rate Limits & Error Handling

Cross-platform rate limit management and error recovery strategies.

## Rate Limits by Platform

| Platform | Max Concurrent | Token Expiry | Daily Limits |
|----------|----------------|--------------|--------------|
| X (Twitter) | 1 | Never (OAuth 1.0a) | 50 tweets (Basic), 300K/mo (Pro) |
| LinkedIn | 2 | Needs refresh | Varies by tier |
| Facebook | 100 | ~59 days | 200 calls/hour |
| Threads | 2 | ~58 days | 250 posts/24h |
| TikTok | 1 | ~23 hours | Varies by approval status |
| YouTube | 200 | Needs refresh | 10K units/day |

## Error Handling Pattern

```typescript
abstract class SocialAbstract {
  async fetch(url: string, options: RequestInit = {}, retries = 0): Promise<Response> {
    const response = await fetch(url, options);

    if (response.ok) return response;

    // Retry on rate limit or server error
    if (retries < 3 && (response.status === 429 || response.status === 500)) {
      await this.delay(5000 * (retries + 1)); // Exponential backoff
      return this.fetch(url, options, retries + 1);
    }

    const body = await response.text();
    const error = this.handleErrors(body);

    if (error?.type === 'refresh-token') {
      throw new RefreshTokenError(error.value);
    }
    if (error?.type === 'retry') {
      await this.delay(5000);
      return this.fetch(url, options, retries + 1);
    }

    throw new BadBodyError(error?.value || 'Unknown error');
  }
}
```

## Exponential Backoff

```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      const delay = baseDelay * Math.pow(2, i); // 1s, 2s, 4s...
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw new Error('Max retries exceeded');
}
```

## Error Types

```typescript
// Refresh Token Error - Token expired, need re-auth
class RefreshTokenError extends Error {
  type = 'refresh-token';
}

// Bad Body Error - Content issue, don't retry
class BadBodyError extends Error {
  type = 'bad-body';
}

// Retry Error - Temporary issue, retry with backoff
class RetryError extends Error {
  type = 'retry';
}
```

## Platform-Specific Error Codes

### X (Twitter)
| Code/Message | Type | Action |
|--------------|------|--------|
| `Unsupported Authentication` | refresh-token | Re-authenticate |
| `usage-capped` | bad-body | Wait for quota reset |
| `duplicate-rules` | bad-body | Content already posted |

### LinkedIn
| Code/Message | Type | Action |
|--------------|------|--------|
| `Unable to obtain activity` | retry | Retry with delay |

### Facebook
| Code | Type | Meaning |
|------|------|---------|
| `490` | refresh-token | Token expired |
| `1366046` | bad-body | Image too large (>4MB) |
| `1390008` | bad-body | Posting too fast |
| `1404078` | refresh-token | Page auth required |
| `1609008` | bad-body | Can't post FB links |

### Threads
| Code/Message | Type | Action |
|--------------|------|--------|
| `Error validating access token` | refresh-token | Re-authenticate |

### TikTok
| Code | Type | Meaning |
|------|------|---------|
| `access_token_invalid` | refresh-token | Token expired |
| `rate_limit_exceeded` | bad-body | Too many requests |
| `picture_size_check_failed` | bad-body | Min 720p required |
| `spam_risk_too_many_posts` | bad-body | Daily limit |

### YouTube
| Code | Type | Meaning |
|------|------|---------|
| `invalidTitle` | bad-body | Title too long |
| `uploadLimitExceeded` | bad-body | Daily quota |
| `Unauthorized` | refresh-token | Token invalid |

## Token Refresh Strategy

```typescript
interface TokenManager {
  async getValidToken(integration: Integration): Promise<string> {
    const expiresAt = integration.tokenExpiresAt;
    const buffer = 5 * 60 * 1000; // 5 minute buffer

    if (Date.now() > expiresAt - buffer) {
      const newTokens = await this.refreshToken(integration);
      await this.saveTokens(integration.id, newTokens);
      return newTokens.accessToken;
    }

    return integration.accessToken;
  }
}
```

## Queue Management

```typescript
class PostQueue {
  private queues: Map<string, Promise<void>> = new Map();

  async enqueue(platform: string, job: () => Promise<void>): Promise<void> {
    const existingQueue = this.queues.get(platform) || Promise.resolve();

    const newQueue = existingQueue.then(async () => {
      await job();
      // Rate limit delay based on platform
      await this.platformDelay(platform);
    });

    this.queues.set(platform, newQueue);
    return newQueue;
  }

  private async platformDelay(platform: string): Promise<void> {
    const delays: Record<string, number> = {
      x: 2000,        // 2s between tweets
      linkedin: 1000, // 1s between posts
      facebook: 500,  // 0.5s between posts
      threads: 3000,  // 3s between posts
      tiktok: 5000,   // 5s between posts
      youtube: 1000   // 1s between uploads
    };
    await new Promise(r => setTimeout(r, delays[platform] || 1000));
  }
}
```

## Best Practices

1. **Token Refresh**: Always refresh before expiry, not after failure
2. **Backoff**: Start at 1s, double each retry, cap at 60s
3. **Concurrency**: Respect platform limits (see table above)
4. **Caching**: Cache responses to reduce API calls
5. **Circuit Breaker**: Disable platform temporarily after repeated failures
6. **Logging**: Log all errors with full context for debugging
7. **Alerts**: Notify on refresh-token errors (require user action)
