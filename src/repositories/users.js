'use strict';

const { Op } = require('sequelize');

module.exports = function getUserRepository(sequelize) {
    const { User } = sequelize.models;

    function list() {
        return User.findAll();
    }

    async function remove(id) {
        try {
            return await User.destroy({
                where: { id },
            });
        } catch (error) {
            throw error;
        }
    }

    function selectUserDB(user, model) {
        return model.findOne({ where: { email: { [Op.eq]: user.email } } });
    }

    function insertUserDB(data, model) {
        return model.create(data);
    }

    function exists(id) {
        return User.findOne({where: {id}});
    }

    async function getUser(data) {
        const user = await selectUserDB(data, User);
        if (user) return user.dataValues;

        return null;
    }

    async function createUser(data) {
        const user = await insertUserDB(data, User);
        if (user) return user;

        return null;
    }


    return {
        getUser,
        exists,
        createUser,
        list,
        remove,
    };
};
