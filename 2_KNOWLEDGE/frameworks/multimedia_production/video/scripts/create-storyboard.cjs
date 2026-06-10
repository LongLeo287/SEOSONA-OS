#!/usr/bin/env node
/**
 * Storyboard Creation Script
 *
 * Generate visual storyboards from video scripts using Imagen 4.
 *
 * Usage:
 *   node create-storyboard.cjs --script path/to/script.md
 *   node create-storyboard.cjs --scenes 4 --prompt "product demo video"
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const SKILL_DIR = path.join(__dirname, '..');
const AI_MULTIMODAL_SCRIPT = path.join(
  __dirname,
  '..',
  '..',
  'ai-multimodal',
  'scripts',
  'gemini_batch_process.py'
);

const STORYBOARD_PROMPT_TEMPLATE = `Professional storyboard frame for marketing video:

Scene: {scene_description}
Shot: {shot_type} shot
Angle: {camera_angle}
Style: Clean illustration, simplified backgrounds, professional storyboard aesthetic
Composition: Rule of thirds, {composition_notes}
Brand colors: {brand_colors}

Include subtle composition guides (thirds grid)
Sketch style, production-ready storyboard frame`;

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    script: null,
    scenes: 4,
    prompt: null,
    output: null,
    aspectRatio: '16:9',
    brandColors: 'blue, white',
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--script':
      case '-s':
        options.script = args[++i];
        break;
      case '--scenes':
      case '-n':
        options.scenes = parseInt(args[++i], 10);
        break;
      case '--prompt':
      case '-p':
        options.prompt = args[++i];
        break;
      case '--output':
      case '-o':
        options.output = args[++i];
        break;
      case '--aspect-ratio':
      case '-a':
        options.aspectRatio = args[++i];
        break;
      case '--brand-colors':
      case '-c':
        options.brandColors = args[++i];
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
Storyboard Creation Script - Imagen 4 Wrapper

Usage:
  node create-storyboard.cjs [options]

Options:
  --script, -s        Path to video script (MD or JSON)
  --scenes, -n        Number of frames to generate (default: 4)
  --prompt, -p        Brief video description (if no script)
  --output, -o        Output directory (default: ./storyboard-{timestamp})
  --aspect-ratio, -a  Aspect ratio: 16:9, 9:16, 1:1 (default: 16:9)
  --brand-colors, -c  Brand colors for frames (default: "blue, white")
  --help, -h          Show this help

Examples:
  node create-storyboard.cjs -s script.md -o ./storyboard
  node create-storyboard.cjs -p "product launch video" -n 6
  node create-storyboard.cjs -s script.json -a 9:16 -c "orange, black"
`);
}

/**
 * Parse markdown script file
 */
function parseMarkdownScript(content) {
  const scenes = [];
  const sceneRegex = /## (?:Scene|Frame) (\d+)[:\s]*([^\n]*)\n([\s\S]*?)(?=## (?:Scene|Frame) \d+|$)/gi;

  let match;
  while ((match = sceneRegex.exec(content)) !== null) {
    const [, number, title, body] = match;

    // Extract details from body
    const visual = body.match(/\*\*Visual\*\*[:\s]*([^\n]+)/i)?.[1] || '';
    const camera = body.match(/\*\*Camera\*\*[:\s]*([^\n]+)/i)?.[1] || 'medium shot';
    const duration = body.match(/\*\*Duration\*\*[:\s]*([^\n]+)/i)?.[1] || '';

    scenes.push({
      number: parseInt(number, 10),
      title: title.trim(),
      visual: visual.trim(),
      camera: camera.trim(),
      duration: duration.trim(),
    });
  }

  return scenes;
}

/**
 * Parse JSON script file
 */
function parseJsonScript(content) {
  const script = JSON.parse(content);
  return script.scenes || script.frames || [];
}

/**
 * Load and parse script file
 */
