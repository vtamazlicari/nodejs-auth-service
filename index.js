'use strict';

const config = require('config');

const connectToDBs = require('./src/services/connectors/connector-factory');
const logger = require('./src/services/winston/logger');

connectToDBs()
    .then((sqlConnection) => {
        const app = require('./src/app')(sqlConnection); // eslint-disable-line global-require
        const { port, host } = config;

        app.listen(port, host, () => {
            logger.info(`Server started on: ${port}, host: ${host}`);
        });
    })
    .catch(logger.error);
