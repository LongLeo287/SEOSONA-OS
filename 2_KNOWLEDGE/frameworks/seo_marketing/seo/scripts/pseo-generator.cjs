#!/usr/bin/env node
/**
 * Programmatic SEO Page Generator
 *
 * Batch generates SEO-optimized pages from templates and data sources
 *
 * Usage:
 *   node pseo-generator.cjs -t template.njk -d data.csv -o output/
 *   node pseo-generator.cjs -t template.njk -d data.json -o output/ --resume
 *
 * Options:
 *   -t, --template <path>    Nunjucks template file
 *   -d, --data <path>        Data source (CSV or JSON)
 *   -o, --output <dir>       Output directory
 *   --resume                 Resume from last checkpoint
 *   --checkpoint <n>         Save progress every N pages (default: 100)
 *   --min-words <n>          Minimum word count per page (default: 300)
 *   -h, --help               Show help
 */

const fs = require('fs');
const path = require('path');

// Parse CSV data (handles quoted fields with commas)
function parseCSV(csvContent) {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) return [];

  // Parse CSV line handling quoted fields
  function parseLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"'; // Escaped quote
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim()); // Last field
    return values;
  }

  const headers = parseLine(lines[0]);
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue; // Skip empty lines
    const values = parseLine(lines[i]);
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    rows.push(row);
  }

  return rows;
}

// Escape HTML to prevent XSS
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Simple template engine (Nunjucks-like)
function renderTemplate(template, data) {
  let output = template;

  // Replace {{ variable }} with data values (auto-escape HTML)
  // Use {{ variable | safe }} to skip escaping
  output = output.replace(/\{\{\s*([a-zA-Z0-9_\.]+)(\s*\|\s*safe)?\s*\}\}/g, (match, key, safeFilter) => {
    const keys = key.split('.');
    let value = data;
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return '';
    }
    const strValue = String(value || '');
    // Skip escaping if | safe filter is used
    return safeFilter ? strValue : escapeHTML(strValue);
  });

  // Handle simple loops: {% for item in items %}...{% endfor %}
  output = output.replace(/\{%\s*for\s+(\w+)\s+in\s+(\w+)\s*%\}([\s\S]*?)\{%\s*endfor\s*%\}/g,
    (match, itemName, arrayName, loopContent) => {
      const array = data[arrayName];
      if (!Array.isArray(array)) return '';

      return array.map(item => {
        let loopOutput = loopContent;
        loopOutput = loopOutput.replace(/\{\{\s*(\w+)\.(\w+)\s*\}\}/g, (m, itemRef, prop) => {
          if (itemRef === itemName) return item[prop] || '';
          return m;
        });
        loopOutput = loopOutput.replace(new RegExp(`\\{\\{\\s*${itemName}\\s*\\}\\}`, 'g'), item);
        return loopOutput;
      }).join('');
    }
  );

  // Handle conditionals: {% if condition %}...{% endif %}
  output = output.replace(/\{%\s*if\s+(\w+)\s*%\}([\s\S]*?)\{%\s*endif\s*%\}/g,
    (match, variable, content) => {
      return data[variable] ? content : '';
    }
  );

  return output;
}

// Generate slug from data fields
function generateSlug(data, slugPattern = '{name}') {
  let slug = slugPattern;

  // Replace {field} with actual values
  slug = slug.replace(/\{(\w+)\}/g, (match, field) => {
    return data[field] || '';
  });

  // Convert to URL-friendly format
  slug = slug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug;
}

// Count words in text
function countWords(text) {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

// Validate page quality
function validatePage(content, minWords = 300) {
  const issues = [];

  const wordCount = countWords(content);
  if (wordCount < minWords) {
    issues.push(`Low word count: ${wordCount} (minimum: ${minWords})`);
  }

  // Check for unfilled placeholders
  const placeholders = content.match(/\{\{[^}]+\}\}/g) || [];
  if (placeholders.length > 0) {
    issues.push(`Unfilled placeholders: ${placeholders.join(', ')}`);
  }

  // Check for missing title
  if (!/(<title>|<h1)/i.test(content)) {
    issues.push('Missing title or H1 heading');
  }

  return issues;
}

// Save checkpoint
function saveCheckpoint(outputDir, processedCount) {
  const checkpointFile = path.join(outputDir, '.pseo-checkpoint.json');
  fs.writeFileSync(checkpointFile, JSON.stringify({ processedCount, timestamp: Date.now() }));
}

// Load checkpoint
function loadCheckpoint(outputDir) {
  const checkpointFile = path.join(outputDir, '.pseo-checkpoint.json');
  if (fs.existsSync(checkpointFile)) {
    try {
      return JSON.parse(fs.readFileSync(checkpointFile, 'utf-8'));
    } catch {
      return null;
    }
  }
  return null;
}

// Generate meta tags
function generateMetaTags(data, template) {
  const title = data.meta_title || data.title || data.name || 'Page';
  const description = data.meta_description || data.description || '';
  const keywords = data.keywords || '';

  const metaHTML = `
<title>${escapeHTML(title)}</title>
<meta name="description" content="${escapeHTML(description)}">
${keywords ? `<meta name="keywords" content="${escapeHTML(keywords)}">` : ''}
<meta property="og:title" content="${escapeHTML(title)}">
<meta property="og:description" content="${escapeHTML(description)}">
${data.image ? `<meta property="og:image" content="${escapeHTML(data.image)}">` : ''}
  `.trim();

  return metaHTML;
}

