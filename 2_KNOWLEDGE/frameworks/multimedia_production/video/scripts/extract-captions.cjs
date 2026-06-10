#!/usr/bin/env node
/**
 * Caption Extraction Script
 *
 * Extract captions/transcripts from videos using Gemini API.
 * Supports multiple output formats: SRT, VTT, TXT, JSON.
 *
 * Usage:
 *   node extract-captions.cjs --video video.mp4
 *   node extract-captions.cjs --video video.mp4 --format srt --output captions.srt
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const AI_MULTIMODAL_SCRIPT = path.join(
  __dirname,
  '..',
  '..',
  'ai-multimodal',
  'scripts',
  'gemini_batch_process.py'
);

const TRANSCRIPTION_PROMPT = `Transcribe all speech in this video with precise timestamps.

Format your response as follows:
- Each line should be: [MM:SS] Text spoken
- Include speaker identification if multiple speakers
- Note any significant non-speech sounds in [brackets]
- Keep each segment to 2-3 sentences max

Example format:
[00:00] Hello everyone, welcome to this video.
[00:03] Today we're going to talk about marketing.
[00:06] [Music transition]
[00:08] Speaker 2: Let me show you how this works.`;

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    video: null,
    format: 'srt',
    output: null,
    language: 'en',
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--video':
      case '-v':
        options.video = args[++i];
        break;
      case '--format':
      case '-f':
        options.format = args[++i];
        break;
      case '--output':
      case '-o':
        options.output = args[++i];
        break;
      case '--language':
      case '-l':
        options.language = args[++i];
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
Caption Extraction Script - Gemini Transcription

Usage:
  node extract-captions.cjs [options]

Options:
  --video, -v      Input video file (required)
  --format, -f     Output format: srt, vtt, txt, json (default: srt)
  --output, -o     Output file path (default: auto-generated)
  --language, -l   Language code (default: en)
  --help, -h       Show this help

Formats:
  srt    SubRip subtitle format (most common)
  vtt    WebVTT format (web-optimized)
  txt    Plain text transcript
  json   Structured JSON with timestamps

Examples:
  node extract-captions.cjs -v video.mp4
  node extract-captions.cjs -v video.mp4 -f vtt -o captions.vtt
  node extract-captions.cjs -v video.mp4 -f json
`);
}

/**
 * Parse transcription response into segments
 */
function parseTranscription(rawText) {
  const segments = [];
  const lines = rawText.split('\n').filter((line) => line.trim());

  const timestampRegex = /\[(\d{1,2}):(\d{2})\]/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const match = line.match(timestampRegex);

    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const startTime = minutes * 60 + seconds;
      const text = line.replace(timestampRegex, '').trim();

      // Estimate end time (next timestamp or +3 seconds)
      let endTime = startTime + 3;
      if (i + 1 < lines.length) {
        const nextMatch = lines[i + 1].match(timestampRegex);
        if (nextMatch) {
          const nextMinutes = parseInt(nextMatch[1], 10);
          const nextSeconds = parseInt(nextMatch[2], 10);
          endTime = Math.min(nextMinutes * 60 + nextSeconds, startTime + 5);
        }
      }

      if (text && !text.startsWith('[')) {
        segments.push({
          index: segments.length + 1,
          startTime,
          endTime,
          text,
        });
      }
    }
  }

  return segments;
}

/**
 * Format time as SRT timestamp (HH:MM:SS,mmm)
 */
function formatSrtTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.round((seconds % 1) * 1000);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
}

/**
 * Format time as VTT timestamp (HH:MM:SS.mmm)
 */
function formatVttTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.round((seconds % 1) * 1000);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
}

/**
 * Convert segments to SRT format
 */
function toSrt(segments) {
  return segments
    .map(
      (seg) =>
        `${seg.index}\n${formatSrtTime(seg.startTime)} --> ${formatSrtTime(seg.endTime)}\n${seg.text}\n`
    )
    .join('\n');
}

/**
 * Convert segments to VTT format
 */
function toVtt(segments) {
  let vtt = 'WEBVTT\n\n';
  vtt += segments
    .map(
      (seg) => `${formatVttTime(seg.startTime)} --> ${formatVttTime(seg.endTime)}\n${seg.text}\n`
    )
    .join('\n');
  return vtt;
}

/**
 * Convert segments to plain text
 */
function toText(segments) {
  return segments.map((seg) => seg.text).join('\n\n');
}

/**
 * Convert segments to JSON
 */
function toJson(segments) {
  return JSON.stringify(
    {
      version: '1.0',
      generated: new Date().toISOString(),
      segments: segments.map((seg) => ({
        index: seg.index,
        start: seg.startTime,
        end: seg.endTime,
        text: seg.text,
      })),
    },
    null,
    2
  );
}

/**
 * Extract captions from video
 */
async function extractCaptions(videoPath) {
  // Check if video exists
  if (!fs.existsSync(videoPath)) {
    console.error(`Video file not found: ${videoPath}`);
    process.exit(1);
  }

  // Check if ai-multimodal script exists
  if (!fs.existsSync(AI_MULTIMODAL_SCRIPT)) {
    console.error('Error: ai-multimodal skill not found');
    process.exit(1);
  }

  console.log(`\nExtracting captions from: ${path.basename(videoPath)}`);
  console.log('This may take 1-2 minutes...\n');

  try {
    const result = execSync(
      `python "${AI_MULTIMODAL_SCRIPT}" --task transcribe --files "${videoPath}" --prompt "${TRANSCRIPTION_PROMPT.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`,
      {
        encoding: 'utf8',
        maxBuffer: 10 * 1024 * 1024,
        timeout: 300000,
      }
    );

    return result.trim();
  } catch (error) {
    console.error('Error extracting captions:', error.message);
    process.exit(1);
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

  if (!options.video) {
    console.error('Error: --video is required');
    showHelp();
    process.exit(1);
  }

  // Extract transcription
  const rawTranscript = await extractCaptions(options.video);

  // Parse into segments
  const segments = parseTranscription(rawTranscript);

  if (segments.length === 0) {
    console.log('No speech detected in video or transcription failed.');
    console.log('\nRaw response:');
    console.log(rawTranscript);
    return;
  }

  console.log(`Found ${segments.length} caption segments.`);

  // Convert to requested format
  let output;
  let ext;

  switch (options.format.toLowerCase()) {
    case 'srt':
      output = toSrt(segments);
      ext = '.srt';
      break;
    case 'vtt':
      output = toVtt(segments);
      ext = '.vtt';
      break;
    case 'txt':
    case 'text':
      output = toText(segments);
      ext = '.txt';
      break;
    case 'json':
      output = toJson(segments);
      ext = '.json';
      break;
    default:
      console.error(`Unknown format: ${options.format}`);
      process.exit(1);
  }

  // Write output
  const outputPath =
    options.output ||
    path.join(
      path.dirname(options.video),
      path.basename(options.video, path.extname(options.video)) + ext
    );

  fs.writeFileSync(outputPath, output);
  console.log(`\nCaptions saved to: ${outputPath}`);

  // Show preview
  console.log('\n=== Preview (first 5 segments) ===\n');
  console.log(
    segments
      .slice(0, 5)
      .map((s) => `[${formatSrtTime(s.startTime)}] ${s.text}`)
      .join('\n')
  );

  if (segments.length > 5) {
    console.log(`\n... and ${segments.length - 5} more segments`);
  }
}

// Run
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
