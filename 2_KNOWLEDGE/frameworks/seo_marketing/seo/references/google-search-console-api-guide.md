# Google Search Console API Guide

## Quick Start (ClaudeKit Scripts)

ClaudeKit provides cross-platform scripts for GSC integration. Use these for most tasks:

```bash
# Setup (one-time)
node scripts/gsc-auth.cjs --auth

# Query data
node scripts/gsc-query.cjs --sites
node scripts/gsc-query.cjs --top-queries -s https://example.com
node scripts/gsc-query.cjs --low-ctr -s https://example.com -o report.csv -f csv
node scripts/gsc-query.cjs --inspect -s https://example.com -u /page
```

**Config location:** `.opencode/secrets/google_client_secret.json` (project) or `~/.opencode/secrets/` (global)

---

## API Endpoints

**Base URLs:**
- Search Analytics, Sitemaps, Sites: `https://www.googleapis.com/webmasters/v3`
- URL Inspection: `https://searchconsole.googleapis.com/v1`

| Resource | Method | Endpoint |
|----------|--------|----------|
| **Search Analytics** | POST | `/sites/{siteUrl}/searchAnalytics/query` |
| **Sitemaps** | GET | `/sites/{siteUrl}/sitemaps` |
| | GET | `/sites/{siteUrl}/sitemaps/{feedpath}` |
| | PUT | `/sites/{siteUrl}/sitemaps/{feedpath}` |
| | DELETE | `/sites/{siteUrl}/sitemaps/{feedpath}` |
| **Sites** | GET | `/sites` |
| | GET | `/sites/{siteUrl}` |
| | PUT | `/sites/{siteUrl}` |
| | DELETE | `/sites/{siteUrl}` |
| **URL Inspection** | POST | `/urlInspection/index:inspect` |

**Site URL formats:**
- URL-prefix: `https://www.example.com/` (include trailing slash)
- Domain property: `sc-domain:example.com` (no protocol)

**Authorization Scopes:**
- `https://www.googleapis.com/auth/webmasters.readonly` - Read-only access
- `https://www.googleapis.com/auth/webmasters` - Full read/write access

---

## Request/Response Schemas

### Search Analytics Query

