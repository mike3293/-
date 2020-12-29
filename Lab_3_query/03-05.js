let http = require('http');
let url = require('url');
let fs = require('fs');
const server = http.createServer;

function factorial(n) {
    return (n < 2 ? n : n * factorial(n - 1));
}

function Fact(n, cb) {
    this.fn = n;
    this.ffact = factorial;
    this.fcb = cb;
    this.calc = () => { setImmediate(() => { this.fcb(null, this.ffact(this.fn)); }); };
}

async function factCycleTick(req, res) {
    let result = '';
    let n = 1;
    const d = Date.now();
    for (let k = 1; k < 1000; k++) {
        process.nextTick(async () => {
            result += (n++) + '.Результат: ' + (Date.now() - d) + '-' + k + '/' + getSimpleFact(k) + '<br/>';
            await sleep(1);
        });
    }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    setTimeout(() =>
        res.end(result), 100);
}

server((req, res) => {
    switch (url.parse(req.url).pathname) {
        case '/':
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(fs.readFileSync('index.html'));
            break;
        case '/fact':
            if (url.parse(req.url).query === null) {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end('Hello World');
            } else {
                let k = url.parse(req.url, true).query.k;
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                let fact = new Fact(k, (err, fact) => {
                    res.end(JSON.stringify(
                        {
                            k: k,
                            fact: fact,
                        },
                    ));
                });
                fact.calc();
            }
            break;
    }
}).listen(5000, 'localhost', () => {
    console.log('Server start at 5000 port');
});
