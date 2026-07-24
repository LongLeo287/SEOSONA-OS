#!/bin/bash
# =============================================================================
#  Browser Search — Dependency Setup
# =============================================================================
#  Installs npm dependencies for CloakBrowser (cloakbrowser + playwright-core).
#
#  USAGE:
#    bash scripts/setup.sh
# =============================================================================

set -euo pipefail

SKILL_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "=== Browser Search — Dependency Setup ==="
echo "Skill dir: $SKILL_DIR"
echo ""

cd "$SKILL_DIR"

# Install npm dependencies
if [ -f package.json ]; then
  echo "Installing npm packages..."
  npm install
  echo "  ✅ npm dependencies installed"
else
  echo "  ❌ package.json not found in $SKILL_DIR"
  exit 1
fi

# Ensure CloakBrowser binary
echo ""
echo "Ensuring CloakBrowser Chromium binary..."
node -e "
import('cloakbrowser').then(c => {
  c.ensureBinary().then(() => console.log('  ✅ Chromium binary ready'));
}).catch(e => { console.error('  ❌ Failed:', e.message); process.exit(1); });
" 2>&1 || {
  echo "  ⚠️  Could not verify Chromium binary. Run manually:"
  echo "     node -e \"import('cloakbrowser').then(c => c.ensureBinary())\""
}

echo ""
echo "=== Setup complete ==="
echo "Run 'node scripts/cloak/cloak-fetch.mjs --help' to verify."
