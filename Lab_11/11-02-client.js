const WebSocket = require('ws');
const fs = require('fs');
const ws = new WebSocket(`ws:/localhost:4001`);

ws.on(`open`, () => {
    const duplex = WebSocket.createWebSocketStream(ws, { encoding: 'utf8' });
    if (!fs.existsSync('./download')) {
        fs.mkdir('./download', (err1 => console.log(err1)));
    }
    let wfile = fs.createWriteStream(`./download/file.txt`);
    duplex.pipe(wfile);
});
