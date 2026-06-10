# ReviewWeb Content API

## Extract Endpoints

### Extract Structured Data
```
POST /extract
Body: {
  url: string,
  options: {
    instructions: string,
    jsonTemplate: object,  # Required
    model?: string,
    recursive?: boolean
  }
}
Response: Extracted data matching jsonTemplate
```

### Extract Multiple URLs
```
POST /extract/urls
Body: { urls: string[], options: { instructions, jsonTemplate } }
Response: Array of results per URL
```

## Summarize Endpoints

### Single URL
```
POST /summarize/url
Body: { url: string, options?: { instructions, model, maxLength: 500, format: "bullet"|"paragraph" } }
Response: { summary: { title, keyPoints, wordCount } }
```

### Website (Multiple Pages)
```
POST /summarize/website
Body: { url: string, options?: { maxLinks: 20, maxLength: 800, format } }
Response: { websiteSummary, pageSummaries[] }
```

## Scrape Endpoints

### Single URL
```
POST /scrape?url={url}
Body: { options?: { delayAfterLoad, timeout, headers, proxyUrl, selectors, simpleHtml } }
Response: { html, metadata }
```

### Links Map (for broken link audits)
```
POST /scrape/links-map?url={url}
Body: { includeExternal?: boolean, maxLinks?: 100, getStatusCode?: boolean, autoScrapeInternalLinks?: boolean }
Response: { total, healthy, broken, links[] }
```

## URL Utilities

### Check Alive
```
GET /url/is-alive?url={url}&timeout=10000
Response: { alive: boolean, avgResponseTime, method }
```

### Resolve Redirects
```
GET /url/get-url-after-redirects?url={url}
Response: Final URL string
```

## Convert to Markdown

```
POST /convert/markdown
Body: { url: string, options?: { model, instructions, delayAfterLoad } }
Response: { markdown, model, tokenUsage }
```

## Use Cases

| Task | Endpoint |
|------|----------|
| Content audit | `/extract` with SEO jsonTemplate |
| Broken links | `/scrape/links-map` with getStatusCode |
| Redirect chains | `/url/get-url-after-redirects` |
| Competitor content | `/summarize/website` |
| Page health | `/url/is-alive` |
