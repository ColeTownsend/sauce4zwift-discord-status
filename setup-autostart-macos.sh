#!/bin/bash
# Setup macOS LaunchAgent to auto-start with Sauce4Zwift

echo "Setting up auto-start with Sauce4Zwift..."
echo ""

# Paths
LAUNCH_AGENTS_DIR="$HOME/Library/LaunchAgents"
PLIST_NAME="com.sauce4zwift.discord-status.plist"
PLIST_PATH="$LAUNCH_AGENTS_DIR/$PLIST_NAME"
MOD_DIR="$HOME/Documents/SauceMods/sauce4zwift-discord-status"

# Check if mod is installed
if [ ! -d "$MOD_DIR" ]; then
    echo "❌ Plugin not found at: $MOD_DIR"
    echo "Please run the installer first!"
    exit 1
fi

# Create LaunchAgents directory if it doesn't exist
mkdir -p "$LAUNCH_AGENTS_DIR"

# Create a wrapper script that monitors Sauce4Zwift
WRAPPER_SCRIPT="$MOD_DIR/sauce-watcher.sh"
cat > "$WRAPPER_SCRIPT" << 'WRAPPER'
#!/bin/bash
# Monitor Sauce4Zwift and auto-start Discord Status

MOD_DIR="$(cd "$(dirname "$0")" && pwd)"
DISCORD_PID=""

echo "Watching for Sauce4Zwift..."

while true; do
    # Check if Sauce4Zwift is running
    if pgrep -x "Sauce4Zwift" > /dev/null; then
        # Sauce is running, check if our plugin is running
        if [ -z "$DISCORD_PID" ] || ! kill -0 "$DISCORD_PID" 2>/dev/null; then
            echo "Sauce4Zwift detected! Starting Discord Status..."
            cd "$MOD_DIR"
            npm start &
            DISCORD_PID=$!
        fi
    else
        # Sauce not running, stop our plugin if it's running
        if [ -n "$DISCORD_PID" ] && kill -0 "$DISCORD_PID" 2>/dev/null; then
            echo "Sauce4Zwift stopped. Stopping Discord Status..."
            kill $DISCORD_PID
            DISCORD_PID=""
        fi
    fi

    sleep 5
done
WRAPPER
chmod +x "$WRAPPER_SCRIPT"

# Create the LaunchAgent plist
cat > "$PLIST_PATH" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.sauce4zwift.discord-status</string>

    <key>ProgramArguments</key>
    <array>
        <string>$WRAPPER_SCRIPT</string>
    </array>

    <key>RunAtLoad</key>
    <true/>

    <key>KeepAlive</key>
    <true/>

    <key>StandardOutPath</key>
    <string>$HOME/Library/Logs/sauce4zwift-discord-status.log</string>

    <key>StandardErrorPath</key>
    <string>$HOME/Library/Logs/sauce4zwift-discord-status.error.log</string>
</dict>
</plist>
EOF

# Load the LaunchAgent
launchctl unload "$PLIST_PATH" 2>/dev/null
launchctl load "$PLIST_PATH"

if [ $? -eq 0 ]; then
    echo "✅ Auto-start configured successfully!"
    echo ""
    echo "The Discord Status plugin will now:"
    echo "  • Start automatically when Sauce4Zwift launches"
    echo "  • Stop automatically when Sauce4Zwift closes"
    echo "  • Monitor continuously in the background"
    echo ""
    echo "Logs: ~/Library/Logs/sauce4zwift-discord-status.log"
    echo ""
    echo "To disable auto-start:"
    echo "  launchctl unload ~/Library/LaunchAgents/$PLIST_NAME"
    echo ""
    echo "Press any key to close..."
    read -n 1 -s
else
    echo "❌ Failed to set up auto-start"
    echo "Press any key to close..."
    read -n 1 -s
    exit 1
fi
