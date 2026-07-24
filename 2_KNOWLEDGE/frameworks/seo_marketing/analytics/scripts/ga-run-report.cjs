#!/usr/bin/env node
/**
 * GA4 Report Runner
 *
 * Run custom reports against GA4 properties using Data API.
 *
 * Usage:
 *   node ga-run-report.cjs --property=PROPERTY_ID [options]
 *
 * Options:
 *   --property=ID       GA4 property ID (required)
 *   --start=DATE        Start date (default: 7daysAgo)
 *   --end=DATE          End date (default: today)
 *   --dimensions=LIST   Comma-separated dimensions (default: date)
 *   --metrics=LIST      Comma-separated metrics (default: activeUsers)
 *   --limit=N           Max rows (default: 100)
 *   --realtime          Run realtime report instead
 *   --json              Output as JSON
 *   --help              Show help
 *
 * Requires: @google-analytics/data
 * Credentials: GOOGLE_APPLICATION_CREDENTIALS or .claude/secrets/ga_service_account.json
 */

const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const { google } = require('googleapis');
const configLoader = require('./ga-config-loader.cjs');

/**
 * Create OAuth2 client from saved token
 */
function createOAuth2Client() {
  const clientSecretResult = configLoader.loadClientSecret();
  const tokenResult = configLoader.loadToken();

  if (!clientSecretResult || !tokenResult) {
    return null;
  }

  const credentials = configLoader.extractOAuthCredentials(clientSecretResult.credentials);
  const oauth2Client = new google.auth.OAuth2(
    credentials.client_id,
    credentials.client_secret,
    credentials.redirect_uris[0]
  );
  oauth2Client.setCredentials(tokenResult.token);
  return oauth2Client;
}

function parseArgs(args) {
  const result = {
    property: null,
    startDate: '7daysAgo',
    endDate: 'today',
    dimensions: ['date'],
    metrics: ['activeUsers'],
    limit: 100,
    realtime: false,
    json: false,
    help: false,
  };

  for (const arg of args) {
    if (arg === '--help') {
      result.help = true;
    } else if (arg === '--realtime') {
      result.realtime = true;
    } else if (arg === '--json') {
      result.json = true;
    } else if (arg.startsWith('--property=')) {
      result.property = arg.split('=')[1];
    } else if (arg.startsWith('--start=')) {
      result.startDate = arg.split('=')[1];
    } else if (arg.startsWith('--end=')) {
      result.endDate = arg.split('=')[1];
    } else if (arg.startsWith('--dimensions=')) {
      result.dimensions = arg.split('=')[1].split(',').map((d) => d.trim());
    } else if (arg.startsWith('--metrics=')) {
      result.metrics = arg.split('=')[1].split(',').map((m) => m.trim());
    } else if (arg.startsWith('--limit=')) {
      result.limit = parseInt(arg.split('=')[1], 10);
    }
  }

  return result;
}

function showHelp() {
  console.log(`
GA4 Report Runner

Usage:
  node ga-run-report.cjs --property=PROPERTY_ID [options]

Options:
  --property=ID       GA4 property ID (required, e.g., 123456789)
  --start=DATE        Start date (default: 7daysAgo)
  --end=DATE          End date (default: today)
  --dimensions=LIST   Comma-separated dimensions (default: date)
  --metrics=LIST      Comma-separated metrics (default: activeUsers)
  --limit=N           Max rows (default: 100)
  --realtime          Run realtime report instead
  --json              Output as JSON
  --help              Show this help

Date formats:
  Absolute: 2024-01-01
  Relative: today, yesterday, 7daysAgo, 30daysAgo, 365daysAgo

Common dimensions:
  date, country, city, browser, deviceCategory, pagePath, source, medium

Common metrics:
  activeUsers, newUsers, sessions, screenPageViews, eventCount, bounceRate

Examples:
  # Basic daily active users
  node ga-run-report.cjs --property=123456789

  # Traffic by country
  node ga-run-report.cjs --property=123456789 --dimensions=country --metrics=sessions,activeUsers

  # Page views by path
  node ga-run-report.cjs --property=123456789 --dimensions=pagePath --metrics=screenPageViews --limit=20

  # Real-time active users by country
  node ga-run-report.cjs --property=123456789 --dimensions=country --realtime

  # JSON output for processing
  node ga-run-report.cjs --property=123456789 --json
`);
}

async function runReport(client, options) {
  const request = {
    property: `properties/${options.property}`,
    dateRanges: [
      {
        startDate: options.startDate,
        endDate: options.endDate,
      },
    ],
    dimensions: options.dimensions.map((name) => ({ name })),
    metrics: options.metrics.map((name) => ({ name })),
    limit: options.limit,
  };

  const [response] = await client.runReport(request);
  return response;
}

