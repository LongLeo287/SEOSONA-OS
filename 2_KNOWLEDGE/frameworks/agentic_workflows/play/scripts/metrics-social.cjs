#!/usr/bin/env node
/**
 * metrics-social.cjs — Thin wrapper for social platform read-only metrics
 *
 * v1: Returns setup guidance for each platform.
 * Framework is ready — actual API calls added when users provide credentials.
 */

/**
 * Pull Twitter/X metrics
 * @param {object} config — { bearerToken }
 * @returns {object} availability info
 */
function pullTwitterMetrics(config) {
  const token = config.bearerToken || process.env.TWITTER_BEARER_TOKEN;

  if (!token) {
    return {
      available: false,
      message: 'Twitter API v2 requires a paid plan ($200/mo Basic tier) for read access.\n'
        + 'Setup:\n'
        + '  1. Apply at https://developer.twitter.com/en/portal/petition/essential/basic-info\n'
        + '  2. Subscribe to Basic tier ($200/mo) for tweet read + user lookup\n'
        + '  3. Set TWITTER_BEARER_TOKEN env var\n'
        + '  4. Available metrics: followers_count, tweet_count, listed_count, engagement'
    };
  }

  // Token exists but API calls not implemented in v1
  return {
    available: true,
    configured: true,
    message: 'Twitter credentials found. Metric pulling will be available in v2.\n'
      + 'For now, update metrics manually via: goals.cjs update <slug> twitter_followers <value>',
    metrics: ['followers_count', 'tweet_count', 'listed_count']
  };
}

/**
 * Pull LinkedIn metrics
 * @param {object} config — { accessToken }
 * @returns {object} availability info
 */
function pullLinkedInMetrics(config) {
  const token = config.accessToken || process.env.LINKEDIN_ACCESS_TOKEN;

  if (!token) {
    return {
      available: false,
      message: 'LinkedIn API requires OAuth2 with specific product access.\n'
        + 'Setup:\n'
        + '  1. Create app at https://www.linkedin.com/developers/apps\n'
        + '  2. Request "Community Management API" product access\n'
        + '  3. Complete OAuth2 flow for access_token\n'
        + '  4. Set LINKEDIN_ACCESS_TOKEN env var\n'
        + '  5. Token expires every 60 days — requires refresh flow\n'
        + '  6. Available metrics: follower_count, post_impressions, engagement_rate'
    };
  }

  return {
    available: true,
    configured: true,
    message: 'LinkedIn credentials found. Metric pulling will be available in v2.\n'
      + 'For now, update metrics manually via: goals.cjs update <slug> linkedin_followers <value>',
    metrics: ['follower_count', 'post_impressions', 'engagement_rate']
  };
}

/**
 * Pull Instagram metrics
 * @param {object} config — { accessToken }
 * @returns {object} availability info
 */
function pullInstagramMetrics(config) {
  const token = config.accessToken || process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!token) {
    return {
      available: false,
      message: 'Instagram API requires Facebook Graph API access.\n'
        + 'Setup:\n'
        + '  1. Create Facebook app at https://developers.facebook.com\n'
        + '  2. Add Instagram Graph API product\n'
        + '  3. Connect Instagram Business/Creator account\n'
        + '  4. Generate long-lived access token\n'
        + '  5. Set INSTAGRAM_ACCESS_TOKEN env var\n'
        + '  6. Available metrics: followers_count, media_count, reach, impressions'
    };
  }

  return {
    available: true,
    configured: true,
    message: 'Instagram credentials found. Metric pulling will be available in v2.\n'
      + 'For now, update metrics manually via: goals.cjs update <slug> instagram_followers <value>',
    metrics: ['followers_count', 'media_count', 'reach', 'impressions']
  };
}

/**
 * Route social metrics pull by platform
 * @param {string} platform — twitter, linkedin, instagram
 * @param {object} config — platform-specific config
 * @returns {object} result
 */
function pullSocialMetrics(platform, config) {
  config = config || {};

  switch (platform) {
    case 'twitter':
    case 'x':
      return pullTwitterMetrics(config);
    case 'linkedin':
      return pullLinkedInMetrics(config);
    case 'instagram':
      return pullInstagramMetrics(config);
    default:
      return {
        available: false,
        message: `Unknown social platform: ${platform}. Supported: twitter, linkedin, instagram`
      };
  }
}

// CLI mode
if (require.main === module) {
  const [,, platform, ...args] = process.argv;

  if (!platform || platform === 'help') {
    console.log('Usage: metrics-social.cjs <platform> [config-json]');
    console.log('  Platforms: twitter, linkedin, instagram');
    console.log('  Example:   metrics-social.cjs twitter');
    process.exit(0);
  }

  let config = {};
  if (args[0]) {
    try { config = JSON.parse(args[0]); } catch (e) { /* ignore */ }
  }

  const result = pullSocialMetrics(platform, config);
  console.log(JSON.stringify(result, null, 2));
}

module.exports = {
  pullTwitterMetrics,
  pullLinkedInMetrics,
  pullInstagramMetrics,
  pullSocialMetrics
};
