import { Op } from 'sequelize';
import dotenv from 'dotenv';
import UserSchema from '../models/userSchema';
import bcrypt from 'bcrypt-promise';
import ErrorHandler from '../errors/errorHandler.js';

dotenv.config();

export default class UserService {
    constructor(userModel) {
        this.userModel = userModel;
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
            limit
        });
    }

    async create(user) {
        await this.validateUser(user);
        await this.validateLogin(user.login);
        return await this.getPasswordHash(user.password)
            .then(hashPassword => this.userModel.create({ ...user, hashPassword }));
    }

    async updateById({ id, login, password, age }) {
        if (login) {
            await this.validateLogin(login);
        }
        const hashPassword = password ? await this.getPasswordHash(password) : null;
        return this
            .findById(id)
            .then(user => {
                return this.validateUser({
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

    updateUser(newUser) {
        return this.userModel.update(newUser, {
            where: {
                id: newUser.id
            }
        });
    }

    validateLogin = async login => {
        if (!login) {
            throw new ErrorHandler(404, 'Login name is empty.');
        }
        return this.userModel
            .findOne({
                where: {
                    login
                }
            })
            .then(user => {
                if (user) {
                    throw new ErrorHandler(404, 'Login name is already taken.');
                }
            });
    };

    validateUser = async user => {
        const { error } = await UserSchema.validate(user);
        if (error) {
            throw new ErrorHandler(400, error.details);
        }
        return user;
    };

    getPasswordHash = async newPassword =>
        bcrypt.hash(newPassword, parseInt(process.env.PASSWORD_SALT_SIZE) || 10);
}
