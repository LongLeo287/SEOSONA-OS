#!/usr/bin/env node
/**
 * Video Analysis Script
 *
 * Analyze videos using Gemini video understanding capabilities.
 * Provides quality assessment, scene detection, and content analysis.
 *
 * Usage:
 *   node analyze-video.cjs --video path/to/video.mp4
 *   node analyze-video.cjs --video video.mp4 --task quality
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

// Analysis prompts for different tasks
const ANALYSIS_PROMPTS = {
  quality: `Analyze this video for quality and provide a detailed assessment:

1. VISUAL QUALITY (score 1-10)
   - Resolution and clarity
   - Lighting quality
   - Color grading/consistency
   - Camera stability

2. AUDIO QUALITY (score 1-10)
   - Clarity of speech/dialogue
   - Background noise level
   - Music/sound balance
   - Audio sync

3. CONTENT QUALITY (score 1-10)
   - Hook effectiveness (first 3 seconds)
   - Pacing and flow
   - Message clarity
   - Call-to-action strength

4. IMPROVEMENT SUGGESTIONS
   - List top 3 priority improvements
   - Specific actionable recommendations

Overall Score: X/10
Ready for publishing: Yes/No`,

  scenes: `Detect and describe all scenes in this video:

For each scene provide:
- Timestamp: [start] - [end]
- Description: What's happening
- Shot type: (wide/medium/close-up)
- Transition: How it transitions to next scene
- Key elements: Important visual elements

Also provide:
- Total scene count
- Average scene duration
- Pacing assessment (too fast/good/too slow)`,

  content: `Analyze the content and messaging of this video:

1. MAIN MESSAGE
   - What is the primary message/purpose?
   - How clear is the communication?

2. TARGET AUDIENCE
   - Who is this video for?
   - How well does it speak to them?

3. STRUCTURE
   - Hook: What grabs attention?
   - Body: What value is delivered?
   - CTA: What action is requested?

4. BRAND ALIGNMENT
   - Tone and voice assessment
   - Visual brand consistency
   - Professional quality level

5. ENGAGEMENT POTENTIAL
   - Likelihood to keep attention
   - Shareability score (1-10)
   - Comments/discussion potential`,

  transcript: `Transcribe all speech in this video:

Provide:
1. Full transcript with timestamps
2. Speaker identification (if multiple)
3. Key quotes highlighted
4. Summary of main points`,

  marketing: `Evaluate this video for marketing effectiveness:

1. ATTENTION (first 3 seconds)
   - Hook quality: Does it stop the scroll?
   - Curiosity created: Does it make viewers want more?

2. INTEREST (body content)
   - Value delivery: Clear benefits shown?
   - Emotional connection: Does it resonate?
   - Credibility: Trustworthy presentation?

3. DESIRE
   - Problem-solution fit: Clear transformation?
   - Social proof: Evidence of results?
   - Urgency: Reason to act now?

4. ACTION
   - CTA clarity: What should viewer do?
   - CTA visibility: Easy to understand/follow?

5. PLATFORM FIT
   - Best platforms for this video
   - Recommended optimizations per platform
   - Hashtag/keyword suggestions

OVERALL MARKETING SCORE: X/10
Recommendations for improvement:`,
};

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    video: null,
    task: 'quality',
    output: null,
    format: 'text',
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--video':
      case '-v':
        options.video = args[++i];
        break;
      case '--task':
      case '-t':
        options.task = args[++i];
        break;
      case '--output':
      case '-o':
        options.output = args[++i];
        break;
      case '--format':
      case '-f':
        options.format = args[++i];
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
Video Analysis Script - Gemini Video Understanding

Usage:
  node analyze-video.cjs [options]

Options:
  --video, -v     Path to video file (required)
  --task, -t      Analysis task (default: quality)
                  Tasks: quality, scenes, content, transcript, marketing
  --output, -o    Output file path (optional)
  --format, -f    Output format: text, json, markdown (default: text)
  --help, -h      Show this help

Examples:
  node analyze-video.cjs -v video.mp4
  node analyze-video.cjs -v video.mp4 -t scenes
  node analyze-video.cjs -v video.mp4 -t marketing -o analysis.md -f markdown
  node analyze-video.cjs -v video.mp4 -t transcript

Tasks:
  quality     - Overall quality assessment with scores
  scenes      - Scene detection and breakdown
  content     - Content and messaging analysis
  transcript  - Speech transcription
  marketing   - Marketing effectiveness evaluation
`);
}

/**
 * Format analysis output
 */
function formatOutput(analysis, format, task) {
  switch (format) {
    case 'json':
      return JSON.stringify(
        {
          task,
          timestamp: new Date().toISOString(),
          analysis,
        },
        null,
        2
      );

    case 'markdown':
      return `# Video Analysis Report

**Task:** ${task}
**Generated:** ${new Date().toISOString()}

---

${analysis}
`;

    default:
      return analysis;
  }
}

/**
 * Analyze video using ai-multimodal
 */
async function analyzeVideo(videoPath, task) {
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

  // Get prompt for task
  const prompt = ANALYSIS_PROMPTS[task];
  if (!prompt) {
    console.error(`Unknown task: ${task}`);
    console.error(`Available tasks: ${Object.keys(ANALYSIS_PROMPTS).join(', ')}`);
    process.exit(1);
  }

  console.log(`\nAnalyzing video: ${path.basename(videoPath)}`);
  console.log(`Task: ${task}`);
  console.log('This may take 1-2 minutes...\n');

  try {
    const result = execSync(
      `python "${AI_MULTIMODAL_SCRIPT}" --task analyze --files "${videoPath}" --prompt "${prompt.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`,
      {
        encoding: 'utf8',
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer
        timeout: 300000, // 5 minute timeout
      }
    );

    return result.trim();
  } catch (error) {
    console.error('Error analyzing video:', error.message);
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

  // Analyze video
  const analysis = await analyzeVideo(options.video, options.task);

  // Format output
  const formatted = formatOutput(analysis, options.format, options.task);

  // Output
  if (options.output) {
    fs.writeFileSync(options.output, formatted);
    console.log(`Analysis saved to: ${options.output}`);
  } else {
    console.log('\n=== Analysis Results ===\n');
    console.log(formatted);
  }
}

// Run
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
