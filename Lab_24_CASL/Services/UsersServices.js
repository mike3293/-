const Users = require('../models/index').users;
const Role = require('../models/Role');

module.exports = {
    AddUsers: async (json) => {
        return await Users.create({
            username: json['username'],
            password: json['password'],
            age: json['age'],
            role: Role.User,
        });
    },
    FindByUsername: async (json) => {
        return await Users.findAll({
            where: { username: json['username'] },
            raw: true,
        });
    },
    GetAll: async () => {
        return await Users.findAll({
            attributes: ['id', 'username', 'age'],
        });
    },
    GetById: async (id) => {
        return await Users.findByPk(id, {
            attributes: ['id', 'username', 'age'],
        });
    },
};
