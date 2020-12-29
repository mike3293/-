const http = require('http');
const fs = require('fs');
const url = require('url');

let POST_handler = (req, res) => {
    switch (url.parse(req.url).pathname) {
        case '/formparameter':
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', () => {
                console.log(data);
                res.end(data);
            });
            break;
        case '/json':
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            let data_json = '';
            req.on('data', chunk => {
                data_json += chunk;
            });
            req.on('end', () => {
                data_json = JSON.parse(data_json);
                let obj = {
                    __comment: data_json.__comment,
                    x_plus_y: data_json.x + data_json.y,
                    Concatination_s_o: data_json.s + ': ' + data_json.o.surname + ', ' + data_json.o.name,
                    Length_m: data_json.m.length,
                };
                console.log(JSON.stringify(obj));
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(obj));
            });
            break;
        case '/xml':
            let data2 = '';
            req.on('data', chunk => {
                data2 += chunk;
            });
            req.on('end', () => {
                console.log(data2);
                let parseString = require('xml2js').parseString;
                parseString(data2, function (err, result) {
                    let sum = 0;
                    let concat = '';
                    result.request.x.map((e, i) => {
                        sum += parseInt(e.$.value);
                    });
                    result.request.m.map((e, i) => {
                        concat += e.$.value;
                    });
                    res.setHeader('Content-Type', 'application/xml');
                    res.end(`
                        <res id="${result.request.$.id}">
                        <sum element="x" result="${sum}"></sum>
                        <text element="m" result="${concat}"></text>
                        </res>`,
                    );
                });
            });
            break;
        case '/upload':
            var multiparty = require('multiparty');

            let form = new multiparty.Form({ uploadDir: './static' });
            form.on('field', (name, value) => {
                console.log('----field---');
                console.log(name, value);
            });
            form.on('file', (name, file) => {
                console.log('----file---');
                console.log(name, file);
            });
            form.on('error', () => {
                console.log('----err---');
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end('error');
            });
            form.on('close', () => {
                console.log('----close---');
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end('Upload');
            });
            form.parse(req);
            break;
        default:
            write_error_405(res);
    }

};

