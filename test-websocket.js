import WebSocket from 'ws';

console.log('Testing WebSocket connection to Sauce4Zwift...');
console.log('Connecting to: ws://localhost:1080/api/ws/events');

const ws = new WebSocket('ws://localhost:1080/api/ws/events');

ws.on('open', () => {
  console.log('✓ WebSocket connected!');
  console.log('Sending subscription request...');

  const subscriptionRequest = {
    type: 'request',
    uid: `test-${Date.now()}`,
    data: {
      method: 'subscribe',
      arg: {
        event: 'nearby',
        subId: 'test-sub'
      }
    }
  };

  ws.send(JSON.stringify(subscriptionRequest));
  console.log('Sent:', JSON.stringify(subscriptionRequest, null, 2));
});

ws.on('message', (data) => {
  console.log('\n=== Received message ===');
  try {
    const message = JSON.parse(data.toString());
    console.log(JSON.stringify(message, null, 2));
  } catch (e) {
    console.log('Raw:', data.toString());
  }
});

ws.on('error', (error) => {
  console.error('✗ WebSocket error:', error.message);
  console.error('Full error:', error);
});

ws.on('close', (code, reason) => {
  console.log(`✗ WebSocket closed. Code: ${code}, Reason: ${reason || 'No reason provided'}`);
  process.exit(0);
});

// Keep alive for 30 seconds
setTimeout(() => {
  console.log('\nTest complete. Closing connection...');
  ws.close();
}, 30000);
