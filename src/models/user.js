'use strict';

module.exports = function defineUser(sequelize, DataTypes) {
    const User = sequelize.define(
        'User',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            firstName: {
                type: DataTypes.STRING,
                field: 'first_name',
                allowNull: false,
                validate: {
                    len: [1, 50],
                },
            },
            lastName: {
                type: DataTypes.STRING,
                field: 'last_name',
                allowNull: false,
                validate: {
                    len: [1, 50],
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
        },
        {
            tableName: 'user',
            timestamps: false,
        },
    );

    // eslint-disable-next-line no-unused-vars
    User.associate = function associateAdmin(models) {};

    return User;
};
