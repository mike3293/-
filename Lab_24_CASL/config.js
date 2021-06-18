module.exports = {
    jwt: {
        secret: "secret_code",
        tokens: {
            access: {
                type: "access",
                expiresIn: "10m",
                SameSite: "Strict",
            },
            refresh: {
                type: "refresh",
                expiresIn: "1440m",
                SameSite: "Strict",
            },
        },
    },
    accessOptions: {
        maxAge: 1000 * 60 * 10,
        httpOnly: true,
        SameSite: "Strict",
    },
    refreshOptions: {
        maxAge: 1000 * 60 * 1440,
        httpOnly: true,
        sameSite: "Strict",
        path: "/refresh-token",
    },
    redis: {
        'host': 'redis-14619.c16.us-east-1-2.ec2.cloud.redislabs.com',
        'port': 14619,
        'no_ready_check': true,
        'auth_pass': 'NtI7oSvpZkuBWdLLb9YnaorM6WAP7Bi5',
    },
    db: {
        username: 'java',
        password: 'java',
        database: 'LAB_24',
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
    },
};
