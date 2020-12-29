const fs = require('fs');
const express = require('express');
const app = express();

app.get('/jpg', (request, response) => {
    const jpgFile = './pic.jpg';
    let jpg = null;
    fs.stat(jpgFile, (err, stat) => {
        if (err) {
            console.log('error', err);
        } else {
            jpg = fs.readFileSync(jpgFile);
            response.writeHead(200, { 'Content-Type': 'image/jpg', 'Content-Length': stat.size });
            response.end(jpg, 'binary');
        }
    });
});

app.listen(5000);

console.log('Server running at http://localhost:5000/');
