const express = require('express');
const bodyParser = require('body-parser');
const { ServerSign } = require('./sign');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

app.get('/file', ((req, res) => {
    try {
        res.sendFile(__dirname + '/file-2.txt');
    } catch (e) {
        res.status(409).json({ message: 'error in verification' });
    }
}));

app.get('/signature', ((req, res) => {
    try {
        const rs = fs.createReadStream('./file-2.txt');
        let ss = new ServerSign();
        ss.getSignContext(rs, (signContext) => {
            console.log(signContext);
            res.json({
                signContext,
            });
        });
    } catch (e) {
        res.status(409).json({ message: 'error in verification' });
    }
}));

app.listen(3000);