function loadScript(scriptPath) {
  if (!fs.existsSync(scriptPath)) {
    console.error(`Script file not found: ${scriptPath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(scriptPath, 'utf8');
  const ext = path.extname(scriptPath).toLowerCase();

  if (ext === '.json') {
    return parseJsonScript(content);
  } else {
    return parseMarkdownScript(content);
  }
}

/**
 * Generate scenes from prompt with intelligent scene descriptions
 */
function generateScenesFromPrompt(prompt, numScenes) {
  const promptLower = prompt.toLowerCase();

  // Detect product type for specialized scene generation
  const isEnergyDrink = promptLower.includes('energy') || promptLower.includes('drink') || promptLower.includes('beverage');
  const isTech = promptLower.includes('tech') || promptLower.includes('app') || promptLower.includes('software');
  const isFood = promptLower.includes('food') || promptLower.includes('restaurant') || promptLower.includes('meal');

  // Extract brand/product name if present
  const brandMatch = prompt.match(/["']([^"']+)["']|named?\s+["']?(\w+)["']?/i);
  const brandName = brandMatch ? (brandMatch[1] || brandMatch[2]) : 'Product';

  // Energy drink commercial structure
  if (isEnergyDrink) {
    const energyScenes = {
      4: [
        { title: 'Extreme Action Hook', visual: `High-octane extreme sports moment - athlete mid-action, intense expression, sweat glistening, ${brandName} can visible in frame`, camera: 'wide shot', duration: '2s' },
        { title: 'Energy Surge', visual: `Close-up of ${brandName} can being opened with dramatic splash, liquid energy radiating outward, vibrant colors exploding`, camera: 'close-up', duration: '1.5s' },
        { title: 'Peak Performance', visual: `Athlete achieving victory moment - crossing finish line, landing trick, scoring goal - powered by ${brandName}`, camera: 'medium shot', duration: '2.5s' },
        { title: 'Brand Reveal CTA', visual: `${brandName} can hero shot with bold logo, tagline text overlay, call-to-action, energy waves in background`, camera: 'medium close-up', duration: '2s' },
      ],
      6: [
        { title: 'Adrenaline Hook', visual: `POV shot of extreme moment - skydiving, mountain biking, or surfing big wave, heart-pounding intensity`, camera: 'wide shot', duration: '1.5s' },
        { title: 'The Challenge', visual: `Athlete facing daunting challenge - steep mountain, massive wave, or intense competition, determination in eyes`, camera: 'medium shot', duration: '1.5s' },
        { title: 'Energy Moment', visual: `Hand grabbing ${brandName} can, opening with satisfying crack, drink in action with dynamic splash effect`, camera: 'close-up', duration: '1s' },
        { title: 'Transformation', visual: `Energy surge visualization - veins lighting up, eyes intensifying, body language shifting to power mode`, camera: 'medium close-up', duration: '1.5s' },
        { title: 'Victory', visual: `Epic achievement moment - athlete conquering challenge, crowd cheering, triumphant pose`, camera: 'wide shot', duration: '1.5s' },
        { title: 'Brand CTA', visual: `${brandName} product lineup, bold tagline, website/social handles, "Unleash Your Energy" or similar CTA`, camera: 'medium shot', duration: '1s' },
      ],
      8: [
        { title: 'Explosive Open', visual: `Extreme sports montage teaser - quick cuts of high-energy action, building anticipation`, camera: 'wide shot', duration: '1s' },
        { title: 'Hero Introduction', visual: `Athlete profile shot - focused, determined, preparing for challenge, ${brandName} visible nearby`, camera: 'medium shot', duration: '1s' },
        { title: 'The Stakes', visual: `Challenge reveal - massive half-pipe, treacherous trail, or intense competition arena`, camera: 'wide shot', duration: '1s' },
        { title: 'Fuel Up', visual: `${brandName} can close-up, athlete drinking, refreshing gulp, energy activation moment`, camera: 'close-up', duration: '1s' },
        { title: 'Power Surge', visual: `Visual energy transformation - dynamic effects showing power boost, color saturation increasing`, camera: 'medium close-up', duration: '1s' },
        { title: 'Action Sequence', visual: `Main performance - athlete executing signature move or overcoming challenge`, camera: 'medium shot', duration: '1s' },
        { title: 'Triumph', visual: `Victory celebration - fist pump, crowd reaction, achievement unlocked moment`, camera: 'wide shot', duration: '1s' },
        { title: 'Brand Finale', visual: `${brandName} hero shot with athlete silhouette, powerful tagline, social proof elements`, camera: 'medium close-up', duration: '1s' },
      ],
    };
    return (energyScenes[numScenes] || energyScenes[6]).map((s, i) => ({ ...s, number: i + 1 }));
  }

  // Default commercial structure
  const defaultStructures = {
    4: ['Hook', 'Problem/Setup', 'Solution/Demo', 'CTA'],
    6: ['Hook', 'Problem', 'Introduction', 'Demo 1', 'Demo 2', 'CTA'],
    8: ['Hook', 'Problem', 'Intro', 'Feature 1', 'Feature 2', 'Benefit', 'Social Proof', 'CTA'],
  };

  const structure = defaultStructures[numScenes] || defaultStructures[4];
  return structure.map((title, i) => ({
    number: i + 1,
    title,
    visual: `${title} scene for: ${prompt}`,
    camera: i === 0 ? 'wide shot' : i === structure.length - 1 ? 'medium close-up' : 'medium shot',
    duration: `${Math.ceil(8 / structure.length)}s`,
  }));
}

/**
 * Build Imagen prompt for a scene
 */
function buildImagenPrompt(scene, options) {
  const shotTypes = {
    'wide': 'wide establishing',
    'medium': 'medium',
    'close-up': 'close-up detail',
    'medium close-up': 'medium close-up',
  };

  const shotType = shotTypes[scene.camera?.toLowerCase()] || 'medium';

  return STORYBOARD_PROMPT_TEMPLATE
    .replace('{scene_description}', scene.visual || scene.title)
    .replace('{shot_type}', shotType)
    .replace('{camera_angle}', 'eye level')
    .replace('{composition_notes}', `Scene ${scene.number}`)
    .replace('{brand_colors}', options.brandColors);
}

/**
 * Check if ai-multimodal is available and working
 */
function checkAiMultimodal() {
  if (!fs.existsSync(AI_MULTIMODAL_SCRIPT)) {
    return { available: false, reason: 'script not found' };
  }
  try {
    const result = execSync(`python "${AI_MULTIMODAL_SCRIPT}" --help`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 10000,
    });
    return { available: true };
  } catch (error) {
    const errMsg = error.message || error.stderr || '';
    if (errMsg.includes('google-genai')) {
      return { available: false, reason: 'google-genai not installed' };
    }
    return { available: false, reason: 'script error' };
  }
}

/**
 * Generate storyboard frame using Imagen 4 or Gemini Flash Image
 */
async function generateFrame(prompt, outputPath, aspectRatio, skipGeneration = false) {
  if (skipGeneration) {
    return { success: false, prompt };
  }

  // Convert aspect ratio format (16:9 -> 16:9 is fine, just validate)
  const validAspects = ['1:1', '16:9', '9:16', '4:3', '3:4'];
  const aspect = validAspects.includes(aspectRatio) ? aspectRatio : '16:9';

  try {
    // Use gemini-3.1-flash-image-preview model (Nano Banana 2 - fastest, near-Pro quality)
    const cmd = `python "${AI_MULTIMODAL_SCRIPT}" --task generate --prompt "${prompt.replace(/"/g, '\\"').replace(/\n/g, ' ')}" --aspect-ratio "${aspect}" --model gemini-3.1-flash-image-preview --verbose 2>&1`;

    const result = execSync(cmd, {
      encoding: 'utf8',
      timeout: 120000, // 2 minute timeout for image generation
    });

    // Parse output to find generated file path
    // Look for patterns like "Saved image to: /path/to/file.png" or "Generated image: /path/to/file.png"
    const outputMatch = result.match(/Saved image to:\s*(.+\.png)/i) ||
                        result.match(/Generated image:\s*(.+\.png)/i) ||
                        result.match(/Saved:\s*(.+\.png)/i);
    let generatedPath = null;

    if (outputMatch) {
      generatedPath = outputMatch[1].trim();
    } else {
      // Look for the most recent generated file in docs/assets
      const assetsDir = path.join(process.cwd(), 'docs', 'assets');
      if (fs.existsSync(assetsDir)) {
        const files = fs.readdirSync(assetsDir)
          .filter(f => (f.startsWith('generated_') || f.startsWith('imagen4_')) && f.endsWith('.png'))
          .map(f => ({ name: f, time: fs.statSync(path.join(assetsDir, f)).mtime }))
          .sort((a, b) => b.time - a.time);
        if (files.length > 0) {
          generatedPath = path.join(assetsDir, files[0].name);
        }
      }
    }

    // Copy to output path if we found the generated file
    if (generatedPath && fs.existsSync(generatedPath)) {
      fs.copyFileSync(generatedPath, outputPath);
      return { success: true, prompt, generatedPath: outputPath };
    }

    return { success: false, prompt, error: 'Could not locate generated image' };
  } catch (error) {
    const errMsg = error.message || '';
    const stderr = error.stderr ? error.stderr.toString() : '';

    // Check for billing errors
    if (errMsg.includes('billing') || stderr.includes('billing') || errMsg.includes('429') || stderr.includes('429')) {
      return { success: false, prompt, error: 'API billing required for image generation' };
    }

    return { success: false, prompt, error: (errMsg + stderr).substring(0, 200) };
  }
}

