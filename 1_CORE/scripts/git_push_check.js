#!/usr/bin/env node
/**
 * Git push readiness checks for SEOSONA OS.
 *
 * Default mode verifies repository safety and warns about dirty state.
 * Strict mode fails when the working tree is dirty and can optionally run
 * a remote dry-run push.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const args = new Set(process.argv.slice(2));
const strict = args.has('--strict');
const dryRun = args.has('--dry-run');

let failures = 0;
let warnings = 0;

function runGit(gitArgs, options = {}) {
  return execFileSync('git', gitArgs, {
    cwd: options.cwd || ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
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

function walkForNestedGit(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (entry.name === '.git' && dir !== ROOT) {
      results.push(dir);
      continue;
    }
    if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === '__pycache__') {
      continue;
    }
    walkForNestedGit(path.join(dir, entry.name), results);
  }
  return results;
}

function isIgnored(target) {
  try {
    execFileSync('git', ['check-ignore', '-q', target], { cwd: ROOT, stdio: 'ignore' });
    return true;
  } catch (_) {
    return false;
  }
}

console.log('SEOSONA OS git push check');

try {
  const top = runGit(['rev-parse', '--show-toplevel']);
  if (path.resolve(top) !== ROOT) {
    fail('Git top-level does not match the SEOSONA OS root');
  } else {
    pass('Git top-level matches system root');
  }
} catch (error) {
  fail(`Not a Git repository: ${error.message}`);
}

try {
  const branch = runGit(['branch', '--show-current']) || '(detached)';
  const remote = runGit(['remote', 'get-url', '--push', 'origin']);
  pass(`Current branch: ${branch}`);
  pass(`Origin push remote: ${remote.replace(/\/\/.*@/, '//***@')}`);
} catch (error) {
  fail(`Missing Git branch or origin remote: ${error.message}`);
}

try {
  const status = runGit(['status', '--porcelain']);
  if (status) {
    const count = status.split(/\r?\n/).filter(Boolean).length;
    const message = `Working tree has ${count} uncommitted change(s)`;
    if (strict) fail(message);
    else warn(message);
  } else {
    pass('Working tree clean');
  }
} catch (error) {
  fail(`Unable to read Git status: ${error.message}`);
}

for (const nested of walkForNestedGit(ROOT)) {
  const relative = path.relative(ROOT, nested).replace(/\\/g, '/');
  if (isIgnored(relative)) {
    pass(`Nested repository is ignored: ${relative}`);
  } else {
    fail(`Nested repository is not ignored and could pollute push scope: ${relative}`);
  }
}

if (dryRun && failures === 0) {
  try {
    runGit(['push', '--dry-run', 'origin', 'HEAD']);
    pass('Git push dry-run succeeded');
  } catch (error) {
    fail(`Git push dry-run failed: ${error.message}`);
  }
}

if (failures > 0) {
  console.error(`Git push check failed: ${failures} failure(s), ${warnings} warning(s)`);
  process.exit(1);
}

console.log(`Git push check passed: ${warnings} warning(s)`);
