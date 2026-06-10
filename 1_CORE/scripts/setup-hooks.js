#!/usr/bin/env node
/**
 * SEOSONA OS — Setup Git Hooks
 * Runs automatically after: npm install
 * Installs pre-push hook to validate audit files before git push
 */

const fs = require('fs');
const path = require('path');

const HOOKS_DIR = path.join(__dirname, '..', '..', '.git', 'hooks');
const PRE_PUSH_PATH = path.join(HOOKS_DIR, 'pre-push');

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

  fs.writeFileSync(PRE_PUSH_PATH, PRE_PUSH_SCRIPT, { mode: 0o755 });
  console.log('✅ Git hook installed: .git/hooks/pre-push');
} catch (err) {
  console.warn('⚠️  Could not install git hook:', err.message);
}
