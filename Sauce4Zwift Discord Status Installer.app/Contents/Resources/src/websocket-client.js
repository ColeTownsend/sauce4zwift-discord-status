import WebSocket from 'ws';
import { EventEmitter } from 'events';

export class SauceWebSocketClient extends EventEmitter {
  constructor(host = 'localhost', port = 1080) {
    super();
    this.host = host;
    this.port = port;
    this.ws = null;
    this.reconnectInterval = 5000;
    this.reconnectTimer = null;
    this.isConnecting = false;
    this.shouldReconnect = true;
  }

  connect() {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    this.isConnecting = true;
    const url = `ws://${this.host}:${this.port}/api/ws/events`;

    console.log(`Connecting to Sauce4Zwift at ${url}...`);

    try {
      this.ws = new WebSocket(url);

      this.ws.on('open', () => {
        this.isConnecting = false;
        console.log('Connected to Sauce4Zwift WebSocket API');
        this.emit('connected');

        // Subscribe to watching events for athlete data
        this.subscribeToEvents();
      });

      this.ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });

      this.ws.on('close', () => {
        this.isConnecting = false;
        console.log('Disconnected from Sauce4Zwift');
        this.emit('disconnected');

        if (this.shouldReconnect) {
          this.scheduleReconnect();
        }
      });

      this.ws.on('error', (error) => {
        this.isConnecting = false;
        console.error('WebSocket error:', error.message);
        this.emit('error', error);
      });
    } catch (error) {
      this.isConnecting = false;
      console.error('Failed to create WebSocket connection:', error);
      this.scheduleReconnect();
    }
  }

  subscribeToEvents() {
    // Subscribe to nearby events to get athlete data (includes self)
    const subscriptionRequest = {
      type: 'request',
      uid: this.generateUID(),
      data: {
        method: 'subscribe',
        arg: {
          event: 'nearby',
          subId: 'discord-status-sub'
        }
      }
    };

    this.send(subscriptionRequest);
    console.log('Subscribed to nearby events');
  }

  handleMessage(message) {
    // Log all messages for debugging
    console.log('Received message type:', message.type);

    // Handle different message types
    if (message.type === 'event' && message.data) {
      const eventData = message.data;

      // Nearby events return an array of athletes
      if (Array.isArray(eventData)) {
        // Find self (the athlete being watched)
        const self = eventData.find(a => a.self === true || a.watching === true);
        if (self) {
          console.log('Found self athlete data');
          this.emit('athleteData', self);
        }
      } else if (eventData.state || eventData.stats) {
        // Single athlete data
        console.log('Received athlete data');
        this.emit('athleteData', eventData);
      }
    } else if (message.type === 'response') {
      // Handle subscription responses
      console.log('Received response:', message.data?.result || 'OK');
    }
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.error('Cannot send message: WebSocket is not connected');
    }
  }

  scheduleReconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    console.log(`Reconnecting in ${this.reconnectInterval / 1000} seconds...`);
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, this.reconnectInterval);
  }

  generateUID() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  disconnect() {
    this.shouldReconnect = false;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
