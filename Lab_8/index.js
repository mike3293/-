const fs = require('fs');
let url = require('url');
const bodyParser = require('body-parser');
const express = require('express');
const fUpload = require('express-fileupload');
const xmlBodyParser = require('express-xml-bodyparser');

const app = express();
app.use(bodyParser.json());
app.use(xmlBodyParser({}));
app.use(fUpload({ createParentPaths: true }));

const PORT = 5000;
const HOST = 'localhost';

let HTTP404 = (req, res) => {
    console.log(`${req.method}: ${req.url}, HTTP status 404`);
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(`"error" : "${req.method}: ${req.url}, HTTP status 404"`);
};

app.get('/connection', (req, res) => {
    let set = parseInt(url.parse(req.url, true).query.set);
    if (Number.isInteger(set)) {
        console.log('Set connection');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        app.KeepAliveTimeout = set;
        res.end(`KeepAliveTimeout = ${app.KeepAliveTimeout}`);
    } else {
        console.log('Get connection');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`KeepAliveTimeout = ${app.KeepAliveTimeout}`);
    }
});

app.get('/headers', (req, res) => {
    console.log('Get headers');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    req.headers.custom = 'Custom';
    for (let key in req.headers)
        res.write(`<h4>request: ${key}: ${req.headers[key]}</h4>`);
    for (let key in res.getHeaders())
        res.write(`<h4>response: ${key}: ${res.getHeaders[key]}</h4>`);
    res.end();
});

function parameterHandler(x, y, res) {
    if (!isNaN(x + y)) {
        res.json(
            {
                add: x + y,
                sub: x - y,
                mult: x * y,
                div: x / y,
            });
    } else
        res.json({ message: 'Wrong data' });
}

app.get('/parameter', (req, res) => {
    let x = Number(req.query.x);
    let y = Number(req.query.y);
    parameterHandler(x, y, res);
});

app.get('/parameter/:x/:y', (req, res) => {
    let x = Number(req.params.x);
    let y = Number(req.params.y);
    parameterHandler(x, y, res);
});

app.get('/close', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<h1>Server will be closed after 10 sec.</h1>`);
    console.log('Server will be closed after 10 sec');
    setTimeout(() => server.close(() => console.log('Server closed')), 10000);
});

app.get('/socket', (req, res) => {
    server.on('connection', (socket) => {
        try {
            console.log('Get socket');
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.write(`<h3>LocalAddress: ${socket.localAddress}</h3>`);
            res.write(`<h3>LocalPort: ${socket.localPort}</h3>`);
            res.write(`<h3>RemoteAddress: ${socket.remoteAddress}</h3>`);
            res.write(`<h3>RemotePort: ${socket.remotePort}</h3>`);
        } catch (e) {
            console.log(e);
        }
    });
});

app.get('/req-data', (req, res) => {
    let data = [];
    req.on('data', chunk => {
        data.push(chunk);
        console.log(data);
    });
    req.on('end', () => {
        res.end();
    });
});

app.get('/resp-status', (req, res) => {
    res.statusCode = req.query.code;
    res.statusMessage = req.query.mess;
    res.end();
});

app.get('/formparameter', (req, res) => {
    res.sendFile(__dirname + '/files/Formparameter.html');
});
app.post('/formparameter', (req, res) => {
    console.log(JSON.stringify(req.body));
    res.json(req.body);
});

app.post('/json', (req, res) => {
    console.log('Post JSON');

    res.json(
        {
            __comment: 'Response. ' + req.body.__comment,
            x_plus_y: req.body.x + req.body.y,
            concat_s_o: req.body.s + ': ' + req.body.o.surname + ' ' + req.body.o.name,
            length_m: req.body.m.length,
        });
});

app.post('/xml', (req, res) => {
    let xml = req.body;
    console.log(JSON.stringify(xml));
    res.setHeader('Content-Type', 'application/xml');
    let sum = 0;
    let text = '';
    xml.request.x.forEach(x => sum += Number(x.$.value));
    xml.request.m.forEach(m => text += m.$.value);
    let responseText = `
        <res="${xml.request.$.id}">
        <sum element="x" result="${sum}"></sum>
        <text element="m" result="${text}"></text>
        </res>`;
    res.end(responseText);
});

app.get('/upload', (req, res) => {
    console.log('Get Upload');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(fs.readFileSync(__dirname + '/Update.html'));
});

app.get('/files', (req, res) => {
    if (url.parse(req.url).pathname === '/files') {
        console.log('Get files count');
        fs.readdir(__dirname + '/files', (err, files) => {
            if (err) res.statusCode = 500;
            res.setHeader('X-static-files-count', files.length);
            res.end();
        });
    }
});

app.get('/files/:fname', (req, res) => {
    fname = url.parse(req.url).pathname;
    if (!fs.existsSync(__dirname + fname))
        HTTP404(req, res);
    else {
        console.log('Get file name');
        res.writeHead(200, { 'Content-Type': 'text/palin; charset=utf-8' });
        res.end(fs.readFileSync(__dirname + fname));
    }
});

app.post('/upload', (req, res) => {
    let result = '';
    let fname = '';
    let File = req.files.file;
    result += File.data;
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.write(`<h1>File Upload</h1>`);
    res.end(result);
    File.mv(__dirname + '/files/' + File.name, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
});

const server = app.listen(PORT, HOST, () => {
    const URL = `http://${HOST}:${PORT}`;
    console.log('Listening on ' + URL);
}).on('error', (e) => {
    console.log(`${URL} | error: ${e.code}`);
});
