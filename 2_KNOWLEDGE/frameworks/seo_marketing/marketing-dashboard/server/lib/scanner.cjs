#!/usr/bin/env node
/**
 * Asset scanner - scans assets/ directory and updates manifest
 * Generates asset metadata for Content Hub gallery
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Supported formats by category
const FORMATS = {
  image: ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'],
  video: ['mp4', 'mov', 'webm'],
  document: ['pdf', 'md', 'txt', 'vtt', 'srt'],
  design: ['psd', 'ai', 'fig', 'sketch'],
  data: ['json', 'csv', 'html', 'css'],
  slide: [] // Detected by path, not extension
};

// Path patterns for special format types (matched with specific extensions)
const PATH_FORMAT_PATTERNS = {
  slide: { pattern: /\/slides\//i, extensions: ['html'] },
  storyboard: { pattern: /\/storyboards\//i, extensions: ['md'] },
  article: { pattern: /^articles\//i, extensions: ['md'] },
  transcript: { pattern: /^transcripts\//i, extensions: ['md', 'vtt', 'srt'] }
};

// Category detection from path
const CATEGORY_MAP = {
  'banners': 'banner',
  'designs': 'design',
  'images': 'image',
  'logos': 'logo',
  'videos': 'video',
  'transcripts': 'transcript',
  'infographics': 'infographic',
  'articles': 'article',
  'posts': 'post',
  'copy': 'copy',
  'campaigns': 'campaign',
  'sales': 'sales',
  'seo': 'seo',
  'storyboards': 'storyboard',
  'slides': 'slide'
};

/**
 * Get file extension
 */
function getExtension(filePath) {
  return path.extname(filePath).slice(1).toLowerCase();
}

/**
 * Get format type from extension and optionally path
 * @param {string} ext - File extension
 * @param {string} filePath - Optional file path for path-based detection
 */
function getFormatType(ext, filePath = '') {
  // Check path-based patterns first (for HTML slides, MD storyboards, etc.)
  if (filePath) {
    for (const [type, config] of Object.entries(PATH_FORMAT_PATTERNS)) {
      if (config.extensions.includes(ext) && config.pattern.test(filePath)) {
        return type;
      }
    }
  }

  // Check extension-based formats
  for (const [type, exts] of Object.entries(FORMATS)) {
    if (exts.includes(ext)) return type;
  }
  return 'other';
}

/**
 * Detect category from file path
 */
function detectCategory(filePath) {
  const parts = filePath.split(path.sep);
  for (const part of parts) {
    if (CATEGORY_MAP[part]) return CATEGORY_MAP[part];
  }
  return 'other';
}

/**
 * Generate unique ID for asset
 */
function generateId(filePath) {
  return crypto.createHash('md5').update(filePath).digest('hex').slice(0, 12);
}

/**
 * Scan directory recursively for assets
 */
function scanDirectory(dir, basePath = dir) {
  const assets = [];

  if (!fs.existsSync(dir)) return assets;

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(basePath, fullPath);

    // Skip hidden files and directories
    if (entry.name.startsWith('.')) continue;

    if (entry.isDirectory()) {
      assets.push(...scanDirectory(fullPath, basePath));
    } else {
      const ext = getExtension(entry.name);
      const formatType = getFormatType(ext, relativePath);

      // Skip unsupported formats (but keep slides)
      if (formatType === 'other' && !['html', 'css', 'json'].includes(ext)) continue;

      const stats = fs.statSync(fullPath);
      const category = detectCategory(relativePath);

      // Extract references for parseable formats (md, json, html, css)
      let references = [];
      let slideTitle = null;
      let slideCount = 0;
      const parseableFormats = ['md', 'json', 'html', 'css'];
      if (parseableFormats.includes(ext) && stats.size < 500000) { // Skip files > 500KB
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          references = extractReferences(content, ext, relativePath);

          // Extract slide metadata for HTML slides
          if (formatType === 'slide' && ext === 'html') {
            slideTitle = extractHtmlTitle(content);
            slideCount = countHtmlSlides(content);
          }
        } catch (e) {
          // Ignore read errors
        }
      }

      assets.push({
        id: generateId(relativePath),
        path: relativePath,
        name: path.basename(entry.name, path.extname(entry.name)),
        format: ext,
        formatType: formatType,
        category: category,
        subcategory: getSubcategory(relativePath, category),
        size: stats.size,
        createdAt: stats.birthtime.toISOString(),
        modifiedAt: stats.mtime.toISOString(),
        tags: extractTags(relativePath, entry.name),
        references: references,
        r2: {
          bucket: null,
          key: null,
          url: null,
          syncedAt: null,
          status: 'local'
        },
        meta: {
          description: null,
          campaign: extractCampaign(relativePath),
          aiGenerated: isAiGenerated(relativePath),
          slideTitle: slideTitle,
          slideCount: slideCount
        }
      });
    }
  }

  return assets;
}

