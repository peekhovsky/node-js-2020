import { Op, DatabaseError } from 'sequelize';
import db from '../models';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt-promise';
import ErrorHandler from '../errors/errorHandler.js';
import { validateIds, validateUser } from './util/validationUtil';


dotenv.config();

export default class UserService {
    constructor(userModel, groupModel) {
        this.userModel = userModel;
        this.groupModel = groupModel;
    }

    async findAutoSuggest(loginSubstring, limit) {
        return this.userModel.findAll({
            where: {
                isDeleted: false,
                login: {
                    [Op.substring]: loginSubstring
                }
            },
            order: [
                ['login', 'ASC']
            ],
            include: [{
                model: this.groupModel,
                as: 'groups'
            }],
            limit
        });
    }

    async create(user) {
        await validateUser(user);
        if (!await this.isLoginNameFree(user.login)) {
            throw new ErrorHandler(401, 'Login name is busy');
        }
        return await this.getPasswordHash(user.password)
            .then(hashPassword => this.userModel.create({ ...user, hashPassword }));
    }

    async updateById({ id, login, password, age }) {
        if (login) {
            if (!await this.isLoginNameFree(login)) {
                throw new ErrorHandler(401, 'Login name is busy');
            }
        }
        const hashPassword = password ? await this.getPasswordHash(password) : null;
        return this
            .findById(id)
            .then(user => {
                return validateUser({
                    login: login || user.login,
                    password,
                    age: age || user.age
                });
            })
            .then(user =>
                this.updateUser({
                    id,
                    login: login || user.login,
                    hashPassword: hashPassword || user.hashPassword,
                    age: age || user.age
                })
            );
    }

    async findById(id) {
        return this.userModel
            .findOne({
                where: {
                    id
                }
            })
            .then(user => {
                if (!user) {
                    throw new ErrorHandler(404, 'User is not found.');
                }
                return user.dataValues;
            });
    }

    async removeById(id) {
        return this.userModel
            .findOne({
                where: {
                    id
                }
            })
            .then(user => {
                if (user) {
                    return this.userModel.update({ isDeleted: true, ...user }, {
                        where: {
                            id: user.id
                        }
                    });
                }
                throw new ErrorHandler(404, 'User is not found.');
            });
    }


    async addUserToGroup(id, groupId) {
        await validateIds([id, groupId]);
        return await db.sequelize.transaction(transaction => {
            return this.userModel
                .findOne({ where: { id } }, { transaction })
                .then(user => this.groupModel
                    .findOne({ where: { id: groupId } }, { transaction })
                    .then((group) => user.addGroup(group, { transaction }))
                );
        });
    }

    updateUser(newUser) {
        return this.userModel.update(newUser, {
            where: {
                id: newUser.id
            }
        });
    }

    isLoginNameFree = async login => {
        if (!login) {
            throw new ErrorHandler(404, 'Login name is empty.');
        }
        return this.userModel
            .findOne({
                where: {
                    login
                }
            })
            .then(user => !user);
    };

    getPasswordHash = async newPassword =>
        bcrypt.hash(newPassword, parseInt(process.env.PASSWORD_SALT_SIZE) || 10);
}
