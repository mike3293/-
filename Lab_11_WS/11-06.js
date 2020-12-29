const rssWSS = require('rpc-websockets').Server;

const server = new rssWSS({ port: 4000, host: 'localhost' });

server.event('A');
server.event('B');
server.event('C');

console.log('Type A, B or C to fire such events');

const input = process.stdin;
input.setEncoding('utf-8');
process.stdout.write('> ');

input.on('data', (data) => {
    server.emit(data.slice(0, -1));
    process.stdout.write('> ');
});
