# KI: 0x0a0d/fix-vietnamese-claude-code

## Overview
Fix Vietnamese IME compatibility issues in Claude Code.

## Tech Stack (from code)
- Python (3 files)
- JavaScript (2 files)
- TypeScript (1 files)
- **Total:** 13 files, 3 directories
- **File types:** .py: 3, .md: 2, .json: 2, .js: 2, .gitignore: 1, .ts: 1, .gitkeep: 1

## Dependencies

### Dev Dependencies
- `vitest`: ^4.0.17

## Imports Detected in Source
- `child_process`
- `fs`
- `https`
- `path`
- `vitest`

## Available Commands
- `npm run test` -- `vitest run`

## File Structure
```
  .gitignore
  CHANGELOG.md
  LICENSE
  README.md
  package-lock.json
  package.json
  patch-cli-claude-code.js
  patch-cli-claude-code.test.js
  vitest.config.ts
  .test-cache/
    .gitkeep
  scripts/
    test_scripts.py
    update_changelog.py
    update_readme.py
```

## Key Source Excerpts
### patch-cli-claude-code.js
```javascript
#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const DORK = '/* _0x0a0d_ime_fix_ */';
const FIXED_VERSION = '2.1.108';

function usage() {
    console.log(`
Usage:
  fix-vietnamese-claude-code [options]

Options:
  -f, --file <_path_>   Path to cli.js or claude file
  -d, --dry-run       Test without overwriting the file
  -o, --output <path>  Write patched content to a new file
  -h, --help          Show this help message

Description:
  This script patches Claude Code CLI tool to fix Vietnamese IME issues.
  If no file is specified, it will try to find it automatically.
!!!Note!!!
  CLAUDE CODE v${FIXED_VERSION}+ DOESN'T NEED TO PATCH ANYMORE.
    `);
}

function parseVersion(version) {
    const match = String(version || '').trim().match(/^(\d+)\.(\d+)\.(\d+)$/);
    if (!match) {
        return null;
    }

    return match.slice(1).map(Number);
}

function compareVersions(left, right) {
    const leftParts = parseVersion(left);
    const rightParts = parseVersion(right);

    if (!leftParts || !rightParts) {
        return null;
    }

    for (let i = 0; i < 3; i++) {
        if (leftParts[i] > rightParts[i]) {
            return 1;
        }
        if (leftParts[i] < rightParts[i]) {
            return -1;
        }
    }

    return 0;
}

function extractClaudeVersion(fileContent) {
    const versionMatch = fileContent.match(/\/\/ Version:\s*(\d+\.\d+\.\d+)\b/);
  
```

### patch-cli-claude-code.test.js
```javascript
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { patchContentJs, patchContentBinary, FIXED_VERSION, compareVersions } from './patch-cli-claude-code.js';
import { execSync } from 'child_process';

const MIN_VERSION_TEST = '2.0.64';

function getVersions(minVersion) {
    const versionPaths = minVersion.split('.').map(Number);
    if (versionPaths.length === 2) {
        versionPaths.push(0);
    } else if (versionPaths.length === 1) {
        versionPaths.push(0, 0);
    } else if (versionPaths.length > 3) {
        throw new Error('Invalid version format');
    }

    const versions = new Set();

    try {
        const output = execSync('npm view @anthropic-ai/claude-code versions --json').toString();
        const allVersions = JSON.parse(output);
        allVersions.forEach(v => versions.add(v));
    } catch (e) {
        console.error('Failed to fetch versions from npm, using fallback.');
        ['2.0.64', '2.1.38'].forEach(v => versions.add(v));
    }

    // If platform is not js, also check GCS for "latest" version which might be newer than NPM
    if (ONLY_PLATFORM && ONLY_PLATFORM !== 'js') {
        try {
            const gcsLatest = execSync('curl -s https://storage.googleapis.com/claude-code-dist-86c565f3-f756-42ad-8dfa-d59b1c096819/claude-code-releases/latest').toString().trim();
            if (gcsLatest && !versions.has(gcsLatest)) {
                console.log(`Adding latest GCS 
```

### vitest.config.ts
```typescript
export default {
  test: {
    maxConcurrency: 4,
    threads: true,
    isolate: true,
    testTimeout: 30000,
  },
}

```

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.
