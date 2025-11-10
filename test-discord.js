import DiscordRPC from 'discord-rpc';

const clientId = '1324055805842161745';

console.log('Testing Discord RPC connection...');
console.log('Client ID:', clientId);

const client = new DiscordRPC.Client({ transport: 'ipc' });

client.on('ready', () => {
  console.log('✓ Connected to Discord!');
  console.log('Logged in as:', client.user.username);

  console.log('\nSetting activity...');

  client.setActivity({
    details: 'Testing Discord Presence',
    state: 'This is a test',
    startTimestamp: Date.now(),
  }).then(() => {
    console.log('✓ Activity set successfully!');
    console.log('\nCheck your Discord profile now!');
    console.log('You should see "Playing Testing Discord Presence"');
    console.log('\nPress Ctrl+C to exit...');
  }).catch(err => {
    console.error('Error setting activity:', err);
  });
});

client.login({ clientId }).catch(err => {
  console.error('Failed to connect to Discord:', err);
  process.exit(1);
});
