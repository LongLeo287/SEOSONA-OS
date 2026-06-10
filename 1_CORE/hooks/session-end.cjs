#!/usr/bin/env node
/**
 * SEOSONA OS — Session End Hook
 * Fires when session is cleared. Writes a clean session-end summary to memory.
 */
const fs = require('fs');
const path = require('path');
const os = require('os');

const SEOSONA_ROOT = path.join(os.homedir(), '.seosona');
const MEMORY_LOG_DIR = path.join(SEOSONA_ROOT, '3_MEMORY', 'logs');
const TRANSCRIPT_PATH = path.join(MEMORY_LOG_DIR, 'transcript.jsonl');

try {
  const stdin = fs.readFileSync(0, 'utf8');
  const data = stdin ? JSON.parse(stdin) : {};

  if (!fs.existsSync(MEMORY_LOG_DIR)) {
    fs.mkdirSync(MEMORY_LOG_DIR, { recursive: true });
  }

  let stepIndex = 0;
  if (fs.existsSync(TRANSCRIPT_PATH)) {
    stepIndex = fs.readFileSync(TRANSCRIPT_PATH, 'utf8').split('\n').filter(Boolean).length;
  }

  const event = {
    step_index: stepIndex,
    timestamp: new Date().toISOString(),
    source: 'SYSTEM',
    type: 'SESSION_END',
    status: 'DONE',
    content: `Session ended (${data.reason || 'clear'}). Total logged steps: ${stepIndex}.`
  };

  fs.appendFileSync(TRANSCRIPT_PATH, JSON.stringify(event) + '\n', 'utf8');
} catch (e) {
  // Silent fail
}

process.exit(0);
