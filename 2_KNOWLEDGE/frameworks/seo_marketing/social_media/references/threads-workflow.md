# Threads API Workflow

Meta's Threads Graph API v1.0. OAuth 2.0 authentication.

## Required Scopes

```javascript
const scopes = [
  'threads_basic',
  'threads_content_publish',
  'threads_manage_replies',
  'threads_manage_insights'
];
```

## OAuth Flow

```typescript
// 1. Generate auth URL (requires HTTPS redirect)
const authUrl = `https://threads.net/oauth/authorize?` +
  `client_id=${THREADS_APP_ID}&` +
  `redirect_uri=${encodeURIComponent(
    redirectUri.includes('https') ? redirectUri : `https://redirectmeto.com/${redirectUri}`
  )}&state=${state}&scope=${encodeURIComponent(scopes.join(','))}`;

// 2. Exchange code for short-lived token
const { access_token: shortToken } = await fetch(
  `https://graph.threads.net/oauth/access_token?` +
  `client_id=${THREADS_APP_ID}&redirect_uri=${redirectUri}&` +
  `grant_type=authorization_code&client_secret=${THREADS_APP_SECRET}&code=${code}`
).then(r => r.json());

// 3. Exchange for long-lived token (58 days)
const { access_token } = await fetch(
  `https://graph.threads.net/access_token?grant_type=th_exchange_token&` +
  `client_secret=${THREADS_APP_SECRET}&access_token=${shortToken}`
).then(r => r.json());

// 4. Refresh token (before expiry)
const refreshed = await fetch(
  `https://graph.threads.net/refresh_access_token?grant_type=th_refresh_token&access_token=${token}`
).then(r => r.json());
```

## Get User Info

```typescript
const user = await fetch(
  `https://graph.threads.net/v1.0/me?fields=id,username,threads_profile_picture_url&access_token=${token}`
).then(r => r.json());
```

## Content Types

### Text-Only Post
```typescript
const form = new FormData();
form.append('media_type', 'TEXT');
form.append('text', message);
form.append('access_token', accessToken);

const { id: contentId } = await fetch(
  `https://graph.threads.net/v1.0/${userId}/threads`,
  { method: 'POST', body: form }
).then(r => r.json());
```

### Single Image/Video
```typescript
const isVideo = mediaPath.includes('.mp4');
const params = new URLSearchParams({
  [isVideo ? 'video_url' : 'image_url']: mediaPath,
  media_type: isVideo ? 'VIDEO' : 'IMAGE',
  text: message,
  access_token: accessToken
});

const { id: mediaId } = await fetch(
  `https://graph.threads.net/v1.0/${userId}/threads?${params}`,
  { method: 'POST' }
).then(r => r.json());
```

### Carousel (Multiple Media)
```typescript
// 1. Create carousel items (unpublished)
const mediaIds = [];
for (const media of mediaArray) {
  const isVideo = media.path.includes('.mp4');
  const params = new URLSearchParams({
    [isVideo ? 'video_url' : 'image_url']: media.path,
    media_type: isVideo ? 'VIDEO' : 'IMAGE',
    is_carousel_item: 'true',
    text: message,
    access_token: accessToken
  });
  const { id } = await fetch(`https://graph.threads.net/v1.0/${userId}/threads?${params}`, { method: 'POST' }).then(r => r.json());
  mediaIds.push(id);
}

// 2. Wait for all items to finish processing
await Promise.all(mediaIds.map(id => checkMediaStatus(id, accessToken)));

// 3. Create carousel container
const carouselParams = new URLSearchParams({
  text: message,
  media_type: 'CAROUSEL',
  children: mediaIds.join(','),
  access_token: accessToken
});
const { id: containerId } = await fetch(`https://graph.threads.net/v1.0/${userId}/threads?${carouselParams}`, { method: 'POST' }).then(r => r.json());
```

## Check Media Status

```typescript
async function checkMediaStatus(mediaContainerId, accessToken) {
  while (true) {
    const { status, error_message } = await fetch(
      `https://graph.threads.net/v1.0/${mediaContainerId}?fields=status,error_message&access_token=${accessToken}`
    ).then(r => r.json());

    if (status === 'ERROR') throw new Error(error_message);
    if (status === 'FINISHED') return true;
    await new Promise(r => setTimeout(r, 2200)); // Wait before retry
  }
}
```

## Publish Thread

```typescript
// Wait for content to be ready
await checkMediaStatus(contentId, accessToken);
await new Promise(r => setTimeout(r, 2000)); // Extra buffer

// Publish
const { id: threadId } = await fetch(
  `https://graph.threads.net/v1.0/${userId}/threads_publish?creation_id=${contentId}&access_token=${accessToken}`,
  { method: 'POST' }
).then(r => r.json());

// Get permalink
const { permalink } = await fetch(
  `https://graph.threads.net/v1.0/${threadId}?fields=id,permalink&access_token=${accessToken}`
).then(r => r.json());
```

## Reply Thread

```typescript
// Create reply content (same as post but with reply_to_id)
const form = new FormData();
form.append('media_type', 'TEXT');
form.append('text', replyMessage);
form.append('reply_to_id', parentThreadId);
form.append('access_token', accessToken);

const { id: replyContentId } = await fetch(
  `https://graph.threads.net/v1.0/${userId}/threads`,
  { method: 'POST', body: form }
).then(r => r.json());

// Publish reply
await checkMediaStatus(replyContentId, accessToken);
const { id: replyThreadId } = await fetch(
  `https://graph.threads.net/v1.0/${userId}/threads_publish?creation_id=${replyContentId}&access_token=${accessToken}`,
  { method: 'POST' }
).then(r => r.json());
```

## Quote Post

```typescript
const form = new FormData();
form.append('media_type', 'TEXT');
form.append('text', message);
form.append('quote_post_id', quotedThreadId);
form.append('access_token', accessToken);
```

## Analytics

```typescript
const { data } = await fetch(
  `https://graph.threads.net/v1.0/${userId}/threads_insights?` +
  `metric=views,likes,replies,reposts,quotes&access_token=${accessToken}&` +
  `period=day&since=${since}&until=${until}`
).then(r => r.json());
```

## Rate Limits & Constraints

- Max concurrent: 2 jobs
- Max post length: 500 characters
- Requires HTTPS redirect (use redirectmeto.com for local dev)
- Token refresh: ~58 days lifespan
- Carousel: Max items depend on Threads limits
