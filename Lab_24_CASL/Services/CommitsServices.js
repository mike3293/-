const Commits = require('../models/index').commits;
const Repos = require('../models/index').repos;

module.exports = {
    AddCommits: async (id, json) => {
        return await Commits.create({
            repoId: id,
            message: json.name,
        });
    },
    GetAll: async (id) => {
        return await Commits.findAll({
            attributes: ['id', 'message'],
            where: { repoId: id },
        });
    },
    GetById: async (id) => {
        return await Commits.findByPk(id, {
            attributes: ['id', 'message'],
        });
    },
    UpdateById: async (id, commits) => {
        return await Commits.update(commits, { where: { id } });
    },
    DeleteById: async (id) => {
        return await Commits.destroy({ where: { id } });
    },
};
