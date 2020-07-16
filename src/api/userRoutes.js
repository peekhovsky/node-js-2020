import UserService from '../services/userService';
import UserController from './userController';
import { Router } from 'express';
import db from '../models';

const router = Router();
const userService = new UserService(db.users, db.groups);
const userController = new UserController(userService);

router.get('/', (req, res) => userController.findAutoSuggest(req, res));

router.get('/:id', (req, res) => userController.findById(req, res));

router.post('/', (req, res) => userController.create(req, res));

router.put('/', (req, res) => userController.updateById(req, res));

router.delete('/', (req, res) => userController.removeById(req, res));

export default router;
