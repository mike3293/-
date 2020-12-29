let http = require('http');
let url = require('url');
let fs = require('fs');

function factorial(n) {
    return (n < 2 ? n : n * factorial(n - 1));
}

http.createServer((req, res) => {
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
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(JSON.stringify({ k: k, fact: factorial(k) }));
            }
            break;
    }
}).listen(5000, 'localhost', () => {
    console.log('Server start at 5000 port');
});