let GET_handler = (req, res) => {
    let url_str = url.parse(req.url).pathname;
    let query = '';
    let query_length = '';
    if (url_str.includes('files')) {
        url_str = '/files';
    }
    if (url_str.includes('parameter')) {
        url_str = '/parameter';
    }
    switch (url_str) {
        case '/connection':
            //server.keepAliveTimeout - время (в мс), которое сервер будет ожидать и держать соединение открытым
            //после последнего ответа. (не нужно устанавливать всегда, по умолчанию 5 секунд)
            query = url.parse(req.url, true).query;
            query_length = Object.keys(query).length;
            if (query_length === 0) {
                res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end(server.keepAliveTimeout.toString());
            } else if (query_length === 1 && typeof query.set !== 'undefined') {
                server.keepAliveTimeout = parseInt(query.set);
                res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
                console.log(server.keepAliveTimeout.toString());
                res.end(server.keepAliveTimeout.toString());
            } else {
                write_error_405(res);
            }
            break;
        case '/headers':
            res.setHeader('X-CustomHeader', 'accept');
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            for (key in res.getHeaders())
                res.write(`<h3>response: ${key}: ${res.getHeaders()[key]}</h3>`);
            for (key in req.headers)
                res.write(`<h3>request: ${key}: ${req.headers[key]}</h3>`);
            break;
        case '/parameter':
            url_str = url.parse(req.url).pathname;
            let url_array = url_str.split('/');
            if (url_array.length === 2) {
                //http://localhost:5000/parameter?x=2&y=4
                let query = url.parse(req.url, true).query;
                query_length = Object.keys(query).length;
                if (query_length === 2) {
                    if (!isNaN(query.x) && !isNaN(query.y)) {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.write(`<h3>${query.x - query.y}</h3>`);
                        res.write(`<h3>${query.x * query.y}</h3>`);
                        res.write(`<h3>${query.x / query.y}</h3>`);
                        res.write(`<h3>${query.x + query.y}</h3>`);
                        res.end();
                    } else {
                        write_error_404(res);
                    }
                }
            } else if (url_array.length === 4) {
                let x = url_array[2];
                let y = url_array[3];
                if (!isNaN(x) && !isNaN(y)) {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(`<h3>${parseInt(x) + parseInt(y)}</h3>`);
                    res.write(`<h3>${parseInt(x) - parseInt(y)}</h3>`);
                    res.write(`<h3>${parseInt(x) * parseInt(y)}</h3>`);
                    res.write(`<h3>${parseInt(x) / parseInt(y)}</h3>`);
                    res.end();
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(`<h3>${req.url}</h3>`);
                    res.end();
                }
            } else
                write_error_404(res);
            break;
        case '/close':
            setTimeout(process.exit, 10000);
            break;
        case '/socket':
            const serverInfo = server.address();
            res.writeHead(200, { 'Content-Type': 'text/plain' });

            res.write('Server info: \n');
            res.write('IP: ' + serverInfo.address + '\n' +
                'Port: ' + serverInfo.port + '\n');

            res.write('Client info: \n');
            res.write('IP: ' + req.connection.remoteAddress + '\n' +
                'Port: ' + req.connection.remotePort + '\n');

            res.end();
            break;
        case '/req-data':
            let data = [];
            req.on('data', chunk => data.push(chunk));
            req.on('end', () => {
                data.forEach((x) => console.log(x.toString()));
                res.end();
            });
            break;
        case '/resp-status':
            let query_params = url.parse(req.url, true).query;
            res.statusCode = parseInt(query_params.code);
            res.statusMessage = query_params.mess;
            res.end(query_params.code + ' ' + query_params.mess);
            break;
        case '/files':
            let pathArray = url.parse(req.url, true).pathname.split('/');
            if (pathArray[1] === 'files' && pathArray.length === 3) {
                let fileName = pathArray[2];
                let filePath = `./static/${fileName}`;

                fs.access(filePath, fs.constants.R_OK, err => {
                    if (err) {
                        res.writeHead(404, 'File not found.');
                        res.end('404');
                    } else {
                        let fileName_array = fileName.split('.');
                        switch (fileName_array[1]) {
                            case 'json':
                                res.writeHead(200, { 'Content-Type': 'application/json' });
                                res.end(fs.readFileSync(filePath));
                                break;
                            case 'js':
                                res.writeHead(200, { 'Content-Type': 'text/javascript; charset=utf-8' });
                                res.end(fs.readFileSync(filePath));
                                break;
                            case 'html':
                                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                                res.end(fs.readFileSync(filePath));
                                break;
                        }
                    }
                });
            } else if (pathArray.length === 2) {
                fs.readdir('./static', (err, files) => {
                    res.setHeader('X-static-files-count', files.length.toString());
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end(files.length.toString());
                });
            }
            break;
        case '/upload':
            let html = fs.readFileSync('./upload.html');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
            break;
        default:
            write_error_404(res);
    }
};

let http_handler = (req, res) => {
    switch (req.method) {
        case 'GET':
            GET_handler(req, res);
            break;
        case 'POST':
            POST_handler(req, res);
            break;
        default:
            write_error_405(res);
    }
};

let server = http.createServer();
server.listen(5000, () => {
        console.log('server.listen(5000)');
    })
    .on('request', http_handler);

function write_error_405(res) {
    res.statusCode = 405;
    res.statusMessage = 'Invalid method';
    res.end('HTTP ERROR 405: Invalid method');
}

function write_error_404(res) {
    res.statusCode = 404;
    res.statusMessage = 'Invalid url';
    res.end('HTTP ERROR 404: Invalid url');
}
