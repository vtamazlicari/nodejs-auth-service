'use strict';

const config = require('config');

const sqlConnector = require('./sql-connector')(config.mysql);

// eslint-disable-next-line global-require
module.exports = function connectToDBs() {
    return new Promise((resolve, reject) => {
        sqlConnector.connect()
            .then(sqlConnector => {
            resolve(sqlConnector);
        })
            .catch(error => reject(error));
    });
};
