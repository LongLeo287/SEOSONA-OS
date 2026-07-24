#!/usr/bin/env node
/**
 * metrics-email.cjs — Thin wrapper for email platform stats
 *
 * Supports SendGrid (stats API) and Resend (no stats API — webhook guidance).
 * Uses native https module — no npm dependencies.
 */

const https = require('https');

/**
 * Make an HTTPS GET request and return parsed JSON
 * @param {string} url — full URL
 * @param {object} headers — request headers
 * @returns {Promise<object>} parsed response
 */
function httpsGet(url, headers) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: 'GET',
      headers: headers || {}
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ statusCode: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ statusCode: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(new Error('Request timeout')); });
    req.end();
  });
}

/**
 * Pull SendGrid email stats
 * @param {string} apiKey — SendGrid API key
 * @returns {Promise<object>} { opens, clicks, bounces, delivered, list_size }
 */
async function pullSendGridStats(apiKey) {
  if (!apiKey) {
    return { available: false, message: 'Set SENDGRID_API_KEY env var' };
  }

  try {
    // Get global stats for last 30 days
    const now = new Date();
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
    const startDate = thirtyDaysAgo.toISOString().split('T')[0];
    const endDate = now.toISOString().split('T')[0];

    const url = `https://api.sendgrid.com/v3/stats?start_date=${startDate}&end_date=${endDate}&aggregated_by=month`;
    const res = await httpsGet(url, {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    });

    if (res.statusCode !== 200) {
      return { available: false, message: `SendGrid API error: ${res.statusCode}` };
    }

    // Aggregate metrics across all date entries
    let opens = 0, clicks = 0, bounces = 0, delivered = 0;
    const stats = Array.isArray(res.body) ? res.body : [];

    for (const entry of stats) {
      for (const metric of (entry.stats || [])) {
        const m = metric.metrics || {};
        opens += m.unique_opens || 0;
        clicks += m.unique_clicks || 0;
        bounces += (m.bounces || 0) + (m.bounce_drops || 0);
        delivered += m.delivered || 0;
      }
    }

    // Try to get contact count for list_size
    let listSize = 0;
    try {
      const contactRes = await httpsGet('https://api.sendgrid.com/v3/marketing/contacts/count', {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      });
      if (contactRes.statusCode === 200 && contactRes.body.contact_count !== undefined) {
        listSize = contactRes.body.contact_count;
      }
    } catch (e) {
      // Contact count is optional
    }

    return {
      available: true,
      value: delivered,
      opens,
      clicks,
      bounces,
      delivered,
      list_size: listSize
    };
  } catch (err) {
    return { available: false, message: `SendGrid request failed: ${err.message}` };
  }
}

/**
 * Pull Resend email stats
 * Resend does not have a stats/analytics API endpoint.
 * @param {string} apiKey — Resend API key
 * @returns {object} guidance message
 */
async function pullResendStats(apiKey) {
  return {
    available: false,
    message: 'Resend does not provide a stats API. To track email metrics with Resend:\n'
      + '  1. Set up webhooks at https://resend.com/webhooks\n'
      + '  2. Track events: email.sent, email.delivered, email.opened, email.clicked, email.bounced\n'
      + '  3. Store events in your database and query locally\n'
      + '  4. Or use Resend dashboard for manual metric entry via goals.cjs update'
  };
}

/**
 * Route email metrics pull based on provider
 * @param {object} config — { provider, apiKey }
 * @returns {Promise<object>} metric result
 */
async function pullEmailMetrics(config) {
  const provider = config.provider || (process.env.SENDGRID_API_KEY ? 'sendgrid' : 'resend');

  switch (provider) {
    case 'sendgrid': {
      const apiKey = config.apiKey || process.env.SENDGRID_API_KEY;
      return pullSendGridStats(apiKey);
    }
    case 'resend': {
      const apiKey = config.apiKey || process.env.RESEND_API_KEY;
      return pullResendStats(apiKey);
    }
    default:
      return { available: false, message: `Unknown email provider: ${provider}. Supported: sendgrid, resend` };
  }
}

// CLI mode
if (require.main === module) {
  const [,, action, ...args] = process.argv;

  switch (action) {
    case 'sendgrid': {
      const apiKey = args[0] || process.env.SENDGRID_API_KEY;
      pullSendGridStats(apiKey).then(r => console.log(JSON.stringify(r, null, 2)));
      break;
    }
    case 'resend': {
      const apiKey = args[0] || process.env.RESEND_API_KEY;
      pullResendStats(apiKey).then(r => console.log(JSON.stringify(r, null, 2)));
      break;
    }
    case 'pull': {
      const provider = args[0] || 'sendgrid';
      pullEmailMetrics({ provider }).then(r => console.log(JSON.stringify(r, null, 2)));
      break;
    }
    default:
      console.log('Usage: metrics-email.cjs [sendgrid|resend|pull] [apiKey]');
  }
}

module.exports = {
  pullSendGridStats,
  pullResendStats,
  pullEmailMetrics
};
