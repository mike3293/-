let http = require('http');
let path = require('./m07-01')('./static');

let http_handler = (request, response) => {
    if(request.method === 'GET') {
        if(path.isValid('html', request.url))
            path.sendFile(request, response, {'Content-Type':'text/html; charset=utf-8'});
        else if(path.isValid('css', request.url))
            path.sendFile(request, response, {'Content-Type':'text/css; charset=utf-8'});
        else if(path.isValid('js', request.url))
            path.sendFile(request, response, {'Content-Type':'text/javascript; charset=utf-8'});
        else if(path.isValid('png', request.url))
            path.sendFile(request, response, {'Content-Type':'image/png; charset=utf-8'});
        else if(path.isValid('docx', request.url))
            path.sendFile(request, response, {'Content-Type':'application/msword; charset=utf-8'});
        else if(path.isValid('json', request.url))
            path.sendFile(request, response, {'Content-Type':'application/json; charset=utf-8'});
        else if(path.isValid('xml', request.url))
            path.sendFile(request, response, {'Content-Type':'application/xml; charset=utf-8'});
        else if(path.isValid('mp4', request.url))
            path.sendFile(request, response, {'Content-Type':'video/mp4; charset=utf-8'});
        else path.writeHTTP404(response);
    }
    else {
        response.statusCode = 405;
        response.statusMessage = 'Invalid method';
        response.end("HTTP ERROR 405: Invalid method");
    }
};

let server = http.createServer();
server.listen(5000, () => { console.log('Server running at http://localhost:5000/index.html') })
    .on('error', (e) => {console.log('Server running at http://localhost:5000/: error', e.code)})
    .on('request', http_handler);

