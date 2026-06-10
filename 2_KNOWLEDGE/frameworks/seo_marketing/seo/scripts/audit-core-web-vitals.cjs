#!/usr/bin/env node
/**
 * Core Web Vitals Audit Script
 *
 * Audits Core Web Vitals using Google PageSpeed Insights API
 *
 * Usage:
 *   node audit-core-web-vitals.cjs -u https://example.com
 *   node audit-core-web-vitals.cjs -s sitemap.xml
 *   node audit-core-web-vitals.cjs -u https://example.com -f json -o report.json
 *
 * Options:
 *   -u, --url <url>          URL to audit
 *   -s, --sitemap <path>     Sitemap XML file to audit multiple URLs
 *   -f, --format <type>      Output format: console, markdown, json (default: console)
 *   -o, --output <path>      Output file path (default: stdout)
 *   --mobile                 Audit mobile only (default: both)
 *   --desktop                Audit desktop only (default: both)
 *   --api-key <key>          PageSpeed API key (or use PAGESPEED_API_KEY env var)
 *   -h, --help               Show help
 *
 * Environment:
 *   PAGESPEED_API_KEY        PageSpeed Insights API key (increases quota)
 */

const fs = require('fs');
const { loadEnv, getEnv } = require('./env-loader.cjs');

// Load environment variables
loadEnv('seo');

const PAGESPEED_API_BASE = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

// Core Web Vitals thresholds
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },      // Largest Contentful Paint (ms)
  FID: { good: 100, poor: 300 },        // First Input Delay (ms)
  INP: { good: 200, poor: 500 },        // Interaction to Next Paint (ms)
  CLS: { good: 0.1, poor: 0.25 },       // Cumulative Layout Shift
  FCP: { good: 1800, poor: 3000 },      // First Contentful Paint (ms)
  TTFB: { good: 800, poor: 1800 },      // Time to First Byte (ms)
};

// Categorize score
function categorizeScore(metric, value) {
  const threshold = THRESHOLDS[metric];
  if (!threshold) return 'unknown';

  if (metric === 'CLS') {
    // CLS is unitless
    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  } else {
    // Time-based metrics (ms)
    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }
}

// Format metric value
function formatMetric(metric, value) {
  if (metric === 'CLS') {
    return value.toFixed(3);
  }
  return `${Math.round(value)}ms`;
}

// Parse sitemap XML
function parseSitemap(xmlContent) {
  const urls = [];
  const urlMatches = xmlContent.matchAll(/<loc>([^<]+)<\/loc>/g);

  for (const match of urlMatches) {
    urls.push(match[1].trim());
  }

  return urls;
}

// Fetch PageSpeed Insights data
async function fetchPageSpeedData(url, strategy, apiKey) {
  const params = new URLSearchParams({
    url,
    strategy, // 'mobile' or 'desktop'
    category: 'performance',
  });

  if (apiKey) {
    params.append('key', apiKey);
  }

  const apiUrl = `${PAGESPEED_API_BASE}?${params.toString()}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      // Mask API key in error messages to prevent credential exposure
      const safeError = errorText.replace(/key=[^&\s]+/gi, 'key=[REDACTED]');
      throw new Error(`PageSpeed API error ${response.status}: ${safeError}`);
    }

    return await response.json();
  } catch (error) {
    // Mask any API key that might appear in error messages
    const safeMessage = error.message.replace(/key=[^&\s]+/gi, 'key=[REDACTED]');
    throw new Error(`Failed to fetch PageSpeed data: ${safeMessage}`);
  }
}

// Extract Core Web Vitals from PageSpeed response
function extractCoreWebVitals(data) {
  const lighthouse = data.lighthouseResult;
  const audits = lighthouse?.audits || {};

  const metrics = {
    // Core Web Vitals
    LCP: audits['largest-contentful-paint']?.numericValue || null,
    FID: audits['max-potential-fid']?.numericValue || null, // FID approximation
    INP: audits['interaction-to-next-paint']?.numericValue || null,
    CLS: audits['cumulative-layout-shift']?.numericValue || null,

    // Additional metrics
    FCP: audits['first-contentful-paint']?.numericValue || null,
    TTFB: audits['server-response-time']?.numericValue || null,

    // Performance score
    performanceScore: lighthouse?.categories?.performance?.score * 100 || 0,
  };

  // Extract opportunities (suggestions)
  const opportunities = [];
  for (const [key, audit] of Object.entries(audits)) {
    if (audit.details?.type === 'opportunity' && audit.score !== null && audit.score < 1) {
      opportunities.push({
        title: audit.title,
        description: audit.description,
        savings: audit.details?.overallSavingsMs || 0,
      });
    }
  }

  // Sort by potential savings
  opportunities.sort((a, b) => b.savings - a.savings);

  return { metrics, opportunities: opportunities.slice(0, 5) };
}

// Audit single URL
async function auditURL(url, options) {
  const { apiKey, strategies } = options;
  const results = {};

  for (const strategy of strategies) {
    try {
      console.error(`Auditing ${url} (${strategy})...`);

      const data = await fetchPageSpeedData(url, strategy, apiKey);
      const { metrics, opportunities } = extractCoreWebVitals(data);

      results[strategy] = {
        metrics,
        opportunities,
        categories: {},
      };

      // Categorize each metric
      for (const [metric, value] of Object.entries(metrics)) {
        if (value !== null && THRESHOLDS[metric]) {
          results[strategy].categories[metric] = categorizeScore(metric, value);
        }
      }

      // Rate limiting: wait 1s between requests
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error(`Error auditing ${url} (${strategy}): ${error.message}`);
      results[strategy] = { error: error.message };
    }
  }

  return { url, results };
}

// Audit multiple URLs from sitemap
async function auditSitemap(sitemapPath, options) {
  let xmlContent;
  try {
    xmlContent = fs.readFileSync(sitemapPath, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to read sitemap: ${error.message}`);
  }

  const urls = parseSitemap(xmlContent);
  if (urls.length === 0) {
    throw new Error('No URLs found in sitemap');
  }

  console.error(`Found ${urls.length} URLs in sitemap`);

  const results = [];

  for (const url of urls) {
    const result = await auditURL(url, options);
    results.push(result);
  }

  return results;
}

