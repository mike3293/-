const fs = require('fs');
const url = require('url');
const http = require('http');
const mp = require('multiparty');


const PORT = 5000;
const HOST = 'localhost';

const HTTP404 = (req, res) => {
    console.log(`${req.method}: ${req.url}, HTTP status 404`);
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(`"error" : "${req.method}: ${req.url}, HTTP status 404"`);
};

const HTTP405 = (req, res) => {
    console.log(`${req.method}: ${req.url}, HTTP status 405`);
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(`Error" : "${req.method}: ${req.url}, HTTP status 405"`);
};

const http_handler = (req, res) => {
    switch (req.method) {
        case 'GET':
            GET_handler(req, res);
            break;
        case 'POST':
            POST_handler(req, res);
            break;
        default:
            HTTP405(req, res);
            break;
    }
};

const GET_handler = (req, res) => {
    let Url_forGet = req.url;
    let Path_forGet = url.parse(req.url, true).pathname.toLowerCase();
    console.log(Path_forGet);
    switch ('/' + GetUrlPart(Path_forGet, 1)) {
        case '/connection':
            let set = parseInt(url.parse(req.url, true).query.set);
            if (Number.isInteger(set)) {
                console.log('Set connection');
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                server.KeepAliveTimeout = set;
                res.end(`KeepAliveTimeout = ${server.KeepAliveTimeout}`);
            } else {
                console.log('Get connection');
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(`KeepAliveTimeout = ${server.KeepAliveTimeout}`);
            }
            break;
        case '/headers':
            res.setHeader('Custom', 'test');
            console.log('Get headers');
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.write(`<h2>Request:</h2>`);
            for (key in req.headers)
                res.write(`<h3>${key}: ${req.headers[key]}</h3>`);
            const resHeaders = res.getHeaders();
            res.write(`<h2>Response:</h2>`);
            for (key in resHeaders)
                res.write(`<h3>${key}: ${resHeaders[key]}</h3>`);
            res.end();
            break;
        case '/parameter':
            let x = 0, y = 0;
            if (!Url_forGet.toString().includes('?')) {
                x = Number(GetUrlPart(Path_forGet, 2));
                y = Number(GetUrlPart(Path_forGet, 3));
            } else {
                x = Number(url.parse(req.url, true).query.x);
                y = Number(url.parse(req.url, true).query.y);
            }
            parameterHandler(x, y, res);
            break;
        case '/close':
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`<h1>Server will be closed after 10 sec.</h1>`);
            console.log('Server will be closed after 10 sec');
            setTimeout(() => server.close(() => console.log('Server closed')), 1000);
            break;
        case '/socket':
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
            break;
        case '/req-data':
            let data = [];
            req.on('data', chunk => {
                data.push(chunk);
                console.log(data);
            });
            req.on('end', () => {
                res.end();
            });
            break;
        case '/resp-status':
            res.statusCode = url.parse(req.url, true).query.code;
            res.statusMessage = url.parse(req.url, true).query.mess;
            res.end();
            break;
        case '/formparameter':
            res.end(fs.readFileSync(__dirname + '/files/Formparameter.html'));
            break;
        case '/upload':
            console.log('Get Upload');
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(fs.readFileSync(__dirname + '/Update.html'));
            break;
        case '/files':
            let fname = GetUrlPart(Path_forGet, 2);
            console.log('file|' + fname + '|');
            if (fname == ' ') {
                console.log('Get files count');
                fs.readdir(__dirname + '/files', (err, files) => {
                    if (err) res.statusCode = 500;
                    res.setHeader('X-static-files-count', files.length);
                    res.end();
                });
            } else {
                console.log(__dirname + '/files/' + fname);
                if (!fs.existsSync(__dirname + '/files/' + fname))
                    HTTP404(req, res);
                else {
                    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
                    res.end(fs.readFileSync(__dirname + '/files/' + fname));
                }
            }
            break;
        default:
            HTTP404(req, res);
            break;
    }
};

let POST_handler = (req, res) => {
    let body = '';
    switch (req.url) {
        case '/formparameter':
            req.on('data', chunk => {
                body += chunk;
            });
            req.on('end', async () => {
                console.log(JSON.stringify(body));
                res.end(JSON.stringify(body));
            });
            break;
        case '/json':
            body = '';
            console.log('Post JSON');
            req.on('data', chunk => {
                body += chunk;
            });
            req.on('end', async () => {
                body = JSON.parse(body);

                res.end(JSON.stringify
                ({
                    __comment: 'Response. ' + body.__comment,
                    x_plus_y: body.x + body.y,
                    concat_s_o: body.s + ': ' + body.o.surname + ' ' + body.o.name,
                    length_m: body.m.length,
                }));
            });
            break;
        case '/xml':
            body = '';
            req.on('data', chunk => {
                body += chunk;
            });
            req.on('end', async () => {
                let xml = body;
                res.setHeader('Content-Type', 'text/xml');
                let sum = 0;
                let text = '';
                let reqid = 0;

                let rex = new RegExp('<x value="(.*?)"', 'gmi');
                while (re = rex.exec(xml)) {
                    sum = sum + Number(re[1]);
                }
                rex = new RegExp('<m value="(.*?)"', 'gmi');
                while (re = rex.exec(xml)) {
                    text += re[1];
                }
                rex = new RegExp('<request id="(.*?)"', 'gmi');
                while (re = rex.exec(xml)) {
                    reqid = re[1];
                }
                let responseText =
                    `<response id="${reqid}">
            <sum element="x" result="${sum}"></sum>
            <text element="m" result="${text}"></text>
            </response>`;
                res.end(responseText);
            });
            break;
        case '/upload':

            const form = new mp.Form({ uploadDir: './files' });

            form.on('file', (name, file) => {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.write(`<h1>File Upload</h1>`);
                res.end(file.originalFilename);
            });

            form.parse(req);

            // body = ' ';
            // req.on('data', chunk => {
            //     body = chunk;
            //     console.log('BODY: ' + body);
            // });
            // req.on('end', async () => {
            //     let fname = '';
            //
            //     let rex = new RegExp('filename="(.*?)"', 'gmi');
            //     while (re = rex.exec(body)) {
            //         fname = re[1];
            //     }
            //
            //     res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            //     res.write(`<h1>File Upload</h1>`);
            //     res.end(body);
            //     fs.writeFile(__dirname + '/files/copy' + fname, body, (err) => {
            //         if (err) throw err;
            //         console.log('The file has been saved!');
            //     });
            // });

            break;
        default:
            HTTP404(req, res);
            break;
    }
};

function GetUrlPart(url_path, indx) {
    let i = 0;
    let curr_url = ' ';
    i--;
    decodeURI(url_path).split('/').forEach(e => {
        i++;
        if (i == indx) {
            curr_url = e;
            return;
        }
    });
    return curr_url ? curr_url : ' ';
}

function parameterHandler(x, y, res) {
    if (Number.isInteger(x) && Number.isInteger(y)) {
        res.end(JSON.stringify
        ({
            add: x + y,
            sub: x - y,
            mult: x * y,
            div: x / y,
        }));
    } else
        res.end('Wrong data type');
}


const server = http.createServer().listen(PORT, (v) => {
        console.log(`Listening on http://${HOST}:${PORT}`);
    })
    .on('error', (e) => {console.log(`${URL} | error: ${e.code}`);})
    .on('request', http_handler);
