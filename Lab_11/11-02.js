const WebSocket = require('ws');
const fs = require('fs');

const wss = new WebSocket.Server({ port: 4001, host: 'localhost' });

wss.on('connection', (ws) => {
    const duplex = WebSocket.createWebSocketStream(ws, { encoding: 'utf8' });
    let rfile = fs.createReadStream('./MyFile.txt');
    rfile.pipe(duplex);
});
