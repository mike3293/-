const rpcWSS = require('rpc-websockets').Server;

const socket = new rpcWSS({ port: 4000, host: 'localhost' });

socket.setAuth(
    (credentials) => {
        console.log(credentials.login + credentials.password);
        return credentials.login === 'admin' && credentials.password === 'admin';
    },
);
socket.register('sum', (params) => params.reduce((a, b) => a + b, 0)).public();
socket.register('mul', (params) => params.reduce((a, b) => a * b, 1)).public();
socket.register('square', square).public();
socket.register('fib', fib).protected();
socket.register('fact', fact).protected();

function square(args) {
    if (args.length === 1) {
        return Math.PI * Math.pow(args[0], 2);
    } else if (args.length === 2) {
        return args[0] * args[1];
    } else {
        return 0;
    }
}

function fib(n) {
    let currentSize = 0;
    let numbers = [];
    let curr = 1;
    let next = 1;
    while (currentSize < n) {
        numbers.push(curr + next);
        next += curr;
        curr = next - curr;
        currentSize++;
    }
    return numbers;
}

function fact(n) {
    return n === 1 ? 1 : n * fact(n - 1);
}
