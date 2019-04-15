'use strict';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { FeathersError } = require('@feathersjs/errors');

const logger = require('./services/winston/logger');

const importModels = require('./models');

const createAuthenticationRoute = require('./routes/authentication');
const createRegistrationRoute = require('./routes/registration');
const createAuthorizationVerifier = require('./middlewares/authorization-verifier');
const createRoute = require('./routes/resources');

module.exports = function getApp(sqlConnection) {
    const app = express();

    importModels(sqlConnection);

    const userRepository = require('./repositories/users')(sqlConnection);

    app.use(
        cors({
            exposedHeaders: ['Content-Disposition', 'Content-Length', 'Content-MD5'],
        }),
    );
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use('/api/v1/login', createAuthenticationRoute(userRepository));
    app.use('/api/v1/register', createRegistrationRoute(userRepository));
    app.use('/api', createAuthorizationVerifier(userRepository).validateUser);
    app.use('/api/v1/users', createRoute(userRepository));

    app.use((err, request, response, next) => {
        let error;
        if (err instanceof FeathersError) {
            error = err.toJSON();
        } else {
            logger.error(err);
            error = err;
            error.code = err.code || 500;
            error.message = err.message || 'UNKNOWN_SERVER_ERROR';
        }
        return response.status(error.code).json(error.message);
    });

    return app;
};
