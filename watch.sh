#!/bin/bash

# EmbedPress Auto-Build Script
# This script automatically rebuilds when files change

echo "🚀 Starting EmbedPress auto-build..."
echo "📁 Watching src/ directory for changes..."
echo "🔄 Files will auto-rebuild when you save changes"
echo ""
echo "Press Ctrl+C to stop watching"
echo ""

# Run the watch command
npm run watch
