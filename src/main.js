import dotenv from 'dotenv';
import { SauceWebSocketClient } from './websocket-client.js';
import { DiscordPresenceManager } from './discord-presence.js';

// Load environment variables
dotenv.config();

// Configuration
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const SAUCE_HOST = process.env.SAUCE_HOST || 'localhost';
const SAUCE_PORT = process.env.SAUCE_PORT || 1080;

// Validate configuration
if (!DISCORD_CLIENT_ID) {
  console.error('ERROR: DISCORD_CLIENT_ID is not set in .env file');
  console.error('Please create a .env file with your Discord Client ID');
  console.error('See README.md for instructions on how to get a Discord Client ID');
  process.exit(1);
}

console.log('=== Sauce4Zwift Discord Status Sync ===');
console.log(`Sauce4Zwift: ${SAUCE_HOST}:${SAUCE_PORT}`);
console.log(`Discord Client ID: ${DISCORD_CLIENT_ID.substring(0, 8)}...`);
console.log('');

// Initialize clients
const sauceClient = new SauceWebSocketClient(SAUCE_HOST, SAUCE_PORT);
const discordPresence = new DiscordPresenceManager(DISCORD_CLIENT_ID);

// Track connection state
let isRiding = false;

// Handle Sauce4Zwift connection events
sauceClient.on('connected', async () => {
  console.log('✓ Connected to Sauce4Zwift');

  // Connect to Discord
  try {
    await discordPresence.connect();
    console.log('✓ Connected to Discord RPC');
    console.log('');
    console.log('Ready! Start a ride in Zwift to see your Discord status update.');
    console.log('');
  } catch (error) {
    console.error('Failed to connect to Discord. Make sure Discord is running.');
  }
});

sauceClient.on('disconnected', () => {
  console.log('✗ Disconnected from Sauce4Zwift');
  if (isRiding) {
    discordPresence.clearPresence();
    isRiding = false;
  }
});

sauceClient.on('error', (error) => {
  console.error('Sauce4Zwift error:', error.message);
});

// Handle athlete data updates
sauceClient.on('athleteData', (data) => {
  // Check if we have valid riding data
  const hasSpeed = data.speed > 0 || data.currentSpeed > 0;
  const hasPower = (data.power > 0 || data.currentPower > 0) || data.avgPower > 0;

  if (hasSpeed || hasPower) {
    if (!isRiding) {
      console.log('🚴 Ride detected! Updating Discord presence...');
      isRiding = true;
    }

    // Update Discord presence with current data
    discordPresence.updatePresence(data);
  } else if (isRiding) {
    // Ride has ended
    console.log('🏁 Ride ended. Clearing Discord presence...');
    discordPresence.clearPresence();
    isRiding = false;
  }
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('');
  console.log('Shutting down...');
  discordPresence.disconnect();
  sauceClient.disconnect();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('');
  console.log('Shutting down...');
  discordPresence.disconnect();
  sauceClient.disconnect();
  process.exit(0);
});

// Start connection
console.log('Connecting to Sauce4Zwift...');
sauceClient.connect();
