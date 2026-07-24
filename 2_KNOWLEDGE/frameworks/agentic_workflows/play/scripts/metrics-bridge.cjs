#!/usr/bin/env node
/**
 * metrics-bridge.cjs — Thin bridge to existing CKM skill scripts for metrics
 *
 * Delegates to analytics, seo, and payment-integration skill scripts.
 * Does NOT reimplement API integrations — calls existing scripts.
 */

const fs = require('fs');
const path = require('path');
const { execSync, execFileSync } = require('child_process');
const https = require('https');

const SKILL_PATHS = {
  ga4: path.resolve(__dirname, '../../analytics/scripts/ga-run-report.cjs'),
  gsc: path.resolve(__dirname, '../../seo/scripts/gsc-query.cjs'),
  payment: path.resolve(__dirname, '../../payment-integration/scripts/'),
  email: path.resolve(__dirname, './metrics-email.cjs'),
  social: path.resolve(__dirname, './metrics-social.cjs')
};

/**
 * Check which integrations are available (scripts exist + env vars set)
 * @returns {object} { ga4, gsc, stripe, email, social } with availability info
 */
function checkAvailability() {
  const result = {};

  // GA4
  const ga4Exists = fs.existsSync(SKILL_PATHS.ga4);
  const ga4ConfigLoader = path.resolve(__dirname, '../../analytics/scripts/ga-config-loader.cjs');
  const ga4HasConfig = ga4Exists && (
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    fs.existsSync(ga4ConfigLoader)
  );
  result.ga4 = {
    available: ga4Exists,
    configured: ga4HasConfig,
    scriptPath: SKILL_PATHS.ga4,
    message: !ga4Exists
      ? 'Install ckm:analytics skill and configure GA4 credentials'
      : !ga4HasConfig
        ? 'GA4 script found but credentials not configured. Run ga-auth-setup.cjs'
        : 'GA4 ready'
  };

  // GSC
  const gscExists = fs.existsSync(SKILL_PATHS.gsc);
  const gscAuth = path.resolve(__dirname, '../../seo/scripts/gsc-auth.cjs');
  const gscHasAuth = gscExists && fs.existsSync(gscAuth);
  result.gsc = {
    available: gscExists,
    configured: gscHasAuth,
    scriptPath: SKILL_PATHS.gsc,
    message: !gscExists
      ? 'Install ckm:seo skill and configure GSC credentials'
      : !gscHasAuth
        ? 'GSC script found but auth not configured. Run gsc-auth setup'
        : 'GSC ready'
  };

  // Stripe / Payment
  const paymentDir = SKILL_PATHS.payment;
  const paymentExists = fs.existsSync(paymentDir);
  const stripeKey = !!process.env.STRIPE_SECRET_KEY;
  result.stripe = {
    available: paymentExists,
    configured: stripeKey,
    scriptPath: paymentDir,
    message: !paymentExists
      ? 'Install ckm:payment-integration skill for Stripe metrics'
      : !stripeKey
        ? 'Payment skill found but STRIPE_SECRET_KEY not set'
        : 'Stripe ready'
  };

  // Email
  const emailExists = fs.existsSync(SKILL_PATHS.email);
  const emailConfigured = !!(process.env.SENDGRID_API_KEY || process.env.RESEND_API_KEY);
  result.email = {
    available: emailExists,
    configured: emailConfigured,
    scriptPath: SKILL_PATHS.email,
    message: !emailExists
      ? 'metrics-email.cjs not found'
      : !emailConfigured
        ? 'Set SENDGRID_API_KEY or RESEND_API_KEY for email metrics'
        : 'Email metrics ready'
  };

  // Social
  const socialExists = fs.existsSync(SKILL_PATHS.social);
  result.social = {
    available: socialExists,
    configured: false,
    scriptPath: SKILL_PATHS.social,
    message: 'Social metrics require platform API credentials (see metrics-social.cjs)'
  };

  return result;
}

/**
 * Pull GA4 metrics using existing analytics skill scripts
 * @param {object} config — { propertyId, metricKey, startDate, endDate }
 * @returns {object} { available, value, raw } or { available: false, message }
 */
