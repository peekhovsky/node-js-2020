import { Router } from 'express';
import db from '../models';
import GroupController from './groupController';
import GroupService from '../services/groupService';

const router = Router();
const groupService = new GroupService(db.groups);
const groupController = new GroupController(groupService);

router.get('/', (req, res) => groupController.findAll(req, res));

router.post('/', (req, res) => groupController.create(req, res));

router.get('/:id', (req, res) => groupController.findById(req, res));

router.put('/', (req, res) => groupController.updateById(req, res));

router.delete('/', (req, res) => groupController.removeById(req, res));

export default router;