// Generate console output
function generateConsoleOutput(auditResults) {
  let output = '';

  const results = Array.isArray(auditResults) ? auditResults : [auditResults];

  for (const { url, results: strategyResults } of results) {
    output += `\n${'='.repeat(80)}\n`;
    output += `URL: ${url}\n`;
    output += `${'='.repeat(80)}\n\n`;

    for (const [strategy, data] of Object.entries(strategyResults)) {
      if (data.error) {
        output += `${strategy.toUpperCase()}: Error - ${data.error}\n\n`;
        continue;
      }

      output += `${strategy.toUpperCase()} Results:\n`;
      output += `-`.repeat(40) + '\n\n';

      output += `Performance Score: ${Math.round(data.metrics.performanceScore)}/100\n\n`;

      output += 'Core Web Vitals:\n';
      const coreVitals = ['LCP', 'FID', 'INP', 'CLS'];
      for (const metric of coreVitals) {
        const value = data.metrics[metric];
        if (value === null) continue;

        const category = data.categories[metric];
        const icon = category === 'good' ? '✓' : category === 'poor' ? '✗' : '⚠';

        output += `  ${icon} ${metric}: ${formatMetric(metric, value)} [${category}]\n`;
      }

      output += '\nAdditional Metrics:\n';
      const additionalMetrics = ['FCP', 'TTFB'];
      for (const metric of additionalMetrics) {
        const value = data.metrics[metric];
        if (value === null) continue;

        const category = data.categories[metric];
        const icon = category === 'good' ? '✓' : category === 'poor' ? '✗' : '⚠';

        output += `  ${icon} ${metric}: ${formatMetric(metric, value)} [${category}]\n`;
      }

      if (data.opportunities.length > 0) {
        output += '\nTop Optimization Opportunities:\n';
        for (const opp of data.opportunities) {
          output += `  • ${opp.title} (save ~${Math.round(opp.savings)}ms)\n`;
        }
      }

      output += '\n';
    }
  }

  return output;
}

// Generate markdown output
function generateMarkdownOutput(auditResults) {
  let output = '# Core Web Vitals Audit Report\n\n';
  output += `Generated: ${new Date().toISOString()}\n\n`;

  const results = Array.isArray(auditResults) ? auditResults : [auditResults];

  for (const { url, results: strategyResults } of results) {
    output += `## ${url}\n\n`;

    for (const [strategy, data] of Object.entries(strategyResults)) {
      if (data.error) {
        output += `### ${strategy.charAt(0).toUpperCase() + strategy.slice(1)}\n\n`;
        output += `❌ Error: ${data.error}\n\n`;
        continue;
      }

      output += `### ${strategy.charAt(0).toUpperCase() + strategy.slice(1)}\n\n`;

      output += `**Performance Score:** ${Math.round(data.metrics.performanceScore)}/100\n\n`;

      output += '#### Core Web Vitals\n\n';
      output += '| Metric | Value | Status |\n';
      output += '|--------|-------|--------|\n';

      const coreVitals = ['LCP', 'FID', 'INP', 'CLS'];
      for (const metric of coreVitals) {
        const value = data.metrics[metric];
        if (value === null) continue;

        const category = data.categories[metric];
        const status = category === 'good' ? '✅ Good' : category === 'poor' ? '❌ Poor' : '⚠️ Needs Improvement';

        output += `| ${metric} | ${formatMetric(metric, value)} | ${status} |\n`;
      }

      output += '\n#### Additional Metrics\n\n';
      output += '| Metric | Value | Status |\n';
      output += '|--------|-------|--------|\n';

      const additionalMetrics = ['FCP', 'TTFB'];
      for (const metric of additionalMetrics) {
        const value = data.metrics[metric];
        if (value === null) continue;

        const category = data.categories[metric];
        const status = category === 'good' ? '✅ Good' : category === 'poor' ? '❌ Poor' : '⚠️ Needs Improvement';

        output += `| ${metric} | ${formatMetric(metric, value)} | ${status} |\n`;
      }

      if (data.opportunities.length > 0) {
        output += '\n#### Top Optimization Opportunities\n\n';
        for (const opp of data.opportunities) {
          output += `- **${opp.title}** (potential savings: ~${Math.round(opp.savings)}ms)\n`;
        }
      }

      output += '\n';
    }
  }

  return output;
}

