const redis = require('redis');
const config = require('./options');

const client = redis.createClient(config);

client.on('connect', () => { console.log('connect'); });

client.on('ready', () => { console.log('ready'); });

client.on('error', err => { console.log('error: ' + err); });

client.on('end', () => { console.log('end'); });

client.on('warning', () => { console.log('warning'); });

client.quit();
