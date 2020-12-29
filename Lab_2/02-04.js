const fs = require('fs');
const express = require('express');
const app = express();

app.get('/api/name', (request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Городилов Михаил Петрович');
});

app.get('/xmlhttprequest', (require, response) => {
    let html = fs.readFileSync('./xmlhttprequest.html');
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(html);
});

app.listen(5000);

console.log('Server running at http://localhost:5000/');
