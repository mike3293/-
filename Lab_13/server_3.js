const net = require('net');

let HOST = '0.0.0.0';
let PORT = 4000;
let PORT2 = 5000;

let sums = new Map();

net.createServer((Server) => ServerStart(Server)).listen(PORT, HOST);
net.createServer((Server) => ServerStart(Server)).listen(PORT2, HOST);

function ServerStart(sock) {
    console.log(`Server connected: ${sock.remoteAddress}:${sock.remotePort}`);

    sock.on('error', (e) => {
        console.log(`Server error: ${e}`);
    });

    let buffer = Buffer.alloc(4);
    if (!sums.has(sock)) {
        sums.set(sock, 0);
    }
    setInterval(() => {
        buffer.writeInt32LE(sums.get(sock), 0);
        sock.write(buffer);
    }, 5000);

    sock.on('data', (data) => {
        sock.write(`Echo: ${data}`);
        sums.set(sock, +sums.get(sock) + +data.readInt32LE());
        console.log(`Server data: ${sums.get(sock)}`);
    });
}
