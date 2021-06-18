const redis = require('redis');
const config = require('./options');

const client = redis.createClient(config);

client.on('error', err => { console.log('error: ' + err); });
client.on('subscribe', (channel, count) => {
    console.log('subscribe:', 'channel =', channel, 'count =', count);
});
client.on('message', (channel, message) => {
    console.log('sub channel: ' + channel + ': ' + message);
});

client.subscribe('channel-01');

setTimeout(() => {
    client.unsubscribe();
    client.quit();
}, 60000);
