const redis = require('redis');
const config = require('./options');

function hsetQueries(client, count) {
    const timeLabel = `\t${count}-hset`;

    console.time(timeLabel);
    for (let n = 0; n < count; n++) {
        client.hset('id', n, JSON.stringify({ id: n, val: `val - ${n}` }));
    }
    console.timeEnd(timeLabel);
}

function hgetQueries(client, count) {
    const timeLabel = `\t${count}-hget`;

    console.time(timeLabel);
    for (let n = 0; n < count; n++) {
        client.hget('id', n);
    }
    console.timeEnd(timeLabel);
}

const client = redis.createClient(config);
const count = 10000;

hsetQueries(client, count);
hgetQueries(client, count);

client.on('error', err => { console.log('error: ' + err); });

client.quit();
