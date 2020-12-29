let http = require('http');
let fs = require('fs');

http.createServer((request, response) => {
    if (request.url === '/api/name') {
        response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        response.end('Городилов');
    } else {
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        response.end('Hello world');
    }
}).listen(5000);
console.log('start');
