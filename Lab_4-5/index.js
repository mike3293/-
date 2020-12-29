const express = require('express');
const bodyParser = require('body-parser');
const DataBase = require('./db/DataBase');

const HOST = 'localhost';
const PORT = 5000;

const app = express();
const db = new DataBase(DataBase.names());

app.use(bodyParser.json());
app.use(express.static('.'));

let timerId = 0;
let timerIdout = 0;
let Comm = 0;
let Stat = 0;
let start = 0;
let St1 = 0;
let finish = 0;
let isStatCollection = false;
let lastStat = {
    seconds: 0,
    requests: 0,
    commits: 0,
};
let startCollectTime;
let autoFinishCollectStat;

db.on('get', async (request, response) => {
    if (isStatCollection) {
        lastStat.requests++;
    }
    await response.json(await db.getRows());
    console.log('DB get');
});
db.on('post', async (request, response) => {
    if (isStatCollection) {
        lastStat.requests++;
    }
    await response.json(await db.addRow(request.body));
    console.log('DB post');
});
db.on('put', async (request, response) => {
    if (isStatCollection) {
        lastStat.requests++;
    }
    await response.json(await db.updateRow(request.body));
    console.log('DB put');
});
db.on('delete', async (request, response) => {
    if (isStatCollection) {
        lastStat.requests++;
    }
    await response.json(await db.removeRow(request.query.id));
    console.log('DB delete');
});
db.on('commit', async (request, response) => {
    if (isStatCollection) {
        lastStat.commits++;
    }
    if (response)
        await response.json(await db.stCommit());
    console.log('DB commit');
});

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/index.html');
    console.log('App sendFile');
});

app.get('/api/ss', (request, response) => {
    if (isStatCollection) {
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        response.end('Сбор статистики еще не завершен');
    } else {
        response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        response.end(JSON.stringify(lastStat));
    }
    console.log('Open statistic');

});

app.get('/commit', (request, response) => {
    db.emit('commit', request, response);
    console.log('App commit');
});

app.get('/api/db', (request, response) => {
    db.emit('get', request, response);
    console.log('App get');
});
app.post('/api/db', (request, response) => {
    db.emit('post', request, response);
    console.log('App post');
});
app.put('/api/db', (request, response) => {
    db.emit('put', request, response);
    console.log('App put');
});
app.delete('/api/db', (request, response) => {
    db.emit('delete', request, response);
    console.log('App delete');
});

app.listen(PORT, HOST, () => {
    const URL = `http://${HOST}:${PORT}`;
    console.log('Listening on ' + URL);
});

function printStat() {
    console.log(returnJsonStat());
    isStatCollection = false;
}

function returnJsonStat() {
    if (isStatCollection) {
        lastStat.seconds = Math.round((Date.now() - startCollectTime) / 1000);
    }
    return JSON.stringify(lastStat);
}

process.stdin.setEncoding('utf-8');
process.stdin.on('readable', () => {
    while ((chunk = process.stdin.read()) != null) {

        start = Date.now();
        let num = Number(chunk.trim().replace(/[^\d]/g, ''));
        if (chunk.trim().includes('sd')) {
            if (!num == '') {
                process.stdout.write('->process exit after ' + num + ' second\n');
            } else if (num == 0) num = '';
            clearTimeout(timerIdout);
            timerIdout = setTimeout(() => process.exit(0), num * 1000);
            if (!num) {
                process.stdout.write('->Exit timer stoped\n');
            }
        } else if (chunk.trim().includes('sc')) {
            finish = 0;
            if (!num == '') {

                St1 = (new Date()).toString();
                process.stdout.write('->commit every ' + num + ' second\n');
            } else if (num == 0) num = '';
            clearInterval(timerId);
            timerId = setInterval(() => {
                db.emit('commit');

                process.stdout.write('COMMIT\n');
            }, num * 1000);
            timerId.unref();
            if (!num) {
                clearInterval(timerId);
                process.stdout.write('->commit stoped\n');

                finish = (new Date()).toString();
            }
        } else if (chunk.trim().includes('ss')) {
            if (isStatCollection) {
                clearTimeout(autoFinishCollectStat);
                printStat();
            } else {
                if (!num == '') {
                    startCollectTime = Date.now();
                    lastStat = {
                        seconds: 0,
                        requests: 0,
                        commits: 0,
                    };
                    isStatCollection = true;
                    autoFinishCollectStat = setTimeout(() => {
                        printStat();
                    }, num * 1000);
                    autoFinishCollectStat.unref();
                    console.log('Statistics will be in ' + num + 'sec.\n');
                } else {
                    console.log('No param\n');
                }
            }

        } else process.stdout.write('Unknow comand: ' + chunk.trim() + '\n');
    }
});
