'use strict';

const express = require('express');
const errors = require('@feathersjs/errors');

const createIdParamValidator = require('../middlewares/id-param-validator');

module.exports = function createRoute(repository) {
    const router = express.Router();

    const validateId = createIdParamValidator(repository);

    router.route('/')
        .get(list)
        .post(add);

    router.route('/:id')
        .delete(remove);

    router.param('id', validateId);

    async function add(request, response, next) {
        const result = await repository.createUser(request.body);
        if (!result) {
            return next(new errors.GeneralError('USER_NOT_CREATED'));
        }
        const userData = {
            id: result.id,
            firstName: result.firstName,
            lastName: result.lastName,
            email: result.email,
        };
        return response.status(200).json({ userData });
    }

    async function list(request, response, next) {
        const users = await repository.list();
        if (!users) return next(new errors.NotFound('USERS_NOT_FOUND'));
        const responsData = filterPassword(users);

        return response.status(200).json({ responsData });
    }

    function filterPassword(users) {
        return users.map(user => {
            return { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email };
        });
    }

    function remove(request, response, next) {
        repository.remove(request.params.id, request.query)
            .then((result) => {
                response.json({ responsData: 'Delete successful!' });
            })
            .catch(next);
    }

    return router;
};