async function runRealtimeReport(client, options) {
  const request = {
    property: `properties/${options.property}`,
    dimensions: options.dimensions.map((name) => ({ name })),
    metrics: options.metrics.map((name) => ({ name })),
    limit: options.limit,
  };

  const [response] = await client.runRealtimeReport(request);
  return response;
}

function formatResponse(response, dimensions, metrics) {
  const result = {
    rowCount: response.rowCount || 0,
    dimensions: dimensions,
    metrics: metrics,
    rows: [],
    quota: null,
  };

  if (response.rows) {
    result.rows = response.rows.map((row) => {
      const rowData = {};
      dimensions.forEach((dim, i) => {
        rowData[dim] = row.dimensionValues[i]?.value || '';
      });
      metrics.forEach((metric, i) => {
        rowData[metric] = row.metricValues[i]?.value || '0';
      });
      return rowData;
    });
  }

  if (response.propertyQuota) {
    result.quota = {
      tokensPerDay: response.propertyQuota.tokensPerDay,
      tokensPerHour: response.propertyQuota.tokensPerHour,
      tokensPerMinute: response.propertyQuota.tokensPerMinute,
      concurrentRequests: response.propertyQuota.concurrentRequests,
    };
  }

  return result;
}

function printTable(data) {
  if (data.rows.length === 0) {
    console.log('No data found.');
    return;
  }

  const columns = [...data.dimensions, ...data.metrics];

  // Calculate column widths
  const widths = {};
  columns.forEach((col) => {
    widths[col] = col.length;
  });
  data.rows.forEach((row) => {
    columns.forEach((col) => {
      const value = String(row[col] || '');
      if (value.length > widths[col]) {
        widths[col] = Math.min(value.length, 40);
      }
    });
  });

  // Print header
  const header = columns.map((col) => col.padEnd(widths[col])).join(' | ');
  console.log(header);
  console.log('-'.repeat(header.length));

  // Print rows
  data.rows.forEach((row) => {
    const line = columns
      .map((col) => {
        const value = String(row[col] || '').substring(0, 40);
        return value.padEnd(widths[col]);
      })
      .join(' | ');
    console.log(line);
  });

  console.log(`\nTotal rows: ${data.rowCount}`);

  if (data.quota) {
    console.log(
      `\nQuota - Tokens remaining: ${data.quota.tokensPerDay?.remaining || 'N/A'}/day, ${data.quota.tokensPerMinute?.remaining || 'N/A'}/min`
    );
  }
}

async function main() {
  const args = process.argv.slice(2);
  const options = parseArgs(args);

  if (options.help) {
    showHelp();
    return;
  }

  if (!options.property) {
    console.error('Error: --property=PROPERTY_ID is required');
    console.error('Run with --help for usage information');
    process.exit(1);
  }

  // Check credentials
  const status = configLoader.getConfigStatus();
  const hasServiceAccount = status.serviceAccountFound || process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const hasOAuthToken = status.tokenFound && status.clientSecretFound;

  if (!hasServiceAccount && !hasOAuthToken) {
    console.error('Error: No credentials found.');
    console.error('Options:');
    console.error('  1. Run: node ga-auth-setup.cjs (OAuth flow)');
    console.error('  2. Place ga_service_account.json in .claude/secrets/');
    process.exit(1);
  }

  try {
    let client;

    if (hasServiceAccount) {
      // Use service account
      if (status.serviceAccountFound && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        process.env.GOOGLE_APPLICATION_CREDENTIALS = status.serviceAccountPath;
      }
      if (!options.json) console.log(`Using service account credentials`);
      client = new BetaAnalyticsDataClient();
    } else {
      // Use OAuth token
      const authClient = createOAuth2Client();
      if (!authClient) {
        console.error('Error: Failed to create OAuth client');
        process.exit(1);
      }
      if (!options.json) console.log(`Using OAuth credentials`);
      client = new BetaAnalyticsDataClient({ authClient });
    }

    let response;
    if (options.realtime) {
      if (!options.json) {
        console.log(`\nRunning realtime report for property ${options.property}...`);
      }
      response = await runRealtimeReport(client, options);
    } else {
      if (!options.json) {
        console.log(
          `\nRunning report for property ${options.property} (${options.startDate} to ${options.endDate})...`
        );
      }
      response = await runReport(client, options);
    }

    const formatted = formatResponse(response, options.dimensions, options.metrics);

    if (options.json) {
      console.log(JSON.stringify(formatted, null, 2));
    } else {
      console.log('');
      printTable(formatted);
    }
  } catch (error) {
    console.error('Error:', error.message);

    if (error.code === 3) {
      console.error('\nInvalid dimension or metric. Use checkCompatibility to verify.');
    } else if (error.code === 7) {
      console.error('\nPermission denied. Grant service account access to this property.');
    } else if (error.code === 8) {
      console.error('\nQuota exceeded. Implement backoff or wait before retrying.');
    } else if (error.code === 5) {
      console.error('\nProperty not found. Check the property ID.');
    }

    process.exit(1);
  }
}

main();
