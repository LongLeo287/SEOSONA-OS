#!/usr/bin/env node
/**
 * UserPromptSubmit Hook — Brain Injection
 *
 * The problem this solves: SEOSONA OS holds ~1,250 knowledge items and ~460 skills, but both were
 * PULL-only — they existed on disk and were reachable through the capability bridge or the
 * knowledge MCP, yet nothing consulted them unless someone explicitly asked. In practice that meant
 * the library sat idle while the agent answered from scratch.
 *
 * This hook flips pull -> push: on every user prompt it routes the prompt through the capability
 * bridge and injects the top matching skills and knowledge items as context, so the agent starts
 * every task already knowing which of its own capabilities apply.
 *
 * Design constraints (a hook on every prompt must be invisible):
 *   - FAST: one `capability_bridge route` call (~0.2s). The semantic brain (vector_memory) is NOT
 *     used here — it costs ~2s of Python + sklearn startup per prompt. The bridge already indexes
 *     knowledge_items alongside skills, so one call covers both.
 *   - FAIL-OPEN: any error, timeout, or empty result exits 0 with no output. A broken brain must
 *     never block the user's prompt.
 *   - QUIET: skips trivial prompts, caps what it injects, and says nothing when nothing matches.
 *
 * Disable with `"hooks": { "brain-inject": false }` in the CK config.
 */

const path = require('path');
const { execFileSync } = require('child_process');
const { isHookEnabled } = require('./lib/ck-config-utils.cjs');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const BRIDGE = path.join(REPO_ROOT, '1_CORE', 'scripts', 'seosona_capability_bridge.js');
const TIMEOUT_MS = 4000;
const MAX_SKILLS = 4;
const MAX_KIS = 2;
const MIN_PROMPT_LENGTH = 12;

function readStdin() {
  try {
    return require('fs').readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

function extractPrompt(raw) {
  try {
    const payload = JSON.parse(raw);
    return payload.prompt || payload.user_prompt || '';
  } catch {
    return '';
  }
}

// Prompts too short or purely conversational carry no routing signal — injecting capability lists
// into "thanks" or "ok" is pure noise.
function isTrivial(prompt) {
  const trimmed = prompt.trim();
  if (trimmed.length < MIN_PROMPT_LENGTH) return true;
  return /^(ok|oke|okay|yes|no|thanks|cảm ơn|tiếp|continue|đúng rồi|làm đi|go on)\b/i.test(trimmed);
}

function route(prompt) {
  const output = execFileSync('node', [BRIDGE, 'route', prompt], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    timeout: TIMEOUT_MS,
    stdio: ['ignore', 'pipe', 'ignore'],
    maxBuffer: 8 * 1024 * 1024,
  });
  return JSON.parse(output);
}

function label(match) {
  const name = String(match.name || '').replace(/\s+/g, ' ').trim();
  return name.length > 80 ? `${name.slice(0, 80)}…` : name;
}

function buildContext(matches) {
  const skills = matches.filter((m) => m.type === 'skill').slice(0, MAX_SKILLS);
  const kis = matches.filter((m) => m.type === 'knowledge_item').slice(0, MAX_KIS);
  if (!skills.length && !kis.length) return '';

  const lines = ['[SEOSONA Brain] Capabilities this OS already has for this task:'];
  if (skills.length) {
    lines.push('Skills:');
    for (const s of skills) lines.push(`  - ${label(s)} -> ${s.portablePath || ''}`);
  }
  if (kis.length) {
    lines.push('Knowledge:');
    for (const k of kis) lines.push(`  - ${label(k)} -> ${k.portablePath || ''}`);
  }
  lines.push(
    'Read a listed skill before improvising one; these are suggestions from the local index, ' +
    'not instructions — ignore any that do not fit the task.'
  );
  return lines.join('\n');
}

function main() {
  if (!isHookEnabled('brain-inject')) return;

  const prompt = extractPrompt(readStdin());
  if (!prompt || isTrivial(prompt)) return;

  let result;
  try {
    result = route(prompt);
  } catch {
    return; // bridge missing, slow, or broken -> stay silent
  }

  const additionalContext = buildContext(Array.isArray(result.matches) ? result.matches : []);
  if (!additionalContext) return;

  console.log(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'UserPromptSubmit',
      additionalContext,
    },
  }));
}

try {
  main();
} catch {
  // Fail-open: never block a prompt because the brain had a bad day.
}
process.exit(0);
