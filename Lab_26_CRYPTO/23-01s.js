const express = require('express');
const bodyParser = require('body-parser');
const { ServerDH } = require('./23-01m');
const { cipherFile } = require('./cryptoPipe');

const app = express();
app.use(bodyParser.json());

const serverDH = new ServerDH(1024, 3);
const serverContext = serverDH.getContext();

//let serverContext
let clientContext_key_hex;

app.get('/', ((req, res) => {
    if (!serverContext) {
        res.status(409).json({ message: 'Error in the Diffie-Hellman algorithm' });
    }
    console.log(serverContext);
    res.json(serverContext);
}));

app.post('/ClientContext', ((req, res) => {
    clientContext_key_hex = req.body.key_hex;
    if (!clientContext_key_hex) {
        res.status(409).json({ message: 'Error in the Diffie-Hellman algorithm' });
    }
    res.json({ message: 'response successful' });
}));

app.get('/resource', (req, res) => {
    if (!clientContext_key_hex) {
        res.status(409).json({ message: 'Error in the Diffie-Hellman algorithm' });
    }
    const serverSecret = serverDH.getSecret(clientContext_key_hex);
    let key = serverSecret.toString('hex');
    cipherFile(key, res);
});

app.listen(3000);
