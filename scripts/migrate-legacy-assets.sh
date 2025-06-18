#!/bin/bash

# EmbedPress Legacy Asset Migration Script
# Moves required legacy assets from assets-old/ to assets/ folder

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
NEW_ASSETS_DIR="$BASE_DIR/assets"

echo -e "${BLUE}🚀 Starting EmbedPress Legacy Asset Migration...${NC}\n"

# Check if directories exist
if [ ! -d "$OLD_ASSETS_DIR" ]; then
    echo -e "${RED}❌ assets-old directory not found at: $OLD_ASSETS_DIR${NC}"
    exit 1
fi

if [ ! -d "$NEW_ASSETS_DIR" ]; then
    echo -e "${RED}❌ assets directory not found at: $NEW_ASSETS_DIR${NC}"
    exit 1
fi

# Function to copy file with logging
copy_file() {
    local src="$1"
    local dest="$2"
    
    if [ -f "$src" ]; then
        # Ensure destination directory exists
        mkdir -p "$(dirname "$dest")"
        cp "$src" "$dest"
        echo -e "${GREEN}✅ Copied: $(basename "$src")${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  File not found: $(basename "$src")${NC}"
        return 1
    fi
}

# Function to copy directory with logging
copy_directory() {
    local src="$1"
    local dest="$2"
    
    if [ -d "$src" ]; then
        cp -r "$src" "$dest"
        echo -e "${GREEN}✅ Copied directory: $(basename "$src")${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  Directory not found: $(basename "$src")${NC}"
        return 1
    fi
}

# Migrate CSS files
echo -e "${BLUE}📄 Migrating CSS files...${NC}"
copy_file "$OLD_ASSETS_DIR/css/embedpress.css" "$NEW_ASSETS_DIR/css/embedpress.css"
copy_file "$OLD_ASSETS_DIR/css/plyr.css" "$NEW_ASSETS_DIR/css/plyr.css"
copy_file "$OLD_ASSETS_DIR/css/carousel.min.css" "$NEW_ASSETS_DIR/css/carousel.min.css"
copy_file "$OLD_ASSETS_DIR/css/embedpress-elementor.css" "$NEW_ASSETS_DIR/css/embedpress-elementor.css"

# Migrate JavaScript files
echo -e "\n${BLUE}📜 Migrating JavaScript files...${NC}"
copy_file "$OLD_ASSETS_DIR/js/plyr.polyfilled.js" "$NEW_ASSETS_DIR/js/plyr.polyfilled.js"
copy_file "$OLD_ASSETS_DIR/js/carousel.min.js" "$NEW_ASSETS_DIR/js/carousel.min.js"
copy_file "$OLD_ASSETS_DIR/js/pdfobject.js" "$NEW_ASSETS_DIR/js/pdfobject.js"

# Migrate asset folders
echo -e "\n${BLUE}📁 Migrating asset folders...${NC}"
copy_directory "$OLD_ASSETS_DIR/fonts" "$NEW_ASSETS_DIR/fonts"
copy_directory "$OLD_ASSETS_DIR/images" "$NEW_ASSETS_DIR/images"

# Generate report
echo -e "\n${BLUE}📊 Migration Report:${NC}"
echo "=================================================="

echo -e "\n${GREEN}✅ Required assets migrated to /assets/:${NC}"
echo "CSS Files: embedpress.css, plyr.css, carousel.min.css, embedpress-elementor.css"
echo "JS Files: plyr.polyfilled.js, carousel.min.js, pdfobject.js"
echo "Folders: fonts, images"

echo -e "\n${YELLOW}📦 Optional assets remaining in /assets-old/:${NC}"
echo "Deprecated: admin.css, admin-notices.css, admin.js, settings.js, front.js, gutneberg-script.js"
echo "Specialized: pdf-flip-book/, pdf/, ads.js, gallery-justify.js, vendor/"

echo -e "\n${BLUE}💡 Next steps:${NC}"
echo "1. Test that all EmbedPress functionality works"
echo "2. Consider archiving /assets-old/ if no longer needed"
echo "3. Update any hardcoded paths that reference old assets"

echo -e "\n${GREEN}🎉 Migration completed successfully!${NC}"
