#!/usr/bin/env node
/**
 * Platform Optimization Script
 *
 * Optimize videos for different platforms using FFmpeg.
 * Handles aspect ratio conversion, resolution scaling, and format optimization.
 *
 * Usage:
 *   node optimize-for-platform.cjs --video input.mp4 --platform tiktok
 *   node optimize-for-platform.cjs --video input.mp4 --platform youtube --output optimized.mp4
 */

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Platform specifications
const PLATFORM_SPECS = {
  youtube: {
    name: 'YouTube',
    aspectRatio: '16:9',
    resolution: '1920x1080',
    maxDuration: null, // No practical limit
    frameRate: 30,
    audioBitrate: '192k',
    videoBitrate: '10M',
    format: 'mp4',
    codec: 'libx264',
    audioCodec: 'aac',
  },
  'youtube-shorts': {
    name: 'YouTube Shorts',
    aspectRatio: '9:16',
    resolution: '1080x1920',
    maxDuration: 180, // 3 minutes
    frameRate: 30,
    audioBitrate: '128k',
    videoBitrate: '6M',
    format: 'mp4',
    codec: 'libx264',
    audioCodec: 'aac',
  },
  tiktok: {
    name: 'TikTok',
    aspectRatio: '9:16',
    resolution: '1080x1920',
    maxDuration: 180, // 3 minutes recommended
    frameRate: 30,
    audioBitrate: '128k',
    videoBitrate: '6M',
    format: 'mp4',
    codec: 'libx264',
    audioCodec: 'aac',
  },
  reels: {
    name: 'Instagram Reels',
    aspectRatio: '9:16',
    resolution: '1080x1920',
    maxDuration: 90,
    frameRate: 30,
    audioBitrate: '128k',
    videoBitrate: '6M',
    format: 'mp4',
    codec: 'libx264',
    audioCodec: 'aac',
  },
  instagram: {
    name: 'Instagram Feed',
    aspectRatio: '1:1',
    resolution: '1080x1080',
    maxDuration: 60,
    frameRate: 30,
    audioBitrate: '128k',
    videoBitrate: '5M',
    format: 'mp4',
    codec: 'libx264',
    audioCodec: 'aac',
  },
  linkedin: {
    name: 'LinkedIn',
    aspectRatio: '16:9',
    resolution: '1920x1080',
    maxDuration: 600, // 10 minutes
    frameRate: 30,
    audioBitrate: '192k',
    videoBitrate: '8M',
    format: 'mp4',
    codec: 'libx264',
    audioCodec: 'aac',
  },
  twitter: {
    name: 'Twitter/X',
    aspectRatio: '16:9',
    resolution: '1920x1080',
    maxDuration: 140, // 2:20
    frameRate: 30,
    audioBitrate: '128k',
    videoBitrate: '6M',
    format: 'mp4',
    codec: 'libx264',
    audioCodec: 'aac',
  },
  facebook: {
    name: 'Facebook',
    aspectRatio: '16:9',
    resolution: '1920x1080',
    maxDuration: 240, // 4 minutes recommended
    frameRate: 30,
    audioBitrate: '128k',
    videoBitrate: '8M',
    format: 'mp4',
    codec: 'libx264',
    audioCodec: 'aac',
  },
};

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    video: null,
    platform: null,
    output: null,
    all: false,
    extractThumbnail: false,
    normalizeAudio: true,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--video':
      case '-v':
        options.video = args[++i];
        break;
      case '--platform':
      case '-p':
        options.platform = args[++i];
        break;
      case '--output':
      case '-o':
        options.output = args[++i];
        break;
      case '--all':
      case '-a':
        options.all = true;
        break;
      case '--thumbnail':
      case '-t':
        options.extractThumbnail = true;
        break;
      case '--no-normalize':
        options.normalizeAudio = false;
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
    }
  }

  return options;
}

/**
 * Show help message
 */
