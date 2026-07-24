#!/bin/bash
# =============================================================================
#  check.sh — Browser Search health check
# =============================================================================
#
#  Verifies the status of browser-search components:
#    - Docker accessibility
#    - SearXNG container (health check)
#    - Camofox container (health check)
#    - CloakBrowser npm module
#
#  USAGE:
#    ./scripts/check.sh
#    ./scripts/check.sh --help
# =============================================================================

set -euo pipefail

SCRIPT_NAME="$(basename "$0")"
CAMOFOX_CONTAINER="camofox-browser"
SEARXNG_CONTAINER="searxng"

PASSED=true

# ── Colors ──
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

ok()   { echo -e "[${GREEN}OK${NC}] $1"; }
warn() { echo -e "[${YELLOW}⚠${NC}] $1"; }
fail() { echo -e "[${RED}✗${NC}] $1"; PASSED=false; }
info() { echo -e "[${CYAN}i${NC}] $1"; }
sep()  { echo ""; }

show_help() {
    sed -n '3,/^$/p' "$0" | sed 's/^# \?//g'
    exit 0
}

# ── Parse args ──
for arg in "$@"; do
    case "$arg" in
        --help) show_help ;;
    esac
done

# ─────────────────────────────────────────────────────────────────
#  HEADER
# ─────────────────────────────────────────────────────────────────
echo "=================================================="
echo "  Browser Search — Health Check"
echo "=================================================="
echo "  $(date '+%Y-%m-%d %H:%M:%S')"
echo "=================================================="
echo ""

# ═════════════════════════════════════════════════════════════════
#  SECTION 1 — Docker
# ═════════════════════════════════════════════════════════════════
echo "─── Docker ───"
if docker --version >/dev/null 2>&1; then
    DOCKER_VER=$(docker --version 2>/dev/null | awk '{print $3}' | tr -d ',')
    ok "Docker $DOCKER_VER"
else
    fail "Docker not installed or not accessible"
    warn "SearXNG and Camofox require Docker"
fi
sep

# ═════════════════════════════════════════════════════════════════
#  SECTION 2 — SearXNG
# ═════════════════════════════════════════════════════════════════
echo "─── SearXNG ───"

if docker ps --filter "name=$SEARXNG_CONTAINER" --filter "status=running" -q 2>/dev/null | grep -q .; then
    HEALTH=$(curl -s --max-time 10 "http://localhost:8080/search?format=json&q=health" 2>/dev/null || echo "")
    if [ -n "$HEALTH" ]; then
        RESULT_COUNT=$(echo "$HEALTH" | python3 -c "import sys,json; d=json.load(sys.stdin); print(len(d.get('results',[])))" 2>/dev/null || echo "?")
        ok "SearXNG running (:8080, ${RESULT_COUNT} results in test query)"
    else
        warn "SearXNG container running but API not responding on :8080"
    fi
elif docker ps -a --filter "name=$SEARXNG_CONTAINER" -q 2>/dev/null | grep -q .; then
    warn "SearXNG container exists but is not running"
else
    warn "SearXNG container not found"
    info "To install: https://docs.searxng.org/admin/installation-docker.html"
fi
sep

# ═════════════════════════════════════════════════════════════════
#  SECTION 3 — Camofox
# ═════════════════════════════════════════════════════════════════
echo "─── Camofox ───"

if docker ps --filter "name=$CAMOFOX_CONTAINER" --filter "status=running" -q 2>/dev/null | grep -q .; then
    HEALTH=$(curl -s --max-time 5 http://localhost:9377/health 2>/dev/null || echo "")
    if [ -n "$HEALTH" ]; then
        BROWSER_OK=$(echo "$HEALTH" | python3 -c "import sys,json; print(json.load(sys.stdin).get('browserConnected','?'))" 2>/dev/null || echo "?")
        TAB_COUNT=$(echo "$HEALTH" | python3 -c "import sys,json; print(json.load(sys.stdin).get('activeTabs','?'))" 2>/dev/null || echo "?")
        ok "Camofox running (:9377, browserConnected: ${BROWSER_OK}, tabs: ${TAB_COUNT})"
    else
        warn "Camofox container running but API not responding on :9377"
    fi
elif docker ps -a --filter "name=$CAMOFOX_CONTAINER" -q 2>/dev/null | grep -q .; then
    warn "Camofox container exists but is not running"
else
    warn "Camofox container not found"
    info "Camofox — see https://github.com/jo-inc/camofox-browser"
fi
sep

# ═════════════════════════════════════════════════════════════════
#  SECTION 4 — CloakBrowser
# ═════════════════════════════════════════════════════════════════
echo "─── CloakBrowser ───"

if node -e "require('cloakbrowser')" 2>/dev/null; then
    ok "cloakbrowser npm package installed"
else
    fail "cloakbrowser not installed"
    info "Run: npm install"
fi

if [ -d "$HOME/.cloakbrowser" ] && ls "$HOME/.cloakbrowser/"*.desktop 2>/dev/null | grep -q .; then
    ok "Chromium binary present (~/.cloakbrowser/)"
elif [ -d "$HOME/.cloakbrowser" ]; then
    warn "~/.cloakbrowser/ exists but no binary found"
else
    warn "~/.cloakbrowser/ not found (binary will be downloaded on first run)"
fi
sep

# ═════════════════════════════════════════════════════════════════
#  SUMMARY
# ═════════════════════════════════════════════════════════════════
echo "=================================================="
echo "  Summary"
echo "=================================================="
echo ""

SEARXNG_STATUS=$(docker ps --filter "name=$SEARXNG_CONTAINER" --filter "status=running" -q 2>/dev/null | grep -q . && echo "running" || echo "stopped/missing")
CAMO_STATUS=$(docker ps --filter "name=$CAMOFOX_CONTAINER" --filter "status=running" -q 2>/dev/null | grep -q . && echo "running" || echo "stopped/missing")

echo "  SearXNG:    ${SEARXNG_STATUS}"
echo "  Camofox:    ${CAMO_STATUS}"
echo "  CloakBrowser: $(node -e "console.log(require('cloakbrowser/package.json').version)" 2>/dev/null || echo 'not installed')"
echo ""

if [ "$PASSED" = true ]; then
    echo -e "[${GREEN}OK${NC}] All checks passed — browser-search is ready."
else
    echo -e "[${YELLOW}⚠${NC}] Some checks failed — review messages above."
fi
echo "=================================================="
