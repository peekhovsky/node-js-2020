import Sequelize from 'sequelize';
import DB_CONFIG  from '../config/dbConfig';
import UserModel from './userModel';
import GroupModel from './groupModel';

const sequelize = new Sequelize(DB_CONFIG.DB, DB_CONFIG.USER, DB_CONFIG.PASSWORD, {
    host: DB_CONFIG.HOST,
    dialect: DB_CONFIG.dialect,
    operatorsAliases: false,
    port: DB_CONFIG.PORT,
    pool: {
        max: DB_CONFIG.pool.max,
        min: DB_CONFIG.pool.min,
        acquire: DB_CONFIG.pool.acquire,
        idle: DB_CONFIG.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

const userModel = UserModel(sequelize, Sequelize);
const groupModel = GroupModel(sequelize, Sequelize);

userModel.belongsToMany(groupModel, {
    through: 'user_group',
    as: 'groups',
    foreignKey: 'userId',
    otherKey: 'groupId'
});

groupModel.belongsToMany(userModel, {
    onDelete: 'cascade',
    through: 'user_group',
    as: 'users',
    foreignKey: 'groupId',
    otherKey: 'userId'
});

db.users = userModel;
db.groups = groupModel;

export default db;
