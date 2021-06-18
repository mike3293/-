const config = require('../config');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(config.db);

const users = require('./users')(Sequelize, sequelize);

module.exports = {
    users,
    sequelize,
    Sequelize,
};

sequelize.sync({ force: true })
    .then(() => console.log('Db has been synchronizing successfully'))
    .then(() => {
        return Promise.all([
            users.bulkCreate([{ username: 'admin', password: 'admin' }]),
        ]);
    })
    .catch(err => console.log('Error while synchronizing: ' + err.toString()));
