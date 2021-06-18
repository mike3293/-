const JsonRPCServer = require('jsonrpc-server-http-nats');

const server = new JsonRPCServer();

let validator = (params) => {
    console.log(params);
    if (!Array.isArray(params))
        throw new Error('Ожидается массив');
    if (params.length <= 1)
        throw new Error('Массив должен иметь больше двух элементов');
    params.forEach((item) => {
        if (!isFinite(item))
            throw new Error('Ожидается число');
    });
    return params;
};

server.on('sum', validator, (params, channel, response) => {
    response(null, params.reduce((a, b) => a + b));
});

server.on('mul', validator, (params, channel, response) => {
    response(null, params.reduce((a, b) => a * b));
});

server.on('div', validator, (params, channel, response) => {
    response(null, params[0] / params[1]);
});

server.on('proc', validator, (params, channel, response) => {
    response(null, params[0] * 100 / params[1]);
});

server.listenHttp({ host: 'localhost', port: 3000 }, () => {
    console.log(`Listening to http://localhost:3000/`);
});