// Main generator function
async function generatePages(options) {
  const {
    templatePath,
    dataPath,
    outputDir,
    resume,
    checkpointInterval,
    minWords,
    slugPattern,
  } = options;

  // Read template
  let template;
  try {
    template = fs.readFileSync(templatePath, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to read template: ${error.message}`);
  }

  // Read data source
  let data;
  try {
    const fileContent = fs.readFileSync(dataPath, 'utf-8');
    if (dataPath.endsWith('.json')) {
      data = JSON.parse(fileContent);
    } else if (dataPath.endsWith('.csv')) {
      data = parseCSV(fileContent);
    } else {
      throw new Error('Unsupported data format. Use .json or .csv');
    }
  } catch (error) {
    throw new Error(`Failed to read data: ${error.message}`);
  }

  // Ensure data is array
  if (!Array.isArray(data)) {
    data = [data];
  }

  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Load checkpoint if resuming
  let startIndex = 0;
  if (resume) {
    const checkpoint = loadCheckpoint(outputDir);
    if (checkpoint) {
      startIndex = checkpoint.processedCount;
      console.log(`Resuming from checkpoint: ${startIndex} pages already processed`);
    }
  }

  // Generate pages
  const results = {
    total: data.length,
    generated: 0,
    skipped: startIndex,
    errors: [],
    warnings: [],
  };

  console.log(`Generating ${data.length - startIndex} pages...`);

  for (let i = startIndex; i < data.length; i++) {
    const item = data[i];

    try {
      // Generate slug
      const slug = generateSlug(item, slugPattern);
      if (!slug) {
        results.errors.push(`Row ${i + 1}: Failed to generate slug`);
        continue;
      }

      // Prepare template data
      const templateData = {
        ...item,
        meta_tags: generateMetaTags(item, template),
        slug,
      };

      // Render template
      let content = renderTemplate(template, templateData);

      // Validate page quality
      const issues = validatePage(content, minWords);
      if (issues.length > 0) {
        results.warnings.push(`${slug}: ${issues.join(', ')}`);
      }

      // Save page
      const outputPath = path.join(outputDir, `${slug}.html`);
      fs.writeFileSync(outputPath, content);

      results.generated++;

      // Progress indicator
      if ((i + 1) % 10 === 0 || i === data.length - 1) {
        process.stdout.write(`\rProgress: ${i + 1}/${data.length} pages`);
      }

      // Save checkpoint
      if ((i + 1) % checkpointInterval === 0) {
        saveCheckpoint(outputDir, i + 1);
      }

    } catch (error) {
      results.errors.push(`Row ${i + 1}: ${error.message}`);
    }
  }

  console.log('\n');

  // Save final checkpoint
  saveCheckpoint(outputDir, data.length);

  return results;
}

// Parse CLI arguments
function parseArgs(args) {
  const options = {
    templatePath: null,
    dataPath: null,
    outputDir: null,
    resume: false,
    checkpointInterval: 100,
    minWords: 300,
    slugPattern: '{name}',
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const next = args[i + 1];

    switch (arg) {
      case '-t':
      case '--template':
        options.templatePath = next;
        i++;
        break;
      case '-d':
      case '--data':
        options.dataPath = next;
        i++;
        break;
      case '-o':
      case '--output':
        options.outputDir = next;
        i++;
        break;
      case '--resume':
        options.resume = true;
        break;
      case '--checkpoint':
        options.checkpointInterval = parseInt(next, 10);
        i++;
        break;
      case '--min-words':
        options.minWords = parseInt(next, 10);
        i++;
        break;
      case '--slug':
        options.slugPattern = next;
        i++;
        break;
      case '-h':
      case '--help':
        options.help = true;
        break;
    }
  }

  return options;
}

// Print usage
function printUsage() {
  console.log(`
Programmatic SEO Page Generator

Batch generates SEO-optimized pages from templates and data sources

Usage:
  node pseo-generator.cjs -t template.njk -d data.csv -o output/
  node pseo-generator.cjs -t template.njk -d data.json -o output/ --resume

Options:
  -t, --template <path>    Nunjucks template file (required)
  -d, --data <path>        Data source CSV or JSON (required)
  -o, --output <dir>       Output directory (required)
  --resume                 Resume from last checkpoint
  --checkpoint <n>         Save progress every N pages (default: 100)
  --min-words <n>          Minimum word count per page (default: 300)
  --slug <pattern>         Slug pattern, e.g. {category}-{name} (default: {name})
  -h, --help               Show this help

Template Syntax:
  {{ variable }}           Insert variable value
  {% for item in items %}  Loop through array
  {% if condition %}       Conditional content
  {{ meta_tags }}          Auto-generated meta tags

Example:
  node pseo-generator.cjs \\
    -t templates/product.html \\
    -d data/products.csv \\
    -o dist/products/ \\
    --slug '{category}-{name}'
`);
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = parseArgs(args);

  if (options.help || !options.templatePath || !options.dataPath || !options.outputDir) {
    printUsage();
    process.exit(options.help ? 0 : 1);
  }

  generatePages(options)
    .then(results => {
      console.log('Generation complete!');
      console.log(`  Total: ${results.total}`);
      console.log(`  Generated: ${results.generated}`);
      console.log(`  Skipped: ${results.skipped}`);

      if (results.warnings.length > 0) {
        console.log(`\nWarnings (${results.warnings.length}):`);
        results.warnings.slice(0, 10).forEach(w => console.log(`  - ${w}`));
        if (results.warnings.length > 10) {
          console.log(`  ... and ${results.warnings.length - 10} more`);
        }
      }

      if (results.errors.length > 0) {
        console.log(`\nErrors (${results.errors.length}):`);
        results.errors.forEach(e => console.log(`  - ${e}`));
        process.exit(1);
      }
    })
    .catch(error => {
      console.error(`Fatal error: ${error.message}`);
      process.exit(1);
    });
}

module.exports = { generatePages, renderTemplate, generateSlug, validatePage };
