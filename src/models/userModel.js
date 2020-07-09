import { v4 as uuid } from 'uuid';

export default (sequelize, type) =>
    sequelize.define('user', {
        id: {
            type: type.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: uuid()
        },
        login: {
            type: type.STRING,
            allowNull: false
        },
        hashPassword: {
            type: type.STRING,
            allowNull: false
        },
        age: {
            type: type.INTEGER,
            allowNull: false
        },
        isDeleted: {
            type: type.BOOLEAN,
            defaultValue: false
        }
    }, {});
