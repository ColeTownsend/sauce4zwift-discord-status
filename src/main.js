import dotenv from 'dotenv';
import { SauceRestClient } from './rest-client.js';
import { DiscordPresenceManager } from './discord-presence.js';

// Load environment variables
dotenv.config();

// Configuration
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const SAUCE_HOST = process.env.SAUCE_HOST || 'localhost';
const SAUCE_PORT = process.env.SAUCE_PORT || 1080;
const UNITS = (process.env.UNITS || 'imperial').toLowerCase();

// Validate configuration
if (!DISCORD_CLIENT_ID) {
  console.error('ERROR: DISCORD_CLIENT_ID is not set in .env file');
  console.error('Please create a .env file with your Discord Client ID');
  console.error('See README.md for instructions on how to get a Discord Client ID');
  process.exit(1);
}

// Validate units
if (!['imperial', 'metric'].includes(UNITS)) {
  console.error(`ERROR: UNITS must be "imperial" or "metric", got "${UNITS}"`);
  process.exit(1);
}

console.log('=== Sauce4Zwift Discord Status Sync ===');
console.log(`Sauce4Zwift: ${SAUCE_HOST}:${SAUCE_PORT}`);
console.log(`Discord Client ID: ${DISCORD_CLIENT_ID.substring(0, 8)}...`);
console.log(`Units: ${UNITS}`);
console.log('');

// Initialize clients
const sauceClient = new SauceRestClient(SAUCE_HOST, SAUCE_PORT);
const discordPresence = new DiscordPresenceManager(DISCORD_CLIENT_ID, UNITS);

// Track connection state
let isRiding = false;

// Handle athlete data updates
sauceClient.on('athleteData', (data) => {
  // Check if we have valid riding data
  // Data structure: { state: {...}, stats: {...}, athlete: {...} }
  const state = data.state || {};
  const stats = data.stats || {};

  const hasSpeed = (state.speed || 0) > 0;
  const hasPower = (state.power || 0) > 0 || (stats.power?.avg || 0) > 0;
  const hasData = stats.elapsedTime > 0;

  if ((hasSpeed || hasPower || hasData) && stats.elapsedTime) {
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
  sauceClient.stopPolling();
  discordPresence.disconnect();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('');
  console.log('Shutting down...');
  sauceClient.stopPolling();
  discordPresence.disconnect();
  process.exit(0);
});

// Start connection
async function start() {
  console.log('Testing connection to Sauce4Zwift...');
  const connected = await sauceClient.testConnection();

  if (!connected) {
    console.error('✗ Could not connect to Sauce4Zwift');
    console.error('Make sure Sauce4Zwift is running on port', SAUCE_PORT);
    process.exit(1);
  }

  console.log('✓ Connected to Sauce4Zwift REST API');

  // Fetch units preference from Sauce4Zwift
  const imperialUnits = await sauceClient.getSetting('imperialUnits');
  let units = UNITS; // Default from .env

  if (imperialUnits !== null) {
    units = imperialUnits ? 'imperial' : 'metric';
    console.log(`✓ Using units from Sauce4Zwift: ${units}`);
  } else {
    console.log(`Using units from .env: ${units}`);
  }

  // Update Discord presence manager with the correct units
  discordPresence.units = units;

  // Connect to Discord
  try {
    await discordPresence.connect();
    console.log('✓ Connected to Discord RPC');
    console.log('');
    console.log('Ready! Monitoring your ride...');
    console.log('');

    // Start polling for athlete data
    sauceClient.startPolling();
  } catch (error) {
    console.error('Failed to connect to Discord. Make sure Discord is running.');
    process.exit(1);
  }
}

start();
