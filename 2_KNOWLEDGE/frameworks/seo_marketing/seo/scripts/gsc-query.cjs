#!/usr/bin/env node
/**
 * Google Search Console Query Tool
 *
 * Query search analytics, sitemaps, and URL inspection data.
 *
 * Cross-platform compatible (macOS, Linux, Windows)
 *
 * Usage:
 *   node gsc-query.cjs --sites                              # List all sites
 *   node gsc-query.cjs --top-queries -s https://example.com # Top queries
 *   node gsc-query.cjs --sitemaps -s https://example.com    # List sitemaps
 *   node gsc-query.cjs --inspect -s https://example.com -u /page  # Inspect URL
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const { getAuthenticatedClient } = require('./gsc-auth.cjs');

// Date helpers
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function getDaysAgo(days) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

/**
 * Create Search Console API client
 */
async function createSearchConsoleClient() {
  const auth = await getAuthenticatedClient();
  return google.searchconsole({ version: 'v1', auth });
}

/**
 * List all verified sites
 */
async function listSites(client) {
  const res = await client.sites.list();
  return res.data.siteEntry || [];
}

/**
 * Query search analytics
 *
 * @param {Object} options
 * @param {number} options.days - Number of days to query (default: 28)
 * @param {string} options.startDate - Start date YYYY-MM-DD
 * @param {string} options.endDate - End date YYYY-MM-DD
 * @param {string[]} options.dimensions - query, page, country, device, date, searchAppearance
 * @param {number} options.rowLimit - 1-25000 (default: 100)
 * @param {number} options.startRow - Pagination offset (default: 0)
 * @param {Object[]} options.filters - Dimension filters
 * @param {string} options.type - web, news, image, video, googleNews, discover
 * @param {string} options.dataState - final, all (fresh), hourly_all
 * @param {string} options.aggregationType - auto, byPage, byProperty, byNewsShowcasePanel
 */
async function queryAnalytics(client, siteUrl, options = {}) {
  const {
    days = 28,
    startDate,
    endDate,
    dimensions = ['query'],
    rowLimit = 100,
    startRow = 0,
    filters = [],
    type = 'web',
    dataState,
    aggregationType,
  } = options;

  const effectiveEndDate = endDate || formatDate(new Date());
  const effectiveStartDate = startDate || formatDate(getDaysAgo(days));

  const requestBody = {
    startDate: effectiveStartDate,
    endDate: effectiveEndDate,
    dimensions,
    rowLimit,
    startRow,
    type,
  };

  // Add optional parameters
  if (dataState) requestBody.dataState = dataState;
  if (aggregationType) requestBody.aggregationType = aggregationType;

  // Add filters if provided
  if (filters.length > 0) {
    requestBody.dimensionFilterGroups = [{ filters }];
  }

  const res = await client.searchanalytics.query({
    siteUrl,
    requestBody,
  });

  return {
    rows: res.data.rows || [],
    responseAggregationType: res.data.responseAggregationType,
    metadata: res.data.metadata,
  };
}

/**
 * Get top queries by clicks
 */
async function getTopQueries(client, siteUrl, options = {}) {
  return queryAnalytics(client, siteUrl, {
    ...options,
    dimensions: ['query'],
  });
}

/**
 * Get top pages by clicks
 */
async function getTopPages(client, siteUrl, options = {}) {
  return queryAnalytics(client, siteUrl, {
    ...options,
    dimensions: ['page'],
  });
}

/**
 * Get device breakdown
 */
async function getDeviceBreakdown(client, siteUrl, options = {}) {
  return queryAnalytics(client, siteUrl, {
    ...options,
    dimensions: ['device'],
  });
}

/**
 * Get country performance
 */
async function getCountryPerformance(client, siteUrl, options = {}) {
  return queryAnalytics(client, siteUrl, {
    ...options,
    dimensions: ['country'],
  });
}

/**
 * Find low CTR opportunities
 */
async function getLowCTROpportunities(client, siteUrl, options = {}) {
  const { minImpressions = 100, maxCTR = 0.02 } = options;

  const result = await queryAnalytics(client, siteUrl, {
    ...options,
    dimensions: ['query', 'page'],
    rowLimit: 1000,
  });

  return result.rows
    .filter((row) => row.impressions >= minImpressions && row.ctr < maxCTR)
    .sort((a, b) => b.impressions - a.impressions);
}

/**
 * List sitemaps
 */
async function listSitemaps(client, siteUrl) {
  const res = await client.sitemaps.list({ siteUrl });
  return res.data.sitemap || [];
}

/**
 * Submit sitemap
 */
async function submitSitemap(client, siteUrl, feedpath) {
  await client.sitemaps.submit({ siteUrl, feedpath });
  return { success: true, feedpath };
}

