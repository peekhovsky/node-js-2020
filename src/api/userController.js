import ErrorHandler from '../errors/errorHandler';

export default class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    findAutoSuggest(req, res) {
        const { query } = req;
        const { limit, loginSubstring } = query;
        this.userService
            .findAutoSuggest(loginSubstring, limit)
            .then(users => res.send(users))
            .catch((e) => UserController.handleError(req, res, e));
    }

    create(req, res) {
        const { body } = req;
        this.userService.create(body)
            .then(user => res.send(user))
            .catch(e => UserController.handleError(req, res, e));
    }

    findById(req, res) {
        const { params } = req;
        const { id } = params;
        this.userService.findById(id)
            .then(user => res.send(user))
            .catch(e => UserController.handleError(req, res, e));
    }

    updateById(req, res) {
        const { body } = req;
        this.userService.updateById(body)
            .then((r) => res.send(r))
            .catch((e) => UserController.handleError(req, res, e));
    }

    removeById(req, res) {
        const { body } = req;
        const { id } = body;
        this.userService.removeById(id)
            .then(r => res.send(r))
            .catch(e => UserController.handleError(req, res, e));
    }

    addUserToGroup(req, res) {
        const { body } = req;
        const { id, groupId } = body;
        this.userService.addUserToGroup(id, groupId)
            .then(r => res.send(r))
            .catch(e => UserController.handleError(req, res, e));
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
