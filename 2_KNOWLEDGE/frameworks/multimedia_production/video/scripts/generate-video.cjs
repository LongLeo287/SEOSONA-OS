#!/usr/bin/env node
/**
 * Video Generation Script
 *
 * Wrapper for Veo 3.1 API with marketing templates.
 * Leverages ai-multimodal skill for actual API calls.
 *
 * Usage:
 *   node generate-video.cjs --prompt "product demo" --template product-demo
 *   node generate-video.cjs --script path/to/script.json --output output.mp4
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const SKILL_DIR = path.join(__dirname, '..');
const TEMPLATES_DIR = path.join(SKILL_DIR, 'templates');
const AI_MULTIMODAL_SCRIPT = path.join(
  __dirname,
  '..',
  '..',
  'ai-multimodal',
  'scripts',
  'gemini_batch_process.py'
);

// Default settings
const DEFAULT_ASPECT_RATIO = '16:9';
const DEFAULT_RESOLUTION = '1080p';
const DEFAULT_DURATION = 8;

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    prompt: null,
    template: null,
    script: null,
    output: null,
    aspectRatio: DEFAULT_ASPECT_RATIO,
    resolution: DEFAULT_RESOLUTION,
    brandContext: null,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--prompt':
      case '-p':
        options.prompt = args[++i];
        break;
      case '--template':
      case '-t':
        options.template = args[++i];
        break;
      case '--script':
      case '-s':
        options.script = args[++i];
        break;
      case '--output':
      case '-o':
        options.output = args[++i];
        break;
      case '--aspect-ratio':
      case '-a':
        options.aspectRatio = args[++i];
        break;
      case '--resolution':
      case '-r':
        options.resolution = args[++i];
        break;
      case '--brand':
      case '-b':
        options.brandContext = args[++i];
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
Video Generation Script - Veo 3.1 Wrapper

Usage:
  node generate-video.cjs [options]

Options:
  --prompt, -p      Text prompt for video generation
  --template, -t    Template name (product-demo, explainer, testimonial, short-form)
  --script, -s      Path to script JSON file
  --output, -o      Output file path (default: auto-generated)
  --aspect-ratio, -a Aspect ratio: 16:9, 9:16, 1:1 (default: 16:9)
  --resolution, -r  Resolution: 720p, 1080p (default: 1080p)
  --brand, -b       Path to brand context JSON
  --help, -h        Show this help

Examples:
  node generate-video.cjs -p "product demo of smartphone" -t product-demo
  node generate-video.cjs -s script.json -o my-video.mp4
  node generate-video.cjs -p "tutorial about coding" -a 9:16

Templates:
  product-demo   - Product showcase format
  explainer      - Educational explainer format
  testimonial    - Customer testimonial format
  short-form     - TikTok/Reels/Shorts format
`);
}

/**
 * Load template from templates directory
 */
function loadTemplate(templateName) {
  const templatePath = path.join(TEMPLATES_DIR, `${templateName}.json`);
  if (!fs.existsSync(templatePath)) {
    console.error(`Template not found: ${templateName}`);
    console.error(`Available templates: product-demo, explainer, testimonial, short-form`);
    process.exit(1);
  }

  return JSON.parse(fs.readFileSync(templatePath, 'utf8'));
}

/**
 * Load script from file
 */
function loadScript(scriptPath) {
  if (!fs.existsSync(scriptPath)) {
    console.error(`Script file not found: ${scriptPath}`);
    process.exit(1);
  }

  return JSON.parse(fs.readFileSync(scriptPath, 'utf8'));
}

/**
 * Load brand context
 */
function loadBrandContext(brandPath) {
  if (!brandPath) return {};

  if (!fs.existsSync(brandPath)) {
    console.error(`Brand context file not found: ${brandPath}`);
    process.exit(1);
  }

  return JSON.parse(fs.readFileSync(brandPath, 'utf8'));
}

/**
 * Build Veo prompt from template and user input
 */