**Request Body:**
```json
{
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "dimensions": ["query", "page", "country", "device", "date", "searchAppearance"],
  "type": "web|news|image|video|googleNews|discover",
  "dimensionFilterGroups": [{
    "groupType": "and",
    "filters": [{
      "dimension": "query|page|country|device|searchAppearance",
      "operator": "equals|contains|notEquals|notContains|includingRegex|excludingRegex",
      "expression": "string"
    }]
  }],
  "aggregationType": "auto|byPage|byProperty|byNewsShowcasePanel",
  "rowLimit": 1000,
  "startRow": 0,
  "dataState": "final|all|hourly_all"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `startDate` | string | Required. YYYY-MM-DD format, PT timezone |
| `endDate` | string | Required. YYYY-MM-DD format, PT timezone |
| `dimensions` | array | Group by: query, page, country, device, date, searchAppearance |
| `type` | string | web (default), news, image, video, googleNews, discover |
| `rowLimit` | int | 1-25000, default 1000 |
| `startRow` | int | Zero-based offset for pagination |
| `dataState` | string | final (default), all (fresh data), hourly_all |

**Filter Operators:** equals, contains, notEquals, notContains, includingRegex, excludingRegex

**Response Body:**
```json
{
  "rows": [{
    "keys": ["dimension1", "dimension2"],
    "clicks": 100,
    "impressions": 5000,
    "ctr": 0.02,
    "position": 8.5
  }],
  "responseAggregationType": "auto|byPage|byProperty",
  "metadata": {
    "first_incomplete_date": "YYYY-MM-DD",
    "first_incomplete_hour": "ISO-8601 timestamp"
  }
}
```

### URL Inspection

**Request Body:**
```json
{
  "inspectionUrl": "https://example.com/page",
  "siteUrl": "https://example.com/",
  "languageCode": "en-US"
}
```

**Response (UrlInspectionResult):**
```json
{
  "inspectionResultLink": "string",
  "indexStatusResult": { /* IndexStatusInspectionResult */ },
  "ampResult": { /* AmpInspectionResult */ },
  "mobileUsabilityResult": { /* deprecated */ },
  "richResultsResult": { /* RichResultsInspectionResult */ }
}
```

**IndexStatusInspectionResult:**
```json
{
  "verdict": "PASS|PARTIAL|FAIL|NEUTRAL",
  "coverageState": "string",
  "robotsTxtState": "ALLOWED|DISALLOWED",
  "indexingState": "INDEXING_ALLOWED|BLOCKED_BY_META_TAG|BLOCKED_BY_HTTP_HEADER|BLOCKED_BY_ROBOTS_TXT",
  "lastCrawlTime": "RFC3339 timestamp",
  "pageFetchState": "SUCCESSFUL|SOFT_404|BLOCKED_ROBOTS_TXT|NOT_FOUND|ACCESS_DENIED|SERVER_ERROR|REDIRECT_ERROR|ACCESS_FORBIDDEN|BLOCKED_4XX",
  "googleCanonical": "string",
  "userCanonical": "string",
  "crawledAs": "DESKTOP|MOBILE",
  "sitemap": ["string"],
  "referringUrls": ["string"]
}
```

**AmpInspectionResult:**
```json
{
  "verdict": "PASS|PARTIAL|FAIL|NEUTRAL",
  "ampUrl": "string",
  "robotsTxtState": "ALLOWED|DISALLOWED",
  "indexingState": "AMP_INDEXING_ALLOWED|BLOCKED_DUE_TO_NOINDEX|BLOCKED_DUE_TO_EXPIRED_UNAVAILABLE_AFTER",
  "ampIndexStatusVerdict": "PASS|FAIL",
  "lastCrawlTime": "RFC3339 timestamp",
  "pageFetchState": "SUCCESSFUL|...",
  "issues": [{"issueMessage": "string", "severity": "WARNING|ERROR"}]
}
```

**RichResultsInspectionResult:**
```json
{
  "verdict": "PASS|PARTIAL|FAIL",
  "detectedItems": [{
    "richResultType": "string",
    "items": [{
      "name": "string",
      "issues": [{"issueMessage": "string", "severity": "WARNING|ERROR"}]
    }]
  }]
}
```

### Sitemaps Resource
```json
{
  "path": "https://example.com/sitemap.xml",
  "lastSubmitted": "RFC3339 timestamp",
  "lastDownloaded": "RFC3339 timestamp",
  "isPending": false,
  "isSitemapsIndex": false,
  "type": "sitemap|rssFeed|atomFeed|urlList|patternSitemap|notSitemap",
  "warnings": 0,
  "errors": 0,
  "contents": [{
    "type": "web|image|video|news|mobile|androidApp|iosApp|pattern",
    "submitted": 100,
    "indexed": 95
  }]
}
```

### Sites Resource
```json
{
  "siteUrl": "https://example.com/",
  "permissionLevel": "siteOwner|siteFullUser|siteRestrictedUser|siteUnverifiedUser"
}
```

| Permission | Description |
|------------|-------------|
| siteOwner | Full access, can add/remove users |
| siteFullUser | Full access to data |
| siteRestrictedUser | Limited data access |
| siteUnverifiedUser | Not verified |

---

## Authentication Setup

### OAuth2 Flow

**Prerequisites**:
- Google Cloud Project with Search Console API enabled
- Search Console property ownership verified
- OAuth 2.0 credentials (Desktop app type)

**Step 1: Create OAuth Credentials**
```
1. Go to Google Cloud Console: console.cloud.google.com
2. Create/select project
3. Enable Search Console API: APIs & Services > Library > Search "Search Console API"
4. Create credentials: APIs & Services > Credentials > Create Credentials > OAuth client ID
5. OAuth consent screen: Configure app name, scopes (webmasters.readonly)
6. Application type: Desktop app
7. Download JSON → rename to google_client_secret.json
8. Place in .opencode/secrets/ (project scope) or ~/.opencode/secrets/ (global)
```

**Step 2: Install Google API Client**
```bash
npm install googleapis
```

**Step 3: Authenticate with ClaudeKit Script**
```bash
node scripts/gsc-auth.cjs --auth        # Auto mode (opens browser)
node scripts/gsc-auth.cjs --auth --manual  # Manual code entry
node scripts/gsc-auth.cjs --verify      # Check token validity
```

### Manual Authentication Code (Node.js)
```javascript
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Load client secrets
const credentials = JSON.parse(
  fs.readFileSync('google_client_secret.json', 'utf8')
);

