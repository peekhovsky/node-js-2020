import { v4 as uuid } from 'uuid';

export default (sequelize, type) =>
    sequelize.define('group', {
        id: {
            type: type.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: uuid()
        },
        name: {
            type: type.STRING,
            allowNull: false
        },
        permissions: {
            type: type.ARRAY(type.ENUM({
                values: ['CREATE', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES']
            })),
            allowNull: false
        }
    }, {});
