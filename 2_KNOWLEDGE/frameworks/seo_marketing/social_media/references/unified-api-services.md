# Unified Social Media API Services

Third-party services that provide single API for multi-platform posting.

## When to Use

- Rapid prototyping without managing individual OAuth flows
- Small teams without resources for platform-specific maintenance
- Cross-platform posting with consistent interface
- Simplified rate limit and error handling

## Ayrshare

**Website:** https://www.ayrshare.com/
**npm:** `social-media-api` (renamed from `social-post-api`)

### Supported Platforms
X/Twitter, Instagram, Facebook, LinkedIn, YouTube, Google Business, Pinterest, TikTok, Reddit, Telegram

### Quick Start

```typescript
import SocialMediaAPI from 'social-media-api';

const social = new SocialMediaAPI(process.env.AYRSHARE_API_KEY);

// Post to multiple platforms
const result = await social.post({
  post: 'Your content here',
  platforms: ['twitter', 'linkedin', 'facebook'],
  mediaUrls: ['https://example.com/image.jpg'],
  scheduleDate: '2025-01-20T10:00:00Z' // Optional scheduling
});

// Auto-scheduling
await social.autoSchedule({
  schedules: [
    { platform: 'twitter', times: ['09:00', '14:00', '19:00'] },
    { platform: 'linkedin', times: ['08:00', '12:00'] }
  ]
});
```

### Features
- Post publishing and scheduling
- Analytics retrieval
- Comment management
- Auto-scheduling with optimal times
- Multi-language support

---

## Late.dev

**Website:** https://getlate.dev/
**Pricing:** Free tier available

### Supported Platforms (13)
Twitter/X, Instagram, TikTok, LinkedIn, Facebook, YouTube, Threads, Reddit, Pinterest, Bluesky, Telegram, Snapchat, Google Business

### Quick Start

```typescript
// Single API call to multiple platforms
const response = await fetch('https://getlate.dev/api/v1/posts', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${LATE_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: 'Your content here',
    platforms: ['twitter', 'instagram', 'linkedin'],
    mediaUrls: ['https://example.com/demo.mp4'],
    scheduledFor: '2025-01-15T09:00:00Z' // Optional
  })
});
```

### Features
- 99.97% uptime SLA
- Automatic rate limit handling
- Platform-specific content transformation
- Webhook notifications for post status
- Bulk scheduling via CSV
- White-label ready

---

## Comparison

| Feature | Ayrshare | Late.dev |
|---------|----------|----------|
| Platforms | 10+ | 13 |
| Free tier | Limited | Yes |
| npm package | Yes | REST API |
| Auto-scheduling | Yes | Yes |
| Webhooks | Yes | Yes |
| Rate limit handling | Yes | Yes |
| Analytics | Yes | Yes |
| White-label | Enterprise | Yes |

## Use Cases

### Direct API (Postiz Pattern)
Best when:
- Full control over OAuth flows
- Custom error handling requirements
- No third-party dependency
- Cost optimization at scale

### Unified API (Ayrshare/Late)
Best when:
- Quick time-to-market
- Small team, limited maintenance
- MVP or proof-of-concept
- Consistent cross-platform behavior

## Environment Setup

```bash
# .env for unified APIs
AYRSHARE_API_KEY=your_ayrshare_key
LATE_API_KEY=your_late_key

# Fallback to direct APIs if unified fails
X_API_KEY=
X_API_SECRET=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
# ... etc
```

## Hybrid Approach

Use unified API for simple posts, direct API for platform-specific features:

```typescript
async function postContent(content: PostContent): Promise<PostResult> {
  // Simple cross-platform post → use unified API
  if (content.platforms.length > 1 && !content.platformSpecificSettings) {
    return postViaUnifiedAPI(content);
  }

  // Platform-specific features → use direct API
  if (content.platforms.includes('linkedin') && content.pdfCarousel) {
    return postViaLinkedInAPI(content);
  }

  // Default to direct APIs
  return postViaDirectAPIs(content);
}
```
