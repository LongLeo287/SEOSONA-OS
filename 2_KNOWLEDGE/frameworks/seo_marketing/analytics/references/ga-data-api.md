# Google Analytics Data API v1 Reference

## Overview
Programmatic access to GA4 reporting data. **Only GA4 properties** (not Universal Analytics).

**Service:** `analyticsdata.googleapis.com`
**Package:** `npm install @google-analytics/data`

## Authentication

### Scope
- `https://www.googleapis.com/auth/analytics.readonly`

### Setup
```bash
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
```

## Quick Start

```javascript
const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const client = new BetaAnalyticsDataClient();

const [response] = await client.runReport({
  property: 'properties/GA4_PROPERTY_ID',
  dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
  dimensions: [{ name: 'country' }],
  metrics: [{ name: 'activeUsers' }]
});

response.rows.forEach(row => {
  console.log(row.dimensionValues[0].value, row.metricValues[0].value);
});
```

## Core Methods

### runReport
Standard report with dimensions and metrics.

```javascript
const [response] = await client.runReport({
  property: 'properties/123456789',
  dateRanges: [
    { startDate: '2024-01-01', endDate: '2024-01-31' }
  ],
  dimensions: [
    { name: 'country' },
    { name: 'city' }
  ],
  metrics: [
    { name: 'activeUsers' },
    { name: 'sessions' }
  ],
  dimensionFilter: {
    filter: {
      fieldName: 'country',
      stringFilter: { value: 'United States' }
    }
  },
  orderBys: [
    { metric: { metricName: 'activeUsers' }, desc: true }
  ],
  limit: 100
});
```

### batchRunReports
Multiple reports in single request.

```javascript
const [response] = await client.batchRunReports({
  property: 'properties/123456789',
  requests: [
    {
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'activeUsers' }]
    },
    {
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'country' }],
      metrics: [{ name: 'sessions' }]
    }
  ]
});

response.reports.forEach((report, i) => {
  console.log(`Report ${i + 1}: ${report.rowCount} rows`);
});
```

### runRealtimeReport
Real-time data (last 30 minutes).

```javascript
const [response] = await client.runRealtimeReport({
  property: 'properties/123456789',
  dimensions: [{ name: 'country' }],
  metrics: [{ name: 'activeUsers' }]
});
```

### runPivotReport
Pivot table format.

```javascript
const [response] = await client.runPivotReport({
  property: 'properties/123456789',
  dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
  dimensions: [{ name: 'country' }, { name: 'browser' }],
  metrics: [{ name: 'sessions' }],
  pivots: [
    {
      fieldNames: ['country'],
      limit: 5
    },
    {
      fieldNames: ['browser'],
      limit: 3
    }
  ]
});
```

### getMetadata
List available dimensions and metrics.

```javascript
const [metadata] = await client.getMetadata({
  name: 'properties/123456789/metadata'
});

metadata.dimensions.forEach(d => console.log(d.apiName, d.uiName));
metadata.metrics.forEach(m => console.log(m.apiName, m.uiName));
```

### checkCompatibility
Verify dimension/metric combinations.

```javascript
const [compat] = await client.checkCompatibility({
  property: 'properties/123456789',
  dimensions: [{ name: 'country' }],
  metrics: [{ name: 'sessions' }]
});

console.log('Compatible:', compat.dimensionCompatibilities);
```

## Date Ranges

```javascript
// Absolute dates
{ startDate: '2024-01-01', endDate: '2024-12-31' }

// Relative dates
{ startDate: '7daysAgo', endDate: 'today' }
{ startDate: '30daysAgo', endDate: 'yesterday' }

// Compare periods (YoY)
dateRanges: [
  { startDate: '2024-01-01', endDate: '2024-01-31' },
  { startDate: '2023-01-01', endDate: '2023-01-31' }
]
```

## Filters

### Dimension Filters
```javascript
// String filter
dimensionFilter: {
  filter: {
    fieldName: 'country',
    stringFilter: {
      value: 'United States',
      matchType: 'EXACT' // EXACT, BEGINS_WITH, ENDS_WITH, CONTAINS, PARTIAL_REGEXP, FULL_REGEXP
    }
  }
}

// In-list filter
dimensionFilter: {
  filter: {
    fieldName: 'country',
    inListFilter: { values: ['United States', 'Canada', 'Mexico'] }
  }
}

// AND group
dimensionFilter: {
  andGroup: {
    expressions: [
      { filter: { fieldName: 'country', stringFilter: { value: 'United States' } } },
      { filter: { fieldName: 'city', stringFilter: { value: 'New York' } } }
    ]
  }
}

// OR group
dimensionFilter: {
  orGroup: {
    expressions: [
      { filter: { fieldName: 'country', stringFilter: { value: 'United States' } } },
      { filter: { fieldName: 'country', stringFilter: { value: 'Canada' } } }
    ]
  }
}

// NOT expression
dimensionFilter: {
  notExpression: {
    filter: { fieldName: 'country', stringFilter: { value: 'United States' } }
  }
}
```

