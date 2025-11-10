# Release Notes - v1.0.3

## 🎉 One-Click Installation with Auto-Start!

This release makes installation incredibly simple - just one double-click!

### ✨ What's New

**🚀 Native macOS .app Installer**
- No Terminal windows, no scary commands
- Beautiful native dialogs
- Asks if you want auto-start during installation
- All-in-one package - everything included!

**⚡ Smart Auto-Start System**
- Automatically starts when Sauce4Zwift launches
- Automatically stops when Sauce4Zwift closes
- Runs silently in the background
- Set up during installation or skip and enable later

**🔥 Zero Configuration**
- Pre-configured Discord Client ID (shared, safe)
- Automatic units detection from Sauce4Zwift
- No .env files, no setup required
- Works out of the box!

### 📦 Installation (macOS)

1. Download `Sauce4Zwift-Discord-Status-Installer-macOS.zip`
2. Extract and double-click the app
3. Click "Enable Auto-Start" (recommended)
4. Done! 🎊

**That's it!** The plugin will now start automatically whenever you launch Sauce4Zwift.

### 🎮 What It Shows on Discord

- Current speed (mph or kph)
- Distance traveled
- Current power output (watts)
- World and route name
- Ride duration

All automatically synced from Sauce4Zwift!

### 📝 Manual Installation (Advanced Users)

If you prefer the old way or want to customize:
- Clone from GitHub: `git clone https://github.com/ColeTownsend/sauce4zwift-discord-status.git`
- Run `npm install`
- Edit `src/main.js` to customize

### 🔧 Auto-Start Management

**To disable auto-start:**
```bash
launchctl unload ~/Library/LaunchAgents/com.sauce4zwift.discord-status.plist
```

**To re-enable:**
```bash
cd ~/Documents/SauceMods/sauce4zwift-discord-status/
./setup-autostart-macos.sh
```

See `AUTOSTART.md` for more details.

### 📊 Technical Details

- **Installer Size**: 21KB zipped, 80KB unzipped
- **Dependencies**: Node.js (checked automatically)
- **Installation Location**: `~/Documents/SauceMods/sauce4zwift-discord-status/`
- **Logs**: `~/Library/Logs/sauce4zwift-discord-status.log`

### 🐛 Bug Fixes & Improvements

- Removed .env file requirement (#1)
- Fixed installer not showing completion message
- Added proper error handling for missing Node.js
- Improved Discord presence update throttling (5s)
- Better handling of route/world detection

### 🙏 Requirements

- **macOS**: 10.13 (High Sierra) or later
- **Node.js**: v14 or later (installer checks for you)
- **Discord**: Desktop app (not browser)
- **Sauce4Zwift**: Latest version

### 💡 Troubleshooting

**Discord not updating?**
- Make sure Discord desktop app is running
- Check that Sauce4Zwift is connected to Zwift
- Wait 5 seconds after starting to ride

**Auto-start not working?**
- Check logs: `cat ~/Library/Logs/sauce4zwift-discord-status.log`
- Verify LaunchAgent: `launchctl list | grep sauce4zwift`
- Re-run setup: `./setup-autostart-macos.sh`

**Need help?**
- Open an issue: https://github.com/ColeTownsend/sauce4zwift-discord-status/issues
- Check documentation: See README.md and AUTOSTART.md

---

**Made with ❤️ for the Zwift and Sauce4Zwift community**

🚴 Happy riding! 🚴
