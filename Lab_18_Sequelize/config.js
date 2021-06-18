config = {
    username: 'java',
    password: 'java',
    database: 'NODE_18',
    host: 'localhost',
    dialect: 'mssql',
    logging: false,
    enableArithAbort: true,
    trustServerCertificate: true,
    pool: {
        max: 5,
        min: 0,
        idle: 10000,
    },
};

exports.config = config;
