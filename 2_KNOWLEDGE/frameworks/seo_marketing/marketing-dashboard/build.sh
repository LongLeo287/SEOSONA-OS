#!/bin/bash
# Marketing Dashboard - Production Build Script
# Builds Vue app and prepares for production deployment

set -e  # Exit on error

# Change to script directory
cd "$(dirname "$0")"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   Marketing Dashboard - Production Build${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Check if app/node_modules exist
if [ ! -d "app/node_modules" ]; then
  echo -e "\n${YELLOW}⚠  Installing app dependencies...${NC}"
  cd app && npm install && cd ..
fi

# Build Vue app
echo -e "\n${GREEN}📦 Building Vue application...${NC}"
cd app
npm run build
cd ..

# Build completed
echo -e "\n${GREEN}✓ Build complete!${NC}"
echo -e "\n${BLUE}Production files:${NC}"
echo -e "   ${GREEN}app/dist/${NC}"
ls -lh app/dist/ | grep -E '^-' | awk '{printf "   %-40s %s\n", $9, $5}'

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🚀 To start production server:${NC}"
echo -e "   ${YELLOW}NODE_ENV=production node server/index.js${NC}"
echo -e "\n${GREEN}📚 Or use the start script:${NC}"
echo -e "   ${YELLOW}./start-production.sh${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
