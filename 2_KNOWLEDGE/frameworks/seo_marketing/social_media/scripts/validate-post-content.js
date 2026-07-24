#!/usr/bin/env node

/**
 * Validate social media post content before posting
 * Checks: length limits, media formats, required fields
 *
 * Usage:
 *   node validate-post-content.js --platform x --content "Hello world"
 *   node validate-post-content.js --platform linkedin --content "Post" --media "image.jpg,video.mp4"
 */

const PLATFORM_LIMITS = {
  x: {
    maxLength: 280,
    premiumMaxLength: 4000,
    supportedMediaTypes: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'],
    maxMediaCount: 4,
    maxMediaSizeMB: 15,
    maxVideoDurationSec: 140,
  },
  linkedin: {
    maxLength: 3000,
    supportedMediaTypes: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'application/pdf'],
    maxMediaCount: 9,
    maxMediaSizeMB: 200,
    maxVideoDurationSec: 600,
  },
  facebook: {
    maxLength: 63206,
    supportedMediaTypes: ['image/jpeg', 'image/png', 'video/mp4'],
    maxMediaCount: 10,
    maxMediaSizeMB: 4,
    maxVideoDurationSec: 14400,
  },
  threads: {
    maxLength: 500,
    supportedMediaTypes: ['image/jpeg', 'image/png', 'video/mp4'],
    maxMediaCount: 10,
    maxMediaSizeMB: 8,
    maxVideoDurationSec: 300,
  },
  tiktok: {
    maxLength: 2000,
    supportedMediaTypes: ['video/mp4', 'image/jpeg', 'image/png'],
    maxMediaCount: 35,
    maxMediaSizeMB: 287,
    maxVideoDurationSec: 600,
    minVideoDurationSec: 3,
    requiresVideo: false,
  },
  youtube: {
    maxLength: 5000,
    supportedMediaTypes: ['video/mp4', 'video/webm', 'video/avi', 'video/mov'],
    maxMediaCount: 1,
    maxMediaSizeMB: 128000,
    maxVideoDurationSec: 43200,
    minVideoDurationSec: 1,
    requiresVideo: true,
  },
};

function getMimeType(filename) {
  const ext = filename.toLowerCase().split('.').pop();
  const mimeTypes = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    mp4: 'video/mp4',
    webm: 'video/webm',
    avi: 'video/avi',
    mov: 'video/mov',
    pdf: 'application/pdf',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

function validatePost(platform, content, media = [], isPremium = false) {
  const result = { valid: true, errors: [], warnings: [] };
  const limits = PLATFORM_LIMITS[platform.toLowerCase()];

  if (!limits) {
    result.valid = false;
    result.errors.push(`Unknown platform: ${platform}. Supported: ${Object.keys(PLATFORM_LIMITS).join(', ')}`);
    return result;
  }

  // Check content length
  const maxLength = isPremium && limits.premiumMaxLength ? limits.premiumMaxLength : limits.maxLength;
  if (content.length > maxLength) {
    result.valid = false;
    result.errors.push(`Content too long: ${content.length}/${maxLength} characters`);
  } else if (content.length > maxLength * 0.9) {
    result.warnings.push(`Content near limit: ${content.length}/${maxLength} characters`);
  }

  // Check media count
  if (media.length > limits.maxMediaCount) {
    result.valid = false;
    result.errors.push(`Too many media files: ${media.length}/${limits.maxMediaCount}`);
  }

  // Check media types
  for (const file of media) {
    const mimeType = getMimeType(file);
    if (!limits.supportedMediaTypes.includes(mimeType)) {
      result.valid = false;
      result.errors.push(`Unsupported media type: ${file} (${mimeType})`);
    }
  }

  // Check video requirements
  if (limits.requiresVideo && media.length === 0) {
    result.valid = false;
    result.errors.push(`${platform} requires video content`);
  }

  // Check for mixed media types on platforms that don't support it
  if (platform === 'tiktok' && media.length > 0) {
    const hasVideo = media.some((f) => getMimeType(f).startsWith('video/'));
    const hasImage = media.some((f) => getMimeType(f).startsWith('image/'));
    if (hasVideo && hasImage) {
      result.valid = false;
      result.errors.push('TikTok does not support mixing videos and images in one post');
    }
  }

  // Platform-specific warnings
  if (platform === 'linkedin' && content.includes('@') && !content.includes('urn:li:')) {
    result.warnings.push('LinkedIn mentions should use format: @[Name](urn:li:organization:ID)');
  }

  if (platform === 'x' && content.includes('facebook.com')) {
    result.warnings.push('X may suppress posts containing Facebook links');
  }

  return result;
}

// CLI interface
function main() {
  const args = process.argv.slice(2);
  const params = {};

  // Boolean flags that don't take values
  const booleanFlags = ['premium', 'help'];

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

  if (!params.platform || !params.content) {
    console.log('Usage: node validate-post-content.js --platform <platform> --content "<text>" [--media "file1,file2"]');
    console.log('\nSupported platforms:', Object.keys(PLATFORM_LIMITS).join(', '));
    process.exit(1);
  }

  const media = params.media ? params.media.split(',').map((m) => m.trim()) : [];
  const isPremium = params.premium === true;

  const result = validatePost(params.platform, params.content, media, isPremium);

  console.log('\n=== Validation Result ===');
  console.log(`Platform: ${params.platform}`);
  console.log(`Content length: ${params.content.length} characters`);
  console.log(`Media files: ${media.length}`);
  console.log(`Valid: ${result.valid ? '✓' : '✗'}`);

  if (result.errors.length > 0) {
    console.log('\nErrors:');
    result.errors.forEach((e) => console.log(`  ✗ ${e}`));
  }

  if (result.warnings.length > 0) {
    console.log('\nWarnings:');
    result.warnings.forEach((w) => console.log(`  ⚠ ${w}`));
  }

  process.exit(result.valid ? 0 : 1);
}

// Export for programmatic use
module.exports = { validatePost, PLATFORM_LIMITS };

// Run if called directly
if (require.main === module) {
  main();
}
