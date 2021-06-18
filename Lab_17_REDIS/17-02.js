const redis = require('redis');
const config = require('./options');

function setQueries(client, count) {
    const timeLabel = `\t${count}-set`;

    console.time(timeLabel);
    for (let n = 0; n < count; n++) {
        client.set(n, `set${n}`);
    }
    console.timeEnd(timeLabel);
}

function getQueries(client, count) {
    const timeLabel = `\t${count}-get`;

    console.time(timeLabel);
    for (let n = 0; n < count; n++) {
        client.get(n, (err, data) => {
            if (err) console.log(err);
        });
    }
    console.timeEnd(timeLabel);
}

function delQueries(client, count) {
    const timeLabel = `\t${count}-del`;

    console.time(timeLabel);
    for (let n = 0; n < count; n++) {
        client.del(n, (err) => {
            if (err) console.log(err);
        });
    }
    console.timeEnd(timeLabel);
}

const client = redis.createClient(config);
const count = 10000;

setQueries(client, count);
getQueries(client, count);
delQueries(client, count);

client.on('error', err => { console.log('error: ' + err); });

client.quit();
