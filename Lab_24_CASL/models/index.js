const config = require('../config');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(config.db);

const users = require('./users')(Sequelize, sequelize);
const repos = require('./repos')(Sequelize, sequelize);
const commits = require('./commits')(Sequelize, sequelize);

users.hasMany(repos, { as: 'repos' });
repos.belongsTo(users);

repos.hasMany(commits, { as: 'commits' });
commits.belongsTo(users);

module.exports = {
    users,
    repos,
    commits,
    sequelize,
    Sequelize,
};
