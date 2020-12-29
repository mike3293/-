const url = require('url');
const fs = require('fs');
const http = require('http');


const PORT = 5000;

let HTTP404 = (req, res) => {
    console.log(`${req.method}: ${req.url}, HTTP status 404`);
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(`"error" : "${req.method}: ${req.url}, HTTP status 404"`);
};

let HTTP405 = (req, res) => {
    console.log(`${req.method}: ${req.url}, HTTP status 405`);
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(`Error" : "${req.method}: ${req.url}, HTTP status 405"`);
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
            HTTP405(req, res);
            break;
    }
};

let GET_handler = (req, res) => {
    let Url_forGet = req.url;
    let Path_forGet = url.parse(req.url, true).pathname;
    console.log(Path_forGet + ' | ' + Url_forGet);
    console.log('URL: /' + GetUrlPart(Path_forGet, 1));
    switch ('/' + GetUrlPart(Path_forGet, 1)) {
        case '/getinfo':
            res.end('Received');
            break;
        case '/xy':
            res.end(url.parse(req.url, true).query.x + ' ' + url.parse(req.url, true).query.y);
            break;
        case '/getfile':
            res.end(fs.readFileSync(__dirname + '/files/f.txt'));
            break;
        default:
            HTTP404(req, res);
            break;
    }
};

let POST_handler = (req, res) => {
    let body = ' ';
    let Url_forGet = req.url;
    let Path_forGet = url.parse(req.url, true).pathname;
    console.log(Path_forGet + ' | ' + Url_forGet);
    console.log('URL: /' + GetUrlPart(Path_forGet, 1));
    switch ('/' + GetUrlPart(Path_forGet, 1)) {
        case '/xml':
            body = ' ';
            req.on('data', chunk => {
                body = chunk;
                console.log('XML:' + body);
            });
            req.on('end', async () => {
                let xml = body;
                res.setHeader('Content-Type', 'text/xml');
                let sum = 0;
                let text = '';
                let reqid = 0;
                let rexi = 1;

                let rex = new RegExp('<x value="(.*?)"/>', 'gmi');
                while (re = rex.exec(xml)) {
                    sum = sum + Number(re[1]);
                }
                rex = new RegExp('<m value="(.*?)"/>', 'gmi');
                rexi = 1;
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
        case '/txt':
            let txt = '';
            req.on('data', (chunk) => {
                txt += chunk.toString('utf8');
                res.end(txt);
            });
            break;
        case '/png':
            let png = '';
            req.on('data', (chunk) => {
                png += chunk;
                req.on('end', async () => {
                    res.end(png);
                });
            });
            break;
        case '/xys':
            res.end(url.parse(req.url, true).query.x + ' ' + url.parse(req.url, true).query.y + ' ' + url.parse(req.url, true).query.s);
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
    return curr_url;
}

const server = http.createServer().listen(PORT, (v) => {
        console.log(`Listening on http://localhost:${PORT}`);
    })
    .on('error', (e) => {console.log(`${URL} | error: ${e.code}`);})
    .on('request', http_handler);
