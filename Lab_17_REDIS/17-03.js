const redis = require('redis');
const config = require('./options');

function incrQueries(client, count) {
    console.time(`\t${count}-incr`);
    for (let n = 0; n < count; n++) {
        client.incr('incr');
    }
    console.timeEnd(`\t${count}-incr`);

    client.get('incr', (err, data) => {
        if (err) console.log(err);
        else console.log('after incr: ' + data);
    });
}

function decrQueries(client, count) {
    console.time(`\t${count}-decr`);
    for (let n = 0; n < count; n++) {
        client.decr('incr');
    }
    console.timeEnd(`\t${count}-decr`);

    client.get('incr', (err, data) => {
        if (err) console.log(err);
        else console.log('after decr: ' + data);
    });
}

const client = redis.createClient(config);
const count = 10000;

incrQueries(client, count);
decrQueries(client, count);

client.on('ready', () => { client.set('incr', 0); });
client.on('error', err => { console.log('error: ' + err); });

client.quit();
