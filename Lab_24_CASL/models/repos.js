module.exports = (Sequelize, sequelize) => {
    return sequelize.define(
        'repos',
        {
            id: {
                type: Sequelize.INTEGER,
                allowNULL: false,
                primaryKey: true,
                autoIncrement: true,
            },
            name: { type: Sequelize.STRING, allowNULL: false },
        },
        { sequelize, modelName: 'repos', tableName: 'repos' },
    );
};