/**
 * Generate storyboard document
 */
function generateStoryboardDoc(scenes, outputDir, frameResults, options) {
  let markdown = `# Storyboard\n\n`;
  markdown += `**Project:** ${options.prompt || 'Custom Script'}\n`;
  markdown += `**Generated:** ${new Date().toISOString()}\n`;
  markdown += `**Aspect Ratio:** ${options.aspectRatio}\n`;
  markdown += `**Brand Colors:** ${options.brandColors}\n\n`;
  markdown += `---\n\n`;

  scenes.forEach((scene, i) => {
    const result = frameResults[i];
    const hasImage = result && result.success && fs.existsSync(path.join(outputDir, `frame-${String(i + 1).padStart(2, '0')}.png`));

    markdown += `## Frame ${scene.number}: ${scene.title}\n\n`;
    markdown += `| Property | Value |\n`;
    markdown += `|----------|-------|\n`;
    markdown += `| **Duration** | ${scene.duration || 'TBD'} |\n`;
    markdown += `| **Shot Type** | ${scene.camera} |\n`;
    markdown += `| **Camera Angle** | Eye level |\n\n`;

    markdown += `### Visual Description\n\n`;
    markdown += `${scene.visual}\n\n`;

    if (hasImage) {
      markdown += `### Generated Frame\n\n`;
      markdown += `![Frame ${scene.number}](./frame-${String(i + 1).padStart(2, '0')}.png)\n\n`;
    } else if (result && result.prompt) {
      markdown += `### Image Generation Prompt\n\n`;
      markdown += `\`\`\`\n${result.prompt}\n\`\`\`\n\n`;
    }

    markdown += `---\n\n`;
  });

  // Add usage instructions at the end
  markdown += `## Usage Instructions\n\n`;
  markdown += `Use the image generation prompts above with your preferred AI image generator:\n`;
  markdown += `- **Imagen 4** (Google): Best for storyboard style\n`;
  markdown += `- **DALL-E 3** (OpenAI): Good for realistic scenes\n`;
  markdown += `- **Midjourney**: Great for artistic interpretations\n`;
  markdown += `- **Stable Diffusion**: Good for custom styles\n`;

  const docPath = path.join(outputDir, 'storyboard.md');
  fs.writeFileSync(docPath, markdown);
  return docPath;
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

  // Get scenes
  let scenes;
  if (options.script) {
    scenes = loadScript(options.script);
  } else if (options.prompt) {
    scenes = generateScenesFromPrompt(options.prompt, options.scenes);
  } else {
    console.error('Error: Either --script or --prompt is required');
    showHelp();
    process.exit(1);
  }

  if (scenes.length === 0) {
    console.error('Error: No scenes found in script');
    process.exit(1);
  }

  // Create output directory
  const outputDir = options.output || `storyboard-${Date.now()}`;
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Check if ai-multimodal is available
  const aiCheck = checkAiMultimodal();
  const skipImageGen = !aiCheck.available;

  console.log(`\nGenerating ${scenes.length} storyboard frame(s)...`);
  console.log(`Output directory: ${outputDir}`);
  console.log(`Aspect ratio: ${options.aspectRatio}`);
  console.log(`Brand colors: ${options.brandColors}`);

  if (skipImageGen) {
    console.log(`\nNote: Image generation unavailable (${aiCheck.reason})`);
    console.log('Generating storyboard document with prompts only...\n');
  } else {
    console.log('');
  }

  // Generate frames (or just collect prompts)
  const frameResults = [];
  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    const outputPath = path.join(outputDir, `frame-${String(i + 1).padStart(2, '0')}.png`);

    console.log(`Processing frame ${i + 1}/${scenes.length}: ${scene.title || 'Scene ' + (i + 1)}`);

    const prompt = buildImagenPrompt(scene, options);
    const result = await generateFrame(prompt, outputPath, options.aspectRatio, skipImageGen);

    frameResults.push(result);
  }

  // Generate storyboard document
  console.log('\nGenerating storyboard document...');
  const docPath = generateStoryboardDoc(scenes, outputDir, frameResults, options);

  // Summary
  const successful = frameResults.filter((r) => r && r.success).length;
  console.log(`\n=== Storyboard Complete ===`);
  if (skipImageGen) {
    console.log(`Frames: ${scenes.length} (prompts only, no images generated)`);
  } else {
    console.log(`Frames generated: ${successful}/${scenes.length}`);
  }
  console.log(`Output directory: ${outputDir}`);
  console.log(`Storyboard document: ${docPath}`);
}

// Run
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
