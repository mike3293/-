let http = require('http');
let fs = require('fs');

http.createServer((request, response) => {
    if (request.url === '/html') {
        let html = fs.readFileSync('./index.html');
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        response.end(html);
    } else {
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        response.end('Hello world');
    }
}).listen(5000);
console.log('start');
