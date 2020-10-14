import ErrorHandler from '../errors/errorHandler';
import { validateGroup } from './util/validationUtil';

export default class GroupService {
    constructor(groupModel) {
        this.groupModel = groupModel;
    }

    async create(group) {
        await this.validateGroup(group);
        return this.groupModel.create(group);
    }

    async findAll() {
        return this.groupModel.findAll();
    }

    async findById(id) {
        return this.groupModel
            .findOne({
                where: {
                    id
                }
            })
            .then(group => {
                if (!group) {
                    throw new ErrorHandler(404, 'Group is not found.');
                }
                return group.dataValues;
            });
    }

    async updateById({ id, name, permissions }) {
        return this
            .findById(id)
            .then(group => {
                return validateGroup({
                    name: name || group.name,
                    permissions: permissions || group.permissions
                });
            })
            .then(newGroup =>
                this.groupModel.update(newGroup, {
                    where: {
                        id
                    }
                })
            );
    }

    async removeById(id) {
        return this.groupModel
            .destroy({
                where: {
                    id
                }
            });
    }
}

