import ErrorHandler from '../errors/errorHandler';

export default class GroupController {
    constructor(groupService) {
        this.groupService = groupService;
    }

    findAll(req, res) {
        this.groupService
            .findAll()
            .then(users => res.send(users))
            .catch((e) => GroupController.handleError(req, res, e));
    }

    create(req, res) {
        const { body } = req;
        this.groupService.create(body)
            .then(user => res.send(user))
            .catch(e => GroupController.handleError(req, res, e));
    }

    findById(req, res) {
        const { params } = req;
        const { id } = params;
        this.groupService.findById(id)
            .then(user => res.send(user))
            .catch(e => GroupController.handleError(req, res, e));
    }

    updateById(req, res) {
        const { body } = req;
        this.groupService.updateById(body)
            .then(() => res.send())
            .catch((e) => GroupController.handleError(req, res, e));
    }

    removeById(req, res) {
        const { body } = req;
        const { id } = body;
        this.groupService.removeById(id)
            .then(() => res.send())
            .catch(e => GroupController.handleError(req, res, e));
    }

    static handleError(req, res, error) {
        if (error instanceof ErrorHandler) {
            res.status(error.statusCode).send({
                statusCode: error.statusCode,
                message: error.message
            });
        } else {
            console.error(error);
            res.status(500).send({
                statusCode: 500,
                message: 'Internal Server Error'
            });
        }
    }
}
