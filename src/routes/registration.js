'use strict';

const express = require('express');
const errors = require('@feathersjs/errors');
const jwt = require('jsonwebtoken');
const config = require('config');
const validateEmail = require('../helpers/validators');


module.exports = function createAuthenticationRoute(repository) {
    const router = express.Router();

    async function registerUser(request, response, next) {
        const result = await repository.createUser(request.body);
        const token = jwt.sign({ user: result.id }, config.jwtconf.secret, config.jwtconf.time);
        if (!result) return next(new errors.GeneralError('USER_NOT_CREATED'));
        const userData = {
            id: result.id,
            firstName: result.firstName,
            lastName: result.lastName,
            email: result.email,
        };
        return response.status(200).json({ userData, token });
    }

    async function compareEmail(request, response, next) {
        const user = await repository.getUser(request.body);
        try {
            if (user) return next(new errors.Conflict('USER_ALREADY_EXISTS'));
        } catch (error) {
            return next(new errors.GeneralError('UNKNOWN_REGISTRATION_ERROR', { error }));
        }
        return next();
    }

    router.route('/')
        .post(validateEmail, compareEmail, registerUser);
    return router;
};
