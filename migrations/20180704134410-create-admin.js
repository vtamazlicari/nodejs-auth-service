'use strict';

module.exports = {
    up(queryInterface, Sequelize) {
        return queryInterface.createTable('user', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            firstName: {
                type: Sequelize.STRING,
                field: 'first_name',
                allowNull: false,
            },
            lastName: {
                type: Sequelize.STRING,
                field: 'last_name',
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },
        });
    },

    // eslint-disable-next-line no-unused-vars
    down(queryInterface, Sequelize) {
        return queryInterface.dropTable('user');
    },
};
