const WebSocket = require('ws');

const broadcastSocket = new WebSocket('ws://localhost:4000/');
broadcastSocket.onopen = () => {
    setInterval(() => {
        broadcastSocket.ping('ping');
    }, 5000);
};
broadcastSocket.on('pong', data => {
    console.log(data + ' - pong');
});
broadcastSocket.on('message', (data) => {
    console.log(data);
});
