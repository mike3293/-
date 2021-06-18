const crypto = require('crypto');
const fs = require('fs');

module.exports.cipherFile = (key, res) => {
    const alg = 'aes-256-cbc';
    key = crypto.createHash('sha256').update(String(key)).digest('base64').substr(0, 32);
    console.log('key: ', key);

    const piv = Buffer.alloc(16, 0);
    const ch = crypto.createCipheriv(alg, key, piv);
    const text = fs.readFileSync(`${__dirname}/fileServer.txt`, { encoding: 'utf8' });
    const encryptedText = ch.update(text, 'utf8', 'hex') + ch.final('hex');

    fs.writeFileSync('./fileServerEncrypt.txt', encryptedText);

    res.sendFile(__dirname + '/fileServerEncrypt.txt');
};

module.exports.decipherFile = (key) => {
    const alg = 'aes-256-cbc';
    key = crypto.createHash('sha256').update(String(key)).digest('base64').substr(0, 32);

    console.log('key: ', key);
    const piv = Buffer.alloc(16, 0);
    const text = fs.readFileSync('./client/fileClientEncrypt.txt', { encoding: 'utf8' });
    const dch = crypto.createDecipheriv(alg, key, piv);
    const decrypted = dch.update(text, 'hex', 'utf8') + dch.final('utf8');
    fs.writeFileSync('./client/file.txt', decrypted);
};
