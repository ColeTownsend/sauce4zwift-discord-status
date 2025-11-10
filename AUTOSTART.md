# Auto-Start with Sauce4Zwift

**The plugin automatically starts when Sauce4Zwift launches and stops when it closes!**

## 🚀 Quick Setup (Recommended)

### macOS
Run the setup script after installing:
```bash
cd ~/Documents/SauceMods/sauce4zwift-discord-status/
./setup-autostart-macos.sh
```

### Windows
Run the setup script as Administrator:
1. Right-click `setup-autostart-windows.bat`
2. Select **Run as administrator**

## How It Works

The setup creates a background watcher that:
- ✅ Monitors for Sauce4Zwift process
- ✅ Automatically starts Discord Status when Sauce4Zwift launches
- ✅ Automatically stops Discord Status when Sauce4Zwift closes
- ✅ Runs silently in the background
- ✅ Starts automatically when you log in

**You never have to manually start the plugin again!**

## What Gets Created

### macOS
- **Watcher Script**: `~/Documents/SauceMods/sauce4zwift-discord-status/sauce-watcher.sh`
- **LaunchAgent**: `~/Library/LaunchAgents/com.sauce4zwift.discord-status.plist`
- **Logs**: `~/Library/Logs/sauce4zwift-discord-status.log`

### Windows
- **Watcher Script**: `%USERPROFILE%\Documents\SauceMods\sauce4zwift-discord-status\sauce-watcher.vbs`
- **Scheduled Task**: "Sauce4Zwift Discord Status Watcher" in Task Scheduler

## Disabling Auto-Start

### macOS
```bash
launchctl unload ~/Library/LaunchAgents/com.sauce4zwift.discord-status.plist
```

Or delete the file:
```bash
rm ~/Library/LaunchAgents/com.sauce4zwift.discord-status.plist
```

### Windows
1. Open **Task Scheduler**
2. Find "Sauce4Zwift Discord Status Watcher"
3. Right-click → **Disable** or **Delete**

## Verifying It Works

1. Run the setup script
2. Launch Sauce4Zwift
3. Check your Discord status - should show "Riding in Zwift" once you start riding
4. Close Sauce4Zwift
5. The Discord Status plugin automatically stops

## Troubleshooting

**Watcher not starting the plugin?**
- Make sure Discord is running first
- Check logs:
  - macOS: `cat ~/Library/Logs/sauce4zwift-discord-status.log`
  - Windows: Check Task Scheduler history

**Want to restart the watcher?**
- macOS: `launchctl unload ~/Library/LaunchAgents/com.sauce4zwift.discord-status.plist && launchctl load ~/Library/LaunchAgents/com.sauce4zwift.discord-status.plist`
- Windows: Restart the scheduled task in Task Scheduler

**Watcher using too much CPU?**
- This shouldn't happen - it only checks every 5 seconds
- If it does, disable auto-start and start the plugin manually

## Manual Start (If You Don't Want Auto-Start)

Just double-click when you want to use it:
- macOS: `start.command`
- Windows: `start.bat`

---

**Perfect for daily Zwifters!** Set it up once and forget about it.
