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

sequelize.authenticate()
    .then(() => {
        console.log("Connection");
    })
    .catch(err => {
        console.error(err);
    });
