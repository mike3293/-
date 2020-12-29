const fs = require('fs');
const express = require('express');
const app = express();

app.get('/html', (request, response) => {
    let html = fs.readFileSync('./index.html');
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(html);
});

app.listen(5000);

console.log('Server running at http://localhost:5000/');
