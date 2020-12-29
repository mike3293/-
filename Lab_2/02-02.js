let http = require('http');
let fs = require('fs');

http.createServer((request, response) => {
    if (request.url === '/pic') {
        const pngf = './pic.png';
        let png = null;
        fs.stat(pngf, (err, stat) => {
            if (err) {
                console.log('error', err);
            } else {
                png = fs.readFileSync(pngf);
                response.writeHead(200, { 'Content-Type': 'image/png', 'Content-Length': stat.size });
                response.end(png);
            }
        });
    } else {
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        response.end('Hello world');
    }
}).listen(5000);
console.log('start');
