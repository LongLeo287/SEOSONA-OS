# Browser-Based SEO Audit Workflow

Real browser testing using `chrome-devtools` skill for accurate SEO analysis.

## Why Browser-Based Testing

- **Real CWV metrics** - Actual rendering, not simulated
- **Mobile-first indexing** - True mobile rendering
- **JavaScript SEO** - SPA/CSR content auditing
- **Visual verification** - Screenshots for layout issues

## Prerequisites

```bash
cd .opencode/skills/chrome-devtools/scripts && npm install
```

## Core Web Vitals Audit

### Single URL

```bash
# Measure vitals
node performance.js --url https://example.com | jq '.vitals'

# With trace for debugging
node performance.js --url https://example.com --trace trace.json
```

### Multi-Device Testing

```bash
# Desktop (default)
node navigate.js --url https://example.com
node performance.js --url https://example.com

# Mobile viewport
node evaluate.js --script "page.setViewport({width: 375, height: 812, isMobile: true})"
node performance.js --url https://example.com
```

## Network Analysis for SEO

### Detect Redirect Chains

```bash
node network.js --url https://example.com | jq '
  .requests[] | select(.response.status >= 300 and .response.status < 400)
  | {url, status: .response.status, location: .response.headers.location}
'
```

### Find Broken Resources (404s)

```bash
node network.js --url https://example.com | jq '
  .requests[] | select(.response.status == 404)
  | {url, referrer: .request.headers.referer}
'
```

### Identify Slow Resources

```bash
node network.js --url https://example.com | jq '
  .requests[] | select(.timing.total > 1000)
  | {url, duration: .timing.total, size: .response.size}
'
```

## Visual SEO Checks

### Full Page Screenshot

```bash
node screenshot.js --url https://example.com --full-page true \
  --output .opencode/chrome-devtools/screenshots/seo-audit.png
```

### Above-the-Fold Content

```bash
node screenshot.js --url https://example.com \
  --output .opencode/chrome-devtools/screenshots/atf.png
```

### Mobile Rendering

```bash
node evaluate.js --script "page.setViewport({width: 375, height: 812, isMobile: true})"
node screenshot.js --output .opencode/chrome-devtools/screenshots/mobile.png
```

## JavaScript SEO Checks

### Verify Rendered Content

```bash
# Get rendered HTML (after JS execution)
node evaluate.js --url https://example.com --script "document.documentElement.outerHTML" \
  | jq -r '.result' > rendered.html

# Compare with source HTML
curl -s https://example.com > source.html
diff source.html rendered.html
```

### Check Meta Tags Post-Render

```bash
node evaluate.js --url https://example.com --script "
  JSON.stringify({
    title: document.title,
    description: document.querySelector('meta[name=description]')?.content,
    canonical: document.querySelector('link[rel=canonical]')?.href,
    robots: document.querySelector('meta[name=robots]')?.content
  })
" | jq '.result | fromjson'
```

### Verify Structured Data

```bash
node evaluate.js --url https://example.com --script "
  Array.from(document.querySelectorAll('script[type=\"application/ld+json\"]'))
    .map(s => JSON.parse(s.textContent))
" | jq '.result'
```

## Session Workflow: Multi-Page Audit

```bash
# Start session
node navigate.js --url https://example.com

# Audit homepage
node performance.js | jq '.vitals' > vitals-home.json
node screenshot.js --output screenshots/home.png

# Navigate to key pages
node navigate.js --url https://example.com/about
node performance.js | jq '.vitals' > vitals-about.json

node navigate.js --url https://example.com/contact
node performance.js | jq '.vitals' > vitals-contact.json

# Close session
node navigate.js --url about:blank --close true
```

## Quick Audit Script

```bash
#!/bin/bash
URL=$1
SESSION=$(date +%Y%m%d-%H%M%S)
OUT=".opencode/chrome-devtools/seo-audits/$SESSION"
mkdir -p "$OUT"

cd .opencode/skills/chrome-devtools/scripts

# Performance
node performance.js --url "$URL" > "$OUT/vitals.json"

# Network
node network.js --url "$URL" > "$OUT/network.json"

# Screenshots
node screenshot.js --url "$URL" --output "$OUT/desktop.png"
node evaluate.js --script "page.setViewport({width: 375, height: 812, isMobile: true})"
node screenshot.js --output "$OUT/mobile.png"

# Console errors
node console.js --url "$URL" --types error --duration 5000 > "$OUT/errors.json"

# Close
node navigate.js --url about:blank --close true

echo "Audit saved: $OUT"
```