function pullGA4Metrics(config) {
  if (!fs.existsSync(SKILL_PATHS.ga4)) {
    return { available: false, message: 'Install ckm:analytics skill and configure GA4 credentials' };
  }

  const propertyId = config.propertyId || process.env.GA4_PROPERTY_ID;
  if (!propertyId) {
    return { available: false, message: 'Set GA4_PROPERTY_ID env var or pass propertyId in config' };
  }

  // Map goal metric keys to GA4 metrics
  const metricMap = {
    organic_traffic: 'activeUsers',
    page_views: 'screenPageViews',
    sessions: 'sessions',
    new_users: 'newUsers',
    bounce_rate: 'bounceRate'
  };

  const ga4Metric = metricMap[config.metricKey] || config.metricKey || 'activeUsers';
  const startDate = config.startDate || '30daysAgo';
  const endDate = config.endDate || 'today';

  try {
    const output = execFileSync('node', [
      SKILL_PATHS.ga4,
      `--property=${propertyId}`,
      `--metrics=${ga4Metric}`,
      `--start=${startDate}`,
      `--end=${endDate}`,
      '--json'
    ], { encoding: 'utf-8', timeout: 30000 });
    const data = JSON.parse(output);

    // Sum the metric across all rows
    let total = 0;
    if (data.rows) {
      for (const row of data.rows) {
        total += Number(row[ga4Metric] || 0);
      }
    }

    return { available: true, value: total, raw: data };
  } catch (err) {
    return { available: false, message: `GA4 query failed: ${err.message}` };
  }
}

/**
 * Pull GSC metrics using existing seo skill scripts
 * @param {object} config — { siteUrl, metricKey, days }
 * @returns {object} { available, value, raw } or { available: false, message }
 */
function pullGSCMetrics(config) {
  if (!fs.existsSync(SKILL_PATHS.gsc)) {
    return { available: false, message: 'Install ckm:seo skill and configure GSC credentials' };
  }

  const siteUrl = config.siteUrl || process.env.GSC_SITE_URL;
  if (!siteUrl) {
    return { available: false, message: 'Set GSC_SITE_URL env var or pass siteUrl in config' };
  }

  const days = config.days || 28;

  try {
    // Use top-queries to get keyword count or clicks
    const output = execFileSync('node', [
      SKILL_PATHS.gsc,
      '--top-queries',
      '-s', siteUrl,
      '-d', String(days),
      '-l', '1000'
    ], { encoding: 'utf-8', timeout: 30000 });
    const rows = JSON.parse(output);

    if (config.metricKey === 'keywords_top10') {
      // Count queries with position <= 10
      const top10 = Array.isArray(rows)
        ? rows.filter(r => parseFloat(r.position) <= 10).length
        : 0;
      return { available: true, value: top10, raw: rows };
    }

    if (config.metricKey === 'total_clicks') {
      const clicks = Array.isArray(rows)
        ? rows.reduce((sum, r) => sum + (r.clicks || 0), 0)
        : 0;
      return { available: true, value: clicks, raw: rows };
    }

    if (config.metricKey === 'total_impressions') {
      const impressions = Array.isArray(rows)
        ? rows.reduce((sum, r) => sum + (r.impressions || 0), 0)
        : 0;
      return { available: true, value: impressions, raw: rows };
    }

    // Default: return query count
    const count = Array.isArray(rows) ? rows.length : 0;
    return { available: true, value: count, raw: rows };
  } catch (err) {
    return { available: false, message: `GSC query failed: ${err.message}` };
  }
}

/**
 * Make a synchronous Stripe API GET request using https module
 * @param {string} endpoint — API path (e.g., '/v1/charges?limit=100')
 * @param {string} apiKey — Stripe secret key
 * @returns {object} parsed JSON response
 */
