# Sauce4Zwift Discord Status

Sync your Zwift ride data from Sauce4Zwift to Discord Rich Presence. Show your friends your current speed, average power, and ride duration in real-time!

## Features

- Real-time Discord Rich Presence updates
- Displays current speed (mph)
- Shows current power output (watts)
- Displays average power
- Automatic ride duration tracking
- Auto-reconnect to Sauce4Zwift if connection drops

## Prerequisites

1. **Sauce for Zwift** - Download and install from [sauce.llc](https://www.sauce.llc/)
2. **Discord** - Must be running on your computer
3. **Node.js** - Version 18 or higher ([download here](https://nodejs.org/))
4. **Zwift** - Obviously!

## Installation

### Step 1: Clone or Download This Repository

```bash
git clone https://github.com/yourusername/sauce4zwift-discord-status.git
cd sauce4zwift-discord-status
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Create a Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Give it a name (e.g., "Zwift Status")
4. Click "Create"
5. Copy the **Application ID** (also called Client ID)
6. (Optional) Upload a logo for your application under "Rich Presence > Art Assets"
   - Upload an image with key `zwift_logo` for the main image
   - Upload an image with key `power_meter` for the power indicator

### Step 4: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Discord Client ID:
   ```
   DISCORD_CLIENT_ID=your_client_id_here
   ```

### Step 5: Install as Sauce4Zwift Plugin (Optional)

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
   - Current speed
   - Current power output
   - Average power
   - Ride duration

### Development Mode

For development with auto-reload on file changes:

```bash
npm run dev
```

## Configuration

Edit your `.env` file to customize settings:

```env
# Required: Your Discord Application Client ID
DISCORD_CLIENT_ID=your_client_id_here

# Optional: Sauce4Zwift connection (defaults shown)
SAUCE_HOST=localhost
SAUCE_PORT=1080
```

## How It Works

1. **Connects to Sauce4Zwift WebSocket API** at `ws://localhost:1080/api/ws/events`
2. **Subscribes to athlete data** including speed, power, and duration
3. **Updates Discord Rich Presence** every 5 seconds with your current stats
4. **Auto-reconnects** if Sauce4Zwift disconnects

## Troubleshooting

### "Failed to connect to Discord"

- Make sure Discord desktop app is running (not browser version)
- Try restarting Discord
- Discord RPC only works with the desktop application

### "Connection to Sauce4Zwift failed"

- Verify Sauce4Zwift is running
- Check that Sauce4Zwift is running on port 1080 (default)
- Make sure no firewall is blocking localhost connections

### "DISCORD_CLIENT_ID is not set"

- Make sure you've created a `.env` file (not `.env.example`)
- Verify your Discord Client ID is correctly copied
- No quotes needed around the Client ID in `.env`

### Discord status not updating

- Make sure you're actively riding in Zwift (moving with power output)
- Check console logs for any errors
- Discord RPC updates every 5 seconds to avoid rate limiting

## API Reference

### Sauce4Zwift WebSocket API

This plugin connects to Sauce4Zwift's WebSocket API to receive real-time athlete data:

- **Endpoint**: `ws://localhost:1080/api/ws/events`
- **Events**: Subscribes to "watching" events for athlete state
- **Data fields used**: speed, power, avgPower, duration

### Discord Rich Presence

Updates Discord presence with:
- **details**: Current speed and power
- **state**: Average power
- **startTimestamp**: Ride start time (for duration calculation)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - See LICENSE file for details

## Credits

- [Sauce for Zwift](https://www.sauce.llc/) - The amazing companion app for Zwift
- [discord-rpc](https://github.com/discordjs/RPC) - Discord Rich Presence library

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
