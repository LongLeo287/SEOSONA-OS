#!/usr/bin/env node
/**
 * SEOSONA OS — Session End Hook
 *
 * Writes a session-end marker so the memory log shows where one working session stopped.
 *
 * Shares `transcript-hooks.jsonl` with memory-logger.cjs — deliberately NOT the Python logger's
 * `transcript.jsonl`, which serializes through its own lock file that these hooks don't honour.
 * Also drops the old full-file line count: it read the entire log just to produce a step number
 * that the ISO timestamp already implies.
 */
const fs = require('fs');
const path = require('path');
const os = require('os');

let isHookEnabled = () => true;
try {
  ({ isHookEnabled } = require('./lib/ck-config-utils.cjs'));
} catch { /* keep the permissive default */ }

const SEOSONA_LINK = path.join(os.homedir(), '.seosona');
let SEOSONA_ROOT = SEOSONA_LINK;
try {
  SEOSONA_ROOT = fs.realpathSync(SEOSONA_LINK);
} catch { /* link missing — fall back */ }

const MEMORY_LOG_DIR = path.join(SEOSONA_ROOT, '3_MEMORY', 'logs');
const TRANSCRIPT_PATH = path.join(MEMORY_LOG_DIR, 'transcript-hooks.jsonl');

try {
  if (isHookEnabled('session-end')) {
    const stdin = fs.readFileSync(0, 'utf8');
    const data = stdin ? JSON.parse(stdin) : {};

    fs.mkdirSync(MEMORY_LOG_DIR, { recursive: true });

    const event = {
      timestamp: new Date().toISOString(),
      source: 'HOOK',
      type: 'SESSION_END',
      status: 'DONE',
      content: `Session ended (${data.reason || 'unknown'}).`,
    };

    fs.appendFileSync(TRANSCRIPT_PATH, JSON.stringify(event) + '\n', 'utf8');
  }
} catch {
  // Silent fail — a logging problem must never surface at session teardown.
}

process.exit(0);
