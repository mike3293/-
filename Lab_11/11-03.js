const WebSocket = require('ws');

const broadcastSocket = new WebSocket.Server({ port: 4000, host: 'localhost' });
let outMessageCount = 0;
let countClient = 0;
broadcastSocket.on('connection', (ws) => {
    ws.on('pong', (data) => {
        console.log('working client detected: ' + data);
    });

    setInterval(() => {
        countClient = 0;
        broadcastSocket.clients.forEach((client) => {
            countClient++;
            client.ping('ping');
        });
        console.log('Count of current connections: ' + countClient);
    }, 5000);
    setInterval(() => {
        broadcastSocket.clients.forEach((client) => {
            client.send('11-03-server: ' + outMessageCount++);
        });
    }, 15000);
});
