import db from '../models';
import { Op } from 'sequelize';
import { PASSWORD_SALT_SIZE } from '../config/appConfig';
import UserSchema from '../models/userSchema';
import bcrypt from 'bcrypt-promise';
import { ErrorHandler } from '../error.js';

const User = db.users;

export default class UserService {
    static async findAutoSuggest(loginSubstring, limit) {
        return await User.findAll({
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

    static async create(user) {
        await validateUser(user);
        await validateLogin(user.login);
        return await getPasswordHash(user.password)
            .then(hashPassword => User.create({ ...user, hashPassword }));
    }

    static async updateById({ id, login, password, age }) {
        await validateLogin(login);
        const hashPassword = password ? await getPasswordHash(password) : null;
        return UserService
            .findById(id)
            .then(user => {
                console.log('user');
                console.log(user);
                return validateUser({
                    login: login || user.dataValues.login,
                    password,
                    age: age || user.age
                });
            })
            .then(user =>
                updateUser({
                    id,
                    login: login || user.login,
                    hashPassword: hashPassword || user.hashPassword,
                    age: age || user.age
                })
            );
    }

    static async findById(id) {
        return User
            .findOne({
                where: {
                    id
                }
            })
            .then(user => {
                if (!user) {
                    throw new ErrorHandler(404, 'User is not found');
                }
                return user.dataValues;
            });
    }

    static async removeById(id) {
        User
            .destroy({
                where: {
                    id
                }
            })
            .then();
        throw new ErrorHandler(404, 'User is not found');
    }
}


const updateUser = async (newUser) => {
    return User.update(newUser, {
        where: {
            id: newUser.id
        }
    });
};

const getPasswordHash = async newPassword => bcrypt.hash(newPassword, PASSWORD_SALT_SIZE);

const validateUser = async user => {
    const { error } = await UserSchema.validate(user);
    if (error) {
        throw new ErrorHandler(400, error.details);
    }
    return user;
};

const validateLogin = async login => {
    return User
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