/**
 * Delete sitemap
 */
async function deleteSitemap(client, siteUrl, feedpath) {
  await client.sitemaps.delete({ siteUrl, feedpath });
  return { success: true, feedpath };
}

/**
 * Inspect URL
 */
async function inspectUrl(client, siteUrl, inspectionUrl) {
  const res = await client.urlInspection.index.inspect({
    requestBody: {
      inspectionUrl,
      siteUrl,
    },
  });
  return res.data.inspectionResult;
}

/**
 * Export data to file
 */
function exportData(data, outputPath, format = 'json') {
  let content;

  if (format === 'json') {
    content = JSON.stringify(data, null, 2);
  } else if (format === 'csv') {
    if (!Array.isArray(data) || data.length === 0) {
      content = '';
    } else {
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map((row) =>
        Object.values(row)
          .map((v) => {
            if (Array.isArray(v)) return `"${v.join(';')}"`;
            if (typeof v === 'string' && (v.includes(',') || v.includes('"')))
              return `"${v.replace(/"/g, '""')}"`;
            return v;
          })
          .join(',')
      );
      content = [headers, ...rows].join('\n');
    }
  } else if (format === 'md') {
    content = formatMarkdownReport(data);
  } else {
    throw new Error(`Unsupported format: ${format}`);
  }

  fs.writeFileSync(outputPath, content);
  return outputPath;
}

/**
 * Format data as markdown report
 */
function formatMarkdownReport(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return '# Search Console Report\n\nNo data available.';
  }

  const headers = Object.keys(data[0]);
  const headerRow = `| ${headers.join(' | ')} |`;
  const separator = `| ${headers.map(() => '---').join(' | ')} |`;
  const rows = data.map((row) => `| ${headers.map((h) => row[h] ?? '').join(' | ')} |`);

  return `# Search Console Report\n\n${headerRow}\n${separator}\n${rows.join('\n')}`;
}

/**
 * Parse CLI arguments
 */
function parseArgs(args) {
  const options = {
    command: null,
    siteUrl: null,
    url: null,
    days: 28,
    output: null,
    format: 'json',
    rowLimit: 100,
    searchType: 'web',
    dataState: null,
    aggregationType: null,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--sites') options.command = 'sites';
    else if (arg === '--top-queries') options.command = 'top-queries';
    else if (arg === '--top-pages') options.command = 'top-pages';
    else if (arg === '--devices') options.command = 'devices';
    else if (arg === '--countries') options.command = 'countries';
    else if (arg === '--low-ctr') options.command = 'low-ctr';
    else if (arg === '--sitemaps') options.command = 'sitemaps';
    else if (arg === '--submit-sitemap') options.command = 'submit-sitemap';
    else if (arg === '--delete-sitemap') options.command = 'delete-sitemap';
    else if (arg === '--inspect') options.command = 'inspect';
    else if (arg === '-s' || arg === '--site') options.siteUrl = args[++i];
    else if (arg === '-u' || arg === '--url') options.url = args[++i];
    else if (arg === '-d' || arg === '--days') options.days = parseInt(args[++i], 10);
    else if (arg === '-o' || arg === '--output') options.output = args[++i];
    else if (arg === '-f' || arg === '--format') options.format = args[++i];
    else if (arg === '-l' || arg === '--limit') options.rowLimit = parseInt(args[++i], 10);
    else if (arg === '-t' || arg === '--type') options.searchType = args[++i];
    else if (arg === '--data-state') options.dataState = args[++i];
    else if (arg === '--aggregation') options.aggregationType = args[++i];
  }

  return options;
}