// Parse CLI arguments
function parseArgs(args) {
  const options = {
    url: null,
    sitemap: null,
    format: 'console',
    output: null,
    mobile: true,
    desktop: true,
    apiKey: getEnv('PAGESPEED_API_KEY'),
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const next = args[i + 1];

    switch (arg) {
      case '-u':
      case '--url':
        options.url = next;
        i++;
        break;
      case '-s':
      case '--sitemap':
        options.sitemap = next;
        i++;
        break;
      case '-f':
      case '--format':
        options.format = next;
        i++;
        break;
      case '-o':
      case '--output':
        options.output = next;
        i++;
        break;
      case '--mobile':
        options.mobile = true;
        options.desktop = false;
        break;
      case '--desktop':
        options.desktop = true;
        options.mobile = false;
        break;
      case '--api-key':
        options.apiKey = next;
        i++;
        break;
      case '-h':
      case '--help':
        options.help = true;
        break;
    }
  }

  return options;
}

// Print usage
function printUsage() {
  console.log(`
Core Web Vitals Audit Script

Audits Core Web Vitals using Google PageSpeed Insights API

Usage:
  node audit-core-web-vitals.cjs -u https://example.com
  node audit-core-web-vitals.cjs -s sitemap.xml
  node audit-core-web-vitals.cjs -u https://example.com -f markdown -o report.md

Options:
  -u, --url <url>          URL to audit
  -s, --sitemap <path>     Sitemap XML file to audit multiple URLs
  -f, --format <type>      Output format: console, markdown, json (default: console)
  -o, --output <path>      Output file path (default: stdout)
  --mobile                 Audit mobile only (default: both mobile and desktop)
  --desktop                Audit desktop only (default: both mobile and desktop)
  --api-key <key>          PageSpeed API key (or use PAGESPEED_API_KEY env var)
  -h, --help               Show this help

Core Web Vitals Thresholds:
  LCP (Largest Contentful Paint):   Good ≤ 2.5s  |  Poor > 4.0s
  FID (First Input Delay):           Good ≤ 100ms |  Poor > 300ms
  INP (Interaction to Next Paint):   Good ≤ 200ms |  Poor > 500ms
  CLS (Cumulative Layout Shift):     Good ≤ 0.1   |  Poor > 0.25

Environment:
  PAGESPEED_API_KEY        PageSpeed Insights API key (increases quota)

Examples:
  # Audit single URL
  node audit-core-web-vitals.cjs -u https://example.com

  # Audit sitemap with markdown output
  node audit-core-web-vitals.cjs -s sitemap.xml -f markdown -o report.md

  # Audit mobile only with API key
  node audit-core-web-vitals.cjs -u https://example.com --mobile --api-key YOUR_KEY
`);
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = parseArgs(args);

  if (options.help || (!options.url && !options.sitemap)) {
    printUsage();
    process.exit(options.help ? 0 : 1);
  }

  const strategies = [];
  if (options.mobile) strategies.push('mobile');
  if (options.desktop) strategies.push('desktop');

  const auditOptions = {
    apiKey: options.apiKey,
    strategies,
  };

  const run = async () => {
    let auditResults;

    if (options.sitemap) {
      auditResults = await auditSitemap(options.sitemap, auditOptions);
    } else {
      auditResults = await auditURL(options.url, auditOptions);
    }

    // Generate output
    let output;
    if (options.format === 'json') {
      output = JSON.stringify(auditResults, null, 2);
    } else if (options.format === 'markdown' || options.format === 'md') {
      output = generateMarkdownOutput(auditResults);
    } else {
      output = generateConsoleOutput(auditResults);
    }

    // Write output
    if (options.output) {
      fs.writeFileSync(options.output, output);
      console.error(`Report saved: ${options.output}`);
    } else {
      console.log(output);
    }
  };

  run().catch(error => {
    console.error(`Fatal error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { auditURL, auditSitemap, extractCoreWebVitals };
