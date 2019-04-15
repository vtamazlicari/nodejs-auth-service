'use strict';

const Sequelize = require('sequelize');

module.exports = function getSQLConnector(uri) {
    return {
        connect, // eslint-disable-line no-use-before-define
    };

    async function connect() {
        const sequelize = await new Sequelize('db', 'root', 'parola', {
            dialect: 'mysql',
            logging: false,
            define: {
                charset: 'utf8mb4',
                timestamps: false
            },
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000,
            },
        });
        return sequelize;
    }
};
