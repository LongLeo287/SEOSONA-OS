#!/usr/bin/env node
/**
 * Tests for env-loader.cjs
 * Run: node env-loader.test.cjs
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const assert = require('assert');

const {
  parseEnvFile,
  loadEnv,
  getEnv,
  getEnvMultiple,
  validateEnv,
  clearCache,
  getLoadedEnv,
} = require('./env-loader.cjs');

// Test utilities
let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    testsPassed++;
  } catch (error) {
    console.error(`✗ ${name}`);
    console.error(`  ${error.message}`);
    testsFailed++;
  }
}

function assertEqual(actual, expected, message = '') {
  if (actual !== expected) {
    throw new Error(
      `${message}\nExpected: ${JSON.stringify(expected)}\nActual: ${JSON.stringify(actual)}`
    );
  }
}

function assertDeepEqual(actual, expected, message = '') {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      `${message}\nExpected: ${JSON.stringify(expected)}\nActual: ${JSON.stringify(actual)}`
    );
  }
}

// Setup: Create temp .env files for testing
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'env-loader-test-'));
const originalHome = process.env.HOME;

function setup() {
  // Override HOME to use temp directory
  process.env.HOME = tempDir;

  // Create directory structure
  fs.mkdirSync(path.join(tempDir, '.claude'), { recursive: true });
  fs.mkdirSync(path.join(tempDir, '.claude', 'skills'), { recursive: true });
  fs.mkdirSync(path.join(tempDir, '.claude', 'skills', 'test-skill'), {
    recursive: true,
  });

  // Create .env files with different values to test priority
  fs.writeFileSync(
    path.join(tempDir, '.claude', '.env'),
    'GLOBAL_VAR=global\nSHARED_VAR=global\nSKILL_VAR=global\n'
  );

  fs.writeFileSync(
    path.join(tempDir, '.claude', 'skills', '.env'),
    'SHARED_VAR=shared\nSKILL_VAR=shared\n'
  );

  fs.writeFileSync(
    path.join(tempDir, '.claude', 'skills', 'test-skill', '.env'),
    'SKILL_VAR=skill-specific\n'
  );

  clearCache();
}

function cleanup() {
  process.env.HOME = originalHome;
  fs.rmSync(tempDir, { recursive: true, force: true });
  clearCache();
}

// Tests
console.log('\n=== env-loader.cjs Tests ===\n');

// Test parseEnvFile
test('parseEnvFile: parses simple key=value', () => {
  const result = parseEnvFile('KEY=value');
  assertEqual(result.KEY, 'value');
});

test('parseEnvFile: handles empty lines and comments', () => {
  const result = parseEnvFile(`
# This is a comment
KEY1=value1

# Another comment
KEY2=value2
`);
  assertEqual(result.KEY1, 'value1');
  assertEqual(result.KEY2, 'value2');
  assertEqual(Object.keys(result).length, 2);
});

test('parseEnvFile: handles double-quoted values', () => {
  const result = parseEnvFile('KEY="value with spaces"');
  assertEqual(result.KEY, 'value with spaces');
});

test('parseEnvFile: handles single-quoted values', () => {
  const result = parseEnvFile("KEY='value with spaces'");
  assertEqual(result.KEY, 'value with spaces');
});

test('parseEnvFile: handles values with = sign', () => {
  const result = parseEnvFile('KEY=value=with=equals');
  assertEqual(result.KEY, 'value=with=equals');
});

test('parseEnvFile: handles escape sequences in double quotes', () => {
  const result = parseEnvFile('KEY="line1\\nline2"');
  assertEqual(result.KEY, 'line1\nline2');
});

test('parseEnvFile: preserves escape sequences in single quotes', () => {
  const result = parseEnvFile("KEY='line1\\nline2'");
  assertEqual(result.KEY, 'line1\\nline2');
});

// Test priority loading
setup();

test('loadEnv: loads global .env', () => {
  clearCache();
  loadEnv(null);
  assertEqual(getEnv('GLOBAL_VAR'), 'global');
});

test('loadEnv: shared .env overrides global', () => {
  clearCache();
  loadEnv(null);
  assertEqual(getEnv('SHARED_VAR'), 'shared');
});

test('loadEnv: skill .env overrides shared', () => {
  clearCache();
  loadEnv('test-skill');
  assertEqual(getEnv('SKILL_VAR'), 'skill-specific');
});

test('loadEnv: process.env has highest priority', () => {
  clearCache();
  process.env.SKILL_VAR = 'from-process-env';
  loadEnv('test-skill');
  assertEqual(getEnv('SKILL_VAR'), 'from-process-env');
  delete process.env.SKILL_VAR;
});

test('getEnv: returns default value if not found', () => {
  clearCache();
  loadEnv('test-skill');
  assertEqual(getEnv('NONEXISTENT', 'default'), 'default');
});

test('getEnv: returns undefined if not found and no default', () => {
  clearCache();
  loadEnv('test-skill');
  assertEqual(getEnv('NONEXISTENT'), undefined);
});

test('getEnvMultiple: returns multiple values', () => {
  clearCache();
  loadEnv('test-skill');
  const result = getEnvMultiple(['GLOBAL_VAR', 'SHARED_VAR', 'SKILL_VAR']);
  assertEqual(result.GLOBAL_VAR, 'global');
  assertEqual(result.SHARED_VAR, 'shared');
  assertEqual(result.SKILL_VAR, 'skill-specific');
});

test('validateEnv: returns valid when all keys present', () => {
  clearCache();
  loadEnv('test-skill');
  const result = validateEnv(['GLOBAL_VAR', 'SHARED_VAR']);
  assertEqual(result.valid, true);
  assertEqual(result.missing.length, 0);
});

test('validateEnv: returns missing keys', () => {
  clearCache();
  loadEnv('test-skill');
  const result = validateEnv(['GLOBAL_VAR', 'MISSING_KEY']);
  assertEqual(result.valid, false);
  assertDeepEqual(result.missing, ['MISSING_KEY']);
});

test('clearCache: clears loaded env', () => {
  loadEnv('test-skill');
  clearCache();
  assertDeepEqual(getLoadedEnv(), {});
});

test('getLoadedEnv: returns copy of cached env', () => {
  clearCache();
  loadEnv('test-skill');
  const env = getLoadedEnv();
  env.NEW_KEY = 'should not affect cache';
  assertEqual(getLoadedEnv().NEW_KEY, undefined);
});

// Cleanup
cleanup();

// Summary
console.log('\n=== Test Summary ===');
console.log(`Passed: ${testsPassed}`);
console.log(`Failed: ${testsFailed}`);

if (testsFailed > 0) {
  process.exit(1);
}
