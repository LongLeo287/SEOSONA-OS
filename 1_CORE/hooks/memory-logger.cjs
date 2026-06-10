#!/usr/bin/env node
/**
 * SEOSONA OS — Memory Logger Hook (PostToolUse)
 * Fires after Write/Edit operations to auto-log significant changes
 * to 3_MEMORY/logs/transcript.jsonl
 *
 * Only logs substantive file writes (>200 bytes) to avoid noise.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const SEOSONA_ROOT = path.join(os.homedir(), '.seosona');
const MEMORY_LOG_DIR = path.join(SEOSONA_ROOT, '3_MEMORY', 'logs');
const TRANSCRIPT_PATH = path.join(MEMORY_LOG_DIR, 'transcript.jsonl');

function main() {
  try {
    const stdin = fs.readFileSync(0, 'utf8');
    const hookData = stdin ? JSON.parse(stdin) : {};
    const toolName = hookData.tool_name || '';
    const toolInput = hookData.tool_input || {};

    // Only track substantive file write operations
    const trackTools = ['Write', 'Edit', 'MultiEdit'];
    if (!trackTools.includes(toolName)) {
      process.exit(0);
    }

    const filePath = toolInput.file_path || toolInput.path || 'unknown';
    const content = toolInput.content || toolInput.new_string || '';

    // Skip small edits (< 200 chars) — noise reduction
    if (content.length < 200) {
      process.exit(0);
    }

    // Skip memory log files themselves to prevent recursion
    if (filePath.includes('3_MEMORY') || filePath.includes('transcript')) {
      process.exit(0);
    }

    // Ensure memory dir exists
    if (!fs.existsSync(MEMORY_LOG_DIR)) {
      fs.mkdirSync(MEMORY_LOG_DIR, { recursive: true });
    }

    // Get step index
    let stepIndex = 0;
    if (fs.existsSync(TRANSCRIPT_PATH)) {
      const lines = fs.readFileSync(TRANSCRIPT_PATH, 'utf8').split('\n').filter(Boolean);
      stepIndex = lines.length;
    }

    const event = {
      step_index: stepIndex,
      timestamp: new Date().toISOString(),
      source: 'SYSTEM',
      type: `TOOL_USE:${toolName}`,
      status: 'DONE',
      content: `[Auto-logged] ${toolName} → ${path.basename(filePath)} (${content.length} chars)`,
      file_path: filePath
    };

    fs.appendFileSync(TRANSCRIPT_PATH, JSON.stringify(event) + '\n', 'utf8');

  } catch (e) {
    // Silent fail — never block AI operation
  }

  process.exit(0);
}

main();