const { client_id, client_secret, redirect_uris } = credentials.installed || credentials.web;

// Create OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

// Generate auth URL
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/webmasters.readonly'],
});

console.log('Authorize this app by visiting:', authUrl);

// After user grants permission, exchange code for token
async function getToken(code) {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  // Save tokens for future use
  fs.writeFileSync('token.json', JSON.stringify(tokens));
  return oauth2Client;
}

// Load saved token
function loadToken() {
  const token = JSON.parse(fs.readFileSync('token.json', 'utf8'));
  oauth2Client.setCredentials(token);
  return oauth2Client;
}
```

### Service Account (Automated Access)

**Step 1: Create Service Account**
```
1. Google Cloud Console > IAM & Admin > Service Accounts
2. Create service account
3. Grant "Search Console API User" role
4. Create JSON key
5. Download service-account-key.json
```

**Step 2: Grant Search Console Access**
```
1. Open Search Console: search.google.com/search-console
2. Settings > Users and permissions
3. Add service account email as user
4. Grant "Full" or "Restricted" permission
```

**Step 3: Service Account Auth Code**
```javascript
const { google } = require('googleapis');

const auth = new google.auth.GoogleAuth({
  keyFile: 'service-account-key.json',
  scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
});

const searchconsole = google.searchconsole({
  version: 'v1',
  auth: auth,
});
```

## Available Endpoints

### 1. Sites Endpoint

**List Sites**
```javascript
async function listSites(auth) {
  const searchconsole = google.searchconsole({ version: 'v1', auth });

  const res = await searchconsole.sites.list();
  console.log('Sites:', res.data.siteEntry);
  return res.data.siteEntry;
}
```

**Get Site Details**
```javascript
async function getSiteDetails(auth, siteUrl) {
  const searchconsole = google.searchconsole({ version: 'v1', auth });

  const res = await searchconsole.sites.get({
    siteUrl: siteUrl,
  });

  console.log('Verification status:', res.data.permissionLevel);
  return res.data;
}
```

### 2. Search Analytics Endpoint

**Query Performance Data**
```javascript
async function querySearchAnalytics(auth, siteUrl, startDate, endDate) {
  const searchconsole = google.searchconsole({ version: 'v1', auth });

  const res = await searchconsole.searchanalytics.query({
    siteUrl: siteUrl,
    requestBody: {
      startDate: startDate,    // 'YYYY-MM-DD'
      endDate: endDate,        // 'YYYY-MM-DD'
      dimensions: ['query', 'page', 'country', 'device'],
      rowLimit: 25000,
      startRow: 0,
    },
  });

  return res.data.rows || [];
}
```

### 3. URL Inspection Endpoint

**Inspect URL**
```javascript
async function inspectUrl(auth, siteUrl, inspectionUrl) {
  const searchconsole = google.searchconsole({ version: 'v1', auth });

  const res = await searchconsole.urlInspection.index.inspect({
    requestBody: {
      inspectionUrl: inspectionUrl,
      siteUrl: siteUrl,
    },
  });

  return res.data.inspectionResult;
}
```

### 4. Sitemaps Endpoint

**List Sitemaps**
```javascript
async function listSitemaps(auth, siteUrl) {
  const searchconsole = google.searchconsole({ version: 'v1', auth });

  const res = await searchconsole.sitemaps.list({
    siteUrl: siteUrl,
  });

  return res.data.sitemap || [];
}
```

**Submit Sitemap**
```javascript
async function submitSitemap(auth, siteUrl, feedpath) {
  const searchconsole = google.searchconsole({ version: 'v1', auth });

  await searchconsole.sitemaps.submit({
    siteUrl: siteUrl,
    feedpath: feedpath,  // e.g., 'sitemap.xml'
  });

  console.log('Sitemap submitted successfully');
}
```

**Delete Sitemap**
```javascript
async function deleteSitemap(auth, siteUrl, feedpath) {
  const searchconsole = google.searchconsole({ version: 'v1', auth });

  await searchconsole.sitemaps.delete({
    siteUrl: siteUrl,
    feedpath: feedpath,
  });

  console.log('Sitemap deleted');
}
```

## Query Patterns for Performance Data

### Dimensions Available
- `query`: Search query
- `page`: Landing page URL
- `country`: User country (ISO code)
- `device`: DESKTOP, MOBILE, TABLET
- `date`: Date of search (YYYY-MM-DD)
- `searchAppearance`: How result appeared (WEB, IMAGE, VIDEO, etc.)

### Metrics Available
- `clicks`: Number of clicks
- `impressions`: Number of impressions
- `ctr`: Click-through rate (clicks/impressions)
- `position`: Average position in search results

### Basic Query Examples

**Top Queries by Clicks**
```javascript
async function getTopQueries(auth, siteUrl, days = 30) {
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    .toISOString().split('T')[0];

  const searchconsole = google.searchconsole({ version: 'v1', auth });

  const res = await searchconsole.searchanalytics.query({
    siteUrl: siteUrl,
    requestBody: {
      startDate: startDate,
      endDate: endDate,
      dimensions: ['query'],
      rowLimit: 100,
      dimensionFilterGroups: [{
        filters: [{
          dimension: 'query',
          operator: 'notContains',
          expression: 'brand-name',  // Filter out branded queries
        }],
      }],
    },
  });

  return res.data.rows.sort((a, b) => b.clicks - a.clicks);
}
```

**Page Performance**
```javascript
async function getPagePerformance(auth, siteUrl, pageUrl) {
  const searchconsole = google.searchconsole({ version: 'v1', auth });

  const res = await searchconsole.searchanalytics.query({
    siteUrl: siteUrl,
    requestBody: {
      startDate: '2024-11-01',
      endDate: '2024-12-01',
      dimensions: ['query'],
      dimensionFilterGroups: [{
        filters: [{
          dimension: 'page',
          operator: 'equals',
          expression: pageUrl,
        }],
      }],
      rowLimit: 1000,
    },
  });

  return res.data.rows || [];
}
```

**Device Breakdown**
```javascript
async function getDeviceBreakdown(auth, siteUrl, startDate, endDate) {
  const searchconsole = google.searchconsole({ version: 'v1', auth });

  const res = await searchconsole.searchanalytics.query({
    siteUrl: siteUrl,
    requestBody: {
      startDate: startDate,
      endDate: endDate,
      dimensions: ['device'],
    },
  });

  return res.data.rows || [];
}
```

**Country Performance**
```javascript
async function getCountryPerformance(auth, siteUrl) {
  const searchconsole = google.searchconsole({ version: 'v1', auth });

  const res = await searchconsole.searchanalytics.query({
    siteUrl: siteUrl,
    requestBody: {
      startDate: '2024-11-01',
      endDate: '2024-12-01',
      dimensions: ['country'],
      rowLimit: 50,
    },
  });

  return res.data.rows
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10);
}
```

## Rate Limits and Quotas

### Search Analytics
| Scope | Limit |
|-------|-------|
| Per-site | 1,200 QPM (queries/minute) |
| Per-user | 1,200 QPM |
| Per-project | 30M QPD (queries/day), 40k QPM |
| Row limit | 25,000 per query |
| Date range | Max 16 months |

### URL Inspection
| Scope | Limit |
|-------|-------|
| Per-site | 2,000 QPD, 600 QPM |
| Per-project | 10M QPD, 15k QPM |

### Sites & Sitemaps
| Scope | Limit |
|-------|-------|
| Per-user | 20 QPS, 200 QPM |
| Per-project | 100M QPD |

**Load Quota:** Query cost based on date range + dimensions. Page+query grouping most expensive.

### Best Practices
- Implement exponential backoff for 429/503 errors
- Verify data exists before querying (run filter-less query first)
- Avoid large date ranges with page+query dimensions
- Cache responses when possible
- Use `startRow` for pagination (>25k rows)
- Use `fields` param to request only needed data

**Pagination Example**
```javascript
async function getAllRows(auth, siteUrl, requestBody) {
  const searchconsole = google.searchconsole({ version: 'v1', auth });
  let allRows = [];
  let startRow = 0;
  const rowLimit = 25000;

  while (true) {
    const res = await searchconsole.searchanalytics.query({
      siteUrl: siteUrl,
      requestBody: {
        ...requestBody,
        rowLimit: rowLimit,
        startRow: startRow,
      },
    });

    const rows = res.data.rows || [];
    if (rows.length === 0) break;

    allRows = allRows.concat(rows);

    if (rows.length < rowLimit) break;
    startRow += rowLimit;
  }

  return allRows;
}
```

**Rate Limit Handling**
```javascript
async function queryWithRetry(searchconsole, params, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await searchconsole.searchanalytics.query(params);
      return res.data;
    } catch (error) {
      if (error.code === 429) {  // Rate limit exceeded
        const waitTime = Math.pow(2, i) * 1000;  // Exponential backoff
        console.log(`Rate limit hit, waiting ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else {
        throw error;
      }
    }
  }
  throw new Error('Max retries exceeded');
}
```

## Complete Working Example

```javascript
const { google } = require('googleapis');
const fs = require('fs');

class SearchConsoleClient {
  constructor(keyFilePath) {
    this.auth = new google.auth.GoogleAuth({
      keyFile: keyFilePath,
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    });
    this.searchconsole = google.searchconsole({ version: 'v1', auth: this.auth });
  }

  async getTopQueries(siteUrl, days = 30) {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      .toISOString().split('T')[0];

    const res = await this.searchconsole.searchanalytics.query({
      siteUrl: siteUrl,
      requestBody: {
        startDate: startDate,
        endDate: endDate,
        dimensions: ['query'],
        rowLimit: 100,
      },
    });

    return res.data.rows || [];
  }

  async getLowCTRPages(siteUrl, minImpressions = 100) {
    const res = await this.searchconsole.searchanalytics.query({
      siteUrl: siteUrl,
      requestBody: {
        startDate: '2024-11-01',
        endDate: '2024-12-01',
        dimensions: ['page'],
        rowLimit: 1000,
      },
    });

    const rows = res.data.rows || [];
    return rows
      .filter(row => row.impressions >= minImpressions && row.ctr < 0.02)
      .sort((a, b) => b.impressions - a.impressions);
  }

  async inspectUrl(siteUrl, inspectionUrl) {
    const res = await this.searchconsole.urlInspection.index.inspect({
      requestBody: {
        inspectionUrl: inspectionUrl,
        siteUrl: siteUrl,
      },
    });

    return res.data.inspectionResult;
  }

  async exportToCSV(data, filename) {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    const csv = [headers, ...rows].join('\n');

    fs.writeFileSync(filename, csv);
    console.log(`Exported to ${filename}`);
  }
}

// Usage
async function main() {
  const client = new SearchConsoleClient('service-account-key.json');
  const siteUrl = 'https://example.com/';

  // Get top queries
  const topQueries = await client.getTopQueries(siteUrl, 30);
  console.log('Top Queries:', topQueries.slice(0, 10));

  // Find low CTR pages
  const lowCTR = await client.getLowCTRPages(siteUrl, 100);
  console.log('Low CTR Pages:', lowCTR.slice(0, 10));

  // Export to CSV
  await client.exportToCSV(topQueries, 'top-queries.csv');
}

main().catch(console.error);
```

## Error Handling

```javascript
async function safeQuery(searchconsole, params) {
  try {
    const res = await searchconsole.searchanalytics.query(params);
    return { success: true, data: res.data };
  } catch (error) {
    console.error('Error querying Search Console:', error.message);

    if (error.code === 401) {
      return { success: false, error: 'Authentication failed. Check credentials.' };
    } else if (error.code === 403) {
      return { success: false, error: 'Permission denied. Check site access.' };
    } else if (error.code === 429) {
      return { success: false, error: 'Rate limit exceeded. Retry later.' };
    } else {
      return { success: false, error: error.message };
    }
  }
}
```
