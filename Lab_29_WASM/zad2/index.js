const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const wasmPath = path.resolve(__dirname + '/../Source.wasm');
const wasmCode = fs.readFileSync(wasmPath);
const wasmImports = {};
const wasmModule = new WebAssembly.Module(wasmCode);
const wasmInstance = new WebAssembly.Instance(wasmModule, wasmImports);

app.get('/', (request, response) => {
    response.sendFile('index.html', { root: __dirname });
});

app.get('/wasm', (request, response) => {
    response.sendFile('source.wasm', { root: __dirname + '/../' });
});

app.get('/sum', (request, response) => {
    response.json(wasmInstance.exports.sum(3, 4));
});

app.listen(3000, () => {
    console.log('Second task: http://localhost:3000');
});
