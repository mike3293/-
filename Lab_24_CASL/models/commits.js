module.exports = (Sequelize, sequelize) => {
    return sequelize.define(
        'commits',
        {
            id: {
                type: Sequelize.INTEGER,
                allowNULL: false,
                primaryKey: true,
                autoIncrement: true,
            },
            message: { type: Sequelize.STRING, allowNULL: false },
        },
        { sequelize, modelName: 'commits', tableName: 'commits' },
    );
};
