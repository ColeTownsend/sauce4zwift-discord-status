import DiscordRPC from 'discord-rpc';

export class DiscordPresenceManager {
  constructor(clientId) {
    this.clientId = clientId;
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

  updatePresence(athleteData) {
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
      // Extract data with fallbacks
      const speed = athleteData.speed || athleteData.currentSpeed || 0;
      const power = athleteData.power || athleteData.currentPower || 0;
      const avgPower = athleteData.avgPower || athleteData.averagePower || power;
      const duration = athleteData.duration || athleteData.elapsed || 0;

      // Initialize ride start time if not set
      if (!this.rideStartTime && duration > 0) {
        this.rideStartTime = Date.now() - (duration * 1000);
      }

      // Format speed (convert to appropriate unit if needed)
      const speedStr = this.formatSpeed(speed);
      const powerStr = `${Math.round(power)}W`;
      const avgPowerStr = `${Math.round(avgPower)}W avg`;

      // Create presence activity
      const activity = {
        details: `${speedStr} | ${powerStr}`,
        state: `Avg Power: ${avgPowerStr}`,
        startTimestamp: this.rideStartTime,
        largeImageKey: 'zwift_logo', // You'll need to upload this to Discord Developer Portal
        largeImageText: 'Zwift',
        smallImageKey: 'power_meter', // You'll need to upload this to Discord Developer Portal
        smallImageText: powerStr,
        instance: false
      };

      this.client.setActivity(activity);
      console.log(`Updated Discord presence: ${speedStr} | ${powerStr}`);
    } catch (error) {
      console.error('Error updating Discord presence:', error);
    }
  }

  formatSpeed(speed) {
    // Speed is typically in m/s from Sauce4Zwift
    // Convert to mph or kph based on preference
    const mph = speed * 2.23694; // m/s to mph
    const kph = speed * 3.6; // m/s to kph

    // Default to mph (you can add a config option for this)
    return `${mph.toFixed(1)} mph`;
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
