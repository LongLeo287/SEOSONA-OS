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

const ALLOWED_DIRTY_RUNTIME_FILES = new Set([
  '3_MEMORY/logs/routing_decisions.json',
  '3_MEMORY/logs/website_seosona_session_log.md',
]);

function runGit(gitArgs, options = {}) {
  return execFileSync('git', gitArgs, {
    cwd: options.cwd || ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    maxBuffer: 10 * 1024 * 1024,
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
    execFileSync('git', ['check-ignore', '--no-index', '-q', target], { cwd: ROOT, stdio: 'ignore' });
    return true;
  } catch (_) {
    return false;
  }
}

function statusPath(line) {
  const match = line.match(/^(?:[ MADRCU?!]{1,2})\s+(.+)$/);
  return (match ? match[1] : line.slice(3)).replace(/\\/g, '/');
}

console.log('SEOSONA OS git push check');

try {
  const bridgePath = path.join(ROOT, '1_CORE', 'scripts', 'seosona_capability_bridge.js');
  execFileSync('node', [bridgePath, 'validate'], { cwd: ROOT, stdio: 'ignore' });
  pass('Capability Bridge Validation passed.');
} catch (error) {
  fail('Capability Bridge Validation failed. The SKILLS_ROUTER.md contains broken links or missing dependencies. Run "node 1_CORE/scripts/seosona_capability_bridge.js validate" to see details.');
}

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
    const entries = status.split(/\r?\n/).filter(Boolean);
    const unallowed = entries.filter((line) => {
      const relative = statusPath(line);
      return !ALLOWED_DIRTY_RUNTIME_FILES.has(relative);
    });

    if (unallowed.length === 0) {
      warn(`Working tree has ${entries.length} runtime log change(s) allowed outside commits`);
    } else {
      const message = `Working tree has ${unallowed.length} uncommitted non-runtime change(s)`;
      if (strict) fail(message);
      else warn(message);
    }
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
