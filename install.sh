#!/bin/bash

echo "🚴 Installing Sauce4Zwift Discord Status..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js found: $(node --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Installation complete!"
    echo ""
    echo "To start the plugin, run:"
    echo "  npm start"
    echo ""
    echo "Make sure Discord and Sauce4Zwift are running!"
else
    echo "❌ Installation failed"
    exit 1
fi
