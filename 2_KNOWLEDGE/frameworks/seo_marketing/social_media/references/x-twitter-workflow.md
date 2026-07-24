# X (Twitter) API Workflow

OAuth 1.0a authentication with twitter-api-v2 npm package.

## OAuth Flow

```typescript
import { TwitterApi } from 'twitter-api-v2';

// 1. Generate auth link
const client = new TwitterApi({
  appKey: process.env.X_API_KEY!,
  appSecret: process.env.X_API_SECRET!,
});

const { url, oauth_token, oauth_token_secret } = await client.generateAuthLink(
  `${process.env.FRONTEND_URL}/callback`,
  { authAccessType: 'write', linkMode: 'authenticate' }
);

// 2. After user authorizes, exchange tokens
const startingClient = new TwitterApi({
  appKey: process.env.X_API_KEY!,
  appSecret: process.env.X_API_SECRET!,
  accessToken: oauth_token,
  accessSecret: oauth_token_secret,
});

const { accessToken, accessSecret, client: authedClient } =
  await startingClient.login(verifierCode);
```

## Post Creation

```typescript
// Simple text post
const { data } = await client.v2.tweet({ text: 'Hello world!' });

// Post with media
const mediaId = await client.v1.uploadMedia(buffer, { mimeType: 'image/jpeg' });
await client.v2.tweet({ text: 'With image', media: { media_ids: [mediaId] } });

// Thread/reply
await client.v2.tweet({
  text: 'Reply content',
  reply: { in_reply_to_tweet_id: parentTweetId }
});

// Reply settings
await client.v2.tweet({
  text: 'Subscribers only',
  reply_settings: 'mentionedUsers' // everyone|following|mentionedUsers|subscribers|verified
});
```

## Media Upload

```typescript
// Image (resize to 1000px width for optimal performance)
const imageBuffer = await sharp(await fetch(url)).resize({ width: 1000 }).toBuffer();
const mediaId = await client.v1.uploadMedia(imageBuffer, { mimeType: 'image/jpeg' });

// Video (chunked upload handled automatically)
const videoBuffer = Buffer.from(await fetch(videoUrl));
const mediaId = await client.v1.uploadMedia(videoBuffer, { mimeType: 'video/mp4' });

// GIF
const mediaId = await client.v1.uploadMedia(gifBuffer, { mimeType: 'image/gif' });
```

## Rate Limits

- Basic tier ($200/mo): 50 tweets/day, 100 DMs/day
- Pro tier ($5000/mo): 300K tweets/month
- 15-minute windows for most endpoints
- Check `x-rate-limit-reset` header for reset time

## Common Errors

| Error | Meaning | Action |
|-------|---------|--------|
| `Unsupported Authentication` | Token expired | Re-authenticate |
| `usage-capped` | Rate limit hit | Wait, retry later |
| `duplicate-rules` | Same post exists | Wait before reposting |
| `invalid URL` | Blocked link | Remove/replace URL |
| `video longer than 2 minutes` | Non-premium account | Shorten video |

## Repost/Retweet

```typescript
const { data: { id } } = await client.v2.me();
await client.v2.retweet(id, targetTweetId);
```

## Get User Info

```typescript
const { data } = await client.v2.me({
  'user.fields': ['username', 'verified', 'profile_image_url', 'name']
});
// { id, username, name, profile_image_url, verified }
```

## Mentions

```typescript
const user = await client.v2.userByUsername(handle, {
  'user.fields': ['username', 'name', 'profile_image_url']
});
// Mention format: @username
```
