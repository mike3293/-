const Repos = require('../models/index').repos;
const User = require('../models/index').users;

module.exports = {
    AddRepos: async (json) => {
        return await Repos.create({
            userId: json.userId,
            name: json.name,
        });
    },
    GetAll: async () => {
        return await Repos.findAll({
            attributes: ['id', 'name'],
            include:
                {
                    model: User,
                    attributes: ['id', 'username'],
                },
        });
    },
    GetById: async (id) => {
        return await Repos.findByPk(id, {
            attributes: ['id', 'name', 'userId'],
        });
    },
    UpdateById: async (id, repos) => {
        return await Repos.update(repos, { where: { id } });
    },
    DeleteById: async (id) => {
        return await Repos.destroy({ where: { id } });
    },
};
