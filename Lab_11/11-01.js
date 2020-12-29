const WebSocket = require('ws');
const fs = require('fs');

//Server
const wss = new WebSocket.Server({ port: 4000, host: `localhost` });
let k = 0;
wss.on(`connection`, async (ws) => {
    console.log('Connection');
    const duplex = WebSocket.createWebSocketStream(ws, { encoding: 'utf8' });

    if (!fs.existsSync('./upload')) {
        fs.mkdir('./upload', (err1 => console.log(err1)));
    }
    let wfile = fs.createWriteStream(`./upload/file${++k}.txt`);
    duplex.pipe(wfile);
    console.log('successfully write to file');
});
