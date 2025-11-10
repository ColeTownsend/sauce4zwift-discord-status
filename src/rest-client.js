import { EventEmitter } from 'events';

export class SauceRestClient extends EventEmitter {
  constructor(host = 'localhost', port = 1080) {
    super();
    this.host = host;
    this.port = port;
    this.pollInterval = 2000; // Poll every 2 seconds
    this.pollTimer = null;
    this.isPolling = false;
  }

  async fetchAthleteData() {
    try {
      const url = `http://${this.host}:${this.port}/api/athlete/v1/self`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching athlete data:', error.message);
      return null;
    }
  }

  startPolling() {
    if (this.isPolling) {
      return;
    }

    this.isPolling = true;
    console.log('Started polling Sauce4Zwift REST API every 2 seconds');

    const poll = async () => {
      const data = await this.fetchAthleteData();

      if (data) {
        // Check if we're watching/riding
        if (data.watching || data.self) {
          this.emit('athleteData', data);
        }
      }

      if (this.isPolling) {
        this.pollTimer = setTimeout(poll, this.pollInterval);
      }
    };

    poll(); // Start immediately
  }

  stopPolling() {
    this.isPolling = false;
    if (this.pollTimer) {
      clearTimeout(this.pollTimer);
      this.pollTimer = null;
    }
    console.log('Stopped polling Sauce4Zwift REST API');
  }

  async testConnection() {
    try {
      const url = `http://${this.host}:${this.port}/api`;
      const response = await fetch(url);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async getSetting(settingName) {
    try {
      const url = `http://${this.host}:${this.port}/api/rpc/v1/getSetting/${settingName}`;
      const response = await fetch(url);
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error(`Failed to get setting ${settingName}:`, error.message);
      return null;
    }
  }
}