function stripeApiGetSync(endpoint, apiKey) {
  const url = `https://api.stripe.com${endpoint}`;
  const output = execFileSync('node', ['-e', `
    const https = require('https');
    const url = new URL(${JSON.stringify(url)});
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      headers: { 'Authorization': 'Bearer ' + ${JSON.stringify(apiKey)} }
    };
    https.get(options, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => process.stdout.write(data));
    }).on('error', (e) => { process.stderr.write(e.message); process.exit(1); });
  `], { encoding: 'utf-8', timeout: 30000 });
  return JSON.parse(output);
}

/**
 * Pull Stripe metrics using Stripe API via https (no shell interpolation)
 * @param {object} config — { metricKey }
 * @returns {object} { available, value } or { available: false, message }
 */
function pullStripeMetrics(config) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return { available: false, message: 'Set STRIPE_SECRET_KEY env var for Stripe metrics' };
  }

  try {
    const metricKey = config.metricKey || 'mrr';
    const thirtyDaysAgo = Math.floor(Date.now() / 1000) - 30 * 86400;

    if (metricKey === 'mrr' || metricKey === 'revenue') {
      const data = stripeApiGetSync(`/v1/charges?limit=100&created[gte]=${thirtyDaysAgo}`, stripeKey);
      const total = (data.data || []).reduce((sum, c) => sum + (c.amount / 100), 0);
      return { available: true, value: Math.round(total) };
    }

    if (metricKey === 'customers' || metricKey === 'trial_signups') {
      const data = stripeApiGetSync(`/v1/customers?limit=100&created[gte]=${thirtyDaysAgo}`, stripeKey);
      return { available: true, value: (data.data || []).length };
    }

    return { available: true, value: 0, message: `Unknown Stripe metric: ${metricKey}` };
  } catch (err) {
    return { available: false, message: `Stripe API call failed: ${err.message}` };
  }
}

/**
 * Route metric pull to the right source
 * @param {string} source — source identifier (ga4, gsc, stripe, email, social)
 * @param {object} config — source-specific config
 * @returns {object} { available, value } or { available: false, message }
 */
function pullMetric(source, config) {
  switch (source) {
    case 'ga4':
    case 'google-analytics':
      return pullGA4Metrics(config);

    case 'gsc':
    case 'search-console':
      return pullGSCMetrics(config);

    case 'stripe':
      return pullStripeMetrics(config);

    case 'email':
    case 'sendgrid':
    case 'resend': {
      try {
        const emailBridge = require('./metrics-email.cjs');
        return emailBridge.pullEmailMetrics({ ...config, provider: source === 'email' ? undefined : source });
      } catch (err) {
        return { available: false, message: `Email metrics not available: ${err.message}` };
      }
    }

    case 'social':
    case 'twitter':
    case 'linkedin':
    case 'instagram': {
      try {
        const socialBridge = require('./metrics-social.cjs');
        return socialBridge.pullSocialMetrics(source === 'social' ? 'twitter' : source, config);
      } catch (err) {
        return { available: false, message: `Social metrics not available: ${err.message}` };
      }
    }

    case 'manual':
      return { available: false, message: 'Manual source — update via CLI or dashboard' };

    default:
      return { available: false, message: `Unknown source: ${source}` };
  }
}

// CLI mode
if (require.main === module) {
  const [,, action, ...args] = process.argv;

  switch (action) {
    case 'check': {
      const availability = checkAvailability();
      console.log(JSON.stringify(availability, null, 2));
      break;
    }
    case 'pull': {
      // pull <source> [metricKey] [extra-json-config]
      const source = args[0];
      const config = { metricKey: args[1] || 'default' };
      if (args[2]) {
        try { Object.assign(config, JSON.parse(args[2])); } catch (e) { /* ignore */ }
      }
      const result = pullMetric(source, config);
      console.log(JSON.stringify(result, null, 2));
      break;
    }
    default:
      console.log('Usage: metrics-bridge.cjs [check|pull] [args...]');
      console.log('  check                      — show available integrations');
      console.log('  pull <source> [metricKey]   — pull a metric from source');
  }
}

module.exports = {
  pullGA4Metrics,
  pullGSCMetrics,
  pullStripeMetrics,
  pullMetric,
  checkAvailability
};
