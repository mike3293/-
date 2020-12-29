const DB = require('./db');
const http = require('http');
const url = require('url');
const Db = new DB();

let GET_handler = (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    switch (url.parse(req.url).pathname) {
        case '/api/faculties':
            console.log(`Get faculty`);
            Db.GetRecordsByTableName('faculty').then(records => res.end(JSON.stringify(records)))
                .catch(error => {
                    write_error_400(res, error);
                });
            break;
        case '/api/pulpits':
            console.log(`Get pulpit`);
            Db.GetRecordsByTableName('pulpit').then(records => res.end(JSON.stringify(records)))
                .catch(error => {
                    write_error_400(res, error);
                });
            break;
        default:
            break;
    }
};

let POST_handler = (req, res) => {
    let data_json = '';
    switch (url.parse(req.url).pathname) {
        case '/api/faculties':
            req.on('data', chunk => {
                data_json += chunk;
            });
            req.on('end', () => {
                data_json = JSON.parse(data_json);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                Db.InsertRecords('faculty', data_json).then(records => res.end(JSON.stringify(records))).catch(error => {write_error_400(res, error);});
            });
            break;
        case '/api/pulpits':
            req.on('data', chunk => {
                data_json += chunk;
            });
            req.on('end', () => {
                data_json = JSON.parse(data_json);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                Db.InsertRecords('pulpit', data_json).then(records => res.end(JSON.stringify(records))).catch(error => {write_error_400(res, error);});
            });
            break;
        default:
            break;
    }
};

let PUT_handler = (req, res) => {
    let data_json = '';
    switch (url.parse(req.url).pathname) {
        case '/api/faculties':
            req.on('data', chunk => {
                data_json += chunk;
            });
            req.on('end', () => {
                data_json = JSON.parse(data_json);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                Db.UpdateRecords('faculty', data_json._id, data_json).then(records => res.end(JSON.stringify(records))).catch(error => {write_error_400(res, error);});
            });
            break;
        case '/api/pulpits':
            req.on('data', chunk => {
                data_json += chunk;
            });
            req.on('end', () => {
                data_json = JSON.parse(data_json);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                Db.UpdateRecords('pulpit', data_json._id, data_json).then(records => res.end(JSON.stringify(records))).catch(error => {write_error_400(res, error);});
            });
            break;
        default:
            break;
    }
};

let DELETE_handler = (req, res) => {
    let path = url.parse(req.url).pathname;
    let path_mas = path.split('/');
    switch ('/' + path_mas[1] + '/' + path_mas[2]) {
        case '/api/faculties':
            res.writeHead(200, { 'Content-Type': 'application/json' });

            Db.DeleteField('faculty', path_mas[3]).then(records => {
                res.end(JSON.stringify(records));
            }).catch(error => {
                write_error_400(res, error);
            });
            break;
        case '/api/pulpits':
            res.writeHead(200, { 'Content-Type': 'application/json' });

            Db.DeleteField('pulpit', path_mas[3]).then(records => {
                res.end(JSON.stringify(records));
            }).catch(error => {
                write_error_400(res, error);
            });
            break;
        default:
            break;
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
        case 'PUT':
            PUT_handler(req, res);
            break;
        case 'DELETE':
            DELETE_handler(req, res);
            break;
        default:
            break;
    }
};

function write_error_400(res, error) {
    res.statusCode = 400;
    res.statusMessage = 'Invalid method';
    res.end(JSON.stringify({ error: String(error) }));
}

let server = http.createServer();
server.listen(3000, () => {
    console.log('server.listen(3000)');
}).on('request', http_handler);
