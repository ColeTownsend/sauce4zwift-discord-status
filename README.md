# Sauce4Zwift Discord Status

Sync your Zwift ride data from Sauce4Zwift to Discord Rich Presence. Show your friends your current speed, distance, power, and location in real-time!

## Features

- Real-time Discord Rich Presence updates
- Displays current speed and distance (imperial or metric)
- Shows current power output (watts)
- Displays current world and route name
- Automatic ride duration tracking
- Automatically uses your Sauce4Zwift units preference (imperial/metric)
- Event detection and display
- Reliable REST API integration with automatic reconnection

## Prerequisites

1. **Sauce for Zwift** - Download and install from [sauce.llc](https://www.sauce.llc/)
2. **Discord** - Must be running on your computer
3. **Zwift** - Obviously!

## Installation

### Option 1: Auto-Installer (Recommended - Installs as Sauce4Zwift Mod)

**Automatic installation to your SauceMods directory!**

1. Download the [latest release](https://github.com/ColeTownsend/sauce4zwift-discord-status/releases/latest)
2. Extract the ZIP file
3. Run the installer for your platform:
   - **macOS**: Double-click `installer-macos.sh` (or run `./installer-macos.sh` in Terminal)
   - **Windows**: Double-click `installer-windows.bat`

The installer will:
- ✅ Create `~/Documents/SauceMods` directory if needed
- ✅ Install the mod to `~/Documents/SauceMods/sauce4zwift-discord-status`
- ✅ Set up all dependencies automatically
- ✅ Create a launch shortcut (`start.command` or `start.bat`)

After installation, just double-click the `start.command` (macOS) or `start.bat` (Windows) file to launch!

### Option 2: Standalone Executable (No Installation)

**Just download and run!** No installation, no Node.js, no npm, no configuration needed.

1. Go to [Releases](https://github.com/ColeTownsend/sauce4zwift-discord-status/releases/latest)
2. Download the executable for your platform:
   - **macOS**: `sauce4zwift-discord-status-macos`
   - **Windows**: `sauce4zwift-discord-status-win.exe`
   - **Linux**: `sauce4zwift-discord-status-linux`
3. Double-click the executable to run!

That's it! The plugin works out of the box with no configuration required.

### Option 3: Install from Source (For Developers)

### Quick Install (Recommended)

**macOS/Linux:**
```bash
git clone https://github.com/ColeTownsend/sauce4zwift-discord-status.git
cd sauce4zwift-discord-status
./install.sh
npm start
```

**Windows:**
```cmd
git clone https://github.com/ColeTownsend/sauce4zwift-discord-status.git
cd sauce4zwift-discord-status
install.bat
npm start
```

The installer automatically:
- ✅ Checks for Node.js
- ✅ Installs all dependencies
- ✅ You're ready to ride!

### Manual Installation

**Step 1: Clone the repository**
```bash
git clone https://github.com/ColeTownsend/sauce4zwift-discord-status.git
cd sauce4zwift-discord-status
```

**Step 2: Install dependencies**
```bash
npm install
```

That's it! No configuration needed - the plugin works out of the box with:
- ✅ Pre-configured Discord Client ID (shared, completely safe)
- ✅ Discord status shows "Zwift Status" with a Zwift logo
- ✅ Automatic units detection from your Sauce4Zwift settings

**Advanced customization** (optional):

To use your own Discord branding, you can create a custom Discord Application:
1. Create an app at [Discord Developer Portal](https://discord.com/developers/applications)
2. Upload custom images under "Rich Presence > Art Assets" (key: `zwift_logo`)
3. Edit `src/main.js` and replace the `DISCORD_CLIENT_ID` value with your Client ID

### (Optional) Install as Sauce4Zwift Plugin

To have this plugin recognized by Sauce4Zwift:

1. Copy this entire folder to your Sauce mods directory:
   ```bash
   # macOS/Linux
   cp -r . ~/Documents/SauceMods/sauce4zwift-discord-status/

   # Windows
   # Copy to: %USERPROFILE%\Documents\SauceMods\sauce4zwift-discord-status\
   ```

2. Restart Sauce4Zwift to load the plugin

## Usage

### Running the Plugin

1. Make sure Discord is running on your computer
2. Make sure Sauce4Zwift is running
3. Start the Discord status sync:
   ```bash
   npm start
   ```

4. You should see:
   ```
   ✓ Connected to Sauce4Zwift
   ✓ Connected to Discord RPC

   Ready! Start a ride in Zwift to see your Discord status update.
   ```

5. Start riding in Zwift! Your Discord status will automatically update with:
   - Current speed (mph or kph)
   - Distance traveled (miles or km)
   - Current power output (watts)
   - Current world and route name
   - Ride duration (elapsed time)

### Development Mode

For development with auto-reload on file changes:

```bash
npm run dev
```

## Configuration

**No configuration required!** The plugin works out of the box with:
- Pre-configured shared Discord Client ID
- Automatic connection to Sauce4Zwift on localhost:1080
- Automatic units detection from your Sauce4Zwift settings

**For advanced users**: If you want to customize the Discord branding or connection settings, you can edit the values at the top of `src/main.js`:

```javascript
const DISCORD_CLIENT_ID = '1324055805842161745'; // Replace with your own Discord Client ID
const SAUCE_HOST = 'localhost';
const SAUCE_PORT = 1080;
```

## How It Works

1. **Connects to Sauce4Zwift REST API** at `http://localhost:1080/api`
2. **Fetches your units preference** from Sauce4Zwift settings
3. **Polls athlete data** every 2 seconds including speed, power, distance, and location
4. **Updates Discord Rich Presence** every 5 seconds with your current stats (throttled to avoid rate limiting)
5. **Automatically detects worlds and routes** using the zwift-data package

## Troubleshooting

### "Failed to connect to Discord"

- Make sure Discord desktop app is running (not browser version)
- Try restarting Discord
- Discord RPC only works with the desktop application

### "Connection to Sauce4Zwift failed"

- Verify Sauce4Zwift is running
- Check that Sauce4Zwift is running on port 1080 (default)
- Make sure no firewall is blocking localhost connections

### Discord status not updating

- Make sure you're actively riding in Zwift (moving with power output)
- Check console logs for any errors
- Discord RPC updates every 5 seconds to avoid rate limiting

## API Reference

### Sauce4Zwift REST API

This plugin connects to Sauce4Zwift's REST API to fetch real-time athlete data:

- **Athlete Data**: `GET http://localhost:1080/api/athlete/v1/self`
- **Settings**: `GET http://localhost:1080/api/rpc/v1/getSetting/<settingName>`
- **Data fields used**: speed, power, distance, courseId, routeId, eventSubgroupId, elapsedTime

### Discord Rich Presence

Updates Discord presence with:
- **details**: Current speed, distance, and power (e.g., "15.2 mph • 3.47 mi | 185W")
- **state**: Current world and route (e.g., "Two Bridges Loop • Bologna")
- **startTimestamp**: Ride start time (for duration calculation)
- **largeImageKey**: zwift_logo (if uploaded to your Discord app)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - See LICENSE file for details

## Credits

- [Sauce for Zwift](https://www.sauce.llc/) - The amazing companion app for Zwift
- [discord-rpc](https://github.com/discordjs/RPC) - Discord Rich Presence library
- [zwift-data](https://github.com/andipaetzold/zwift-data) - Comprehensive Zwift worlds and routes data

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Sauce4Zwift logs
3. Open an issue on GitHub with:
   - Error messages from console
   - Your setup (OS, Node.js version, Sauce4Zwift version)
   - Steps to reproduce

## Screenshots

(Add screenshots of your Discord status showing the ride data here)

---

Made with ❤️ for the Zwift and Sauce4Zwift community
