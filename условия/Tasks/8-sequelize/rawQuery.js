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
        sequelize.query('insert [Table](text) values(:t)',
            {
                replacements: { t: "Test query"},
                type: sequelize.QueryTypes.INSERT
            });

        sequelize.query('SELECT * FROM [Table]')
            .then(rows => {
                rows.forEach(row => {
                    console.log(row)
                });
            })
            .catch(err => {
                console.error(err);
            });
    })
    .catch(err => {
        console.error(err);
    });