function showHelp() {
  console.log(`
Platform Optimization Script - FFmpeg Video Processor

Usage:
  node optimize-for-platform.cjs [options]

Options:
  --video, -v       Input video file (required)
  --platform, -p    Target platform (required unless --all)
  --output, -o      Output file path (default: auto-generated)
  --all, -a         Generate for all platforms
  --thumbnail, -t   Extract thumbnail image
  --no-normalize    Skip audio normalization
  --help, -h        Show this help

Platforms:
  youtube           YouTube standard (16:9, 1080p)
  youtube-shorts    YouTube Shorts (9:16, 1080x1920)
  tiktok            TikTok (9:16, 1080x1920)
  reels             Instagram Reels (9:16, 1080x1920)
  instagram         Instagram Feed (1:1, 1080x1080)
  linkedin          LinkedIn (16:9, 1080p)
  twitter           Twitter/X (16:9, 1080p)
  facebook          Facebook (16:9, 1080p)

Examples:
  node optimize-for-platform.cjs -v video.mp4 -p tiktok
  node optimize-for-platform.cjs -v video.mp4 -p youtube-shorts -o shorts.mp4
  node optimize-for-platform.cjs -v video.mp4 --all
  node optimize-for-platform.cjs -v video.mp4 -p reels --thumbnail
`);
}

/**
 * Check if FFmpeg is available
 */
