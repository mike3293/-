const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const send = require('./m0603/m0603');

const HOST = 'localhost';
const PORT = 5000;

const app = express();

app.use(bodyParser.json());

function loadHTML(request, response, source) {
    new Promise((resolve, reject) => {
        try {
            let html = fs.readFileSync(source);
            resolve(html);
        } catch (err) {
            reject(err);
        }
    }).then(html => {
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        response.end(html);
    }).catch(err =>
        console.log(err));
}

let lastSendObj = '';

app.get('/', (request, response) => {
    loadHTML(request, response, 'index.html');
});

app.post('/send', (request, response) => {
    response.writeHead(200, {'Content-Type': 'json/application; charset=utf-8'});
    lastSendObj = JSON.stringify(request.body);
    console.log(lastSendObj);

    send.send(request.body.message);

    response.end(lastSendObj);
});

app.listen(PORT, HOST, () => {
    console.log('Listening on ' + `http://${HOST}:${PORT}`);
});
