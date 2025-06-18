#!/bin/bash

# EmbedPress Asset Relocation Script
# Moves assets-old/ to static/ folder to separate from build assets

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(dirname "$SCRIPT_DIR")"
OLD_ASSETS_DIR="$BASE_DIR/assets-old"
STATIC_DIR="$BASE_DIR/static"
ASSETS_DIR="$BASE_DIR/assets"

echo -e "${BLUE}🚀 Starting EmbedPress Asset Relocation...${NC}\n"

# Check if assets-old directory exists
if [ ! -d "$OLD_ASSETS_DIR" ]; then
    echo -e "${RED}❌ assets-old directory not found at: $OLD_ASSETS_DIR${NC}"
    echo -e "${YELLOW}💡 If you've already moved your assets, this script is not needed.${NC}"
    exit 1
fi

# Check if static directory already exists
if [ -d "$STATIC_DIR" ]; then
    echo -e "${YELLOW}⚠️  static/ directory already exists. Do you want to overwrite it? (y/N)${NC}"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}ℹ️  Operation cancelled.${NC}"
        exit 0
    fi
    echo -e "${YELLOW}🗑️  Removing existing static/ directory...${NC}"
    rm -rf "$STATIC_DIR"
fi

# Move assets-old to static
echo -e "${BLUE}📦 Moving assets-old/ to static/...${NC}"
mv "$OLD_ASSETS_DIR" "$STATIC_DIR"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Successfully moved assets-old/ to static/${NC}"
else
    echo -e "${RED}❌ Failed to move assets-old/ to static/${NC}"
    exit 1
fi

# Show current structure
echo -e "\n${BLUE}📁 Current asset structure:${NC}"
echo "=================================================="
echo -e "${GREEN}assets/${NC}          # Build files (Vite-compiled)"
if [ -d "$ASSETS_DIR" ]; then
    ls -la "$ASSETS_DIR" | grep -E "^d" | awk '{print "  " $9}' | grep -v "^\.$\|^\.\.$"
fi

echo -e "\n${GREEN}static/${NC}          # Previous assets (relocated)"
if [ -d "$STATIC_DIR" ]; then
    ls -la "$STATIC_DIR" | grep -E "^d" | awk '{print "  " $9}' | grep -v "^\.$\|^\.\.$"
fi

# Generate report
echo -e "\n${BLUE}📊 Relocation Report:${NC}"
echo "=================================================="

echo -e "\n${GREEN}✅ Assets relocated successfully:${NC}"
echo "• Previous assets moved from assets-old/ to static/"
echo "• AssetManager updated to use static/ for legacy assets"
echo "• Build files remain in assets/ folder"

echo -e "\n${BLUE}🔧 AssetManager Configuration:${NC}"
echo "• Build assets: /assets/ (blocks.build.js, admin.build.css, etc.)"
echo "• Static assets: /static/ (embedpress.css, plyr.css, fonts/, images/, etc.)"

echo -e "\n${BLUE}💡 Next steps:${NC}"
echo "1. Test that all EmbedPress functionality works"
echo "2. Verify legacy assets load correctly from /static/"
echo "3. Update any hardcoded paths that reference assets-old/"
echo "4. Consider updating documentation to reflect new structure"

echo -e "\n${GREEN}🎉 Asset relocation completed successfully!${NC}"
echo -e "${BLUE}ℹ️  Your build system can now use /assets/ exclusively for compiled files.${NC}"
