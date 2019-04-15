'use strict';

/* eslint-disable global-require */

const config = require('config');

if (config.debug_logger) {
    module.exports = console;
} else {
    const winston = require('winston');
    const appRoot = require('app-root-path');

    const opt = {
        file: {
            level: 'info',
            filename: `${appRoot}/logs/app.log`,
            handleExceptions: true,
            json: true,
            maxsize: 5 * 1024 * 1024, // 5MB
            maxFiles: 5,
            colorize: false,
        },
        console: {
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true,
        },
    };

    const logger = winston.createLogger({
        transports: [
            new winston.transports.File(opt.file),
            new winston.transports.Console(opt.console),
        ],
        exitOnError: false,
    });

    logger.stream = {
        // eslint-disable-next-line no-unused-vars
        write(message, encoding) {
            logger.log('info', message);
        },
    };

    module.exports = logger;
}
