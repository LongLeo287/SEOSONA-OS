#!/bin/bash
# Marketing Dashboard - Stop Script
# Gracefully stops running dev servers

# Change to script directory
cd "$(dirname "$0")"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}⏹  Stopping Marketing Dashboard...${NC}"

# Check for PID files
if [ -f ".api.pid" ]; then
  API_PID=$(cat .api.pid)
  if kill -0 $API_PID 2>/dev/null; then
    echo -e "${YELLOW}   Stopping API server (PID: $API_PID)${NC}"
    kill $API_PID 2>/dev/null || true
  fi
  rm -f .api.pid
fi

if [ -f ".vue.pid" ]; then
  VUE_PID=$(cat .vue.pid)
  if kill -0 $VUE_PID 2>/dev/null; then
    echo -e "${YELLOW}   Stopping Vue dev server (PID: $VUE_PID)${NC}"
    kill $VUE_PID 2>/dev/null || true
  fi
  rm -f .vue.pid
fi

# Fallback: find and kill by port (if PID files don't exist)
if ! [ -f ".api.pid" ] && ! [ -f ".vue.pid" ]; then
  echo -e "${YELLOW}   No PID files found, searching by port...${NC}"

  # Kill process on port 3457 (API)
  API_PORT_PID=$(lsof -t -i:3457 2>/dev/null || true)
  if [ -n "$API_PORT_PID" ]; then
    echo -e "${YELLOW}   Stopping API server on port 3457 (PID: $API_PORT_PID)${NC}"
    kill $API_PORT_PID 2>/dev/null || true
  fi

  # Kill process on port 5173 (Vite)
  VUE_PORT_PID=$(lsof -t -i:5173 2>/dev/null || true)
  if [ -n "$VUE_PORT_PID" ]; then
    echo -e "${YELLOW}   Stopping Vue dev server on port 5173 (PID: $VUE_PORT_PID)${NC}"
    kill $VUE_PORT_PID 2>/dev/null || true
  fi
fi

echo -e "${GREEN}✓ Dashboard stopped${NC}\n"
