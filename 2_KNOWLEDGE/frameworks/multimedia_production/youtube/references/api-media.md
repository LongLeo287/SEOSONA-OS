# VidCap.xyz - Media & Search Endpoints

Base URL: `https://vidcap.xyz` | Auth: `X-API-Key` header

## Screenshots

### GET /api/v1/youtube/screenshot
Capture single frame from video.

| Param | Required | Default | Description |
|-------|----------|---------|-------------|
| url | Yes | - | YouTube video URL |
| second | No | 0 | Timestamp in seconds |

Response: `{url, second, image_url}`

### GET /api/v1/youtube/screenshot-multiple
Capture multiple frames at specified times.

| Param | Required | Default | Description |
|-------|----------|---------|-------------|
| url | Yes | - | YouTube video URL |
| second | No | [0] | Array of timestamps |

Response: `{url, image_urls: [], seconds: []}`

---

## Search

### GET /api/v1/youtube/search
Search YouTube videos.

| Param | Required | Default | Description |
|-------|----------|---------|-------------|
| q | Yes | - | Search query |
| maxResults | No | 10 | Results count (1-50) |
| order | No | relevance | relevance/date/viewCount/rating |
| pageToken | No | - | Pagination token |
| videoDuration | No | any | short/medium/long/any |
| publishedAfter | No | - | ISO 8601 date |

Response: `{items: [], nextPageToken, prevPageToken, totalResults}`

---

## Utility Endpoints

### GET /api/v1/healthz
Check API health status.

Response: `{status: "ok"}`

### GET /api/v1/ai/models
List available AI models for processing.

Response: Array of model identifiers (Gemini, Llama, ChatGPT, etc.)

### GET /api/v1/video/{videoId}
Retrieve stored video by ID.

| Param | Required | Description |
|-------|----------|-------------|
| videoId | Yes | Video ID (path param) |

Response: Video object or 404
