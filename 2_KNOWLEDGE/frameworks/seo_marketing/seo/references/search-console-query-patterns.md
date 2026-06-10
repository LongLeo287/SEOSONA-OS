# Search Console Query Patterns

## Common Query Patterns

### 1. Top Queries by Clicks

**Use Case**: Identify highest-converting keywords

```javascript
async function getTopQueriesByClicks(searchconsole, siteUrl, days = 30) {
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    .toISOString().split('T')[0];

  const res = await searchconsole.searchanalytics.query({
    siteUrl: siteUrl,
    requestBody: {
      startDate: startDate,
      endDate: endDate,
      dimensions: ['query'],
      rowLimit: 100,
    },
  });

  return (res.data.rows || [])
    .sort((a, b) => b.clicks - a.clicks);
}
```

**Filters**: Exclude branded queries
```javascript
dimensionFilterGroups: [{
  filters: [{
    dimension: 'query',
    operator: 'notContains',
    expression: 'brandname',
  }],
}]
```

### 2. High Impressions, Low CTR

**Use Case**: Find optimization opportunities (meta titles/descriptions)

```javascript
async function getLowCTRQueries(searchconsole, siteUrl, minImpressions = 100, maxCTR = 0.02) {
  const res = await searchconsole.searchanalytics.query({
    siteUrl: siteUrl,
    requestBody: {
      startDate: '2024-11-01',
      endDate: '2024-12-01',
      dimensions: ['query', 'page'],
      rowLimit: 1000,
    },
  });

  return (res.data.rows || [])
    .filter(row => row.impressions >= minImpressions && row.ctr < maxCTR)
    .sort((a, b) => b.impressions - a.impressions);
}
```

**Analysis Output**:
```javascript
// Example result
{
  keys: ['keyword example', '/page-url'],
  clicks: 5,
  impressions: 1000,
  ctr: 0.005,  // 0.5% - very low!
  position: 8.5
}
```

### 3. Position Trending Queries

**Use Case**: Track ranking changes over time

```javascript
async function getPositionTrends(searchconsole, siteUrl, query, days = 90) {
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    .toISOString().split('T')[0];

  const res = await searchconsole.searchanalytics.query({
    siteUrl: siteUrl,
    requestBody: {
      startDate: startDate,
      endDate: endDate,
      dimensions: ['date'],
      dimensionFilterGroups: [{
        filters: [{
          dimension: 'query',
          operator: 'equals',
          expression: query,
        }],
      }],
    },
  });

  return (res.data.rows || [])
    .map(row => ({
      date: row.keys[0],
      position: row.position,
      clicks: row.clicks,
      impressions: row.impressions,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
```

**Trend Analysis**:
```javascript
function analyzeTrend(data) {
  const positions = data.map(d => d.position);
  const avg = positions.reduce((a, b) => a + b, 0) / positions.length;
  const recent = positions.slice(-7).reduce((a, b) => a + b, 0) / 7;
  const older = positions.slice(0, 7).reduce((a, b) => a + b, 0) / 7;

  return {
    average: avg.toFixed(2),
    recentAvg: recent.toFixed(2),
    trend: recent < older ? 'improving' : 'declining',
    change: (older - recent).toFixed(2),
  };
}
```

### 4. Mobile vs Desktop Performance

**Use Case**: Identify mobile optimization needs

```javascript
async function getDeviceComparison(searchconsole, siteUrl, startDate, endDate) {
  const res = await searchconsole.searchanalytics.query({
    siteUrl: siteUrl,
    requestBody: {
      startDate: startDate,
      endDate: endDate,
      dimensions: ['device', 'query'],
      rowLimit: 5000,
    },
  });

  const rows = res.data.rows || [];

  const deviceData = {
    MOBILE: { clicks: 0, impressions: 0, queries: [] },
    DESKTOP: { clicks: 0, impressions: 0, queries: [] },
    TABLET: { clicks: 0, impressions: 0, queries: [] },
  };

  rows.forEach(row => {
    const device = row.keys[0];
    deviceData[device].clicks += row.clicks;
    deviceData[device].impressions += row.impressions;
    deviceData[device].queries.push({
      query: row.keys[1],
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr,
      position: row.position,
    });
  });

  Object.keys(deviceData).forEach(device => {
    const data = deviceData[device];
    data.avgCTR = data.clicks / data.impressions;
    data.topQueries = data.queries
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);
  });

  return deviceData;
}
```

### 5. Country-Specific Data

**Use Case**: International SEO analysis