### Metric Filters
```javascript
metricFilter: {
  filter: {
    fieldName: 'sessions',
    numericFilter: {
      operation: 'GREATER_THAN', // EQUAL, LESS_THAN, GREATER_THAN, etc.
      value: { int64Value: 100 }
    }
  }
}
```

## Common Dimensions

| Category | Dimensions |
|----------|------------|
| User | `userAgeBracket`, `userGender`, `newVsReturning` |
| Geo | `country`, `region`, `city`, `continent` |
| Tech | `browser`, `operatingSystem`, `deviceCategory`, `platform` |
| Time | `date`, `dateHour`, `hour`, `dayOfWeek`, `month`, `year` |
| Traffic | `source`, `medium`, `campaignName`, `channelGroup` |
| Content | `pagePath`, `pageTitle`, `landingPage`, `hostName` |
| Events | `eventName`, `eventCount` |
| Ecommerce | `itemName`, `itemCategory`, `itemBrand`, `transactionId` |
| Custom | `customEvent:param_name`, `customUser:param_name` |

## Common Metrics

| Category | Metrics |
|----------|---------|
| Users | `activeUsers`, `newUsers`, `totalUsers`, `active1DayUsers` |
| Sessions | `sessions`, `engagedSessions`, `engagementRate`, `bounceRate` |
| Events | `eventCount`, `eventCountPerUser`, `eventValue` |
| Engagement | `averageSessionDuration`, `screenPageViews`, `sessionsPerUser` |
| Ecommerce | `ecommercePurchases`, `purchaseRevenue`, `totalRevenue` |
| Conversions | `keyEvents`, `firstTimePurchasers` |
| Custom | `customEvent:param_name` |

## Pagination

```javascript
let offset = 0;
const limit = 100000;
let allRows = [];

while (true) {
  const [response] = await client.runReport({
    property: 'properties/123456789',
    dateRanges: [{ startDate: '365daysAgo', endDate: 'yesterday' }],
    dimensions: [{ name: 'pagePath' }],
    metrics: [{ name: 'screenPageViews' }],
    limit: limit,
    offset: offset
  });

  allRows.push(...response.rows);
  if (allRows.length >= response.rowCount) break;
  offset += limit;
}
```

## Response Structure

```javascript
{
  dimensionHeaders: [{ name: 'country' }],
  metricHeaders: [{ name: 'activeUsers', type: 'TYPE_INTEGER' }],
  rows: [
    {
      dimensionValues: [{ value: 'United States' }],
      metricValues: [{ value: '12345' }]
    }
  ],
  rowCount: 50,
  metadata: { currencyCode: 'USD', timeZone: 'America/New_York' },
  propertyQuota: {
    tokensPerDay: { consumed: 10, remaining: 49990 },
    tokensPerHour: { consumed: 1, remaining: 999 },
    tokensPerMinute: { consumed: 1, remaining: 59 },
    concurrentRequests: { consumed: 1, remaining: 9 }
  }
}
```

## Rate Limits

| Quota | Limit |
|-------|-------|
| Tokens/day | 50,000 |
| Tokens/hour | 1,000 |
| Tokens/minute | 60 |
| Concurrent requests | 10 |

**Token consumption:** ~10 tokens per simple query, 10-50+ for complex queries.

## Error Handling

```javascript
try {
  const [response] = await client.runReport(request);
} catch (error) {
  if (error.code === 3) { // INVALID_ARGUMENT
    console.log('Invalid dimension/metric combination');
    // Use checkCompatibility first
  } else if (error.code === 8) { // RESOURCE_EXHAUSTED
    // Implement exponential backoff
    await delay(Math.pow(2, retryCount) * 1000);
  } else if (error.code === 7) { // PERMISSION_DENIED
    console.log('Grant property access to service account');
  }
}
```

## Ordering

```javascript
orderBys: [
  // Order by metric descending
  { metric: { metricName: 'activeUsers' }, desc: true },

  // Order by dimension ascending
  { dimension: { dimensionName: 'country' }, desc: false }
]
```
