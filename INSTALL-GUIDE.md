# Installation Guide - Super Simple!

## 🎉 The Easiest Way: macOS App Installer

**For macOS users** - just 2 clicks!

1. Download `Sauce4Zwift-Discord-Status-Installer-macOS.zip`
2. Extract and double-click the app
3. Click "OK" when installation completes
4. Done! 🎊

**What it does:**
- ✅ Installs to `~/Documents/SauceMods/sauce4zwift-discord-status`
- ✅ Sets up all dependencies automatically
- ✅ Creates `start.command` for easy launching
- ✅ NO configuration needed - works out of the box!

**No Terminal opening, no scary commands, just a simple app!**

---

## 🚀 Auto-Start (Optional but Recommended)

Want it to start automatically? Takes 30 seconds:

### macOS - Super Simple Method
1. Open **System Settings** → **General** → **Login Items**
2. Click **+** button
3. Navigate to `~/Documents/SauceMods/sauce4zwift-discord-status/`
4. Select `start.command`
5. Done!

### Windows - Super Simple Method
1. Press `Win + R`
2. Type: `shell:startup`
3. Create shortcut to `start.bat` in the startup folder
4. Done!

See `AUTOSTART.md` for advanced options.

---

## 📦 What's Included

- **Native macOS .app installer** - Silent, clean, professional
- **Auto-start scripts** - For both macOS and Windows
- **Zero configuration** - Pre-configured Discord Client ID
- **Automatic units detection** - Uses your Sauce4Zwift settings

---

## 🎮 Using the Plugin

1. Make sure Discord is running
2. Make sure Sauce4Zwift is running
3. Double-click `start.command` (macOS) or `start.bat` (Windows)
4. Start riding in Zwift!

Your Discord status will automatically show:
- Current speed (mph or kph)
- Distance traveled
- Current power (watts)
- World and route name
- Ride duration

---

## 🔧 For Advanced Users

- **Source installation**: Clone from GitHub and run `npm install`
- **Custom Discord branding**: Edit `src/main.js` and change the Client ID
- **Standalone executables**: Download platform-specific builds from releases

---

## ❓ Troubleshooting

**Installer doesn't open?**
- Right-click the app → Open (first time only due to macOS Gatekeeper)

**Discord status not showing?**
- Make sure Discord desktop app is running (not browser)
- Check that Sauce4Zwift is connected to Zwift
- Wait 5 seconds after starting to ride

**Need Node.js?**
- Download from https://nodejs.org (required for source installation only)
- The .app installer checks for Node.js automatically

---

Made with ❤️ for the Zwift and Sauce4Zwift community
