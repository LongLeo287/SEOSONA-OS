#!/bin/bash
# Marketing Dashboard - Development Startup Script
# Starts API server + Vue dev server concurrently

set -e  # Exit on error

# Change to script directory
cd "$(dirname "$0")"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   Marketing Dashboard - Development${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Check if node_modules exist
if [ ! -d "server/node_modules" ]; then
  echo -e "${YELLOW}⚠  Installing server dependencies...${NC}"
  cd server && npm install && cd ..
fi

if [ ! -d "app/node_modules" ]; then
  echo -e "${YELLOW}⚠  Installing app dependencies...${NC}"
  cd app && npm install && cd ..
fi

# Start API server in background
echo -e "\n${GREEN}🚀 Starting API server...${NC}"
NODE_ENV=development SKIP_AUTH=true node server/index.js &
API_PID=$!
echo -e "${GREEN}   PID: $API_PID${NC}"

# Wait for API to be ready
sleep 2

# Start Vue dev server in background
echo -e "\n${GREEN}🎨 Starting Vue dev server...${NC}"
cd app && npm run dev &
VUE_PID=$!
echo -e "${GREEN}   PID: $VUE_PID${NC}"
cd ..

# Save PIDs for stop script
echo "$API_PID" > .api.pid
echo "$VUE_PID" > .vue.pid

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ Dashboard running:${NC}"
echo -e "   Frontend: ${BLUE}http://localhost:5173${NC}"
echo -e "   API:      ${BLUE}http://localhost:3457${NC}"
echo -e "   Health:   ${BLUE}http://localhost:3457/health${NC}"
echo -e "\n${YELLOW}Press Ctrl+C to stop${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Handle Ctrl+C gracefully
trap 'echo -e "\n${YELLOW}⏹  Stopping services...${NC}"; kill $API_PID $VUE_PID 2>/dev/null; rm -f .api.pid .vue.pid; echo -e "${GREEN}✓ Stopped${NC}"; exit 0' INT TERM

# Wait for both processes
wait