function checkFfmpeg() {
  try {
    execSync('ffmpeg -version', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Get video info using FFprobe
 */
function getVideoInfo(videoPath) {
  try {
    const result = execSync(
      `ffprobe -v quiet -print_format json -show_format -show_streams "${videoPath}"`,
      { encoding: 'utf8' }
    );
    return JSON.parse(result);
  } catch (error) {
    console.error('Error getting video info:', error.message);
    return null;
  }
}

/**
 * Calculate crop/pad filter for aspect ratio conversion
 */
function getAspectFilter(inputInfo, targetAspect) {
  const videoStream = inputInfo.streams.find((s) => s.codec_type === 'video');
  if (!videoStream) return '';

  const inputWidth = videoStream.width;
  const inputHeight = videoStream.height;
  const inputAspect = inputWidth / inputHeight;

  const [targetW, targetH] = targetAspect.split(':').map(Number);
  const targetRatio = targetW / targetH;

  if (Math.abs(inputAspect - targetRatio) < 0.01) {
    // Already correct aspect ratio
    return '';
  }

  if (inputAspect > targetRatio) {
    // Input is wider - crop sides
    const newWidth = Math.round(inputHeight * targetRatio);
    const cropX = Math.round((inputWidth - newWidth) / 2);
    return `crop=${newWidth}:${inputHeight}:${cropX}:0`;
  } else {
    // Input is taller - crop top/bottom
    const newHeight = Math.round(inputWidth / targetRatio);
    const cropY = Math.round((inputHeight - newHeight) / 2);
    return `crop=${inputWidth}:${newHeight}:0:${cropY}`;
  }
}

/**
 * Optimize video for platform
 */
function optimizeVideo(inputPath, platform, outputPath, options) {
  const spec = PLATFORM_SPECS[platform];
  if (!spec) {
    console.error(`Unknown platform: ${platform}`);
    return false;
  }

  // Get input video info
  const inputInfo = getVideoInfo(inputPath);
  if (!inputInfo) {
    console.error('Could not read video info');
    return false;
  }

  // Build filter chain
  const filters = [];

  // Aspect ratio adjustment
  const aspectFilter = getAspectFilter(inputInfo, spec.aspectRatio);
  if (aspectFilter) {
    filters.push(aspectFilter);
  }

  // Scale to target resolution
  filters.push(`scale=${spec.resolution.replace('x', ':')}`);

  // Build FFmpeg command
  const filterStr = filters.length > 0 ? `-vf "${filters.join(',')}"` : '';

  // Audio normalization
  const audioFilter = options.normalizeAudio ? '-af "loudnorm=I=-14:LRA=11:TP=-1"' : '';

  const cmd = [
    'ffmpeg',
    '-y', // Overwrite output
    `-i "${inputPath}"`,
    filterStr,
    audioFilter,
    `-c:v ${spec.codec}`,
    `-b:v ${spec.videoBitrate}`,
    `-c:a ${spec.audioCodec}`,
    `-b:a ${spec.audioBitrate}`,
    `-r ${spec.frameRate}`,
    '-movflags +faststart', // Web optimization
    '-pix_fmt yuv420p', // Compatibility
    `"${outputPath}"`,
  ]
    .filter(Boolean)
    .join(' ');

  console.log(`\nOptimizing for ${spec.name}...`);
  console.log(`  Resolution: ${spec.resolution}`);
  console.log(`  Aspect: ${spec.aspectRatio}`);
  console.log(`  Output: ${outputPath}`);

  try {
    execSync(cmd, { stdio: 'pipe', timeout: 600000 }); // 10 min timeout
    console.log(`  Status: Success`);
    return true;
  } catch (error) {
    console.error(`  Status: Failed - ${error.message}`);
    return false;
  }
}

/**
 * Extract thumbnail from video
 */
function extractThumbnail(inputPath, outputPath, timestamp = '00:00:01') {
  // Use -ss before -i for faster seeking, add pixel format for compatibility
  const cmd = `ffmpeg -y -ss ${timestamp} -i "${inputPath}" -vframes 1 -pix_fmt yuvj420p -q:v 2 "${outputPath}"`;

  try {
    execSync(cmd, { stdio: 'pipe' });
    console.log(`Thumbnail extracted: ${outputPath}`);
    return true;
  } catch (error) {
    console.error(`Thumbnail extraction failed: ${error.message}`);
    return false;
  }
}

/**
 * Main entry point
 */
async function main() {
  const options = parseArgs();

  if (options.help) {
    showHelp();
    return;
  }

  // Validate
  if (!options.video) {
    console.error('Error: --video is required');
    showHelp();
    process.exit(1);
  }

  if (!fs.existsSync(options.video)) {
    console.error(`Video file not found: ${options.video}`);
    process.exit(1);
  }

  if (!options.platform && !options.all) {
    console.error('Error: --platform or --all is required');
    showHelp();
    process.exit(1);
  }

  // Check FFmpeg
  if (!checkFfmpeg()) {
    console.error('Error: FFmpeg not found. Please install FFmpeg.');
    console.error('  macOS: brew install ffmpeg');
    console.error('  Ubuntu: sudo apt install ffmpeg');
    process.exit(1);
  }

  const inputBase = path.basename(options.video, path.extname(options.video));
  const inputDir = path.dirname(options.video);
  const results = [];

  if (options.all) {
    // Generate for all platforms
    console.log(`\nOptimizing ${options.video} for all platforms...`);

    for (const platform of Object.keys(PLATFORM_SPECS)) {
      const outputPath = path.join(inputDir, `${inputBase}-${platform}.mp4`);
      const success = optimizeVideo(options.video, platform, outputPath, options);
      results.push({ platform, success, output: outputPath });
    }
  } else {
    // Single platform
    const outputPath =
      options.output || path.join(inputDir, `${inputBase}-${options.platform}.mp4`);
    const success = optimizeVideo(options.video, options.platform, outputPath, options);
    results.push({ platform: options.platform, success, output: outputPath });
  }

  // Extract thumbnail if requested
  if (options.extractThumbnail) {
    const thumbPath = path.join(inputDir, `${inputBase}-thumbnail.jpg`);
    extractThumbnail(options.video, thumbPath);
  }

  // Summary
  console.log('\n=== Optimization Summary ===');
  const successful = results.filter((r) => r.success).length;
  console.log(`Completed: ${successful}/${results.length}`);
  results.forEach((r) => {
    const spec = PLATFORM_SPECS[r.platform];
    console.log(`  ${spec.name}: ${r.success ? r.output : 'FAILED'}`);
  });
}

// Run
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
