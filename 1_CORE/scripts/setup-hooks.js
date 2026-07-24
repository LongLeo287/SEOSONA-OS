#!/usr/bin/env node
/**
 * SEOSONA OS — Setup Git Hooks
 * Runs automatically after: npm install
 * Installs pre-push hook to validate audit files before git push
 */

const fs = require('fs');
const path = require('path');
const { ensureJunction } = require('./lib/ensure-junction');

const REPO_ROOT = path.join(__dirname, '..', '..');
const HOOKS_DIR = path.join(REPO_ROOT, '.git', 'hooks');

// Portable-path root: make ~/.seosona point at this clone so every `~/.seosona/...` path (mcp,
// capability bridge, KIs, CLI connector) resolves on a fresh install. Best-effort — never fatal.
try {
  const r = ensureJunction(REPO_ROOT);
  if (r.status === 'created') console.log(`🔗 Portable root linked: ${r.link} -> ${r.target}`);
  else if (r.status === 'exists') console.log('🔗 Portable root ~/.seosona already linked.');
  else if (r.status === 'occupied') console.warn(`⚠️  ${r.link} exists as a real folder — left untouched. Remove it and rerun to enable portable paths.`);
  else if (r.status === 'error') console.warn(`⚠️  Could not link ~/.seosona: ${r.error}`);
} catch (e) {
  console.warn('⚠️  Portable-root link step skipped:', e.message);
}
const PRE_PUSH_PATH = path.join(HOOKS_DIR, 'pre-push');
const PRE_COMMIT_PATH = path.join(HOOKS_DIR, 'pre-commit');

const PRE_COMMIT_SCRIPT = `#!/bin/sh
# SEOSONA OS — pre-commit hook (auto-installed by npm postinstall)
# Blocks mass-deletion commits (external "sweep" / accidental git add -A).
# Override a real large deletion: SEOSONA_ALLOW_MASS_DELETE=1 git commit ...
node 1_CORE/scripts/integrity_guard.js || exit 1
exit 0
`;

const PRE_PUSH_SCRIPT = `#!/bin/sh
# SEOSONA OS — pre-push hook (auto-installed by npm postinstall)
# Validates audit completeness before push — only when audit data exists

EXPORTS_DIR="3_MEMORY/seo_exports"

# Skip check if no audit data has been generated yet
if [ ! -d "$EXPORTS_DIR" ] || [ -z "$(ls -A $EXPORTS_DIR 2>/dev/null)" ]; then
  exit 0
fi

echo ""
echo "🔍 SEOSONA OS — pre-push audit check..."

npm run audit:check --silent 2>/dev/null
if [ $? -ne 0 ]; then
  echo "❌ Audit check failed — some connector outputs are missing"
  echo "   Run: python scripts/run_full_audit.py --domain <yourdomain>"
  echo "   Or skip: git push --no-verify"
  exit 1
fi

echo "✅ All checks passed. Pushing..."
echo ""
exit 0
`;

try {
  if (!fs.existsSync(HOOKS_DIR)) {
    console.log('⚠️  .git/hooks not found — skipping hook install (not a git repo?)');
    process.exit(0);
  }

  // Never clobber a pre-existing non-SEOSONA hook (husky, custom, etc.) — overwriting would
  // silently destroy the developer's own hook. Only (re)install our own.
  const installHook = (hookPath, script, label) => {
    if (fs.existsSync(hookPath)) {
      const existing = fs.readFileSync(hookPath, 'utf8');
      if (!existing.includes('SEOSONA')) {
        console.warn(`⚠️  ${label}: a non-SEOSONA hook already exists — left untouched. Merge our check manually if you need both.`);
        return;
      }
    }
    fs.writeFileSync(hookPath, script, { mode: 0o755 });
    console.log(`✅ Git hook installed: ${label}`);
  };

  installHook(PRE_PUSH_PATH, PRE_PUSH_SCRIPT, '.git/hooks/pre-push');
  installHook(PRE_COMMIT_PATH, PRE_COMMIT_SCRIPT, '.git/hooks/pre-commit (integrity guard)');
} catch (err) {
  console.warn('⚠️  Could not install git hook:', err.message);
}
