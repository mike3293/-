const net = require('net');

let HOST = '127.0.0.1';
let PORT = 4000;

let client = new net.Socket();
let buffer = new Buffer.alloc(4);

client.connect(PORT, HOST, () => {
    console.log(`Client connected: ${client.remoteAddress}:${client.remotePort}`);

    let send_number = 0;
    let input = process.stdin;
    input.on('data', data => {
        send_number = data;
    });
    setInterval(() => {
        if (!client.destroyed)
            client.write((buffer.writeInt32LE(send_number, 0), buffer));
        send_number = 0;
    }, 1000);
});

setTimeout(() => {
    client.destroy();
}, 20 * 1000);

client.on('data', data => {
    console.log(`Client data: ${data.readInt32LE()}`);
});

client.on('close', () => {
    console.log('Client closed');
});

client.on('error', (e) => {
    console.log('Client error: ', e);
});
