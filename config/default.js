'use strict';

module.exports = {
    mysql: process.env.MYSQL_URI || 'mysql://localhost:3306/db',
    port: process.env.PORT || 80,
    host: process.env.HOST || '0.0.0.0',
    errorEmails: process.env.ERROR_EMAILS || '',
    debug_logger: process.env.DEBUG_LOGGER || false,
    salt: process.env.SALT || 'salt',

    development: {
        username: process.env.SEQUELIZE_USER || 'root',
        password: process.env.SEQUELIZE_PASSWORD || 'parola',
        database: process.env.SEQUELIZE_DB || 'db',
        host: process.env.SEQUELIZE_HOST || 'localhost',
        dialect: process.env.SEQUELIZE_DIALECT || 'mysql',
    },

    jwtconf: {
        secret: 'supersecret',
        time: {
            expiresIn: 864000, // 10 days exist token
        },
    },
};
