#!/usr/bin/env node

/**
 * Schedule social media posts with queue management
 * Handles timing, rate limits, and multi-platform coordination
 *
 * Usage:
 *   node schedule-post.js --platforms "x,linkedin" --content "Hello" --time "2025-01-20T10:00:00Z"
 */

const DEFAULT_CONFIG = {
  maxConcurrent: {
    x: 1,
    linkedin: 2,
    facebook: 100,
    threads: 2,
    tiktok: 1,
    youtube: 200,
  },
  minDelayMs: {
    x: 2000,
    linkedin: 1000,
    facebook: 500,
    threads: 3000,
    tiktok: 5000,
    youtube: 1000,
  },
};

// Optimal posting times by platform (UTC)
const OPTIMAL_TIMES = {
  x: { days: [2, 3, 4, 5], hours: [9, 10, 11, 12] }, // Tue-Fri 9am-12pm
  linkedin: { days: [2, 3, 4], hours: [8, 9, 10] }, // Tue-Thu 8-10am
  facebook: { days: [1, 2, 3, 4, 5], hours: [9, 10, 11, 12, 13] }, // Mon-Fri 9am-1pm
  threads: { days: [1, 2, 3, 4, 5], hours: [11, 12, 13, 14] }, // Mon-Fri 11am-2pm
  tiktok: { days: [2, 3, 4], hours: [19, 20, 21] }, // Tue-Thu 7-9pm
  youtube: { days: [4, 5, 6], hours: [14, 15, 16, 17] }, // Thu-Sat 2-5pm
};

function generateId() {
  return `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function getNextOptimalTime(platform, afterDate = new Date()) {
  const optimal = OPTIMAL_TIMES[platform.toLowerCase()];
  if (!optimal) return afterDate;

  const result = new Date(afterDate);

  // Find next optimal day
  while (!optimal.days.includes(result.getDay())) {
    result.setDate(result.getDate() + 1);
  }

  // Find next optimal hour
  const currentHour = result.getHours();
  const nextHour = optimal.hours.find((h) => h > currentHour);

  if (nextHour) {
    result.setHours(nextHour, 0, 0, 0);
  } else {
    // Move to next optimal day
    result.setDate(result.getDate() + 1);
    while (!optimal.days.includes(result.getDay())) {
      result.setDate(result.getDate() + 1);
    }
    result.setHours(optimal.hours[0], 0, 0, 0);
  }

  return result;
}

function validateScheduledTime(time) {
  const now = new Date();

  if (time < now) {
    return { valid: false, error: 'Scheduled time is in the past' };
  }

  const maxFuture = new Date();
  maxFuture.setDate(maxFuture.getDate() + 30); // 30 days max

  if (time > maxFuture) {
    return { valid: false, error: 'Scheduled time is too far in the future (max 30 days)' };
  }

  return { valid: true };
}

function createScheduledPost(platforms, content, scheduledTime, mediaUrls = []) {
  return {
    id: generateId(),
    platforms,
    content,
    mediaUrls,
    scheduledTime,
    status: 'pending',
    results: {},
  };
}

function formatScheduleOutput(post) {
  const lines = [
    '\n=== Scheduled Post ===',
    `ID: ${post.id}`,
    `Status: ${post.status}`,
    `Scheduled: ${post.scheduledTime.toISOString()}`,
    `Platforms: ${post.platforms.join(', ')}`,
    `Content: ${post.content.substring(0, 50)}${post.content.length > 50 ? '...' : ''}`,
    `Media: ${post.mediaUrls.length} files`,
  ];

  if (Object.keys(post.results).length > 0) {
    lines.push('\nResults:');
    for (const [platform, result] of Object.entries(post.results)) {
      if (result.success) {
        lines.push(`  ✓ ${platform}: ${result.postUrl}`);
      } else {
        lines.push(`  ✗ ${platform}: ${result.error}`);
      }
    }
  }

  return lines.join('\n');
}

// CLI interface
function main() {
  const args = process.argv.slice(2);
  const params = {};

  // Boolean flags that don't take values
  const booleanFlags = ['suggest-time', 'help'];

  for (let i = 0; i < args.length; i++) {
    if (!args[i].startsWith('--')) continue;
    const key = args[i].replace('--', '');
    if (booleanFlags.includes(key)) {
      params[key] = true;
    } else if (args[i + 1] && !args[i + 1].startsWith('--')) {
      params[key] = args[i + 1];
      i++; // Skip the value in next iteration
    }
  }

  if (params.help || (!params.platforms && !params['suggest-time'])) {
    console.log(`
Social Post Scheduler

Usage:
  node schedule-post.js --platforms "x,linkedin" --content "Hello" --time "2025-01-20T10:00:00Z"
  node schedule-post.js --suggest-time --platforms "x,linkedin"

Options:
  --platforms     Comma-separated list of platforms (x, linkedin, facebook, threads, tiktok, youtube)
  --content       Post content text
  --time          ISO 8601 datetime for scheduling (UTC)
  --media         Comma-separated list of media URLs
  --suggest-time  Suggest optimal posting times for platforms
  --help          Show this help message

Examples:
  # Schedule a post
  node schedule-post.js --platforms "x,linkedin" --content "Check out our new feature!" --time "2025-01-20T14:00:00Z"

  # Get optimal posting times
  node schedule-post.js --suggest-time --platforms "x,linkedin,tiktok"
    `);
    process.exit(0);
  }

  const platforms = params.platforms ? params.platforms.split(',').map((p) => p.trim().toLowerCase()) : [];

  // Suggest optimal times
  if (params['suggest-time']) {
    console.log('\n=== Optimal Posting Times (UTC) ===');
    for (const platform of platforms) {
      const nextTime = getNextOptimalTime(platform);
      const optimal = OPTIMAL_TIMES[platform];
      console.log(`\n${platform.toUpperCase()}:`);
      console.log(`  Best days: ${optimal?.days.map((d) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(', ')}`);
      console.log(`  Best hours: ${optimal?.hours.map((h) => `${h}:00`).join(', ')}`);
      console.log(`  Next optimal: ${nextTime.toISOString()}`);
    }
    process.exit(0);
  }

  if (!params.content) {
    console.error('Error: --content is required');
    process.exit(1);
  }

  const scheduledTime = params.time ? new Date(params.time) : getNextOptimalTime(platforms[0]);
  const validation = validateScheduledTime(scheduledTime);

  if (!validation.valid) {
    console.error(`Error: ${validation.error}`);
    process.exit(1);
  }

  const mediaUrls = params.media ? params.media.split(',').map((m) => m.trim()) : [];

  const post = createScheduledPost(platforms, params.content, scheduledTime, mediaUrls);

  console.log(formatScheduleOutput(post));
  console.log('\nNote: This is a scheduling preview. Actual posting requires API integration.');
  console.log('See references/unified-api-services.md for implementation options.');
}

// Export for programmatic use
module.exports = {
  createScheduledPost,
  getNextOptimalTime,
  validateScheduledTime,
  OPTIMAL_TIMES,
  DEFAULT_CONFIG,
};

// Run if called directly
if (require.main === module) {
  main();
}
