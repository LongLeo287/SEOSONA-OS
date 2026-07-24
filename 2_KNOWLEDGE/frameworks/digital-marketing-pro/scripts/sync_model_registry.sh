#!/usr/bin/env sh
# sync_model_registry.sh
# ======================
# Distributes the canonical Neelverse Marketing Suite model registry from this
# repo (Digital Marketing Pro) to the sibling ContentForge / SocialForge repos.
#
# DMP's model_registry.json is the canonical superset: it carries every entry
# ContentForge/SocialForge use PLUS a handful of marketing-suite-specific model
# families (deepseek / doubao / minimax / evolink / gpt-5.1 / gpt-5.2) that the
# content plugins do not need. Running this script copies the canonical file
# outward so the SHARED entries never drift between plugins.
#
# This resolves the ghost referenced by model_registry.json's "$comment"
# ("Update this file then run scripts/sync_model_registry.sh to distribute").
#
# Windows-first: invoke via Git Bash (`sh scripts/sync_model_registry.sh`).
# It is idempotent and skips any sibling repo that is not checked out.
#
# Usage:
#   sh scripts/sync_model_registry.sh            # distribute to siblings
#   sh scripts/sync_model_registry.sh --check    # report drift, copy nothing
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
SRC="$SCRIPT_DIR/model_registry.json"
REPO_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
PARENT=$(CDPATH= cd -- "$REPO_ROOT/.." && pwd)

CHECK_ONLY=0
if [ "${1:-}" = "--check" ]; then
    CHECK_ONLY=1
fi

if [ ! -f "$SRC" ]; then
    echo "ERROR: canonical registry not found at $SRC" >&2
    exit 1
fi

status=0
for sibling in contentforge socialforge; do
    dest="$PARENT/$sibling/scripts/model_registry.json"
    if [ ! -f "$dest" ]; then
        echo "SKIP  $sibling (not checked out at $dest)"
        continue
    fi
    if cmp -s "$SRC" "$dest"; then
        echo "OK    $sibling registry already in sync"
        continue
    fi
    if [ "$CHECK_ONLY" -eq 1 ]; then
        echo "DRIFT $sibling registry differs from canonical DMP copy"
        status=1
    else
        cp "$SRC" "$dest"
        echo "SYNC  copied canonical registry -> $sibling"
    fi
done

exit $status
