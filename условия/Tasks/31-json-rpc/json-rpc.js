const rpc = require('jsonrpc-server-http-nats');
const server = new rpc();

let validator = (params) => {
    if (!Array.isArray(params)) throw new Error('I want Array!');
    if (params.length < 2) throw new Error('I want > 2 numbers');
    params.forEach(p => {
        if (!isFinite(p)) throw new Error('I want a number')
    });

    return params;
};

let sum = (params) => {
    let sum = 0;
    params.forEach(p => sum += +p);

    return sum;
};

server.on('sum', validator, (params, channel, res) => {
    res(null, sum(params));
});

server.listenHttp({host: '127.0.0.1', port: 3000}, () => {
    console.log('JSON-RPC Server REDY')
});
