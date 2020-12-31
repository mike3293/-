const http = require('http');

const options = {
    host: 'localhost',
    port: 8000,
    method: 'GET',
};

const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log('a: ', JSON.parse(data).a));
});

req.end();
