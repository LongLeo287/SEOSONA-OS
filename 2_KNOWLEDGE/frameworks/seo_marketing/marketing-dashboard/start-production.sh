#!/bin/bash
# Marketing Dashboard - Production Startup Script
# Starts API server serving built Vue app

set -e  # Exit on error

# Change to script directory
cd "$(dirname "$0")"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   Marketing Dashboard - Production${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Check if build exists
if [ ! -d "app/dist" ]; then
  echo -e "${RED}✗ Production build not found!${NC}"
  echo -e "${YELLOW}  Run ./build.sh first${NC}\n"
  exit 1
fi

# Check if server dependencies exist
if [ ! -d "server/node_modules" ]; then
  echo -e "${YELLOW}⚠  Installing server dependencies...${NC}"
  cd server && npm install && cd ..
fi

# Start production server
echo -e "\n${GREEN}🚀 Starting production server...${NC}"
NODE_ENV=production node server/index.js &
PROD_PID=$!

# Save PID
echo "$PROD_PID" > .prod.pid

echo -e "${GREEN}   PID: $PROD_PID${NC}"

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ Dashboard running (production mode):${NC}"
echo -e "   App:    ${BLUE}http://localhost:3457${NC}"
echo -e "   Health: ${BLUE}http://localhost:3457/health${NC}"
echo -e "\n${YELLOW}Press Ctrl+C to stop${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Handle Ctrl+C gracefully
trap 'echo -e "\n${YELLOW}⏹  Stopping server...${NC}"; kill $PROD_PID 2>/dev/null; rm -f .prod.pid; echo -e "${GREEN}✓ Stopped${NC}"; exit 0' INT TERM

# Wait for process
wait
