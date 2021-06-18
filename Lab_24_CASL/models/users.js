module.exports = (Sequelize, sequelize) => {
    return sequelize.define(
        'users',
        {
            id: {
                type: Sequelize.INTEGER,
                allowNULL: false,
                primaryKey: true,
                autoIncrement: true,
            },
            username: { type: Sequelize.STRING, allowNULL: false },
            password: { type: Sequelize.STRING, allowNULL: false },
            age: { type: Sequelize.INTEGER },
            role: { type: Sequelize.INTEGER },
        },
        { sequelize, modelName: 'users', tableName: 'users' },
    );
};
