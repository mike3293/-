const rpcSocket = require('rpc-websockets').Client;

const socket = new rpcSocket('ws://localhost:4000');

socket.on('open', () => {
    socket.call('square', [3]).then((answer) => console.log('square: ' + answer));
    socket
        .call('square', [5, 4])
        .then((answer) => console.log('square: ' + answer));
    socket
        .call('sum', [2, 4, 6, 8, 10])
        .then((answer) => console.log('sum: ' + answer));
    socket
        .call('mul', [3, 5, 7, 9, 11, 13])
        .then((answer) => console.log('mul: ' + answer));

    socket.login({ login: 'admin', password: 'admin' }).then(async () => {
        socket.call('fib', 7).then((answer) => console.log('fib: ' + answer));
        socket.call('fact', 5).then((answer) => console.log('fact: ' + answer));
        await cTask();
    }).catch(e => console.log(e.message));
});

async function cTask() {
    console.log(
        'Complicated expression result: ' +
        (await socket.call('sum', [
            await socket.call('square', [3]),
            await socket.call('square', [5, 4]),
            await socket.call('mul', [3, 5, 7, 9, 11, 13]),
        ])) +
        // fib function gets as a result an array of numbers
        (await socket.call('fib', 7)).reduce((a, b) => a + b, 0) *
        (await socket.call('mul', [2, 4, 6])),
    );
}
