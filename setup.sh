#!/bin/bash

# Browser Capture CLI - Setup and Test Script
# This script will help you get started with the Browser Capture CLI

echo "================================================"
echo "   Browser Capture CLI - Setup & Test"
echo "================================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found. Please run this script from the project root."
  exit 1
fi

echo "✅ Project directory found"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
  if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
  fi
  echo "✅ Dependencies installed"
else
  echo "✅ Dependencies already installed"
fi
echo ""

# Check if dist exists
if [ ! -d "dist" ]; then
  echo "🔨 Building project..."
  npm run build
  if [ $? -ne 0 ]; then
    echo "❌ Failed to build project"
    exit 1
  fi
  echo "✅ Project built successfully"
else
  echo "✅ Project already built"
fi
echo ""

echo "================================================"
echo "   Quick Test Commands"
echo "================================================"
echo ""
echo "1. Test crawl command (help):"
echo "   npm run crawl"
echo ""
echo "2. Test capture command (help):"
echo "   npm run capture"
echo ""
echo "3. Test record command (help):"
echo "   npm run record"
echo ""
echo "4. Test pdf command (help):"
echo "   npm run pdf"
echo ""
echo "================================================"
echo "   Next Steps"
echo "================================================"
echo ""
echo "1. Configure your site in: src/config/sites.ts"
echo "2. Read the documentation:"
echo "   - README.md (full guide)"
echo "   - QUICKSTART.md (quick start)"
echo "   - EXAMPLES.md (usage examples)"
echo "   - ARCHITECTURE.md (system design)"
echo ""
echo "3. Try the example commands:"
echo "   npm run crawl -- example"
echo "   npm run capture -- example --viewports desktop"
echo ""
echo "================================================"
echo "   Setup Complete! 🎉"
echo "================================================"
echo ""
