const request = require('request-promise');
const { decipherFile } = require('./cryptoPipe');
const { ClientDH } = require('./23-01m');
const fs = require('fs');

let clientFunc = async () => {
    await request({
        method: 'GET',
        uri: 'http://localhost:3000/',
        json: true,
    }).then((response) => {
        const serverContext = response;
        console.log(serverContext);
        const clientDH = new ClientDH(serverContext);
        const clientContext = clientDH.getContext();
        console.log(clientContext);

        request({
            method: 'POST',
            uri: 'http://localhost:3000/ClientContext',
            json: true,
            body: {
                key_hex: clientContext.key_hex,
            },
        }).catch((err) => {
            console.log(err);
        }).then(() => {
            request({
                method: 'GET',
                uri: 'http://localhost:3000/resource',
                headers: {
                    'application': 'application/txt',
                },
            }).catch((err) => {
                console.log(err);
            }).then((body) => {
                fs.writeFileSync('./client/fileClientEncrypt.txt', body);
                const clientSecret = clientDH.getSecret(serverContext);
                let key = clientSecret.toString('hex');
                decipherFile(key, body);
            });
        }).catch((err) => {
            console.log(err);
        });
    });
};

clientFunc();
