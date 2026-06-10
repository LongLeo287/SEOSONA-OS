# Google Analytics Admin API v1 Reference

## Overview
Programmatic access to GA4 configuration. **Only GA4 properties** (not Universal Analytics).

**Service:** `analyticsadmin.googleapis.com`
**Package:** `npm install @google-analytics/admin`

## Authentication

### Scopes
- `https://www.googleapis.com/auth/analytics.edit` - Full access
- `https://www.googleapis.com/auth/analytics.readonly` - Read only

### Service Account Setup
```bash
# Set credentials path
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
```

## Quick Start

```javascript
const { AnalyticsAdminServiceClient } = require('@google-analytics/admin');
const client = new AnalyticsAdminServiceClient();

// List accounts
const [accounts] = await client.listAccounts();
accounts.forEach(a => console.log(a.name, a.displayName));

// List properties
const [properties] = await client.listProperties({
  filter: 'parent:accounts/123456789'
});
```

## Resource Hierarchy

```
accounts/{account_id}
├── properties/{property_id}
│   ├── dataStreams/{stream_id}
│   │   └── measurementProtocolSecrets/{secret_id}
│   ├── customDimensions/{dimension_id}
│   ├── customMetrics/{metric_id}
│   ├── keyEvents/{event_id}
│   ├── firebaseLinks/{link_id}
│   ├── googleAdsLinks/{link_id}
│   └── bigQueryLinks/{link_id}
└── accessBindings/{binding_id}
```

## Core Methods

### Accounts
```javascript
// List all accessible accounts
const [accounts] = await client.listAccounts();

// Get account details
const [account] = await client.getAccount({ name: 'accounts/123456789' });

// List account summaries (quick overview)
const [summaries] = await client.listAccountSummaries();
```

### Properties
```javascript
// List properties under account
const [properties] = await client.listProperties({
  filter: 'parent:accounts/123456789'
});

// Create property
const [property] = await client.createProperty({
  property: {
    displayName: 'My Property',
    timeZone: 'America/New_York',
    currencyCode: 'USD',
  },
  parent: 'accounts/123456789'
});

// Get property details
const [property] = await client.getProperty({ name: 'properties/987654321' });
```

### Data Streams
```javascript
// List data streams
const [streams] = await client.listDataStreams({
  parent: 'properties/987654321'
});

// Create web data stream
const [stream] = await client.createDataStream({
  parent: 'properties/987654321',
  dataStream: {
    displayName: 'My Website',
    type: 'WEB_DATA_STREAM',
    webStreamData: {
      defaultUri: 'https://example.com'
    }
  }
});
```

### Custom Dimensions
```javascript
// Create custom dimension
const [dimension] = await client.createCustomDimension({
  parent: 'properties/987654321',
  customDimension: {
    displayName: 'User Role',
    parameterName: 'user_role',
    scope: 'EVENT', // EVENT, USER, ITEM
    description: 'User role in application'
  }
});

// List custom dimensions
const [dimensions] = await client.listCustomDimensions({
  parent: 'properties/987654321'
});
```

### Custom Metrics
```javascript
// Create custom metric
const [metric] = await client.createCustomMetric({
  parent: 'properties/987654321',
  customMetric: {
    displayName: 'Revenue Per User',
    parameterName: 'revenue_per_user',
    scope: 'EVENT',
    measurementUnit: 'CURRENCY',
    description: 'Average revenue per user'
  }
});
```

### Key Events (Conversions)
```javascript
// Create key event
const [keyEvent] = await client.createKeyEvent({
  parent: 'properties/987654321',
  keyEvent: {
    eventName: 'purchase',
    countingMethod: 'ONCE_PER_EVENT' // or ONCE_PER_SESSION
  }
});

// List key events
const [keyEvents] = await client.listKeyEvents({
  parent: 'properties/987654321'
});
```

### Measurement Protocol Secrets
```javascript
// Create API secret for Measurement Protocol
const [secret] = await client.createMeasurementProtocolSecret({
  parent: 'properties/987654321/dataStreams/1234567890',
  measurementProtocolSecret: {
    displayName: 'Server-side tracking secret'
  }
});
```

### Integrations
```javascript
// Link Firebase project
const [firebaseLink] = await client.createFirebaseLink({
  parent: 'properties/987654321',
  firebaseLink: {
    project: 'projects/my-firebase-project'
  }
});

// Link Google Ads account
const [adsLink] = await client.createGoogleAdsLink({
  parent: 'properties/987654321',
  googleAdsLink: {
    customerId: '123-456-7890',
    adsPersonalizationEnabled: true
  }
});
```

## Rate Limits

| Quota | Limit |
|-------|-------|
| Requests/minute | 1,200 |
| Requests/minute/user | 600 |
| Writes/minute | 600 |
| Writes/minute/user | 180 |

## Error Handling

```javascript
try {
  const [property] = await client.getProperty({ name: 'properties/invalid' });
} catch (error) {
  if (error.code === 5) { // NOT_FOUND
    console.log('Property not found');
  } else if (error.code === 7) { // PERMISSION_DENIED
    console.log('Access denied');
  } else if (error.code === 8) { // RESOURCE_EXHAUSTED
    console.log('Quota exceeded, implement backoff');
  }
}
```

## Common gRPC Error Codes
- `5` NOT_FOUND - Resource doesn't exist
- `7` PERMISSION_DENIED - Insufficient access
- `8` RESOURCE_EXHAUSTED - Quota exceeded
- `16` UNAUTHENTICATED - Invalid credentials
