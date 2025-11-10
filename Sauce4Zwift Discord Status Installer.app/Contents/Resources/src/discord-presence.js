import DiscordRPC from 'discord-rpc';
import { getLocationString } from './zwift-data.js';

export class DiscordPresenceManager {
  constructor(clientId, units = 'imperial') {
    this.clientId = clientId;
    this.units = units;
    this.client = null;
    this.isConnected = false;
    this.rideStartTime = null;
    this.lastUpdate = 0;
    this.updateInterval = 5000; // Update every 5 seconds to avoid rate limiting
  }

  async connect() {
    if (this.isConnected) {
      return;
    }

    try {
      this.client = new DiscordRPC.Client({ transport: 'ipc' });

      this.client.on('ready', () => {
        console.log('Connected to Discord RPC');
        console.log(`Logged in as ${this.client.user.username}#${this.client.user.discriminator}`);
        this.isConnected = true;
      });

      await this.client.login({ clientId: this.clientId });
    } catch (error) {
      console.error('Failed to connect to Discord:', error.message);
      throw error;
    }
  }

  async updatePresence(athleteData) {
    if (!this.isConnected || !this.client) {
      console.warn('Discord client not connected, skipping presence update');
      return;
    }

    // Throttle updates to avoid rate limiting
    const now = Date.now();
    if (now - this.lastUpdate < this.updateInterval) {
      return;
    }
    this.lastUpdate = now;

    try {
      // Extract data from Sauce4Zwift structure
      // Data structure: { state: {...}, stats: {...}, athlete: {...} }
      const state = athleteData.state || {};
      const stats = athleteData.stats || {};

      // Speed from state (in kph)
      const speed = state.speed || 0;

      // Current power from state
      const currentPower = state.power || 0;

      // Average power from stats
      const avgPower = stats.power?.avg || 0;

      // Duration from stats (in seconds)
      const duration = stats.elapsedTime || 0;

      // Distance from state (in meters)
      const distanceMeters = state.distance || 0;

      // Get world/map/route info
      const courseId = state.courseId || athleteData.courseId || 0;
      const routeId = state.routeId || 0;
      const eventSubgroupId = state.eventSubgroupId || 0;
      const inEvent = eventSubgroupId > 0;

      // Get location string (world + route if available)
      const statusLine = getLocationString(courseId, routeId, inEvent);

      console.log(`Data: Speed=${speed.toFixed(1)} kph, Power=${currentPower}W, AvgPower=${avgPower.toFixed(1)}W, Duration=${duration.toFixed(0)}s, Distance=${distanceMeters.toFixed(0)}m, Location=${statusLine}`);

      // Initialize ride start time if not set
      if (!this.rideStartTime && duration > 0) {
        this.rideStartTime = Date.now() - (duration * 1000);
      }

      // Format speed and distance based on units
      const speedStr = this.formatSpeed(speed);
      const distanceStr = this.formatDistance(distanceMeters);
      const powerStr = `${Math.round(currentPower)}W`;

      // Create presence activity
      const activity = {
        details: `${speedStr} • ${distanceStr} | ${powerStr}`,
        state: statusLine,
        startTimestamp: this.rideStartTime,
        largeImageKey: 'zwift_logo',
        largeImageText: 'Riding in Zwift',
        instance: false
      };

      console.log('Setting activity:', JSON.stringify(activity, null, 2));

      await this.client.setActivity(activity)
        .then(() => {
          console.log(`✓ Discord accepted activity update: ${speedStr} • ${distanceStr} | ${powerStr}`);
        })
        .catch((err) => {
          console.error('✗ Discord rejected activity:', err.message);
          console.error('Full error:', err);
        });
    } catch (error) {
      console.error('Error updating Discord presence:', error);
    }
  }

  formatSpeed(speedKph) {
    // Speed comes in kph from Sauce4Zwift
    if (this.units === 'metric') {
      return `${speedKph.toFixed(1)} kph`;
    }

    // Convert to mph for imperial
    const mph = speedKph * 0.621371;
    return `${mph.toFixed(1)} mph`;
  }

  formatDistance(meters) {
    // Distance comes in meters from Sauce4Zwift
    if (this.units === 'metric') {
      const km = meters / 1000;
      return `${km.toFixed(2)} km`;
    }

    // Convert to miles for imperial
    const miles = meters * 0.000621371;
    return `${miles.toFixed(2)} mi`;
  }

  formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  clearPresence() {
    if (this.isConnected && this.client) {
      try {
        this.client.clearActivity();
        console.log('Cleared Discord presence');
      } catch (error) {
        console.error('Error clearing Discord presence:', error);
      }
    }
    this.rideStartTime = null;
  }

  disconnect() {
    if (this.client) {
      this.clearPresence();
      this.client.destroy();
      this.client = null;
      this.isConnected = false;
      console.log('Disconnected from Discord RPC');
    }
  }
}
