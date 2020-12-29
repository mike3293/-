let http = require('http');
let url = require('url');
let fs = require('fs');
var state = '<h1>NORM<h1>';

http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(state);
}).listen(5000, 'localhost', () => {
    console.log('Server start at 5000 port');
});


process.stdin.setEncoding('utf-8');
process.stdin.on('readable', () => {
    let chunk = null;
    while ((chunk = process.stdin.read()) != null) {
        if (chunk.trim() === 'exit')
            process.exit(0);
        else if (chunk.trim() === 'norm'
            || chunk.trim() === 'test'
            || chunk.trim() === 'stop'
            || chunk.trim() === 'idle') {
            state = '<h1>' + chunk.trim().toUpperCase() + '<h1>';
            process.stdout.write('->' + chunk.trim() + '\n');
        } else
            process.stdout.write('Unknown command: ' + chunk.trim() + '\n');
    }
});
