#!/usr/bin/env node
/**
 * SEOSONA OS — Audit Check Script
 * Usage: npm run audit:check
 *
 * Verifies all SEO domain folders in seo_exports/ have the required exports.
 * Support artifacts such as quality reports are allowed to live in seo_exports/
 * without turning into a domain-level completeness failure.
 * Exit code 0 = all good, Exit code 1 = issues found.
 */

const fs = require('fs');
const path = require('path');

const EXPORTS_DIR = path.join(__dirname, '..', '..', '3_MEMORY', 'seo_exports');

const REQUIRED_PATTERNS = [
  { pattern: /.*_audit_\d{4}-\d{2}-\d{2}\.md$/, label: 'audit report (.md)' },
  { pattern: /.*_executive_\d{4}-\d{2}-\d{2}\.md$/, label: 'executive summary (.md)' },
  { pattern: /.*_action_plan_\d{4}-\d{2}-\d{2}\.md$/, label: 'action plan (.md)' },
  { pattern: /^keyword_research_.*\.csv$/, label: 'keyword_research (.csv)' },
  { pattern: /^competitor_matrix_.*\.csv$/, label: 'competitor_matrix (.csv)' },
  { pattern: /^backlink_report_.*\.csv$/, label: 'backlink_report (.csv)' },
  { pattern: /^rank_tracking_.*\.csv$/, label: 'rank_tracking (.csv)' },
  { pattern: /^gsc_report_.*\.csv$/, label: 'gsc_report (.csv)' },
  { pattern: /^ga4_report_.*\.csv$/, label: 'ga4_report (.csv)' },
  { pattern: /^cwv_report_.*\.csv$/, label: 'cwv_report (.csv)' },
  { pattern: /^eeat_report_.*\.csv$/, label: 'eeat_report (.csv)' },
  { pattern: /^technical_seo_.*\.csv$/, label: 'technical_seo (.csv)' },
  { pattern: /^schema_report_.*\.csv$/, label: 'schema_report (.csv)' },
  { pattern: /^seo_dashboard_.*\.html$/, label: 'seo_dashboard (.html)' },
];

function checkDomain(domainPath, domainName) {
  const files = fs.readdirSync(domainPath);
  const issues = [];

  REQUIRED_PATTERNS.forEach(({ pattern, label }) => {
    const found = files.some(f => pattern.test(f));
    if (!found) issues.push(`  ❌ Missing: ${label}`);
  });

  return issues;
}

function isSeoExportDomain(files) {
  return REQUIRED_PATTERNS.some(({ pattern }) => files.some(f => pattern.test(f)));
}

function run() {
  if (!fs.existsSync(EXPORTS_DIR)) {
    console.error('❌ seo_exports/ not found:', EXPORTS_DIR);
    process.exit(1);
  }

  const allDirs = fs.readdirSync(EXPORTS_DIR).filter(d => {
    const full = path.join(EXPORTS_DIR, d);
    return fs.statSync(full).isDirectory() && !d.startsWith('_');
  });

  const skipped = [];
  const domains = allDirs.filter(d => {
    const full = path.join(EXPORTS_DIR, d);
    const files = fs.readdirSync(full);
    if (isSeoExportDomain(files)) return true;
    skipped.push(d);
    return false;
  });

  if (domains.length === 0) {
    console.log('ℹ️  No domains found in seo_exports/');
    process.exit(0);
  }

  console.log(`\n📋 SEOSONA OS — Audit Check`);
  console.log(`📁 ${EXPORTS_DIR}\n`);

  let totalIssues = 0;

  domains.forEach(domain => {
    const domainPath = path.join(EXPORTS_DIR, domain);
    const files = fs.readdirSync(domainPath);
    const issues = checkDomain(domainPath, domain);

    if (issues.length === 0) {
      console.log(`✅ ${domain} — ${files.length} files — COMPLETE`);
    } else {
      console.log(`⚠️  ${domain} — ${files.length} files — INCOMPLETE`);
      issues.forEach(i => console.log(i));
      totalIssues += issues.length;
    }
  });

  skipped.forEach(domain => {
    console.log(`[SKIP] ${domain} - no SEO export markers found`);
  });

  console.log('');

  if (totalIssues > 0) {
    console.log(`❌ ${totalIssues} issue(s) found. Run the audit workflow to fix.`);
    process.exit(1);
  } else {
    console.log(`✅ All ${domains.length} domain(s) complete. Ready to push.`);
    process.exit(0);
  }
}

run();
