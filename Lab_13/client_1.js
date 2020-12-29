const net = require('net');
const readline = require('readline');

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let HOST = '127.0.0.1';
let PORT = 4000;

let client = new net.Socket();
client.connect(PORT, HOST, () => {
    console.log(`Client connected: ${client.remoteAddress}:${client.remotePort}`);
});

rl.on('line', (input) => {
    switch (input) {
        case 'exit':
            if (!client.destroyed) {
                console.log('Client destroyed');
                client.destroy();
            }
            break;
        default:
            if (!client.destroyed)
                client.write(input);
    }
});

client.on('data', data => {
    console.log(`Client data: ${data.toString().slice(0, 25)}`);
});

client.on('close', () => {
    console.log('Client closed');
});

client.on('error', (e) => {
    console.log('Client error: ', e);
});
