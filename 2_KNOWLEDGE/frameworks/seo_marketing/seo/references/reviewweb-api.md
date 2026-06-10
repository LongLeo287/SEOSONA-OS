# ReviewWeb.site API Reference

Base URL: `https://reviewweb.site/api/v1`

## Authentication

```bash
# Header options
X-API-Key: $REVIEWWEB_API_KEY
# OR
Authorization: Bearer $REVIEWWEB_API_KEY
```

## SEO Insights Endpoints (Primary)

### Keyword Ideas
```
POST /seo-insights/keyword-ideas
Body: { keyword: string, country?: string, searchEngine?: string }
Response: Array of keyword suggestions with metrics
```

### Keyword Difficulty
```
POST /seo-insights/keyword-difficulty
Body: { keyword: string, country?: string }
Response: { difficulty, shortage, lastUpdate, serp }
```

### Backlinks
```
POST /seo-insights/backlinks
Body: { domain: string }
Response: { overview, backlinks[] }
```

### Traffic Analysis
```
POST /seo-insights/traffic
Body: { domainOrUrl: string, mode?: "subdomains"|"exact", country?: string }
Response: { traffic_history, traffic, top_pages, top_countries, top_keywords }
```

## Review & Screenshot

### Create/Get Review
```
POST /review → { url, instructions?, options? } → { reviewId, url, status }
GET /review/{reviewId} → Full review details
GET /review?page=1&limit=10 → Paginated list
DELETE /review/{reviewId} → Delete review
```

### Screenshots
```
POST /screenshot → { url, fullPage?, deviceType?, viewportWidth?, viewportHeight? }
GET /screenshot?reviewId={id} → Paginated screenshots
```

Device types: `DESKTOP`, `MOBILE`, `TABLET`

## Content Operations

See: [reviewweb-content-api.md](reviewweb-content-api.md)

## Response Format
```json
{ "success": boolean, "message": string, "data": object, "error": string }
```
