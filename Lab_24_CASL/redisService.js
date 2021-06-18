const redis = require('redis');
const config = require('./config').redis;

client = redis.createClient(config);

module.exports = {
    AddBlackList: (username, jwt) => {
        client = redis.createClient();
        client.get(username, (err, result) => {
            if (result == null) {
                client.set(username, jwt);
            } else {
                client.set(username, result + '|' + jwt);
            }
            client.get(username, async (err, result) => {
                console.log(result.split('|'));
            });
        });
    },
    GetAll: async (username) => {
        return await client.get(username, async (err, result) => {
            return await result.split('|');
        });
    },
    CheckBlackList: async (username, jwt) => {
        return new Promise(function (resolve, reject) {
            client.get(username, (err, result) => {
                if (result == null) {
                    return resolve(true);
                }
                let res = result.split('|');
                console.log(res.indexOf(jwt));
                if (res.indexOf(jwt) === -1) {
                    return resolve(true);
                } else {
                    return resolve(false);
                }
            });
        });
    },
};
