#!/usr/bin/env node
/**
 * Generate XML Sitemap
 * Usage: node generate-sitemap.cjs <base-url> <output-path> [--pages pages.json]
 */

const fs = require('fs');
const path = require('path');

function generateSitemap(baseUrl, pages, outputPath) {
  const today = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  for (const page of pages) {
    const url = page.url.startsWith('http') ? page.url : `${baseUrl}${page.url}`;
    const lastmod = page.lastmod || today;
    const changefreq = page.changefreq || 'weekly';
    const priority = page.priority || '0.5';

    xml += `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>
`;
  }

  xml += '</urlset>';

  fs.writeFileSync(outputPath, xml);
  console.log(`Sitemap generated: ${outputPath}`);
  console.log(`Total URLs: ${pages.length}`);
  return outputPath;
}

// CLI handling
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log('Usage: node generate-sitemap.cjs <base-url> <output-path> [--pages pages.json]');
    console.log('Example: node generate-sitemap.cjs https://example.com ./sitemap.xml');
    process.exit(1);
  }

  const baseUrl = args[0].replace(/\/$/, '');
  const outputPath = args[1];
  const pagesIndex = args.indexOf('--pages');

  let pages = [{ url: '/', priority: '1.0', changefreq: 'daily' }];

  if (pagesIndex !== -1 && args[pagesIndex + 1]) {
    const pagesFile = args[pagesIndex + 1];
    if (fs.existsSync(pagesFile)) {
      pages = JSON.parse(fs.readFileSync(pagesFile, 'utf-8'));
    }
  }

  generateSitemap(baseUrl, pages, outputPath);
}

module.exports = { generateSitemap };