/**
 * Get subcategory from path
 */
function getSubcategory(filePath, category) {
  const parts = filePath.split(path.sep);
  const catIndex = parts.findIndex(p => CATEGORY_MAP[p] === category);
  if (catIndex >= 0 && catIndex < parts.length - 2) {
    return parts[catIndex + 1];
  }
  return null;
}

/**
 * Extract tags from path and filename
 */
function extractTags(filePath, filename) {
  const tags = [];
  const parts = filePath.split(path.sep);

  // Add path-based tags
  for (const part of parts) {
    if (part.includes('-')) {
      tags.push(...part.split('-').filter(t => t.length > 2));
    }
  }

  // Add common keywords
  if (filePath.includes('social')) tags.push('social');
  if (filePath.includes('email')) tags.push('email');
  if (filePath.includes('landing')) tags.push('landing');
  if (filePath.includes('hero')) tags.push('hero');

  return [...new Set(tags)].slice(0, 10);
}

/**
 * Extract campaign name from path
 */
function extractCampaign(filePath) {
  const match = filePath.match(/campaigns?\/([^/]+)/i);
  return match ? match[1] : null;
}

/**
 * Check if asset is AI-generated
 */
function isAiGenerated(filePath) {
  return filePath.includes('generated') ||
         filePath.includes('ai-') ||
         /imagen|gemini|dalle|midjourney/i.test(filePath);
}

/**
 * Extract title from HTML file
 */
function extractHtmlTitle(content) {
  const match = content.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match ? match[1].trim() : null;
}

/**
 * Count slides in HTML
 */
function countHtmlSlides(content) {
  const matches = content.match(/class="[^"]*slide[^"]*"/gi);
  return matches ? matches.length : 0;
}

/**
 * Resolve relative path from base directory
 */
function resolveRelativePath(baseDir, relativePath) {
  if (!relativePath || relativePath.startsWith('http')) return null;

  const baseParts = baseDir.split('/').filter(Boolean);
  const relParts = relativePath.split('/');

  for (const part of relParts) {
    if (part === '..') baseParts.pop();
    else if (part !== '.' && part !== '') baseParts.push(part);
  }

  return baseParts.join('/');
}

/**
 * Extract file references from content (for relationship graph)
 * @param {string} content - File content
 * @param {string} format - File extension
 * @param {string} filePath - Path to file (for resolving relative paths)
 * @returns {string[]} Array of referenced file paths
 */
