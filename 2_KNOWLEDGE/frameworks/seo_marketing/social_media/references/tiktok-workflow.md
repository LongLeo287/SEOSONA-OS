# TikTok API Workflow

TikTok Content Posting API v2. OAuth 2.0 authentication.

## Required Scopes

```javascript
const scopes = [
  'user.info.basic',
  'video.publish',
  'video.upload',
  'user.info.profile'
];
```

## OAuth Flow

```typescript
// 1. Generate auth URL (requires HTTPS)
const authUrl = `https://www.tiktok.com/v2/auth/authorize?` +
  `client_key=${TIKTOK_CLIENT_ID}&` +
  `redirect_uri=${encodeURIComponent(
    redirectUri.includes('https') ? redirectUri : `https://redirectmeto.com/${redirectUri}`
  )}&state=${state}&response_type=code&scope=${encodeURIComponent(scopes.join(','))}`;

// 2. Exchange code for tokens
const { access_token, refresh_token, scope } = await fetch(
  'https://open.tiktokapis.com/v2/oauth/token/',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_key: TIKTOK_CLIENT_ID,
      client_secret: TIKTOK_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      code_verifier: codeVerifier,
      redirect_uri: redirectUri
    })
  }
).then(r => r.json());

// 3. Refresh token (before 23-hour expiry)
const refreshed = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    client_key: TIKTOK_CLIENT_ID,
    client_secret: TIKTOK_CLIENT_SECRET,
    grant_type: 'refresh_token',
    refresh_token
  })
}).then(r => r.json());
```

## Get User Info

```typescript
const { data: { user } } = await fetch(
  'https://open.tiktokapis.com/v2/user/info/?fields=open_id,avatar_url,display_name,union_id,username',
  { headers: { Authorization: `Bearer ${accessToken}` } }
).then(r => r.json());
```

## Get Max Video Duration

```typescript
const { data: { max_video_post_duration_sec } } = await fetch(
  'https://open.tiktokapis.com/v2/post/publish/creator_info/query/',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: `Bearer ${accessToken}` }
  }
).then(r => r.json());
```

## Video Post

```typescript
// Direct post to profile (DIRECT_POST) or inbox (UPLOAD)
const { data: { publish_id } } = await fetch(
  `https://open.tiktokapis.com/v2/post/publish/video/init/`, // or /inbox/video/init/ for UPLOAD
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({
      post_info: {
        title: message, // Max 2000 chars
        privacy_level: 'PUBLIC_TO_EVERYONE', // MUTUAL_FOLLOW_FRIENDS, SELF_ONLY, FOLLOWER_OF_CREATOR
        disable_duet: false,
        disable_comment: false,
        disable_stitch: false,
        is_aigc: false, // AI-generated content flag
        brand_content_toggle: false,
        brand_organic_toggle: false
      },
      source_info: {
        source: 'PULL_FROM_URL',
        video_url: videoUrl,
        video_cover_timestamp_ms: thumbnailTimestamp // optional
      }
    })
  }
).then(r => r.json());
```

## Photo Post (Slideshow)

```typescript
const { data: { publish_id } } = await fetch(
  'https://open.tiktokapis.com/v2/post/publish/content/init/',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({
      post_info: {
        title: settings.title,
        description: message,
        privacy_level: 'PUBLIC_TO_EVERYONE',
        auto_add_music: true // or false
      },
      source_info: {
        source: 'PULL_FROM_URL',
        photo_cover_index: 0,
        photo_images: imageUrls // Array of image URLs
      },
      post_mode: 'DIRECT_POST', // or MEDIA_UPLOAD for inbox
      media_type: 'PHOTO'
    })
  }
).then(r => r.json());
```

## Check Upload Status

```typescript
async function checkUploadStatus(publishId, accessToken, username) {
  while (true) {
    const post = await fetch(
      'https://open.tiktokapis.com/v2/post/publish/status/fetch/',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ publish_id: publishId })
      }
    ).then(r => r.json());

    const { status, publicaly_available_post_id } = post.data;

    if (status === 'SEND_TO_USER_INBOX') {
      return { url: 'https://www.tiktok.com/tiktokstudio/content?tab=post', id: publishId };
    }
    if (status === 'PUBLISH_COMPLETE') {
      return {
        url: publicaly_available_post_id
          ? `https://www.tiktok.com/@${username}/video/${publicaly_available_post_id[0]}`
          : `https://www.tiktok.com/@${username}`,
        id: publicaly_available_post_id?.[0] || publishId
      };
    }
    if (status === 'FAILED') throw new Error(JSON.stringify(post));

    await new Promise(r => setTimeout(r, 10000)); // Poll every 10 seconds
  }
}
```

## Common Errors

| Error | Meaning | Action |
|-------|---------|--------|
| `access_token_invalid` | Token expired | Re-authenticate |
| `scope_not_authorized` | Missing permissions | Re-auth with all scopes |
| `rate_limit_exceeded` | Too many requests | Wait and retry |
| `file_format_check_failed` | Invalid video format | Check specs |
| `duration_check_failed` | Video too long/short | Adjust duration |
| `picture_size_check_failed` | Image too small | Min 720p |
| `spam_risk_too_many_posts` | Daily limit reached | Wait 24 hours |
| `reached_active_user_cap` | API quota reached | Contact support |

## Video Requirements

- Format: MP4 recommended
- Resolution: Min 720p
- Duration: Check `max_video_post_duration_sec`
- Size: Check platform limits

## Rate Limits & Constraints

- Max concurrent: 1 job
- Token expiry: ~23 hours
- Requires HTTPS redirect
- AIGC disclosure required for AI content
- Daily post limits apply
