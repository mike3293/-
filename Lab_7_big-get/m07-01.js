function Stat(sfn = './static') {
    let fs = require('fs');
    this.staticPath = sfn;
    let pathStatic = (fn) => `${this.staticPath}${fn}`;

    this.writeHTTP404 = (response) => {
        response.statusCode = 404;
        response.statusMessage = 'Resource not found';
        response.end("HTTP ERROR 404: Resource not found");
    };

    let doPipeFile = (request, response, headers) => {
        response.writeHead(200, headers);
        fs.createReadStream(pathStatic(request.url)).pipe(response);
    };

    this.isValid = (ext, fn) => {
        return new RegExp(`^\/.+\.${ext}$`).test(fn);
    };

    this.sendFile = (request, response, headers) => {
        fs.access(pathStatic(request.url), fs.constants.R_OK, err => {
            err ? this.writeHTTP404(res) : doPipeFile(request, response, headers);
        });
    }
}

module.exports = (parm) => new Stat(parm);
