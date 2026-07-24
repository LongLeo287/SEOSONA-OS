#!/usr/bin/env node
/**
 * SEOSONA OS — commit integrity guard.
 *
 * Blocks a commit that would delete an abnormally large number of tracked files — the
 * signature of an external agent's destructive "sweep", or an accidental `git add -A` that
 * swept in a concurrent process's deletions. This is the defense that was missing when the
 * repo was repeatedly gutted (whole knowledge base / daemon subsystem deleted and pushed).
 *
 * Installed as a pre-commit hook by setup-hooks.js. A legitimate large deletion (e.g. a real
 * de-bloat) is still allowed — just make it explicit:
 *
 *     SEOSONA_ALLOW_MASS_DELETE=1 git commit ...      (or: git commit --no-verify)
 */
const { execFileSync } = require('child_process');

const MAX_DELETIONS = 40; // total staged deletions before we stop and ask
const CRITICAL_DIRS = ['1_CORE', '2_KNOWLEDGE/frameworks', '3_MEMORY/knowledge_items', '4_AGENTS'];
const CRITICAL_DIR_MAX = 15; // deletions within a single critical dir before we stop

function git(args) {
  try {
    return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch {
    return '';
  }
}

if (process.env.SEOSONA_ALLOW_MASS_DELETE === '1') process.exit(0);

const deleted = git(['diff', '--cached', '--name-only', '--diff-filter=D'])
  .split(/\r?\n/)
  .filter(Boolean);

if (deleted.length === 0) process.exit(0);

const critical = {};
for (const dir of CRITICAL_DIRS) {
  const n = deleted.filter((f) => f === dir || f.startsWith(`${dir}/`)).length;
  if (n > 0) critical[dir] = n;
}
const worstCritical = Object.entries(critical).find(([, n]) => n > CRITICAL_DIR_MAX);

if (deleted.length > MAX_DELETIONS || worstCritical) {
  process.stderr.write('\n\u{1F6E1}️  SEOSONA integrity guard: this commit deletes a lot of tracked files.\n\n');
  process.stderr.write(`   Staged deletions: ${deleted.length}\n`);
  for (const [dir, n] of Object.entries(critical)) {
    process.stderr.write(`     - ${dir}/: ${n}\n`);
  }
  process.stderr.write('\n   That is the signature of an external "sweep", or an accidental `git add -A`\n');
  process.stderr.write('   that swept in another process\'s deletions. Inspect what is going:\n');
  process.stderr.write('     git diff --cached --name-only --diff-filter=D\n\n');
  process.stderr.write('   If the deletions are genuinely intended, re-run explicitly:\n');
  process.stderr.write('     SEOSONA_ALLOW_MASS_DELETE=1 git commit ...   (or git commit --no-verify)\n\n');
  process.exit(1);
}

process.exit(0);