function extractReferences(content, format, filePath) {
  const refs = new Set();
  const baseDir = path.dirname(filePath);

  // Markdown: ![alt](./path.png) or [text](./file.md)
  if (format === 'md') {
    const mdLinks = content.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g);
    for (const m of mdLinks) {
      const resolved = resolveRelativePath(baseDir, m[1]);
      if (resolved) refs.add(resolved);
    }
  }

  // JSON: output_path, image, src, path fields with relative values
  if (format === 'json') {
    const jsonPaths = content.matchAll(/"(?:output_path|image|src|path|file)":\s*"(\.\.?\/[^"]+)"/g);
    for (const m of jsonPaths) {
      const resolved = resolveRelativePath(baseDir, m[1]);
      if (resolved) refs.add(resolved);
    }
  }

  // HTML: href, src attributes (relative paths only)
  if (format === 'html') {
    const htmlRefs = content.matchAll(/(?:href|src)="(\.\.?\/[^"]+)"/g);
    for (const m of htmlRefs) {
      const resolved = resolveRelativePath(baseDir, m[1]);
      if (resolved) refs.add(resolved);
    }
  }

  // CSS: url() references
  if (format === 'css') {
    const cssUrls = content.matchAll(/url\(['"]?(\.\.?\/[^'")\s]+)['"]?\)/g);
    for (const m of cssUrls) {
      const resolved = resolveRelativePath(baseDir, m[1]);
      if (resolved) refs.add(resolved);
    }
  }

  return [...refs];
}

/**
 * Load existing manifest
 */
function loadManifest(manifestPath) {
  if (fs.existsSync(manifestPath)) {
    try {
      return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Merge new assets with existing manifest (preserve R2 data)
 */
function mergeAssets(existing, newAssets) {
  const existingMap = new Map();
  if (existing && existing.assets) {
    for (const asset of existing.assets) {
      existingMap.set(asset.path, asset);
    }
  }

  return newAssets.map(asset => {
    const existingAsset = existingMap.get(asset.path);
    if (existingAsset) {
      // Preserve R2 data and user-added metadata
      return {
        ...asset,
        r2: existingAsset.r2 || asset.r2,
        meta: {
          ...asset.meta,
          description: existingAsset.meta?.description || asset.meta.description
        },
        tags: existingAsset.tags?.length > asset.tags.length
          ? existingAsset.tags
          : asset.tags
      };
    }
    return asset;
  });
}

/**
 * Compute referencedBy (reverse lookup of references)
 * For each asset, find all assets that reference it
 */
function computeReferencedBy(assets) {
  // Build path → asset map
  const pathMap = new Map();
  for (const asset of assets) {
    pathMap.set(asset.path, asset);
  }

  // Compute reverse references
  const referencedByMap = new Map();
  for (const asset of assets) {
    if (!asset.references?.length) continue;
    for (const refPath of asset.references) {
      if (!referencedByMap.has(refPath)) {
        referencedByMap.set(refPath, []);
      }
      referencedByMap.get(refPath).push(asset.path);
    }
  }

  // Add referencedBy to each asset
  for (const asset of assets) {
    asset.referencedBy = referencedByMap.get(asset.path) || [];
  }

  return assets;
}

/**
 * Main scan function
 */
function scan(assetsDir, manifestPath, options = {}) {
  const assets = scanDirectory(assetsDir);
  const existing = loadManifest(manifestPath);
  const merged = mergeAssets(existing, assets);
  const withRefs = computeReferencedBy(merged);

  const manifest = {
    $schema: './manifest.schema.json',
    version: '1.2.0',
    lastUpdated: new Date().toISOString(),
    assetsDir: path.basename(assetsDir),
    totalAssets: withRefs.length,
    categories: [...new Set(withRefs.map(a => a.category))],
    formats: [...new Set(withRefs.map(a => a.format))],
    assets: withRefs
  };

  if (options.update) {
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  }

  return manifest;
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const update = args.includes('--update');
  const json = args.includes('--json');

  const cwd = process.cwd();
  const assetsDir = path.join(cwd, 'assets');
  const manifestPath = path.join(cwd, '.assets', 'manifest.json');

  const manifest = scan(assetsDir, manifestPath, { update });

  if (json) {
    console.log(JSON.stringify(manifest, null, 2));
  } else {
    console.log(`Scanned ${manifest.totalAssets} assets`);
    console.log(`Categories: ${manifest.categories.join(', ')}`);
    console.log(`Formats: ${manifest.formats.join(', ')}`);
    if (update) {
      console.log(`Updated: ${manifestPath}`);
    }
  }
}

module.exports = { scan, scanDirectory, FORMATS, CATEGORY_MAP };
