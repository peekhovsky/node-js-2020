const Joi = require('@hapi/joi');

const UserSchema = Joi.object({
    login: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$')),

    age: Joi.number()
        .integer()
        .min(4)
        .max(130)
        .required()
});

export default UserSchema;
