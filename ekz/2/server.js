const WebSocket = require('ws');
const fs = require('fs');

const serverSocket = new WebSocket.Server({ port: 8001, host: 'localhost' });

serverSocket.on('connection', (ws) => {
    const stream = WebSocket.createWebSocketStream(ws, { encoding: 'utf8' });
    const readFrom = fs.createReadStream('./file.txt');
    readFrom.pipe(stream);
});
