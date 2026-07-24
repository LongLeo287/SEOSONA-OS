#!/usr/bin/env bash
# spawn-agent.sh — Spawn a worker agent (Gemini CLI or Codex CLI) in headless mode
#
# Usage:
#   spawn-agent.sh [options] -p "prompt text"
#   spawn-agent.sh [options] -f /path/to/prompt-file.md
#   echo "prompt" | spawn-agent.sh [options]
#
# See --help for all options.

set -euo pipefail

# ─── Defaults ───────────────────────────────────────────────
AGENT="gemini"            # gemini | codex
APPROVAL_MODE="auto_edit" # gemini: auto_edit|yolo|default  codex: (uses suggest/auto-edit/full-auto)
TIMEOUT=300
PROMPT=""
PROMPT_FILE=""
TASKS_DIR=".agent/spawn_agent_tasks"
OUTPUT_FILE="${TASKS_DIR}/output-$(date +%Y%m%d-%H%M%S).log"

# ─── Parse args ─────────────────────────────────────────────
usage() {
  cat <<EOF
Usage: $(basename "$0") [options]

Spawn a headless worker agent to execute a task.

Agent Selection:
  --gemini                Use Gemini CLI (default)
  --codex                 Use Codex CLI

Prompt:
  -p, --prompt TEXT       Prompt text (inline)
  -f, --file PATH         Prompt file (markdown)

Approval Modes:
  --yolo                  Auto-approve everything (gemini: yolo, codex: full-auto)
  --auto-edit             Auto-approve edits only (default for both)
  --safe                  Prompt for every action (gemini: default, codex: suggest)

Other:
  --timeout SECONDS       Max execution time (default: 300)
  --output PATH           Custom output file path
  -h, --help              Show this help

Examples:
  spawn-agent.sh --gemini --yolo -p "Fix typo in auth.ts"
  spawn-agent.sh --codex --auto-edit -f /tmp/task.md
  spawn-agent.sh --codex --yolo -p "Count files in src/"
EOF
  exit 0
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    -p|--prompt)
      PROMPT="$2"; shift 2 ;;
    -f|--file)
      PROMPT_FILE="$2"; shift 2 ;;
    --gemini)
      AGENT="gemini"; shift ;;
    --codex)
      AGENT="codex"; shift ;;
    --yolo)
      APPROVAL_MODE="yolo"; shift ;;
    --auto-edit)
      APPROVAL_MODE="auto_edit"; shift ;;
    --safe)
      APPROVAL_MODE="safe"; shift ;;
    --timeout)
      TIMEOUT="$2"; shift 2 ;;
    --output)
      OUTPUT_FILE="$2"; shift 2 ;;
    -h|--help)
      usage ;;
    *)
      echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

# ─── Resolve prompt ─────────────────────────────────────────
if [[ -n "$PROMPT_FILE" ]]; then
  if [[ ! -f "$PROMPT_FILE" ]]; then
    echo "❌ Prompt file not found: $PROMPT_FILE" >&2
    exit 1
  fi
  PROMPT=$(cat "$PROMPT_FILE")
elif [[ -z "$PROMPT" ]]; then
  if [[ ! -t 0 ]]; then
    PROMPT=$(cat)
  else
    echo "❌ No prompt provided. Use -p, -f, or pipe input." >&2
    exit 1
  fi
fi

if [[ -z "$PROMPT" ]]; then
  echo "❌ Empty prompt." >&2
  exit 1
fi

# ─── Check agent availability ──────────────────────────────
if [[ "$AGENT" == "gemini" ]]; then
  if ! command -v gemini &>/dev/null; then
    echo "❌ gemini CLI not found. Install: npm i -g @google/gemini-cli" >&2
    exit 1
  fi
elif [[ "$AGENT" == "codex" ]]; then
  if ! command -v codex &>/dev/null; then
    echo "❌ codex CLI not found. Install: npm i -g @openai/codex" >&2
    exit 1
  fi
fi

# ─── Build command ──────────────────────────────────────────
build_gemini_cmd() {
  local mode
  case "$APPROVAL_MODE" in
    yolo)      mode="yolo" ;;
    auto_edit) mode="auto_edit" ;;
    safe)      mode="default" ;;
    *)         mode="auto_edit" ;;
  esac
  CMD=(gemini --approval-mode "$mode" -p "$PROMPT")
  MODE_DISPLAY="$mode"
}

build_codex_cmd() {
  local mode
  case "$APPROVAL_MODE" in
    yolo)      mode="full-auto" ;;
    auto_edit) mode="auto-edit" ;;
    safe)      mode="suggest" ;;
    *)         mode="auto-edit" ;;
  esac
  CMD=(codex exec -c "approval_mode=\"$mode\"" "$PROMPT")
  MODE_DISPLAY="$mode"
}

if [[ "$AGENT" == "gemini" ]]; then
  build_gemini_cmd
else
  build_codex_cmd
fi

# ─── Timeout command ────────────────────────────────────────
# macOS uses gtimeout (from coreutils), Linux uses timeout
if command -v gtimeout &>/dev/null; then
  TIMEOUT_CMD="gtimeout"
elif command -v timeout &>/dev/null; then
  TIMEOUT_CMD="timeout"
else
  TIMEOUT_CMD=""
fi

# ─── Ensure output directory exists ─────────────────────────
mkdir -p "$TASKS_DIR"

# ─── Execute ────────────────────────────────────────────────
AGENT_UPPER=$(echo "$AGENT" | tr '[:lower:]' '[:upper:]')

echo "╔══════════════════════════════════════════════════════╗"
echo "║  🚀 Spawning $AGENT_UPPER agent                          ║"
echo "╠══════════════════════════════════════════════════════╣"
echo "║  Agent:   $AGENT"
echo "║  Mode:    $MODE_DISPLAY"
echo "║  Timeout: ${TIMEOUT}s"
echo "║  Output:  $OUTPUT_FILE"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

EXIT_CODE=0

# Write header to output
{
  echo "=== Spawn Agent: $AGENT_UPPER ==="
  echo "Timestamp: $(date '+%Y-%m-%d %H:%M:%S')"
  echo "Mode: $MODE_DISPLAY"
  echo "Prompt preview: ${PROMPT:0:200}..."
  echo "================================"
  echo ""
} | tee "$OUTPUT_FILE"

# Execute with optional timeout (capture exit code properly)
if [[ -n "$TIMEOUT_CMD" ]]; then
  $TIMEOUT_CMD "$TIMEOUT" "${CMD[@]}" 2>&1 | tee -a "$OUTPUT_FILE" || EXIT_CODE=$?
else
  "${CMD[@]}" 2>&1 | tee -a "$OUTPUT_FILE" || EXIT_CODE=$?
fi

# Write footer to output
{
  echo ""
  echo "================================"
  echo "Exit code: $EXIT_CODE"
  echo "Completed: $(date '+%Y-%m-%d %H:%M:%S')"
} | tee -a "$OUTPUT_FILE"

echo ""
if [[ $EXIT_CODE -eq 0 ]]; then
  echo "✅ $AGENT_UPPER agent completed successfully"
  echo "📄 Full output: $OUTPUT_FILE"
elif [[ $EXIT_CODE -eq 124 ]]; then
  echo "⏰ $AGENT_UPPER agent timed out after ${TIMEOUT}s"
  echo "📄 Partial output: $OUTPUT_FILE"
else
  echo "❌ $AGENT_UPPER agent failed (exit code: $EXIT_CODE)"
  echo "📄 Output with errors: $OUTPUT_FILE"
fi

exit $EXIT_CODE
