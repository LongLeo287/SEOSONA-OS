#!/usr/bin/env node
/**
 * SEOSONA OS — Memory Logger Hook (PostToolUse)
 *
 * Records substantive file writes so the OS keeps a durable trace of what changed, beyond the
 * chat transcript. Fires on Write/Edit/NotebookEdit.
 *
 * Two things this deliberately does NOT do, both learned from auditing the original version:
 *
 *   1. It does not share `transcript.jsonl` with `1_CORE/scripts/memory_logger.py`. That writer
 *      serializes through `transcript.jsonl.lock`; this hook did not, so the two could interleave
 *      partial lines. Separate files, separate owners — no lock protocol to keep in sync.
 *   2. It does not compute a step index by reading the whole log. The original read and split the
 *      entire file on EVERY edit just to count lines: O(n^2) over the file's life, a blocking
 *      multi-megabyte read on the hottest hook path. The ISO timestamp already orders events.
 *
 * Paths are logged relative to the repo so the log never records the machine's directory layout.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Fail-open even if the config helper is missing: a broken lib must not take down tool calls.
let isHookEnabled = () => true;
try {
  ({ isHookEnabled } = require('./lib/ck-config-utils.cjs'));
} catch { /* keep the permissive default */ }

// Resolve the junction: ~/.seosona lives on C: while the repo may sit on D:, and path.relative()
// cannot produce a relative path across drives — it would silently hand back the absolute path,
// defeating the point of relativizing at all.
const SEOSONA_LINK = path.join(os.homedir(), '.seosona');
let SEOSONA_ROOT = SEOSONA_LINK;
try {
  SEOSONA_ROOT = fs.realpathSync(SEOSONA_LINK);
} catch { /* link missing — fall back to the link path */ }

const MEMORY_LOG_DIR = path.join(SEOSONA_ROOT, '3_MEMORY', 'logs');
const TRANSCRIPT_PATH = path.join(MEMORY_LOG_DIR, 'transcript-hooks.jsonl');
const MIN_CONTENT_CHARS = 200;

function main() {
  try {
    if (!isHookEnabled('memory-logger')) process.exit(0);

    const stdin = fs.readFileSync(0, 'utf8');
    const hookData = stdin ? JSON.parse(stdin) : {};
    const toolName = hookData.tool_name || '';
    const toolInput = hookData.tool_input || {};

    const trackTools = ['Write', 'Edit', 'NotebookEdit'];
    if (!trackTools.includes(toolName)) process.exit(0);

    const filePath = toolInput.file_path || toolInput.path || '';
    const content = toolInput.content || toolInput.new_string || '';

    // Skip small edits — noise reduction.
    if (content.length < MIN_CONTENT_CHARS) process.exit(0);

    // Never log writes to the log directory itself (recursion). Scoped to the log dir only, so
    // real work under 3_MEMORY/ (knowledge_items, specs) is still recorded.
    const resolved = path.resolve(filePath);
    if (resolved.startsWith(path.resolve(MEMORY_LOG_DIR))) process.exit(0);

    fs.mkdirSync(MEMORY_LOG_DIR, { recursive: true });

    // Relative to the repo root when possible — an absolute path would record the machine's
    // directory structure (and client/project names) into a file on disk.
    let relPath = filePath;
    try {
      const rel = path.relative(SEOSONA_ROOT, resolved);
      if (rel && !rel.startsWith('..')) relPath = rel.replace(/\\/g, '/');
    } catch { /* keep the original */ }

    const event = {
      timestamp: new Date().toISOString(),
      source: 'HOOK',
      type: `TOOL_USE:${toolName}`,
      status: 'DONE',
      content: `[Auto-logged] ${toolName} -> ${path.basename(filePath)} (${content.length} chars)`,
      file_path: relPath,
    };

    fs.appendFileSync(TRANSCRIPT_PATH, JSON.stringify(event) + '\n', 'utf8');
  } catch {
    // Silent fail — never block an AI operation because logging had a problem.
  }

  process.exit(0);
}

main();
