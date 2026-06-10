# VidCap.xyz - Content & AI Endpoints

Base URL: `https://vidcap.xyz` | Auth: `X-API-Key` header

## Video Information

### GET /api/v1/youtube/info
Fetch video metadata (cached).

| Param | Required | Default | Description |
|-------|----------|---------|-------------|
| url | Yes | - | YouTube video URL |
| cache | No | true | Use cached data |

Response: `{title, description, duration}`

### GET /api/v1/youtube/media
List available formats for download.

| Param | Required | Description |
|-------|----------|-------------|
| url | Yes | YouTube video URL |

Response: `{videoFiles: [], audioFiles: []}`

### GET /api/v1/youtube/download
Download and store video.

| Param | Required | Description |
|-------|----------|-------------|
| url | Yes | YouTube video URL |

Response: `{id, title, sourceId, videoUrl}`

---

## Content Extraction

### GET /api/v1/youtube/caption
Extract captions/transcripts.

| Param | Required | Default | Description |
|-------|----------|---------|-------------|
| url | Yes | - | YouTube video URL |
| locale | No | en | Language code |
| model | No | - | AI model for generation |
| ext | No | - | Format: json3/srv1/srv2/srv3/ttml/vtt |

Response: `[{text, start, duration}]`

### GET /api/v1/youtube/comments
Get video comments.

| Param | Required | Default | Description |
|-------|----------|---------|-------------|
| url | One req | - | YouTube video URL |
| videoId | One req | - | YouTube video ID |
| order | No | relevance | `time` or `relevance` |
| format | No | plainText | `plainText` or `html` |
| pageToken | No | - | Pagination token |
| includeReplies | No | false | Include replies |

Response: `{comments: [{author, text, likeCount, publishedAt, replyCount}], nextPageToken}`

---

## AI Processing

### GET /api/v1/youtube/summary
Generate AI summary.

| Param | Required | Default | Description |
|-------|----------|---------|-------------|
| url | Yes | - | YouTube video URL |
| locale | No | en | Output language |
| model | No | - | AI model |
| screenshot | No | 0 | Include screenshots: 0/1 |
| cache | No | true | Use cache |

Response: String summary

### POST /api/v1/youtube/summary-custom
Custom prompt summarization. Body JSON: `{url, prompt, locale?, model?, screenshot?, cache?}`

Response: String

### GET /api/v1/youtube/article
Convert video to article.

| Param | Required | Default | Description |
|-------|----------|---------|-------------|
| url | Yes | - | YouTube video URL |
| locale | No | en | Output language |
| model | No | - | AI model |

Response: String article
