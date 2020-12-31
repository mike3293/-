const WebSocket = require('ws');
const fs = require('fs');

const clientSocket = new WebSocket('ws:/localhost:8001');

clientSocket.on('open', () => {
    const stream = WebSocket.createWebSocketStream(clientSocket, { encoding: 'utf8' });
    const writeTo = fs.createWriteStream('./file2.txt');
    stream.pipe(writeTo);
});
