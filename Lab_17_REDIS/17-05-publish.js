const redis = require('redis');
const config = require('./options');

const client = redis.createClient(config);

client.on('error', err => { console.log('error: ' + err); });
client.publish('channel-01', 'message 1 from pub-client');
client.publish('channel-01', 'message 2 from pub-client');

setTimeout(() => { client.publish('channel-01', 'message 3 from pub-client'); }, 10000);
setTimeout(() => { client.publish('channel-01', 'message 4 from pub-client'); }, 20000);
setTimeout(() => { client.publish('channel-01', 'message 5 from pub-client'); }, 30000);
setTimeout(() => { client.publish('channel-01', 'message 6 from pub-client'); }, 40000);

setTimeout(() => client.quit(), 60000);
