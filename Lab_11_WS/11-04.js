const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 4000, host: 'localhost' });
let messageCount = 0;
wss.on('connection', (ws) => {
    ws.on(`message`, (data) => {
        let message = JSON.parse(data);
        message.server = messageCount++;
        console.log(message);
        ws.send(JSON.stringify(message));
    });
});