```javascript
async function getCountryPerformance(searchconsole, siteUrl) {
  const res = await searchconsole.searchanalytics.query({
    siteUrl: siteUrl,
    requestBody: {
      startDate: '2024-11-01',
      endDate: '2024-12-01',
      dimensions: ['country'],
      rowLimit: 100,
    },
  });

  return (res.data.rows || [])
    .map(row => ({
      country: row.keys[0],
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr,
      position: row.position,
    }))
    .sort((a, b) => b.clicks - a.clicks);
}
```

**Filter by Country**:
```javascript
dimensionFilterGroups: [{
  filters: [{
    dimension: 'country',
    operator: 'equals',
    expression: 'USA',  // ISO 3-letter country code
  }],
}]
```

### 6. Date Range Comparisons

**Use Case**: Period-over-period analysis

```javascript
async function compareDateRanges(searchconsole, siteUrl) {
  // Current period (last 30 days)
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString().split('T')[0];

  // Previous period (30 days before that)
  const prevEndDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString().split('T')[0];
  const prevStartDate = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
    .toISOString().split('T')[0];

  const [current, previous] = await Promise.all([
    searchconsole.searchanalytics.query({
      siteUrl: siteUrl,
      requestBody: {
        startDate: startDate,
        endDate: endDate,
        dimensions: ['query'],
        rowLimit: 1000,
      },
    }),
    searchconsole.searchanalytics.query({
      siteUrl: siteUrl,
      requestBody: {
        startDate: prevStartDate,
        endDate: prevEndDate,
        dimensions: ['query'],
        rowLimit: 1000,
      },
    }),
  ]);

  return analyzeGrowth(current.data.rows, previous.data.rows);
}

function analyzeGrowth(currentRows, previousRows) {
  const prevMap = new Map(
    previousRows.map(row => [row.keys[0], row])
  );

  return currentRows.map(row => {
    const query = row.keys[0];
    const prev = prevMap.get(query);

    if (!prev) {
      return {
        query,
        current: row,
        growth: 'new',
        clickGrowth: row.clicks,
        impressionGrowth: row.impressions,
      };
    }

    return {
      query,
      current: row,
      previous: prev,
      clickGrowth: row.clicks - prev.clicks,
      clickGrowthPct: ((row.clicks - prev.clicks) / prev.clicks * 100).toFixed(2),
      impressionGrowth: row.impressions - prev.impressions,
      positionChange: prev.position - row.position,  // Positive = improved
    };
  });
}
```

## Advanced Filter Examples

### Multiple Filters (AND Logic)

```javascript
dimensionFilterGroups: [{
  filters: [
    {
      dimension: 'country',
      operator: 'equals',
      expression: 'USA',
    },
    {
      dimension: 'device',
      operator: 'equals',
      expression: 'MOBILE',
    },
  ],
}]
```

### Multiple Filter Groups (OR Logic)

```javascript
dimensionFilterGroups: [
  {
    filters: [{
      dimension: 'country',
      operator: 'equals',
      expression: 'USA',
    }],
  },
  {
    filters: [{
      dimension: 'country',
      operator: 'equals',
      expression: 'GBR',
    }],
  },
]
```

### Contains / Not Contains

```javascript
// Find queries containing specific keyword
{
  dimension: 'query',
  operator: 'contains',
  expression: 'seo tools',
}

// Exclude branded queries
{
  dimension: 'query',
  operator: 'notContains',
  expression: 'brand name',
}
```

### Page URL Filters

```javascript
// Specific page
{
  dimension: 'page',
  operator: 'equals',
  expression: 'https://example.com/blog/post-title',
}

// All blog posts
{
  dimension: 'page',
  operator: 'contains',
  expression: '/blog/',
}

// Exclude specific section
{
  dimension: 'page',
  operator: 'notContains',
  expression: '/docs/',
}
```

## Aggregation Type

**Total vs Web vs Image**

```javascript
requestBody: {
  startDate: '2024-11-01',
  endDate: '2024-12-01',
  dimensions: ['query'],
  type: 'web',  // Options: 'web', 'image', 'video', 'news'
}
```

## Search Appearance Dimension

**Track rich result appearances**

```javascript
async function getRichResultPerformance(searchconsole, siteUrl) {
  const res = await searchconsole.searchanalytics.query({
    siteUrl: siteUrl,
    requestBody: {
      startDate: '2024-11-01',
      endDate: '2024-12-01',
      dimensions: ['searchAppearance'],
    },
  });

  return res.data.rows || [];
}

// Search appearance types:
// - RICHCARD
// - VIDEO
// - AMP_BLUE_LINK
// - JOB_LISTING
// - RECIPE
// - EVENT
// etc.
```

## Practical Use Cases

