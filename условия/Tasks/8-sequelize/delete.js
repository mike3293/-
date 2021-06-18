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

let Table = sequelize.define('Table' , {
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
    tableName: 'Table', modelName: 'Table', timestamps: false
});

sequelize.authenticate()
    .then(() => {
        console.log("Connection");
        Table.destroy({where: {id: 1}})
            .then(result => {
                console.log(result)
                result !== 0 ? console.log("Deleted") : console.log("Not deleted")
            })
            .catch(err => {
                console.error(err);
            })
    })
    .catch(err => {
        console.error(err);
    });
