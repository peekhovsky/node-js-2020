const Joi = require('@hapi/joi');

const PERMISSION_TYPES = ['CREATE', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES'];

const GroupSchema = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    permissions: Joi.array().items(Joi.string().valid(...PERMISSION_TYPES)).required()
});

export default GroupSchema;