### Use Case 1: Content Gap Analysis

**Find queries with impressions but no clicks**

```javascript
async function findContentGaps(searchconsole, siteUrl) {
  const res = await searchconsole.searchanalytics.query({
    siteUrl: siteUrl,
    requestBody: {
      startDate: '2024-11-01',
      endDate: '2024-12-01',
      dimensions: ['query'],
      rowLimit: 5000,
    },
  });

  return (res.data.rows || [])
    .filter(row => row.impressions > 50 && row.clicks === 0)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 100);
}
```

### Use Case 2: Page Cannibalization Detection

**Find queries ranking for multiple pages**

```javascript
async function detectCannibalization(searchconsole, siteUrl) {
  const res = await searchconsole.searchanalytics.query({
    siteUrl: siteUrl,
    requestBody: {
      startDate: '2024-11-01',
      endDate: '2024-12-01',
      dimensions: ['query', 'page'],
      rowLimit: 25000,
    },
  });

  const queryPageMap = {};

  (res.data.rows || []).forEach(row => {
    const query = row.keys[0];
    const page = row.keys[1];

    if (!queryPageMap[query]) {
      queryPageMap[query] = [];
    }

    queryPageMap[query].push({
      page,
      clicks: row.clicks,
      impressions: row.impressions,
      position: row.position,
    });
  });

  // Find queries with multiple ranking pages
  return Object.entries(queryPageMap)
    .filter(([query, pages]) => pages.length > 1)
    .map(([query, pages]) => ({
      query,
      pageCount: pages.length,
      pages: pages.sort((a, b) => a.position - b.position),
      totalClicks: pages.reduce((sum, p) => sum + p.clicks, 0),
    }))
    .sort((a, b) => b.totalClicks - a.totalClicks);
}
```

### Use Case 3: Featured Snippet Opportunities

**Find position 2-5 rankings (snippet opportunity)**

```javascript
async function findSnippetOpportunities(searchconsole, siteUrl) {
  const res = await searchconsole.searchanalytics.query({
    siteUrl: siteUrl,
    requestBody: {
      startDate: '2024-11-01',
      endDate: '2024-12-01',
      dimensions: ['query', 'page'],
      rowLimit: 5000,
    },
  });

  return (res.data.rows || [])
    .filter(row => {
      return row.position >= 2 &&
             row.position <= 5 &&
             row.impressions > 100;
    })
    .map(row => ({
      query: row.keys[0],
      page: row.keys[1],
      position: row.position,
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr,
    }))
    .sort((a, b) => b.impressions - a.impressions);
}
```

### Use Case 4: Seasonal Trend Analysis

**Compare same period year-over-year**

```javascript
async function getYearOverYear(searchconsole, siteUrl) {
  const thisYear = {
    startDate: '2024-11-01',
    endDate: '2024-12-01',
  };

  const lastYear = {
    startDate: '2023-11-01',
    endDate: '2023-12-01',
  };

  const [current, previous] = await Promise.all([
    searchconsole.searchanalytics.query({
      siteUrl: siteUrl,
      requestBody: {
        ...thisYear,
        dimensions: ['query'],
        rowLimit: 1000,
      },
    }),
    searchconsole.searchanalytics.query({
      siteUrl: siteUrl,
      requestBody: {
        ...lastYear,
        dimensions: ['query'],
        rowLimit: 1000,
      },
    }),
  ]);

  return compareYearOverYear(current.data.rows, previous.data.rows);
}

function compareYearOverYear(current, previous) {
  const prevMap = new Map(previous.map(row => [row.keys[0], row]));

  return current
    .map(row => {
      const query = row.keys[0];
      const prev = prevMap.get(query);

      if (!prev) return null;

      return {
        query,
        currentClicks: row.clicks,
        previousClicks: prev.clicks,
        yoyGrowth: ((row.clicks - prev.clicks) / prev.clicks * 100).toFixed(2),
        currentPosition: row.position,
        previousPosition: prev.position,
        positionChange: (prev.position - row.position).toFixed(2),
      };
    })
    .filter(Boolean)
    .sort((a, b) => parseFloat(b.yoyGrowth) - parseFloat(a.yoyGrowth));
}
```

## Export Helpers

```javascript
function exportToJSON(data, filename) {
  const fs = require('fs');
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
}

function exportToCSV(data, filename) {
  const fs = require('fs');
  if (data.length === 0) return;

  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row =>
    Object.values(row).map(v =>
      typeof v === 'string' && v.includes(',') ? `"${v}"` : v
    ).join(',')
  );

  fs.writeFileSync(filename, [headers, ...rows].join('\n'));
}
```
