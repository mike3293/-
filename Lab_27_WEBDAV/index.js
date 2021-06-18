const app = require('express')();
const fs = require('fs');
const { createClient } = require('webdav');
const webDavClient = createClient('https://webdav.yandex.ru', {
    username: 'misffka',
    password: 'zygpzagomxtzbgky',
});

app.post('/md/:folder', (req, res) => {
    let dict = `/${req.params.folder}`;

    webDavClient
        .exists(dict)
        .then((exist) => {
            if (exist) {
                res.status(408);
                return { error: 'Directory exists' };
            } else {
                return webDavClient
                    .createDirectory(dict)
                    .then(() => ({ message: `Directory '${dict}' created` }));
            }
        })
        .then((message) => res.json(message))
        .catch((err) => res.status(400).json({ error: err.message }));
});

app.post('/rd/:folder', (req, res) => {
    let dict = `/${req.params.folder}`;

    webDavClient
        .exists(dict)
        .then((exist) => {
            if (exist) {
                return webDavClient
                    .deleteFile(dict)
                    .then(() => ({ message: `Directory '${dict}' removed` }));
            } else {
                res.status(404);
                return { error: 'Directory is not exists' };
            }
        })
        .then((message) => res.json(message))
        .catch((err) => res.status(400).json({ custom: true, error: err.message }));
});

app.post('/up/:file', (req, res) => {
    //
    try {
        const filePath = './' + req.params.file;
        let rs = fs.createReadStream(filePath);
        let ws = webDavClient.createWriteStream(req.params.file);
        rs.pipe(ws);

        res.json({ message: 'File\'s been uploaded' });
    } catch (err) {
        res.status(408).json({ error: err.toString() });
    }
});

app.post('/down/:file', (req, res) => {
    let path = `/${req.params.file}`;

    webDavClient
        .exists(path)
        .then((exist) => {
            if (exist) {
                webDavClient.createReadStream(path).pipe(res);
            } else {
                res.status(404);
                return { error: 'File is not exists' };
            }
        })
        .then((message) => (message ? res.json(message) : null))
        .catch((err) => res.status(400).json({ error: err.message }));
});

app.post('/del/:file', (req, res) => {
    let path = `/${req.params.file}`;

    webDavClient
        .exists(path)
        .then((exist) => {
            if (exist) {
                return webDavClient
                    .deleteFile(path)
                    .then(() => ({ message: `File '${path}' removed` }));
            } else {
                res.status(404);
                return { error: 'File is not exists' };
            }
        })
        .then((message) => res.json(message))
        .catch((err) => res.status(400).json({ error: err.message }));
});

app.post('/copy/:file1/:file2', (req, res) => {
    let path = `/${req.params.file1}`;
    let path2 = `/${req.params.file2}`;

    webDavClient
        .exists(path)
        .then((exist) => {
            if (exist) {
                try {
                    return webDavClient
                        .copyFile(path, path2)
                        .then(() => ({ message: `File '${path}' copied to ${path2}` }));
                } catch (err) {
                    res.status(404);
                    return { error: 'File cannot be copied' };
                }
            } else {
                res.status(408);
                return { error: 'File is not exists' };
            }
        })
        .then((message) => res.json(message))
        .catch((err) => res.status(400).json({ error: err.message }));
});
app.post('/move/:file1/:file2', (req, res) => {
    let path = `/${req.params.file1}`;
    let path2 = `/${req.params.file2}`;

    webDavClient
        .exists(path)
        .then((exist) => {
            if (exist) {
                try {
                    return webDavClient
                        .moveFile(path, path2)
                        .then(() => ({ message: `File '${path}' moved to ${path2}` }));
                } catch (err) {
                    res.status(404);
                    return { error: 'File cannot be moved' };
                }
            } else {
                res.status(408);
                return { error: 'File is not exists' };
            }
        })
        .then((message) => res.json(message))
        .catch((err) => res.status(400).json({ error: err.message }));
});
app.use(function (request, response) {
    response.sendStatus(404);
});
app.listen(3000);