// CLI
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h') || args.length === 0) {
    console.log(`
Google Search Console Query Tool

Usage:
  node gsc-query.cjs <command> [options]

Commands:
  --sites              List all verified sites
  --top-queries        Get top queries by clicks
  --top-pages          Get top pages by clicks
  --devices            Get device breakdown
  --countries          Get country performance
  --low-ctr            Find low CTR opportunities
  --sitemaps           List sitemaps
  --submit-sitemap     Submit a sitemap (requires --url)
  --delete-sitemap     Delete a sitemap (requires --url)
  --inspect            Inspect a URL (requires --url)

Options:
  -s, --site <url>     Site URL (required for most commands)
  -u, --url <url>      URL for inspection or sitemap operations
  -d, --days <n>       Number of days to query (default: 28)
  -o, --output <file>  Output file path
  -f, --format <fmt>   Output format: json, csv, md (default: json)
  -l, --limit <n>      Row limit, 1-25000 (default: 100)
  -t, --type <type>    Search type: web, news, image, video, googleNews, discover
  --data-state <s>     Data freshness: final (default), all (fresh), hourly_all
  --aggregation <a>    Aggregation: auto, byPage, byProperty, byNewsShowcasePanel

Examples:
  node gsc-query.cjs --sites
  node gsc-query.cjs --top-queries -s https://example.com -d 30
  node gsc-query.cjs --top-queries -s https://example.com -t discover
  node gsc-query.cjs --top-pages -s https://example.com -o pages.json
  node gsc-query.cjs --low-ctr -s https://example.com -f csv -o low-ctr.csv
  node gsc-query.cjs --inspect -s https://example.com -u /blog/post
`);
    return;
  }

  const options = parseArgs(args);

  if (!options.command) {
    console.error('No command specified. Use --help for usage.');
    process.exit(1);
  }

  try {
    const client = await createSearchConsoleClient();
    let result;

    switch (options.command) {
      case 'sites':
        result = await listSites(client);
        break;

      case 'top-queries':
        if (!options.siteUrl) throw new Error('--site required');
        result = await getTopQueries(client, options.siteUrl, {
          days: options.days,
          rowLimit: options.rowLimit,
          type: options.searchType,
          dataState: options.dataState,
          aggregationType: options.aggregationType,
        });
        result = result.rows.map((r) => ({
          query: r.keys[0],
          clicks: r.clicks,
          impressions: r.impressions,
          ctr: (r.ctr * 100).toFixed(2) + '%',
          position: r.position.toFixed(1),
        }));
        break;

      case 'top-pages':
        if (!options.siteUrl) throw new Error('--site required');
        result = await getTopPages(client, options.siteUrl, {
          days: options.days,
          rowLimit: options.rowLimit,
          type: options.searchType,
          dataState: options.dataState,
          aggregationType: options.aggregationType,
        });
        result = result.rows.map((r) => ({
          page: r.keys[0],
          clicks: r.clicks,
          impressions: r.impressions,
          ctr: (r.ctr * 100).toFixed(2) + '%',
          position: r.position.toFixed(1),
        }));
        break;

      case 'devices':
        if (!options.siteUrl) throw new Error('--site required');
        result = await getDeviceBreakdown(client, options.siteUrl, {
          days: options.days,
          type: options.searchType,
          dataState: options.dataState,
        });
        result = result.rows.map((r) => ({
          device: r.keys[0],
          clicks: r.clicks,
          impressions: r.impressions,
          ctr: (r.ctr * 100).toFixed(2) + '%',
          position: r.position.toFixed(1),
        }));
        break;

      case 'countries':
        if (!options.siteUrl) throw new Error('--site required');
        result = await getCountryPerformance(client, options.siteUrl, {
          days: options.days,
          rowLimit: options.rowLimit,
        });
        result = result.rows.map((r) => ({
          country: r.keys[0],
          clicks: r.clicks,
          impressions: r.impressions,
          ctr: (r.ctr * 100).toFixed(2) + '%',
          position: r.position.toFixed(1),
        }));
        break;

      case 'low-ctr':
        if (!options.siteUrl) throw new Error('--site required');
        result = await getLowCTROpportunities(client, options.siteUrl, { days: options.days });
        result = result.map((r) => ({
          query: r.keys[0],
          page: r.keys[1],
          clicks: r.clicks,
          impressions: r.impressions,
          ctr: (r.ctr * 100).toFixed(2) + '%',
          position: r.position.toFixed(1),
        }));
        break;

      case 'sitemaps':
        if (!options.siteUrl) throw new Error('--site required');
        result = await listSitemaps(client, options.siteUrl);
        break;

      case 'submit-sitemap':
        if (!options.siteUrl) throw new Error('--site required');
        if (!options.url) throw new Error('--url required (sitemap path)');
        result = await submitSitemap(client, options.siteUrl, options.url);
        break;

      case 'delete-sitemap':
        if (!options.siteUrl) throw new Error('--site required');
        if (!options.url) throw new Error('--url required (sitemap path)');
        result = await deleteSitemap(client, options.siteUrl, options.url);
        break;

      case 'inspect':
        if (!options.siteUrl) throw new Error('--site required');
        if (!options.url) throw new Error('--url required');
        result = await inspectUrl(client, options.siteUrl, options.url);
        break;

      default:
        throw new Error(`Unknown command: ${options.command}`);
    }

    // Output result
    if (options.output) {
      exportData(result, options.output, options.format);
      console.log(`Exported to: ${options.output}`);
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.error('Error:', error.message);
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  createSearchConsoleClient,
  listSites,
  queryAnalytics,
  getTopQueries,
  getTopPages,
  getDeviceBreakdown,
  getCountryPerformance,
  getLowCTROpportunities,
  listSitemaps,
  submitSitemap,
  deleteSitemap,
  inspectUrl,
  exportData,
};
