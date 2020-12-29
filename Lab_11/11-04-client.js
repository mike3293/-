const WebSocket = require('ws');

const name = process.argv[2] || 'x';
const jsonSocket = new WebSocket('ws://localhost:4000/');
jsonSocket.onopen = () => {
    let message = { client: name, timestamp: Date.now() };
    jsonSocket.send(JSON.stringify(message));
};
jsonSocket.onmessage = (message) => {
    console.log(message.data);
    jsonSocket.close();
};
