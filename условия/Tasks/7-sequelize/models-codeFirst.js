const Sequelize = require("sequelize");
const sequelize = new Sequelize("Exam", "NodeJS", "NodeJS", {
    dialect: "mssql",
    host: "localhost",
    port: "1433",
    pool: {
        max: 10,
        min: 0,
        idle: 10000,
        acquire: 30000
    },
    dialectOptions: {
        options: {
            encrypt: true
        }
    }
});

const Model = Sequelize.Model;

class Table extends Model {
}

Table.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    text: {
        type: Sequelize.STRING,
        allowNull: false
    },
}, {
    sequelize, tableName: 'Table', modelName: 'Table', timestamps: false
});

// sequelize.define('Table' , {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         primaryKey: true
//     },
//     text: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
// }, {
//     tableName: 'Table', modelName: 'Table', timestamps: false
// });

sequelize.sync({force: true})
    .then(() => {
        console.log("Connection");
    })
    .catch(err => {
        console.error(err);
    });
