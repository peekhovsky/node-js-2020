const express = require('express');
const router = express.Router();
import UserController from '../controllers/userController';

router.get('/', UserController.findAutoSuggest);

router.get('/:id', UserController.findById);

router.post('/', UserController.create);

router.put('/', UserController.updateById);

router.delete('/', UserController.removeById);

module.exports = router;
