import UserSchema from '../../models/userSchema';
import ErrorHandler from '../../errors/errorHandler';
import GroupSchema from '../../models/groupSchema';
import validator from 'validator';

export const validateUser = async user => {
    const { error } = await UserSchema.validate(user);
    if (error) {
        throw new ErrorHandler(400, error.details);
    }
    return user;
};

export const validateGroup = async group => {
    const { error } = await GroupSchema.validate(group);
    if (error) {
        throw new ErrorHandler(400, error.details);
    }
    return group;
};

export const validateIds = async (ids = []) => {
    ids.forEach(id => {
        if (!validator.isUUID(id)) {
            throw new ErrorHandler(401, 'Id is not an UUID instance');
        }
    });
};
