#!/bin/bash
# Start Content Hub + Marketing Dashboard
# Usage: ./start-all.sh [--stop]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONTENT_HUB_DIR="$SCRIPT_DIR/.."
DASHBOARD_DIR="$SCRIPT_DIR/../../marketing-dashboard"

# Handle stop command
if [[ "$1" == "--stop" ]]; then
  echo "Stopping all servers..."
  node "$SCRIPT_DIR/server.cjs" --stop 2>/dev/null || true
  lsof -ti:3457 2>/dev/null | xargs kill -9 2>/dev/null || true
  lsof -ti:5173 2>/dev/null | xargs kill -9 2>/dev/null || true
  echo "✓ All servers stopped"
  exit 0
fi

# Check if dashboard exists
if [[ ! -d "$DASHBOARD_DIR" ]]; then
  echo "⚠️  Marketing Dashboard not found at $DASHBOARD_DIR"
  echo "Starting Content Hub only..."
  node "$SCRIPT_DIR/server.cjs" "$@"
  exit 0
fi

# Start Content Hub + Marketing Dashboard API (same server, port 3457)
echo "🚀 Starting Content Hub + Marketing Dashboard..."

# Start Marketing Dashboard API server
cd "$DASHBOARD_DIR/server"
npm run dev > /dev/null 2>&1 &
DASHBOARD_PID=$!
echo "   Dashboard API: http://localhost:3457 (PID: $DASHBOARD_PID)"

# Wait for server to start
sleep 2

# Start Vue frontend (dev mode)
cd "$DASHBOARD_DIR/app"
npm run dev > /dev/null 2>&1 &
VUE_PID=$!
echo "   Dashboard UI:  http://localhost:5173 (PID: $VUE_PID)"

echo ""
echo "✓ All services running"
echo ""
echo "Access:"
echo "  • Content Hub:  http://localhost:3457/hub"
echo "  • Dashboard:    http://localhost:5173"
echo "  • API:          http://localhost:3457/api/"
echo ""
echo "Stop: /write:hub --stop"

# Keep script running
wait
