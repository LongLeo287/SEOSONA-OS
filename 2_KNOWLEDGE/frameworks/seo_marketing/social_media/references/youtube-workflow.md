# YouTube API Workflow

YouTube Data API v3 with googleapis npm package. OAuth 2.0 authentication.

## Required Scopes

```javascript
const scopes = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.force-ssl',
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtubepartner',
  'https://www.googleapis.com/auth/yt-analytics.readonly'
];
```

## OAuth Flow

```typescript
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  YOUTUBE_CLIENT_ID,
  YOUTUBE_CLIENT_SECRET,
  `${FRONTEND_URL}/integrations/social/youtube`
);

// 1. Generate auth URL
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  state,
  scope: scopes
});

// 2. Exchange code for tokens
const { tokens } = await oauth2Client.getToken(code);
oauth2Client.setCredentials(tokens);

// 3. Get user info
const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
const { data } = await oauth2.userinfo.get();
// { id, name, picture }

// 4. Refresh token (automatic with googleapis)
oauth2Client.setCredentials({ refresh_token });
const { credentials } = await oauth2Client.refreshAccessToken();
```

## Get Channels

```typescript
const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

// Get user's channels
const { data } = await youtube.channels.list({
  part: ['snippet', 'contentDetails', 'statistics'],
  mine: true
});

const channels = data.items.map(channel => ({
  id: channel.id,
  name: channel.snippet.title,
  picture: channel.snippet.thumbnails.default.url,
  customUrl: channel.snippet.customUrl,
  subscriberCount: channel.statistics.subscriberCount
}));
```

## Video Upload

```typescript
import axios from 'axios';

// 1. Get video stream
const videoStream = (await axios({
  url: videoUrl,
  method: 'GET',
  responseType: 'stream'
})).data;

// 2. Upload video
const { data: video } = await youtube.videos.insert({
  part: ['id', 'snippet', 'status'],
  notifySubscribers: true,
  requestBody: {
    snippet: {
      title: settings.title, // Max ~100 chars recommended
      description: message, // Max 5000 chars
      tags: tags.map(t => t.label) // Optional
    },
    status: {
      privacyStatus: 'public', // public, private, unlisted
      selfDeclaredMadeForKids: false // or true
    }
  },
  media: { body: videoStream }
});

const videoUrl = `https://www.youtube.com/watch?v=${video.id}`;
```

## Set Custom Thumbnail

```typescript
const thumbnailStream = (await axios({
  url: thumbnailUrl,
  method: 'GET',
  responseType: 'stream'
})).data;

await youtube.thumbnails.set({
  videoId: video.id,
  media: { body: thumbnailStream }
});
```

## Analytics

```typescript
const youtubeAnalytics = google.youtubeAnalytics({ version: 'v2', auth: oauth2Client });

const { data } = await youtubeAnalytics.reports.query({
  ids: 'channel==MINE',
  startDate: '2025-01-01',
  endDate: '2025-01-20',
  metrics: 'views,estimatedMinutesWatched,averageViewDuration,averageViewPercentage,subscribersGained,likes,subscribersLost',
  dimensions: 'day',
  sort: 'day'
});

// data.rows contains daily metrics
// data.columnHeaders contains column names
```

## Common Errors

| Error | Meaning | Action |
|-------|---------|--------|
| `invalidTitle` | Title too long | Shorten title |
| `failedPrecondition` | Thumbnail too large | Reduce size |
| `uploadLimitExceeded` | Daily quota reached | Wait 24 hours |
| `youtubeSignupRequired` | Account not linked | Link YT account |
| `youtube.thumbnail` | Account not verified | Verify account |
| `Unauthorized` | Token invalid | Re-authenticate |
| `UNAUTHENTICATED` / `invalid_grant` | Token revoked | Re-authenticate |

## Rate Limits & Constraints

- Max concurrent: 200 jobs (highest among platforms)
- Max description: 5000 characters
- Quota: 10,000 units/day (video upload costs 1600 units)
- Custom thumbnails require verified account
- Kids content has restrictions

## Privacy Settings

```typescript
const privacyStatus = 'public'; // Options:
// 'public' - Anyone can view
// 'unlisted' - Anyone with link can view
// 'private' - Only you can view
```

## Video Settings DTO

```typescript
interface YoutubeSettings {
  title: string;           // Required, max ~100 chars
  description?: string;    // Optional, max 5000 chars
  tags?: { label: string }[];  // Optional keywords
  type: 'public' | 'unlisted' | 'private';
  selfDeclaredMadeForKids: 'yes' | 'no';
  thumbnail?: { path: string };  // Custom thumbnail URL
}
```
