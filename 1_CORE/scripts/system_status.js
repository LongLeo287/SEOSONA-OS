#!/usr/bin/env node
/**
 * SEOSONA OS system status check.
 *
 * This checks core OS health. SEO export completeness remains a separate
 * command because client/domain exports are not the same as system health.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');

let failures = 0;
let warnings = 0;

function rel(target) {
  return path.relative(ROOT, target).replace(/\\/g, '/');
}

function pass(message) {
  console.log(`[OK] ${message}`);
}

function warn(message) {
  warnings += 1;
  console.warn(`[WARN] ${message}`);
}

function fail(message) {
  failures += 1;
  console.error(`[FAIL] ${message}`);
}

function exists(relativePath, kind = 'file') {
  const target = path.join(ROOT, relativePath);
  if (!fs.existsSync(target)) {
    fail(`Missing ${kind}: ${relativePath}`);
    return false;
  }
  pass(`Found ${kind}: ${relativePath}`);
  return true;
}

function readJson(relativePath) {
  const target = path.join(ROOT, relativePath);
  try {
    return JSON.parse(fs.readFileSync(target, 'utf8'));
  } catch (error) {
    fail(`Invalid JSON in ${relativePath}: ${error.message}`);
    return null;
  }
}

function git(args) {
  return execFileSync('git', args, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function checkCoreFiles() {
  exists('package.json');
  exists('1_CORE/SOUL.md');
  exists('2_KNOWLEDGE/MASTER_INDEX.md');
  exists('2_KNOWLEDGE/SKILLS_ROUTER.md');
  exists('3_MEMORY/knowledge_items', 'directory');
  exists('4_AGENTS', 'directory');
}

function checkPackageScripts() {
  const pkg = readJson('package.json');
  if (!pkg) return;
  const scripts = pkg.scripts || {};
  const required = ['status', 'status:system', 'status:seo', 'git:check'];
  for (const script of required) {
    if (scripts[script]) pass(`npm script available: ${script}`);
    else fail(`Missing npm script: ${script}`);
  }
  if (scripts.status && scripts.status.includes('audit:check')) {
    fail('npm run status must not be an alias for SEO export audit');
  }
}

function checkRouter() {
  const routerPath = path.join(ROOT, '2_KNOWLEDGE', 'SKILLS_ROUTER.md');
  if (!fs.existsSync(routerPath)) return;
  const router = fs.readFileSync(routerPath, 'utf8');
  const routeCount = (router.match(/-> `frameworks\//g) || []).length;
  if (routeCount < 1) fail('SKILLS_ROUTER has no framework routes');
  else pass(`SKILLS_ROUTER routes: ${routeCount}`);
}

function checkCapabilityBridge() {
  exists('1_CORE/PORTABLE_CAPABILITY_CONTRACT.md');
  exists('1_CORE/scripts/seosona_capability_bridge.js');

  try {
    const output = execFileSync('node', ['1_CORE/scripts/seosona_capability_bridge.js', 'validate'], {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    const result = JSON.parse(output);
    if (!result.ok) {
      fail(`Capability bridge validation failed: ${result.errors.join('; ')}`);
      return;
    }
    pass(`Capability bridge valid: ${result.resourceCount} resources, ${result.capabilityCount} skills`);
  } catch (error) {
    fail(`Capability bridge validation failed: ${error.message}`);
  }
}

function checkConfig() {
  if (fs.existsSync(path.join(ROOT, '1_CONFIG', '.env'))) {
    pass('Local config present: 1_CONFIG/.env');
  } else {
    warn('Local config missing: 1_CONFIG/.env');
  }
}

function checkGit() {
  try {
    const branch = git(['branch', '--show-current']) || '(detached)';
    const origin = git(['remote', 'get-url', '--push', 'origin']);
    pass(`Git branch: ${branch}`);
    pass(`Git origin push remote configured: ${origin.replace(/\/\/.*@/, '//***@')}`);
    const dirty = git(['status', '--porcelain']);
    if (dirty) warn('Git working tree has uncommitted changes');
    else pass('Git working tree clean');
  } catch (error) {
    warn(`Git check skipped or incomplete: ${error.message}`);
  }
}

function checkIngestionCleanup() {
  const disallowedCloneRoots = [
    path.join(ROOT, '5_RESEARCH', 'repositories'),
    path.join(ROOT, '3_MEMORY', 'ingestion_zone', 'repo_analysis'),
    path.join(ROOT, '3_MEMORY', 'ingestion_zone', 'repo_batch_skill_ecosystem'),
  ];

  for (const cloneRoot of disallowedCloneRoots) {
    if (fs.existsSync(cloneRoot)) {
      fail(`Temporary clone folder must be cleaned up: ${rel(cloneRoot)}`);
    } else {
      pass(`Temporary clone folder absent: ${rel(cloneRoot)}`);
    }
  }

  const ingestionZone = path.join(ROOT, '3_MEMORY', 'ingestion_zone');
  if (!fs.existsSync(ingestionZone)) return;
  const stack = [ingestionZone];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory() && entry.name === '.git') {
        fail(`Temporary Git clone remains in ingestion zone: ${rel(path.dirname(full))}`);
      } else if (entry.isDirectory()) {
        stack.push(full);
      }
    }
  }
}

console.log('SEOSONA OS system status');
console.log(`Root: ${rel(ROOT) || '.'}`);
console.log('');

checkCoreFiles();
checkPackageScripts();
checkRouter();
checkCapabilityBridge();
checkConfig();
checkGit();
checkIngestionCleanup();

console.log('');
if (failures > 0) {
  console.error(`System status failed: ${failures} failure(s), ${warnings} warning(s)`);
  process.exit(1);
}

console.log(`System status passed: ${warnings} warning(s)`);
