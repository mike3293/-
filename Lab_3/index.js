const fs = require('fs');
const express = require('express');
const app = express();
const url = require('url');

// 03-01
let state = 'norm';

app.get('/', (request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end(`<h1>${state}</h1>`);
});

process.stdin.setEncoding('utf-8');
process.stdin.on('readable', () => {
    let chunk = null;
    while ((chunk = process.stdin.read()) != null) {
        const input = chunk.trim();

        if (input === 'exit') process.exit(0);
        else if (input === 'norm' || input === 'test' || input === 'stop' || input === 'idle') {
            process.stdout.write(state + '->' + input + '\n');
            state = input;
        } else process.stdout.write('Unknow comand: ' + input + '\n');
    }
});

// 03-02 - 05
const factorial = n => (n < 2 ? n : n * factorial(n - 1));

const factorialT = (n, callback) => {
    process.nextTick(() => {callback(null, factorial(n));});
};

const factorialI = (n, callback) => {
    setImmediate(() => {callback(null, factorial(n));});

    function f1() {

    }

    function f() {
        f1();
        debugger;
        call;
        window.setImmediate(() => {callback(null, factorial(n));});
        debugger;
    }
};

app.get('/fact', (request, response) => {
        const requestUrl = url.parse(request.url, true);
        if (requestUrl.query.k) {
            const k = parseInt(requestUrl.query.k);
            if (Number.isInteger(k)) {
                response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                response.end(JSON.stringify({ k: k, fact: factorial(k) }));
            }
        } else {
            response.write('Page not found');
            response.end();
        }
    },
);

app.get('/factt', (request, response) => {
        const requestUrl = url.parse(request.url, true);
        if (requestUrl.query.k) {
            const k = parseInt(requestUrl.query.k);
            if (Number.isInteger(k)) {
                response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                factorialT(k, (err, result) => response.end(JSON.stringify({ k: k, fact: result })));
            }
        } else {
            response.write('Page not found');
            response.end();
        }
    },
);

app.get('/facti', (request, response) => {
        const requestUrl = url.parse(request.url, true);
        if (requestUrl.query.k) {
            const k = parseInt(requestUrl.query.k);
            if (Number.isInteger(k)) {
                response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                factorialI(k, (err, result) => response.end(JSON.stringify({ k: k, fact: result })));
            }
        } else {
            response.write('Page not found');
            response.end();
        }
    },
);

app.get('/html', (require, response) => {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(fs.readFileSync('index.html'));
});

app.listen(5000);
console.log('Server running at http://localhost:5000/');

//
// const http = require('http');
// const url = require('url');
// const server = http.createServer;
// let fs = require('fs');
// let state = '<h1>Started<h1>';
//
// const factorial = n => (n < 2 ? n : n * factorial(n - 1));
//
// function Fact(n, cb) {
//     this.fn = n;
//     this.ffact = factorial;
//     this.fcb = cb;
//     this.calc = () => {process.nextTick(() => {this.fcb(null, this.ffact(this.fn));});};
// }
//
// function Fact1(n, cb) {
//     this.fn = n;
//     this.ffact = factorial;
//     this.fcb = cb;
//     this.calc = () => {process.setImmediate(() => {this.fcb(null, this.ffact(this.fn));});};
// }
//
// server((req, res) => {
//     switch (req.url) {
//         default:
//             url.parse(req.url).pathname === '/fact';
//             if (typeof url.parse(req.url, true).query.k != 'undefined') {
//                 let k = parseInt(url.parse(req.url, true).query.k);
//                 if (Number.isInteger(k)) {
//                     res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
//                     res.end(JSON.stringify({ k: k, fact: factorial(k) }));
//                 }
//             } else if (url.parse(req.url).pathname === '/facti') {
//                 console.log(req.url);
//                 if (typeof url.parse(req.url, true).query.k != 'undefined') {
//                     let k = parseInt(url.parse(req.url, true).query.k);
//                     if (Number.isInteger(k)) {
//                         res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
//                         let fact = new Fact(k, (err, result) => {res.end(JSON.stringify({ k: k, factorial: result }));});
//                         fact.calc();
//                     }
//                 }
//             } else if (url.parse(req.url).pathname === '/facto') {
//                 console.log(req.url);
//                 if (typeof url.parse(req.url, true).query.k != 'undefined') {
//                     let k = parseInt(url.parse(req.url, true).query.k);
//                     if (Number.isInteger(k)) {
//                         res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
//                         let fact = new Fact1(k, (err, result) => {res.end(JSON.stringify({ k: k, factorial: result }));});
//                         fact.calc();
//                     }
//                 }
//             } else {
//                 res.write('Page not found');
//                 res.end;
//             }
//     }
// }).listen(5000, 'localhost', () => {
//     console.log('Server start at 5000 port');
// });
