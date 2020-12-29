const express = require('express');
const app = express();

app.get('/api/name', (request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Городилов Михаил Петрович');
});

app.listen(5000);

console.log('Server running at http://localhost:5000/');
