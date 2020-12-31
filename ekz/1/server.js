const http = require('http');

http.createServer((req, res) => {
    const sampleObject = { a: 1, b: 'string' };
    const sampleJson = JSON.stringify(sampleObject);
    res.end(sampleJson);
}).listen(8000);
