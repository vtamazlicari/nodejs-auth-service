'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('config');
const errors = require('@feathersjs/errors');
const validateEmail = require('../helpers/validators');

module.exports = function createAuthenticationRoute(repository) {
    const router = express.Router();

    async function loginUser(request, response, next) {
        const result = await repository.getUser(request.body);
        if (!result) return next(new errors.NotFound('USER_NOT_FOUND'));
        const token = jwt.sign({ user: result.id }, config.jwtconf.secret, config.jwtconf.time);
        const userData = {
            id: result.id,
            firstName: result.firstName,
            lastName: result.lastName,
            email: result.email,
        };
        return response.status(200).json({ token, userData });
    }

    async function compareData(request, response, next) {
        const user = await repository.getUser(request.body);
        try {
            const compareEmail = await user && request.body.email === user.email;
            if (!compareEmail) return next(new errors.NotFound('USER_NOT_EXIST'));
            const comparePassword = await request.body.password === user.password;
            if (!comparePassword) return next(new errors.NotFound('PASSWORD_COMPARE_FAILED'));
        } catch (error) {
            return next(new errors.GeneralError('UNKNOWN_AUTHENTICATION_ERROR', { error }));
        }
        return next();
    }

    router.route('/')
        .post(validateEmail, compareData, loginUser);
    return router;
};