function buildPrompt(options, template, brandContext) {
  const {
    prompt,
    aspectRatio,
  } = options;

  // Start with template prompt structure
  let veoPrompt = '';

  if (template) {
    veoPrompt = template.promptTemplate || '';
    // Replace placeholders
    veoPrompt = veoPrompt.replace('{user_prompt}', prompt || '');
    veoPrompt = veoPrompt.replace('{aspect_ratio}', aspectRatio);
    veoPrompt = veoPrompt.replace('{brand_name}', brandContext.name || 'Brand');
    veoPrompt = veoPrompt.replace('{brand_style}', brandContext.style || 'professional, modern');
    veoPrompt = veoPrompt.replace('{brand_colors}', brandContext.colors || 'brand colors');
  } else {
    // Use raw prompt with quality enhancements
    veoPrompt = `
Marketing video: ${prompt}

Style: Professional, polished, high quality
Camera: Smooth, cinematic movement
Lighting: Professional studio or natural lighting
Audio: Crystal clear, professional audio mixing
Technical: 8 seconds, ${aspectRatio}, ${options.resolution}, high quality
`.trim();
  }

  return veoPrompt;
}

/**
 * Generate video using ai-multimodal skill
 */
async function generateVideo(prompt, options) {
  const { output, aspectRatio, resolution } = options;

  // Check if ai-multimodal script exists
  if (!fs.existsSync(AI_MULTIMODAL_SCRIPT)) {
    console.error('Error: ai-multimodal skill not found');
    console.error(`Expected at: ${AI_MULTIMODAL_SCRIPT}`);
    console.error('Please ensure ai-multimodal skill is installed.');
    process.exit(1);
  }

  // Build command
  const outputPath = output || `video-${Date.now()}.mp4`;
  const aspectArg = aspectRatio === '9:16' ? '--vertical' : '';

  console.log('\nGenerating video with Veo 3.1...');
  console.log('Prompt:', prompt.substring(0, 100) + (prompt.length > 100 ? '...' : ''));
  console.log('Aspect Ratio:', aspectRatio);
  console.log('Resolution:', resolution);
  console.log('Output:', outputPath);
  console.log('\nThis may take 1-3 minutes...\n');

  try {
    // Use ai-multimodal for video generation
    const result = execSync(
      `python "${AI_MULTIMODAL_SCRIPT}" --task generate-video --prompt "${prompt.replace(/"/g, '\\"')}" --output "${outputPath}" ${aspectArg}`,
      {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
        timeout: 300000, // 5 minute timeout
      }
    );

    console.log('Video generated successfully!');
    console.log('Output:', outputPath);
    return { success: true, output: outputPath, result };
  } catch (error) {
    console.error('Error generating video:', error.message);

    // Check for common errors
    if (error.message.includes('GEMINI_API_KEY')) {
      console.error('\nAPI Key not found. Set GEMINI_API_KEY environment variable.');
      console.error('Get your key at: https://aistudio.google.com/apikey');
    } else if (error.message.includes('billing')) {
      console.error('\nBilling required for Veo 3.1. Enable billing in Google Cloud Console.');
    }

    return { success: false, error: error.message };
  }
}

/**
 * Generate video from script file (multiple scenes)
 */
async function generateFromScript(script, options) {
  console.log(`\nGenerating ${script.scenes.length} scene(s)...`);

  const results = [];
  for (let i = 0; i < script.scenes.length; i++) {
    const scene = script.scenes[i];
    console.log(`\n--- Scene ${i + 1}/${script.scenes.length}: ${scene.title || 'Untitled'} ---`);

    const sceneOutput = options.output
      ? options.output.replace('.mp4', `-scene${i + 1}.mp4`)
      : `video-scene${i + 1}-${Date.now()}.mp4`;

    const result = await generateVideo(scene.veoPrompt || scene.prompt, {
      ...options,
      output: sceneOutput,
      aspectRatio: scene.aspectRatio || options.aspectRatio,
    });

    results.push({ scene: i + 1, ...result });
  }

  // Summary
  console.log('\n=== Generation Summary ===');
  const successful = results.filter((r) => r.success).length;
  console.log(`Successful: ${successful}/${results.length}`);
  results.forEach((r) => {
    console.log(`  Scene ${r.scene}: ${r.success ? r.output : 'FAILED'}`);
  });

  return results;
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

  // Validate input
  if (!options.prompt && !options.script) {
    console.error('Error: Either --prompt or --script is required');
    showHelp();
    process.exit(1);
  }

  // Load resources
  let template = null;
  if (options.template) {
    template = loadTemplate(options.template);
  }

  const brandContext = loadBrandContext(options.brandContext);

  // Generate video(s)
  if (options.script) {
    // Multi-scene generation from script
    const script = loadScript(options.script);
    await generateFromScript(script, options);
  } else {
    // Single video generation
    const prompt = buildPrompt(options, template, brandContext);
    await generateVideo(prompt, options);
  }
}

// Run
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
