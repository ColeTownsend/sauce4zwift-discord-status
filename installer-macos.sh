#!/bin/bash

echo "🚴 Sauce4Zwift Discord Status - Installer"
echo "=========================================="
echo ""

# Detect Documents directory
DOCS_DIR="$HOME/Documents"
if [ ! -d "$DOCS_DIR" ]; then
    DOCS_DIR="$HOME/My Documents"
fi

# Create SauceMods directory if it doesn't exist
MODS_DIR="$DOCS_DIR/SauceMods"
if [ ! -d "$MODS_DIR" ]; then
    echo "📁 Creating SauceMods directory..."
    mkdir -p "$MODS_DIR"
    echo "✓ Created $MODS_DIR"
fi

# Create mod directory
MOD_DIR="$MODS_DIR/sauce4zwift-discord-status"
echo ""
echo "📦 Installing to: $MOD_DIR"

# Remove old installation if exists
if [ -d "$MOD_DIR" ]; then
    echo "⚠️  Existing installation found, removing..."
    rm -rf "$MOD_DIR"
fi

# Create mod directory
mkdir -p "$MOD_DIR"

# Copy files
echo "📋 Copying files..."
cp -r src "$MOD_DIR/"
cp package.json "$MOD_DIR/"
cp manifest.json "$MOD_DIR/"
cp .env.example "$MOD_DIR/"
cp LICENSE "$MOD_DIR/"
cp README.md "$MOD_DIR/"

# Create .env from example if it doesn't exist
if [ ! -f "$MOD_DIR/.env" ]; then
    cp "$MOD_DIR/.env.example" "$MOD_DIR/.env"
    echo "✓ Created .env file with default settings"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
cd "$MOD_DIR"
npm install --silent

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Installation complete!"
    echo ""
    echo "📍 Installed to: $MOD_DIR"
    echo ""
    echo "To start the plugin:"
    echo "  cd \"$MOD_DIR\""
    echo "  npm start"
    echo ""
    echo "Or double-click the 'start.command' file in Finder"
    echo ""
    echo "Make sure Discord and Sauce4Zwift are running!"
    
    # Create a start.command file
    cat > "$MOD_DIR/start.command" << 'STARTSCRIPT'
#!/bin/bash
cd "$(dirname "$0")"
npm start
STARTSCRIPT
    chmod +x "$MOD_DIR/start.command"
    echo "✓ Created start.command for easy launching"
else
    echo "❌ Installation failed"
    exit 1
fi
