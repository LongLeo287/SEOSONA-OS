# Facebook API Workflow

Graph API v20.0 for Facebook Pages. OAuth 2.0 authentication.

## Required Scopes

```javascript
const scopes = [
  'pages_show_list',
  'business_management',
  'pages_manage_posts',
  'pages_manage_engagement',
  'pages_read_engagement',
  'read_insights'
];
```

## OAuth Flow

```typescript
// 1. Generate auth URL
const authUrl = `https://www.facebook.com/v20.0/dialog/oauth?` +
  `client_id=${FACEBOOK_APP_ID}&` +
  `redirect_uri=${encodeURIComponent(redirectUri)}&` +
  `state=${state}&scope=${scopes.join(',')}`;

// 2. Exchange code for short-lived token
const tokenResponse = await fetch(
  `https://graph.facebook.com/v20.0/oauth/access_token?` +
  `client_id=${FACEBOOK_APP_ID}&redirect_uri=${redirectUri}&` +
  `client_secret=${FACEBOOK_APP_SECRET}&code=${code}`
);

// 3. Exchange for long-lived token (59 days)
const longLivedToken = await fetch(
  `https://graph.facebook.com/v20.0/oauth/access_token?` +
  `grant_type=fb_exchange_token&client_id=${FACEBOOK_APP_ID}&` +
  `client_secret=${FACEBOOK_APP_SECRET}&fb_exchange_token=${shortToken}`
);
```

## Get User & Pages

```typescript
// Get user info
const user = await fetch(
  `https://graph.facebook.com/v20.0/me?fields=id,name,picture&access_token=${token}`
).then(r => r.json());

// Get pages
const { data: pages } = await fetch(
  `https://graph.facebook.com/v20.0/me/accounts?fields=id,username,name,picture.type(large)&access_token=${token}`
).then(r => r.json());

// Get page access token
const { access_token: pageToken, id, name, picture } = await fetch(
  `https://graph.facebook.com/v20.0/${pageId}?fields=username,access_token,name,picture.type(large)&access_token=${token}`
).then(r => r.json());
```

## Post Creation

```typescript
// Text post with optional link
const post = await fetch(
  `https://graph.facebook.com/v20.0/${pageId}/feed?access_token=${pageToken}&fields=id,permalink_url`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Post content',
      link: 'https://example.com', // optional link preview
      published: true
    })
  }
).then(r => r.json());

// Post URL: permalink_url
```

## Photo Upload

```typescript
// 1. Upload photos (unpublished)
const photoIds = await Promise.all(
  mediaUrls.map(async (url) => {
    const { id } = await fetch(
      `https://graph.facebook.com/v20.0/${pageId}/photos?access_token=${pageToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, published: false })
      }
    ).then(r => r.json());
    return { media_fbid: id };
  })
);

// 2. Create post with photos
const post = await fetch(
  `https://graph.facebook.com/v20.0/${pageId}/feed?access_token=${pageToken}&fields=id,permalink_url`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Multi-photo post',
      attached_media: photoIds,
      published: true
    })
  }
).then(r => r.json());
```

## Video/Reels Upload

```typescript
const video = await fetch(
  `https://graph.facebook.com/v20.0/${pageId}/videos?access_token=${pageToken}&fields=id,permalink_url`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      file_url: videoUrl,
      description: 'Video description',
      published: true
    })
  }
).then(r => r.json());

// Reel URL format: https://www.facebook.com/reel/{videoId}
```

## Comments

```typescript
const comment = await fetch(
  `https://graph.facebook.com/v20.0/${postId}/comments?access_token=${pageToken}&fields=id,permalink_url`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'Comment text',
      attachment_url: imageUrl // optional image
    })
  }
).then(r => r.json());
```

## Analytics

```typescript
const { data } = await fetch(
  `https://graph.facebook.com/v20.0/${pageId}/insights?` +
  `metric=page_impressions_unique,page_post_engagements,page_daily_follows,page_video_views&` +
  `access_token=${pageToken}&period=day&since=${since}&until=${until}`
).then(r => r.json());
```

## Common Errors

| Code | Meaning | Action |
|------|---------|--------|
| `490` | Token expired | Re-authenticate |
| `REVOKED_ACCESS_TOKEN` | User revoked | Re-authenticate |
| `1366046` | Image too large | Max 4MB, JPG/PNG only |
| `1390008` | Posting too fast | Slow down |
| `1346003` | Abusive content | Review content |
| `1404078` | Auth required | Re-authorize page |
| `1609008` | Facebook.com link | Can't post FB links |

## Rate Limits

- Max concurrent: 100 jobs
- Token refresh: ~59 days lifespan
- Photo size: Max 4MB
