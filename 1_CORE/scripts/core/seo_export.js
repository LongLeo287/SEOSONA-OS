#!/usr/bin/env node
// seosona-ignore-lang
/**
 * SEOSONA OS — SEO Export Script v2.0
 * Reads audit markdown reports → converts tables → CSV files
 *
 * Usage:
 *   node seo_export.js                     → export all domains
 *   node seo_export.js --domain seosona.com → export 1 domain
 *
 * All output goes to: 3_MEMORY/seo_exports/{domain}/
 */

const fs = require('fs');
const path = require('path');

// ─── PATHS — Single folder structure ──────────────────────────────────────────
const WORKSPACE_ROOT = path.join(__dirname, '..', '..', '..');
const EXPORTS_DIR = path.join(WORKSPACE_ROOT, '3_MEMORY', 'seo_exports');

// Parse CLI args
const args = process.argv.slice(2);
const domainArg = args.includes('--domain') ? args[args.indexOf('--domain') + 1] : null;

// ─── CSV HELPERS ──────────────────────────────────────────────────────────────

function escapeCSV(val) {
  if (val === null || val === undefined) return '';
  const str = String(val).trim();
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function rowToCSV(arr) {
  return arr.map(escapeCSV).join(',');
}

function writeCSV(outputDir, filename, headers, rows) {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const filePath = path.join(outputDir, filename);
  const lines = [rowToCSV(headers), ...rows.map(r => rowToCSV(r))];
  fs.writeFileSync(filePath, lines.join('\r\n'), { encoding: 'utf-8', flag: 'w' });
  console.log(`  ✅ ${filename} (${rows.length} rows)`);
  return filePath;
}

// ─── MARKDOWN PARSERS ─────────────────────────────────────────────────────────

function parseMarkdownTable(text) {
  const lines = text.split('\n').filter(l => l.trim().startsWith('|'));
  if (lines.length < 2) return [];
  const headers = lines[0].split('|').map(h => h.trim()).filter(Boolean);
  const rows = [];
  for (let i = 2; i < lines.length; i++) {
    const cells = lines[i].split('|').map(c => c.trim()).filter(Boolean);
    if (!cells.length) continue;
    const row = {};
    headers.forEach((h, idx) => { row[h] = cells[idx] || ''; });
    rows.push(row);
  }
  return rows;
}

function extractSection(md, title) {
  const re = new RegExp(`##[#]?\\s+[^\\n]*${title}[\\s\\S]*?(?=\\n##\\s|$)`, 'i');
  const match = md.match(re);
  return match ? match[0] : '';
}

// ─── AUDIT REPORT EXPORTER ────────────────────────────────────────────────────

function exportAuditSummary(mdContent, domain, date, outputDir) {
  // Extract pillar scores from score table
  const scoreSection = extractSection(mdContent, 'Score|Health Score|Pillar');
  const scoreRows = parseMarkdownTable(scoreSection);

  const csvRows = scoreRows
    .filter(r => r['Pillar'] || r['Score'])
    .map(r => [
      r['Pillar'] || '',
      r['Score'] || r['Weight'] || '',
      r['Grade'] || '',
      r['Status'] || r['Ghi chú'] || r['Notes'] || '',
      date
    ]);

  if (csvRows.length > 0) {
    writeCSV(outputDir, `audit_summary_${domain}_${date}.csv`,
      ['Pillar', 'Score', 'Grade', 'Notes', 'Date'],
      csvRows
    );
  }
}

function exportIssues(mdContent, domain, date, outputDir) {
  const issueRows = [];

  // Extract P0 through P3 issues
  ['P0', 'P1', 'P2', 'P3'].forEach(priority => {
    const section = extractSection(mdContent, priority);
    const tableRows = parseMarkdownTable(section);
    tableRows.forEach(r => {
      issueRows.push([
        priority,
        r['Issue'] || r['Action'] || r['#'] || '',
        r['Location'] || r['Page/Section'] || r['Trang bị ảnh hưởng'] || '',
        r['Impact'] || '',
        r['Fix'] || r['Giải pháp'] || '',
        date
      ]);
    });
  });

  if (issueRows.length > 0) {
    writeCSV(outputDir, `issues_${domain}_${date}.csv`,
      ['Priority', 'Issue', 'Location', 'Impact', 'Fix', 'Date'],
      issueRows
    );
  }
}

// ─── MAIN: Scan and export per domain ─────────────────────────────────────────

function exportDomain(domainDir, domainName) {
  console.log(`\n📦 Exporting: ${domainName}`);

  const files = fs.readdirSync(domainDir);
  const today = new Date().toISOString().split('T')[0];

  files.forEach(file => {
    const filePath = path.join(domainDir, file);
    if (!file.endsWith('.md')) return;

    const content = fs.readFileSync(filePath, 'utf-8');

    try {
      if (file.includes('audit')) {
        exportAuditSummary(content, domainName, today, domainDir);
        exportIssues(content, domainName, today, domainDir);
        console.log(`  📄 Processed: ${file}`);
      }
    } catch (err) {
      console.error(`  ❌ Failed: ${file} — ${err.message}`);
    }
  });
}

function run() {
  if (!fs.existsSync(EXPORTS_DIR)) {
    console.log(`❌ seo_exports directory not found at: ${EXPORTS_DIR}`);
    return;
  }

  const domains = fs.readdirSync(EXPORTS_DIR)
    .filter(d => {
      const full = path.join(EXPORTS_DIR, d);
      return fs.statSync(full).isDirectory() && !d.startsWith('_');
    });

  if (domains.length === 0) {
    console.log('ℹ️  No domain folders found in seo_exports/');
    return;
  }

  console.log(`\n🚀 SEOSONA OS — Export Script v2.0`);
  console.log(`📁 Base: ${EXPORTS_DIR}`);
  console.log(`🌐 Domains: ${domains.join(', ')}`);

  const targets = domainArg ? domains.filter(d => d === domainArg) : domains;

  if (targets.length === 0) {
    console.log(`❌ Domain not found: ${domainArg}`);
    return;
  }

  targets.forEach(domain => {
    exportDomain(path.join(EXPORTS_DIR, domain), domain);
  });

  console.log(`\n✅ Export complete. Files saved to: ${EXPORTS_DIR}`);
}

run();
