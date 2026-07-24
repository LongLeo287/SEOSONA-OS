#!/usr/bin/env node
/**
 * SEOSONA OS — Pre-Compact Marker Hook
 * Writes a compact marker to memory before context is compressed.
 * Ensures AI knows a compaction occurred and should re-verify approval state.
 */
const fs = require('fs');
const path = require('path');
const os = require('os');

const SEOSONA_ROOT = path.join(os.homedir(), '.seosona');
const MEMORY_LOG_DIR = path.join(SEOSONA_ROOT, '3_MEMORY', 'logs');
const COMPACT_MARKER = path.join(MEMORY_LOG_DIR, 'last_compact.json');

try {
  const stdin = fs.readFileSync(0, 'utf8');
  const data = stdin ? JSON.parse(stdin) : {};

  if (!fs.existsSync(MEMORY_LOG_DIR)) {
    fs.mkdirSync(MEMORY_LOG_DIR, { recursive: true });
  }

  const marker = {
    timestamp: new Date().toISOString(),
    trigger: data.trigger || 'unknown',
    warning: 'Context was compacted. Re-verify any pending user approvals before proceeding.'
  };

  fs.writeFileSync(COMPACT_MARKER, JSON.stringify(marker, null, 2), 'utf8');
  console.log('[SEOSONA] Compact marker written to 3_MEMORY/logs/last_compact.json');
} catch (e) {
  // Silent fail - never block AI
}

process.exit(0);
