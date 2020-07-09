import UserService from '../../services/userService';
const { ErrorHandler } = require('../../error.js');

export default class UserController {
    static findAutoSuggest(req, res) {
        const { query } = req;
        const { limit, loginSubstring } = query;
        UserService
            .findAutoSuggest(loginSubstring, limit)
            .then(users => res.send(users))
            .catch((e) => UserController.handleError(req, res, e));
    }

    static create(req, res) {
        const { body } = req;
        UserService.create(body)
            .then(uuid =>
                res.send({
                    'id': uuid
                })
            )
            .catch(e => UserController.handleError(req, res, e));
    }

    static findById(req, res) {
        const { params } = req;
        const { id } = params;
        UserService.findById(id)
            .then(user => res.send(user))
            .catch(e => UserController.handleError(req, res, e));
    }

    static updateById(req, res) {
        const { body } = req;
        UserService.updateById(body)
            .then(() => res.send())
            .catch((e) => UserController.handleError(req, res, e));
    }

    static removeById(req, res) {
        const { body } = req;
        const { id } = body;
        UserService.removeById(id)
            .then(() => res.send())
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


    //
    // exports.create = (req, res) => {
    //     if (!req.body.login) {
    //         res.status(400).send({
    //             message: 'Content cannot be empty'
    //         });
    //     }
    //
    //     const user = {
    //         login: req.body.login,
    //         hashPassword: req.body.hashPassword,
    //         isDeleted: req.body.isDeleted || false
    //     };
    //
    //     User.create(user)
    //         .then(data => {
    //             res.send(data);
    //         })
    //         .catch(e => {
    //             res.status(500).send({
    //                 message: e.message || 'Error has been occurred during creation of user.'
    //             });
    //         });
    // };
    //
    // exports.findAll = (req, res) => {
    //     const title = req.query.login;
    //     const condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;
    //
    //     User.findAll({ where: condition })
    //         .then(data => {
    //             res.send(data);
    //         })
    //         .catch(e => {
    //             res.status(500).send({
    //                 message: e.message || 'Error has been occurred during users retrieving.'
    //             });
    //         });
    // };
    //
    // exports.findById = (req, res) => {
    //     //
    // };
    //
    // exports.update = (req, res) => {
    //     //
    // };
    //
    // exports.delete = (req, res) => {
    //     //
    // };
    //
    // exports.deleteAll = (req, res) => {
    //     //
    // };
    //
    // exports.findAllIsNotDeleted = (req, res) => {
    //     //
    // };
}
