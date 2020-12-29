let http = require('http');
let url = require('url');
let fs = require('fs');
let data = require('./Database');

let db = new data.DB();

let Comm = 0;
let timerIdout = 0;
let timerId = 0;
let timerIdS = 0;
let requestCounter = 0;
let start = 0;
let finish = 0;

db.on('GET', (req, res) => {
    console.log('DB GET');
    res.end(JSON.stringify(db.select()));
});
db.on('POST', (req, res) => {
    console.log('DB POST');
    req.on('data', data => {
        let result = JSON.parse(data);
        db.insert(result);
        res.end(JSON.stringify(result));
    });
});
db.on('PUT', (req, res) => {
    console.log('DB PUT');
    req.on('data', data => {
        let result = JSON.parse(data);
        res.end(JSON.stringify(db.update(result)));
    });
});
db.on('DELETE', (req, res) => {
    console.log('DB DELETE');
    let id = url.parse(req.url, true).query.id;
    console.log(id);
    res.end(JSON.stringify(db.delete(id)));
});
db.on('commit', () => {
    console.log('DB COMMIT');
    db.commit();
});

let server = http.createServer((req, res) => {
    if (url.parse(req.url).pathname === '/') {
        let html = fs.readFileSync('./index.html');
        res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8',
        });
        res.end(html);
    } else if (url.parse(req.url).pathname === '/api/db') {
        requestCounter++;
        db.emit(req.method, req, res);
    } else if (url.parse(req.url).pathname === '/api/ss') {
        if (finish == 0) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('Сбор статистики еще не завершен');
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ Start: start, Finish: finish, request: requestCounter, commit: Comm }));
        }
        console.log('Open statistic');
    }
});
server.listen(3000);
console.log('start');


process.stdin.setEncoding('utf-8');
process.stdin.on('readable', () => {
    while ((chunk = process.stdin.read()) != null) {
        let num = chunk.trim().replace(/[^\d]/g, '');
        if (chunk.trim().includes('sd')) {
            clearTimeout(timerIdout);
            if (num === '')
                process.stdout.write('->Exit timer stoped\n');
            else {
                process.stdout.write('->process exit after ' + num + ' second\n');
                timerIdout = setTimeout(() => process.exit(0), num * 1000);
            }
        } else if (chunk.trim().includes('sc')) {
            clearInterval(timerId);
            if (num === '') {
                process.stdout.write('->commit stoped\n');
            } else {
                process.stdout.write('->commit every ' + num + ' second\n');
                timerId = setInterval(() => {
                    db.emit('commit');
                    Comm++;
                    process.stdout.write('COMMIT\n');
                }, num * 1000);
                timerId.unref();
            }
        } else if (chunk.trim().includes('ss')) {
            clearInterval(timerIdS);
            if (num === '') {
                finish = (new Date()).toString().substr(3, 21);
                process.stdout.write('->statistic stoped\n');
                process.stdout.write('Time:' + (new Date(finish) - new Date(start)) / 1000 + 's Requests:' + requestCounter + ' Commit:' + Comm + '\n');
            } else {
                Comm = 0;
                requestCounter = 0;
                finish = 0;
                start = (new Date()).toString().substr(3, 21);
                process.stdout.write('->get statistic after ' + num + ' second\n');
                timerIdS = setTimeout(() => {
                    finish = (new Date()).toString().substr(3, 21);
                    process.stdout.write('Time:' + (new Date(finish) - new Date(start)) / 1000 + 's Requests:' + requestCounter + ' Commit:' + Comm + '\n');
                }, num * 1000);
                timerIdS.unref();
            }
        } else process.stdout.write('Unknow comand: ' + chunk.trim() + '\n');
    }
});
