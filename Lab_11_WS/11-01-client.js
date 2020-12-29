const WebSocket = require('ws');
const fs = require('fs');
const ws = new WebSocket(`ws:/localhost:4000`);

ws.on('open', () => {
    console.log('Open');
    const duplex = WebSocket.createWebSocketStream(ws, { encoding: `utf8` });
    let rfile = fs.createReadStream(`./Myfile.txt`);
    rfile.pipe(duplex);
    console.log('Send');
});
